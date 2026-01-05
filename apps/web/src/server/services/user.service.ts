import { AppDataSource } from "@brigid/database";
import { UserEntity } from "@brigid/database/src/entities/user.entity";
import type { Repository } from "typeorm";
import { v5 as uuidV5 } from "uuid";
import { NAMESPACE_FOR_UUID } from "../const/dicom.const";

interface SearchUsersOptions {
    query: string;
    limit?: number;
    page?: number;
    excludeUserIds?: string[];
}

export class UserService {
    private userRepository: Repository<UserEntity>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }

    async getGuestUser() {
        const GUEST_USER_ID = uuidV5("brigid-guest-user", NAMESPACE_FOR_UUID);

        let user = await this.userRepository.findOne({
            where: {
                id: GUEST_USER_ID,
            },
        });

        if (!user) {
            user = await this.userRepository.save({
                id: GUEST_USER_ID,
                name: "Guest User",
                email: "guest@brigid.local",
                emailVerified: new Date().toISOString(),
                image: "/images/guest-avatar.jpg",
            });
        }

        return user;
    }

    async searchUsers({
        query,
        limit = 10,
        page = 1,
        excludeUserIds,
    }: SearchUsersOptions) {
        const offset = (page - 1) * limit;

        const queryBuilder = this.userRepository.createQueryBuilder("user");
        queryBuilder.where(
            "(user.name ILIKE :query OR user.email ILIKE :query)",
            { query: `%${query}%` },
        );

        if (excludeUserIds) {
            queryBuilder.andWhere("user.id NOT IN (:...excludeUserIds)", {
                excludeUserIds,
            });
        }

        const [users, total] = await queryBuilder
            .select(["user.id", "user.name", "user.email", "user.image"])
            .skip(offset)
            .take(limit)
            .getManyAndCount();

        return {
            users,
            pagination: {
                page,
                limit,
                total,
                hasNextPage: offset + limit < total,
            },
        };
    }
}
