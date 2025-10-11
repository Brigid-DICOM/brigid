import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import type { Context } from "hono";

export interface WadoResponseHandler {
    canHandle(accept: string): boolean;
    handle(c: Context, args: { instances: InstanceEntity[]; accept: string }): Promise<Response>;
};