import { AppDataSource } from "@brigid/database";
import { EventLogEntity } from "@brigid/database/src/entities/eventLog.entity";
import { v7 as uuidV7} from "uuid";
import Transport from "winston-transport";

export class DbTransport extends Transport {
    async log(info: any, callback: () => void) {
        setImmediate(() => {
            this.emit("logged", info);
        });

        if (!AppDataSource.isInitialized) {
            callback();
            return;
        }

        try {
            const { level, message, name, stack, requestId, elapsedTime } = info;

            const eventLog = new EventLogEntity();
            eventLog.id = uuidV7();
            eventLog.level = level;
            eventLog.name = name;
            eventLog.requestId = requestId || undefined;
            eventLog.elapsedTime = Math.round(elapsedTime) || undefined;

            // 如果遇到 error，將 stack 放到 message 中
            // Note: winston.format.errors({ stack: true }) 會將 stack 放在 info.stack
            eventLog.message = stack ? `${message}\n${stack}` : message;

            await AppDataSource.getRepository(EventLogEntity).insert(eventLog);
        } catch(err) {
            console.error("Failed to log event to database", err);
        }

        callback();
    }
}