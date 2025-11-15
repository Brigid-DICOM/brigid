import type { SearchLevel } from "./dicom-search-modal";

export type FieldType = "text" | "dateRange" | "select";

export interface FieldOption {
    value: string;
    label: string;
}

export interface SearchFieldConfig {
    key: string;
    label: string;
    type: FieldType;
    options?: FieldOption[];
    placeholder?: string;
}

const baseStudyFields: SearchFieldConfig[] = [
    {
        key: "PatientID",
        label: "Patient ID",
        type: "text",
        placeholder: "Enter Patient ID",
    },
    {
        key: "PatientName",
        label: "Patient Name",
        type: "text",
        placeholder: "Enter Patient Name",
    },
    { key: "StudyInstanceUID", label: "Study Instance UID", type: "text" },
    { key: "StudyDate", label: "Study Date", type: "dateRange" },
    { key: "AccessionNumber", label: "Accession Number", type: "text" },
    { 
        key: "ModalitiesInStudy", 
        label: "Modalities In Study", 
        type: "select",
        options: [
          { value: "CT", label: "CT" },
          { value: "MR", label: "MR" },
          { value: "US", label: "US" },
          { value: "XA", label: "XA" },
          { value: "RF", label: "RF" },
          { value: "DX", label: "DX" },
          { value: "CR", label: "CR" },
          { value: "MG", label: "MG" },
          { value: "PT", label: "PT" },
          { value: "NM", label: "NM" },
        ]
    },
    { key: "ReferringPhysicianName", label: "Referring Physician Name", type: "text" },
];

const baseSeriesFields: SearchFieldConfig[] = [
    { 
        key: "Modality", 
        label: "Modality", 
        type: "select",
        options: [
          { value: "CT", label: "CT" },
          { value: "MR", label: "MR" },
          { value: "US", label: "US" },
          { value: "XA", label: "XA" },
          { value: "RF", label: "RF" },
          { value: "DX", label: "DX" },
          { value: "CR", label: "CR" },
          { value: "MG", label: "MG" },
          { value: "PT", label: "PT" },
          { value: "NM", label: "NM" },
        ]
    },
    { key: "SeriesInstanceUID", label: "Series Instance UID", type: "text" },
    { key: "SeriesNumber", label: "Series Number", type: "text" },
    { key: "SeriesDate", label: "Series Date", type: "dateRange" },
    { key: "PerformedProcedureStepStartDate", label: "Performed Procedure Step Start Date", type: "dateRange" },
];

const baseInstanceFields: SearchFieldConfig[] = [
    { key: "ContentDate", label: "Content Date", type: "dateRange" },
    { key: "SOPClassUID", label: "SOP Class UID", type: "text" },
    { key: "SOPInstanceUID", label: "SOP Instance UID", type: "text" },
    { key: "InstanceNumber", label: "Instance Number", type: "text" },
    { key: "AcquisitionDate", label: "Acquisition Date", type: "dateRange" },
];

export const SEARCH_FIELD_CONFIGS: Record<SearchLevel, SearchFieldConfig[]> = {
    study: baseStudyFields,
    series: baseSeriesFields,
    instance: baseInstanceFields,
    "recycle-study": baseStudyFields,
    "recycle-series": baseSeriesFields,
    "recycle-instance": baseInstanceFields,
};

export const DEFAULT_FIELDS: Record<SearchLevel, string[]> = {
    study: ["PatientID", "AccessionNumber"],
    series: ["Modality"],
    instance: ["ContentDate"],
    "recycle-study": ["PatientID", "AccessionNumber"],
    "recycle-series": ["Modality"],
    "recycle-instance": ["ContentDate"],
}

