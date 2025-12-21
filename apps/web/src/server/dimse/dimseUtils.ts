import { AppDataSource } from "@brigid/database";
import { DimseConfigEntity } from "@brigid/database/src/entities/dimseConfig.entity";
import type { Attributes } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Attributes";
import { Tag } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Tag";
import type { Association } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/Association";

export async function getContextKey(
    association: Association,
    requestAttr: Attributes,
) {
    const serialNo = await association?.getSerialNo();
    const messageId = await requestAttr?.getInt(Tag.MessageID, -1);

    return `serialNo-${serialNo}:messageId-${messageId}`;
}

export async function getWorkspaceIdFromAssociation(association: Association) {
    const aeTitle = await association.getCalledAET();

    const workspace = await AppDataSource.manager.findOne(DimseConfigEntity, {
        where: {
            aeTitle: aeTitle ?? "",
        },
    });

    return workspace?.workspaceId ?? "";
}
