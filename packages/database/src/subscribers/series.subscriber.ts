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
        const studyEntityRepository = event.manager.getRepository(StudyEntity);
        await studyEntityRepository.increment(
            {
                studyInstanceUid: event.entity.studyInstanceUid,
                workspaceId: event.entity.workspaceId,
            },
            "numberOfStudyRelatedSeries",
            1,
        );
    }
}