import env from "@brigid/env";
import dcmjsDimse from "dcmjs-dimse";
import { appLogger } from "../../utils/logger";
import { PATIENT_ROOT_QUERY_RETRIEVE_FIND_SOP_CLASS_UID } from "../presentationContext";
import { datasetToJsonQuery } from "./datasetQuery";
import { fetchInstanceMatch } from "./levels/instance";
import { fetchPatientMatch } from "./levels/patient";
import { fetchSeriesMatch } from "./levels/series";
import { fetchStudyMatch } from "./levels/study";
import { buildResponseDataset } from "./responseBuilder";
import type {
    CFindInfoModel,
    CFindMatchFetcher,
    CFindQueryLevel,
    CFindRetrieveLevel,
} from "./types";

const { constants, responses } = dcmjsDimse;
const { CFindResponse } = responses;
const { SopClass, Status } = constants;

const PATIENT_ROOT_LEVELS = new Set<CFindRetrieveLevel>([
    "PATIENT",
    "STUDY",
    "SERIES",
    "IMAGE",
]);

const STUDY_ROOT_LEVELS = new Set<CFindRetrieveLevel>([
    "STUDY",
    "SERIES",
    "IMAGE",
]);

const logger = appLogger.child({
    module: "CFindExecutor",
});

function resolveInfoModel(abstractSyntaxUid: string): CFindInfoModel {
    if (
        abstractSyntaxUid === PATIENT_ROOT_QUERY_RETRIEVE_FIND_SOP_CLASS_UID
    ) {
        return "patientRoot";
    }

    if (
        abstractSyntaxUid ===
        SopClass.StudyRootQueryRetrieveInformationModelFind
    ) {
        return "studyRoot";
    }

    throw new Error(`Unsupported C-FIND abstract syntax: ${abstractSyntaxUid}`);
}

function resolveQueryLevel(
    retrieveLevel: CFindRetrieveLevel,
): CFindQueryLevel {
    switch (retrieveLevel) {
        case "PATIENT":
            return "patient";
        case "STUDY":
            return "study";
        case "SERIES":
            return "series";
        case "IMAGE":
            return "instance";
    }
}

function getMatchFetcher(
    infoModel: CFindInfoModel,
    retrieveLevel: CFindRetrieveLevel,
): CFindMatchFetcher {
    const allowedLevels =
        infoModel === "patientRoot" ? PATIENT_ROOT_LEVELS : STUDY_ROOT_LEVELS;

    if (!allowedLevels.has(retrieveLevel)) {
        throw new Error(
            `QueryRetrieveLevel ${retrieveLevel} is not supported for ${infoModel}`,
        );
    }

    switch (retrieveLevel) {
        case "PATIENT":
            return fetchPatientMatch;
        case "STUDY":
            return fetchStudyMatch;
        case "SERIES":
            return fetchSeriesMatch;
        case "IMAGE":
            return fetchInstanceMatch;
    }
}

export async function executeCFind(options: {
    abstractSyntaxUid: string;
    workspaceId: string;
    identifier: dcmjsDimse.Dataset;
    request: dcmjsDimse.requests.CFindRequest;
}): Promise<dcmjsDimse.responses.CFindResponse[]> {
    const { abstractSyntaxUid, workspaceId, identifier, request } = options;
    const retrieveLevel = identifier.getElement(
        "QueryRetrieveLevel",
    ) as CFindRetrieveLevel | undefined;

    if (!retrieveLevel) {
        throw new Error("C-FIND identifier is missing QueryRetrieveLevel");
    }

    const infoModel = resolveInfoModel(abstractSyntaxUid);
    const queryLevel = resolveQueryLevel(retrieveLevel);
    const queryJson = datasetToJsonQuery(queryLevel, identifier);
    const fetchMatch = getMatchFetcher(infoModel, retrieveLevel);

    const responses: dcmjsDimse.responses.CFindResponse[] = [];
    let offset = 0;

    while (offset < env.QUERY_MAX_LIMIT) {
        const matchLayers = await fetchMatch(workspaceId, queryJson, offset);
        if (!matchLayers) {
            break;
        }

        const pendingResponse = CFindResponse.fromRequest(request);
        pendingResponse.setDataset(
            buildResponseDataset(matchLayers, identifier),
        );
        pendingResponse.setStatus(Status.Pending);
        responses.push(pendingResponse);
        offset++;
    }

    const finalResponse = CFindResponse.fromRequest(request);
    finalResponse.setStatus(Status.Success);
    responses.push(finalResponse);

    logger.info("C-FIND completed", {
        workspaceId,
        infoModel,
        retrieveLevel,
        matchCount: responses.length - 1,
    });

    return responses;
}
