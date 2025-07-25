"use server";

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { string } from "zod";

interface PdfSummaryType {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}



export async function generatePdfText({
  fileUrl
}: {
  fileUrl: string;
}) {

  if (!fileUrl) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  try {
    // console.log("PDF'S URL...........", pdfUrl);
    const pdfText = await fetchAndExractPdfText(fileUrl);
    // console.log("PDF'S TEXT...........",pdfText);



    if (!pdfText) {
      return {
        success: false,
        message: "Failed to fetch and extract PDF text",
        data: null,
      };
    }



    return {
      success: true,
      message: "PDF text generated successfully",
      data: {
        pdfText,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch and extract PDF text",
      data: null,
    };
  }
}



export async function generatePdfSummary({
  pdfText,
  fileName,
}: {
  pdfText: string;
  fileName: string;
}) {
  try {
    let summary;
    try {
      summary = await generateSummaryFromGemini(pdfText);
      console.log({ summary });
    } catch (error) {
      if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
        try {
          summary = await generateSummaryFromOpenAI(pdfText);
        } catch (openAIError) {
          console.error(
            "OpenAI API failed after OpenAI qouta exceeded",
            openAIError
          );
          throw new Error(
            "Failed to generate summary with available AI providers"
          );
        }
      }
    }

    if (!summary) {
      return {
        success: false,
        message: "Failed to generate summary",
        data: null,
      };
    }


    return {
      success: true,
      message: "Summary generated successfully",
      data: {
        title: fileName,
        summary,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to generate summary",
      data: null,
    };
  }
}

async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  // sql inserting pdf summary
  try {
    const sql = await getDbConnection();
    const [savedSummary] = await sql`
    INSERT INTO pdf_summaries(
      user_id,
      original_file_url,
      summary_text,
      title,
      file_name
    )VALUES(
      ${userId},
      ${fileUrl},
      ${summary},
      ${title},
      ${fileName}
    ) RETURNING id, summary_text`;

    return savedSummary;
  } catch (error) {
    console.log("Error saving PDF summary", error);
  }
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  // user is logged in and has a userId
  // savePdfSummary

  let savedSummary: any;
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }

    savedSummary = await savePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });

    if (!savedSummary) {
      return {
        success: false,
        message: "Failed to save PDF summary, please try again",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error saving PDF summary",
    };
  }

  // Revalidate our cache
  revalidatePath(`/summaries/${savedSummary.id}`);

  return {
    success: true,
    message: "PDF summary saved successfully",
    data: {
      id: savedSummary.id,
    },
  };
}
