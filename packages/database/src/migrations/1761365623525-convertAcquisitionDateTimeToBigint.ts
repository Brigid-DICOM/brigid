import { type MigrationInterface, type QueryRunner, TableColumn } from "typeorm";
import { isPostgres, isSqlite } from "./helper";

export class ConvertAcquisitionDateTimeToBigint1761365623525 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: 添加一個新的 bigint 欄位
        await queryRunner.addColumn("instance", new TableColumn({
            name: "acquisitionDateTime_temp",
            type: "bigint",
            isNullable: true,
            comment: "0008,0030"
        }));

        // Step 2: 將現有的 timestamp 數據轉換為 milliseconds 並複製到新欄位
        if(isPostgres(queryRunner)) {
            // https://www.commandprompt.com/education/how-to-get-the-unix-timestamp-in-postgresql/
            // 返回秒數，乘以 1000 轉換為毫秒
            await queryRunner.query(`
                UPDATE instance
                SET "acquisitionDateTime_temp" = CAST(EXTRACT(EPOCH FROM "acquisitionDateTime") * 1000 AS BIGINT)
                WHERE "acquisitionDateTime" IS NOT NULL;
            `);
        } else if (isSqlite(queryRunner)) {
            // https://www.sqlitetutorial.net/sqlite-date-functions/sqlite-strftime-function/
            // 返回秒數，乘以 1000 轉換為毫秒
            await queryRunner.query(`
                UPDATE instance
                SET "acquisitionDateTime_temp" = CAST((strftime('%s', "acquisitionDateTime") * 1000) AS INTEGER)
                WHERE "acquisitionDateTime" IS NOT NULL;
            `);
        }

         // Step 3: 刪除舊的 timestamp 欄位
         await queryRunner.dropColumn("instance", "acquisitionDateTime");

         // Step 4: 重新命名新欄位為原名稱
         await queryRunner.renameColumn("instance", "acquisitionDateTime_temp", "acquisitionDateTime");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Step 1: 添加一個新的 timestamp 欄位
        await queryRunner.addColumn("instance", new TableColumn({
            name: "acquisitionDateTime_temp",
            type: "timestamp",
            isNullable: true,
            comment: "0008,0030"
        }));

        // Step 2: 將 bigint (milliseconds) 轉換回 timestamp
        if (isPostgres(queryRunner)) {
            // PostgreSQL: to_timestamp(milliseconds / 1000.0)
            await queryRunner.query(`
                UPDATE instance 
                SET "acquisitionDateTime_temp" = to_timestamp("acquisitionDateTime" / 1000.0)
                WHERE "acquisitionDateTime" IS NOT NULL
            `);
        } else if (isSqlite(queryRunner)) {
            // SQLite: datetime(milliseconds / 1000, 'unixepoch')
            await queryRunner.query(`
                UPDATE instance 
                SET "acquisitionDateTime_temp" = datetime("acquisitionDateTime" / 1000, 'unixepoch')
                WHERE acquisitionDateTime IS NOT NULL
            `);
        }

        // Step 3: 刪除舊的 bigint 欄位
        await queryRunner.dropColumn("instance", "acquisitionDateTime");

        // Step 4: 重新命名新欄位為原名稱
        await queryRunner.renameColumn("instance", "acquisitionDateTime_temp", "acquisitionDateTime");
    }

}
