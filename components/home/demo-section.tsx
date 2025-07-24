import { Pizza } from "lucide-react";
import { MotionDiv, MotionH3 } from "../common/motion-wrapper";
import { itemVariants } from "@/utils/constants";
import SummaryViewer from "../summaries/summary-viewer";


const DEMO_SUMMARY = `# Quick Overview


• 💡 Learn how to use App Router, Server Actions, and React Suspense for seamless UX.
• 🔧 Understand file-based routing and how to implement layouts and templates.
• 🌐 Improve performance through built-in image and font optimization tools.
⚙️ Build dynamic and static pages with ease using hybrid rendering techniques.

## 📦 What You'll Learn
• ✅ Routing, dynamic routes, and nested layouts
• ✅ Server-side rendering (SSR) and static site generation (SSG)
• ✅ Data fetching using async/await and Server Components
• ✅ API routes and middleware
• ✅ Integrating third-party APIs and authentication
• ✅ Deploying with Vercel and optimizing for performance

## 🧠 Skills You’ll Gain
• 🎯 Deep understanding of modern React and Next.js architecture
• 🛠️ Full-stack development with API handling
• 🧩 Component reusability and layout management
• 📈 SEO strategies and performance tuning

## 🔻 Bottom Line
 🚀 Master Next.js 15 to build fast, scalable, and SEO-friendly web applications with the latest React features and best practices.

## 🔥 Final Thoughts
• This course transforms developers into Next.js experts, enabling them to build production-ready applications with confidence and efficiency.
Take your web development career to the next level with one of the most in-demand frameworks of the modern web.`;




export default function DemoSection() {
    return (
        <section className="relative">
            <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">

                {/* <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 transform-gpu overflow-hidden blur-3xl"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[26.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-20 sm:left-[calc(40%-30rem)] sm:w-[72rem]"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.1%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3% 45.2% 34.5% 27.5% 76.7% 0.1% 64.9% 17.9% 100% 27.6% 76.8% 76.1% 97.7% 74.1% 44.1%)',
                        }}
                    />
                </div> */}

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-gray-100/80 backdrop-blur-xs border border-gray-500/20 mb-4">
                        <Pizza className="w-6 h-6 text-rose-500" />
                    </div>

                    <div className="text-center mb-16">
                        <MotionH3
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className=" font-bold text-3xl max-w-2xl mx-auto px-4 sm:px-6">
                            Watch how SummAIze transforms <span className="bg-linear-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">this Next.js course PDF</span> into an easy-to-read summary!
                        </MotionH3>
                    </div>

                </div>
                <div className="flex justify-center items-center px-2 sm:px-4 lg:px-6">
                    <MotionDiv
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        variants={itemVariants}
                    >
                        <SummaryViewer summary={DEMO_SUMMARY} />
                    </MotionDiv>
                </div>

            </div>
        </section>
    )
}
