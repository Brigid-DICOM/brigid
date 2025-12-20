import type { Attributes } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Attributes";
import Tag from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/data/Tag";
import { StringUtils } from "raccoon-dcm4che-bridge/src/wrapper/org/dcm4che3/util/StringUtils";

export const queryTagsOfEachLevel = {
    "patient": [
        Tag.PatientName,
        Tag.PatientID,
        Tag.PatientBirthDate
    ],
    "study": [
        Tag.PatientID,
        Tag.PatientName,
        Tag.StudyInstanceUID,
        Tag.StudyDate,
        Tag.StudyTime,
        Tag.AccessionNumber,
        Tag.ModalitiesInStudy,
        Tag.StudyID,
        Tag.ReferringPhysicianName
    ],
    "series": [
        Tag.PatientID,
        Tag.PatientName,
        Tag.StudyInstanceUID,
        Tag.StudyDate,
        Tag.StudyTime,
        Tag.AccessionNumber,
        Tag.StudyID,
        Tag.ReferringPhysicianName,
        Tag.SeriesInstanceUID,
        Tag.Modality,
        Tag.SeriesNumber,
        Tag.SeriesDescription,
        Tag.SeriesDate,
    ],
    "instance": [
        Tag.PatientID,
        Tag.PatientName,
        Tag.StudyInstanceUID,
        Tag.StudyDate,
        Tag.StudyTime,
        Tag.AccessionNumber,
        Tag.StudyID,
        Tag.ReferringPhysicianName,
        Tag.SeriesInstanceUID,
        Tag.Modality,
        Tag.SeriesNumber,
        Tag.SeriesDescription,
        Tag.SeriesDate,
        Tag.SOPInstanceUID,
        Tag.SOPClassUID,
        Tag.InstanceNumber,
        Tag.ContentDate,
        Tag.ContentTime
    ],
}

export const attributesToToJsonQuery = async (level: keyof typeof queryTagsOfEachLevel, attributes: Attributes) => {
    const query: Record<string, any> = {};

    const queryTags = queryTagsOfEachLevel[level];

    for (let i = 0; i < queryTags.length; i++) {
        const tag = queryTags[i];

        const value = await attributes.getStrings(tag);
        const tagStringValues = await StringUtils.maskNull(
            value ? value : null,
        );

        if (tagStringValues) {
            query[intTagToString(tag as number)] = tagStringValues.join(",");
        }
    }

    return query;
}

function intTagToString(tag: number) {
    return tag.toString(16).padStart(8, "0").toUpperCase();
}