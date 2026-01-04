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

const authSchema = z.object({
    AUTH_CASDOOR_ID: z.string().optional(),
    AUTH_CASDOOR_SECRET: z.string().optional(),
    AUTH_CASDOOR_ISSUER: z.string().optional(),
    // GitHub 配置
    AUTH_GITHUB_ID: z.string().optional(),
    AUTH_GITHUB_SECRET: z.string().optional(),
    // Google 配置
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),
});

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

// #region DIMSE schema

const dimseSchema = z.object({
    // 綁定的主機名稱
    DIMSE_HOSTNAME: z.string().default("0.0.0.0"),
    // 綁定的埠號
    DIMSE_PORT: z.coerce.number().int().min(1).max(65535).default(11112),
    // PDU 長度設定
    DIMSE_MAX_PDU_LEN_RCV: z.coerce.number().int().default(16378),
    DIMSE_MAX_PDU_LEN_SND: z.coerce.number().int().default(16378),
    // 非同步模式設定
    DIMSE_NOT_ASYNC: booleanFromEnv.default(false),
    DIMSE_MAX_OPS_INVOKED: z.coerce.number().int().default(0),
    DIMSE_MAX_OPS_PERFORMED: z.coerce.number().int().default(0),
    // PDV 打包
    DIMSE_NOT_PACK_PDV: booleanFromEnv.default(false),
    // 超時設定 (毫秒)
    DIMSE_CONNECT_TIMEOUT: z.coerce.number().int().default(0),
    DIMSE_REQUEST_TIMEOUT: z.coerce.number().int().default(0),
    DIMSE_ACCEPT_TIMEOUT: z.coerce.number().int().default(0),
    DIMSE_RELEASE_TIMEOUT: z.coerce.number().int().default(0),
    DIMSE_SEND_TIMEOUT: z.coerce.number().int().default(0),
    DIMSE_STORE_TIMEOUT: z.coerce.number().int().default(0),
    DIMSE_RESPONSE_TIMEOUT: z.coerce.number().int().default(0),
    DIMSE_IDLE_TIMEOUT: z.coerce.number().int().default(0),
    // Socket 設定
    DIMSE_SO_CLOSE_DELAY: z.coerce.number().int().default(50),
    DIMSE_SO_SND_BUFFER: z.coerce.number().int().default(0),
    DIMSE_SO_RCV_BUFFER: z.coerce.number().int().default(0),
    DIMSE_TCP_NO_DELAY: booleanFromEnv.default(true)
});

// #endregion

// #region base schema
const baseSchema = z.object({
    // app
    NEXT_PUBLIC_ENABLE_AUTH: booleanFromEnv.default(false),
    NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3119"),
    JWT_SECRET: z.string().min(32).max(255),
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

const envSchemaBase = z.intersection(z.intersection(z.intersection(baseSchema, storageSchema), authSchema), dimseSchema);

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
    Partial<z.infer<typeof authSchema>> &
    Partial<z.infer<typeof dimseSchema>>;

let env: EnvSchema;

try {
    env = envSchema.parse(process.env);
} catch (error) {
    console.error(error);
    process.exit(1);
}

export default env;
