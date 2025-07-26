"use client";

import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DemoButton() {
    const { signIn, isLoaded } = useSignIn();
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDemoSignIn = async () => {
        if (!isLoaded || isSignedIn) return;

        if (!isLoaded) return;

        console.log("Out Side Try-Catch")
        setLoading(true);

        try {
            const result = await signIn?.create({
                identifier: "demo@myapp.com",
                password: "demomyapp",
            });

            console.log("Inside Try-Catch")

            if (result.status === "complete") {
                router.push("/dashboard");
            } else {
                console.error("Demo sign-in incomplete:", result);
            }
        } catch (err) {
            console.error("Demo sign-in failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDemoSignIn}
            className="text-sm font-medium text-rose-600 animate-pulse hover:text-primary bg-transparent p-0 m-0 border-0 outline-none pr-2  from-rose-200 via-rose-500 to-rose-800 animate-gradient-x"
        >
            {loading ? "Signing In..." : "Demo Sign In"}
        </button>
    );
}
