import { getDbConnection } from "./db";

export async function getPriceIdForActive(email: string) {
    const sql = await getDbConnection();

    const query = await sql`SELECT price_id FROM users where email = ${email} AND status = 'active'`;

    return query?.[0]?.price_id || null;
}