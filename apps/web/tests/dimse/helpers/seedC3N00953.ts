import path from "node:path";
import { join } from "desm";
import { AppDataSource } from "@brigid/database";
import { DimseAllowedRemoteEntity } from "@brigid/database/src/entities/dimseAllowedRemote.entity";
import { DimseConfigEntity } from "@brigid/database/src/entities/dimseConfig.entity";
import testData from "../../fixtures/dicomFiles/data.json";
import { runDcmsend, type DcmsendResult } from "./dcmsendRunner";
import { getMoveDestinationAeTitle } from "./movescuRunner";

export const C3N_00953_STUDY_UID =
    "1.3.6.1.4.1.14519.5.2.1.7085.2626.192997540292073877946622133586";

export const C3N_00953_SERIES_ABD_ROUTINE_UID =
    "1.3.6.1.4.1.14519.5.2.1.7085.2626.187580115709014280730997641712";

export const C3N_00953_SERIES_TOPOGRAM_UID =
    "1.3.6.1.4.1.14519.5.2.1.7085.2626.831285735928731782652048570955";

export const C3N_00953_TOPOGRAM_SOP_INSTANCE_UID =
    "1.3.6.1.4.1.14519.5.2.1.7085.2626.310894536700672302243471156028";

const FIXTURES_ROOT = path.resolve(
    join(import.meta.url, "../../fixtures/dicomFiles"),
);

interface DataJsonInstance {
    sopInstanceUid: string;
    file: string;
}

interface DataJsonSeries {
    seriesInstanceUid: string;
    instances: DataJsonInstance[];
}

interface DataJsonStudy {
    patientId: string;
    series: DataJsonSeries[];
}

function expectDcmsendSuccess(result: DcmsendResult): void {
    if (!result.stderr.includes("with status SUCCESS  : 1")) {
        throw new Error(
            `dcmsend failed (exit ${result.exitCode}): ${result.stderr}`,
        );
    }
}

export function getC3N00953SopInstanceUids(): string[] {
    const study = (testData as Record<string, DataJsonStudy>)[C3N_00953_STUDY_UID];
    if (!study) {
        throw new Error(`data.json is missing study ${C3N_00953_STUDY_UID}`);
    }

    return study.series
        .flatMap((series) => series.instances.map((instance) => instance.sopInstanceUid))
        .sort((left, right) => left.localeCompare(right));
}

export function getC3N00953SeriesSopInstanceUids(
    seriesInstanceUid: string,
): string[] {
    const study = (testData as Record<string, DataJsonStudy>)[C3N_00953_STUDY_UID];
    if (!study) {
        throw new Error(`data.json is missing study ${C3N_00953_STUDY_UID}`);
    }

    const series = study.series.find(
        (entry) => entry.seriesInstanceUid === seriesInstanceUid,
    );
    if (!series) {
        throw new Error(`data.json is missing series ${seriesInstanceUid}`);
    }

    return series.instances
        .map((instance) => instance.sopInstanceUid)
        .sort((left, right) => left.localeCompare(right));
}

export async function seedC3N00953FromDataJson(): Promise<void> {
    const study = (testData as Record<string, DataJsonStudy>)[C3N_00953_STUDY_UID];
    if (!study) {
        throw new Error(`data.json is missing study ${C3N_00953_STUDY_UID}`);
    }

    for (const series of study.series) {
        for (const instance of series.instances) {
            const fixturePath = path.join(
                FIXTURES_ROOT,
                instance.file.replace(/\\/g, path.sep),
            );
            const result = await runDcmsend(fixturePath);
            expectDcmsendSuccess(result);
        }
    }
}

export async function seedMoveDestinationAllowedRemote(
    port: number,
    host = "127.0.0.1",
): Promise<void> {
    const aeTitle = process.env.TEST_DIMSE_AE_TITLE ?? "BRIGID_TEST";
    const moveDestAeTitle = getMoveDestinationAeTitle();

    const dimseConfig = await AppDataSource.manager.findOne(DimseConfigEntity, {
        where: { aeTitle },
    });
    if (!dimseConfig) {
        throw new Error(`DimseConfig not found for AE title ${aeTitle}`);
    }

    const existing = await AppDataSource.manager.find(DimseAllowedRemoteEntity, {
        where: {
            dimseConfigId: dimseConfig.id,
            aeTitle: moveDestAeTitle,
        },
    });
    if (existing.length > 0) {
        await AppDataSource.manager.remove(existing);
    }

    await AppDataSource.manager.save(DimseAllowedRemoteEntity, {
        dimseConfigId: dimseConfig.id,
        aeTitle: moveDestAeTitle,
        host,
        port,
        description: "C-MOVE E2E storescp destination",
    });
}
