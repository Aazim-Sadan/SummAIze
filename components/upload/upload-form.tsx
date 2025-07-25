'use client'

import { useUploadThing } from '@/utils/uploadthing';
import UploadFormInput from './upload-form-input'
import { z } from 'zod';
import { toast } from 'sonner';
import { generatePdfSummary, generatePdfText, storePdfSummaryAction } from '@/actions/upload-actions';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSkeleton from './loading-skeleton';
import { formatFileNameAsTitle } from '@/utils/format-utils';

const schema = z.object({
    file: z
        .instanceof(File, { message: 'Invalid file' })
        .refine(
            (file) => file.size <= 24 * 1024 * 1024, {
            message: 'File size must be less than 20MB'
        })
        .refine(
            (file) => file.type.startsWith('application/pdf'),
            'File must be a PDF')
});

export default function UploadForm() {

    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()


    const { startUpload, routeConfig } = useUploadThing('pdfUploader', {
        onClientUploadComplete: () => {
            console.log("uploaded successfully!");
        },
        onUploadError: (err) => {
            console.log("error occurred while uploading", err);
            toast("error occured while uploading", {
                description: err.message
            })
        },
        onUploadBegin: ({ file }) => {
            console.log("upload has begun for", file);
        },
    });



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const formData = new FormData(e.currentTarget);
            const file = formData.get('file') as File;

            // validating the fields
            const validatedFields = schema.safeParse({ file });
            console.log(validatedFields);


            if (!validatedFields.success) {
                toast("❌ Something went wrong", {
                    description: validatedFields.error.flatten().fieldErrors.file?.
                    [0] ?? 'Invalid file'
                }
                )
                setIsLoading(false);
                return;
            }

            toast('📄 Uploading PDF', {
                description: 'We are uploading your PDF! '
            })


            //upload the file to uploadthing
            const res = await startUpload([file]);
            if (!res) {
                toast('Something went wrong', {
                    description: 'Please use a different file'
                })
                setIsLoading(false);
                return;
            }

            toast('📄 Processing PDF', {
                description: 'Hang tight! Our AI is reading through your document! ✨'
            })

            // parse the pdf using lang chain




 
                let storeResult: any;
                toast('📄 Saving PDF...', {
                    description: 'Hang tight! We are saving your summary! ✨'
                });


                const formattedFileName = formatFileNameAsTitle(file.name);

                const result = await generatePdfText({
                    fileUrl: res[0].serverData.file.url,
                })

                toast('📄 Generating PDF Summary', {
                    description: 'Hang tight! Our AI is reading through your document! ✨'
                })
         
                // const { data = null, message = null } = result || {};

                       //call ai service
                       //parse the pdf using lang chain
                       const summaryResult = await generatePdfSummary({
                        pdfText: result?.data?.pdfText ?? '',
                        fileName: formattedFileName
                    });

                    toast('📄 Saving PDF Summary', {
                        description: 'Hang tight! Our AI is reading through your document! ✨'
                    })
             
                    const { data = null, message = null } = summaryResult || {};

                if (data?.summary) {
                    //save the summary to the database
                    storeResult = await storePdfSummaryAction({
                        summary: data.summary,
                        fileUrl: res[0].serverData.file.url,
                        title: formattedFileName,
                        fileName: file.name
                    })
                    toast('✨ Summary Generated', {
                        description: 'Your PDF is successfully summarized and saved'
                    })

                    formRef.current?.reset();
                    router.push(`/summaries/${storeResult.data.id}`);
            }

            // summarize the pdf using AI

        } catch (error) {
            setIsLoading(false);
            console.log('Error occurred', error);
            formRef.current?.reset();
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='flex flex-col gap-8 w-full max-w-2xl mx-auto '>
            <div className='relative'>
                <div className='absolute inset-0 flex items-center'
                    aria-hidden="true"
                >
                    <div
                        className='w-full border-t border-gray-200 dark:border-gray-800'
                    />
                    <div
                        className='relative flex justify-center'
                    >
                        <span className='bg-background px-3 text-muted-foreground text-sm'>
                            Upload PDF
                        </span>
                    </div>
                </div>
            </div>

            <UploadFormInput isLoading={isLoading} ref={formRef} onSubmit={handleSubmit} />
            {isLoading && (
                <>
                    <div className='relative'>
                        <div
                            className='absolute inset-0 flex items-center'
                            aria-hidden="true"
                        >
                            <div
                                className='w-full border-t border-gray-200 dark:border-gray-800'
                            />
                        </div>
                        <div
                            className='relative flex justify-center'
                        >
                            <span className='bg-background px-3 text-muted-foreground text-sm'>
                                Processing
                            </span>
                        </div>
                    </div>
                    <LoadingSkeleton />
                </>
            )
            }
        </div>
    )
}
