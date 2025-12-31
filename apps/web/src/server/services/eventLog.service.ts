import { AppDataSource } from "@brigid/database";
import { EventLogEntity } from "@brigid/database/src/entities/eventLog.entity";
import {
    Between,
    type FindOptionsWhere,
    LessThanOrEqual,
    MoreThanOrEqual,
} from "typeorm";
import type { GetEventLogQuery } from "../schemas/eventLogSchema";

export class EventLogService {
    private readonly repository = AppDataSource.getRepository(EventLogEntity);

    async getLogs(workspaceId: string, query: GetEventLogQuery) {
        const { name, level, startDate, endDate, limit, offset } = query;

        const where: FindOptionsWhere<EventLogEntity> = {
            workspaceId,
        };

        if (name) {
            where.name = name;
        }
        if (level) {
            where.level = level;
        }

        if (startDate && endDate) {
            where.createdAt = Between(new Date(startDate), new Date(endDate));
        } else if (startDate) {
            where.createdAt = MoreThanOrEqual(new Date(startDate));
        } else if (endDate) {
            where.createdAt = LessThanOrEqual(new Date(endDate));
        }

        const [items, total] = await this.repository.findAndCount({
            where,
            order: { createdAt: "DESC" },
            take: limit,
            skip: offset,
        });

        return {
            items,
            total,
            hasNextPage: items.length + offset < total,
        };
    }
}
