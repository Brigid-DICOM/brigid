import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const booleanFromEnv = z.preprocess((val) => {
    if (typeof val === "string") {
        const s = val.trim().toLowerCase();
        if (["1", "true", "yes", "y", "on"].includes(s)) return true;
        if (["0", "false", "no", "n", "off", ""].includes(s)) return false;
    }
    return val;
}, z.boolean());

// #region Auth Schema

const authCasdoorSchema = z.object({
    AUTH_PROVIDER: z.literal("casdoor"),
    AUTH_CASDOOR_ID: z.string(),
    AUTH_CASDOOR_SECRET: z.string(),
    AUTH_CASDOOR_ISSUER: z.string()
});

const authSchema = z.discriminatedUnion("AUTH_PROVIDER", [authCasdoorSchema]);

// #endregion

// #region Storage Schemas

const storageS3Schema = z.object({
    STORAGE_PROVIDER: z.literal("s3"),
    S3_ENDPOINT: z.string(),
    S3_BUCKET: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string()
});

const storageLocalSchema = z.object({
    STORAGE_PROVIDER: z.literal("local"),
    STORAGE_LOCAL_DIR: z.string()
});

const storageSchema = z.discriminatedUnion("STORAGE_PROVIDER", [
    storageS3Schema,
    storageLocalSchema
]);

// #endregion

// #region base schema
const baseSchema = z.object({
    // app
    NEXT_PUBLIC_ENABLE_AUTH: booleanFromEnv.default(false),
    NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3119"),
    IS_LOCAL_APP: booleanFromEnv.default(false),
    // auth
    NEXTAUTH_SECRET: z.string().min(32).max(255),
    NEXTAUTH_URL: z.string().default("http://localhost:3119"),
    // database
    TYPEORM_CONNECTION: z.string(),
    // dicom
    DICOM_STORAGE_FILEPATH: z.string().optional().default("/dicom/{workspaceId}/{0020000D,hash}/{0020000E,hash}/{00080018,hash}.dcm")
    .refine(
        (val) => 
            (val.includes("{0020000D}") || val.includes("{0020000D,hash}")) && 
            (val.includes("{0020000E}") || val.includes("{0020000E,hash}")) && 
            (val.includes("{00080018}") || val.includes("{00080018,hash}")) &&
            (val.includes("{workspaceId}")) || (val.includes("{workspaceId,hash}")),
        {
            message: "DICOM_STORAGE_FILEPATH must contain 0020000D, 0020000E, and 00080018"
        }
    ),
    // cleanup
    DICOM_RECYCLE_BIN_RETENTION_DAYS: z.coerce.number().int().min(1).max(365).default(90),
    DICOM_CLEANUP_RETENTION_DAYS: z.coerce.number().int().min(1).max(365).default(30),
    DICOM_CLEANUP_INTERVAL_HOURS: z.coerce.number().int().min(1).max(168).default(24),
    // query
    QUERY_MAX_LIMIT: z.coerce.number().int().min(1).max(1000).default(100)
});

const envSchemaBase = z.intersection(baseSchema, storageSchema);

const envSchema = envSchemaBase.superRefine((data, ctx) => {
    if (data.NEXT_PUBLIC_ENABLE_AUTH) {
        const result = authSchema.safeParse(data);
        if (!result.success) {
            for (const issue of result.error.issues) {
                ctx.addIssue(issue as any);
            }
        }
    }
});

type EnvSchema = z.infer<typeof baseSchema> &
    z.infer<typeof storageSchema> &
    Partial<z.infer<typeof authSchema>>;

let env: EnvSchema;

try {
    env = envSchema.parse(process.env);
} catch (error) {
    console.error(error);
    process.exit(1);
}

export default env;
