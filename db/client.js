import { createClient } from "@libsql/client";
import { configDotenv } from "dotenv";
configDotenv();

export const turso = createClient({
    url: process.env.TURSO_DATABASE_URL ?? "",
    authToken: process.env.TURSO_DATABASE_TOKEN ?? ""
});