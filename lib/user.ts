import { pricingPlans } from "@/utils/constants";
import { getDbConnection } from "./db";
import { getUserUploadCount } from "./summaries";
import { User } from "@clerk/nextjs/server";

export async function getPriceIdForActive(email: string) {
    const sql = await getDbConnection();

    const query = await sql`SELECT price_id FROM users where email = ${email} AND status = 'active'`;

    return query?.[0]?.price_id || null;
}

export async function hasReachedUploadLimit(userId: string) {
    const uploadCount = await getUserUploadCount(userId);

    const priceId = await getPriceIdForActive(userId);

    const isPro = pricingPlans.find((plan) => plan.priceId === priceId)?.id === 'pro';

    const uploadLimit: number = isPro ? 1000 : 5;

    return { hasReachedLimit: uploadCount >= uploadLimit, uploadLimit }
}

export async function getSubscriptionStatus(user: User) {

    const hasSubscription = await getPriceIdForActive(user.emailAddresses[0].emailAddress)

    return hasSubscription 
}