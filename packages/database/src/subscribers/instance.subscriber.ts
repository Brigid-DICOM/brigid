import {
    type EntitySubscriberInterface,
    EventSubscriber,
    type InsertEvent,
} from "typeorm";
import type { InstanceEntity } from "../entities/instance.entity";
import { SeriesEntity } from "../entities/series.entity";
import { StudyEntity } from "../entities/study.entity";

@EventSubscriber()
export class InstanceSubscriber
    implements EntitySubscriberInterface<InstanceEntity>
{
    async afterInsert(event: InsertEvent<InstanceEntity>): Promise<void> {
        const studyEntityRepository = event.manager.getRepository(StudyEntity);

        await studyEntityRepository.increment(
            {
                studyInstanceUid: event.entity.studyInstanceUid,
                workspaceId: event.entity.workspaceId,
            },
            "numberOfStudyRelatedInstances",
            1,
        );

        const seriesEntityRepository = event.manager.getRepository(SeriesEntity);

        await seriesEntityRepository.increment(
            {
                seriesInstanceUid: event.entity.seriesInstanceUid,
                workspaceId: event.entity.workspaceId,
            },
            "numberOfSeriesRelatedInstances",
            1,
        );
    }
}
