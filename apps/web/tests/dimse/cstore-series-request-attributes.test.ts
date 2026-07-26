import path from "node:path";
import { AppDataSource } from "@brigid/database";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import { SeriesRequestAttributesEntity } from "@brigid/database/src/entities/seriesRequestAttributes.entity";
import type { DicomTag } from "@brigid/types";
import { join } from "desm";
import { describe, expect, it } from "vitest";
import { parseFromFilename } from "@/server/services/dicom/dicomJsonParser";
import { WORKSPACE_ID } from "../backend/workspace.const";
import { assertStoredInstance } from "./helpers/assertStoredInstance";
import { runDcmsend } from "./helpers/dcmsendRunner";
import { getSeriesWithRequestAttributes } from "./helpers/getSeriesWithRequestAttributes";

const FIXTURES_ROOT = path.resolve(
    join(import.meta.url, "../fixtures/dicomFiles"),
);

const INITIAL_LOCAL_NAMESPACE_ENTITY_ID = "local-entity-v1";
const UPDATED_LOCAL_NAMESPACE_ENTITY_ID = "local-entity-v2";

function getUid(dicomJson: DicomTag, tag: string, label: string): string {
    const uid = dicomJson[tag]?.Value?.[0];
    if (typeof uid !== "string" || uid.length === 0) {
        expect.fail(`fixture must contain ${label} (${tag})`);
    }
    return uid;
}

function expectDcmsendSuccess(stderr: string): void {
    expect(stderr).toContain("with status SUCCESS  : 1");
}

async function expectIngestStructureCounts(): Promise<void> {
    expect(
        await AppDataSource.manager.count(SeriesEntity, {
            where: { workspaceId: WORKSPACE_ID },
        }),
    ).toBe(1);
    expect(await AppDataSource.manager.count(SeriesRequestAttributesEntity)).toBe(
        1,
    );
    expect(
        await AppDataSource.manager.count(InstanceEntity, {
            where: { workspaceId: WORKSPACE_ID },
        }),
    ).toBe(1);
}

describe("C-STORE series request attributes", () => {
    it("updates series_request_attributes when the same instance is resent with modified RequestAttributesSequence", async () => {
        const initialFixturePath = path.join(FIXTURES_ROOT, "1-01-mod-vo");
        const updatedFixturePath = path.join(
            FIXTURES_ROOT,
            "1-01-mod-vo-updated",
        );
        const initialDicomJson = await parseFromFilename(initialFixturePath);
        const updatedDicomJson = await parseFromFilename(updatedFixturePath);
        const sopInstanceUid = getUid(
            initialDicomJson,
            "00080018",
            "SOP Instance UID",
        );
        const seriesInstanceUid = getUid(
            initialDicomJson,
            "0020000E",
            "Series Instance UID",
        );

        expect(
            getUid(updatedDicomJson, "00080018", "SOP Instance UID"),
        ).toBe(sopInstanceUid);

        const firstSend = await runDcmsend(initialFixturePath);
        expectDcmsendSuccess(firstSend.stderr);
        await assertStoredInstance(sopInstanceUid);

        const seriesAfterFirstSend =
            await getSeriesWithRequestAttributes(seriesInstanceUid);
        if (!seriesAfterFirstSend?.seriesRequestAttributes) {
            expect.fail("series request attributes not found after first C-STORE");
        }

        expect(
            seriesAfterFirstSend.seriesRequestAttributes
                .accLocalNamespaceEntityId,
        ).toBe(INITIAL_LOCAL_NAMESPACE_ENTITY_ID);

        const firstSeriesRequestAttributesId =
            seriesAfterFirstSend.seriesRequestAttributesId;
        expect(firstSeriesRequestAttributesId).toBeTruthy();

        await expectIngestStructureCounts();

        const secondSend = await runDcmsend(updatedFixturePath);
        expectDcmsendSuccess(secondSend.stderr);
        await assertStoredInstance(sopInstanceUid);

        const seriesAfterSecondSend =
            await getSeriesWithRequestAttributes(seriesInstanceUid);
        if (!seriesAfterSecondSend?.seriesRequestAttributes) {
            expect.fail(
                "series request attributes not found after second C-STORE",
            );
        }

        expect(
            seriesAfterSecondSend.seriesRequestAttributes
                .accLocalNamespaceEntityId,
        ).toBe(UPDATED_LOCAL_NAMESPACE_ENTITY_ID);
        expect(seriesAfterSecondSend.seriesRequestAttributesId).toBe(
            firstSeriesRequestAttributesId,
        );

        await expectIngestStructureCounts();
    });
});
