import { AppDataSource } from "@brigid/database";
import { UserEntity } from "@brigid/database/src/entities/user.entity";
import type { Repository } from "typeorm";
import { v5 as uuidV5 } from "uuid";
import { NAMESPACE_FOR_UUID } from "../const/dicom.const";

export class UserService {
    private userRepository: Repository<UserEntity>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }

    async getGuestUser() {
        const GUEST_USER_ID = uuidV5("brigid-guest-user", NAMESPACE_FOR_UUID);

        let user = await this.userRepository.findOne({
            where: {
                id: GUEST_USER_ID
            }
        });

        if (!user) {
            user = await this.userRepository.save({
                id: GUEST_USER_ID,
                name: "Guest User",
                email: "guest@brigid.local",
                emailVerified: new Date().toISOString(),
                image: "/guest-avatar.jpg"
            });
        }

        return user;
    }
}