import { pricingPlans } from "@/utils/constants";
import { getDbConnection } from "./db";
import { getUserUploadCount } from "./summaries";
import { User } from "@clerk/nextjs/server";

export async function getPriceIdForActive(email: string) {
    const sql = await getDbConnection();

    const query = await sql`SELECT price_id FROM users where email = ${email} AND status = 'active'`;

    return query?.[0]?.price_id || null;
}


export async function hasActivePlan(email: string) {
    const sql = await getDbConnection();

    const query = await sql`SELECT price_id, status FROM users where email = ${email.toLowerCase()} AND status = 'active' AND price_id IS NOT NULL`;

    console.log("Email:", email);
    console.log("Query result:", query);
    console.log("Returning:", query && query.length > 0);
    

    return query && query.length > 0;
}



export async function hasReachedUploadLimit(user: User) {
    const userId = user.id;
    const email = user.emailAddresses[0].emailAddress.toLowerCase();

    const uploadCount = await getUserUploadCount(userId);

    const priceId = await getPriceIdForActive(email);

    const isPro = pricingPlans.find((plan) => plan.priceId === priceId)?.id === 'pro';

    const uploadLimit: number = isPro ? 1000 : 5;

    return { hasReachedLimit: uploadCount >= uploadLimit, uploadLimit }
}

export async function getSubscriptionStatus(user: User) {

    const hasSubscription = await hasActivePlan(user.emailAddresses[0].emailAddress)

    return hasSubscription
}
