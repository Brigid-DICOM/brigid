import type { DicomElement, SopInstanceReference } from "@brigid/types";

interface AddSuccessSopInstanceParams {
    studyInstanceUid: string;
    seriesInstanceUid: string;
    sopInstanceUid: string;
    sopClassUid: string;
}

type FailedSopSequenceElement = SopInstanceReference & {
    "00081197": DicomElement;
};

type OtherFailureReason = {
    "00081197": { vr: "US"; Value?: string[] };
};

interface AddFailedSopInstanceParams {
    sopInstanceUid?: string;
    sopClassUid?: string;
    failureCode: string;
}

export class StowRsResponseMessage {
    private message;
    private workspaceId: string;

    constructor(workspaceId: string) {
        this.workspaceId = workspaceId;
        this.message = {
            /**
             * Retrieve URL
             */
            "00081190": {
                vr: "UR",
                Value: [] as string[],
            },
            /**
             * Failed SOP Sequence
             */
            "00081198": {
                vr: "SQ",
                Value: [] as FailedSopSequenceElement[],
            },
            /**
             * Referenced SOP Sequence
             *
             * A Sequence of Items where each Item references a single SOP Instance that was successfully stored.
             */
            "00081199": {
                vr: "SQ",
                Value: [] as SopInstanceReference[],
            },
            "0008119A": {
                vr: "SQ",
                Value: [] as OtherFailureReason[],
            },
        };
    }

    getMessage() {
        return this.message;
    }

    addSuccessSopInstance({
        studyInstanceUid,
        seriesInstanceUid,
        sopInstanceUid,
        sopClassUid,
    }: AddSuccessSopInstanceParams) {
        const studyUrl =
            `/workspaces/${this.workspaceId}` + `/studies/${studyInstanceUid}`;
        if (!this.message["00081190"].Value.includes(studyUrl)) {
            this.message["00081190"].Value.push(studyUrl);
        }

        const sopInstanceReference = this.getSopInstanceReference({
            sopInstanceUid,
            sopClassUid,
        });

        this.message["00081199"].Value.push({
            ...sopInstanceReference,
            "00081190": {
                vr: "UR",
                Value: [
                    `/workspaces/${this.workspaceId}` +
                        `/studies/${studyInstanceUid}` +
                        `/series/${seriesInstanceUid}` +
                        `/instances/${sopInstanceUid}`,
                ],
            },
        });
    }

    addFailedSopInstance({
        sopInstanceUid,
        sopClassUid,
        failureCode,
    }: AddFailedSopInstanceParams) {
        const failedSopInstance = {
            "00081150": {
                vr: "UI",
                Value: [sopClassUid],
            },
            "00081155": {
                vr: "UI",
                Value: [sopInstanceUid],
            },
            "00081197": {
                vr: "CS",
                Value: [failureCode],
            },
        } as FailedSopSequenceElement;
        this.message["00081198"].Value.push(failedSopInstance);
    }

    addOtherFailureReason(failureCode: string) {
        this.message["0008119A"].Value.push({
            "00081197": {
                vr: "US",
                Value: [failureCode],
            },
        });
    }

    private getSopInstanceReference({
        sopInstanceUid,
        sopClassUid,
    }: {
        sopInstanceUid: string;
        sopClassUid: string;
    }) {
        return {
            "00081150": {
                vr: "UI",
                Value: [sopClassUid],
            },
            "00081155": {
                vr: "UI",
                Value: [sopInstanceUid],
            },
        } as SopInstanceReference;
    }
}
