import { existsSync } from "node:fs";
import path from "node:path";
import { AppDataSource } from "@brigid/database";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { expect } from "vitest";
import { WORKSPACE_ID } from "../../backend/workspace.const";
import { getStorageLocalDir } from "./storage";

export async function assertStoredInstance(
    sopInstanceUid: string,
): Promise<InstanceEntity> {
    const instance = await AppDataSource.manager.findOne(InstanceEntity, {
        where: { sopInstanceUid, workspaceId: WORKSPACE_ID },
    });

    expect(instance).not.toBeNull();
    if (!instance) {
        return expect.fail("Instance not found in database");
    }

    const absolutePath = path.join(getStorageLocalDir(), instance.instancePath);
    expect(existsSync(absolutePath)).toBe(true);

    return instance;
}
