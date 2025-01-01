import "dotenv/config";
import { z } from "zod";

const envShema = z.object({
    NODE_ENV: z.enum(["dev", "production", "test"]).default("dev"),
    PORT: z.coerce.number().default(3000),
    JWT_PUBLIC_KEY: z.string(),
    JWT_PRIVATE_KEY: z.string(),
    DATABASE_URL: z.string()
});

const _env = envShema.safeParse(process.env);

if (_env.success === false) {
    console.error("Invalid environment variables.", _env.error.format());

    throw new Error("Invalid enviroment variables.");
}

export const env = _env.data;
