import UpgradeRequired from "@/components/common/upgrade-required";
import { getSubscriptionStatus, hasActivePlan } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({ children }: { children: React.ReactNode }) {

    const user = await currentUser();

    if (!user) {
        redirect('/sign-in')
    }

    const hasActiveSubscription = await hasActivePlan(user.emailAddresses[0].emailAddress.toLowerCase());


    console.log("Subscription status", hasActiveSubscription)


    // TODO
    if (!hasActiveSubscription) {
        return <UpgradeRequired />
    }

    return <>{children}</>
}