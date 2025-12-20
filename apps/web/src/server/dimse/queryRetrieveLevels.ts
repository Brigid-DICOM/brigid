import { EnumSet } from "raccoon-dcm4che-bridge/src/wrapper/java/util/EnumSet";
import { QueryRetrieveLevel2 } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/net/service/QueryRetrieveLevel2";

export const PATIENT_ROOT_LEVELS = EnumSet.ofSync(
    QueryRetrieveLevel2.PATIENT,
    QueryRetrieveLevel2.STUDY,
    QueryRetrieveLevel2.SERIES,
    QueryRetrieveLevel2.IMAGE,
);

export const STUDY_ROOT_LEVELS = EnumSet.ofSync(
    QueryRetrieveLevel2.STUDY,
    QueryRetrieveLevel2.SERIES,
    QueryRetrieveLevel2.IMAGE,
);

export const PATIENT_STUDY_ONLY_LEVELS = EnumSet.ofSync(
    QueryRetrieveLevel2.PATIENT,
    QueryRetrieveLevel2.STUDY
);