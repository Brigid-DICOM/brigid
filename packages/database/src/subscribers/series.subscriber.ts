import type { DicomTag } from "@brigid/types";
import {
    type EntitySubscriberInterface,
    EventSubscriber,
    type InsertEvent,
} from "typeorm";
import { SeriesEntity } from "../entities/series.entity";
import { StudyEntity } from "../entities/study.entity";

@EventSubscriber()
export class SeriesSubscriber
    implements EntitySubscriberInterface<SeriesEntity>
{
    listenTo() {
        return SeriesEntity;
    }

    async afterInsert(event: InsertEvent<SeriesEntity>): Promise<void> {
        await event.manager.increment(
            StudyEntity,
            {
                studyInstanceUid: event.entity.studyInstanceUid,
                workspaceId: event.entity.workspaceId,
            },
            "numberOfStudyRelatedSeries",
            1,
        );

        if (event.entity.modality) {
            const parentStudy = await event.manager
                .createQueryBuilder(StudyEntity, "study")
                .where("study.studyInstanceUid = :studyInstanceUid", {
                    studyInstanceUid: event.entity.studyInstanceUid,
                })
                .andWhere("study.workspaceId = :workspaceId", {
                    workspaceId: event.entity.workspaceId,
                })
                .getOne();

            if (parentStudy) {
                const parentStudyJson = JSON.parse(
                    parentStudy.json ?? "{}",
                ) as DicomTag;
                if (!("00080061" in parentStudyJson)) {
                    parentStudyJson["00080061"] = {
                        vr: "CS",
                        Value: [],
                    };
                }

                const modalitiesArray = parentStudyJson["00080061"].Value as string[];
                if (!modalitiesArray.includes(event.entity.modality)) {
                    modalitiesArray.push(event.entity.modality);
                }

                await event.manager.update(
                    StudyEntity,
                    {
                        id: parentStudy.id,
                    },
                    {
                        json: JSON.stringify(parentStudyJson),
                    },
                );
            }
        }
    }
}
