import path from "node:path";
import { join } from "desm";
import type { DicomTag } from "@brigid/types";
import { describe, expect, it } from "vitest";
import { parseFromFilename } from "@/server/services/dicom/dicomJsonParser";
import { assertStoredInstance } from "./helpers/assertStoredInstance";
import { runDcmsend } from "./helpers/dcmsendRunner";
import { useDimseTestContext } from "./helpers/dimseTestContext";

const FIXTURES_ROOT = path.resolve(
    join(import.meta.url, "../fixtures/forStore"),
);

function getSopInstanceUid(dicomJson: DicomTag): string {
    const uid = dicomJson["00080018"]?.Value?.[0];
    if (typeof uid !== "string" || uid.length === 0) {
        expect.fail("fixture must contain SOP Instance UID (0008,0018)");
    }
    return uid;
}

function itShouldUsingCStoreDicomInstanceWith(
    label: string,
    fixtureRelativePath: string,
): void {
    it(label, async () => {
        const fixturePath = path.join(FIXTURES_ROOT, fixtureRelativePath);
        const dicomJson = await parseFromFilename(fixturePath);
        const sopInstanceUid = getSopInstanceUid(dicomJson);

        const { exitCode, stderr } = runDcmsend(fixturePath);
        expect(exitCode, stderr).toBe(0);

        await assertStoredInstance(sopInstanceUid);
    });
}

describe("C-STORE E2E", () => {
    useDimseTestContext();

    itShouldUsingCStoreDicomInstanceWith(
        "SOP Class: 1.2.840.10008.5.1.4.1.1.1, CR",
        "CR/6154.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "SOP Class: 1.2.840.10008.5.1.4.1.1.1.1, DX",
        "DX/1-1.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "SOP Class: 1.2.840.10008.5.1.4.1.1.2, CT",
        "CT/CT_small.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "SOP Class: 1.2.840.10008.5.1.4.1.1.4, MR",
        "MR/MR_small.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "SOP Class: 1.2.840.10008.5.1.4.1.1.7, US",
        "US/1-001.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "SOP Class: 1.2.840.10008.5.1.4.1.1.104.1, PDF",
        "PDF/pdf.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "SOP Class: 1.2.840.10008.5.1.4.1.1.7, SC",
        "SC/SC_rgb_rle.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "SOP Class: 1.2.840.10008.5.1.4.1.1.2, OT",
        "OT/1-01.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "SOP Class: 1.2.840.10008.5.1.4.1.1.9.1.1, ECG",
        "ECG/waveform_ecg.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "SOP Class: 1.2.840.10008.5.1.4.1.1.12.1, XA",
        "XA/1-1.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "SOP Class: 1.2.840.10008.5.1.4.1.1.3.1, Multi-Frame (US)",
        "MultiFrame/0020.DCM",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "SOP Class: 1.2.840.10008.5.1.4.1.1.91.1, ANN",
        "ANN/instance_6.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "SOP Class: 1.2.840.10008.5.1.4.1.1.481.3, RTSTRUCT",
        "RTSTRUCT/rtss.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "SOP Class: 1.2.840.10008.5.1.4.1.1.66.4, SEG",
        "SEG/liver_1frame.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "SOP Class: 1.2.840.10008.5.1.4.1.1.11.1, GSPS",
        "GSPS/GSPS.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "Transfer Syntax: 1.2.840.10008.1.2.4.91, JPEG 2000",
        "JPEG2000/JPEG2000.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "Transfer Syntax: 1.2.840.10008.1.2.4.51, JPEG Lossless",
        "JPEG-Lossy/JPEG-lossy.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "Transfer Syntax: 1.2.840.10008.1.2.4.50, JPEG Baseline",
        "JPEG-Baseline/SC_jpeg_no_color_transform.dcm",
    );
    itShouldUsingCStoreDicomInstanceWith(
        "Transfer Syntax: 1.2.840.10008.1.2.1, Explicit VR Little Endian",
        "CR/6154.dcm",
    );
});
