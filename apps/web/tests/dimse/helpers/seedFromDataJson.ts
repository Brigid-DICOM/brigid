import path from "node:path";
import { join } from "desm";
import testData from "../../fixtures/dicomFiles/data.json";
import { type DcmsendResult, runDcmsend } from "./dcmsendRunner";

const FIXTURES_ROOT = path.resolve(
    join(import.meta.url, "../../fixtures/dicomFiles"),
);

interface DataJsonInstance {
    file: string;
}

interface DataJsonSeries {
    instances: DataJsonInstance[];
}

interface DataJsonSeriesWithInstances extends DataJsonSeries {
    seriesInstanceUid?: string;
}

interface DataJsonStudy {
    series: DataJsonSeriesWithInstances[];
}

function expectDcmsendSuccess(result: DcmsendResult): void {
    if (!result.stderr.includes("with status SUCCESS  : 1")) {
        throw new Error(
            `dcmsend failed (exit ${result.exitCode}): ${result.stderr}`,
        );
    }
}

export async function seedOneInstancePerStudyFromDataJson(): Promise<void> {
    for (const study of Object.values(
        testData as Record<string, DataJsonStudy>,
    )) {
        const instanceFile = study.series[0]?.instances[0]?.file;
        if (!instanceFile) {
            throw new Error(
                "data.json study is missing series[0].instances[0]",
            );
        }

        const fixturePath = path.join(
            FIXTURES_ROOT,
            instanceFile.replace(/\\/g, path.sep),
        );
        const result = await runDcmsend(fixturePath);
        expectDcmsendSuccess(result);
    }
}

export async function seedAllSeriesFromDataJson(): Promise<void> {
    for (const study of Object.values(
        testData as Record<string, DataJsonStudy>,
    )) {
        for (const series of study.series) {
            const instanceFile = series.instances[0]?.file;
            if (!instanceFile) {
                throw new Error("data.json series is missing instances[0]");
            }

            const fixturePath = path.join(
                FIXTURES_ROOT,
                instanceFile.replace(/\\/g, path.sep),
            );
            const result = await runDcmsend(fixturePath);
            expectDcmsendSuccess(result);
        }
    }
}

export async function seedAllInstancesFromDataJson(): Promise<void> {
    for (const study of Object.values(
        testData as Record<string, DataJsonStudy>,
    )) {
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
}
