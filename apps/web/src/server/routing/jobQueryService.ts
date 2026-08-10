import { AppDataSource } from "@brigid/database";
import {
    type RoutingJobStatus,
    RoutingJobEntity,
} from "@brigid/database/src/entities/routingJob.entity";
import type { FindOptionsWhere } from "typeorm";
import { Between, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { RoutingJobService } from "./jobService";

export type ListJobsQuery = {
    status?: RoutingJobStatus;
    destinationId?: string;
    ruleId?: string;
    from?: Date;
    to?: Date;
    limit?: number;
    offset?: number;
};

export class RoutingJobQueryService {
    private get repo() {
        return AppDataSource.getRepository(RoutingJobEntity);
    }

    async list(workspaceId: string, query: ListJobsQuery) {
        const where: FindOptionsWhere<RoutingJobEntity> = { workspaceId };

        if (query.status) where.status = query.status;
        if (query.destinationId) where.destinationId = query.destinationId;
        if (query.ruleId) where.ruleId = query.ruleId;

        if (query.from && query.to) {
            where.scheduledAt = Between(query.from, query.to);
        } else if (query.from) {
            where.scheduledAt = MoreThanOrEqual(query.from);
        } else if (query.to) {
            where.scheduledAt = LessThanOrEqual(query.to);
        }

        const limit = query.limit ?? 50;
        const offset = query.offset ?? 0;

        const [items, total] = await this.repo.findAndCount({
            where,
            order: { scheduledAt: "DESC" },
            take: limit,
            skip: offset,
            relations: ["rule", "destination"],
        });

        return { items, total, limit, offset };
    }

    async sendNow(workspaceId: string, jobId: string) {
        return new RoutingJobService().sendNow(jobId, workspaceId);
    }

    async retry(workspaceId: string, jobId: string) {
        return new RoutingJobService().retry(jobId, workspaceId);
    }
}
