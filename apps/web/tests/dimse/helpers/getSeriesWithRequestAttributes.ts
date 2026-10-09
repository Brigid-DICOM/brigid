import { AppDataSource } from "@brigid/database";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import { WORKSPACE_ID } from "../../backend/workspace.const";

export async function getSeriesWithRequestAttributes(
    seriesInstanceUid: string,
): Promise<SeriesEntity | null> {
    return AppDataSource.manager.findOne(SeriesEntity, {
        where: {
            seriesInstanceUid,
            workspaceId: WORKSPACE_ID,
        },
        relations: {
            seriesRequestAttributes: true,
        },
    });
}
