export const DICOM_TAG_KEYWORD_REGISTRY = {
    LengthToEnd: {
        tag: "00080001",
        vr: "UL",
        vm: "1",
    },
    SpecificCharacterSet: {
        tag: "00080005",
        vr: "CS",
        vm: "1-n",
    },
    LanguageCodeSequence: {
        tag: "00080006",
        vr: "SQ",
        vm: "1",
    },
    ImageType: {
        tag: "00080008",
        vr: "CS",
        vm: "2-n",
    },
    RecognitionCode: {
        tag: "00080010",
        vr: "SH",
        vm: "1",
    },
    InstanceCreationDate: {
        tag: "00080012",
        vr: "DA",
        vm: "1",
    },
    InstanceCreationTime: {
        tag: "00080013",
        vr: "TM",
        vm: "1",
    },
    InstanceCreatorUID: {
        tag: "00080014",
        vr: "UI",
        vm: "1",
    },
    InstanceCoercionDateTime: {
        tag: "00080015",
        vr: "DT",
        vm: "1",
    },
    SOPClassUID: {
        tag: "00080016",
        vr: "UI",
        vm: "1",
    },
    AcquisitionUID: {
        tag: "00080017",
        vr: "UI",
        vm: "1",
    },
    SOPInstanceUID: {
        tag: "00080018",
        vr: "UI",
        vm: "1",
    },
    PyramidUID: {
        tag: "00080019",
        vr: "UI",
        vm: "1",
    },
    RelatedGeneralSOPClassUID: {
        tag: "0008001A",
        vr: "UI",
        vm: "1-n",
    },
    OriginalSpecializedSOPClassUID: {
        tag: "0008001B",
        vr: "UI",
        vm: "1",
    },
    SyntheticData: {
        tag: "0008001C",
        vr: "CS",
        vm: "1",
    },
    StudyDate: {
        tag: "00080020",
        vr: "DA",
        vm: "1",
    },
    SeriesDate: {
        tag: "00080021",
        vr: "DA",
        vm: "1",
    },
    AcquisitionDate: {
        tag: "00080022",
        vr: "DA",
        vm: "1",
    },
    ContentDate: {
        tag: "00080023",
        vr: "DA",
        vm: "1",
    },
    OverlayDate: {
        tag: "00080024",
        vr: "DA",
        vm: "1",
    },
    CurveDate: {
        tag: "00080025",
        vr: "DA",
        vm: "1",
    },
    AcquisitionDateTime: {
        tag: "0008002A",
        vr: "DT",
        vm: "1",
    },
    StudyTime: {
        tag: "00080030",
        vr: "TM",
        vm: "1",
    },
    SeriesTime: {
        tag: "00080031",
        vr: "TM",
        vm: "1",
    },
    AcquisitionTime: {
        tag: "00080032",
        vr: "TM",
        vm: "1",
    },
    ContentTime: {
        tag: "00080033",
        vr: "TM",
        vm: "1",
    },
    OverlayTime: {
        tag: "00080034",
        vr: "TM",
        vm: "1",
    },
    CurveTime: {
        tag: "00080035",
        vr: "TM",
        vm: "1",
    },
    DataSetType: {
        tag: "00080040",
        vr: "US",
        vm: "1",
    },
    DataSetSubtype: {
        tag: "00080041",
        vr: "LO",
        vm: "1",
    },
    NuclearMedicineSeriesType: {
        tag: "00080042",
        vr: "CS",
        vm: "1",
    },
    AccessionNumber: {
        tag: "00080050",
        vr: "SH",
        vm: "1",
    },
    IssuerOfAccessionNumberSequence: {
        tag: "00080051",
        vr: "SQ",
        vm: "1",
    },
    QueryRetrieveLevel: {
        tag: "00080052",
        vr: "CS",
        vm: "1",
    },
    QueryRetrieveView: {
        tag: "00080053",
        vr: "CS",
        vm: "1",
    },
    RetrieveAETitle: {
        tag: "00080054",
        vr: "AE",
        vm: "1-n",
    },
    StationAETitle: {
        tag: "00080055",
        vr: "AE",
        vm: "1",
    },
    InstanceAvailability: {
        tag: "00080056",
        vr: "CS",
        vm: "1",
    },
    FailedSOPInstanceUIDList: {
        tag: "00080058",
        vr: "UI",
        vm: "1-n",
    },
    Modality: {
        tag: "00080060",
        vr: "CS",
        vm: "1",
    },
    ModalitiesInStudy: {
        tag: "00080061",
        vr: "CS",
        vm: "1-n",
    },
    SOPClassesInStudy: {
        tag: "00080062",
        vr: "UI",
        vm: "1-n",
    },
    AnatomicRegionsInStudyCodeSequence: {
        tag: "00080063",
        vr: "SQ",
        vm: "1",
    },
    ConversionType: {
        tag: "00080064",
        vr: "CS",
        vm: "1",
    },
    PresentationIntentType: {
        tag: "00080068",
        vr: "CS",
        vm: "1",
    },
    Manufacturer: {
        tag: "00080070",
        vr: "LO",
        vm: "1",
    },
    InstitutionName: {
        tag: "00080080",
        vr: "LO",
        vm: "1",
    },
    InstitutionAddress: {
        tag: "00080081",
        vr: "ST",
        vm: "1",
    },
    InstitutionCodeSequence: {
        tag: "00080082",
        vr: "SQ",
        vm: "1",
    },
    ReferringPhysicianName: {
        tag: "00080090",
        vr: "PN",
        vm: "1",
    },
    ReferringPhysicianAddress: {
        tag: "00080092",
        vr: "ST",
        vm: "1",
    },
    ReferringPhysicianTelephoneNumbers: {
        tag: "00080094",
        vr: "SH",
        vm: "1-n",
    },
    ReferringPhysicianIdentificationSequence: {
        tag: "00080096",
        vr: "SQ",
        vm: "1",
    },
    ConsultingPhysicianName: {
        tag: "0008009C",
        vr: "PN",
        vm: "1-n",
    },
    ConsultingPhysicianIdentificationSequence: {
        tag: "0008009D",
        vr: "SQ",
        vm: "1",
    },
    CodeValue: {
        tag: "00080100",
        vr: "SH",
        vm: "1",
    },
    ExtendedCodeValue: {
        tag: "00080101",
        vr: "LO",
        vm: "1",
    },
    CodingSchemeDesignator: {
        tag: "00080102",
        vr: "SH",
        vm: "1",
    },
    CodingSchemeVersion: {
        tag: "00080103",
        vr: "SH",
        vm: "1",
    },
    CodeMeaning: {
        tag: "00080104",
        vr: "LO",
        vm: "1",
    },
    MappingResource: {
        tag: "00080105",
        vr: "CS",
        vm: "1",
    },
    ContextGroupVersion: {
        tag: "00080106",
        vr: "DT",
        vm: "1",
    },
    ContextGroupLocalVersion: {
        tag: "00080107",
        vr: "DT",
        vm: "1",
    },
    ExtendedCodeMeaning: {
        tag: "00080108",
        vr: "LT",
        vm: "1",
    },
    CodingSchemeResourcesSequence: {
        tag: "00080109",
        vr: "SQ",
        vm: "1",
    },
    CodingSchemeURLType: {
        tag: "0008010A",
        vr: "CS",
        vm: "1",
    },
    ContextGroupExtensionFlag: {
        tag: "0008010B",
        vr: "CS",
        vm: "1",
    },
    CodingSchemeUID: {
        tag: "0008010C",
        vr: "UI",
        vm: "1",
    },
    ContextGroupExtensionCreatorUID: {
        tag: "0008010D",
        vr: "UI",
        vm: "1",
    },
    CodingSchemeURL: {
        tag: "0008010E",
        vr: "UR",
        vm: "1",
    },
    ContextIdentifier: {
        tag: "0008010F",
        vr: "CS",
        vm: "1",
    },
    CodingSchemeIdentificationSequence: {
        tag: "00080110",
        vr: "SQ",
        vm: "1",
    },
    CodingSchemeRegistry: {
        tag: "00080112",
        vr: "LO",
        vm: "1",
    },
    CodingSchemeExternalID: {
        tag: "00080114",
        vr: "ST",
        vm: "1",
    },
    CodingSchemeName: {
        tag: "00080115",
        vr: "ST",
        vm: "1",
    },
    CodingSchemeResponsibleOrganization: {
        tag: "00080116",
        vr: "ST",
        vm: "1",
    },
    ContextUID: {
        tag: "00080117",
        vr: "UI",
        vm: "1",
    },
    MappingResourceUID: {
        tag: "00080118",
        vr: "UI",
        vm: "1",
    },
    LongCodeValue: {
        tag: "00080119",
        vr: "UC",
        vm: "1",
    },
    URNCodeValue: {
        tag: "00080120",
        vr: "UR",
        vm: "1",
    },
    EquivalentCodeSequence: {
        tag: "00080121",
        vr: "SQ",
        vm: "1",
    },
    MappingResourceName: {
        tag: "00080122",
        vr: "LO",
        vm: "1",
    },
    ContextGroupIdentificationSequence: {
        tag: "00080123",
        vr: "SQ",
        vm: "1",
    },
    MappingResourceIdentificationSequence: {
        tag: "00080124",
        vr: "SQ",
        vm: "1",
    },
    TimezoneOffsetFromUTC: {
        tag: "00080201",
        vr: "SH",
        vm: "1",
    },
    "": {
        tag: "300A0782",
        vr: "US",
        vm: "1",
    },
    ResponsibleGroupCodeSequence: {
        tag: "00080220",
        vr: "SQ",
        vm: "1",
    },
    EquipmentModality: {
        tag: "00080221",
        vr: "CS",
        vm: "1",
    },
    ManufacturerRelatedModelGroup: {
        tag: "00080222",
        vr: "LO",
        vm: "1",
    },
    PrivateDataElementCharacteristicsSequence: {
        tag: "00080300",
        vr: "SQ",
        vm: "1",
    },
    PrivateGroupReference: {
        tag: "00080301",
        vr: "US",
        vm: "1",
    },
    PrivateCreatorReference: {
        tag: "00080302",
        vr: "LO",
        vm: "1",
    },
    BlockIdentifyingInformationStatus: {
        tag: "00080303",
        vr: "CS",
        vm: "1",
    },
    NonidentifyingPrivateElements: {
        tag: "00080304",
        vr: "US",
        vm: "1-n",
    },
    IdentifyingPrivateElements: {
        tag: "00080306",
        vr: "US",
        vm: "1-n",
    },
    DeidentificationActionSequence: {
        tag: "00080305",
        vr: "SQ",
        vm: "1",
    },
    DeidentificationAction: {
        tag: "00080307",
        vr: "CS",
        vm: "1",
    },
    PrivateDataElement: {
        tag: "00080308",
        vr: "US",
        vm: "1",
    },
    PrivateDataElementValueMultiplicity: {
        tag: "00080309",
        vr: "UL",
        vm: "1-3",
    },
    PrivateDataElementValueRepresentation: {
        tag: "0008030A",
        vr: "CS",
        vm: "1",
    },
    PrivateDataElementNumberOfItems: {
        tag: "0008030B",
        vr: "UL",
        vm: "1-2",
    },
    PrivateDataElementName: {
        tag: "0008030C",
        vr: "UC",
        vm: "1",
    },
    PrivateDataElementKeyword: {
        tag: "0008030D",
        vr: "UC",
        vm: "1",
    },
    PrivateDataElementDescription: {
        tag: "0008030E",
        vr: "UT",
        vm: "1",
    },
    PrivateDataElementEncoding: {
        tag: "0008030F",
        vr: "UT",
        vm: "1",
    },
    PrivateDataElementDefinitionSequence: {
        tag: "00080310",
        vr: "SQ",
        vm: "1",
    },
    ScopeOfInventorySequence: {
        tag: "00080400",
        vr: "SQ",
        vm: "1",
    },
    InventoryPurpose: {
        tag: "00080401",
        vr: "LT",
        vm: "1",
    },
    InventoryInstanceDescription: {
        tag: "00080402",
        vr: "LT",
        vm: "1",
    },
    InventoryLevel: {
        tag: "00080403",
        vr: "CS",
        vm: "1",
    },
    ItemInventoryDateTime: {
        tag: "00080404",
        vr: "DT",
        vm: "1",
    },
    RemovedFromOperationalUse: {
        tag: "00080405",
        vr: "CS",
        vm: "1",
    },
    ReasonForRemovalCodeSequence: {
        tag: "00080406",
        vr: "SQ",
        vm: "1",
    },
    StoredInstanceBaseURI: {
        tag: "00080407",
        vr: "UR",
        vm: "1",
    },
    FolderAccessURI: {
        tag: "00080408",
        vr: "UR",
        vm: "1",
    },
    FileAccessURI: {
        tag: "00080409",
        vr: "UR",
        vm: "1",
    },
    ContainerFileType: {
        tag: "0008040A",
        vr: "CS",
        vm: "1",
    },
    FilenameInContainer: {
        tag: "0008040B",
        vr: "UR",
        vm: "1",
    },
    FileOffsetInContainer: {
        tag: "0008040C",
        vr: "UV",
        vm: "1",
    },
    FileLengthInContainer: {
        tag: "0008040D",
        vr: "UV",
        vm: "1",
    },
    StoredInstanceTransferSyntaxUID: {
        tag: "0008040E",
        vr: "UI",
        vm: "1",
    },
    ExtendedMatchingMechanisms: {
        tag: "0008040F",
        vr: "CS",
        vm: "1-n",
    },
    RangeMatchingSequence: {
        tag: "00080410",
        vr: "SQ",
        vm: "1",
    },
    ListOfUIDMatchingSequence: {
        tag: "00080411",
        vr: "SQ",
        vm: "1",
    },
    EmptyValueMatchingSequence: {
        tag: "00080412",
        vr: "SQ",
        vm: "1",
    },
    GeneralMatchingSequence: {
        tag: "00080413",
        vr: "SQ",
        vm: "1",
    },
    RequestedStatusInterval: {
        tag: "00080414",
        vr: "US",
        vm: "1",
    },
    RetainInstances: {
        tag: "00080415",
        vr: "CS",
        vm: "1",
    },
    ExpirationDateTime: {
        tag: "00080416",
        vr: "DT",
        vm: "1",
    },
    TransactionStatus: {
        tag: "00080417",
        vr: "CS",
        vm: "1",
    },
    TransactionStatusComment: {
        tag: "00080418",
        vr: "LT",
        vm: "1",
    },
    FileSetAccessSequence: {
        tag: "00080419",
        vr: "SQ",
        vm: "1",
    },
    FileAccessSequence: {
        tag: "0008041A",
        vr: "SQ",
        vm: "1",
    },
    RecordKey: {
        tag: "0008041B",
        vr: "OB",
        vm: "1",
    },
    PriorRecordKey: {
        tag: "0008041C",
        vr: "OB",
        vm: "1",
    },
    MetadataSequence: {
        tag: "0008041D",
        vr: "SQ",
        vm: "1",
    },
    UpdatedMetadataSequence: {
        tag: "0008041E",
        vr: "SQ",
        vm: "1",
    },
    StudyUpdateDateTime: {
        tag: "0008041F",
        vr: "DT",
        vm: "1",
    },
    InventoryAccessEndPointsSequence: {
        tag: "00080420",
        vr: "SQ",
        vm: "1",
    },
    StudyAccessEndPointsSequence: {
        tag: "00080421",
        vr: "SQ",
        vm: "1",
    },
    IncorporatedInventoryInstanceSequence: {
        tag: "00080422",
        vr: "SQ",
        vm: "1",
    },
    InventoriedStudiesSequence: {
        tag: "00080423",
        vr: "SQ",
        vm: "1",
    },
    InventoriedSeriesSequence: {
        tag: "00080424",
        vr: "SQ",
        vm: "1",
    },
    InventoriedInstancesSequence: {
        tag: "00080425",
        vr: "SQ",
        vm: "1",
    },
    InventoryCompletionStatus: {
        tag: "00080426",
        vr: "CS",
        vm: "1",
    },
    NumberOfStudyRecordsInInstance: {
        tag: "00080427",
        vr: "UL",
        vm: "1",
    },
    TotalNumberOfStudyRecords: {
        tag: "00080428",
        vr: "UV",
        vm: "1",
    },
    MaximumNumberOfRecords: {
        tag: "00080429",
        vr: "UV",
        vm: "1",
    },
    NetworkID: {
        tag: "00081000",
        vr: "AE",
        vm: "1",
    },
    StationName: {
        tag: "00081010",
        vr: "SH",
        vm: "1",
    },
    StudyDescription: {
        tag: "00081030",
        vr: "LO",
        vm: "1",
    },
    ProcedureCodeSequence: {
        tag: "00081032",
        vr: "SQ",
        vm: "1",
    },
    SeriesDescription: {
        tag: "0008103E",
        vr: "LO",
        vm: "1",
    },
    SeriesDescriptionCodeSequence: {
        tag: "0008103F",
        vr: "SQ",
        vm: "1",
    },
    InstitutionalDepartmentName: {
        tag: "00081040",
        vr: "LO",
        vm: "1",
    },
    InstitutionalDepartmentTypeCodeSequence: {
        tag: "00081041",
        vr: "SQ",
        vm: "1",
    },
    PhysiciansOfRecord: {
        tag: "00081048",
        vr: "PN",
        vm: "1-n",
    },
    PhysiciansOfRecordIdentificationSequence: {
        tag: "00081049",
        vr: "SQ",
        vm: "1",
    },
    PerformingPhysicianName: {
        tag: "00081050",
        vr: "PN",
        vm: "1-n",
    },
    PerformingPhysicianIdentificationSequence: {
        tag: "00081052",
        vr: "SQ",
        vm: "1",
    },
    NameOfPhysiciansReadingStudy: {
        tag: "00081060",
        vr: "PN",
        vm: "1-n",
    },
    PhysiciansReadingStudyIdentificationSequence: {
        tag: "00081062",
        vr: "SQ",
        vm: "1",
    },
    OperatorsName: {
        tag: "00081070",
        vr: "PN",
        vm: "1-n",
    },
    OperatorIdentificationSequence: {
        tag: "00081072",
        vr: "SQ",
        vm: "1",
    },
    AdmittingDiagnosesDescription: {
        tag: "00081080",
        vr: "LO",
        vm: "1-n",
    },
    AdmittingDiagnosesCodeSequence: {
        tag: "00081084",
        vr: "SQ",
        vm: "1",
    },
    PyramidDescription: {
        tag: "00081088",
        vr: "LO",
        vm: "1",
    },
    ManufacturerModelName: {
        tag: "00081090",
        vr: "LO",
        vm: "1",
    },
    ReferencedResultsSequence: {
        tag: "00081100",
        vr: "SQ",
        vm: "1",
    },
    ReferencedStudySequence: {
        tag: "00081110",
        vr: "SQ",
        vm: "1",
    },
    ReferencedPerformedProcedureStepSequence: {
        tag: "00081111",
        vr: "SQ",
        vm: "1",
    },
    ReferencedInstancesBySOPClassSequence: {
        tag: "00081112",
        vr: "SQ",
        vm: "1",
    },
    ReferencedSeriesSequence: {
        tag: "00081115",
        vr: "SQ",
        vm: "1",
    },
    ReferencedPatientSequence: {
        tag: "00081120",
        vr: "SQ",
        vm: "1",
    },
    ReferencedVisitSequence: {
        tag: "00081125",
        vr: "SQ",
        vm: "1",
    },
    ReferencedOverlaySequence: {
        tag: "00081130",
        vr: "SQ",
        vm: "1",
    },
    ReferencedStereometricInstanceSequence: {
        tag: "00081134",
        vr: "SQ",
        vm: "1",
    },
    ReferencedWaveformSequence: {
        tag: "0008113A",
        vr: "SQ",
        vm: "1",
    },
    ReferencedImageSequence: {
        tag: "00081140",
        vr: "SQ",
        vm: "1",
    },
    ReferencedCurveSequence: {
        tag: "00081145",
        vr: "SQ",
        vm: "1",
    },
    ReferencedInstanceSequence: {
        tag: "0008114A",
        vr: "SQ",
        vm: "1",
    },
    ReferencedRealWorldValueMappingInstanceSequence: {
        tag: "0008114B",
        vr: "SQ",
        vm: "1",
    },
    ReferencedSegmentationSequence: {
        tag: "0008114C",
        vr: "SQ",
        vm: "1",
    },
    ReferencedSurfaceSegmentationSequence: {
        tag: "0008114D",
        vr: "SQ",
        vm: "1",
    },
    ReferencedSOPClassUID: {
        tag: "00081150",
        vr: "UI",
        vm: "1",
    },
    ReferencedSOPInstanceUID: {
        tag: "00081155",
        vr: "UI",
        vm: "1",
    },
    DefinitionSourceSequence: {
        tag: "00081156",
        vr: "SQ",
        vm: "1",
    },
    SOPClassesSupported: {
        tag: "0008115A",
        vr: "UI",
        vm: "1-n",
    },
    ReferencedFrameNumber: {
        tag: "00081160",
        vr: "IS",
        vm: "1-n",
    },
    SimpleFrameList: {
        tag: "00081161",
        vr: "UL",
        vm: "1-n",
    },
    CalculatedFrameList: {
        tag: "00081162",
        vr: "UL",
        vm: "3-3n",
    },
    TimeRange: {
        tag: "00081163",
        vr: "FD",
        vm: "2",
    },
    FrameExtractionSequence: {
        tag: "00081164",
        vr: "SQ",
        vm: "1",
    },
    MultiFrameSourceSOPInstanceUID: {
        tag: "00081167",
        vr: "UI",
        vm: "1",
    },
    RetrieveURL: {
        tag: "00081190",
        vr: "UR",
        vm: "1",
    },
    TransactionUID: {
        tag: "00081195",
        vr: "UI",
        vm: "1",
    },
    WarningReason: {
        tag: "00081196",
        vr: "US",
        vm: "1",
    },
    FailureReason: {
        tag: "00081197",
        vr: "US",
        vm: "1",
    },
    FailedSOPSequence: {
        tag: "00081198",
        vr: "SQ",
        vm: "1",
    },
    ReferencedSOPSequence: {
        tag: "00081199",
        vr: "SQ",
        vm: "1",
    },
    OtherFailuresSequence: {
        tag: "0008119A",
        vr: "SQ",
        vm: "1",
    },
    FailedStudySequence: {
        tag: "0008119B",
        vr: "SQ",
        vm: "1",
    },
    StudiesContainingOtherReferencedInstancesSequence: {
        tag: "00081200",
        vr: "SQ",
        vm: "1",
    },
    RelatedSeriesSequence: {
        tag: "00081250",
        vr: "SQ",
        vm: "1",
    },
    PrincipalDiagnosisCodeSequence: {
        tag: "00081301",
        vr: "SQ",
        vm: "1",
    },
    PrimaryDiagnosisCodeSequence: {
        tag: "00081302",
        vr: "SQ",
        vm: "1",
    },
    SecondaryDiagnosesCodeSequence: {
        tag: "00081303",
        vr: "SQ",
        vm: "1",
    },
    HistologicalDiagnosesCodeSequence: {
        tag: "00081304",
        vr: "SQ",
        vm: "1",
    },
    LossyImageCompressionRetired: {
        tag: "00082110",
        vr: "CS",
        vm: "1",
    },
    DerivationDescription: {
        tag: "00082111",
        vr: "ST",
        vm: "1",
    },
    SourceImageSequence: {
        tag: "00082112",
        vr: "SQ",
        vm: "1",
    },
    StageName: {
        tag: "00082120",
        vr: "SH",
        vm: "1",
    },
    StageNumber: {
        tag: "00082122",
        vr: "IS",
        vm: "1",
    },
    NumberOfStages: {
        tag: "00082124",
        vr: "IS",
        vm: "1",
    },
    ViewName: {
        tag: "00082127",
        vr: "SH",
        vm: "1",
    },
    ViewNumber: {
        tag: "00082128",
        vr: "IS",
        vm: "1",
    },
    NumberOfEventTimers: {
        tag: "00082129",
        vr: "IS",
        vm: "1",
    },
    NumberOfViewsInStage: {
        tag: "0008212A",
        vr: "IS",
        vm: "1",
    },
    EventElapsedTimes: {
        tag: "00082130",
        vr: "DS",
        vm: "1-n",
    },
    EventTimerNames: {
        tag: "00082132",
        vr: "LO",
        vm: "1-n",
    },
    EventTimerSequence: {
        tag: "00082133",
        vr: "SQ",
        vm: "1",
    },
    EventTimeOffset: {
        tag: "00082134",
        vr: "FD",
        vm: "1",
    },
    EventCodeSequence: {
        tag: "00082135",
        vr: "SQ",
        vm: "1",
    },
    StartTrim: {
        tag: "00082142",
        vr: "IS",
        vm: "1",
    },
    StopTrim: {
        tag: "00082143",
        vr: "IS",
        vm: "1",
    },
    RecommendedDisplayFrameRate: {
        tag: "00082144",
        vr: "IS",
        vm: "1",
    },
    TransducerPosition: {
        tag: "00082200",
        vr: "CS",
        vm: "1",
    },
    TransducerOrientation: {
        tag: "00082204",
        vr: "CS",
        vm: "1",
    },
    AnatomicStructure: {
        tag: "00082208",
        vr: "CS",
        vm: "1",
    },
    AnatomicRegionSequence: {
        tag: "00082218",
        vr: "SQ",
        vm: "1",
    },
    AnatomicRegionModifierSequence: {
        tag: "00082220",
        vr: "SQ",
        vm: "1",
    },
    PrimaryAnatomicStructureSequence: {
        tag: "00082228",
        vr: "SQ",
        vm: "1",
    },
    AnatomicStructureSpaceOrRegionSequence: {
        tag: "00082229",
        vr: "SQ",
        vm: "1",
    },
    PrimaryAnatomicStructureModifierSequence: {
        tag: "00082230",
        vr: "SQ",
        vm: "1",
    },
    TransducerPositionSequence: {
        tag: "00082240",
        vr: "SQ",
        vm: "1",
    },
    TransducerPositionModifierSequence: {
        tag: "00082242",
        vr: "SQ",
        vm: "1",
    },
    TransducerOrientationSequence: {
        tag: "00082244",
        vr: "SQ",
        vm: "1",
    },
    TransducerOrientationModifierSequence: {
        tag: "00082246",
        vr: "SQ",
        vm: "1",
    },
    AnatomicStructureSpaceOrRegionCodeSequenceTrial: {
        tag: "00082251",
        vr: "SQ",
        vm: "1",
    },
    AnatomicPortalOfEntranceCodeSequenceTrial: {
        tag: "00082253",
        vr: "SQ",
        vm: "1",
    },
    AnatomicApproachDirectionCodeSequenceTrial: {
        tag: "00082255",
        vr: "SQ",
        vm: "1",
    },
    AnatomicPerspectiveDescriptionTrial: {
        tag: "00082256",
        vr: "ST",
        vm: "1",
    },
    AnatomicPerspectiveCodeSequenceTrial: {
        tag: "00082257",
        vr: "SQ",
        vm: "1",
    },
    AnatomicLocationOfExaminingInstrumentDescriptionTrial: {
        tag: "00082258",
        vr: "ST",
        vm: "1",
    },
    AnatomicLocationOfExaminingInstrumentCodeSequenceTrial: {
        tag: "00082259",
        vr: "SQ",
        vm: "1",
    },
    AnatomicStructureSpaceOrRegionModifierCodeSequenceTrial: {
        tag: "0008225A",
        vr: "SQ",
        vm: "1",
    },
    OnAxisBackgroundAnatomicStructureCodeSequenceTrial: {
        tag: "0008225C",
        vr: "SQ",
        vm: "1",
    },
    AlternateRepresentationSequence: {
        tag: "00083001",
        vr: "SQ",
        vm: "1",
    },
    AvailableTransferSyntaxUID: {
        tag: "00083002",
        vr: "UI",
        vm: "1-n",
    },
    IrradiationEventUID: {
        tag: "00083010",
        vr: "UI",
        vm: "1-n",
    },
    SourceIrradiationEventSequence: {
        tag: "00083011",
        vr: "SQ",
        vm: "1",
    },
    RadiopharmaceuticalAdministrationEventUID: {
        tag: "00083012",
        vr: "UI",
        vm: "1",
    },
    IdentifyingComments: {
        tag: "00084000",
        vr: "LT",
        vm: "1",
    },
    FrameType: {
        tag: "00089007",
        vr: "CS",
        vm: "4-5",
    },
    ReferencedImageEvidenceSequence: {
        tag: "00089092",
        vr: "SQ",
        vm: "1",
    },
    ReferencedRawDataSequence: {
        tag: "00089121",
        vr: "SQ",
        vm: "1",
    },
    CreatorVersionUID: {
        tag: "00089123",
        vr: "UI",
        vm: "1",
    },
    DerivationImageSequence: {
        tag: "00089124",
        vr: "SQ",
        vm: "1",
    },
    SourceImageEvidenceSequence: {
        tag: "00089154",
        vr: "SQ",
        vm: "1",
    },
    PixelPresentation: {
        tag: "00089205",
        vr: "CS",
        vm: "1",
    },
    VolumetricProperties: {
        tag: "00089206",
        vr: "CS",
        vm: "1",
    },
    VolumeBasedCalculationTechnique: {
        tag: "00089207",
        vr: "CS",
        vm: "1",
    },
    ComplexImageComponent: {
        tag: "00089208",
        vr: "CS",
        vm: "1",
    },
    AcquisitionContrast: {
        tag: "00089209",
        vr: "CS",
        vm: "1",
    },
    DerivationCodeSequence: {
        tag: "00089215",
        vr: "SQ",
        vm: "1",
    },
    ReferencedPresentationStateSequence: {
        tag: "00089237",
        vr: "SQ",
        vm: "1",
    },
    ReferencedOtherPlaneSequence: {
        tag: "00089410",
        vr: "SQ",
        vm: "1",
    },
    FrameDisplaySequence: {
        tag: "00089458",
        vr: "SQ",
        vm: "1",
    },
    RecommendedDisplayFrameRateInFloat: {
        tag: "00089459",
        vr: "FL",
        vm: "1",
    },
    SkipFrameRangeFlag: {
        tag: "00089460",
        vr: "CS",
        vm: "1",
    },
    PatientName: {
        tag: "00100010",
        vr: "PN",
        vm: "1",
    },
    PersonNamesToUseSequence: {
        tag: "00100011",
        vr: "SQ",
        vm: "1",
    },
    NameToUse: {
        tag: "00100012",
        vr: "LT",
        vm: "1",
    },
    NameToUseComment: {
        tag: "00100013",
        vr: "UT",
        vm: "1",
    },
    ThirdPersonPronounsSequence: {
        tag: "00100014",
        vr: "SQ",
        vm: "1",
    },
    PronounCodeSequence: {
        tag: "00100015",
        vr: "SQ",
        vm: "1",
    },
    PronounComment: {
        tag: "00100016",
        vr: "UT",
        vm: "1",
    },
    PatientID: {
        tag: "00100020",
        vr: "LO",
        vm: "1",
    },
    IssuerOfPatientID: {
        tag: "00100021",
        vr: "LO",
        vm: "1",
    },
    TypeOfPatientID: {
        tag: "00100022",
        vr: "CS",
        vm: "1",
    },
    IssuerOfPatientIDQualifiersSequence: {
        tag: "00100024",
        vr: "SQ",
        vm: "1",
    },
    SourcePatientGroupIdentificationSequence: {
        tag: "00100026",
        vr: "SQ",
        vm: "1",
    },
    GroupOfPatientsIdentificationSequence: {
        tag: "00100027",
        vr: "SQ",
        vm: "1",
    },
    SubjectRelativePositionInImage: {
        tag: "00100028",
        vr: "US",
        vm: "3",
    },
    PatientBirthDate: {
        tag: "00100030",
        vr: "DA",
        vm: "1",
    },
    PatientBirthTime: {
        tag: "00100032",
        vr: "TM",
        vm: "1",
    },
    PatientBirthDateInAlternativeCalendar: {
        tag: "00100033",
        vr: "LO",
        vm: "1",
    },
    PatientDeathDateInAlternativeCalendar: {
        tag: "00100034",
        vr: "LO",
        vm: "1",
    },
    PatientAlternativeCalendar: {
        tag: "00100035",
        vr: "CS",
        vm: "1",
    },
    PatientSex: {
        tag: "00100040",
        vr: "CS",
        vm: "1",
    },
    GenderIdentitySequence: {
        tag: "00100041",
        vr: "SQ",
        vm: "1",
    },
    SexParametersForClinicalUseCategoryComment: {
        tag: "00100042",
        vr: "UT",
        vm: "1",
    },
    SexParametersForClinicalUseCategorySequence: {
        tag: "00100043",
        vr: "SQ",
        vm: "1",
    },
    GenderIdentityCodeSequence: {
        tag: "00100044",
        vr: "SQ",
        vm: "1",
    },
    GenderIdentityComment: {
        tag: "00100045",
        vr: "UT",
        vm: "1",
    },
    SexParametersForClinicalUseCategoryCodeSequence: {
        tag: "00100046",
        vr: "SQ",
        vm: "1",
    },
    SexParametersForClinicalUseCategoryReference: {
        tag: "00100047",
        vr: "UR",
        vm: "1-n",
    },
    PatientInsurancePlanCodeSequence: {
        tag: "00100050",
        vr: "SQ",
        vm: "1",
    },
    PatientPrimaryLanguageCodeSequence: {
        tag: "00100101",
        vr: "SQ",
        vm: "1",
    },
    PatientPrimaryLanguageModifierCodeSequence: {
        tag: "00100102",
        vr: "SQ",
        vm: "1",
    },
    QualityControlSubject: {
        tag: "00100200",
        vr: "CS",
        vm: "1",
    },
    QualityControlSubjectTypeCodeSequence: {
        tag: "00100201",
        vr: "SQ",
        vm: "1",
    },
    StrainDescription: {
        tag: "00100212",
        vr: "UC",
        vm: "1",
    },
    StrainNomenclature: {
        tag: "00100213",
        vr: "LO",
        vm: "1",
    },
    StrainStockNumber: {
        tag: "00100214",
        vr: "LO",
        vm: "1",
    },
    StrainSourceRegistryCodeSequence: {
        tag: "00100215",
        vr: "SQ",
        vm: "1",
    },
    StrainStockSequence: {
        tag: "00100216",
        vr: "SQ",
        vm: "1",
    },
    StrainSource: {
        tag: "00100217",
        vr: "LO",
        vm: "1",
    },
    StrainAdditionalInformation: {
        tag: "00100218",
        vr: "UT",
        vm: "1",
    },
    StrainCodeSequence: {
        tag: "00100219",
        vr: "SQ",
        vm: "1",
    },
    GeneticModificationsSequence: {
        tag: "00100221",
        vr: "SQ",
        vm: "1",
    },
    GeneticModificationsDescription: {
        tag: "00100222",
        vr: "UC",
        vm: "1",
    },
    GeneticModificationsNomenclature: {
        tag: "00100223",
        vr: "LO",
        vm: "1",
    },
    GeneticModificationsCodeSequence: {
        tag: "00100229",
        vr: "SQ",
        vm: "1",
    },
    OtherPatientIDs: {
        tag: "00101000",
        vr: "LO",
        vm: "1-n",
    },
    OtherPatientNames: {
        tag: "00101001",
        vr: "PN",
        vm: "1-n",
    },
    OtherPatientIDsSequence: {
        tag: "00101002",
        vr: "SQ",
        vm: "1",
    },
    PatientBirthName: {
        tag: "00101005",
        vr: "PN",
        vm: "1",
    },
    PatientAge: {
        tag: "00101010",
        vr: "AS",
        vm: "1",
    },
    PatientSize: {
        tag: "00101020",
        vr: "DS",
        vm: "1",
    },
    PatientSizeCodeSequence: {
        tag: "00101021",
        vr: "SQ",
        vm: "1",
    },
    PatientBodyMassIndex: {
        tag: "00101022",
        vr: "DS",
        vm: "1",
    },
    MeasuredAPDimension: {
        tag: "00101023",
        vr: "DS",
        vm: "1",
    },
    MeasuredLateralDimension: {
        tag: "00101024",
        vr: "DS",
        vm: "1",
    },
    PatientWeight: {
        tag: "00101030",
        vr: "DS",
        vm: "1",
    },
    PatientAddress: {
        tag: "00101040",
        vr: "LO",
        vm: "1",
    },
    InsurancePlanIdentification: {
        tag: "00101050",
        vr: "LO",
        vm: "1-n",
    },
    PatientMotherBirthName: {
        tag: "00101060",
        vr: "PN",
        vm: "1",
    },
    MilitaryRank: {
        tag: "00101080",
        vr: "LO",
        vm: "1",
    },
    BranchOfService: {
        tag: "00101081",
        vr: "LO",
        vm: "1",
    },
    MedicalRecordLocator: {
        tag: "00101090",
        vr: "LO",
        vm: "1",
    },
    ReferencedPatientPhotoSequence: {
        tag: "00101100",
        vr: "SQ",
        vm: "1",
    },
    MedicalAlerts: {
        tag: "00102000",
        vr: "LO",
        vm: "1-n",
    },
    Allergies: {
        tag: "00102110",
        vr: "LO",
        vm: "1-n",
    },
    CountryOfResidence: {
        tag: "00102150",
        vr: "LO",
        vm: "1",
    },
    RegionOfResidence: {
        tag: "00102152",
        vr: "LO",
        vm: "1",
    },
    PatientTelephoneNumbers: {
        tag: "00102154",
        vr: "SH",
        vm: "1-n",
    },
    PatientTelecomInformation: {
        tag: "00102155",
        vr: "LT",
        vm: "1",
    },
    EthnicGroup: {
        tag: "00102160",
        vr: "SH",
        vm: "1",
    },
    EthnicGroupCodeSequence: {
        tag: "00102161",
        vr: "SQ",
        vm: "1",
    },
    EthnicGroups: {
        tag: "00102162",
        vr: "UC",
        vm: "1-n",
    },
    Occupation: {
        tag: "00102180",
        vr: "SH",
        vm: "1",
    },
    SmokingStatus: {
        tag: "001021A0",
        vr: "CS",
        vm: "1",
    },
    AdditionalPatientHistory: {
        tag: "001021B0",
        vr: "LT",
        vm: "1",
    },
    PregnancyStatus: {
        tag: "001021C0",
        vr: "US",
        vm: "1",
    },
    LastMenstrualDate: {
        tag: "001021D0",
        vr: "DA",
        vm: "1",
    },
    PatientReligiousPreference: {
        tag: "001021F0",
        vr: "LO",
        vm: "1",
    },
    PatientSpeciesDescription: {
        tag: "00102201",
        vr: "LO",
        vm: "1",
    },
    PatientSpeciesCodeSequence: {
        tag: "00102202",
        vr: "SQ",
        vm: "1",
    },
    PatientSexNeutered: {
        tag: "00102203",
        vr: "CS",
        vm: "1",
    },
    AnatomicalOrientationType: {
        tag: "00102210",
        vr: "CS",
        vm: "1",
    },
    PatientBreedDescription: {
        tag: "00102292",
        vr: "LO",
        vm: "1",
    },
    PatientBreedCodeSequence: {
        tag: "00102293",
        vr: "SQ",
        vm: "1",
    },
    BreedRegistrationSequence: {
        tag: "00102294",
        vr: "SQ",
        vm: "1",
    },
    BreedRegistrationNumber: {
        tag: "00102295",
        vr: "LO",
        vm: "1",
    },
    BreedRegistryCodeSequence: {
        tag: "00102296",
        vr: "SQ",
        vm: "1",
    },
    ResponsiblePerson: {
        tag: "00102297",
        vr: "PN",
        vm: "1",
    },
    ResponsiblePersonRole: {
        tag: "00102298",
        vr: "CS",
        vm: "1",
    },
    ResponsibleOrganization: {
        tag: "00102299",
        vr: "LO",
        vm: "1",
    },
    PatientComments: {
        tag: "00104000",
        vr: "LT",
        vm: "1",
    },
    ExaminedBodyThickness: {
        tag: "00109431",
        vr: "FL",
        vm: "1",
    },
    ClinicalTrialSponsorName: {
        tag: "00120010",
        vr: "LO",
        vm: "1",
    },
    ClinicalTrialProtocolID: {
        tag: "00120020",
        vr: "LO",
        vm: "1",
    },
    ClinicalTrialProtocolName: {
        tag: "00120021",
        vr: "LO",
        vm: "1",
    },
    IssuerOfClinicalTrialProtocolID: {
        tag: "00120022",
        vr: "LO",
        vm: "1",
    },
    OtherClinicalTrialProtocolIDsSequence: {
        tag: "00120023",
        vr: "SQ",
        vm: "1",
    },
    ClinicalTrialSiteID: {
        tag: "00120030",
        vr: "LO",
        vm: "1",
    },
    ClinicalTrialSiteName: {
        tag: "00120031",
        vr: "LO",
        vm: "1",
    },
    IssuerOfClinicalTrialSiteID: {
        tag: "00120032",
        vr: "LO",
        vm: "1",
    },
    ClinicalTrialSubjectID: {
        tag: "00120040",
        vr: "LO",
        vm: "1",
    },
    IssuerOfClinicalTrialSubjectID: {
        tag: "00120041",
        vr: "LO",
        vm: "1",
    },
    ClinicalTrialSubjectReadingID: {
        tag: "00120042",
        vr: "LO",
        vm: "1",
    },
    IssuerOfClinicalTrialSubjectReadingID: {
        tag: "00120043",
        vr: "LO",
        vm: "1",
    },
    ClinicalTrialTimePointID: {
        tag: "00120050",
        vr: "LO",
        vm: "1",
    },
    ClinicalTrialTimePointDescription: {
        tag: "00120051",
        vr: "ST",
        vm: "1",
    },
    LongitudinalTemporalOffsetFromEvent: {
        tag: "00120052",
        vr: "FD",
        vm: "1",
    },
    LongitudinalTemporalEventType: {
        tag: "00120053",
        vr: "CS",
        vm: "1",
    },
    ClinicalTrialTimePointTypeCodeSequence: {
        tag: "00120054",
        vr: "SQ",
        vm: "1",
    },
    IssuerOfClinicalTrialTimePointID: {
        tag: "00120055",
        vr: "LO",
        vm: "1",
    },
    ClinicalTrialCoordinatingCenterName: {
        tag: "00120060",
        vr: "LO",
        vm: "1",
    },
    PatientIdentityRemoved: {
        tag: "00120062",
        vr: "CS",
        vm: "1",
    },
    DeidentificationMethod: {
        tag: "00120063",
        vr: "LO",
        vm: "1-n",
    },
    DeidentificationMethodCodeSequence: {
        tag: "00120064",
        vr: "SQ",
        vm: "1",
    },
    ClinicalTrialSeriesID: {
        tag: "00120071",
        vr: "LO",
        vm: "1",
    },
    ClinicalTrialSeriesDescription: {
        tag: "00120072",
        vr: "LO",
        vm: "1",
    },
    IssuerOfClinicalTrialSeriesID: {
        tag: "00120073",
        vr: "LO",
        vm: "1",
    },
    ClinicalTrialProtocolEthicsCommitteeName: {
        tag: "00120081",
        vr: "LO",
        vm: "1",
    },
    ClinicalTrialProtocolEthicsCommitteeApprovalNumber: {
        tag: "00120082",
        vr: "LO",
        vm: "1",
    },
    ConsentForClinicalTrialUseSequence: {
        tag: "00120083",
        vr: "SQ",
        vm: "1",
    },
    DistributionType: {
        tag: "00120084",
        vr: "CS",
        vm: "1",
    },
    ConsentForDistributionFlag: {
        tag: "00120085",
        vr: "CS",
        vm: "1",
    },
    EthicsCommitteeApprovalEffectivenessStartDate: {
        tag: "00120086",
        vr: "DA",
        vm: "1",
    },
    EthicsCommitteeApprovalEffectivenessEndDate: {
        tag: "00120087",
        vr: "DA",
        vm: "1",
    },
    CADFileFormat: {
        tag: "00140023",
        vr: "ST",
        vm: "1",
    },
    ComponentReferenceSystem: {
        tag: "00140024",
        vr: "ST",
        vm: "1",
    },
    ComponentManufacturingProcedure: {
        tag: "00140025",
        vr: "ST",
        vm: "1",
    },
    ComponentManufacturer: {
        tag: "00140028",
        vr: "ST",
        vm: "1",
    },
    MaterialThickness: {
        tag: "00140030",
        vr: "DS",
        vm: "1-n",
    },
    MaterialPipeDiameter: {
        tag: "00140032",
        vr: "DS",
        vm: "1-n",
    },
    MaterialIsolationDiameter: {
        tag: "00140034",
        vr: "DS",
        vm: "1-n",
    },
    MaterialGrade: {
        tag: "00140042",
        vr: "ST",
        vm: "1",
    },
    MaterialPropertiesDescription: {
        tag: "00140044",
        vr: "ST",
        vm: "1",
    },
    MaterialPropertiesFileFormatRetired: {
        tag: "00140045",
        vr: "ST",
        vm: "1",
    },
    MaterialNotes: {
        tag: "00140046",
        vr: "LT",
        vm: "1",
    },
    ComponentShape: {
        tag: "00140050",
        vr: "CS",
        vm: "1",
    },
    CurvatureType: {
        tag: "00140052",
        vr: "CS",
        vm: "1",
    },
    OuterDiameter: {
        tag: "00140054",
        vr: "DS",
        vm: "1",
    },
    InnerDiameter: {
        tag: "00140056",
        vr: "DS",
        vm: "1",
    },
    ComponentWelderIDs: {
        tag: "00140100",
        vr: "LO",
        vm: "1-n",
    },
    SecondaryApprovalStatus: {
        tag: "00140101",
        vr: "CS",
        vm: "1",
    },
    SecondaryReviewDate: {
        tag: "00140102",
        vr: "DA",
        vm: "1",
    },
    SecondaryReviewTime: {
        tag: "00140103",
        vr: "TM",
        vm: "1",
    },
    SecondaryReviewerName: {
        tag: "00140104",
        vr: "PN",
        vm: "1",
    },
    RepairID: {
        tag: "00140105",
        vr: "ST",
        vm: "1",
    },
    MultipleComponentApprovalSequence: {
        tag: "00140106",
        vr: "SQ",
        vm: "1",
    },
    OtherApprovalStatus: {
        tag: "00140107",
        vr: "CS",
        vm: "1-n",
    },
    OtherSecondaryApprovalStatus: {
        tag: "00140108",
        vr: "CS",
        vm: "1-n",
    },
    DataElementLabelSequence: {
        tag: "00140200",
        vr: "SQ",
        vm: "1",
    },
    DataElementLabelItemSequence: {
        tag: "00140201",
        vr: "SQ",
        vm: "1",
    },
    DataElement: {
        tag: "00140202",
        vr: "AT",
        vm: "1",
    },
    DataElementName: {
        tag: "00140203",
        vr: "LO",
        vm: "1",
    },
    DataElementDescription: {
        tag: "00140204",
        vr: "LO",
        vm: "1",
    },
    DataElementConditionality: {
        tag: "00140205",
        vr: "CS",
        vm: "1",
    },
    DataElementMinimumCharacters: {
        tag: "00140206",
        vr: "IS",
        vm: "1",
    },
    DataElementMaximumCharacters: {
        tag: "00140207",
        vr: "IS",
        vm: "1",
    },
    ActualEnvironmentalConditions: {
        tag: "00141010",
        vr: "ST",
        vm: "1",
    },
    ExpiryDate: {
        tag: "00141020",
        vr: "DA",
        vm: "1",
    },
    EnvironmentalConditions: {
        tag: "00141040",
        vr: "ST",
        vm: "1",
    },
    EvaluatorSequence: {
        tag: "00142002",
        vr: "SQ",
        vm: "1",
    },
    EvaluatorNumber: {
        tag: "00142004",
        vr: "IS",
        vm: "1",
    },
    EvaluatorName: {
        tag: "00142006",
        vr: "PN",
        vm: "1",
    },
    EvaluationAttempt: {
        tag: "00142008",
        vr: "IS",
        vm: "1",
    },
    IndicationSequence: {
        tag: "00142012",
        vr: "SQ",
        vm: "1",
    },
    IndicationNumber: {
        tag: "00142014",
        vr: "IS",
        vm: "1",
    },
    IndicationLabel: {
        tag: "00142016",
        vr: "SH",
        vm: "1",
    },
    IndicationDescription: {
        tag: "00142018",
        vr: "ST",
        vm: "1",
    },
    IndicationType: {
        tag: "0014201A",
        vr: "CS",
        vm: "1-n",
    },
    IndicationDisposition: {
        tag: "0014201C",
        vr: "CS",
        vm: "1",
    },
    IndicationROISequence: {
        tag: "0014201E",
        vr: "SQ",
        vm: "1",
    },
    IndicationPhysicalPropertySequence: {
        tag: "00142030",
        vr: "SQ",
        vm: "1",
    },
    PropertyLabel: {
        tag: "00142032",
        vr: "SH",
        vm: "1",
    },
    CoordinateSystemNumberOfAxes: {
        tag: "00142202",
        vr: "IS",
        vm: "1",
    },
    CoordinateSystemAxesSequence: {
        tag: "00142204",
        vr: "SQ",
        vm: "1",
    },
    CoordinateSystemAxisDescription: {
        tag: "00142206",
        vr: "ST",
        vm: "1",
    },
    CoordinateSystemDataSetMapping: {
        tag: "00142208",
        vr: "CS",
        vm: "1",
    },
    CoordinateSystemAxisNumber: {
        tag: "0014220A",
        vr: "IS",
        vm: "1",
    },
    CoordinateSystemAxisType: {
        tag: "0014220C",
        vr: "CS",
        vm: "1",
    },
    CoordinateSystemAxisUnits: {
        tag: "0014220E",
        vr: "CS",
        vm: "1",
    },
    CoordinateSystemAxisValues: {
        tag: "00142210",
        vr: "OB",
        vm: "1",
    },
    CoordinateSystemTransformSequence: {
        tag: "00142220",
        vr: "SQ",
        vm: "1",
    },
    TransformDescription: {
        tag: "00142222",
        vr: "ST",
        vm: "1",
    },
    TransformNumberOfAxes: {
        tag: "00142224",
        vr: "IS",
        vm: "1",
    },
    TransformOrderOfAxes: {
        tag: "00142226",
        vr: "IS",
        vm: "1-n",
    },
    TransformedAxisUnits: {
        tag: "00142228",
        vr: "CS",
        vm: "1",
    },
    CoordinateSystemTransformRotationAndScaleMatrix: {
        tag: "0014222A",
        vr: "DS",
        vm: "1-n",
    },
    CoordinateSystemTransformTranslationMatrix: {
        tag: "0014222C",
        vr: "DS",
        vm: "1-n",
    },
    InternalDetectorFrameTime: {
        tag: "00143011",
        vr: "DS",
        vm: "1",
    },
    NumberOfFramesIntegrated: {
        tag: "00143012",
        vr: "DS",
        vm: "1",
    },
    DetectorTemperatureSequence: {
        tag: "00143020",
        vr: "SQ",
        vm: "1",
    },
    SensorName: {
        tag: "00143022",
        vr: "ST",
        vm: "1",
    },
    HorizontalOffsetOfSensor: {
        tag: "00143024",
        vr: "DS",
        vm: "1",
    },
    VerticalOffsetOfSensor: {
        tag: "00143026",
        vr: "DS",
        vm: "1",
    },
    SensorTemperature: {
        tag: "00143028",
        vr: "DS",
        vm: "1",
    },
    DarkCurrentSequence: {
        tag: "00143040",
        vr: "SQ",
        vm: "1",
    },
    DarkCurrentCounts: {
        tag: "00143050",
        vr: "OB or OW",
        vm: "1",
    },
    GainCorrectionReferenceSequence: {
        tag: "00143060",
        vr: "SQ",
        vm: "1",
    },
    AirCounts: {
        tag: "00143070",
        vr: "OB or OW",
        vm: "1",
    },
    KVUsedInGainCalibration: {
        tag: "00143071",
        vr: "DS",
        vm: "1",
    },
    MAUsedInGainCalibration: {
        tag: "00143072",
        vr: "DS",
        vm: "1",
    },
    NumberOfFramesUsedForIntegration: {
        tag: "00143073",
        vr: "DS",
        vm: "1",
    },
    FilterMaterialUsedInGainCalibration: {
        tag: "00143074",
        vr: "LO",
        vm: "1",
    },
    FilterThicknessUsedInGainCalibration: {
        tag: "00143075",
        vr: "DS",
        vm: "1",
    },
    DateOfGainCalibration: {
        tag: "00143076",
        vr: "DA",
        vm: "1",
    },
    TimeOfGainCalibration: {
        tag: "00143077",
        vr: "TM",
        vm: "1",
    },
    BadPixelImage: {
        tag: "00143080",
        vr: "OB",
        vm: "1",
    },
    CalibrationNotes: {
        tag: "00143099",
        vr: "LT",
        vm: "1",
    },
    LinearityCorrectionTechnique: {
        tag: "00143100",
        vr: "LT",
        vm: "1",
    },
    BeamHardeningCorrectionTechnique: {
        tag: "00143101",
        vr: "LT",
        vm: "1",
    },
    PulserEquipmentSequence: {
        tag: "00144002",
        vr: "SQ",
        vm: "1",
    },
    PulserType: {
        tag: "00144004",
        vr: "CS",
        vm: "1",
    },
    PulserNotes: {
        tag: "00144006",
        vr: "LT",
        vm: "1",
    },
    ReceiverEquipmentSequence: {
        tag: "00144008",
        vr: "SQ",
        vm: "1",
    },
    AmplifierType: {
        tag: "0014400A",
        vr: "CS",
        vm: "1",
    },
    ReceiverNotes: {
        tag: "0014400C",
        vr: "LT",
        vm: "1",
    },
    PreAmplifierEquipmentSequence: {
        tag: "0014400E",
        vr: "SQ",
        vm: "1",
    },
    PreAmplifierNotes: {
        tag: "0014400F",
        vr: "LT",
        vm: "1",
    },
    TransmitTransducerSequence: {
        tag: "00144010",
        vr: "SQ",
        vm: "1",
    },
    ReceiveTransducerSequence: {
        tag: "00144011",
        vr: "SQ",
        vm: "1",
    },
    NumberOfElements: {
        tag: "00144012",
        vr: "US",
        vm: "1",
    },
    ElementShape: {
        tag: "00144013",
        vr: "CS",
        vm: "1",
    },
    ElementDimensionA: {
        tag: "00144014",
        vr: "DS",
        vm: "1",
    },
    ElementDimensionB: {
        tag: "00144015",
        vr: "DS",
        vm: "1",
    },
    ElementPitchA: {
        tag: "00144016",
        vr: "DS",
        vm: "1",
    },
    MeasuredBeamDimensionA: {
        tag: "00144017",
        vr: "DS",
        vm: "1",
    },
    MeasuredBeamDimensionB: {
        tag: "00144018",
        vr: "DS",
        vm: "1",
    },
    LocationOfMeasuredBeamDiameter: {
        tag: "00144019",
        vr: "DS",
        vm: "1",
    },
    NominalFrequency: {
        tag: "0014401A",
        vr: "DS",
        vm: "1",
    },
    MeasuredCenterFrequency: {
        tag: "0014401B",
        vr: "DS",
        vm: "1",
    },
    MeasuredBandwidth: {
        tag: "0014401C",
        vr: "DS",
        vm: "1",
    },
    ElementPitchB: {
        tag: "0014401D",
        vr: "DS",
        vm: "1",
    },
    PulserSettingsSequence: {
        tag: "00144020",
        vr: "SQ",
        vm: "1",
    },
    PulseWidth: {
        tag: "00144022",
        vr: "DS",
        vm: "1",
    },
    ExcitationFrequency: {
        tag: "00144024",
        vr: "DS",
        vm: "1",
    },
    ModulationType: {
        tag: "00144026",
        vr: "CS",
        vm: "1",
    },
    Damping: {
        tag: "00144028",
        vr: "DS",
        vm: "1",
    },
    ReceiverSettingsSequence: {
        tag: "00144030",
        vr: "SQ",
        vm: "1",
    },
    AcquiredSoundpathLength: {
        tag: "00144031",
        vr: "DS",
        vm: "1",
    },
    AcquisitionCompressionType: {
        tag: "00144032",
        vr: "CS",
        vm: "1",
    },
    AcquisitionSampleSize: {
        tag: "00144033",
        vr: "IS",
        vm: "1",
    },
    RectifierSmoothing: {
        tag: "00144034",
        vr: "DS",
        vm: "1",
    },
    DACSequence: {
        tag: "00144035",
        vr: "SQ",
        vm: "1",
    },
    DACType: {
        tag: "00144036",
        vr: "CS",
        vm: "1",
    },
    DACGainPoints: {
        tag: "00144038",
        vr: "DS",
        vm: "1-n",
    },
    DACTimePoints: {
        tag: "0014403A",
        vr: "DS",
        vm: "1-n",
    },
    DACAmplitude: {
        tag: "0014403C",
        vr: "DS",
        vm: "1-n",
    },
    PreAmplifierSettingsSequence: {
        tag: "00144040",
        vr: "SQ",
        vm: "1",
    },
    TransmitTransducerSettingsSequence: {
        tag: "00144050",
        vr: "SQ",
        vm: "1",
    },
    ReceiveTransducerSettingsSequence: {
        tag: "00144051",
        vr: "SQ",
        vm: "1",
    },
    IncidentAngle: {
        tag: "00144052",
        vr: "DS",
        vm: "1",
    },
    CouplingTechnique: {
        tag: "00144054",
        vr: "ST",
        vm: "1",
    },
    CouplingMedium: {
        tag: "00144056",
        vr: "ST",
        vm: "1",
    },
    CouplingVelocity: {
        tag: "00144057",
        vr: "DS",
        vm: "1",
    },
    ProbeCenterLocationX: {
        tag: "00144058",
        vr: "DS",
        vm: "1",
    },
    ProbeCenterLocationZ: {
        tag: "00144059",
        vr: "DS",
        vm: "1",
    },
    SoundPathLength: {
        tag: "0014405A",
        vr: "DS",
        vm: "1",
    },
    DelayLawIdentifier: {
        tag: "0014405C",
        vr: "ST",
        vm: "1",
    },
    GateSettingsSequence: {
        tag: "00144060",
        vr: "SQ",
        vm: "1",
    },
    GateThreshold: {
        tag: "00144062",
        vr: "DS",
        vm: "1",
    },
    VelocityOfSound: {
        tag: "00144064",
        vr: "DS",
        vm: "1",
    },
    CalibrationSettingsSequence: {
        tag: "00144070",
        vr: "SQ",
        vm: "1",
    },
    CalibrationProcedure: {
        tag: "00144072",
        vr: "ST",
        vm: "1",
    },
    ProcedureVersion: {
        tag: "00144074",
        vr: "SH",
        vm: "1",
    },
    ProcedureCreationDate: {
        tag: "00144076",
        vr: "DA",
        vm: "1",
    },
    ProcedureExpirationDate: {
        tag: "00144078",
        vr: "DA",
        vm: "1",
    },
    ProcedureLastModifiedDate: {
        tag: "0014407A",
        vr: "DA",
        vm: "1",
    },
    CalibrationTime: {
        tag: "0014407C",
        vr: "TM",
        vm: "1-n",
    },
    CalibrationDate: {
        tag: "0014407E",
        vr: "DA",
        vm: "1-n",
    },
    ProbeDriveEquipmentSequence: {
        tag: "00144080",
        vr: "SQ",
        vm: "1",
    },
    DriveType: {
        tag: "00144081",
        vr: "CS",
        vm: "1",
    },
    ProbeDriveNotes: {
        tag: "00144082",
        vr: "LT",
        vm: "1",
    },
    DriveProbeSequence: {
        tag: "00144083",
        vr: "SQ",
        vm: "1",
    },
    ProbeInductance: {
        tag: "00144084",
        vr: "DS",
        vm: "1",
    },
    ProbeResistance: {
        tag: "00144085",
        vr: "DS",
        vm: "1",
    },
    ReceiveProbeSequence: {
        tag: "00144086",
        vr: "SQ",
        vm: "1",
    },
    ProbeDriveSettingsSequence: {
        tag: "00144087",
        vr: "SQ",
        vm: "1",
    },
    BridgeResistors: {
        tag: "00144088",
        vr: "DS",
        vm: "1",
    },
    ProbeOrientationAngle: {
        tag: "00144089",
        vr: "DS",
        vm: "1",
    },
    UserSelectedGainY: {
        tag: "0014408B",
        vr: "DS",
        vm: "1",
    },
    UserSelectedPhase: {
        tag: "0014408C",
        vr: "DS",
        vm: "1",
    },
    UserSelectedOffsetX: {
        tag: "0014408D",
        vr: "DS",
        vm: "1",
    },
    UserSelectedOffsetY: {
        tag: "0014408E",
        vr: "DS",
        vm: "1",
    },
    ChannelSettingsSequence: {
        tag: "00144091",
        vr: "SQ",
        vm: "1",
    },
    ChannelThreshold: {
        tag: "00144092",
        vr: "DS",
        vm: "1",
    },
    ScannerSettingsSequence: {
        tag: "0014409A",
        vr: "SQ",
        vm: "1",
    },
    ScanProcedure: {
        tag: "0014409B",
        vr: "ST",
        vm: "1",
    },
    TranslationRateX: {
        tag: "0014409C",
        vr: "DS",
        vm: "1",
    },
    TranslationRateY: {
        tag: "0014409D",
        vr: "DS",
        vm: "1",
    },
    ChannelOverlap: {
        tag: "0014409F",
        vr: "DS",
        vm: "1",
    },
    ImageQualityIndicatorType: {
        tag: "001440A0",
        vr: "LO",
        vm: "1-n",
    },
    ImageQualityIndicatorMaterial: {
        tag: "001440A1",
        vr: "LO",
        vm: "1-n",
    },
    ImageQualityIndicatorSize: {
        tag: "001440A2",
        vr: "LO",
        vm: "1-n",
    },
    WaveDimensionsDefinitionSequence: {
        tag: "00144101",
        vr: "SQ",
        vm: "1",
    },
    WaveDimensionNumber: {
        tag: "00144102",
        vr: "US",
        vm: "1",
    },
    WaveDimensionDescription: {
        tag: "00144103",
        vr: "LO",
        vm: "1",
    },
    WaveDimensionUnit: {
        tag: "00144104",
        vr: "US",
        vm: "1",
    },
    WaveDimensionValueType: {
        tag: "00144105",
        vr: "CS",
        vm: "1",
    },
    WaveDimensionValuesSequence: {
        tag: "00144106",
        vr: "SQ",
        vm: "1-n",
    },
    ReferencedWaveDimension: {
        tag: "00144107",
        vr: "US",
        vm: "1",
    },
    IntegerNumericValue: {
        tag: "00144108",
        vr: "SL",
        vm: "1",
    },
    ByteNumericValue: {
        tag: "00144109",
        vr: "OB",
        vm: "1",
    },
    ShortNumericValue: {
        tag: "0014410A",
        vr: "OW",
        vm: "1",
    },
    SinglePrecisionFloatingPointNumericValue: {
        tag: "0014410B",
        vr: "OF",
        vm: "1",
    },
    DoublePrecisionFloatingPointNumericValue: {
        tag: "0014410C",
        vr: "OD",
        vm: "1",
    },
    LINACEnergy: {
        tag: "00145002",
        vr: "IS",
        vm: "1",
    },
    LINACOutput: {
        tag: "00145004",
        vr: "IS",
        vm: "1",
    },
    ActiveAperture: {
        tag: "00145100",
        vr: "US",
        vm: "1",
    },
    TotalAperture: {
        tag: "00145101",
        vr: "DS",
        vm: "1",
    },
    ApertureElevation: {
        tag: "00145102",
        vr: "DS",
        vm: "1",
    },
    MainLobeAngle: {
        tag: "00145103",
        vr: "DS",
        vm: "1",
    },
    MainRoofAngle: {
        tag: "00145104",
        vr: "DS",
        vm: "1",
    },
    ConnectorType: {
        tag: "00145105",
        vr: "CS",
        vm: "1",
    },
    WedgeModelNumber: {
        tag: "00145106",
        vr: "SH",
        vm: "1",
    },
    WedgeAngleFloat: {
        tag: "00145107",
        vr: "DS",
        vm: "1",
    },
    WedgeRoofAngle: {
        tag: "00145108",
        vr: "DS",
        vm: "1",
    },
    WedgeElement1Position: {
        tag: "00145109",
        vr: "CS",
        vm: "1",
    },
    WedgeMaterialVelocity: {
        tag: "0014510A",
        vr: "DS",
        vm: "1",
    },
    WedgeMaterial: {
        tag: "0014510B",
        vr: "SH",
        vm: "1",
    },
    WedgeOffsetZ: {
        tag: "0014510C",
        vr: "DS",
        vm: "1",
    },
    WedgeOriginOffsetX: {
        tag: "0014510D",
        vr: "DS",
        vm: "1",
    },
    WedgeTimeDelay: {
        tag: "0014510E",
        vr: "DS",
        vm: "1",
    },
    WedgeName: {
        tag: "0014510F",
        vr: "SH",
        vm: "1",
    },
    WedgeManufacturerName: {
        tag: "00145110",
        vr: "SH",
        vm: "1",
    },
    WedgeDescription: {
        tag: "00145111",
        vr: "LO",
        vm: "1",
    },
    NominalBeamAngle: {
        tag: "00145112",
        vr: "DS",
        vm: "1",
    },
    WedgeOffsetX: {
        tag: "00145113",
        vr: "DS",
        vm: "1",
    },
    WedgeOffsetY: {
        tag: "00145114",
        vr: "DS",
        vm: "1",
    },
    WedgeTotalLength: {
        tag: "00145115",
        vr: "DS",
        vm: "1",
    },
    WedgeInContactLength: {
        tag: "00145116",
        vr: "DS",
        vm: "1",
    },
    WedgeFrontGap: {
        tag: "00145117",
        vr: "DS",
        vm: "1",
    },
    WedgeTotalHeight: {
        tag: "00145118",
        vr: "DS",
        vm: "1",
    },
    WedgeFrontHeight: {
        tag: "00145119",
        vr: "DS",
        vm: "1",
    },
    WedgeRearHeight: {
        tag: "0014511A",
        vr: "DS",
        vm: "1",
    },
    WedgeTotalWidth: {
        tag: "0014511B",
        vr: "DS",
        vm: "1",
    },
    WedgeInContactWidth: {
        tag: "0014511C",
        vr: "DS",
        vm: "1",
    },
    WedgeChamferHeight: {
        tag: "0014511D",
        vr: "DS",
        vm: "1",
    },
    WedgeCurve: {
        tag: "0014511E",
        vr: "CS",
        vm: "1",
    },
    RadiusAlongWedge: {
        tag: "0014511F",
        vr: "DS",
        vm: "1",
    },
    ThermalCameraSettingsSequence: {
        tag: "00146001",
        vr: "SQ",
        vm: "1",
    },
    AcquisitionFrameRate: {
        tag: "00146002",
        vr: "DS",
        vm: "1",
    },
    IntegrationTime: {
        tag: "00146003",
        vr: "DS",
        vm: "1",
    },
    NumberOfCalibrationFrames: {
        tag: "00146004",
        vr: "DS",
        vm: "1",
    },
    NumberOfRowsInFullAcquisitionImage: {
        tag: "00146005",
        vr: "DS",
        vm: "1",
    },
    NumberOfColumnsInFullAcquisitionImage: {
        tag: "00146006",
        vr: "DS",
        vm: "1",
    },
    ThermalSourceSettingsSequence: {
        tag: "00146007",
        vr: "SQ",
        vm: "1",
    },
    SourceHorizontalPitch: {
        tag: "00146008",
        vr: "DS",
        vm: "1",
    },
    SourceVerticalPitch: {
        tag: "00146009",
        vr: "DS",
        vm: "1",
    },
    SourceHorizontalScanSpeed: {
        tag: "0014600A",
        vr: "DS",
        vm: "1",
    },
    ThermalSourceModulationFrequency: {
        tag: "0014600B",
        vr: "DS",
        vm: "1",
    },
    InductionSourceSettingSequence: {
        tag: "0014600C",
        vr: "SQ",
        vm: "1",
    },
    CoilFrequency: {
        tag: "0014600D",
        vr: "DS",
        vm: "1",
    },
    CurrentAmplitudeAcrossCoil: {
        tag: "0014600E",
        vr: "DS",
        vm: "1",
    },
    FlashSourceSettingSequence: {
        tag: "0014600F",
        vr: "SQ",
        vm: "1",
    },
    FlashDuration: {
        tag: "00146010",
        vr: "DS",
        vm: "1",
    },
    FlashFrameNumber: {
        tag: "00146011",
        vr: "DS",
        vm: "1-n",
    },
    LaserSourceSettingSequence: {
        tag: "00146012",
        vr: "SQ",
        vm: "1",
    },
    HorizontalLaserSpotDimension: {
        tag: "00146013",
        vr: "DS",
        vm: "1",
    },
    VerticalLaserSpotDimension: {
        tag: "00146014",
        vr: "DS",
        vm: "1",
    },
    LaserWavelength: {
        tag: "00146015",
        vr: "DS",
        vm: "1",
    },
    LaserPower: {
        tag: "00146016",
        vr: "DS",
        vm: "1",
    },
    ForcedGasSettingSequence: {
        tag: "00146017",
        vr: "SQ",
        vm: "1",
    },
    VibrationSourceSettingSequence: {
        tag: "00146018",
        vr: "SQ",
        vm: "1",
    },
    VibrationExcitationFrequency: {
        tag: "00146019",
        vr: "DS",
        vm: "1",
    },
    VibrationExcitationVoltage: {
        tag: "0014601A",
        vr: "DS",
        vm: "1",
    },
    ThermographyDataCaptureMethod: {
        tag: "0014601B",
        vr: "CS",
        vm: "1",
    },
    ThermalTechnique: {
        tag: "0014601C",
        vr: "CS",
        vm: "1",
    },
    ThermalCameraCoreSequence: {
        tag: "0014601D",
        vr: "SQ",
        vm: "1",
    },
    DetectorWavelengthRange: {
        tag: "0014601E",
        vr: "CS",
        vm: "1",
    },
    ThermalCameraCalibrationType: {
        tag: "0014601F",
        vr: "CS",
        vm: "1",
    },
    AcquisitionImageCounter: {
        tag: "00146020",
        vr: "UV",
        vm: "1",
    },
    FrontPanelTemperature: {
        tag: "00146021",
        vr: "DS",
        vm: "1",
    },
    AirGapTemperature: {
        tag: "00146022",
        vr: "DS",
        vm: "1",
    },
    VerticalPixelSize: {
        tag: "00146023",
        vr: "DS",
        vm: "1",
    },
    HorizontalPixelSize: {
        tag: "00146024",
        vr: "DS",
        vm: "1",
    },
    DataStreamingProtocol: {
        tag: "00146025",
        vr: "ST",
        vm: "1-n",
    },
    LensSequence: {
        tag: "00146026",
        vr: "SQ",
        vm: "1",
    },
    FieldOfView: {
        tag: "00146027",
        vr: "DS",
        vm: "1",
    },
    LensFilterManufacturer: {
        tag: "00146028",
        vr: "LO",
        vm: "1",
    },
    CutoffFilterType: {
        tag: "00146029",
        vr: "CS",
        vm: "1",
    },
    LensFilterCutOffWavelength: {
        tag: "0014602A",
        vr: "DS",
        vm: "1-n",
    },
    ThermalSourceSequence: {
        tag: "0014602B",
        vr: "SQ",
        vm: "1",
    },
    ThermalSourceMotionState: {
        tag: "0014602C",
        vr: "CS",
        vm: "1",
    },
    ThermalSourceMotionType: {
        tag: "0014602D",
        vr: "CS",
        vm: "1",
    },
    InductionHeatingSequence: {
        tag: "0014602E",
        vr: "SQ",
        vm: "1",
    },
    CoilConfigurationID: {
        tag: "0014602F",
        vr: "ST",
        vm: "1",
    },
    NumberOfTurnsInCoil: {
        tag: "00146030",
        vr: "DS",
        vm: "1",
    },
    ShapeOfIndividualTurn: {
        tag: "00146031",
        vr: "CS",
        vm: "1",
    },
    SizeOfIndividualTurn: {
        tag: "00146032",
        vr: "DS",
        vm: "1-n",
    },
    DistanceBetweenTurns: {
        tag: "00146033",
        vr: "DS",
        vm: "1-n",
    },
    FlashHeatingSequence: {
        tag: "00146034",
        vr: "SQ",
        vm: "1",
    },
    NumberOfLamps: {
        tag: "00146035",
        vr: "DS",
        vm: "1",
    },
    FlashSynchronizationProtocol: {
        tag: "00146036",
        vr: "ST",
        vm: "1",
    },
    FlashModificationStatus: {
        tag: "00146037",
        vr: "CS",
        vm: "1",
    },
    LaserHeatingSequence: {
        tag: "00146038",
        vr: "SQ",
        vm: "1",
    },
    LaserManufacturer: {
        tag: "00146039",
        vr: "LO",
        vm: "1",
    },
    LaserModelNumber: {
        tag: "0014603A",
        vr: "LO",
        vm: "1",
    },
    LaserTypeDescription: {
        tag: "0014603B",
        vr: "ST",
        vm: "1",
    },
    ForcedGasHeatingSequence: {
        tag: "0014603C",
        vr: "SQ",
        vm: "1",
    },
    GasUsedForHeatingCoolingPart: {
        tag: "0014603D",
        vr: "LO",
        vm: "1",
    },
    VibrationSonicHeatingSequence: {
        tag: "0014603E",
        vr: "SQ",
        vm: "1",
    },
    ProbeManufacturer: {
        tag: "0014603F",
        vr: "LO",
        vm: "1",
    },
    ProbeModelNumber: {
        tag: "00146040",
        vr: "LO",
        vm: "1",
    },
    ApertureSize: {
        tag: "00146041",
        vr: "DS",
        vm: "1",
    },
    ProbeResonantFrequency: {
        tag: "00146042",
        vr: "DS",
        vm: "1",
    },
    HeatSourceDescription: {
        tag: "00146043",
        vr: "UT",
        vm: "1",
    },
    SurfacePreparationWithOpticalCoating: {
        tag: "00146044",
        vr: "CS",
        vm: "1",
    },
    OpticalCoatingType: {
        tag: "00146045",
        vr: "ST",
        vm: "1",
    },
    ThermalConductivityOfExposedSurface: {
        tag: "00146046",
        vr: "DS",
        vm: "1",
    },
    MaterialDensity: {
        tag: "00146047",
        vr: "DS",
        vm: "1",
    },
    SpecificHeatOfInspectionSurface: {
        tag: "00146048",
        vr: "DS",
        vm: "1",
    },
    EmissivityOfInspectionSurface: {
        tag: "00146049",
        vr: "DS",
        vm: "1",
    },
    ElectromagneticClassificationOfInspectionSurface: {
        tag: "0014604A",
        vr: "CS",
        vm: "1-n",
    },
    MovingWindowSize: {
        tag: "0014604C",
        vr: "DS",
        vm: "1",
    },
    MovingWindowType: {
        tag: "0014604D",
        vr: "CS",
        vm: "1",
    },
    MovingWindowWeights: {
        tag: "0014604E",
        vr: "DS",
        vm: "1-n",
    },
    MovingWindowPitch: {
        tag: "0014604F",
        vr: "DS",
        vm: "1",
    },
    MovingWindowPaddingScheme: {
        tag: "00146050",
        vr: "CS",
        vm: "1",
    },
    MovingWindowPaddingLength: {
        tag: "00146051",
        vr: "DS",
        vm: "1",
    },
    SpatialFilteringParametersSequence: {
        tag: "00146052",
        vr: "SQ",
        vm: "1",
    },
    SpatialFilteringScheme: {
        tag: "00146053",
        vr: "CS",
        vm: "1",
    },
    HorizontalMovingWindowSize: {
        tag: "00146056",
        vr: "DS",
        vm: "1",
    },
    VerticalMovingWindowSize: {
        tag: "00146057",
        vr: "DS",
        vm: "1",
    },
    PolynomialFittingSequence: {
        tag: "00146059",
        vr: "SQ",
        vm: "1",
    },
    FittingDataType: {
        tag: "0014605A",
        vr: "CS",
        vm: "1-n",
    },
    OperationOnTimeAxisBeforeFitting: {
        tag: "0014605B",
        vr: "CS",
        vm: "1",
    },
    OperationOnPixelIntensityBeforeFitting: {
        tag: "0014605C",
        vr: "CS",
        vm: "1",
    },
    OrderOfPolynomial: {
        tag: "0014605D",
        vr: "DS",
        vm: "1",
    },
    IndependentVariableForPolynomialFit: {
        tag: "0014605E",
        vr: "CS",
        vm: "1",
    },
    PolynomialCoefficients: {
        tag: "0014605F",
        vr: "DS",
        vm: "1-n",
    },
    ThermographyPixelDataUnit: {
        tag: "00146060",
        vr: "CS",
        vm: "1",
    },
    WhitePoint: {
        tag: "00160001",
        vr: "DS",
        vm: "1",
    },
    PrimaryChromaticities: {
        tag: "00160002",
        vr: "DS",
        vm: "3",
    },
    BatteryLevel: {
        tag: "00160003",
        vr: "UT",
        vm: "1",
    },
    ExposureTimeInSeconds: {
        tag: "00160004",
        vr: "DS",
        vm: "1",
    },
    FNumber: {
        tag: "00160005",
        vr: "DS",
        vm: "1",
    },
    OECFRows: {
        tag: "00160006",
        vr: "IS",
        vm: "1",
    },
    OECFColumns: {
        tag: "00160007",
        vr: "IS",
        vm: "1",
    },
    OECFColumnNames: {
        tag: "00160008",
        vr: "UC",
        vm: "1-n",
    },
    OECFValues: {
        tag: "00160009",
        vr: "DS",
        vm: "1-n",
    },
    SpatialFrequencyResponseRows: {
        tag: "0016000A",
        vr: "IS",
        vm: "1",
    },
    SpatialFrequencyResponseColumns: {
        tag: "0016000B",
        vr: "IS",
        vm: "1",
    },
    SpatialFrequencyResponseColumnNames: {
        tag: "0016000C",
        vr: "UC",
        vm: "1-n",
    },
    SpatialFrequencyResponseValues: {
        tag: "0016000D",
        vr: "DS",
        vm: "1-n",
    },
    ColorFilterArrayPatternRows: {
        tag: "0016000E",
        vr: "IS",
        vm: "1",
    },
    ColorFilterArrayPatternColumns: {
        tag: "0016000F",
        vr: "IS",
        vm: "1",
    },
    ColorFilterArrayPatternValues: {
        tag: "00160010",
        vr: "DS",
        vm: "1-n",
    },
    FlashFiringStatus: {
        tag: "00160011",
        vr: "US",
        vm: "1",
    },
    FlashReturnStatus: {
        tag: "00160012",
        vr: "US",
        vm: "1",
    },
    FlashMode: {
        tag: "00160013",
        vr: "US",
        vm: "1",
    },
    FlashFunctionPresent: {
        tag: "00160014",
        vr: "US",
        vm: "1",
    },
    FlashRedEyeMode: {
        tag: "00160015",
        vr: "US",
        vm: "1",
    },
    ExposureProgram: {
        tag: "00160016",
        vr: "US",
        vm: "1",
    },
    SpectralSensitivity: {
        tag: "00160017",
        vr: "UT",
        vm: "1",
    },
    PhotographicSensitivity: {
        tag: "00160018",
        vr: "IS",
        vm: "1",
    },
    SelfTimerMode: {
        tag: "00160019",
        vr: "IS",
        vm: "1",
    },
    SensitivityType: {
        tag: "0016001A",
        vr: "US",
        vm: "1",
    },
    StandardOutputSensitivity: {
        tag: "0016001B",
        vr: "IS",
        vm: "1",
    },
    RecommendedExposureIndex: {
        tag: "0016001C",
        vr: "IS",
        vm: "1",
    },
    ISOSpeed: {
        tag: "0016001D",
        vr: "IS",
        vm: "1",
    },
    ISOSpeedLatitudeyyy: {
        tag: "0016001E",
        vr: "IS",
        vm: "1",
    },
    ISOSpeedLatitudezzz: {
        tag: "0016001F",
        vr: "IS",
        vm: "1",
    },
    EXIFVersion: {
        tag: "00160020",
        vr: "UT",
        vm: "1",
    },
    ShutterSpeedValue: {
        tag: "00160021",
        vr: "DS",
        vm: "1",
    },
    ApertureValue: {
        tag: "00160022",
        vr: "DS",
        vm: "1",
    },
    BrightnessValue: {
        tag: "00160023",
        vr: "DS",
        vm: "1",
    },
    ExposureBiasValue: {
        tag: "00160024",
        vr: "DS",
        vm: "1",
    },
    MaxApertureValue: {
        tag: "00160025",
        vr: "DS",
        vm: "1",
    },
    SubjectDistance: {
        tag: "00160026",
        vr: "DS",
        vm: "1",
    },
    MeteringMode: {
        tag: "00160027",
        vr: "US",
        vm: "1",
    },
    LightSource: {
        tag: "00160028",
        vr: "US",
        vm: "1",
    },
    FocalLength: {
        tag: "00160029",
        vr: "DS",
        vm: "1",
    },
    SubjectArea: {
        tag: "0016002A",
        vr: "IS",
        vm: "2-4",
    },
    MakerNote: {
        tag: "0016002B",
        vr: "OB",
        vm: "1",
    },
    Temperature: {
        tag: "00160030",
        vr: "DS",
        vm: "1",
    },
    Humidity: {
        tag: "00160031",
        vr: "DS",
        vm: "1",
    },
    Pressure: {
        tag: "00160032",
        vr: "DS",
        vm: "1",
    },
    WaterDepth: {
        tag: "00160033",
        vr: "DS",
        vm: "1",
    },
    Acceleration: {
        tag: "00160034",
        vr: "DS",
        vm: "1",
    },
    CameraElevationAngle: {
        tag: "00160035",
        vr: "DS",
        vm: "1",
    },
    FlashEnergy: {
        tag: "00160036",
        vr: "DS",
        vm: "1-2",
    },
    SubjectLocation: {
        tag: "00160037",
        vr: "IS",
        vm: "2",
    },
    PhotographicExposureIndex: {
        tag: "00160038",
        vr: "DS",
        vm: "1",
    },
    SensingMethod: {
        tag: "00160039",
        vr: "US",
        vm: "1",
    },
    FileSource: {
        tag: "0016003A",
        vr: "US",
        vm: "1",
    },
    SceneType: {
        tag: "0016003B",
        vr: "US",
        vm: "1",
    },
    CustomRendered: {
        tag: "00160041",
        vr: "US",
        vm: "1",
    },
    ExposureMode: {
        tag: "00160042",
        vr: "US",
        vm: "1",
    },
    WhiteBalance: {
        tag: "00160043",
        vr: "US",
        vm: "1",
    },
    DigitalZoomRatio: {
        tag: "00160044",
        vr: "DS",
        vm: "1",
    },
    FocalLengthIn35mmFilm: {
        tag: "00160045",
        vr: "IS",
        vm: "1",
    },
    SceneCaptureType: {
        tag: "00160046",
        vr: "US",
        vm: "1",
    },
    GainControl: {
        tag: "00160047",
        vr: "US",
        vm: "1",
    },
    Contrast: {
        tag: "00160048",
        vr: "US",
        vm: "1",
    },
    Saturation: {
        tag: "00160049",
        vr: "US",
        vm: "1",
    },
    Sharpness: {
        tag: "0016004A",
        vr: "US",
        vm: "1",
    },
    DeviceSettingDescription: {
        tag: "0016004B",
        vr: "OB",
        vm: "1",
    },
    SubjectDistanceRange: {
        tag: "0016004C",
        vr: "US",
        vm: "1",
    },
    CameraOwnerName: {
        tag: "0016004D",
        vr: "UT",
        vm: "1",
    },
    LensSpecification: {
        tag: "0016004E",
        vr: "DS",
        vm: "4",
    },
    LensMake: {
        tag: "0016004F",
        vr: "UT",
        vm: "1",
    },
    LensModel: {
        tag: "00160050",
        vr: "UT",
        vm: "1",
    },
    LensSerialNumber: {
        tag: "00160051",
        vr: "UT",
        vm: "1",
    },
    InteroperabilityIndex: {
        tag: "00160061",
        vr: "CS",
        vm: "1",
    },
    InteroperabilityVersion: {
        tag: "00160062",
        vr: "OB",
        vm: "1",
    },
    GPSVersionID: {
        tag: "00160070",
        vr: "OB",
        vm: "1",
    },
    GPSLatitudeRef: {
        tag: "00160071",
        vr: "CS",
        vm: "1",
    },
    GPSLatitude: {
        tag: "00160072",
        vr: "DS",
        vm: "3",
    },
    GPSLongitudeRef: {
        tag: "00160073",
        vr: "CS",
        vm: "1",
    },
    GPSLongitude: {
        tag: "00160074",
        vr: "DS",
        vm: "3",
    },
    GPSAltitudeRef: {
        tag: "00160075",
        vr: "US",
        vm: "1",
    },
    GPSAltitude: {
        tag: "00160076",
        vr: "DS",
        vm: "1",
    },
    GPSTimeStamp: {
        tag: "00160077",
        vr: "DT",
        vm: "1",
    },
    GPSSatellites: {
        tag: "00160078",
        vr: "UT",
        vm: "1",
    },
    GPSStatus: {
        tag: "00160079",
        vr: "CS",
        vm: "1",
    },
    GPSMeasureMode: {
        tag: "0016007A",
        vr: "CS",
        vm: "1",
    },
    GPSDOP: {
        tag: "0016007B",
        vr: "DS",
        vm: "1",
    },
    GPSSpeedRef: {
        tag: "0016007C",
        vr: "CS",
        vm: "1",
    },
    GPSSpeed: {
        tag: "0016007D",
        vr: "DS",
        vm: "1",
    },
    GPSTrackRef: {
        tag: "0016007E",
        vr: "CS",
        vm: "1",
    },
    GPSTrack: {
        tag: "0016007F",
        vr: "DS",
        vm: "1",
    },
    GPSImgDirectionRef: {
        tag: "00160080",
        vr: "CS",
        vm: "1",
    },
    GPSImgDirection: {
        tag: "00160081",
        vr: "DS",
        vm: "1",
    },
    GPSMapDatum: {
        tag: "00160082",
        vr: "UT",
        vm: "1",
    },
    GPSDestLatitudeRef: {
        tag: "00160083",
        vr: "CS",
        vm: "1",
    },
    GPSDestLatitude: {
        tag: "00160084",
        vr: "DS",
        vm: "3",
    },
    GPSDestLongitudeRef: {
        tag: "00160085",
        vr: "CS",
        vm: "1",
    },
    GPSDestLongitude: {
        tag: "00160086",
        vr: "DS",
        vm: "3",
    },
    GPSDestBearingRef: {
        tag: "00160087",
        vr: "CS",
        vm: "1",
    },
    GPSDestBearing: {
        tag: "00160088",
        vr: "DS",
        vm: "1",
    },
    GPSDestDistanceRef: {
        tag: "00160089",
        vr: "CS",
        vm: "1",
    },
    GPSDestDistance: {
        tag: "0016008A",
        vr: "DS",
        vm: "1",
    },
    GPSProcessingMethod: {
        tag: "0016008B",
        vr: "OB",
        vm: "1",
    },
    GPSAreaInformation: {
        tag: "0016008C",
        vr: "OB",
        vm: "1",
    },
    GPSDateStamp: {
        tag: "0016008D",
        vr: "DT",
        vm: "1",
    },
    GPSDifferential: {
        tag: "0016008E",
        vr: "IS",
        vm: "1",
    },
    LightSourcePolarization: {
        tag: "00161001",
        vr: "CS",
        vm: "1",
    },
    EmitterColorTemperature: {
        tag: "00161002",
        vr: "DS",
        vm: "1",
    },
    ContactMethod: {
        tag: "00161003",
        vr: "CS",
        vm: "1",
    },
    ImmersionMedia: {
        tag: "00161004",
        vr: "CS",
        vm: "1-n",
    },
    OpticalMagnificationFactor: {
        tag: "00161005",
        vr: "DS",
        vm: "1",
    },
    ContrastBolusAgent: {
        tag: "00180010",
        vr: "LO",
        vm: "1",
    },
    ContrastBolusAgentSequence: {
        tag: "00180012",
        vr: "SQ",
        vm: "1",
    },
    ContrastBolusT1Relaxivity: {
        tag: "00180013",
        vr: "FL",
        vm: "1",
    },
    ContrastBolusAdministrationRouteSequence: {
        tag: "00180014",
        vr: "SQ",
        vm: "1",
    },
    BodyPartExamined: {
        tag: "00180015",
        vr: "CS",
        vm: "1",
    },
    ScanningSequence: {
        tag: "00180020",
        vr: "CS",
        vm: "1-n",
    },
    SequenceVariant: {
        tag: "00180021",
        vr: "CS",
        vm: "1-n",
    },
    ScanOptions: {
        tag: "00180022",
        vr: "CS",
        vm: "1-n",
    },
    MRAcquisitionType: {
        tag: "00180023",
        vr: "CS",
        vm: "1",
    },
    SequenceName: {
        tag: "00180024",
        vr: "SH",
        vm: "1",
    },
    AngioFlag: {
        tag: "00180025",
        vr: "CS",
        vm: "1",
    },
    InterventionDrugInformationSequence: {
        tag: "00180026",
        vr: "SQ",
        vm: "1",
    },
    InterventionDrugStopTime: {
        tag: "00180027",
        vr: "TM",
        vm: "1",
    },
    InterventionDrugDose: {
        tag: "00180028",
        vr: "DS",
        vm: "1",
    },
    InterventionDrugCodeSequence: {
        tag: "00180029",
        vr: "SQ",
        vm: "1",
    },
    AdditionalDrugSequence: {
        tag: "0018002A",
        vr: "SQ",
        vm: "1",
    },
    Radionuclide: {
        tag: "00180030",
        vr: "LO",
        vm: "1-n",
    },
    Radiopharmaceutical: {
        tag: "00180031",
        vr: "LO",
        vm: "1",
    },
    EnergyWindowCenterline: {
        tag: "00180032",
        vr: "DS",
        vm: "1",
    },
    EnergyWindowTotalWidth: {
        tag: "00180033",
        vr: "DS",
        vm: "1-n",
    },
    InterventionDrugName: {
        tag: "00180034",
        vr: "LO",
        vm: "1",
    },
    InterventionDrugStartTime: {
        tag: "00180035",
        vr: "TM",
        vm: "1",
    },
    InterventionSequence: {
        tag: "00180036",
        vr: "SQ",
        vm: "1",
    },
    TherapyType: {
        tag: "00180037",
        vr: "CS",
        vm: "1",
    },
    InterventionStatus: {
        tag: "00180038",
        vr: "CS",
        vm: "1",
    },
    TherapyDescription: {
        tag: "00180039",
        vr: "CS",
        vm: "1",
    },
    InterventionDescription: {
        tag: "0018003A",
        vr: "ST",
        vm: "1",
    },
    CineRate: {
        tag: "00180040",
        vr: "IS",
        vm: "1",
    },
    InitialCineRunState: {
        tag: "00180042",
        vr: "CS",
        vm: "1",
    },
    SliceThickness: {
        tag: "00180050",
        vr: "DS",
        vm: "1",
    },
    KVP: {
        tag: "00180060",
        vr: "DS",
        vm: "1",
    },
    CountsAccumulated: {
        tag: "00180070",
        vr: "IS",
        vm: "1",
    },
    AcquisitionTerminationCondition: {
        tag: "00180071",
        vr: "CS",
        vm: "1",
    },
    EffectiveDuration: {
        tag: "00180072",
        vr: "DS",
        vm: "1",
    },
    AcquisitionStartCondition: {
        tag: "00180073",
        vr: "CS",
        vm: "1",
    },
    AcquisitionStartConditionData: {
        tag: "00180074",
        vr: "IS",
        vm: "1",
    },
    AcquisitionTerminationConditionData: {
        tag: "00180075",
        vr: "IS",
        vm: "1",
    },
    RepetitionTime: {
        tag: "00180080",
        vr: "DS",
        vm: "1",
    },
    EchoTime: {
        tag: "00180081",
        vr: "DS",
        vm: "1",
    },
    InversionTime: {
        tag: "00180082",
        vr: "DS",
        vm: "1",
    },
    NumberOfAverages: {
        tag: "00180083",
        vr: "DS",
        vm: "1",
    },
    ImagingFrequency: {
        tag: "00180084",
        vr: "DS",
        vm: "1",
    },
    ImagedNucleus: {
        tag: "00180085",
        vr: "SH",
        vm: "1",
    },
    EchoNumbers: {
        tag: "00180086",
        vr: "IS",
        vm: "1-n",
    },
    MagneticFieldStrength: {
        tag: "00180087",
        vr: "DS",
        vm: "1",
    },
    SpacingBetweenSlices: {
        tag: "00180088",
        vr: "DS",
        vm: "1",
    },
    NumberOfPhaseEncodingSteps: {
        tag: "00180089",
        vr: "IS",
        vm: "1",
    },
    DataCollectionDiameter: {
        tag: "00180090",
        vr: "DS",
        vm: "1",
    },
    EchoTrainLength: {
        tag: "00180091",
        vr: "IS",
        vm: "1",
    },
    PercentSampling: {
        tag: "00180093",
        vr: "DS",
        vm: "1",
    },
    PercentPhaseFieldOfView: {
        tag: "00180094",
        vr: "DS",
        vm: "1",
    },
    PixelBandwidth: {
        tag: "00180095",
        vr: "DS",
        vm: "1",
    },
    DeviceSerialNumber: {
        tag: "00181000",
        vr: "LO",
        vm: "1",
    },
    DeviceUID: {
        tag: "00181002",
        vr: "UI",
        vm: "1",
    },
    DeviceID: {
        tag: "00181003",
        vr: "LO",
        vm: "1",
    },
    PlateID: {
        tag: "00181004",
        vr: "LO",
        vm: "1",
    },
    GeneratorID: {
        tag: "00181005",
        vr: "LO",
        vm: "1",
    },
    GridID: {
        tag: "00181006",
        vr: "LO",
        vm: "1",
    },
    CassetteID: {
        tag: "00181007",
        vr: "LO",
        vm: "1",
    },
    GantryID: {
        tag: "00181008",
        vr: "LO",
        vm: "1",
    },
    UniqueDeviceIdentifier: {
        tag: "00181009",
        vr: "UT",
        vm: "1",
    },
    UDISequence: {
        tag: "0018100A",
        vr: "SQ",
        vm: "1",
    },
    ManufacturerDeviceClassUID: {
        tag: "0018100B",
        vr: "UI",
        vm: "1-n",
    },
    SecondaryCaptureDeviceID: {
        tag: "00181010",
        vr: "LO",
        vm: "1",
    },
    HardcopyCreationDeviceID: {
        tag: "00181011",
        vr: "LO",
        vm: "1",
    },
    DateOfSecondaryCapture: {
        tag: "00181012",
        vr: "DA",
        vm: "1",
    },
    TimeOfSecondaryCapture: {
        tag: "00181014",
        vr: "TM",
        vm: "1",
    },
    SecondaryCaptureDeviceManufacturer: {
        tag: "00181016",
        vr: "LO",
        vm: "1",
    },
    HardcopyDeviceManufacturer: {
        tag: "00181017",
        vr: "LO",
        vm: "1",
    },
    SecondaryCaptureDeviceManufacturerModelName: {
        tag: "00181018",
        vr: "LO",
        vm: "1",
    },
    SecondaryCaptureDeviceSoftwareVersions: {
        tag: "00181019",
        vr: "LO",
        vm: "1-n",
    },
    HardcopyDeviceSoftwareVersion: {
        tag: "0018101A",
        vr: "LO",
        vm: "1-n",
    },
    HardcopyDeviceManufacturerModelName: {
        tag: "0018101B",
        vr: "LO",
        vm: "1",
    },
    SoftwareVersions: {
        tag: "00181020",
        vr: "LO",
        vm: "1-n",
    },
    VideoImageFormatAcquired: {
        tag: "00181022",
        vr: "SH",
        vm: "1",
    },
    DigitalImageFormatAcquired: {
        tag: "00181023",
        vr: "LO",
        vm: "1",
    },
    ProtocolName: {
        tag: "00181030",
        vr: "LO",
        vm: "1",
    },
    ContrastBolusRoute: {
        tag: "00181040",
        vr: "LO",
        vm: "1",
    },
    ContrastBolusVolume: {
        tag: "00181041",
        vr: "DS",
        vm: "1",
    },
    ContrastBolusStartTime: {
        tag: "00181042",
        vr: "TM",
        vm: "1",
    },
    ContrastBolusStopTime: {
        tag: "00181043",
        vr: "TM",
        vm: "1",
    },
    ContrastBolusTotalDose: {
        tag: "00181044",
        vr: "DS",
        vm: "1",
    },
    SyringeCounts: {
        tag: "00181045",
        vr: "IS",
        vm: "1",
    },
    ContrastFlowRate: {
        tag: "00181046",
        vr: "DS",
        vm: "1-n",
    },
    ContrastFlowDuration: {
        tag: "00181047",
        vr: "DS",
        vm: "1-n",
    },
    ContrastBolusIngredient: {
        tag: "00181048",
        vr: "CS",
        vm: "1",
    },
    ContrastBolusIngredientConcentration: {
        tag: "00181049",
        vr: "DS",
        vm: "1",
    },
    SpatialResolution: {
        tag: "00181050",
        vr: "DS",
        vm: "1",
    },
    TriggerTime: {
        tag: "00181060",
        vr: "DS",
        vm: "1",
    },
    TriggerSourceOrType: {
        tag: "00181061",
        vr: "LO",
        vm: "1",
    },
    NominalInterval: {
        tag: "00181062",
        vr: "IS",
        vm: "1",
    },
    FrameTime: {
        tag: "00181063",
        vr: "DS",
        vm: "1",
    },
    CardiacFramingType: {
        tag: "00181064",
        vr: "LO",
        vm: "1",
    },
    FrameTimeVector: {
        tag: "00181065",
        vr: "DS",
        vm: "1-n",
    },
    FrameDelay: {
        tag: "00181066",
        vr: "DS",
        vm: "1",
    },
    ImageTriggerDelay: {
        tag: "00181067",
        vr: "DS",
        vm: "1",
    },
    MultiplexGroupTimeOffset: {
        tag: "00181068",
        vr: "DS",
        vm: "1",
    },
    TriggerTimeOffset: {
        tag: "00181069",
        vr: "DS",
        vm: "1",
    },
    SynchronizationTrigger: {
        tag: "0018106A",
        vr: "CS",
        vm: "1",
    },
    SynchronizationChannel: {
        tag: "0018106C",
        vr: "US",
        vm: "2",
    },
    TriggerSamplePosition: {
        tag: "0018106E",
        vr: "UL",
        vm: "1",
    },
    RadiopharmaceuticalRoute: {
        tag: "00181070",
        vr: "LO",
        vm: "1",
    },
    RadiopharmaceuticalVolume: {
        tag: "00181071",
        vr: "DS",
        vm: "1",
    },
    RadiopharmaceuticalStartTime: {
        tag: "00181072",
        vr: "TM",
        vm: "1",
    },
    RadiopharmaceuticalStopTime: {
        tag: "00181073",
        vr: "TM",
        vm: "1",
    },
    RadionuclideTotalDose: {
        tag: "00181074",
        vr: "DS",
        vm: "1",
    },
    RadionuclideHalfLife: {
        tag: "00181075",
        vr: "DS",
        vm: "1",
    },
    RadionuclidePositronFraction: {
        tag: "00181076",
        vr: "DS",
        vm: "1",
    },
    RadiopharmaceuticalSpecificActivity: {
        tag: "00181077",
        vr: "DS",
        vm: "1",
    },
    RadiopharmaceuticalStartDateTime: {
        tag: "00181078",
        vr: "DT",
        vm: "1",
    },
    RadiopharmaceuticalStopDateTime: {
        tag: "00181079",
        vr: "DT",
        vm: "1",
    },
    BeatRejectionFlag: {
        tag: "00181080",
        vr: "CS",
        vm: "1",
    },
    LowRRValue: {
        tag: "00181081",
        vr: "IS",
        vm: "1",
    },
    HighRRValue: {
        tag: "00181082",
        vr: "IS",
        vm: "1",
    },
    IntervalsAcquired: {
        tag: "00181083",
        vr: "IS",
        vm: "1",
    },
    IntervalsRejected: {
        tag: "00181084",
        vr: "IS",
        vm: "1",
    },
    PVCRejection: {
        tag: "00181085",
        vr: "LO",
        vm: "1",
    },
    SkipBeats: {
        tag: "00181086",
        vr: "IS",
        vm: "1",
    },
    HeartRate: {
        tag: "00181088",
        vr: "IS",
        vm: "1",
    },
    CardiacNumberOfImages: {
        tag: "00181090",
        vr: "IS",
        vm: "1",
    },
    TriggerWindow: {
        tag: "00181094",
        vr: "IS",
        vm: "1",
    },
    ReconstructionDiameter: {
        tag: "00181100",
        vr: "DS",
        vm: "1",
    },
    DistanceSourceToDetector: {
        tag: "00181110",
        vr: "DS",
        vm: "1",
    },
    DistanceSourceToPatient: {
        tag: "00181111",
        vr: "DS",
        vm: "1",
    },
    EstimatedRadiographicMagnificationFactor: {
        tag: "00181114",
        vr: "DS",
        vm: "1",
    },
    GantryDetectorTilt: {
        tag: "00181120",
        vr: "DS",
        vm: "1",
    },
    GantryDetectorSlew: {
        tag: "00181121",
        vr: "DS",
        vm: "1",
    },
    TableHeight: {
        tag: "00181130",
        vr: "DS",
        vm: "1",
    },
    TableTraverse: {
        tag: "00181131",
        vr: "DS",
        vm: "1",
    },
    TableMotion: {
        tag: "00181134",
        vr: "CS",
        vm: "1",
    },
    TableVerticalIncrement: {
        tag: "00181135",
        vr: "DS",
        vm: "1-n",
    },
    TableLateralIncrement: {
        tag: "00181136",
        vr: "DS",
        vm: "1-n",
    },
    TableLongitudinalIncrement: {
        tag: "00181137",
        vr: "DS",
        vm: "1-n",
    },
    TableAngle: {
        tag: "00181138",
        vr: "DS",
        vm: "1",
    },
    TableType: {
        tag: "0018113A",
        vr: "CS",
        vm: "1",
    },
    RotationDirection: {
        tag: "00181140",
        vr: "CS",
        vm: "1",
    },
    AngularPosition: {
        tag: "00181141",
        vr: "DS",
        vm: "1",
    },
    RadialPosition: {
        tag: "00181142",
        vr: "DS",
        vm: "1-n",
    },
    ScanArc: {
        tag: "00181143",
        vr: "DS",
        vm: "1",
    },
    AngularStep: {
        tag: "00181144",
        vr: "DS",
        vm: "1",
    },
    CenterOfRotationOffset: {
        tag: "00181145",
        vr: "DS",
        vm: "1",
    },
    RotationOffset: {
        tag: "00181146",
        vr: "DS",
        vm: "1-n",
    },
    FieldOfViewShape: {
        tag: "00181147",
        vr: "CS",
        vm: "1",
    },
    FieldOfViewDimensions: {
        tag: "00181149",
        vr: "IS",
        vm: "1-2",
    },
    ExposureTime: {
        tag: "00181150",
        vr: "IS",
        vm: "1",
    },
    XRayTubeCurrent: {
        tag: "00181151",
        vr: "IS",
        vm: "1",
    },
    Exposure: {
        tag: "00181152",
        vr: "IS",
        vm: "1",
    },
    ExposureInuAs: {
        tag: "00181153",
        vr: "IS",
        vm: "1",
    },
    AveragePulseWidth: {
        tag: "00181154",
        vr: "DS",
        vm: "1",
    },
    RadiationSetting: {
        tag: "00181155",
        vr: "CS",
        vm: "1",
    },
    RectificationType: {
        tag: "00181156",
        vr: "CS",
        vm: "1",
    },
    RadiationMode: {
        tag: "0018115A",
        vr: "CS",
        vm: "1",
    },
    ImageAndFluoroscopyAreaDoseProduct: {
        tag: "0018115E",
        vr: "DS",
        vm: "1",
    },
    FilterType: {
        tag: "00181160",
        vr: "SH",
        vm: "1",
    },
    TypeOfFilters: {
        tag: "00181161",
        vr: "LO",
        vm: "1-n",
    },
    IntensifierSize: {
        tag: "00181162",
        vr: "DS",
        vm: "1",
    },
    ImagerPixelSpacing: {
        tag: "00181164",
        vr: "DS",
        vm: "2",
    },
    Grid: {
        tag: "00181166",
        vr: "CS",
        vm: "1-n",
    },
    GeneratorPower: {
        tag: "00181170",
        vr: "IS",
        vm: "1",
    },
    CollimatorGridName: {
        tag: "00181180",
        vr: "SH",
        vm: "1",
    },
    CollimatorType: {
        tag: "00181181",
        vr: "CS",
        vm: "1",
    },
    FocalDistance: {
        tag: "00181182",
        vr: "IS",
        vm: "1-2",
    },
    XFocusCenter: {
        tag: "00181183",
        vr: "DS",
        vm: "1-2",
    },
    YFocusCenter: {
        tag: "00181184",
        vr: "DS",
        vm: "1-2",
    },
    FocalSpots: {
        tag: "00181190",
        vr: "DS",
        vm: "1-n",
    },
    AnodeTargetMaterial: {
        tag: "00181191",
        vr: "CS",
        vm: "1",
    },
    BodyPartThickness: {
        tag: "001811A0",
        vr: "DS",
        vm: "1",
    },
    CompressionForce: {
        tag: "001811A2",
        vr: "DS",
        vm: "1",
    },
    CompressionPressure: {
        tag: "001811A3",
        vr: "DS",
        vm: "1",
    },
    PaddleDescription: {
        tag: "001811A4",
        vr: "LO",
        vm: "1",
    },
    CompressionContactArea: {
        tag: "001811A5",
        vr: "DS",
        vm: "1",
    },
    AcquisitionMode: {
        tag: "001811B0",
        vr: "LO",
        vm: "1",
    },
    DoseModeName: {
        tag: "001811B1",
        vr: "LO",
        vm: "1",
    },
    AcquiredSubtractionMaskFlag: {
        tag: "001811B2",
        vr: "CS",
        vm: "1",
    },
    FluoroscopyPersistenceFlag: {
        tag: "001811B3",
        vr: "CS",
        vm: "1",
    },
    FluoroscopyLastImageHoldPersistenceFlag: {
        tag: "001811B4",
        vr: "CS",
        vm: "1",
    },
    UpperLimitNumberOfPersistentFluoroscopyFrames: {
        tag: "001811B5",
        vr: "IS",
        vm: "1",
    },
    ContrastBolusAutoInjectionTriggerFlag: {
        tag: "001811B6",
        vr: "CS",
        vm: "1",
    },
    ContrastBolusInjectionDelay: {
        tag: "001811B7",
        vr: "FD",
        vm: "1",
    },
    XAAcquisitionPhaseDetailsSequence: {
        tag: "001811B8",
        vr: "SQ",
        vm: "1",
    },
    XAAcquisitionFrameRate: {
        tag: "001811B9",
        vr: "FD",
        vm: "1",
    },
    XAPlaneDetailsSequence: {
        tag: "001811BA",
        vr: "SQ",
        vm: "1",
    },
    AcquisitionFieldOfViewLabel: {
        tag: "001811BB",
        vr: "LO",
        vm: "1",
    },
    XRayFilterDetailsSequence: {
        tag: "001811BC",
        vr: "SQ",
        vm: "1",
    },
    XAAcquisitionDuration: {
        tag: "001811BD",
        vr: "FD",
        vm: "1",
    },
    ReconstructionPipelineType: {
        tag: "001811BE",
        vr: "CS",
        vm: "1",
    },
    ImageFilterDetailsSequence: {
        tag: "001811BF",
        vr: "SQ",
        vm: "1",
    },
    AppliedMaskSubtractionFlag: {
        tag: "001811C0",
        vr: "CS",
        vm: "1",
    },
    RequestedSeriesDescriptionCodeSequence: {
        tag: "001811C1",
        vr: "SQ",
        vm: "1",
    },
    DateOfLastCalibration: {
        tag: "00181200",
        vr: "DA",
        vm: "1-n",
    },
    TimeOfLastCalibration: {
        tag: "00181201",
        vr: "TM",
        vm: "1-n",
    },
    DateTimeOfLastCalibration: {
        tag: "00181202",
        vr: "DT",
        vm: "1",
    },
    CalibrationDateTime: {
        tag: "00181203",
        vr: "DT",
        vm: "1",
    },
    DateOfManufacture: {
        tag: "00181204",
        vr: "DA",
        vm: "1",
    },
    DateOfInstallation: {
        tag: "00181205",
        vr: "DA",
        vm: "1",
    },
    ConvolutionKernel: {
        tag: "00181210",
        vr: "SH",
        vm: "1-n",
    },
    UpperLowerPixelValues: {
        tag: "00181240",
        vr: "IS",
        vm: "1-n",
    },
    ActualFrameDuration: {
        tag: "00181242",
        vr: "IS",
        vm: "1",
    },
    CountRate: {
        tag: "00181243",
        vr: "IS",
        vm: "1",
    },
    PreferredPlaybackSequencing: {
        tag: "00181244",
        vr: "US",
        vm: "1",
    },
    ReceiveCoilName: {
        tag: "00181250",
        vr: "SH",
        vm: "1",
    },
    TransmitCoilName: {
        tag: "00181251",
        vr: "SH",
        vm: "1",
    },
    PlateType: {
        tag: "00181260",
        vr: "SH",
        vm: "1",
    },
    PhosphorType: {
        tag: "00181261",
        vr: "LO",
        vm: "1",
    },
    WaterEquivalentDiameter: {
        tag: "00181271",
        vr: "FD",
        vm: "1",
    },
    WaterEquivalentDiameterCalculationMethodCodeSequence: {
        tag: "00181272",
        vr: "SQ",
        vm: "1",
    },
    ScanVelocity: {
        tag: "00181300",
        vr: "DS",
        vm: "1",
    },
    WholeBodyTechnique: {
        tag: "00181301",
        vr: "CS",
        vm: "1-n",
    },
    ScanLength: {
        tag: "00181302",
        vr: "IS",
        vm: "1",
    },
    AcquisitionMatrix: {
        tag: "00181310",
        vr: "US",
        vm: "4",
    },
    InPlanePhaseEncodingDirection: {
        tag: "00181312",
        vr: "CS",
        vm: "1",
    },
    FlipAngle: {
        tag: "00181314",
        vr: "DS",
        vm: "1",
    },
    VariableFlipAngleFlag: {
        tag: "00181315",
        vr: "CS",
        vm: "1",
    },
    SAR: {
        tag: "00181316",
        vr: "DS",
        vm: "1",
    },
    dBdt: {
        tag: "00181318",
        vr: "DS",
        vm: "1",
    },
    B1rms: {
        tag: "00181320",
        vr: "FL",
        vm: "1",
    },
    AcquisitionDeviceProcessingDescription: {
        tag: "00181400",
        vr: "LO",
        vm: "1",
    },
    AcquisitionDeviceProcessingCode: {
        tag: "00181401",
        vr: "LO",
        vm: "1",
    },
    CassetteOrientation: {
        tag: "00181402",
        vr: "CS",
        vm: "1",
    },
    CassetteSize: {
        tag: "00181403",
        vr: "CS",
        vm: "1",
    },
    ExposuresOnPlate: {
        tag: "00181404",
        vr: "US",
        vm: "1",
    },
    RelativeXRayExposure: {
        tag: "00181405",
        vr: "IS",
        vm: "1",
    },
    ExposureIndex: {
        tag: "00181411",
        vr: "DS",
        vm: "1",
    },
    TargetExposureIndex: {
        tag: "00181412",
        vr: "DS",
        vm: "1",
    },
    DeviationIndex: {
        tag: "00181413",
        vr: "DS",
        vm: "1",
    },
    ColumnAngulation: {
        tag: "00181450",
        vr: "DS",
        vm: "1",
    },
    TomoLayerHeight: {
        tag: "00181460",
        vr: "DS",
        vm: "1",
    },
    TomoAngle: {
        tag: "00181470",
        vr: "DS",
        vm: "1",
    },
    TomoTime: {
        tag: "00181480",
        vr: "DS",
        vm: "1",
    },
    TomoType: {
        tag: "00181490",
        vr: "CS",
        vm: "1",
    },
    TomoClass: {
        tag: "00181491",
        vr: "CS",
        vm: "1",
    },
    NumberOfTomosynthesisSourceImages: {
        tag: "00181495",
        vr: "IS",
        vm: "1",
    },
    PositionerMotion: {
        tag: "00181500",
        vr: "CS",
        vm: "1",
    },
    PositionerType: {
        tag: "00181508",
        vr: "CS",
        vm: "1",
    },
    PositionerPrimaryAngle: {
        tag: "00181510",
        vr: "DS",
        vm: "1",
    },
    PositionerSecondaryAngle: {
        tag: "00181511",
        vr: "DS",
        vm: "1",
    },
    PositionerPrimaryAngleIncrement: {
        tag: "00181520",
        vr: "DS",
        vm: "1-n",
    },
    PositionerSecondaryAngleIncrement: {
        tag: "00181521",
        vr: "DS",
        vm: "1-n",
    },
    DetectorPrimaryAngle: {
        tag: "00181530",
        vr: "DS",
        vm: "1",
    },
    DetectorSecondaryAngle: {
        tag: "00181531",
        vr: "DS",
        vm: "1",
    },
    ShutterShape: {
        tag: "00181600",
        vr: "CS",
        vm: "1-3",
    },
    ShutterLeftVerticalEdge: {
        tag: "00181602",
        vr: "IS",
        vm: "1",
    },
    ShutterRightVerticalEdge: {
        tag: "00181604",
        vr: "IS",
        vm: "1",
    },
    ShutterUpperHorizontalEdge: {
        tag: "00181606",
        vr: "IS",
        vm: "1",
    },
    ShutterLowerHorizontalEdge: {
        tag: "00181608",
        vr: "IS",
        vm: "1",
    },
    CenterOfCircularShutter: {
        tag: "00181610",
        vr: "IS",
        vm: "2",
    },
    RadiusOfCircularShutter: {
        tag: "00181612",
        vr: "IS",
        vm: "1",
    },
    VerticesOfThePolygonalShutter: {
        tag: "00181620",
        vr: "IS",
        vm: "2-2n",
    },
    ShutterPresentationValue: {
        tag: "00181622",
        vr: "US",
        vm: "1",
    },
    ShutterOverlayGroup: {
        tag: "00181623",
        vr: "US",
        vm: "1",
    },
    ShutterPresentationColorCIELabValue: {
        tag: "00181624",
        vr: "US",
        vm: "3",
    },
    OutlineShapeType: {
        tag: "00181630",
        vr: "CS",
        vm: "1",
    },
    OutlineLeftVerticalEdge: {
        tag: "00181631",
        vr: "FD",
        vm: "1",
    },
    OutlineRightVerticalEdge: {
        tag: "00181632",
        vr: "FD",
        vm: "1",
    },
    OutlineUpperHorizontalEdge: {
        tag: "00181633",
        vr: "FD",
        vm: "1",
    },
    OutlineLowerHorizontalEdge: {
        tag: "00181634",
        vr: "FD",
        vm: "1",
    },
    CenterOfCircularOutline: {
        tag: "00181635",
        vr: "FD",
        vm: "2",
    },
    DiameterOfCircularOutline: {
        tag: "00181636",
        vr: "FD",
        vm: "1",
    },
    NumberOfPolygonalVertices: {
        tag: "00181637",
        vr: "UL",
        vm: "1",
    },
    VerticesOfThePolygonalOutline: {
        tag: "00181638",
        vr: "OF",
        vm: "1",
    },
    CollimatorShape: {
        tag: "00181700",
        vr: "CS",
        vm: "1-3",
    },
    CollimatorLeftVerticalEdge: {
        tag: "00181702",
        vr: "IS",
        vm: "1",
    },
    CollimatorRightVerticalEdge: {
        tag: "00181704",
        vr: "IS",
        vm: "1",
    },
    CollimatorUpperHorizontalEdge: {
        tag: "00181706",
        vr: "IS",
        vm: "1",
    },
    CollimatorLowerHorizontalEdge: {
        tag: "00181708",
        vr: "IS",
        vm: "1",
    },
    CenterOfCircularCollimator: {
        tag: "00181710",
        vr: "IS",
        vm: "2",
    },
    RadiusOfCircularCollimator: {
        tag: "00181712",
        vr: "IS",
        vm: "1",
    },
    VerticesOfThePolygonalCollimator: {
        tag: "00181720",
        vr: "IS",
        vm: "2-2n",
    },
    AcquisitionTimeSynchronized: {
        tag: "00181800",
        vr: "CS",
        vm: "1",
    },
    TimeSource: {
        tag: "00181801",
        vr: "SH",
        vm: "1",
    },
    TimeDistributionProtocol: {
        tag: "00181802",
        vr: "CS",
        vm: "1",
    },
    NTPSourceAddress: {
        tag: "00181803",
        vr: "LO",
        vm: "1",
    },
    PageNumberVector: {
        tag: "00182001",
        vr: "IS",
        vm: "1-n",
    },
    FrameLabelVector: {
        tag: "00182002",
        vr: "SH",
        vm: "1-n",
    },
    FramePrimaryAngleVector: {
        tag: "00182003",
        vr: "DS",
        vm: "1-n",
    },
    FrameSecondaryAngleVector: {
        tag: "00182004",
        vr: "DS",
        vm: "1-n",
    },
    SliceLocationVector: {
        tag: "00182005",
        vr: "DS",
        vm: "1-n",
    },
    DisplayWindowLabelVector: {
        tag: "00182006",
        vr: "SH",
        vm: "1-n",
    },
    NominalScannedPixelSpacing: {
        tag: "00182010",
        vr: "DS",
        vm: "2",
    },
    DigitizingDeviceTransportDirection: {
        tag: "00182020",
        vr: "CS",
        vm: "1",
    },
    RotationOfScannedFilm: {
        tag: "00182030",
        vr: "DS",
        vm: "1",
    },
    BiopsyTargetSequence: {
        tag: "00182041",
        vr: "SQ",
        vm: "1",
    },
    TargetUID: {
        tag: "00182042",
        vr: "UI",
        vm: "1",
    },
    LocalizingCursorPosition: {
        tag: "00182043",
        vr: "FL",
        vm: "2",
    },
    CalculatedTargetPosition: {
        tag: "00182044",
        vr: "FL",
        vm: "3",
    },
    TargetLabel: {
        tag: "00182045",
        vr: "SH",
        vm: "1",
    },
    DisplayedZValue: {
        tag: "00182046",
        vr: "FL",
        vm: "1",
    },
    IVUSAcquisition: {
        tag: "00183100",
        vr: "CS",
        vm: "1",
    },
    IVUSPullbackRate: {
        tag: "00183101",
        vr: "DS",
        vm: "1",
    },
    IVUSGatedRate: {
        tag: "00183102",
        vr: "DS",
        vm: "1",
    },
    IVUSPullbackStartFrameNumber: {
        tag: "00183103",
        vr: "IS",
        vm: "1",
    },
    IVUSPullbackStopFrameNumber: {
        tag: "00183104",
        vr: "IS",
        vm: "1",
    },
    LesionNumber: {
        tag: "00183105",
        vr: "IS",
        vm: "1-n",
    },
    AcquisitionComments: {
        tag: "00184000",
        vr: "LT",
        vm: "1",
    },
    OutputPower: {
        tag: "00185000",
        vr: "SH",
        vm: "1-n",
    },
    TransducerData: {
        tag: "00185010",
        vr: "LO",
        vm: "1-n",
    },
    TransducerIdentificationSequence: {
        tag: "00185011",
        vr: "SQ",
        vm: "1",
    },
    FocusDepth: {
        tag: "00185012",
        vr: "DS",
        vm: "1",
    },
    ProcessingFunction: {
        tag: "00185020",
        vr: "LO",
        vm: "1",
    },
    PostprocessingFunction: {
        tag: "00185021",
        vr: "LO",
        vm: "1",
    },
    MechanicalIndex: {
        tag: "00185022",
        vr: "DS",
        vm: "1",
    },
    BoneThermalIndex: {
        tag: "00185024",
        vr: "DS",
        vm: "1",
    },
    CranialThermalIndex: {
        tag: "00185026",
        vr: "DS",
        vm: "1",
    },
    SoftTissueThermalIndex: {
        tag: "00185027",
        vr: "DS",
        vm: "1",
    },
    SoftTissueFocusThermalIndex: {
        tag: "00185028",
        vr: "DS",
        vm: "1",
    },
    SoftTissueSurfaceThermalIndex: {
        tag: "00185029",
        vr: "DS",
        vm: "1",
    },
    DynamicRange: {
        tag: "00185030",
        vr: "DS",
        vm: "1",
    },
    TotalGain: {
        tag: "00185040",
        vr: "DS",
        vm: "1",
    },
    DepthOfScanField: {
        tag: "00185050",
        vr: "IS",
        vm: "1",
    },
    PatientPosition: {
        tag: "00185100",
        vr: "CS",
        vm: "1",
    },
    ViewPosition: {
        tag: "00185101",
        vr: "CS",
        vm: "1",
    },
    ProjectionEponymousNameCodeSequence: {
        tag: "00185104",
        vr: "SQ",
        vm: "1",
    },
    ImageTransformationMatrix: {
        tag: "00185210",
        vr: "DS",
        vm: "6",
    },
    ImageTranslationVector: {
        tag: "00185212",
        vr: "DS",
        vm: "3",
    },
    Sensitivity: {
        tag: "00186000",
        vr: "DS",
        vm: "1",
    },
    SequenceOfUltrasoundRegions: {
        tag: "00186011",
        vr: "SQ",
        vm: "1",
    },
    RegionSpatialFormat: {
        tag: "00186012",
        vr: "US",
        vm: "1",
    },
    RegionDataType: {
        tag: "00186014",
        vr: "US",
        vm: "1",
    },
    RegionFlags: {
        tag: "00186016",
        vr: "UL",
        vm: "1",
    },
    RegionLocationMinX0: {
        tag: "00186018",
        vr: "UL",
        vm: "1",
    },
    RegionLocationMinY0: {
        tag: "0018601A",
        vr: "UL",
        vm: "1",
    },
    RegionLocationMaxX1: {
        tag: "0018601C",
        vr: "UL",
        vm: "1",
    },
    RegionLocationMaxY1: {
        tag: "0018601E",
        vr: "UL",
        vm: "1",
    },
    ReferencePixelX0: {
        tag: "00186020",
        vr: "SL",
        vm: "1",
    },
    ReferencePixelY0: {
        tag: "00186022",
        vr: "SL",
        vm: "1",
    },
    PhysicalUnitsXDirection: {
        tag: "00186024",
        vr: "US",
        vm: "1",
    },
    PhysicalUnitsYDirection: {
        tag: "00186026",
        vr: "US",
        vm: "1",
    },
    ReferencePixelPhysicalValueX: {
        tag: "00186028",
        vr: "FD",
        vm: "1",
    },
    ReferencePixelPhysicalValueY: {
        tag: "0018602A",
        vr: "FD",
        vm: "1",
    },
    PhysicalDeltaX: {
        tag: "0018602C",
        vr: "FD",
        vm: "1",
    },
    PhysicalDeltaY: {
        tag: "0018602E",
        vr: "FD",
        vm: "1",
    },
    TransducerFrequency: {
        tag: "00186030",
        vr: "UL",
        vm: "1",
    },
    TransducerType: {
        tag: "00186031",
        vr: "CS",
        vm: "1",
    },
    PulseRepetitionFrequency: {
        tag: "00186032",
        vr: "UL",
        vm: "1",
    },
    DopplerCorrectionAngle: {
        tag: "00186034",
        vr: "FD",
        vm: "1",
    },
    SteeringAngle: {
        tag: "00186036",
        vr: "FD",
        vm: "1",
    },
    DopplerSampleVolumeXPositionRetired: {
        tag: "00186038",
        vr: "UL",
        vm: "1",
    },
    DopplerSampleVolumeXPosition: {
        tag: "00186039",
        vr: "SL",
        vm: "1",
    },
    DopplerSampleVolumeYPositionRetired: {
        tag: "0018603A",
        vr: "UL",
        vm: "1",
    },
    DopplerSampleVolumeYPosition: {
        tag: "0018603B",
        vr: "SL",
        vm: "1",
    },
    TMLinePositionX0Retired: {
        tag: "0018603C",
        vr: "UL",
        vm: "1",
    },
    TMLinePositionX0: {
        tag: "0018603D",
        vr: "SL",
        vm: "1",
    },
    TMLinePositionY0Retired: {
        tag: "0018603E",
        vr: "UL",
        vm: "1",
    },
    TMLinePositionY0: {
        tag: "0018603F",
        vr: "SL",
        vm: "1",
    },
    TMLinePositionX1Retired: {
        tag: "00186040",
        vr: "UL",
        vm: "1",
    },
    TMLinePositionX1: {
        tag: "00186041",
        vr: "SL",
        vm: "1",
    },
    TMLinePositionY1Retired: {
        tag: "00186042",
        vr: "UL",
        vm: "1",
    },
    TMLinePositionY1: {
        tag: "00186043",
        vr: "SL",
        vm: "1",
    },
    PixelComponentOrganization: {
        tag: "00186044",
        vr: "US",
        vm: "1",
    },
    PixelComponentMask: {
        tag: "00186046",
        vr: "UL",
        vm: "1",
    },
    PixelComponentRangeStart: {
        tag: "00186048",
        vr: "UL",
        vm: "1",
    },
    PixelComponentRangeStop: {
        tag: "0018604A",
        vr: "UL",
        vm: "1",
    },
    PixelComponentPhysicalUnits: {
        tag: "0018604C",
        vr: "US",
        vm: "1",
    },
    PixelComponentDataType: {
        tag: "0018604E",
        vr: "US",
        vm: "1",
    },
    NumberOfTableBreakPoints: {
        tag: "00186050",
        vr: "UL",
        vm: "1",
    },
    TableOfXBreakPoints: {
        tag: "00186052",
        vr: "UL",
        vm: "1-n",
    },
    TableOfYBreakPoints: {
        tag: "00186054",
        vr: "FD",
        vm: "1-n",
    },
    NumberOfTableEntries: {
        tag: "00186056",
        vr: "UL",
        vm: "1",
    },
    TableOfPixelValues: {
        tag: "00186058",
        vr: "UL",
        vm: "1-n",
    },
    TableOfParameterValues: {
        tag: "0018605A",
        vr: "FL",
        vm: "1-n",
    },
    RWaveTimeVector: {
        tag: "00186060",
        vr: "FL",
        vm: "1-n",
    },
    ActiveImageAreaOverlayGroup: {
        tag: "00186070",
        vr: "US",
        vm: "1",
    },
    DetectorConditionsNominalFlag: {
        tag: "00187000",
        vr: "CS",
        vm: "1",
    },
    DetectorTemperature: {
        tag: "00187001",
        vr: "DS",
        vm: "1",
    },
    DetectorType: {
        tag: "00187004",
        vr: "CS",
        vm: "1",
    },
    DetectorConfiguration: {
        tag: "00187005",
        vr: "CS",
        vm: "1",
    },
    DetectorDescription: {
        tag: "00187006",
        vr: "LT",
        vm: "1",
    },
    DetectorMode: {
        tag: "00187008",
        vr: "LT",
        vm: "1",
    },
    DetectorID: {
        tag: "0018700A",
        vr: "SH",
        vm: "1",
    },
    DateOfLastDetectorCalibration: {
        tag: "0018700C",
        vr: "DA",
        vm: "1",
    },
    TimeOfLastDetectorCalibration: {
        tag: "0018700E",
        vr: "TM",
        vm: "1",
    },
    ExposuresOnDetectorSinceLastCalibration: {
        tag: "00187010",
        vr: "IS",
        vm: "1",
    },
    ExposuresOnDetectorSinceManufactured: {
        tag: "00187011",
        vr: "IS",
        vm: "1",
    },
    DetectorTimeSinceLastExposure: {
        tag: "00187012",
        vr: "DS",
        vm: "1",
    },
    DetectorActiveTime: {
        tag: "00187014",
        vr: "DS",
        vm: "1",
    },
    DetectorActivationOffsetFromExposure: {
        tag: "00187016",
        vr: "DS",
        vm: "1",
    },
    DetectorBinning: {
        tag: "0018701A",
        vr: "DS",
        vm: "2",
    },
    DetectorElementPhysicalSize: {
        tag: "00187020",
        vr: "DS",
        vm: "2",
    },
    DetectorElementSpacing: {
        tag: "00187022",
        vr: "DS",
        vm: "2",
    },
    DetectorActiveShape: {
        tag: "00187024",
        vr: "CS",
        vm: "1",
    },
    DetectorActiveDimensions: {
        tag: "00187026",
        vr: "DS",
        vm: "1-2",
    },
    DetectorActiveOrigin: {
        tag: "00187028",
        vr: "DS",
        vm: "2",
    },
    DetectorManufacturerName: {
        tag: "0018702A",
        vr: "LO",
        vm: "1",
    },
    DetectorManufacturerModelName: {
        tag: "0018702B",
        vr: "LO",
        vm: "1",
    },
    FieldOfViewOrigin: {
        tag: "00187030",
        vr: "DS",
        vm: "2",
    },
    FieldOfViewRotation: {
        tag: "00187032",
        vr: "DS",
        vm: "1",
    },
    FieldOfViewHorizontalFlip: {
        tag: "00187034",
        vr: "CS",
        vm: "1",
    },
    PixelDataAreaOriginRelativeToFOV: {
        tag: "00187036",
        vr: "FL",
        vm: "2",
    },
    PixelDataAreaRotationAngleRelativeToFOV: {
        tag: "00187038",
        vr: "FL",
        vm: "1",
    },
    GridAbsorbingMaterial: {
        tag: "00187040",
        vr: "LT",
        vm: "1",
    },
    GridSpacingMaterial: {
        tag: "00187041",
        vr: "LT",
        vm: "1",
    },
    GridThickness: {
        tag: "00187042",
        vr: "DS",
        vm: "1",
    },
    GridPitch: {
        tag: "00187044",
        vr: "DS",
        vm: "1",
    },
    GridAspectRatio: {
        tag: "00187046",
        vr: "IS",
        vm: "2",
    },
    GridPeriod: {
        tag: "00187048",
        vr: "DS",
        vm: "1",
    },
    GridFocalDistance: {
        tag: "0018704C",
        vr: "DS",
        vm: "1",
    },
    FilterMaterial: {
        tag: "00187050",
        vr: "CS",
        vm: "1-n",
    },
    FilterThicknessMinimum: {
        tag: "00187052",
        vr: "DS",
        vm: "1-n",
    },
    FilterThicknessMaximum: {
        tag: "00187054",
        vr: "DS",
        vm: "1-n",
    },
    FilterBeamPathLengthMinimum: {
        tag: "00187056",
        vr: "FL",
        vm: "1-n",
    },
    FilterBeamPathLengthMaximum: {
        tag: "00187058",
        vr: "FL",
        vm: "1-n",
    },
    ExposureControlMode: {
        tag: "00187060",
        vr: "CS",
        vm: "1",
    },
    ExposureControlModeDescription: {
        tag: "00187062",
        vr: "LT",
        vm: "1",
    },
    ExposureStatus: {
        tag: "00187064",
        vr: "CS",
        vm: "1",
    },
    PhototimerSetting: {
        tag: "00187065",
        vr: "DS",
        vm: "1",
    },
    ExposureTimeInuS: {
        tag: "00188150",
        vr: "DS",
        vm: "1",
    },
    XRayTubeCurrentInuA: {
        tag: "00188151",
        vr: "DS",
        vm: "1",
    },
    ContentQualification: {
        tag: "00189004",
        vr: "CS",
        vm: "1",
    },
    PulseSequenceName: {
        tag: "00189005",
        vr: "SH",
        vm: "1",
    },
    MRImagingModifierSequence: {
        tag: "00189006",
        vr: "SQ",
        vm: "1",
    },
    EchoPulseSequence: {
        tag: "00189008",
        vr: "CS",
        vm: "1",
    },
    InversionRecovery: {
        tag: "00189009",
        vr: "CS",
        vm: "1",
    },
    FlowCompensation: {
        tag: "00189010",
        vr: "CS",
        vm: "1",
    },
    MultipleSpinEcho: {
        tag: "00189011",
        vr: "CS",
        vm: "1",
    },
    MultiPlanarExcitation: {
        tag: "00189012",
        vr: "CS",
        vm: "1",
    },
    PhaseContrast: {
        tag: "00189014",
        vr: "CS",
        vm: "1",
    },
    TimeOfFlightContrast: {
        tag: "00189015",
        vr: "CS",
        vm: "1",
    },
    Spoiling: {
        tag: "00189016",
        vr: "CS",
        vm: "1",
    },
    SteadyStatePulseSequence: {
        tag: "00189017",
        vr: "CS",
        vm: "1",
    },
    EchoPlanarPulseSequence: {
        tag: "00189018",
        vr: "CS",
        vm: "1",
    },
    TagAngleFirstAxis: {
        tag: "00189019",
        vr: "FD",
        vm: "1",
    },
    MagnetizationTransfer: {
        tag: "00189020",
        vr: "CS",
        vm: "1",
    },
    T2Preparation: {
        tag: "00189021",
        vr: "CS",
        vm: "1",
    },
    BloodSignalNulling: {
        tag: "00189022",
        vr: "CS",
        vm: "1",
    },
    SaturationRecovery: {
        tag: "00189024",
        vr: "CS",
        vm: "1",
    },
    SpectrallySelectedSuppression: {
        tag: "00189025",
        vr: "CS",
        vm: "1",
    },
    SpectrallySelectedExcitation: {
        tag: "00189026",
        vr: "CS",
        vm: "1",
    },
    SpatialPresaturation: {
        tag: "00189027",
        vr: "CS",
        vm: "1",
    },
    Tagging: {
        tag: "00189028",
        vr: "CS",
        vm: "1",
    },
    OversamplingPhase: {
        tag: "00189029",
        vr: "CS",
        vm: "1",
    },
    TagSpacingFirstDimension: {
        tag: "00189030",
        vr: "FD",
        vm: "1",
    },
    GeometryOfKSpaceTraversal: {
        tag: "00189032",
        vr: "CS",
        vm: "1",
    },
    SegmentedKSpaceTraversal: {
        tag: "00189033",
        vr: "CS",
        vm: "1",
    },
    RectilinearPhaseEncodeReordering: {
        tag: "00189034",
        vr: "CS",
        vm: "1",
    },
    TagThickness: {
        tag: "00189035",
        vr: "FD",
        vm: "1",
    },
    PartialFourierDirection: {
        tag: "00189036",
        vr: "CS",
        vm: "1",
    },
    CardiacSynchronizationTechnique: {
        tag: "00189037",
        vr: "CS",
        vm: "1",
    },
    ReceiveCoilManufacturerName: {
        tag: "00189041",
        vr: "LO",
        vm: "1",
    },
    MRReceiveCoilSequence: {
        tag: "00189042",
        vr: "SQ",
        vm: "1",
    },
    ReceiveCoilType: {
        tag: "00189043",
        vr: "CS",
        vm: "1",
    },
    QuadratureReceiveCoil: {
        tag: "00189044",
        vr: "CS",
        vm: "1",
    },
    MultiCoilDefinitionSequence: {
        tag: "00189045",
        vr: "SQ",
        vm: "1",
    },
    MultiCoilConfiguration: {
        tag: "00189046",
        vr: "LO",
        vm: "1",
    },
    MultiCoilElementName: {
        tag: "00189047",
        vr: "SH",
        vm: "1",
    },
    MultiCoilElementUsed: {
        tag: "00189048",
        vr: "CS",
        vm: "1",
    },
    MRTransmitCoilSequence: {
        tag: "00189049",
        vr: "SQ",
        vm: "1",
    },
    TransmitCoilManufacturerName: {
        tag: "00189050",
        vr: "LO",
        vm: "1",
    },
    TransmitCoilType: {
        tag: "00189051",
        vr: "CS",
        vm: "1",
    },
    SpectralWidth: {
        tag: "00189052",
        vr: "FD",
        vm: "1-2",
    },
    ChemicalShiftReference: {
        tag: "00189053",
        vr: "FD",
        vm: "1-2",
    },
    VolumeLocalizationTechnique: {
        tag: "00189054",
        vr: "CS",
        vm: "1",
    },
    MRAcquisitionFrequencyEncodingSteps: {
        tag: "00189058",
        vr: "US",
        vm: "1",
    },
    Decoupling: {
        tag: "00189059",
        vr: "CS",
        vm: "1",
    },
    DecoupledNucleus: {
        tag: "00189060",
        vr: "CS",
        vm: "1-2",
    },
    DecouplingFrequency: {
        tag: "00189061",
        vr: "FD",
        vm: "1-2",
    },
    DecouplingMethod: {
        tag: "00189062",
        vr: "CS",
        vm: "1",
    },
    DecouplingChemicalShiftReference: {
        tag: "00189063",
        vr: "FD",
        vm: "1-2",
    },
    KSpaceFiltering: {
        tag: "00189064",
        vr: "CS",
        vm: "1",
    },
    TimeDomainFiltering: {
        tag: "00189065",
        vr: "CS",
        vm: "1-2",
    },
    NumberOfZeroFills: {
        tag: "00189066",
        vr: "US",
        vm: "1-2",
    },
    BaselineCorrection: {
        tag: "00189067",
        vr: "CS",
        vm: "1",
    },
    ParallelReductionFactorInPlane: {
        tag: "00189069",
        vr: "FD",
        vm: "1",
    },
    CardiacRRIntervalSpecified: {
        tag: "00189070",
        vr: "FD",
        vm: "1",
    },
    AcquisitionDuration: {
        tag: "00189073",
        vr: "FD",
        vm: "1",
    },
    FrameAcquisitionDateTime: {
        tag: "00189074",
        vr: "DT",
        vm: "1",
    },
    DiffusionDirectionality: {
        tag: "00189075",
        vr: "CS",
        vm: "1",
    },
    DiffusionGradientDirectionSequence: {
        tag: "00189076",
        vr: "SQ",
        vm: "1",
    },
    ParallelAcquisition: {
        tag: "00189077",
        vr: "CS",
        vm: "1",
    },
    ParallelAcquisitionTechnique: {
        tag: "00189078",
        vr: "CS",
        vm: "1",
    },
    InversionTimes: {
        tag: "00189079",
        vr: "FD",
        vm: "1-n",
    },
    MetaboliteMapDescription: {
        tag: "00189080",
        vr: "ST",
        vm: "1",
    },
    PartialFourier: {
        tag: "00189081",
        vr: "CS",
        vm: "1",
    },
    EffectiveEchoTime: {
        tag: "00189082",
        vr: "FD",
        vm: "1",
    },
    MetaboliteMapCodeSequence: {
        tag: "00189083",
        vr: "SQ",
        vm: "1",
    },
    ChemicalShiftSequence: {
        tag: "00189084",
        vr: "SQ",
        vm: "1",
    },
    CardiacSignalSource: {
        tag: "00189085",
        vr: "CS",
        vm: "1",
    },
    DiffusionBValue: {
        tag: "00189087",
        vr: "FD",
        vm: "1",
    },
    DiffusionGradientOrientation: {
        tag: "00189089",
        vr: "FD",
        vm: "3",
    },
    VelocityEncodingDirection: {
        tag: "00189090",
        vr: "FD",
        vm: "3",
    },
    VelocityEncodingMinimumValue: {
        tag: "00189091",
        vr: "FD",
        vm: "1",
    },
    VelocityEncodingAcquisitionSequence: {
        tag: "00189092",
        vr: "SQ",
        vm: "1",
    },
    NumberOfKSpaceTrajectories: {
        tag: "00189093",
        vr: "US",
        vm: "1",
    },
    CoverageOfKSpace: {
        tag: "00189094",
        vr: "CS",
        vm: "1",
    },
    SpectroscopyAcquisitionPhaseRows: {
        tag: "00189095",
        vr: "UL",
        vm: "1",
    },
    ParallelReductionFactorInPlaneRetired: {
        tag: "00189096",
        vr: "FD",
        vm: "1",
    },
    TransmitterFrequency: {
        tag: "00189098",
        vr: "FD",
        vm: "1-2",
    },
    ResonantNucleus: {
        tag: "00189100",
        vr: "CS",
        vm: "1-2",
    },
    FrequencyCorrection: {
        tag: "00189101",
        vr: "CS",
        vm: "1",
    },
    MRSpectroscopyFOVGeometrySequence: {
        tag: "00189103",
        vr: "SQ",
        vm: "1",
    },
    SlabThickness: {
        tag: "00189104",
        vr: "FD",
        vm: "1",
    },
    SlabOrientation: {
        tag: "00189105",
        vr: "FD",
        vm: "3",
    },
    MidSlabPosition: {
        tag: "00189106",
        vr: "FD",
        vm: "3",
    },
    MRSpatialSaturationSequence: {
        tag: "00189107",
        vr: "SQ",
        vm: "1",
    },
    MRTimingAndRelatedParametersSequence: {
        tag: "00189112",
        vr: "SQ",
        vm: "1",
    },
    MREchoSequence: {
        tag: "00189114",
        vr: "SQ",
        vm: "1",
    },
    MRModifierSequence: {
        tag: "00189115",
        vr: "SQ",
        vm: "1",
    },
    MRDiffusionSequence: {
        tag: "00189117",
        vr: "SQ",
        vm: "1",
    },
    CardiacSynchronizationSequence: {
        tag: "00189118",
        vr: "SQ",
        vm: "1",
    },
    MRAveragesSequence: {
        tag: "00189119",
        vr: "SQ",
        vm: "1",
    },
    MRFOVGeometrySequence: {
        tag: "00189125",
        vr: "SQ",
        vm: "1",
    },
    VolumeLocalizationSequence: {
        tag: "00189126",
        vr: "SQ",
        vm: "1",
    },
    SpectroscopyAcquisitionDataColumns: {
        tag: "00189127",
        vr: "UL",
        vm: "1",
    },
    DiffusionAnisotropyType: {
        tag: "00189147",
        vr: "CS",
        vm: "1",
    },
    FrameReferenceDateTime: {
        tag: "00189151",
        vr: "DT",
        vm: "1",
    },
    MRMetaboliteMapSequence: {
        tag: "00189152",
        vr: "SQ",
        vm: "1",
    },
    ParallelReductionFactorOutOfPlane: {
        tag: "00189155",
        vr: "FD",
        vm: "1",
    },
    SpectroscopyAcquisitionOutOfPlanePhaseSteps: {
        tag: "00189159",
        vr: "UL",
        vm: "1",
    },
    BulkMotionStatus: {
        tag: "00189166",
        vr: "CS",
        vm: "1",
    },
    ParallelReductionFactorSecondInPlane: {
        tag: "00189168",
        vr: "FD",
        vm: "1",
    },
    CardiacBeatRejectionTechnique: {
        tag: "00189169",
        vr: "CS",
        vm: "1",
    },
    RespiratoryMotionCompensationTechnique: {
        tag: "00189170",
        vr: "CS",
        vm: "1",
    },
    RespiratorySignalSource: {
        tag: "00189171",
        vr: "CS",
        vm: "1",
    },
    BulkMotionCompensationTechnique: {
        tag: "00189172",
        vr: "CS",
        vm: "1",
    },
    BulkMotionSignalSource: {
        tag: "00189173",
        vr: "CS",
        vm: "1",
    },
    ApplicableSafetyStandardAgency: {
        tag: "00189174",
        vr: "CS",
        vm: "1",
    },
    ApplicableSafetyStandardDescription: {
        tag: "00189175",
        vr: "LO",
        vm: "1",
    },
    OperatingModeSequence: {
        tag: "00189176",
        vr: "SQ",
        vm: "1",
    },
    OperatingModeType: {
        tag: "00189177",
        vr: "CS",
        vm: "1",
    },
    OperatingMode: {
        tag: "00189178",
        vr: "CS",
        vm: "1",
    },
    SpecificAbsorptionRateDefinition: {
        tag: "00189179",
        vr: "CS",
        vm: "1",
    },
    GradientOutputType: {
        tag: "00189180",
        vr: "CS",
        vm: "1",
    },
    SpecificAbsorptionRateValue: {
        tag: "00189181",
        vr: "FD",
        vm: "1",
    },
    GradientOutput: {
        tag: "00189182",
        vr: "FD",
        vm: "1",
    },
    FlowCompensationDirection: {
        tag: "00189183",
        vr: "CS",
        vm: "1",
    },
    TaggingDelay: {
        tag: "00189184",
        vr: "FD",
        vm: "1",
    },
    RespiratoryMotionCompensationTechniqueDescription: {
        tag: "00189185",
        vr: "ST",
        vm: "1",
    },
    RespiratorySignalSourceID: {
        tag: "00189186",
        vr: "SH",
        vm: "1",
    },
    ChemicalShiftMinimumIntegrationLimitInHz: {
        tag: "00189195",
        vr: "FD",
        vm: "1",
    },
    ChemicalShiftMaximumIntegrationLimitInHz: {
        tag: "00189196",
        vr: "FD",
        vm: "1",
    },
    MRVelocityEncodingSequence: {
        tag: "00189197",
        vr: "SQ",
        vm: "1",
    },
    FirstOrderPhaseCorrection: {
        tag: "00189198",
        vr: "CS",
        vm: "1",
    },
    WaterReferencedPhaseCorrection: {
        tag: "00189199",
        vr: "CS",
        vm: "1",
    },
    MRSpectroscopyAcquisitionType: {
        tag: "00189200",
        vr: "CS",
        vm: "1",
    },
    RespiratoryCyclePosition: {
        tag: "00189214",
        vr: "CS",
        vm: "1",
    },
    VelocityEncodingMaximumValue: {
        tag: "00189217",
        vr: "FD",
        vm: "1",
    },
    TagSpacingSecondDimension: {
        tag: "00189218",
        vr: "FD",
        vm: "1",
    },
    TagAngleSecondAxis: {
        tag: "00189219",
        vr: "SS",
        vm: "1",
    },
    FrameAcquisitionDuration: {
        tag: "00189220",
        vr: "FD",
        vm: "1",
    },
    MRImageFrameTypeSequence: {
        tag: "00189226",
        vr: "SQ",
        vm: "1",
    },
    MRSpectroscopyFrameTypeSequence: {
        tag: "00189227",
        vr: "SQ",
        vm: "1",
    },
    MRAcquisitionPhaseEncodingStepsInPlane: {
        tag: "00189231",
        vr: "US",
        vm: "1",
    },
    MRAcquisitionPhaseEncodingStepsOutOfPlane: {
        tag: "00189232",
        vr: "US",
        vm: "1",
    },
    SpectroscopyAcquisitionPhaseColumns: {
        tag: "00189234",
        vr: "UL",
        vm: "1",
    },
    CardiacCyclePosition: {
        tag: "00189236",
        vr: "CS",
        vm: "1",
    },
    SpecificAbsorptionRateSequence: {
        tag: "00189239",
        vr: "SQ",
        vm: "1",
    },
    RFEchoTrainLength: {
        tag: "00189240",
        vr: "US",
        vm: "1",
    },
    GradientEchoTrainLength: {
        tag: "00189241",
        vr: "US",
        vm: "1",
    },
    ArterialSpinLabelingContrast: {
        tag: "00189250",
        vr: "CS",
        vm: "1",
    },
    MRArterialSpinLabelingSequence: {
        tag: "00189251",
        vr: "SQ",
        vm: "1",
    },
    ASLTechniqueDescription: {
        tag: "00189252",
        vr: "LO",
        vm: "1",
    },
    ASLSlabNumber: {
        tag: "00189253",
        vr: "US",
        vm: "1",
    },
    ASLSlabThickness: {
        tag: "00189254",
        vr: "FD",
        vm: "1",
    },
    ASLSlabOrientation: {
        tag: "00189255",
        vr: "FD",
        vm: "3",
    },
    ASLMidSlabPosition: {
        tag: "00189256",
        vr: "FD",
        vm: "3",
    },
    ASLContext: {
        tag: "00189257",
        vr: "CS",
        vm: "1",
    },
    ASLPulseTrainDuration: {
        tag: "00189258",
        vr: "UL",
        vm: "1",
    },
    ASLCrusherFlag: {
        tag: "00189259",
        vr: "CS",
        vm: "1",
    },
    ASLCrusherFlowLimit: {
        tag: "0018925A",
        vr: "FD",
        vm: "1",
    },
    ASLCrusherDescription: {
        tag: "0018925B",
        vr: "LO",
        vm: "1",
    },
    ASLBolusCutoffFlag: {
        tag: "0018925C",
        vr: "CS",
        vm: "1",
    },
    ASLBolusCutoffTimingSequence: {
        tag: "0018925D",
        vr: "SQ",
        vm: "1",
    },
    ASLBolusCutoffTechnique: {
        tag: "0018925E",
        vr: "LO",
        vm: "1",
    },
    ASLBolusCutoffDelayTime: {
        tag: "0018925F",
        vr: "UL",
        vm: "1",
    },
    ASLSlabSequence: {
        tag: "00189260",
        vr: "SQ",
        vm: "1",
    },
    ChemicalShiftMinimumIntegrationLimitInppm: {
        tag: "00189295",
        vr: "FD",
        vm: "1",
    },
    ChemicalShiftMaximumIntegrationLimitInppm: {
        tag: "00189296",
        vr: "FD",
        vm: "1",
    },
    WaterReferenceAcquisition: {
        tag: "00189297",
        vr: "CS",
        vm: "1",
    },
    EchoPeakPosition: {
        tag: "00189298",
        vr: "IS",
        vm: "1",
    },
    CTAcquisitionTypeSequence: {
        tag: "00189301",
        vr: "SQ",
        vm: "1",
    },
    AcquisitionType: {
        tag: "00189302",
        vr: "CS",
        vm: "1",
    },
    TubeAngle: {
        tag: "00189303",
        vr: "FD",
        vm: "1",
    },
    CTAcquisitionDetailsSequence: {
        tag: "00189304",
        vr: "SQ",
        vm: "1",
    },
    RevolutionTime: {
        tag: "00189305",
        vr: "FD",
        vm: "1",
    },
    SingleCollimationWidth: {
        tag: "00189306",
        vr: "FD",
        vm: "1",
    },
    TotalCollimationWidth: {
        tag: "00189307",
        vr: "FD",
        vm: "1",
    },
    CTTableDynamicsSequence: {
        tag: "00189308",
        vr: "SQ",
        vm: "1",
    },
    TableSpeed: {
        tag: "00189309",
        vr: "FD",
        vm: "1",
    },
    TableFeedPerRotation: {
        tag: "00189310",
        vr: "FD",
        vm: "1",
    },
    SpiralPitchFactor: {
        tag: "00189311",
        vr: "FD",
        vm: "1",
    },
    CTGeometrySequence: {
        tag: "00189312",
        vr: "SQ",
        vm: "1",
    },
    DataCollectionCenterPatient: {
        tag: "00189313",
        vr: "FD",
        vm: "3",
    },
    CTReconstructionSequence: {
        tag: "00189314",
        vr: "SQ",
        vm: "1",
    },
    ReconstructionAlgorithm: {
        tag: "00189315",
        vr: "CS",
        vm: "1",
    },
    ConvolutionKernelGroup: {
        tag: "00189316",
        vr: "CS",
        vm: "1",
    },
    ReconstructionFieldOfView: {
        tag: "00189317",
        vr: "FD",
        vm: "2",
    },
    ReconstructionTargetCenterPatient: {
        tag: "00189318",
        vr: "FD",
        vm: "3",
    },
    ReconstructionAngle: {
        tag: "00189319",
        vr: "FD",
        vm: "1",
    },
    ImageFilter: {
        tag: "00189320",
        vr: "SH",
        vm: "1",
    },
    CTExposureSequence: {
        tag: "00189321",
        vr: "SQ",
        vm: "1",
    },
    ReconstructionPixelSpacing: {
        tag: "00189322",
        vr: "FD",
        vm: "2",
    },
    ExposureModulationType: {
        tag: "00189323",
        vr: "CS",
        vm: "1-n",
    },
    EstimatedDoseSaving: {
        tag: "00189324",
        vr: "FD",
        vm: "1",
    },
    CTXRayDetailsSequence: {
        tag: "00189325",
        vr: "SQ",
        vm: "1",
    },
    CTPositionSequence: {
        tag: "00189326",
        vr: "SQ",
        vm: "1",
    },
    TablePosition: {
        tag: "00189327",
        vr: "FD",
        vm: "1",
    },
    ExposureTimeInms: {
        tag: "00189328",
        vr: "FD",
        vm: "1",
    },
    CTImageFrameTypeSequence: {
        tag: "00189329",
        vr: "SQ",
        vm: "1",
    },
    XRayTubeCurrentInmA: {
        tag: "00189330",
        vr: "FD",
        vm: "1",
    },
    ExposureInmAs: {
        tag: "00189332",
        vr: "FD",
        vm: "1",
    },
    ConstantVolumeFlag: {
        tag: "00189333",
        vr: "CS",
        vm: "1",
    },
    FluoroscopyFlag: {
        tag: "00189334",
        vr: "CS",
        vm: "1",
    },
    DistanceSourceToDataCollectionCenter: {
        tag: "00189335",
        vr: "FD",
        vm: "1",
    },
    ContrastBolusAgentNumber: {
        tag: "00189337",
        vr: "US",
        vm: "1",
    },
    ContrastBolusIngredientCodeSequence: {
        tag: "00189338",
        vr: "SQ",
        vm: "1",
    },
    ContrastAdministrationProfileSequence: {
        tag: "00189340",
        vr: "SQ",
        vm: "1",
    },
    ContrastBolusUsageSequence: {
        tag: "00189341",
        vr: "SQ",
        vm: "1",
    },
    ContrastBolusAgentAdministered: {
        tag: "00189342",
        vr: "CS",
        vm: "1",
    },
    ContrastBolusAgentDetected: {
        tag: "00189343",
        vr: "CS",
        vm: "1",
    },
    ContrastBolusAgentPhase: {
        tag: "00189344",
        vr: "CS",
        vm: "1",
    },
    CTDIvol: {
        tag: "00189345",
        vr: "FD",
        vm: "1",
    },
    CTDIPhantomTypeCodeSequence: {
        tag: "00189346",
        vr: "SQ",
        vm: "1",
    },
    CalciumScoringMassFactorPatient: {
        tag: "00189351",
        vr: "FL",
        vm: "1",
    },
    CalciumScoringMassFactorDevice: {
        tag: "00189352",
        vr: "FL",
        vm: "3",
    },
    EnergyWeightingFactor: {
        tag: "00189353",
        vr: "FL",
        vm: "1",
    },
    CTAdditionalXRaySourceSequence: {
        tag: "00189360",
        vr: "SQ",
        vm: "1",
    },
    MultienergyCTAcquisition: {
        tag: "00189361",
        vr: "CS",
        vm: "1",
    },
    MultienergyCTAcquisitionSequence: {
        tag: "00189362",
        vr: "SQ",
        vm: "1",
    },
    MultienergyCTProcessingSequence: {
        tag: "00189363",
        vr: "SQ",
        vm: "1",
    },
    MultienergyCTCharacteristicsSequence: {
        tag: "00189364",
        vr: "SQ",
        vm: "1",
    },
    MultienergyCTXRaySourceSequence: {
        tag: "00189365",
        vr: "SQ",
        vm: "1",
    },
    XRaySourceIndex: {
        tag: "00189366",
        vr: "US",
        vm: "1",
    },
    XRaySourceID: {
        tag: "00189367",
        vr: "UC",
        vm: "1",
    },
    MultienergySourceTechnique: {
        tag: "00189368",
        vr: "CS",
        vm: "1",
    },
    SourceStartDateTime: {
        tag: "00189369",
        vr: "DT",
        vm: "1",
    },
    SourceEndDateTime: {
        tag: "0018936A",
        vr: "DT",
        vm: "1",
    },
    SwitchingPhaseNumber: {
        tag: "0018936B",
        vr: "US",
        vm: "1",
    },
    SwitchingPhaseNominalDuration: {
        tag: "0018936C",
        vr: "DS",
        vm: "1",
    },
    SwitchingPhaseTransitionDuration: {
        tag: "0018936D",
        vr: "DS",
        vm: "1",
    },
    EffectiveBinEnergy: {
        tag: "0018936E",
        vr: "DS",
        vm: "1",
    },
    MultienergyCTXRayDetectorSequence: {
        tag: "0018936F",
        vr: "SQ",
        vm: "1",
    },
    XRayDetectorIndex: {
        tag: "00189370",
        vr: "US",
        vm: "1",
    },
    XRayDetectorID: {
        tag: "00189371",
        vr: "UC",
        vm: "1",
    },
    MultienergyDetectorType: {
        tag: "00189372",
        vr: "CS",
        vm: "1",
    },
    XRayDetectorLabel: {
        tag: "00189373",
        vr: "ST",
        vm: "1",
    },
    NominalMaxEnergy: {
        tag: "00189374",
        vr: "DS",
        vm: "1",
    },
    NominalMinEnergy: {
        tag: "00189375",
        vr: "DS",
        vm: "1",
    },
    ReferencedXRayDetectorIndex: {
        tag: "00189376",
        vr: "US",
        vm: "1-n",
    },
    ReferencedXRaySourceIndex: {
        tag: "00189377",
        vr: "US",
        vm: "1-n",
    },
    ReferencedPathIndex: {
        tag: "00189378",
        vr: "US",
        vm: "1-n",
    },
    MultienergyCTPathSequence: {
        tag: "00189379",
        vr: "SQ",
        vm: "1",
    },
    MultienergyCTPathIndex: {
        tag: "0018937A",
        vr: "US",
        vm: "1",
    },
    MultienergyAcquisitionDescription: {
        tag: "0018937B",
        vr: "UT",
        vm: "1",
    },
    MonoenergeticEnergyEquivalent: {
        tag: "0018937C",
        vr: "FD",
        vm: "1",
    },
    MaterialCodeSequence: {
        tag: "0018937D",
        vr: "SQ",
        vm: "1",
    },
    DecompositionMethod: {
        tag: "0018937E",
        vr: "CS",
        vm: "1",
    },
    DecompositionDescription: {
        tag: "0018937F",
        vr: "UT",
        vm: "1",
    },
    DecompositionAlgorithmIdentificationSequence: {
        tag: "00189380",
        vr: "SQ",
        vm: "1",
    },
    DecompositionMaterialSequence: {
        tag: "00189381",
        vr: "SQ",
        vm: "1",
    },
    MaterialAttenuationSequence: {
        tag: "00189382",
        vr: "SQ",
        vm: "1",
    },
    PhotonEnergy: {
        tag: "00189383",
        vr: "DS",
        vm: "1",
    },
    XRayMassAttenuationCoefficient: {
        tag: "00189384",
        vr: "DS",
        vm: "1",
    },
    ProjectionPixelCalibrationSequence: {
        tag: "00189401",
        vr: "SQ",
        vm: "1",
    },
    DistanceSourceToIsocenter: {
        tag: "00189402",
        vr: "FL",
        vm: "1",
    },
    DistanceObjectToTableTop: {
        tag: "00189403",
        vr: "FL",
        vm: "1",
    },
    ObjectPixelSpacingInCenterOfBeam: {
        tag: "00189404",
        vr: "FL",
        vm: "2",
    },
    PositionerPositionSequence: {
        tag: "00189405",
        vr: "SQ",
        vm: "1",
    },
    TablePositionSequence: {
        tag: "00189406",
        vr: "SQ",
        vm: "1",
    },
    CollimatorShapeSequence: {
        tag: "00189407",
        vr: "SQ",
        vm: "1",
    },
    PlanesInAcquisition: {
        tag: "00189410",
        vr: "CS",
        vm: "1",
    },
    XAXRFFrameCharacteristicsSequence: {
        tag: "00189412",
        vr: "SQ",
        vm: "1",
    },
    FrameAcquisitionSequence: {
        tag: "00189417",
        vr: "SQ",
        vm: "1",
    },
    XRayReceptorType: {
        tag: "00189420",
        vr: "CS",
        vm: "1",
    },
    AcquisitionProtocolName: {
        tag: "00189423",
        vr: "LO",
        vm: "1",
    },
    AcquisitionProtocolDescription: {
        tag: "00189424",
        vr: "LT",
        vm: "1",
    },
    ContrastBolusIngredientOpaque: {
        tag: "00189425",
        vr: "CS",
        vm: "1",
    },
    DistanceReceptorPlaneToDetectorHousing: {
        tag: "00189426",
        vr: "FL",
        vm: "1",
    },
    IntensifierActiveShape: {
        tag: "00189427",
        vr: "CS",
        vm: "1",
    },
    IntensifierActiveDimensions: {
        tag: "00189428",
        vr: "FL",
        vm: "1-2",
    },
    PhysicalDetectorSize: {
        tag: "00189429",
        vr: "FL",
        vm: "2",
    },
    PositionOfIsocenterProjection: {
        tag: "00189430",
        vr: "FL",
        vm: "2",
    },
    FieldOfViewSequence: {
        tag: "00189432",
        vr: "SQ",
        vm: "1",
    },
    FieldOfViewDescription: {
        tag: "00189433",
        vr: "LO",
        vm: "1",
    },
    ExposureControlSensingRegionsSequence: {
        tag: "00189434",
        vr: "SQ",
        vm: "1",
    },
    ExposureControlSensingRegionShape: {
        tag: "00189435",
        vr: "CS",
        vm: "1",
    },
    ExposureControlSensingRegionLeftVerticalEdge: {
        tag: "00189436",
        vr: "SS",
        vm: "1",
    },
    ExposureControlSensingRegionRightVerticalEdge: {
        tag: "00189437",
        vr: "SS",
        vm: "1",
    },
    ExposureControlSensingRegionUpperHorizontalEdge: {
        tag: "00189438",
        vr: "SS",
        vm: "1",
    },
    ExposureControlSensingRegionLowerHorizontalEdge: {
        tag: "00189439",
        vr: "SS",
        vm: "1",
    },
    CenterOfCircularExposureControlSensingRegion: {
        tag: "00189440",
        vr: "SS",
        vm: "2",
    },
    RadiusOfCircularExposureControlSensingRegion: {
        tag: "00189441",
        vr: "US",
        vm: "1",
    },
    VerticesOfThePolygonalExposureControlSensingRegion: {
        tag: "00189442",
        vr: "SS",
        vm: "2-n",
    },
    ColumnAngulationPatient: {
        tag: "00189447",
        vr: "FL",
        vm: "1",
    },
    BeamAngle: {
        tag: "00189449",
        vr: "FL",
        vm: "1",
    },
    FrameDetectorParametersSequence: {
        tag: "00189451",
        vr: "SQ",
        vm: "1",
    },
    CalculatedAnatomyThickness: {
        tag: "00189452",
        vr: "FL",
        vm: "1",
    },
    CalibrationSequence: {
        tag: "00189455",
        vr: "SQ",
        vm: "1",
    },
    ObjectThicknessSequence: {
        tag: "00189456",
        vr: "SQ",
        vm: "1",
    },
    PlaneIdentification: {
        tag: "00189457",
        vr: "CS",
        vm: "1",
    },
    FieldOfViewDimensionsInFloat: {
        tag: "00189461",
        vr: "FL",
        vm: "1-2",
    },
    IsocenterReferenceSystemSequence: {
        tag: "00189462",
        vr: "SQ",
        vm: "1",
    },
    PositionerIsocenterPrimaryAngle: {
        tag: "00189463",
        vr: "FL",
        vm: "1",
    },
    PositionerIsocenterSecondaryAngle: {
        tag: "00189464",
        vr: "FL",
        vm: "1",
    },
    PositionerIsocenterDetectorRotationAngle: {
        tag: "00189465",
        vr: "FL",
        vm: "1",
    },
    TableXPositionToIsocenter: {
        tag: "00189466",
        vr: "FL",
        vm: "1",
    },
    TableYPositionToIsocenter: {
        tag: "00189467",
        vr: "FL",
        vm: "1",
    },
    TableZPositionToIsocenter: {
        tag: "00189468",
        vr: "FL",
        vm: "1",
    },
    TableHorizontalRotationAngle: {
        tag: "00189469",
        vr: "FL",
        vm: "1",
    },
    TableHeadTiltAngle: {
        tag: "00189470",
        vr: "FL",
        vm: "1",
    },
    TableCradleTiltAngle: {
        tag: "00189471",
        vr: "FL",
        vm: "1",
    },
    FrameDisplayShutterSequence: {
        tag: "00189472",
        vr: "SQ",
        vm: "1",
    },
    AcquiredImageAreaDoseProduct: {
        tag: "00189473",
        vr: "FL",
        vm: "1",
    },
    CArmPositionerTabletopRelationship: {
        tag: "00189474",
        vr: "CS",
        vm: "1",
    },
    XRayGeometrySequence: {
        tag: "00189476",
        vr: "SQ",
        vm: "1",
    },
    IrradiationEventIdentificationSequence: {
        tag: "00189477",
        vr: "SQ",
        vm: "1",
    },
    XRay3DFrameTypeSequence: {
        tag: "00189504",
        vr: "SQ",
        vm: "1",
    },
    ContributingSourcesSequence: {
        tag: "00189506",
        vr: "SQ",
        vm: "1",
    },
    XRay3DAcquisitionSequence: {
        tag: "00189507",
        vr: "SQ",
        vm: "1",
    },
    PrimaryPositionerScanArc: {
        tag: "00189508",
        vr: "FL",
        vm: "1",
    },
    SecondaryPositionerScanArc: {
        tag: "00189509",
        vr: "FL",
        vm: "1",
    },
    PrimaryPositionerScanStartAngle: {
        tag: "00189510",
        vr: "FL",
        vm: "1",
    },
    SecondaryPositionerScanStartAngle: {
        tag: "00189511",
        vr: "FL",
        vm: "1",
    },
    PrimaryPositionerIncrement: {
        tag: "00189514",
        vr: "FL",
        vm: "1",
    },
    SecondaryPositionerIncrement: {
        tag: "00189515",
        vr: "FL",
        vm: "1",
    },
    StartAcquisitionDateTime: {
        tag: "00189516",
        vr: "DT",
        vm: "1",
    },
    EndAcquisitionDateTime: {
        tag: "00189517",
        vr: "DT",
        vm: "1",
    },
    PrimaryPositionerIncrementSign: {
        tag: "00189518",
        vr: "SS",
        vm: "1",
    },
    SecondaryPositionerIncrementSign: {
        tag: "00189519",
        vr: "SS",
        vm: "1",
    },
    ApplicationName: {
        tag: "00189524",
        vr: "LO",
        vm: "1",
    },
    ApplicationVersion: {
        tag: "00189525",
        vr: "LO",
        vm: "1",
    },
    ApplicationManufacturer: {
        tag: "00189526",
        vr: "LO",
        vm: "1",
    },
    AlgorithmType: {
        tag: "00189527",
        vr: "CS",
        vm: "1",
    },
    AlgorithmDescription: {
        tag: "00189528",
        vr: "LO",
        vm: "1",
    },
    XRay3DReconstructionSequence: {
        tag: "00189530",
        vr: "SQ",
        vm: "1",
    },
    ReconstructionDescription: {
        tag: "00189531",
        vr: "LO",
        vm: "1",
    },
    PerProjectionAcquisitionSequence: {
        tag: "00189538",
        vr: "SQ",
        vm: "1",
    },
    DetectorPositionSequence: {
        tag: "00189541",
        vr: "SQ",
        vm: "1",
    },
    XRayAcquisitionDoseSequence: {
        tag: "00189542",
        vr: "SQ",
        vm: "1",
    },
    XRaySourceIsocenterPrimaryAngle: {
        tag: "00189543",
        vr: "FD",
        vm: "1",
    },
    XRaySourceIsocenterSecondaryAngle: {
        tag: "00189544",
        vr: "FD",
        vm: "1",
    },
    BreastSupportIsocenterPrimaryAngle: {
        tag: "00189545",
        vr: "FD",
        vm: "1",
    },
    BreastSupportIsocenterSecondaryAngle: {
        tag: "00189546",
        vr: "FD",
        vm: "1",
    },
    BreastSupportXPositionToIsocenter: {
        tag: "00189547",
        vr: "FD",
        vm: "1",
    },
    BreastSupportYPositionToIsocenter: {
        tag: "00189548",
        vr: "FD",
        vm: "1",
    },
    BreastSupportZPositionToIsocenter: {
        tag: "00189549",
        vr: "FD",
        vm: "1",
    },
    DetectorIsocenterPrimaryAngle: {
        tag: "00189550",
        vr: "FD",
        vm: "1",
    },
    DetectorIsocenterSecondaryAngle: {
        tag: "00189551",
        vr: "FD",
        vm: "1",
    },
    DetectorXPositionToIsocenter: {
        tag: "00189552",
        vr: "FD",
        vm: "1",
    },
    DetectorYPositionToIsocenter: {
        tag: "00189553",
        vr: "FD",
        vm: "1",
    },
    DetectorZPositionToIsocenter: {
        tag: "00189554",
        vr: "FD",
        vm: "1",
    },
    XRayGridSequence: {
        tag: "00189555",
        vr: "SQ",
        vm: "1",
    },
    XRayFilterSequence: {
        tag: "00189556",
        vr: "SQ",
        vm: "1",
    },
    DetectorActiveAreaTLHCPosition: {
        tag: "00189557",
        vr: "FD",
        vm: "3",
    },
    DetectorActiveAreaOrientation: {
        tag: "00189558",
        vr: "FD",
        vm: "6",
    },
    PositionerPrimaryAngleDirection: {
        tag: "00189559",
        vr: "CS",
        vm: "1",
    },
    DiffusionBMatrixSequence: {
        tag: "00189601",
        vr: "SQ",
        vm: "1",
    },
    DiffusionBValueXX: {
        tag: "00189602",
        vr: "FD",
        vm: "1",
    },
    DiffusionBValueXY: {
        tag: "00189603",
        vr: "FD",
        vm: "1",
    },
    DiffusionBValueXZ: {
        tag: "00189604",
        vr: "FD",
        vm: "1",
    },
    DiffusionBValueYY: {
        tag: "00189605",
        vr: "FD",
        vm: "1",
    },
    DiffusionBValueYZ: {
        tag: "00189606",
        vr: "FD",
        vm: "1",
    },
    DiffusionBValueZZ: {
        tag: "00189607",
        vr: "FD",
        vm: "1",
    },
    FunctionalMRSequence: {
        tag: "00189621",
        vr: "SQ",
        vm: "1",
    },
    FunctionalSettlingPhaseFramesPresent: {
        tag: "00189622",
        vr: "CS",
        vm: "1",
    },
    FunctionalSyncPulse: {
        tag: "00189623",
        vr: "DT",
        vm: "1",
    },
    SettlingPhaseFrame: {
        tag: "00189624",
        vr: "CS",
        vm: "1",
    },
    DecayCorrectionDateTime: {
        tag: "00189701",
        vr: "DT",
        vm: "1",
    },
    StartDensityThreshold: {
        tag: "00189715",
        vr: "FD",
        vm: "1",
    },
    StartRelativeDensityDifferenceThreshold: {
        tag: "00189716",
        vr: "FD",
        vm: "1",
    },
    StartCardiacTriggerCountThreshold: {
        tag: "00189717",
        vr: "FD",
        vm: "1",
    },
    StartRespiratoryTriggerCountThreshold: {
        tag: "00189718",
        vr: "FD",
        vm: "1",
    },
    TerminationCountsThreshold: {
        tag: "00189719",
        vr: "FD",
        vm: "1",
    },
    TerminationDensityThreshold: {
        tag: "00189720",
        vr: "FD",
        vm: "1",
    },
    TerminationRelativeDensityThreshold: {
        tag: "00189721",
        vr: "FD",
        vm: "1",
    },
    TerminationTimeThreshold: {
        tag: "00189722",
        vr: "FD",
        vm: "1",
    },
    TerminationCardiacTriggerCountThreshold: {
        tag: "00189723",
        vr: "FD",
        vm: "1",
    },
    TerminationRespiratoryTriggerCountThreshold: {
        tag: "00189724",
        vr: "FD",
        vm: "1",
    },
    DetectorGeometry: {
        tag: "00189725",
        vr: "CS",
        vm: "1",
    },
    TransverseDetectorSeparation: {
        tag: "00189726",
        vr: "FD",
        vm: "1",
    },
    AxialDetectorDimension: {
        tag: "00189727",
        vr: "FD",
        vm: "1",
    },
    RadiopharmaceuticalAgentNumber: {
        tag: "00189729",
        vr: "US",
        vm: "1",
    },
    PETFrameAcquisitionSequence: {
        tag: "00189732",
        vr: "SQ",
        vm: "1",
    },
    PETDetectorMotionDetailsSequence: {
        tag: "00189733",
        vr: "SQ",
        vm: "1",
    },
    PETTableDynamicsSequence: {
        tag: "00189734",
        vr: "SQ",
        vm: "1",
    },
    PETPositionSequence: {
        tag: "00189735",
        vr: "SQ",
        vm: "1",
    },
    PETFrameCorrectionFactorsSequence: {
        tag: "00189736",
        vr: "SQ",
        vm: "1",
    },
    RadiopharmaceuticalUsageSequence: {
        tag: "00189737",
        vr: "SQ",
        vm: "1",
    },
    AttenuationCorrectionSource: {
        tag: "00189738",
        vr: "CS",
        vm: "1",
    },
    NumberOfIterations: {
        tag: "00189739",
        vr: "US",
        vm: "1",
    },
    NumberOfSubsets: {
        tag: "00189740",
        vr: "US",
        vm: "1",
    },
    PETReconstructionSequence: {
        tag: "00189749",
        vr: "SQ",
        vm: "1",
    },
    PETFrameTypeSequence: {
        tag: "00189751",
        vr: "SQ",
        vm: "1",
    },
    TimeOfFlightInformationUsed: {
        tag: "00189755",
        vr: "CS",
        vm: "1",
    },
    ReconstructionType: {
        tag: "00189756",
        vr: "CS",
        vm: "1",
    },
    DecayCorrected: {
        tag: "00189758",
        vr: "CS",
        vm: "1",
    },
    AttenuationCorrected: {
        tag: "00189759",
        vr: "CS",
        vm: "1",
    },
    ScatterCorrected: {
        tag: "00189760",
        vr: "CS",
        vm: "1",
    },
    DeadTimeCorrected: {
        tag: "00189761",
        vr: "CS",
        vm: "1",
    },
    GantryMotionCorrected: {
        tag: "00189762",
        vr: "CS",
        vm: "1",
    },
    PatientMotionCorrected: {
        tag: "00189763",
        vr: "CS",
        vm: "1",
    },
    CountLossNormalizationCorrected: {
        tag: "00189764",
        vr: "CS",
        vm: "1",
    },
    RandomsCorrected: {
        tag: "00189765",
        vr: "CS",
        vm: "1",
    },
    NonUniformRadialSamplingCorrected: {
        tag: "00189766",
        vr: "CS",
        vm: "1",
    },
    SensitivityCalibrated: {
        tag: "00189767",
        vr: "CS",
        vm: "1",
    },
    DetectorNormalizationCorrection: {
        tag: "00189768",
        vr: "CS",
        vm: "1",
    },
    IterativeReconstructionMethod: {
        tag: "00189769",
        vr: "CS",
        vm: "1",
    },
    AttenuationCorrectionTemporalRelationship: {
        tag: "00189770",
        vr: "CS",
        vm: "1",
    },
    PatientPhysiologicalStateSequence: {
        tag: "00189771",
        vr: "SQ",
        vm: "1",
    },
    PatientPhysiologicalStateCodeSequence: {
        tag: "00189772",
        vr: "SQ",
        vm: "1",
    },
    DepthsOfFocus: {
        tag: "00189801",
        vr: "FD",
        vm: "1-n",
    },
    ExcludedIntervalsSequence: {
        tag: "00189803",
        vr: "SQ",
        vm: "1",
    },
    ExclusionStartDateTime: {
        tag: "00189804",
        vr: "DT",
        vm: "1",
    },
    ExclusionDuration: {
        tag: "00189805",
        vr: "FD",
        vm: "1",
    },
    USImageDescriptionSequence: {
        tag: "00189806",
        vr: "SQ",
        vm: "1",
    },
    ImageDataTypeSequence: {
        tag: "00189807",
        vr: "SQ",
        vm: "1",
    },
    DataType: {
        tag: "00189808",
        vr: "CS",
        vm: "1",
    },
    TransducerScanPatternCodeSequence: {
        tag: "00189809",
        vr: "SQ",
        vm: "1",
    },
    AliasedDataType: {
        tag: "0018980B",
        vr: "CS",
        vm: "1",
    },
    PositionMeasuringDeviceUsed: {
        tag: "0018980C",
        vr: "CS",
        vm: "1",
    },
    TransducerGeometryCodeSequence: {
        tag: "0018980D",
        vr: "SQ",
        vm: "1",
    },
    TransducerBeamSteeringCodeSequence: {
        tag: "0018980E",
        vr: "SQ",
        vm: "1",
    },
    TransducerApplicationCodeSequence: {
        tag: "0018980F",
        vr: "SQ",
        vm: "1",
    },
    ZeroVelocityPixelValue: {
        tag: "00189810",
        vr: "US or SS",
        vm: "1",
    },
    PhotoacousticExcitationCharacteristicsSequence: {
        tag: "00189821",
        vr: "SQ",
        vm: "1",
    },
    ExcitationSpectralWidth: {
        tag: "00189822",
        vr: "FD",
        vm: "1",
    },
    ExcitationEnergy: {
        tag: "00189823",
        vr: "FD",
        vm: "1",
    },
    ExcitationPulseDuration: {
        tag: "00189824",
        vr: "FD",
        vm: "1",
    },
    ExcitationWavelengthSequence: {
        tag: "00189825",
        vr: "SQ",
        vm: "1",
    },
    ExcitationWavelength: {
        tag: "00189826",
        vr: "FD",
        vm: "1",
    },
    IlluminationTranslationFlag: {
        tag: "00189828",
        vr: "CS",
        vm: "1",
    },
    AcousticCouplingMediumFlag: {
        tag: "00189829",
        vr: "CS",
        vm: "1",
    },
    AcousticCouplingMediumCodeSequence: {
        tag: "0018982A",
        vr: "SQ",
        vm: "1",
    },
    AcousticCouplingMediumTemperature: {
        tag: "0018982B",
        vr: "FD",
        vm: "1",
    },
    TransducerResponseSequence: {
        tag: "0018982C",
        vr: "SQ",
        vm: "1",
    },
    CenterFrequency: {
        tag: "0018982D",
        vr: "FD",
        vm: "1",
    },
    FractionalBandwidth: {
        tag: "0018982E",
        vr: "FD",
        vm: "1",
    },
    LowerCutoffFrequency: {
        tag: "0018982F",
        vr: "FD",
        vm: "1",
    },
    UpperCutoffFrequency: {
        tag: "00189830",
        vr: "FD",
        vm: "1",
    },
    TransducerTechnologySequence: {
        tag: "00189831",
        vr: "SQ",
        vm: "1",
    },
    SoundSpeedCorrectionMechanismCodeSequence: {
        tag: "00189832",
        vr: "SQ",
        vm: "1",
    },
    ObjectSoundSpeed: {
        tag: "00189833",
        vr: "FD",
        vm: "1",
    },
    AcousticCouplingMediumSoundSpeed: {
        tag: "00189834",
        vr: "FD",
        vm: "1",
    },
    PhotoacousticImageFrameTypeSequence: {
        tag: "00189835",
        vr: "SQ",
        vm: "1",
    },
    ImageDataTypeCodeSequence: {
        tag: "00189836",
        vr: "SQ",
        vm: "1",
    },
    ReferenceLocationLabel: {
        tag: "00189900",
        vr: "LO",
        vm: "1",
    },
    ReferenceLocationDescription: {
        tag: "00189901",
        vr: "UT",
        vm: "1",
    },
    ReferenceBasisCodeSequence: {
        tag: "00189902",
        vr: "SQ",
        vm: "1",
    },
    ReferenceGeometryCodeSequence: {
        tag: "00189903",
        vr: "SQ",
        vm: "1",
    },
    OffsetDistance: {
        tag: "00189904",
        vr: "DS",
        vm: "1",
    },
    OffsetDirection: {
        tag: "00189905",
        vr: "CS",
        vm: "1",
    },
    PotentialScheduledProtocolCodeSequence: {
        tag: "00189906",
        vr: "SQ",
        vm: "1",
    },
    PotentialRequestedProcedureCodeSequence: {
        tag: "00189907",
        vr: "SQ",
        vm: "1",
    },
    PotentialReasonsForProcedure: {
        tag: "00189908",
        vr: "UC",
        vm: "1-n",
    },
    PotentialReasonsForProcedureCodeSequence: {
        tag: "00189909",
        vr: "SQ",
        vm: "1",
    },
    PotentialDiagnosticTasks: {
        tag: "0018990A",
        vr: "UC",
        vm: "1-n",
    },
    ContraindicationsCodeSequence: {
        tag: "0018990B",
        vr: "SQ",
        vm: "1",
    },
    ReferencedDefinedProtocolSequence: {
        tag: "0018990C",
        vr: "SQ",
        vm: "1",
    },
    ReferencedPerformedProtocolSequence: {
        tag: "0018990D",
        vr: "SQ",
        vm: "1",
    },
    PredecessorProtocolSequence: {
        tag: "0018990E",
        vr: "SQ",
        vm: "1",
    },
    ProtocolPlanningInformation: {
        tag: "0018990F",
        vr: "UT",
        vm: "1",
    },
    ProtocolDesignRationale: {
        tag: "00189910",
        vr: "UT",
        vm: "1",
    },
    PatientSpecificationSequence: {
        tag: "00189911",
        vr: "SQ",
        vm: "1",
    },
    ModelSpecificationSequence: {
        tag: "00189912",
        vr: "SQ",
        vm: "1",
    },
    ParametersSpecificationSequence: {
        tag: "00189913",
        vr: "SQ",
        vm: "1",
    },
    InstructionSequence: {
        tag: "00189914",
        vr: "SQ",
        vm: "1",
    },
    InstructionIndex: {
        tag: "00189915",
        vr: "US",
        vm: "1",
    },
    InstructionText: {
        tag: "00189916",
        vr: "LO",
        vm: "1",
    },
    InstructionDescription: {
        tag: "00189917",
        vr: "UT",
        vm: "1",
    },
    InstructionPerformedFlag: {
        tag: "00189918",
        vr: "CS",
        vm: "1",
    },
    InstructionPerformedDateTime: {
        tag: "00189919",
        vr: "DT",
        vm: "1",
    },
    InstructionPerformanceComment: {
        tag: "0018991A",
        vr: "UT",
        vm: "1",
    },
    PatientPositioningInstructionSequence: {
        tag: "0018991B",
        vr: "SQ",
        vm: "1",
    },
    PositioningMethodCodeSequence: {
        tag: "0018991C",
        vr: "SQ",
        vm: "1",
    },
    PositioningLandmarkSequence: {
        tag: "0018991D",
        vr: "SQ",
        vm: "1",
    },
    TargetFrameOfReferenceUID: {
        tag: "0018991E",
        vr: "UI",
        vm: "1",
    },
    AcquisitionProtocolElementSpecificationSequence: {
        tag: "0018991F",
        vr: "SQ",
        vm: "1",
    },
    AcquisitionProtocolElementSequence: {
        tag: "00189920",
        vr: "SQ",
        vm: "1",
    },
    ProtocolElementNumber: {
        tag: "00189921",
        vr: "US",
        vm: "1",
    },
    ProtocolElementName: {
        tag: "00189922",
        vr: "LO",
        vm: "1",
    },
    ProtocolElementCharacteristicsSummary: {
        tag: "00189923",
        vr: "UT",
        vm: "1",
    },
    ProtocolElementPurpose: {
        tag: "00189924",
        vr: "UT",
        vm: "1",
    },
    AcquisitionMotion: {
        tag: "00189930",
        vr: "CS",
        vm: "1",
    },
    AcquisitionStartLocationSequence: {
        tag: "00189931",
        vr: "SQ",
        vm: "1",
    },
    AcquisitionEndLocationSequence: {
        tag: "00189932",
        vr: "SQ",
        vm: "1",
    },
    ReconstructionProtocolElementSpecificationSequence: {
        tag: "00189933",
        vr: "SQ",
        vm: "1",
    },
    ReconstructionProtocolElementSequence: {
        tag: "00189934",
        vr: "SQ",
        vm: "1",
    },
    StorageProtocolElementSpecificationSequence: {
        tag: "00189935",
        vr: "SQ",
        vm: "1",
    },
    StorageProtocolElementSequence: {
        tag: "00189936",
        vr: "SQ",
        vm: "1",
    },
    RequestedSeriesDescription: {
        tag: "00189937",
        vr: "LO",
        vm: "1",
    },
    SourceAcquisitionProtocolElementNumber: {
        tag: "00189938",
        vr: "US",
        vm: "1-n",
    },
    SourceAcquisitionBeamNumber: {
        tag: "00189939",
        vr: "US",
        vm: "1-n",
    },
    SourceReconstructionProtocolElementNumber: {
        tag: "0018993A",
        vr: "US",
        vm: "1-n",
    },
    ReconstructionStartLocationSequence: {
        tag: "0018993B",
        vr: "SQ",
        vm: "1",
    },
    ReconstructionEndLocationSequence: {
        tag: "0018993C",
        vr: "SQ",
        vm: "1",
    },
    ReconstructionAlgorithmSequence: {
        tag: "0018993D",
        vr: "SQ",
        vm: "1",
    },
    ReconstructionTargetCenterLocationSequence: {
        tag: "0018993E",
        vr: "SQ",
        vm: "1",
    },
    ImageFilterDescription: {
        tag: "00189941",
        vr: "UT",
        vm: "1",
    },
    CTDIvolNotificationTrigger: {
        tag: "00189942",
        vr: "FD",
        vm: "1",
    },
    DLPNotificationTrigger: {
        tag: "00189943",
        vr: "FD",
        vm: "1",
    },
    AutoKVPSelectionType: {
        tag: "00189944",
        vr: "CS",
        vm: "1",
    },
    AutoKVPUpperBound: {
        tag: "00189945",
        vr: "FD",
        vm: "1",
    },
    AutoKVPLowerBound: {
        tag: "00189946",
        vr: "FD",
        vm: "1",
    },
    ProtocolDefinedPatientPosition: {
        tag: "00189947",
        vr: "CS",
        vm: "1",
    },
    ContributingEquipmentSequence: {
        tag: "0018A001",
        vr: "SQ",
        vm: "1",
    },
    ContributionDateTime: {
        tag: "0018A002",
        vr: "DT",
        vm: "1",
    },
    ContributionDescription: {
        tag: "0018A003",
        vr: "ST",
        vm: "1",
    },
    StudyInstanceUID: {
        tag: "0020000D",
        vr: "UI",
        vm: "1",
    },
    SeriesInstanceUID: {
        tag: "0020000E",
        vr: "UI",
        vm: "1",
    },
    StudyID: {
        tag: "00200010",
        vr: "SH",
        vm: "1",
    },
    SeriesNumber: {
        tag: "00200011",
        vr: "IS",
        vm: "1",
    },
    AcquisitionNumber: {
        tag: "00200012",
        vr: "IS",
        vm: "1",
    },
    InstanceNumber: {
        tag: "00200013",
        vr: "IS",
        vm: "1",
    },
    IsotopeNumber: {
        tag: "00200014",
        vr: "IS",
        vm: "1",
    },
    PhaseNumber: {
        tag: "00200015",
        vr: "IS",
        vm: "1",
    },
    IntervalNumber: {
        tag: "00200016",
        vr: "IS",
        vm: "1",
    },
    TimeSlotNumber: {
        tag: "00200017",
        vr: "IS",
        vm: "1",
    },
    AngleNumber: {
        tag: "00200018",
        vr: "IS",
        vm: "1",
    },
    ItemNumber: {
        tag: "00200019",
        vr: "IS",
        vm: "1",
    },
    PatientOrientation: {
        tag: "00200020",
        vr: "CS",
        vm: "2",
    },
    OverlayNumber: {
        tag: "00200022",
        vr: "IS",
        vm: "1",
    },
    CurveNumber: {
        tag: "00200024",
        vr: "IS",
        vm: "1",
    },
    LUTNumber: {
        tag: "00200026",
        vr: "IS",
        vm: "1",
    },
    PyramidLabel: {
        tag: "00200027",
        vr: "LO",
        vm: "1",
    },
    ImagePosition: {
        tag: "00200030",
        vr: "DS",
        vm: "3",
    },
    ImagePositionPatient: {
        tag: "00200032",
        vr: "DS",
        vm: "3",
    },
    ImageOrientation: {
        tag: "00200035",
        vr: "DS",
        vm: "6",
    },
    ImageOrientationPatient: {
        tag: "00200037",
        vr: "DS",
        vm: "6",
    },
    Location: {
        tag: "00200050",
        vr: "DS",
        vm: "1",
    },
    FrameOfReferenceUID: {
        tag: "00200052",
        vr: "UI",
        vm: "1",
    },
    Laterality: {
        tag: "00200060",
        vr: "CS",
        vm: "1",
    },
    ImageLaterality: {
        tag: "00200062",
        vr: "CS",
        vm: "1",
    },
    ImageGeometryType: {
        tag: "00200070",
        vr: "LO",
        vm: "1",
    },
    MaskingImage: {
        tag: "00200080",
        vr: "CS",
        vm: "1-n",
    },
    ReportNumber: {
        tag: "002000AA",
        vr: "IS",
        vm: "1",
    },
    TemporalPositionIdentifier: {
        tag: "00200100",
        vr: "IS",
        vm: "1",
    },
    NumberOfTemporalPositions: {
        tag: "00200105",
        vr: "IS",
        vm: "1",
    },
    TemporalResolution: {
        tag: "00200110",
        vr: "DS",
        vm: "1",
    },
    SynchronizationFrameOfReferenceUID: {
        tag: "00200200",
        vr: "UI",
        vm: "1",
    },
    SOPInstanceUIDOfConcatenationSource: {
        tag: "00200242",
        vr: "UI",
        vm: "1",
    },
    SeriesInStudy: {
        tag: "00201000",
        vr: "IS",
        vm: "1",
    },
    AcquisitionsInSeries: {
        tag: "00201001",
        vr: "IS",
        vm: "1",
    },
    ImagesInAcquisition: {
        tag: "00201002",
        vr: "IS",
        vm: "1",
    },
    ImagesInSeries: {
        tag: "00201003",
        vr: "IS",
        vm: "1",
    },
    AcquisitionsInStudy: {
        tag: "00201004",
        vr: "IS",
        vm: "1",
    },
    ImagesInStudy: {
        tag: "00201005",
        vr: "IS",
        vm: "1",
    },
    Reference: {
        tag: "00201020",
        vr: "LO",
        vm: "1-n",
    },
    TargetPositionReferenceIndicator: {
        tag: "0020103F",
        vr: "LO",
        vm: "1",
    },
    PositionReferenceIndicator: {
        tag: "00201040",
        vr: "LO",
        vm: "1",
    },
    SliceLocation: {
        tag: "00201041",
        vr: "DS",
        vm: "1",
    },
    OtherStudyNumbers: {
        tag: "00201070",
        vr: "IS",
        vm: "1-n",
    },
    NumberOfPatientRelatedStudies: {
        tag: "00201200",
        vr: "IS",
        vm: "1",
    },
    NumberOfPatientRelatedSeries: {
        tag: "00201202",
        vr: "IS",
        vm: "1",
    },
    NumberOfPatientRelatedInstances: {
        tag: "00201204",
        vr: "IS",
        vm: "1",
    },
    NumberOfStudyRelatedSeries: {
        tag: "00201206",
        vr: "IS",
        vm: "1",
    },
    NumberOfStudyRelatedInstances: {
        tag: "00201208",
        vr: "IS",
        vm: "1",
    },
    NumberOfSeriesRelatedInstances: {
        tag: "00201209",
        vr: "IS",
        vm: "1",
    },
    SourceImageIDs: {
        tag: "002031xx",
        vr: "CS",
        vm: "1-n",
    },
    ModifyingDeviceID: {
        tag: "00203401",
        vr: "CS",
        vm: "1",
    },
    ModifiedImageID: {
        tag: "00203402",
        vr: "CS",
        vm: "1",
    },
    ModifiedImageDate: {
        tag: "00203403",
        vr: "DA",
        vm: "1",
    },
    ModifyingDeviceManufacturer: {
        tag: "00203404",
        vr: "LO",
        vm: "1",
    },
    ModifiedImageTime: {
        tag: "00203405",
        vr: "TM",
        vm: "1",
    },
    ModifiedImageDescription: {
        tag: "00203406",
        vr: "LO",
        vm: "1",
    },
    ImageComments: {
        tag: "00204000",
        vr: "LT",
        vm: "1",
    },
    OriginalImageIdentification: {
        tag: "00205000",
        vr: "AT",
        vm: "1-n",
    },
    OriginalImageIdentificationNomenclature: {
        tag: "00205002",
        vr: "LO",
        vm: "1-n",
    },
    StackID: {
        tag: "00209056",
        vr: "SH",
        vm: "1",
    },
    InStackPositionNumber: {
        tag: "00209057",
        vr: "UL",
        vm: "1",
    },
    FrameAnatomySequence: {
        tag: "00209071",
        vr: "SQ",
        vm: "1",
    },
    FrameLaterality: {
        tag: "00209072",
        vr: "CS",
        vm: "1",
    },
    FrameContentSequence: {
        tag: "00209111",
        vr: "SQ",
        vm: "1",
    },
    PlanePositionSequence: {
        tag: "00209113",
        vr: "SQ",
        vm: "1",
    },
    PlaneOrientationSequence: {
        tag: "00209116",
        vr: "SQ",
        vm: "1",
    },
    TemporalPositionIndex: {
        tag: "00209128",
        vr: "UL",
        vm: "1",
    },
    NominalCardiacTriggerDelayTime: {
        tag: "00209153",
        vr: "FD",
        vm: "1",
    },
    NominalCardiacTriggerTimePriorToRPeak: {
        tag: "00209154",
        vr: "FL",
        vm: "1",
    },
    ActualCardiacTriggerTimePriorToRPeak: {
        tag: "00209155",
        vr: "FL",
        vm: "1",
    },
    FrameAcquisitionNumber: {
        tag: "00209156",
        vr: "US",
        vm: "1",
    },
    DimensionIndexValues: {
        tag: "00209157",
        vr: "UL",
        vm: "1-n",
    },
    FrameComments: {
        tag: "00209158",
        vr: "LT",
        vm: "1",
    },
    ConcatenationUID: {
        tag: "00209161",
        vr: "UI",
        vm: "1",
    },
    InConcatenationNumber: {
        tag: "00209162",
        vr: "US",
        vm: "1",
    },
    InConcatenationTotalNumber: {
        tag: "00209163",
        vr: "US",
        vm: "1",
    },
    DimensionOrganizationUID: {
        tag: "00209164",
        vr: "UI",
        vm: "1",
    },
    DimensionIndexPointer: {
        tag: "00209165",
        vr: "AT",
        vm: "1",
    },
    FunctionalGroupPointer: {
        tag: "00209167",
        vr: "AT",
        vm: "1",
    },
    UnassignedSharedConvertedAttributesSequence: {
        tag: "00209170",
        vr: "SQ",
        vm: "1",
    },
    UnassignedPerFrameConvertedAttributesSequence: {
        tag: "00209171",
        vr: "SQ",
        vm: "1",
    },
    ConversionSourceAttributesSequence: {
        tag: "00209172",
        vr: "SQ",
        vm: "1",
    },
    DimensionIndexPrivateCreator: {
        tag: "00209213",
        vr: "LO",
        vm: "1",
    },
    DimensionOrganizationSequence: {
        tag: "00209221",
        vr: "SQ",
        vm: "1",
    },
    DimensionIndexSequence: {
        tag: "00209222",
        vr: "SQ",
        vm: "1",
    },
    ConcatenationFrameOffsetNumber: {
        tag: "00209228",
        vr: "UL",
        vm: "1",
    },
    FunctionalGroupPrivateCreator: {
        tag: "00209238",
        vr: "LO",
        vm: "1",
    },
    NominalPercentageOfCardiacPhase: {
        tag: "00209241",
        vr: "FL",
        vm: "1",
    },
    NominalPercentageOfRespiratoryPhase: {
        tag: "00209245",
        vr: "FL",
        vm: "1",
    },
    StartingRespiratoryAmplitude: {
        tag: "00209246",
        vr: "FL",
        vm: "1",
    },
    StartingRespiratoryPhase: {
        tag: "00209247",
        vr: "CS",
        vm: "1",
    },
    EndingRespiratoryAmplitude: {
        tag: "00209248",
        vr: "FL",
        vm: "1",
    },
    EndingRespiratoryPhase: {
        tag: "00209249",
        vr: "CS",
        vm: "1",
    },
    RespiratoryTriggerType: {
        tag: "00209250",
        vr: "CS",
        vm: "1",
    },
    RRIntervalTimeNominal: {
        tag: "00209251",
        vr: "FD",
        vm: "1",
    },
    ActualCardiacTriggerDelayTime: {
        tag: "00209252",
        vr: "FD",
        vm: "1",
    },
    RespiratorySynchronizationSequence: {
        tag: "00209253",
        vr: "SQ",
        vm: "1",
    },
    RespiratoryIntervalTime: {
        tag: "00209254",
        vr: "FD",
        vm: "1",
    },
    NominalRespiratoryTriggerDelayTime: {
        tag: "00209255",
        vr: "FD",
        vm: "1",
    },
    RespiratoryTriggerDelayThreshold: {
        tag: "00209256",
        vr: "FD",
        vm: "1",
    },
    ActualRespiratoryTriggerDelayTime: {
        tag: "00209257",
        vr: "FD",
        vm: "1",
    },
    ImagePositionVolume: {
        tag: "00209301",
        vr: "FD",
        vm: "3",
    },
    ImageOrientationVolume: {
        tag: "00209302",
        vr: "FD",
        vm: "6",
    },
    UltrasoundAcquisitionGeometry: {
        tag: "00209307",
        vr: "CS",
        vm: "1",
    },
    ApexPosition: {
        tag: "00209308",
        vr: "FD",
        vm: "3",
    },
    VolumeToTransducerMappingMatrix: {
        tag: "00209309",
        vr: "FD",
        vm: "16",
    },
    VolumeToTableMappingMatrix: {
        tag: "0020930A",
        vr: "FD",
        vm: "16",
    },
    VolumeToTransducerRelationship: {
        tag: "0020930B",
        vr: "CS",
        vm: "1",
    },
    PatientFrameOfReferenceSource: {
        tag: "0020930C",
        vr: "CS",
        vm: "1",
    },
    TemporalPositionTimeOffset: {
        tag: "0020930D",
        vr: "FD",
        vm: "1",
    },
    PlanePositionVolumeSequence: {
        tag: "0020930E",
        vr: "SQ",
        vm: "1",
    },
    PlaneOrientationVolumeSequence: {
        tag: "0020930F",
        vr: "SQ",
        vm: "1",
    },
    TemporalPositionSequence: {
        tag: "00209310",
        vr: "SQ",
        vm: "1",
    },
    DimensionOrganizationType: {
        tag: "00209311",
        vr: "CS",
        vm: "1",
    },
    VolumeFrameOfReferenceUID: {
        tag: "00209312",
        vr: "UI",
        vm: "1",
    },
    TableFrameOfReferenceUID: {
        tag: "00209313",
        vr: "UI",
        vm: "1",
    },
    DimensionDescriptionLabel: {
        tag: "00209421",
        vr: "LO",
        vm: "1",
    },
    PatientOrientationInFrameSequence: {
        tag: "00209450",
        vr: "SQ",
        vm: "1",
    },
    FrameLabel: {
        tag: "00209453",
        vr: "LO",
        vm: "1",
    },
    AcquisitionIndex: {
        tag: "00209518",
        vr: "US",
        vm: "1-n",
    },
    ContributingSOPInstancesReferenceSequence: {
        tag: "00209529",
        vr: "SQ",
        vm: "1",
    },
    ReconstructionIndex: {
        tag: "00209536",
        vr: "US",
        vm: "1",
    },
    LightPathFilterPassThroughWavelength: {
        tag: "00220001",
        vr: "US",
        vm: "1",
    },
    LightPathFilterPassBand: {
        tag: "00220002",
        vr: "US",
        vm: "2",
    },
    ImagePathFilterPassThroughWavelength: {
        tag: "00220003",
        vr: "US",
        vm: "1",
    },
    ImagePathFilterPassBand: {
        tag: "00220004",
        vr: "US",
        vm: "2",
    },
    PatientEyeMovementCommanded: {
        tag: "00220005",
        vr: "CS",
        vm: "1",
    },
    PatientEyeMovementCommandCodeSequence: {
        tag: "00220006",
        vr: "SQ",
        vm: "1",
    },
    SphericalLensPower: {
        tag: "00220007",
        vr: "FL",
        vm: "1",
    },
    CylinderLensPower: {
        tag: "00220008",
        vr: "FL",
        vm: "1",
    },
    CylinderAxis: {
        tag: "00220009",
        vr: "FL",
        vm: "1",
    },
    EmmetropicMagnification: {
        tag: "0022000A",
        vr: "FL",
        vm: "1",
    },
    IntraOcularPressure: {
        tag: "0022000B",
        vr: "FL",
        vm: "1",
    },
    HorizontalFieldOfView: {
        tag: "0022000C",
        vr: "FL",
        vm: "1",
    },
    PupilDilated: {
        tag: "0022000D",
        vr: "CS",
        vm: "1",
    },
    DegreeOfDilation: {
        tag: "0022000E",
        vr: "FL",
        vm: "1",
    },
    VertexDistance: {
        tag: "0022000F",
        vr: "FD",
        vm: "1",
    },
    StereoBaselineAngle: {
        tag: "00220010",
        vr: "FL",
        vm: "1",
    },
    StereoBaselineDisplacement: {
        tag: "00220011",
        vr: "FL",
        vm: "1",
    },
    StereoHorizontalPixelOffset: {
        tag: "00220012",
        vr: "FL",
        vm: "1",
    },
    StereoVerticalPixelOffset: {
        tag: "00220013",
        vr: "FL",
        vm: "1",
    },
    StereoRotation: {
        tag: "00220014",
        vr: "FL",
        vm: "1",
    },
    AcquisitionDeviceTypeCodeSequence: {
        tag: "00220015",
        vr: "SQ",
        vm: "1",
    },
    IlluminationTypeCodeSequence: {
        tag: "00220016",
        vr: "SQ",
        vm: "1",
    },
    LightPathFilterTypeStackCodeSequence: {
        tag: "00220017",
        vr: "SQ",
        vm: "1",
    },
    ImagePathFilterTypeStackCodeSequence: {
        tag: "00220018",
        vr: "SQ",
        vm: "1",
    },
    LensesCodeSequence: {
        tag: "00220019",
        vr: "SQ",
        vm: "1",
    },
    ChannelDescriptionCodeSequence: {
        tag: "0022001A",
        vr: "SQ",
        vm: "1",
    },
    RefractiveStateSequence: {
        tag: "0022001B",
        vr: "SQ",
        vm: "1",
    },
    MydriaticAgentCodeSequence: {
        tag: "0022001C",
        vr: "SQ",
        vm: "1",
    },
    RelativeImagePositionCodeSequence: {
        tag: "0022001D",
        vr: "SQ",
        vm: "1",
    },
    CameraAngleOfView: {
        tag: "0022001E",
        vr: "FL",
        vm: "1",
    },
    StereoPairsSequence: {
        tag: "00220020",
        vr: "SQ",
        vm: "1",
    },
    LeftImageSequence: {
        tag: "00220021",
        vr: "SQ",
        vm: "1",
    },
    RightImageSequence: {
        tag: "00220022",
        vr: "SQ",
        vm: "1",
    },
    StereoPairsPresent: {
        tag: "00220028",
        vr: "CS",
        vm: "1",
    },
    AxialLengthOfTheEye: {
        tag: "00220030",
        vr: "FL",
        vm: "1",
    },
    OphthalmicFrameLocationSequence: {
        tag: "00220031",
        vr: "SQ",
        vm: "1",
    },
    ReferenceCoordinates: {
        tag: "00220032",
        vr: "FL",
        vm: "2-2n",
    },
    DepthSpatialResolution: {
        tag: "00220035",
        vr: "FL",
        vm: "1",
    },
    MaximumDepthDistortion: {
        tag: "00220036",
        vr: "FL",
        vm: "1",
    },
    AlongScanSpatialResolution: {
        tag: "00220037",
        vr: "FL",
        vm: "1",
    },
    MaximumAlongScanDistortion: {
        tag: "00220038",
        vr: "FL",
        vm: "1",
    },
    OphthalmicImageOrientation: {
        tag: "00220039",
        vr: "CS",
        vm: "1",
    },
    DepthOfTransverseImage: {
        tag: "00220041",
        vr: "FL",
        vm: "1",
    },
    MydriaticAgentConcentrationUnitsSequence: {
        tag: "00220042",
        vr: "SQ",
        vm: "1",
    },
    AcrossScanSpatialResolution: {
        tag: "00220048",
        vr: "FL",
        vm: "1",
    },
    MaximumAcrossScanDistortion: {
        tag: "00220049",
        vr: "FL",
        vm: "1",
    },
    MydriaticAgentConcentration: {
        tag: "0022004E",
        vr: "DS",
        vm: "1",
    },
    IlluminationWaveLength: {
        tag: "00220055",
        vr: "FL",
        vm: "1",
    },
    IlluminationPower: {
        tag: "00220056",
        vr: "FL",
        vm: "1",
    },
    IlluminationBandwidth: {
        tag: "00220057",
        vr: "FL",
        vm: "1",
    },
    MydriaticAgentSequence: {
        tag: "00220058",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAxialMeasurementsRightEyeSequence: {
        tag: "00221007",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAxialMeasurementsLeftEyeSequence: {
        tag: "00221008",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAxialMeasurementsDeviceType: {
        tag: "00221009",
        vr: "CS",
        vm: "1",
    },
    OphthalmicAxialLengthMeasurementsType: {
        tag: "00221010",
        vr: "CS",
        vm: "1",
    },
    OphthalmicAxialLengthSequence: {
        tag: "00221012",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAxialLength: {
        tag: "00221019",
        vr: "FL",
        vm: "1",
    },
    LensStatusCodeSequence: {
        tag: "00221024",
        vr: "SQ",
        vm: "1",
    },
    VitreousStatusCodeSequence: {
        tag: "00221025",
        vr: "SQ",
        vm: "1",
    },
    IOLFormulaCodeSequence: {
        tag: "00221028",
        vr: "SQ",
        vm: "1",
    },
    IOLFormulaDetail: {
        tag: "00221029",
        vr: "LO",
        vm: "1",
    },
    KeratometerIndex: {
        tag: "00221033",
        vr: "FL",
        vm: "1",
    },
    SourceOfOphthalmicAxialLengthCodeSequence: {
        tag: "00221035",
        vr: "SQ",
        vm: "1",
    },
    SourceOfCornealSizeDataCodeSequence: {
        tag: "00221036",
        vr: "SQ",
        vm: "1",
    },
    TargetRefraction: {
        tag: "00221037",
        vr: "FL",
        vm: "1",
    },
    RefractiveProcedureOccurred: {
        tag: "00221039",
        vr: "CS",
        vm: "1",
    },
    RefractiveSurgeryTypeCodeSequence: {
        tag: "00221040",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicUltrasoundMethodCodeSequence: {
        tag: "00221044",
        vr: "SQ",
        vm: "1",
    },
    SurgicallyInducedAstigmatismSequence: {
        tag: "00221045",
        vr: "SQ",
        vm: "1",
    },
    TypeOfOpticalCorrection: {
        tag: "00221046",
        vr: "CS",
        vm: "1",
    },
    ToricIOLPowerSequence: {
        tag: "00221047",
        vr: "SQ",
        vm: "1",
    },
    PredictedToricErrorSequence: {
        tag: "00221048",
        vr: "SQ",
        vm: "1",
    },
    PreSelectedForImplantation: {
        tag: "00221049",
        vr: "CS",
        vm: "1",
    },
    ToricIOLPowerForExactEmmetropiaSequence: {
        tag: "0022104A",
        vr: "SQ",
        vm: "1",
    },
    ToricIOLPowerForExactTargetRefractionSequence: {
        tag: "0022104B",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAxialLengthMeasurementsSequence: {
        tag: "00221050",
        vr: "SQ",
        vm: "1",
    },
    IOLPower: {
        tag: "00221053",
        vr: "FL",
        vm: "1",
    },
    PredictedRefractiveError: {
        tag: "00221054",
        vr: "FL",
        vm: "1",
    },
    OphthalmicAxialLengthVelocity: {
        tag: "00221059",
        vr: "FL",
        vm: "1",
    },
    LensStatusDescription: {
        tag: "00221065",
        vr: "LO",
        vm: "1",
    },
    VitreousStatusDescription: {
        tag: "00221066",
        vr: "LO",
        vm: "1",
    },
    IOLPowerSequence: {
        tag: "00221090",
        vr: "SQ",
        vm: "1",
    },
    LensConstantSequence: {
        tag: "00221092",
        vr: "SQ",
        vm: "1",
    },
    IOLManufacturer: {
        tag: "00221093",
        vr: "LO",
        vm: "1",
    },
    LensConstantDescription: {
        tag: "00221094",
        vr: "LO",
        vm: "1",
    },
    ImplantName: {
        tag: "00221095",
        vr: "LO",
        vm: "1",
    },
    KeratometryMeasurementTypeCodeSequence: {
        tag: "00221096",
        vr: "SQ",
        vm: "1",
    },
    ImplantPartNumber: {
        tag: "00221097",
        vr: "LO",
        vm: "1",
    },
    ReferencedOphthalmicAxialMeasurementsSequence: {
        tag: "00221100",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAxialLengthMeasurementsSegmentNameCodeSequence: {
        tag: "00221101",
        vr: "SQ",
        vm: "1",
    },
    RefractiveErrorBeforeRefractiveSurgeryCodeSequence: {
        tag: "00221103",
        vr: "SQ",
        vm: "1",
    },
    IOLPowerForExactEmmetropia: {
        tag: "00221121",
        vr: "FL",
        vm: "1",
    },
    IOLPowerForExactTargetRefraction: {
        tag: "00221122",
        vr: "FL",
        vm: "1",
    },
    AnteriorChamberDepthDefinitionCodeSequence: {
        tag: "00221125",
        vr: "SQ",
        vm: "1",
    },
    LensThicknessSequence: {
        tag: "00221127",
        vr: "SQ",
        vm: "1",
    },
    AnteriorChamberDepthSequence: {
        tag: "00221128",
        vr: "SQ",
        vm: "1",
    },
    CalculationCommentSequence: {
        tag: "0022112A",
        vr: "SQ",
        vm: "1",
    },
    CalculationCommentType: {
        tag: "0022112B",
        vr: "CS",
        vm: "1",
    },
    CalculationComment: {
        tag: "0022112C",
        vr: "LT",
        vm: "1",
    },
    LensThickness: {
        tag: "00221130",
        vr: "FL",
        vm: "1",
    },
    AnteriorChamberDepth: {
        tag: "00221131",
        vr: "FL",
        vm: "1",
    },
    SourceOfLensThicknessDataCodeSequence: {
        tag: "00221132",
        vr: "SQ",
        vm: "1",
    },
    SourceOfAnteriorChamberDepthDataCodeSequence: {
        tag: "00221133",
        vr: "SQ",
        vm: "1",
    },
    SourceOfRefractiveMeasurementsSequence: {
        tag: "00221134",
        vr: "SQ",
        vm: "1",
    },
    SourceOfRefractiveMeasurementsCodeSequence: {
        tag: "00221135",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAxialLengthMeasurementModified: {
        tag: "00221140",
        vr: "CS",
        vm: "1",
    },
    OphthalmicAxialLengthDataSourceCodeSequence: {
        tag: "00221150",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAxialLengthAcquisitionMethodCodeSequence: {
        tag: "00221153",
        vr: "SQ",
        vm: "1",
    },
    SignalToNoiseRatio: {
        tag: "00221155",
        vr: "FL",
        vm: "1",
    },
    OphthalmicAxialLengthDataSourceDescription: {
        tag: "00221159",
        vr: "LO",
        vm: "1",
    },
    OphthalmicAxialLengthMeasurementsTotalLengthSequence: {
        tag: "00221210",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAxialLengthMeasurementsSegmentalLengthSequence: {
        tag: "00221211",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAxialLengthMeasurementsLengthSummationSequence: {
        tag: "00221212",
        vr: "SQ",
        vm: "1",
    },
    UltrasoundOphthalmicAxialLengthMeasurementsSequence: {
        tag: "00221220",
        vr: "SQ",
        vm: "1",
    },
    OpticalOphthalmicAxialLengthMeasurementsSequence: {
        tag: "00221225",
        vr: "SQ",
        vm: "1",
    },
    UltrasoundSelectedOphthalmicAxialLengthSequence: {
        tag: "00221230",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAxialLengthSelectionMethodCodeSequence: {
        tag: "00221250",
        vr: "SQ",
        vm: "1",
    },
    OpticalSelectedOphthalmicAxialLengthSequence: {
        tag: "00221255",
        vr: "SQ",
        vm: "1",
    },
    SelectedSegmentalOphthalmicAxialLengthSequence: {
        tag: "00221257",
        vr: "SQ",
        vm: "1",
    },
    SelectedTotalOphthalmicAxialLengthSequence: {
        tag: "00221260",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAxialLengthQualityMetricSequence: {
        tag: "00221262",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAxialLengthQualityMetricTypeCodeSequence: {
        tag: "00221265",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAxialLengthQualityMetricTypeDescription: {
        tag: "00221273",
        vr: "LO",
        vm: "1",
    },
    IntraocularLensCalculationsRightEyeSequence: {
        tag: "00221300",
        vr: "SQ",
        vm: "1",
    },
    IntraocularLensCalculationsLeftEyeSequence: {
        tag: "00221310",
        vr: "SQ",
        vm: "1",
    },
    ReferencedOphthalmicAxialLengthMeasurementQCImageSequence: {
        tag: "00221330",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicMappingDeviceType: {
        tag: "00221415",
        vr: "CS",
        vm: "1",
    },
    AcquisitionMethodCodeSequence: {
        tag: "00221420",
        vr: "SQ",
        vm: "1",
    },
    AcquisitionMethodAlgorithmSequence: {
        tag: "00221423",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicThicknessMapTypeCodeSequence: {
        tag: "00221436",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicThicknessMappingNormalsSequence: {
        tag: "00221443",
        vr: "SQ",
        vm: "1",
    },
    RetinalThicknessDefinitionCodeSequence: {
        tag: "00221445",
        vr: "SQ",
        vm: "1",
    },
    PixelValueMappingToCodedConceptSequence: {
        tag: "00221450",
        vr: "SQ",
        vm: "1",
    },
    MappedPixelValue: {
        tag: "00221452",
        vr: "US or SS",
        vm: "1",
    },
    PixelValueMappingExplanation: {
        tag: "00221454",
        vr: "LO",
        vm: "1",
    },
    OphthalmicThicknessMapQualityThresholdSequence: {
        tag: "00221458",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicThicknessMapThresholdQualityRating: {
        tag: "00221460",
        vr: "FL",
        vm: "1",
    },
    AnatomicStructureReferencePoint: {
        tag: "00221463",
        vr: "FL",
        vm: "2",
    },
    RegistrationToLocalizerSequence: {
        tag: "00221465",
        vr: "SQ",
        vm: "1",
    },
    RegisteredLocalizerUnits: {
        tag: "00221466",
        vr: "CS",
        vm: "1",
    },
    RegisteredLocalizerTopLeftHandCorner: {
        tag: "00221467",
        vr: "FL",
        vm: "2",
    },
    RegisteredLocalizerBottomRightHandCorner: {
        tag: "00221468",
        vr: "FL",
        vm: "2",
    },
    OphthalmicThicknessMapQualityRatingSequence: {
        tag: "00221470",
        vr: "SQ",
        vm: "1",
    },
    RelevantOPTAttributesSequence: {
        tag: "00221472",
        vr: "SQ",
        vm: "1",
    },
    TransformationMethodCodeSequence: {
        tag: "00221512",
        vr: "SQ",
        vm: "1",
    },
    TransformationAlgorithmSequence: {
        tag: "00221513",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAxialLengthMethod: {
        tag: "00221515",
        vr: "CS",
        vm: "1",
    },
    OphthalmicFOV: {
        tag: "00221517",
        vr: "FL",
        vm: "1",
    },
    TwoDimensionalToThreeDimensionalMapSequence: {
        tag: "00221518",
        vr: "SQ",
        vm: "1",
    },
    WideFieldOphthalmicPhotographyQualityRatingSequence: {
        tag: "00221525",
        vr: "SQ",
        vm: "1",
    },
    WideFieldOphthalmicPhotographyQualityThresholdSequence: {
        tag: "00221526",
        vr: "SQ",
        vm: "1",
    },
    WideFieldOphthalmicPhotographyThresholdQualityRating: {
        tag: "00221527",
        vr: "FL",
        vm: "1",
    },
    XCoordinatesCenterPixelViewAngle: {
        tag: "00221528",
        vr: "FL",
        vm: "1",
    },
    YCoordinatesCenterPixelViewAngle: {
        tag: "00221529",
        vr: "FL",
        vm: "1",
    },
    NumberOfMapPoints: {
        tag: "00221530",
        vr: "UL",
        vm: "1",
    },
    TwoDimensionalToThreeDimensionalMapData: {
        tag: "00221531",
        vr: "OF",
        vm: "1",
    },
    DerivationAlgorithmSequence: {
        tag: "00221612",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicImageTypeCodeSequence: {
        tag: "00221615",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicImageTypeDescription: {
        tag: "00221616",
        vr: "LO",
        vm: "1",
    },
    ScanPatternTypeCodeSequence: {
        tag: "00221618",
        vr: "SQ",
        vm: "1",
    },
    ReferencedSurfaceMeshIdentificationSequence: {
        tag: "00221620",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicVolumetricPropertiesFlag: {
        tag: "00221622",
        vr: "CS",
        vm: "1",
    },
    OphthalmicAnatomicReferencePointFrameCoordinate: {
        tag: "00221623",
        vr: "FL",
        vm: "1",
    },
    OphthalmicAnatomicReferencePointXCoordinate: {
        tag: "00221624",
        vr: "FL",
        vm: "1",
    },
    OphthalmicAnatomicReferencePointYCoordinate: {
        tag: "00221626",
        vr: "FL",
        vm: "1",
    },
    OphthalmicEnFaceVolumeDescriptorSequence: {
        tag: "00221627",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicEnFaceImageQualityRatingSequence: {
        tag: "00221628",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicEnFaceVolumeDescriptorScope: {
        tag: "00221629",
        vr: "CS",
        vm: "1",
    },
    QualityThreshold: {
        tag: "00221630",
        vr: "DS",
        vm: "1",
    },
    OphthalmicAnatomicReferencePointSequence: {
        tag: "00221632",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicAnatomicReferencePointLocalizationType: {
        tag: "00221633",
        vr: "CS",
        vm: "1",
    },
    PrimaryAnatomicStructureItemIndex: {
        tag: "00221634",
        vr: "IS",
        vm: "1",
    },
    OCTBscanAnalysisAcquisitionParametersSequence: {
        tag: "00221640",
        vr: "SQ",
        vm: "1",
    },
    NumberOfBscansPerFrame: {
        tag: "00221642",
        vr: "UL",
        vm: "1",
    },
    BscanSlabThickness: {
        tag: "00221643",
        vr: "FL",
        vm: "1",
    },
    DistanceBetweenBscanSlabs: {
        tag: "00221644",
        vr: "FL",
        vm: "1",
    },
    BscanCycleTime: {
        tag: "00221645",
        vr: "FL",
        vm: "1",
    },
    BscanCycleTimeVector: {
        tag: "00221646",
        vr: "FL",
        vm: "1-n",
    },
    AscanRate: {
        tag: "00221649",
        vr: "FL",
        vm: "1",
    },
    BscanRate: {
        tag: "00221650",
        vr: "FL",
        vm: "1",
    },
    SurfaceMeshZPixelOffset: {
        tag: "00221658",
        vr: "UL",
        vm: "1",
    },
    VisualFieldHorizontalExtent: {
        tag: "00240010",
        vr: "FL",
        vm: "1",
    },
    VisualFieldVerticalExtent: {
        tag: "00240011",
        vr: "FL",
        vm: "1",
    },
    VisualFieldShape: {
        tag: "00240012",
        vr: "CS",
        vm: "1",
    },
    ScreeningTestModeCodeSequence: {
        tag: "00240016",
        vr: "SQ",
        vm: "1",
    },
    MaximumStimulusLuminance: {
        tag: "00240018",
        vr: "FL",
        vm: "1",
    },
    BackgroundLuminance: {
        tag: "00240020",
        vr: "FL",
        vm: "1",
    },
    StimulusColorCodeSequence: {
        tag: "00240021",
        vr: "SQ",
        vm: "1",
    },
    BackgroundIlluminationColorCodeSequence: {
        tag: "00240024",
        vr: "SQ",
        vm: "1",
    },
    StimulusArea: {
        tag: "00240025",
        vr: "FL",
        vm: "1",
    },
    StimulusPresentationTime: {
        tag: "00240028",
        vr: "FL",
        vm: "1",
    },
    FixationSequence: {
        tag: "00240032",
        vr: "SQ",
        vm: "1",
    },
    FixationMonitoringCodeSequence: {
        tag: "00240033",
        vr: "SQ",
        vm: "1",
    },
    VisualFieldCatchTrialSequence: {
        tag: "00240034",
        vr: "SQ",
        vm: "1",
    },
    FixationCheckedQuantity: {
        tag: "00240035",
        vr: "US",
        vm: "1",
    },
    PatientNotProperlyFixatedQuantity: {
        tag: "00240036",
        vr: "US",
        vm: "1",
    },
    PresentedVisualStimuliDataFlag: {
        tag: "00240037",
        vr: "CS",
        vm: "1",
    },
    NumberOfVisualStimuli: {
        tag: "00240038",
        vr: "US",
        vm: "1",
    },
    ExcessiveFixationLossesDataFlag: {
        tag: "00240039",
        vr: "CS",
        vm: "1",
    },
    ExcessiveFixationLosses: {
        tag: "00240040",
        vr: "CS",
        vm: "1",
    },
    StimuliRetestingQuantity: {
        tag: "00240042",
        vr: "US",
        vm: "1",
    },
    CommentsOnPatientPerformanceOfVisualField: {
        tag: "00240044",
        vr: "LT",
        vm: "1",
    },
    FalseNegativesEstimateFlag: {
        tag: "00240045",
        vr: "CS",
        vm: "1",
    },
    FalseNegativesEstimate: {
        tag: "00240046",
        vr: "FL",
        vm: "1",
    },
    NegativeCatchTrialsQuantity: {
        tag: "00240048",
        vr: "US",
        vm: "1",
    },
    FalseNegativesQuantity: {
        tag: "00240050",
        vr: "US",
        vm: "1",
    },
    ExcessiveFalseNegativesDataFlag: {
        tag: "00240051",
        vr: "CS",
        vm: "1",
    },
    ExcessiveFalseNegatives: {
        tag: "00240052",
        vr: "CS",
        vm: "1",
    },
    FalsePositivesEstimateFlag: {
        tag: "00240053",
        vr: "CS",
        vm: "1",
    },
    FalsePositivesEstimate: {
        tag: "00240054",
        vr: "FL",
        vm: "1",
    },
    CatchTrialsDataFlag: {
        tag: "00240055",
        vr: "CS",
        vm: "1",
    },
    PositiveCatchTrialsQuantity: {
        tag: "00240056",
        vr: "US",
        vm: "1",
    },
    TestPointNormalsDataFlag: {
        tag: "00240057",
        vr: "CS",
        vm: "1",
    },
    TestPointNormalsSequence: {
        tag: "00240058",
        vr: "SQ",
        vm: "1",
    },
    GlobalDeviationProbabilityNormalsFlag: {
        tag: "00240059",
        vr: "CS",
        vm: "1",
    },
    FalsePositivesQuantity: {
        tag: "00240060",
        vr: "US",
        vm: "1",
    },
    ExcessiveFalsePositivesDataFlag: {
        tag: "00240061",
        vr: "CS",
        vm: "1",
    },
    ExcessiveFalsePositives: {
        tag: "00240062",
        vr: "CS",
        vm: "1",
    },
    VisualFieldTestNormalsFlag: {
        tag: "00240063",
        vr: "CS",
        vm: "1",
    },
    ResultsNormalsSequence: {
        tag: "00240064",
        vr: "SQ",
        vm: "1",
    },
    AgeCorrectedSensitivityDeviationAlgorithmSequence: {
        tag: "00240065",
        vr: "SQ",
        vm: "1",
    },
    GlobalDeviationFromNormal: {
        tag: "00240066",
        vr: "FL",
        vm: "1",
    },
    GeneralizedDefectSensitivityDeviationAlgorithmSequence: {
        tag: "00240067",
        vr: "SQ",
        vm: "1",
    },
    LocalizedDeviationFromNormal: {
        tag: "00240068",
        vr: "FL",
        vm: "1",
    },
    PatientReliabilityIndicator: {
        tag: "00240069",
        vr: "LO",
        vm: "1",
    },
    VisualFieldMeanSensitivity: {
        tag: "00240070",
        vr: "FL",
        vm: "1",
    },
    GlobalDeviationProbability: {
        tag: "00240071",
        vr: "FL",
        vm: "1",
    },
    LocalDeviationProbabilityNormalsFlag: {
        tag: "00240072",
        vr: "CS",
        vm: "1",
    },
    LocalizedDeviationProbability: {
        tag: "00240073",
        vr: "FL",
        vm: "1",
    },
    ShortTermFluctuationCalculated: {
        tag: "00240074",
        vr: "CS",
        vm: "1",
    },
    ShortTermFluctuation: {
        tag: "00240075",
        vr: "FL",
        vm: "1",
    },
    ShortTermFluctuationProbabilityCalculated: {
        tag: "00240076",
        vr: "CS",
        vm: "1",
    },
    ShortTermFluctuationProbability: {
        tag: "00240077",
        vr: "FL",
        vm: "1",
    },
    CorrectedLocalizedDeviationFromNormalCalculated: {
        tag: "00240078",
        vr: "CS",
        vm: "1",
    },
    CorrectedLocalizedDeviationFromNormal: {
        tag: "00240079",
        vr: "FL",
        vm: "1",
    },
    CorrectedLocalizedDeviationFromNormalProbabilityCalculated: {
        tag: "00240080",
        vr: "CS",
        vm: "1",
    },
    CorrectedLocalizedDeviationFromNormalProbability: {
        tag: "00240081",
        vr: "FL",
        vm: "1",
    },
    GlobalDeviationProbabilitySequence: {
        tag: "00240083",
        vr: "SQ",
        vm: "1",
    },
    LocalizedDeviationProbabilitySequence: {
        tag: "00240085",
        vr: "SQ",
        vm: "1",
    },
    FovealSensitivityMeasured: {
        tag: "00240086",
        vr: "CS",
        vm: "1",
    },
    FovealSensitivity: {
        tag: "00240087",
        vr: "FL",
        vm: "1",
    },
    VisualFieldTestDuration: {
        tag: "00240088",
        vr: "FL",
        vm: "1",
    },
    VisualFieldTestPointSequence: {
        tag: "00240089",
        vr: "SQ",
        vm: "1",
    },
    VisualFieldTestPointXCoordinate: {
        tag: "00240090",
        vr: "FL",
        vm: "1",
    },
    VisualFieldTestPointYCoordinate: {
        tag: "00240091",
        vr: "FL",
        vm: "1",
    },
    AgeCorrectedSensitivityDeviationValue: {
        tag: "00240092",
        vr: "FL",
        vm: "1",
    },
    StimulusResults: {
        tag: "00240093",
        vr: "CS",
        vm: "1",
    },
    SensitivityValue: {
        tag: "00240094",
        vr: "FL",
        vm: "1",
    },
    RetestStimulusSeen: {
        tag: "00240095",
        vr: "CS",
        vm: "1",
    },
    RetestSensitivityValue: {
        tag: "00240096",
        vr: "FL",
        vm: "1",
    },
    VisualFieldTestPointNormalsSequence: {
        tag: "00240097",
        vr: "SQ",
        vm: "1",
    },
    QuantifiedDefect: {
        tag: "00240098",
        vr: "FL",
        vm: "1",
    },
    AgeCorrectedSensitivityDeviationProbabilityValue: {
        tag: "00240100",
        vr: "FL",
        vm: "1",
    },
    GeneralizedDefectCorrectedSensitivityDeviationFlag: {
        tag: "00240102",
        vr: "CS",
        vm: "1",
    },
    GeneralizedDefectCorrectedSensitivityDeviationValue: {
        tag: "00240103",
        vr: "FL",
        vm: "1",
    },
    GeneralizedDefectCorrectedSensitivityDeviationProbabilityValue: {
        tag: "00240104",
        vr: "FL",
        vm: "1",
    },
    MinimumSensitivityValue: {
        tag: "00240105",
        vr: "FL",
        vm: "1",
    },
    BlindSpotLocalized: {
        tag: "00240106",
        vr: "CS",
        vm: "1",
    },
    BlindSpotXCoordinate: {
        tag: "00240107",
        vr: "FL",
        vm: "1",
    },
    BlindSpotYCoordinate: {
        tag: "00240108",
        vr: "FL",
        vm: "1",
    },
    VisualAcuityMeasurementSequence: {
        tag: "00240110",
        vr: "SQ",
        vm: "1",
    },
    RefractiveParametersUsedOnPatientSequence: {
        tag: "00240112",
        vr: "SQ",
        vm: "1",
    },
    MeasurementLaterality: {
        tag: "00240113",
        vr: "CS",
        vm: "1",
    },
    OphthalmicPatientClinicalInformationLeftEyeSequence: {
        tag: "00240114",
        vr: "SQ",
        vm: "1",
    },
    OphthalmicPatientClinicalInformationRightEyeSequence: {
        tag: "00240115",
        vr: "SQ",
        vm: "1",
    },
    FovealPointNormativeDataFlag: {
        tag: "00240117",
        vr: "CS",
        vm: "1",
    },
    FovealPointProbabilityValue: {
        tag: "00240118",
        vr: "FL",
        vm: "1",
    },
    ScreeningBaselineMeasured: {
        tag: "00240120",
        vr: "CS",
        vm: "1",
    },
    ScreeningBaselineMeasuredSequence: {
        tag: "00240122",
        vr: "SQ",
        vm: "1",
    },
    ScreeningBaselineType: {
        tag: "00240124",
        vr: "CS",
        vm: "1",
    },
    ScreeningBaselineValue: {
        tag: "00240126",
        vr: "FL",
        vm: "1",
    },
    AlgorithmSource: {
        tag: "00240202",
        vr: "LO",
        vm: "1",
    },
    DataSetName: {
        tag: "00240306",
        vr: "LO",
        vm: "1",
    },
    DataSetVersion: {
        tag: "00240307",
        vr: "LO",
        vm: "1",
    },
    DataSetSource: {
        tag: "00240308",
        vr: "LO",
        vm: "1",
    },
    DataSetDescription: {
        tag: "00240309",
        vr: "LO",
        vm: "1",
    },
    VisualFieldTestReliabilityGlobalIndexSequence: {
        tag: "00240317",
        vr: "SQ",
        vm: "1",
    },
    VisualFieldGlobalResultsIndexSequence: {
        tag: "00240320",
        vr: "SQ",
        vm: "1",
    },
    DataObservationSequence: {
        tag: "00240325",
        vr: "SQ",
        vm: "1",
    },
    IndexNormalsFlag: {
        tag: "00240338",
        vr: "CS",
        vm: "1",
    },
    IndexProbability: {
        tag: "00240341",
        vr: "FL",
        vm: "1",
    },
    IndexProbabilitySequence: {
        tag: "00240344",
        vr: "SQ",
        vm: "1",
    },
    SamplesPerPixel: {
        tag: "00280002",
        vr: "US",
        vm: "1",
    },
    SamplesPerPixelUsed: {
        tag: "00280003",
        vr: "US",
        vm: "1",
    },
    PhotometricInterpretation: {
        tag: "00280004",
        vr: "CS",
        vm: "1",
    },
    ImageDimensions: {
        tag: "00280005",
        vr: "US",
        vm: "1",
    },
    PlanarConfiguration: {
        tag: "00280006",
        vr: "US",
        vm: "1",
    },
    NumberOfFrames: {
        tag: "00280008",
        vr: "IS",
        vm: "1",
    },
    FrameIncrementPointer: {
        tag: "00280009",
        vr: "AT",
        vm: "1-n",
    },
    FrameDimensionPointer: {
        tag: "0028000A",
        vr: "AT",
        vm: "1-n",
    },
    Rows: {
        tag: "00280010",
        vr: "US",
        vm: "1",
    },
    Columns: {
        tag: "00280011",
        vr: "US",
        vm: "1",
    },
    Planes: {
        tag: "00280012",
        vr: "US",
        vm: "1",
    },
    UltrasoundColorDataPresent: {
        tag: "00280014",
        vr: "US",
        vm: "1",
    },
    PixelSpacing: {
        tag: "00280030",
        vr: "DS",
        vm: "2",
    },
    ZoomFactor: {
        tag: "00280031",
        vr: "DS",
        vm: "2",
    },
    ZoomCenter: {
        tag: "00280032",
        vr: "DS",
        vm: "2",
    },
    PixelAspectRatio: {
        tag: "00280034",
        vr: "IS",
        vm: "2",
    },
    ImageFormat: {
        tag: "00280040",
        vr: "CS",
        vm: "1",
    },
    ManipulatedImage: {
        tag: "00280050",
        vr: "LO",
        vm: "1-n",
    },
    CorrectedImage: {
        tag: "00280051",
        vr: "CS",
        vm: "1-n",
    },
    CompressionRecognitionCode: {
        tag: "0028005F",
        vr: "LO",
        vm: "1",
    },
    CompressionCode: {
        tag: "00280060",
        vr: "CS",
        vm: "1",
    },
    CompressionOriginator: {
        tag: "00280061",
        vr: "SH",
        vm: "1",
    },
    CompressionLabel: {
        tag: "00280062",
        vr: "LO",
        vm: "1",
    },
    CompressionDescription: {
        tag: "00280063",
        vr: "SH",
        vm: "1",
    },
    CompressionSequence: {
        tag: "00280065",
        vr: "CS",
        vm: "1-n",
    },
    CompressionStepPointers: {
        tag: "00280066",
        vr: "AT",
        vm: "1-n",
    },
    RepeatInterval: {
        tag: "00280068",
        vr: "US",
        vm: "1",
    },
    BitsGrouped: {
        tag: "00280069",
        vr: "US",
        vm: "1",
    },
    PerimeterTable: {
        tag: "00280070",
        vr: "US",
        vm: "1-n",
    },
    PerimeterValue: {
        tag: "00280071",
        vr: "US or SS",
        vm: "1",
    },
    PredictorRows: {
        tag: "00280080",
        vr: "US",
        vm: "1",
    },
    PredictorColumns: {
        tag: "00280081",
        vr: "US",
        vm: "1",
    },
    PredictorConstants: {
        tag: "00280082",
        vr: "US",
        vm: "1-n",
    },
    BlockedPixels: {
        tag: "00280090",
        vr: "CS",
        vm: "1",
    },
    BlockRows: {
        tag: "00280091",
        vr: "US",
        vm: "1",
    },
    BlockColumns: {
        tag: "00280092",
        vr: "US",
        vm: "1",
    },
    RowOverlap: {
        tag: "00280093",
        vr: "US",
        vm: "1",
    },
    ColumnOverlap: {
        tag: "00280094",
        vr: "US",
        vm: "1",
    },
    BitsAllocated: {
        tag: "00280100",
        vr: "US",
        vm: "1",
    },
    BitsStored: {
        tag: "00280101",
        vr: "US",
        vm: "1",
    },
    HighBit: {
        tag: "00280102",
        vr: "US",
        vm: "1",
    },
    PixelRepresentation: {
        tag: "00280103",
        vr: "US",
        vm: "1",
    },
    SmallestValidPixelValue: {
        tag: "00280104",
        vr: "US or SS",
        vm: "1",
    },
    LargestValidPixelValue: {
        tag: "00280105",
        vr: "US or SS",
        vm: "1",
    },
    SmallestImagePixelValue: {
        tag: "00280106",
        vr: "US or SS",
        vm: "1",
    },
    LargestImagePixelValue: {
        tag: "00280107",
        vr: "US or SS",
        vm: "1",
    },
    SmallestPixelValueInSeries: {
        tag: "00280108",
        vr: "US or SS",
        vm: "1",
    },
    LargestPixelValueInSeries: {
        tag: "00280109",
        vr: "US or SS",
        vm: "1",
    },
    SmallestImagePixelValueInPlane: {
        tag: "00280110",
        vr: "US or SS",
        vm: "1",
    },
    LargestImagePixelValueInPlane: {
        tag: "00280111",
        vr: "US or SS",
        vm: "1",
    },
    PixelPaddingValue: {
        tag: "00280120",
        vr: "US or SS",
        vm: "1",
    },
    PixelPaddingRangeLimit: {
        tag: "00280121",
        vr: "US or SS",
        vm: "1",
    },
    FloatPixelPaddingValue: {
        tag: "00280122",
        vr: "FL",
        vm: "1",
    },
    DoubleFloatPixelPaddingValue: {
        tag: "00280123",
        vr: "FD",
        vm: "1",
    },
    FloatPixelPaddingRangeLimit: {
        tag: "00280124",
        vr: "FL",
        vm: "1",
    },
    DoubleFloatPixelPaddingRangeLimit: {
        tag: "00280125",
        vr: "FD",
        vm: "1",
    },
    ImageLocation: {
        tag: "00280200",
        vr: "US",
        vm: "1",
    },
    QualityControlImage: {
        tag: "00280300",
        vr: "CS",
        vm: "1",
    },
    BurnedInAnnotation: {
        tag: "00280301",
        vr: "CS",
        vm: "1",
    },
    RecognizableVisualFeatures: {
        tag: "00280302",
        vr: "CS",
        vm: "1",
    },
    LongitudinalTemporalInformationModified: {
        tag: "00280303",
        vr: "CS",
        vm: "1",
    },
    ReferencedColorPaletteInstanceUID: {
        tag: "00280304",
        vr: "UI",
        vm: "1",
    },
    TransformLabel: {
        tag: "00280400",
        vr: "LO",
        vm: "1",
    },
    TransformVersionNumber: {
        tag: "00280401",
        vr: "LO",
        vm: "1",
    },
    NumberOfTransformSteps: {
        tag: "00280402",
        vr: "US",
        vm: "1",
    },
    SequenceOfCompressedData: {
        tag: "00280403",
        vr: "LO",
        vm: "1-n",
    },
    DetailsOfCoefficients: {
        tag: "00280404",
        vr: "AT",
        vm: "1-n",
    },
    RowsForNthOrderCoefficients: {
        tag: "002804x0",
        vr: "US",
        vm: "1",
    },
    ColumnsForNthOrderCoefficients: {
        tag: "002804x1",
        vr: "US",
        vm: "1",
    },
    CoefficientCoding: {
        tag: "002804x2",
        vr: "LO",
        vm: "1-n",
    },
    CoefficientCodingPointers: {
        tag: "002804x3",
        vr: "AT",
        vm: "1-n",
    },
    DCTLabel: {
        tag: "00280700",
        vr: "LO",
        vm: "1",
    },
    DataBlockDescription: {
        tag: "00280701",
        vr: "CS",
        vm: "1-n",
    },
    DataBlock: {
        tag: "00280702",
        vr: "AT",
        vm: "1-n",
    },
    NormalizationFactorFormat: {
        tag: "00280710",
        vr: "US",
        vm: "1",
    },
    ZonalMapNumberFormat: {
        tag: "00280720",
        vr: "US",
        vm: "1",
    },
    ZonalMapLocation: {
        tag: "00280721",
        vr: "AT",
        vm: "1-n",
    },
    ZonalMapFormat: {
        tag: "00280722",
        vr: "US",
        vm: "1",
    },
    AdaptiveMapFormat: {
        tag: "00280730",
        vr: "US",
        vm: "1",
    },
    CodeNumberFormat: {
        tag: "00280740",
        vr: "US",
        vm: "1",
    },
    CodeLabel: {
        tag: "002808x0",
        vr: "CS",
        vm: "1-n",
    },
    NumberOfTables: {
        tag: "002808x2",
        vr: "US",
        vm: "1",
    },
    CodeTableLocation: {
        tag: "002808x3",
        vr: "AT",
        vm: "1-n",
    },
    BitsForCodeWord: {
        tag: "002808x4",
        vr: "US",
        vm: "1",
    },
    ImageDataLocation: {
        tag: "002808x8",
        vr: "AT",
        vm: "1-n",
    },
    PixelSpacingCalibrationType: {
        tag: "00280A02",
        vr: "CS",
        vm: "1",
    },
    PixelSpacingCalibrationDescription: {
        tag: "00280A04",
        vr: "LO",
        vm: "1",
    },
    PixelIntensityRelationship: {
        tag: "00281040",
        vr: "CS",
        vm: "1",
    },
    PixelIntensityRelationshipSign: {
        tag: "00281041",
        vr: "SS",
        vm: "1",
    },
    WindowCenter: {
        tag: "00281050",
        vr: "DS",
        vm: "1-n",
    },
    WindowWidth: {
        tag: "00281051",
        vr: "DS",
        vm: "1-n",
    },
    RescaleIntercept: {
        tag: "00281052",
        vr: "DS",
        vm: "1",
    },
    RescaleSlope: {
        tag: "00281053",
        vr: "DS",
        vm: "1",
    },
    RescaleType: {
        tag: "00281054",
        vr: "LO",
        vm: "1",
    },
    WindowCenterWidthExplanation: {
        tag: "00281055",
        vr: "LO",
        vm: "1-n",
    },
    VOILUTFunction: {
        tag: "00281056",
        vr: "CS",
        vm: "1",
    },
    GrayScale: {
        tag: "00281080",
        vr: "CS",
        vm: "1",
    },
    RecommendedViewingMode: {
        tag: "00281090",
        vr: "CS",
        vm: "1",
    },
    GrayLookupTableDescriptor: {
        tag: "00281100",
        vr: "US or SS",
        vm: "3",
    },
    RedPaletteColorLookupTableDescriptor: {
        tag: "00281101",
        vr: "US or SS",
        vm: "3",
    },
    GreenPaletteColorLookupTableDescriptor: {
        tag: "00281102",
        vr: "US or SS",
        vm: "3",
    },
    BluePaletteColorLookupTableDescriptor: {
        tag: "00281103",
        vr: "US or SS",
        vm: "3",
    },
    AlphaPaletteColorLookupTableDescriptor: {
        tag: "00281104",
        vr: "US",
        vm: "3",
    },
    LargeRedPaletteColorLookupTableDescriptor: {
        tag: "00281111",
        vr: "US or SS",
        vm: "4",
    },
    LargeGreenPaletteColorLookupTableDescriptor: {
        tag: "00281112",
        vr: "US or SS",
        vm: "4",
    },
    LargeBluePaletteColorLookupTableDescriptor: {
        tag: "00281113",
        vr: "US or SS",
        vm: "4",
    },
    PaletteColorLookupTableUID: {
        tag: "00281199",
        vr: "UI",
        vm: "1",
    },
    GrayLookupTableData: {
        tag: "00281200",
        vr: "US or SS or OW",
        vm: "1-n or 1",
    },
    RedPaletteColorLookupTableData: {
        tag: "00281201",
        vr: "OW",
        vm: "1",
    },
    GreenPaletteColorLookupTableData: {
        tag: "00281202",
        vr: "OW",
        vm: "1",
    },
    BluePaletteColorLookupTableData: {
        tag: "00281203",
        vr: "OW",
        vm: "1",
    },
    AlphaPaletteColorLookupTableData: {
        tag: "00281204",
        vr: "OW",
        vm: "1",
    },
    LargeRedPaletteColorLookupTableData: {
        tag: "00281211",
        vr: "OW",
        vm: "1",
    },
    LargeGreenPaletteColorLookupTableData: {
        tag: "00281212",
        vr: "OW",
        vm: "1",
    },
    LargeBluePaletteColorLookupTableData: {
        tag: "00281213",
        vr: "OW",
        vm: "1",
    },
    LargePaletteColorLookupTableUID: {
        tag: "00281214",
        vr: "UI",
        vm: "1",
    },
    SegmentedRedPaletteColorLookupTableData: {
        tag: "00281221",
        vr: "OW",
        vm: "1",
    },
    SegmentedGreenPaletteColorLookupTableData: {
        tag: "00281222",
        vr: "OW",
        vm: "1",
    },
    SegmentedBluePaletteColorLookupTableData: {
        tag: "00281223",
        vr: "OW",
        vm: "1",
    },
    SegmentedAlphaPaletteColorLookupTableData: {
        tag: "00281224",
        vr: "OW",
        vm: "1",
    },
    StoredValueColorRangeSequence: {
        tag: "00281230",
        vr: "SQ",
        vm: "1",
    },
    MinimumStoredValueMapped: {
        tag: "00281231",
        vr: "FD",
        vm: "1",
    },
    MaximumStoredValueMapped: {
        tag: "00281232",
        vr: "FD",
        vm: "1",
    },
    BreastImplantPresent: {
        tag: "00281300",
        vr: "CS",
        vm: "1",
    },
    PartialView: {
        tag: "00281350",
        vr: "CS",
        vm: "1",
    },
    PartialViewDescription: {
        tag: "00281351",
        vr: "ST",
        vm: "1",
    },
    PartialViewCodeSequence: {
        tag: "00281352",
        vr: "SQ",
        vm: "1",
    },
    SpatialLocationsPreserved: {
        tag: "0028135A",
        vr: "CS",
        vm: "1",
    },
    DataFrameAssignmentSequence: {
        tag: "00281401",
        vr: "SQ",
        vm: "1",
    },
    DataPathAssignment: {
        tag: "00281402",
        vr: "CS",
        vm: "1",
    },
    BitsMappedToColorLookupTable: {
        tag: "00281403",
        vr: "US",
        vm: "1",
    },
    BlendingLUT1Sequence: {
        tag: "00281404",
        vr: "SQ",
        vm: "1",
    },
    BlendingLUT1TransferFunction: {
        tag: "00281405",
        vr: "CS",
        vm: "1",
    },
    BlendingWeightConstant: {
        tag: "00281406",
        vr: "FD",
        vm: "1",
    },
    BlendingLookupTableDescriptor: {
        tag: "00281407",
        vr: "US",
        vm: "3",
    },
    BlendingLookupTableData: {
        tag: "00281408",
        vr: "OW",
        vm: "1",
    },
    EnhancedPaletteColorLookupTableSequence: {
        tag: "0028140B",
        vr: "SQ",
        vm: "1",
    },
    BlendingLUT2Sequence: {
        tag: "0028140C",
        vr: "SQ",
        vm: "1",
    },
    BlendingLUT2TransferFunction: {
        tag: "0028140D",
        vr: "CS",
        vm: "1",
    },
    DataPathID: {
        tag: "0028140E",
        vr: "CS",
        vm: "1",
    },
    RGBLUTTransferFunction: {
        tag: "0028140F",
        vr: "CS",
        vm: "1",
    },
    AlphaLUTTransferFunction: {
        tag: "00281410",
        vr: "CS",
        vm: "1",
    },
    ICCProfile: {
        tag: "00282000",
        vr: "OB",
        vm: "1",
    },
    ColorSpace: {
        tag: "00282002",
        vr: "CS",
        vm: "1",
    },
    LossyImageCompression: {
        tag: "00282110",
        vr: "CS",
        vm: "1",
    },
    LossyImageCompressionRatio: {
        tag: "00282112",
        vr: "DS",
        vm: "1-n",
    },
    LossyImageCompressionMethod: {
        tag: "00282114",
        vr: "CS",
        vm: "1-n",
    },
    ModalityLUTSequence: {
        tag: "00283000",
        vr: "SQ",
        vm: "1",
    },
    VariableModalityLUTSequence: {
        tag: "00283001",
        vr: "SQ",
        vm: "1",
    },
    LUTDescriptor: {
        tag: "00283002",
        vr: "US or SS",
        vm: "3",
    },
    LUTExplanation: {
        tag: "00283003",
        vr: "LO",
        vm: "1",
    },
    ModalityLUTType: {
        tag: "00283004",
        vr: "LO",
        vm: "1",
    },
    LUTData: {
        tag: "00283006",
        vr: "US or OW",
        vm: "1-n or 1",
    },
    VOILUTSequence: {
        tag: "00283010",
        vr: "SQ",
        vm: "1",
    },
    SoftcopyVOILUTSequence: {
        tag: "00283110",
        vr: "SQ",
        vm: "1",
    },
    ImagePresentationComments: {
        tag: "00284000",
        vr: "LT",
        vm: "1",
    },
    BiPlaneAcquisitionSequence: {
        tag: "00285000",
        vr: "SQ",
        vm: "1",
    },
    RepresentativeFrameNumber: {
        tag: "00286010",
        vr: "US",
        vm: "1",
    },
    FrameNumbersOfInterest: {
        tag: "00286020",
        vr: "US",
        vm: "1-n",
    },
    FrameOfInterestDescription: {
        tag: "00286022",
        vr: "LO",
        vm: "1-n",
    },
    FrameOfInterestType: {
        tag: "00286023",
        vr: "CS",
        vm: "1-n",
    },
    MaskPointers: {
        tag: "00286030",
        vr: "US",
        vm: "1-n",
    },
    RWavePointer: {
        tag: "00286040",
        vr: "US",
        vm: "1-n",
    },
    MaskSubtractionSequence: {
        tag: "00286100",
        vr: "SQ",
        vm: "1",
    },
    MaskOperation: {
        tag: "00286101",
        vr: "CS",
        vm: "1",
    },
    ApplicableFrameRange: {
        tag: "00286102",
        vr: "US",
        vm: "2-2n",
    },
    MaskFrameNumbers: {
        tag: "00286110",
        vr: "US",
        vm: "1-n",
    },
    ContrastFrameAveraging: {
        tag: "00286112",
        vr: "US",
        vm: "1",
    },
    MaskSubPixelShift: {
        tag: "00286114",
        vr: "FL",
        vm: "2",
    },
    TIDOffset: {
        tag: "00286120",
        vr: "SS",
        vm: "1",
    },
    MaskOperationExplanation: {
        tag: "00286190",
        vr: "ST",
        vm: "1",
    },
    EquipmentAdministratorSequence: {
        tag: "00287000",
        vr: "SQ",
        vm: "1",
    },
    NumberOfDisplaySubsystems: {
        tag: "00287001",
        vr: "US",
        vm: "1",
    },
    CurrentConfigurationID: {
        tag: "00287002",
        vr: "US",
        vm: "1",
    },
    DisplaySubsystemID: {
        tag: "00287003",
        vr: "US",
        vm: "1",
    },
    DisplaySubsystemName: {
        tag: "00287004",
        vr: "SH",
        vm: "1",
    },
    DisplaySubsystemDescription: {
        tag: "00287005",
        vr: "LO",
        vm: "1",
    },
    SystemStatus: {
        tag: "00287006",
        vr: "CS",
        vm: "1",
    },
    SystemStatusComment: {
        tag: "00287007",
        vr: "LO",
        vm: "1",
    },
    TargetLuminanceCharacteristicsSequence: {
        tag: "00287008",
        vr: "SQ",
        vm: "1",
    },
    LuminanceCharacteristicsID: {
        tag: "00287009",
        vr: "US",
        vm: "1",
    },
    DisplaySubsystemConfigurationSequence: {
        tag: "0028700A",
        vr: "SQ",
        vm: "1",
    },
    ConfigurationID: {
        tag: "0028700B",
        vr: "US",
        vm: "1",
    },
    ConfigurationName: {
        tag: "0028700C",
        vr: "SH",
        vm: "1",
    },
    ConfigurationDescription: {
        tag: "0028700D",
        vr: "LO",
        vm: "1",
    },
    ReferencedTargetLuminanceCharacteristicsID: {
        tag: "0028700E",
        vr: "US",
        vm: "1",
    },
    QAResultsSequence: {
        tag: "0028700F",
        vr: "SQ",
        vm: "1",
    },
    DisplaySubsystemQAResultsSequence: {
        tag: "00287010",
        vr: "SQ",
        vm: "1",
    },
    ConfigurationQAResultsSequence: {
        tag: "00287011",
        vr: "SQ",
        vm: "1",
    },
    MeasurementEquipmentSequence: {
        tag: "00287012",
        vr: "SQ",
        vm: "1",
    },
    MeasurementFunctions: {
        tag: "00287013",
        vr: "CS",
        vm: "1-n",
    },
    MeasurementEquipmentType: {
        tag: "00287014",
        vr: "CS",
        vm: "1",
    },
    VisualEvaluationResultSequence: {
        tag: "00287015",
        vr: "SQ",
        vm: "1",
    },
    DisplayCalibrationResultSequence: {
        tag: "00287016",
        vr: "SQ",
        vm: "1",
    },
    DDLValue: {
        tag: "00287017",
        vr: "US",
        vm: "1",
    },
    CIExyWhitePoint: {
        tag: "00287018",
        vr: "FL",
        vm: "2",
    },
    DisplayFunctionType: {
        tag: "00287019",
        vr: "CS",
        vm: "1",
    },
    GammaValue: {
        tag: "0028701A",
        vr: "FL",
        vm: "1",
    },
    NumberOfLuminancePoints: {
        tag: "0028701B",
        vr: "US",
        vm: "1",
    },
    LuminanceResponseSequence: {
        tag: "0028701C",
        vr: "SQ",
        vm: "1",
    },
    TargetMinimumLuminance: {
        tag: "0028701D",
        vr: "FL",
        vm: "1",
    },
    TargetMaximumLuminance: {
        tag: "0028701E",
        vr: "FL",
        vm: "1",
    },
    LuminanceValue: {
        tag: "0028701F",
        vr: "FL",
        vm: "1",
    },
    LuminanceResponseDescription: {
        tag: "00287020",
        vr: "LO",
        vm: "1",
    },
    WhitePointFlag: {
        tag: "00287021",
        vr: "CS",
        vm: "1",
    },
    DisplayDeviceTypeCodeSequence: {
        tag: "00287022",
        vr: "SQ",
        vm: "1",
    },
    DisplaySubsystemSequence: {
        tag: "00287023",
        vr: "SQ",
        vm: "1",
    },
    LuminanceResultSequence: {
        tag: "00287024",
        vr: "SQ",
        vm: "1",
    },
    AmbientLightValueSource: {
        tag: "00287025",
        vr: "CS",
        vm: "1",
    },
    MeasuredCharacteristics: {
        tag: "00287026",
        vr: "CS",
        vm: "1-n",
    },
    LuminanceUniformityResultSequence: {
        tag: "00287027",
        vr: "SQ",
        vm: "1",
    },
    VisualEvaluationTestSequence: {
        tag: "00287028",
        vr: "SQ",
        vm: "1",
    },
    TestResult: {
        tag: "00287029",
        vr: "CS",
        vm: "1",
    },
    TestResultComment: {
        tag: "0028702A",
        vr: "LO",
        vm: "1",
    },
    TestImageValidation: {
        tag: "0028702B",
        vr: "CS",
        vm: "1",
    },
    TestPatternCodeSequence: {
        tag: "0028702C",
        vr: "SQ",
        vm: "1",
    },
    MeasurementPatternCodeSequence: {
        tag: "0028702D",
        vr: "SQ",
        vm: "1",
    },
    VisualEvaluationMethodCodeSequence: {
        tag: "0028702E",
        vr: "SQ",
        vm: "1",
    },
    PixelDataProviderURL: {
        tag: "00287FE0",
        vr: "UR",
        vm: "1",
    },
    DataPointRows: {
        tag: "00289001",
        vr: "UL",
        vm: "1",
    },
    DataPointColumns: {
        tag: "00289002",
        vr: "UL",
        vm: "1",
    },
    SignalDomainColumns: {
        tag: "00289003",
        vr: "CS",
        vm: "1",
    },
    LargestMonochromePixelValue: {
        tag: "00289099",
        vr: "US",
        vm: "1",
    },
    DataRepresentation: {
        tag: "00289108",
        vr: "CS",
        vm: "1",
    },
    PixelMeasuresSequence: {
        tag: "00289110",
        vr: "SQ",
        vm: "1",
    },
    FrameVOILUTSequence: {
        tag: "00289132",
        vr: "SQ",
        vm: "1",
    },
    PixelValueTransformationSequence: {
        tag: "00289145",
        vr: "SQ",
        vm: "1",
    },
    SignalDomainRows: {
        tag: "00289235",
        vr: "CS",
        vm: "1",
    },
    DisplayFilterPercentage: {
        tag: "00289411",
        vr: "FL",
        vm: "1",
    },
    FramePixelShiftSequence: {
        tag: "00289415",
        vr: "SQ",
        vm: "1",
    },
    SubtractionItemID: {
        tag: "00289416",
        vr: "US",
        vm: "1",
    },
    PixelIntensityRelationshipLUTSequence: {
        tag: "00289422",
        vr: "SQ",
        vm: "1",
    },
    FramePixelDataPropertiesSequence: {
        tag: "00289443",
        vr: "SQ",
        vm: "1",
    },
    GeometricalProperties: {
        tag: "00289444",
        vr: "CS",
        vm: "1",
    },
    GeometricMaximumDistortion: {
        tag: "00289445",
        vr: "FL",
        vm: "1",
    },
    ImageProcessingApplied: {
        tag: "00289446",
        vr: "CS",
        vm: "1-n",
    },
    MaskSelectionMode: {
        tag: "00289454",
        vr: "CS",
        vm: "1",
    },
    LUTFunction: {
        tag: "00289474",
        vr: "CS",
        vm: "1",
    },
    MaskVisibilityPercentage: {
        tag: "00289478",
        vr: "FL",
        vm: "1",
    },
    PixelShiftSequence: {
        tag: "00289501",
        vr: "SQ",
        vm: "1",
    },
    RegionPixelShiftSequence: {
        tag: "00289502",
        vr: "SQ",
        vm: "1",
    },
    VerticesOfTheRegion: {
        tag: "00289503",
        vr: "SS",
        vm: "2-2n",
    },
    MultiFramePresentationSequence: {
        tag: "00289505",
        vr: "SQ",
        vm: "1",
    },
    PixelShiftFrameRange: {
        tag: "00289506",
        vr: "US",
        vm: "2-2n",
    },
    LUTFrameRange: {
        tag: "00289507",
        vr: "US",
        vm: "2-2n",
    },
    ImageToEquipmentMappingMatrix: {
        tag: "00289520",
        vr: "DS",
        vm: "16",
    },
    EquipmentCoordinateSystemIdentification: {
        tag: "00289537",
        vr: "CS",
        vm: "1",
    },
    StudyStatusID: {
        tag: "0032000A",
        vr: "CS",
        vm: "1",
    },
    StudyPriorityID: {
        tag: "0032000C",
        vr: "CS",
        vm: "1",
    },
    StudyIDIssuer: {
        tag: "00320012",
        vr: "LO",
        vm: "1",
    },
    StudyVerifiedDate: {
        tag: "00320032",
        vr: "DA",
        vm: "1",
    },
    StudyVerifiedTime: {
        tag: "00320033",
        vr: "TM",
        vm: "1",
    },
    StudyReadDate: {
        tag: "00320034",
        vr: "DA",
        vm: "1",
    },
    StudyReadTime: {
        tag: "00320035",
        vr: "TM",
        vm: "1",
    },
    ScheduledStudyStartDate: {
        tag: "00321000",
        vr: "DA",
        vm: "1",
    },
    ScheduledStudyStartTime: {
        tag: "00321001",
        vr: "TM",
        vm: "1",
    },
    ScheduledStudyStopDate: {
        tag: "00321010",
        vr: "DA",
        vm: "1",
    },
    ScheduledStudyStopTime: {
        tag: "00321011",
        vr: "TM",
        vm: "1",
    },
    ScheduledStudyLocation: {
        tag: "00321020",
        vr: "LO",
        vm: "1",
    },
    ScheduledStudyLocationAETitle: {
        tag: "00321021",
        vr: "AE",
        vm: "1-n",
    },
    ReasonForStudy: {
        tag: "00321030",
        vr: "LO",
        vm: "1",
    },
    RequestingPhysicianIdentificationSequence: {
        tag: "00321031",
        vr: "SQ",
        vm: "1",
    },
    RequestingPhysician: {
        tag: "00321032",
        vr: "PN",
        vm: "1",
    },
    RequestingService: {
        tag: "00321033",
        vr: "LO",
        vm: "1",
    },
    RequestingServiceCodeSequence: {
        tag: "00321034",
        vr: "SQ",
        vm: "1",
    },
    StudyArrivalDate: {
        tag: "00321040",
        vr: "DA",
        vm: "1",
    },
    StudyArrivalTime: {
        tag: "00321041",
        vr: "TM",
        vm: "1",
    },
    StudyCompletionDate: {
        tag: "00321050",
        vr: "DA",
        vm: "1",
    },
    StudyCompletionTime: {
        tag: "00321051",
        vr: "TM",
        vm: "1",
    },
    StudyComponentStatusID: {
        tag: "00321055",
        vr: "CS",
        vm: "1",
    },
    RequestedProcedureDescription: {
        tag: "00321060",
        vr: "LO",
        vm: "1",
    },
    RequestedProcedureCodeSequence: {
        tag: "00321064",
        vr: "SQ",
        vm: "1",
    },
    RequestedLateralityCodeSequence: {
        tag: "00321065",
        vr: "SQ",
        vm: "1",
    },
    ReasonForVisit: {
        tag: "00321066",
        vr: "UT",
        vm: "1",
    },
    ReasonForVisitCodeSequence: {
        tag: "00321067",
        vr: "SQ",
        vm: "1",
    },
    RequestedContrastAgent: {
        tag: "00321070",
        vr: "LO",
        vm: "1",
    },
    StudyComments: {
        tag: "00324000",
        vr: "LT",
        vm: "1",
    },
    FlowIdentifierSequence: {
        tag: "00340001",
        vr: "SQ",
        vm: "1",
    },
    FlowIdentifier: {
        tag: "00340002",
        vr: "OB",
        vm: "1",
    },
    FlowTransferSyntaxUID: {
        tag: "00340003",
        vr: "UI",
        vm: "1",
    },
    FlowRTPSamplingRate: {
        tag: "00340004",
        vr: "UL",
        vm: "1",
    },
    SourceIdentifier: {
        tag: "00340005",
        vr: "OB",
        vm: "1",
    },
    FrameOriginTimestamp: {
        tag: "00340007",
        vr: "OB",
        vm: "1",
    },
    IncludesImagingSubject: {
        tag: "00340008",
        vr: "CS",
        vm: "1",
    },
    FrameUsefulnessGroupSequence: {
        tag: "00340009",
        vr: "SQ",
        vm: "1",
    },
    RealTimeBulkDataFlowSequence: {
        tag: "0034000A",
        vr: "SQ",
        vm: "1",
    },
    CameraPositionGroupSequence: {
        tag: "0034000B",
        vr: "SQ",
        vm: "1",
    },
    IncludesInformation: {
        tag: "0034000C",
        vr: "CS",
        vm: "1",
    },
    TimeOfFrameGroupSequence: {
        tag: "0034000D",
        vr: "SQ",
        vm: "1",
    },
    ReferencedPatientAliasSequence: {
        tag: "00380004",
        vr: "SQ",
        vm: "1",
    },
    VisitStatusID: {
        tag: "00380008",
        vr: "CS",
        vm: "1",
    },
    AdmissionID: {
        tag: "00380010",
        vr: "LO",
        vm: "1",
    },
    IssuerOfAdmissionID: {
        tag: "00380011",
        vr: "LO",
        vm: "1",
    },
    IssuerOfAdmissionIDSequence: {
        tag: "00380014",
        vr: "SQ",
        vm: "1",
    },
    RouteOfAdmissions: {
        tag: "00380016",
        vr: "LO",
        vm: "1",
    },
    ScheduledAdmissionDate: {
        tag: "0038001A",
        vr: "DA",
        vm: "1",
    },
    ScheduledAdmissionTime: {
        tag: "0038001B",
        vr: "TM",
        vm: "1",
    },
    ScheduledDischargeDate: {
        tag: "0038001C",
        vr: "DA",
        vm: "1",
    },
    ScheduledDischargeTime: {
        tag: "0038001D",
        vr: "TM",
        vm: "1",
    },
    ScheduledPatientInstitutionResidence: {
        tag: "0038001E",
        vr: "LO",
        vm: "1",
    },
    AdmittingDate: {
        tag: "00380020",
        vr: "DA",
        vm: "1",
    },
    AdmittingTime: {
        tag: "00380021",
        vr: "TM",
        vm: "1",
    },
    DischargeDate: {
        tag: "00380030",
        vr: "DA",
        vm: "1",
    },
    DischargeTime: {
        tag: "00380032",
        vr: "TM",
        vm: "1",
    },
    DischargeDiagnosisDescription: {
        tag: "00380040",
        vr: "LO",
        vm: "1",
    },
    DischargeDiagnosisCodeSequence: {
        tag: "00380044",
        vr: "SQ",
        vm: "1",
    },
    SpecialNeeds: {
        tag: "00380050",
        vr: "LO",
        vm: "1",
    },
    ServiceEpisodeID: {
        tag: "00380060",
        vr: "LO",
        vm: "1",
    },
    IssuerOfServiceEpisodeID: {
        tag: "00380061",
        vr: "LO",
        vm: "1",
    },
    ServiceEpisodeDescription: {
        tag: "00380062",
        vr: "LO",
        vm: "1",
    },
    IssuerOfServiceEpisodeIDSequence: {
        tag: "00380064",
        vr: "SQ",
        vm: "1",
    },
    PertinentDocumentsSequence: {
        tag: "00380100",
        vr: "SQ",
        vm: "1",
    },
    PertinentResourcesSequence: {
        tag: "00380101",
        vr: "SQ",
        vm: "1",
    },
    ResourceDescription: {
        tag: "00380102",
        vr: "LO",
        vm: "1",
    },
    CurrentPatientLocation: {
        tag: "00380300",
        vr: "LO",
        vm: "1",
    },
    PatientInstitutionResidence: {
        tag: "00380400",
        vr: "LO",
        vm: "1",
    },
    PatientState: {
        tag: "00380500",
        vr: "LO",
        vm: "1",
    },
    PatientClinicalTrialParticipationSequence: {
        tag: "00380502",
        vr: "SQ",
        vm: "1",
    },
    VisitComments: {
        tag: "00384000",
        vr: "LT",
        vm: "1",
    },
    WaveformOriginality: {
        tag: "003A0004",
        vr: "CS",
        vm: "1",
    },
    NumberOfWaveformChannels: {
        tag: "003A0005",
        vr: "US",
        vm: "1",
    },
    NumberOfWaveformSamples: {
        tag: "003A0010",
        vr: "UL",
        vm: "1",
    },
    SamplingFrequency: {
        tag: "003A001A",
        vr: "DS",
        vm: "1",
    },
    MultiplexGroupLabel: {
        tag: "003A0020",
        vr: "SH",
        vm: "1",
    },
    ChannelDefinitionSequence: {
        tag: "003A0200",
        vr: "SQ",
        vm: "1",
    },
    WaveformChannelNumber: {
        tag: "003A0202",
        vr: "IS",
        vm: "1",
    },
    ChannelLabel: {
        tag: "003A0203",
        vr: "SH",
        vm: "1",
    },
    ChannelStatus: {
        tag: "003A0205",
        vr: "CS",
        vm: "1-n",
    },
    ChannelSourceSequence: {
        tag: "003A0208",
        vr: "SQ",
        vm: "1",
    },
    ChannelSourceModifiersSequence: {
        tag: "003A0209",
        vr: "SQ",
        vm: "1",
    },
    SourceWaveformSequence: {
        tag: "003A020A",
        vr: "SQ",
        vm: "1",
    },
    ChannelDerivationDescription: {
        tag: "003A020C",
        vr: "LO",
        vm: "1",
    },
    ChannelSensitivity: {
        tag: "003A0210",
        vr: "DS",
        vm: "1",
    },
    ChannelSensitivityUnitsSequence: {
        tag: "003A0211",
        vr: "SQ",
        vm: "1",
    },
    ChannelSensitivityCorrectionFactor: {
        tag: "003A0212",
        vr: "DS",
        vm: "1",
    },
    ChannelBaseline: {
        tag: "003A0213",
        vr: "DS",
        vm: "1",
    },
    ChannelTimeSkew: {
        tag: "003A0214",
        vr: "DS",
        vm: "1",
    },
    ChannelSampleSkew: {
        tag: "003A0215",
        vr: "DS",
        vm: "1",
    },
    ChannelOffset: {
        tag: "003A0218",
        vr: "DS",
        vm: "1",
    },
    WaveformBitsStored: {
        tag: "003A021A",
        vr: "US",
        vm: "1",
    },
    FilterLowFrequency: {
        tag: "003A0220",
        vr: "DS",
        vm: "1",
    },
    FilterHighFrequency: {
        tag: "003A0221",
        vr: "DS",
        vm: "1",
    },
    NotchFilterFrequency: {
        tag: "003A0222",
        vr: "DS",
        vm: "1",
    },
    NotchFilterBandwidth: {
        tag: "003A0223",
        vr: "DS",
        vm: "1",
    },
    WaveformDataDisplayScale: {
        tag: "003A0230",
        vr: "FL",
        vm: "1",
    },
    WaveformDisplayBackgroundCIELabValue: {
        tag: "003A0231",
        vr: "US",
        vm: "3",
    },
    WaveformPresentationGroupSequence: {
        tag: "003A0240",
        vr: "SQ",
        vm: "1",
    },
    PresentationGroupNumber: {
        tag: "003A0241",
        vr: "US",
        vm: "1",
    },
    ChannelDisplaySequence: {
        tag: "003A0242",
        vr: "SQ",
        vm: "1",
    },
    ChannelRecommendedDisplayCIELabValue: {
        tag: "003A0244",
        vr: "US",
        vm: "3",
    },
    ChannelPosition: {
        tag: "003A0245",
        vr: "FL",
        vm: "1",
    },
    DisplayShadingFlag: {
        tag: "003A0246",
        vr: "CS",
        vm: "1",
    },
    FractionalChannelDisplayScale: {
        tag: "003A0247",
        vr: "FL",
        vm: "1",
    },
    AbsoluteChannelDisplayScale: {
        tag: "003A0248",
        vr: "FL",
        vm: "1",
    },
    MultiplexedAudioChannelsDescriptionCodeSequence: {
        tag: "003A0300",
        vr: "SQ",
        vm: "1",
    },
    ChannelIdentificationCode: {
        tag: "003A0301",
        vr: "IS",
        vm: "1",
    },
    ChannelMode: {
        tag: "003A0302",
        vr: "CS",
        vm: "1",
    },
    MultiplexGroupUID: {
        tag: "003A0310",
        vr: "UI",
        vm: "1",
    },
    PowerlineFrequency: {
        tag: "003A0311",
        vr: "DS",
        vm: "1",
    },
    ChannelImpedanceSequence: {
        tag: "003A0312",
        vr: "SQ",
        vm: "1",
    },
    ImpedanceValue: {
        tag: "003A0313",
        vr: "DS",
        vm: "1",
    },
    ImpedanceMeasurementDateTime: {
        tag: "003A0314",
        vr: "DT",
        vm: "1",
    },
    ImpedanceMeasurementFrequency: {
        tag: "003A0315",
        vr: "DS",
        vm: "1",
    },
    ImpedanceMeasurementCurrentType: {
        tag: "003A0316",
        vr: "CS",
        vm: "1",
    },
    WaveformAmplifierType: {
        tag: "003A0317",
        vr: "CS",
        vm: "1",
    },
    FilterLowFrequencyCharacteristicsSequence: {
        tag: "003A0318",
        vr: "SQ",
        vm: "1",
    },
    FilterHighFrequencyCharacteristicsSequence: {
        tag: "003A0319",
        vr: "SQ",
        vm: "1",
    },
    SummarizedFilterLookupTableSequence: {
        tag: "003A0320",
        vr: "SQ",
        vm: "1",
    },
    NotchFilterCharacteristicsSequence: {
        tag: "003A0321",
        vr: "SQ",
        vm: "1",
    },
    WaveformFilterType: {
        tag: "003A0322",
        vr: "CS",
        vm: "1",
    },
    AnalogFilterCharacteristicsSequence: {
        tag: "003A0323",
        vr: "SQ",
        vm: "1",
    },
    AnalogFilterRollOff: {
        tag: "003A0324",
        vr: "DS",
        vm: "1",
    },
    AnalogFilterTypeCodeSequence: {
        tag: "003A0325",
        vr: "SQ",
        vm: "1",
    },
    DigitalFilterCharacteristicsSequence: {
        tag: "003A0326",
        vr: "SQ",
        vm: "1",
    },
    DigitalFilterOrder: {
        tag: "003A0327",
        vr: "IS",
        vm: "1",
    },
    DigitalFilterTypeCodeSequence: {
        tag: "003A0328",
        vr: "SQ",
        vm: "1",
    },
    WaveformFilterDescription: {
        tag: "003A0329",
        vr: "ST",
        vm: "1",
    },
    FilterLookupTableSequence: {
        tag: "003A032A",
        vr: "SQ",
        vm: "1",
    },
    FilterLookupTableDescription: {
        tag: "003A032B",
        vr: "ST",
        vm: "1",
    },
    FrequencyEncodingCodeSequence: {
        tag: "003A032C",
        vr: "SQ",
        vm: "1",
    },
    MagnitudeEncodingCodeSequence: {
        tag: "003A032D",
        vr: "SQ",
        vm: "1",
    },
    FilterLookupTableData: {
        tag: "003A032E",
        vr: "OD",
        vm: "1",
    },
    ScheduledStationAETitle: {
        tag: "00400001",
        vr: "AE",
        vm: "1-n",
    },
    ScheduledProcedureStepStartDate: {
        tag: "00400002",
        vr: "DA",
        vm: "1",
    },
    ScheduledProcedureStepStartTime: {
        tag: "00400003",
        vr: "TM",
        vm: "1",
    },
    ScheduledProcedureStepEndDate: {
        tag: "00400004",
        vr: "DA",
        vm: "1",
    },
    ScheduledProcedureStepEndTime: {
        tag: "00400005",
        vr: "TM",
        vm: "1",
    },
    ScheduledPerformingPhysicianName: {
        tag: "00400006",
        vr: "PN",
        vm: "1",
    },
    ScheduledProcedureStepDescription: {
        tag: "00400007",
        vr: "LO",
        vm: "1",
    },
    ScheduledProtocolCodeSequence: {
        tag: "00400008",
        vr: "SQ",
        vm: "1",
    },
    ScheduledProcedureStepID: {
        tag: "00400009",
        vr: "SH",
        vm: "1",
    },
    StageCodeSequence: {
        tag: "0040000A",
        vr: "SQ",
        vm: "1",
    },
    ScheduledPerformingPhysicianIdentificationSequence: {
        tag: "0040000B",
        vr: "SQ",
        vm: "1",
    },
    ScheduledStationName: {
        tag: "00400010",
        vr: "SH",
        vm: "1-n",
    },
    ScheduledProcedureStepLocation: {
        tag: "00400011",
        vr: "SH",
        vm: "1",
    },
    PreMedication: {
        tag: "00400012",
        vr: "LO",
        vm: "1",
    },
    ScheduledProcedureStepStatus: {
        tag: "00400020",
        vr: "CS",
        vm: "1",
    },
    OrderPlacerIdentifierSequence: {
        tag: "00400026",
        vr: "SQ",
        vm: "1",
    },
    OrderFillerIdentifierSequence: {
        tag: "00400027",
        vr: "SQ",
        vm: "1",
    },
    LocalNamespaceEntityID: {
        tag: "00400031",
        vr: "UT",
        vm: "1",
    },
    UniversalEntityID: {
        tag: "00400032",
        vr: "UT",
        vm: "1",
    },
    UniversalEntityIDType: {
        tag: "00400033",
        vr: "CS",
        vm: "1",
    },
    IdentifierTypeCode: {
        tag: "00400035",
        vr: "CS",
        vm: "1",
    },
    AssigningFacilitySequence: {
        tag: "00400036",
        vr: "SQ",
        vm: "1",
    },
    AssigningJurisdictionCodeSequence: {
        tag: "00400039",
        vr: "SQ",
        vm: "1",
    },
    AssigningAgencyOrDepartmentCodeSequence: {
        tag: "0040003A",
        vr: "SQ",
        vm: "1",
    },
    ScheduledProcedureStepSequence: {
        tag: "00400100",
        vr: "SQ",
        vm: "1",
    },
    ReferencedNonImageCompositeSOPInstanceSequence: {
        tag: "00400220",
        vr: "SQ",
        vm: "1",
    },
    PerformedStationAETitle: {
        tag: "00400241",
        vr: "AE",
        vm: "1",
    },
    PerformedStationName: {
        tag: "00400242",
        vr: "SH",
        vm: "1",
    },
    PerformedLocation: {
        tag: "00400243",
        vr: "SH",
        vm: "1",
    },
    PerformedProcedureStepStartDate: {
        tag: "00400244",
        vr: "DA",
        vm: "1",
    },
    PerformedProcedureStepStartTime: {
        tag: "00400245",
        vr: "TM",
        vm: "1",
    },
    PerformedProcedureStepEndDate: {
        tag: "00400250",
        vr: "DA",
        vm: "1",
    },
    PerformedProcedureStepEndTime: {
        tag: "00400251",
        vr: "TM",
        vm: "1",
    },
    PerformedProcedureStepStatus: {
        tag: "00400252",
        vr: "CS",
        vm: "1",
    },
    PerformedProcedureStepID: {
        tag: "00400253",
        vr: "SH",
        vm: "1",
    },
    PerformedProcedureStepDescription: {
        tag: "00400254",
        vr: "LO",
        vm: "1",
    },
    PerformedProcedureTypeDescription: {
        tag: "00400255",
        vr: "LO",
        vm: "1",
    },
    PerformedProtocolCodeSequence: {
        tag: "00400260",
        vr: "SQ",
        vm: "1",
    },
    PerformedProtocolType: {
        tag: "00400261",
        vr: "CS",
        vm: "1",
    },
    ScheduledStepAttributesSequence: {
        tag: "00400270",
        vr: "SQ",
        vm: "1",
    },
    RequestAttributesSequence: {
        tag: "00400275",
        vr: "SQ",
        vm: "1",
    },
    CommentsOnThePerformedProcedureStep: {
        tag: "00400280",
        vr: "ST",
        vm: "1",
    },
    PerformedProcedureStepDiscontinuationReasonCodeSequence: {
        tag: "00400281",
        vr: "SQ",
        vm: "1",
    },
    QuantitySequence: {
        tag: "00400293",
        vr: "SQ",
        vm: "1",
    },
    Quantity: {
        tag: "00400294",
        vr: "DS",
        vm: "1",
    },
    MeasuringUnitsSequence: {
        tag: "00400295",
        vr: "SQ",
        vm: "1",
    },
    BillingItemSequence: {
        tag: "00400296",
        vr: "SQ",
        vm: "1",
    },
    TotalTimeOfFluoroscopy: {
        tag: "00400300",
        vr: "US",
        vm: "1",
    },
    TotalNumberOfExposures: {
        tag: "00400301",
        vr: "US",
        vm: "1",
    },
    EntranceDose: {
        tag: "00400302",
        vr: "US",
        vm: "1",
    },
    ExposedArea: {
        tag: "00400303",
        vr: "US",
        vm: "1-2",
    },
    DistanceSourceToEntrance: {
        tag: "00400306",
        vr: "DS",
        vm: "1",
    },
    DistanceSourceToSupport: {
        tag: "00400307",
        vr: "DS",
        vm: "1",
    },
    ExposureDoseSequence: {
        tag: "0040030E",
        vr: "SQ",
        vm: "1",
    },
    CommentsOnRadiationDose: {
        tag: "00400310",
        vr: "ST",
        vm: "1",
    },
    XRayOutput: {
        tag: "00400312",
        vr: "DS",
        vm: "1",
    },
    HalfValueLayer: {
        tag: "00400314",
        vr: "DS",
        vm: "1",
    },
    OrganDose: {
        tag: "00400316",
        vr: "DS",
        vm: "1",
    },
    OrganExposed: {
        tag: "00400318",
        vr: "CS",
        vm: "1",
    },
    BillingProcedureStepSequence: {
        tag: "00400320",
        vr: "SQ",
        vm: "1",
    },
    FilmConsumptionSequence: {
        tag: "00400321",
        vr: "SQ",
        vm: "1",
    },
    BillingSuppliesAndDevicesSequence: {
        tag: "00400324",
        vr: "SQ",
        vm: "1",
    },
    ReferencedProcedureStepSequence: {
        tag: "00400330",
        vr: "SQ",
        vm: "1",
    },
    PerformedSeriesSequence: {
        tag: "00400340",
        vr: "SQ",
        vm: "1",
    },
    CommentsOnTheScheduledProcedureStep: {
        tag: "00400400",
        vr: "LT",
        vm: "1",
    },
    ProtocolContextSequence: {
        tag: "00400440",
        vr: "SQ",
        vm: "1",
    },
    ContentItemModifierSequence: {
        tag: "00400441",
        vr: "SQ",
        vm: "1",
    },
    ScheduledSpecimenSequence: {
        tag: "00400500",
        vr: "SQ",
        vm: "1",
    },
    SpecimenAccessionNumber: {
        tag: "0040050A",
        vr: "LO",
        vm: "1",
    },
    ContainerIdentifier: {
        tag: "00400512",
        vr: "LO",
        vm: "1",
    },
    IssuerOfTheContainerIdentifierSequence: {
        tag: "00400513",
        vr: "SQ",
        vm: "1",
    },
    AlternateContainerIdentifierSequence: {
        tag: "00400515",
        vr: "SQ",
        vm: "1",
    },
    ContainerTypeCodeSequence: {
        tag: "00400518",
        vr: "SQ",
        vm: "1",
    },
    ContainerDescription: {
        tag: "0040051A",
        vr: "LO",
        vm: "1",
    },
    ContainerComponentSequence: {
        tag: "00400520",
        vr: "SQ",
        vm: "1",
    },
    SpecimenSequence: {
        tag: "00400550",
        vr: "SQ",
        vm: "1",
    },
    SpecimenIdentifier: {
        tag: "00400551",
        vr: "LO",
        vm: "1",
    },
    SpecimenDescriptionSequenceTrial: {
        tag: "00400552",
        vr: "SQ",
        vm: "1",
    },
    SpecimenDescriptionTrial: {
        tag: "00400553",
        vr: "ST",
        vm: "1",
    },
    SpecimenUID: {
        tag: "00400554",
        vr: "UI",
        vm: "1",
    },
    AcquisitionContextSequence: {
        tag: "00400555",
        vr: "SQ",
        vm: "1",
    },
    AcquisitionContextDescription: {
        tag: "00400556",
        vr: "ST",
        vm: "1",
    },
    SpecimenTypeCodeSequence: {
        tag: "0040059A",
        vr: "SQ",
        vm: "1",
    },
    SpecimenDescriptionSequence: {
        tag: "00400560",
        vr: "SQ",
        vm: "1",
    },
    IssuerOfTheSpecimenIdentifierSequence: {
        tag: "00400562",
        vr: "SQ",
        vm: "1",
    },
    SpecimenShortDescription: {
        tag: "00400600",
        vr: "LO",
        vm: "1",
    },
    SpecimenDetailedDescription: {
        tag: "00400602",
        vr: "UT",
        vm: "1",
    },
    SpecimenPreparationSequence: {
        tag: "00400610",
        vr: "SQ",
        vm: "1",
    },
    SpecimenPreparationStepContentItemSequence: {
        tag: "00400612",
        vr: "SQ",
        vm: "1",
    },
    SpecimenLocalizationContentItemSequence: {
        tag: "00400620",
        vr: "SQ",
        vm: "1",
    },
    SlideIdentifier: {
        tag: "004006FA",
        vr: "LO",
        vm: "1",
    },
    WholeSlideMicroscopyImageFrameTypeSequence: {
        tag: "00400710",
        vr: "SQ",
        vm: "1",
    },
    ImageCenterPointCoordinatesSequence: {
        tag: "0040071A",
        vr: "SQ",
        vm: "1",
    },
    XOffsetInSlideCoordinateSystem: {
        tag: "0040072A",
        vr: "DS",
        vm: "1",
    },
    YOffsetInSlideCoordinateSystem: {
        tag: "0040073A",
        vr: "DS",
        vm: "1",
    },
    ZOffsetInSlideCoordinateSystem: {
        tag: "0040074A",
        vr: "DS",
        vm: "1",
    },
    PixelSpacingSequence: {
        tag: "004008D8",
        vr: "SQ",
        vm: "1",
    },
    CoordinateSystemAxisCodeSequence: {
        tag: "004008DA",
        vr: "SQ",
        vm: "1",
    },
    MeasurementUnitsCodeSequence: {
        tag: "004008EA",
        vr: "SQ",
        vm: "1",
    },
    VitalStainCodeSequenceTrial: {
        tag: "004009F8",
        vr: "SQ",
        vm: "1",
    },
    RequestedProcedureID: {
        tag: "00401001",
        vr: "SH",
        vm: "1",
    },
    ReasonForTheRequestedProcedure: {
        tag: "00401002",
        vr: "LO",
        vm: "1",
    },
    RequestedProcedurePriority: {
        tag: "00401003",
        vr: "SH",
        vm: "1",
    },
    PatientTransportArrangements: {
        tag: "00401004",
        vr: "LO",
        vm: "1",
    },
    RequestedProcedureLocation: {
        tag: "00401005",
        vr: "LO",
        vm: "1",
    },
    PlacerOrderNumberProcedure: {
        tag: "00401006",
        vr: "SH",
        vm: "1",
    },
    FillerOrderNumberProcedure: {
        tag: "00401007",
        vr: "SH",
        vm: "1",
    },
    ConfidentialityCode: {
        tag: "00401008",
        vr: "LO",
        vm: "1",
    },
    ReportingPriority: {
        tag: "00401009",
        vr: "SH",
        vm: "1",
    },
    ReasonForRequestedProcedureCodeSequence: {
        tag: "0040100A",
        vr: "SQ",
        vm: "1",
    },
    NamesOfIntendedRecipientsOfResults: {
        tag: "00401010",
        vr: "PN",
        vm: "1-n",
    },
    IntendedRecipientsOfResultsIdentificationSequence: {
        tag: "00401011",
        vr: "SQ",
        vm: "1",
    },
    ReasonForPerformedProcedureCodeSequence: {
        tag: "00401012",
        vr: "SQ",
        vm: "1",
    },
    RequestedProcedureDescriptionTrial: {
        tag: "00401060",
        vr: "LO",
        vm: "1",
    },
    PersonIdentificationCodeSequence: {
        tag: "00401101",
        vr: "SQ",
        vm: "1",
    },
    PersonAddress: {
        tag: "00401102",
        vr: "ST",
        vm: "1",
    },
    PersonTelephoneNumbers: {
        tag: "00401103",
        vr: "LO",
        vm: "1-n",
    },
    PersonTelecomInformation: {
        tag: "00401104",
        vr: "LT",
        vm: "1",
    },
    RequestedProcedureComments: {
        tag: "00401400",
        vr: "LT",
        vm: "1",
    },
    ReasonForTheImagingServiceRequest: {
        tag: "00402001",
        vr: "LO",
        vm: "1",
    },
    IssueDateOfImagingServiceRequest: {
        tag: "00402004",
        vr: "DA",
        vm: "1",
    },
    IssueTimeOfImagingServiceRequest: {
        tag: "00402005",
        vr: "TM",
        vm: "1",
    },
    PlacerOrderNumberImagingServiceRequestRetired: {
        tag: "00402006",
        vr: "SH",
        vm: "1",
    },
    FillerOrderNumberImagingServiceRequestRetired: {
        tag: "00402007",
        vr: "SH",
        vm: "1",
    },
    OrderEnteredBy: {
        tag: "00402008",
        vr: "PN",
        vm: "1",
    },
    OrderEntererLocation: {
        tag: "00402009",
        vr: "SH",
        vm: "1",
    },
    OrderCallbackPhoneNumber: {
        tag: "00402010",
        vr: "SH",
        vm: "1",
    },
    OrderCallbackTelecomInformation: {
        tag: "00402011",
        vr: "LT",
        vm: "1",
    },
    PlacerOrderNumberImagingServiceRequest: {
        tag: "00402016",
        vr: "LO",
        vm: "1",
    },
    FillerOrderNumberImagingServiceRequest: {
        tag: "00402017",
        vr: "LO",
        vm: "1",
    },
    ImagingServiceRequestComments: {
        tag: "00402400",
        vr: "LT",
        vm: "1",
    },
    ConfidentialityConstraintOnPatientDataDescription: {
        tag: "00403001",
        vr: "LO",
        vm: "1",
    },
    GeneralPurposeScheduledProcedureStepStatus: {
        tag: "00404001",
        vr: "CS",
        vm: "1",
    },
    GeneralPurposePerformedProcedureStepStatus: {
        tag: "00404002",
        vr: "CS",
        vm: "1",
    },
    GeneralPurposeScheduledProcedureStepPriority: {
        tag: "00404003",
        vr: "CS",
        vm: "1",
    },
    ScheduledProcessingApplicationsCodeSequence: {
        tag: "00404004",
        vr: "SQ",
        vm: "1",
    },
    ScheduledProcedureStepStartDateTime: {
        tag: "00404005",
        vr: "DT",
        vm: "1",
    },
    MultipleCopiesFlag: {
        tag: "00404006",
        vr: "CS",
        vm: "1",
    },
    PerformedProcessingApplicationsCodeSequence: {
        tag: "00404007",
        vr: "SQ",
        vm: "1",
    },
    ScheduledProcedureStepExpirationDateTime: {
        tag: "00404008",
        vr: "DT",
        vm: "1",
    },
    HumanPerformerCodeSequence: {
        tag: "00404009",
        vr: "SQ",
        vm: "1",
    },
    ScheduledProcedureStepModificationDateTime: {
        tag: "00404010",
        vr: "DT",
        vm: "1",
    },
    ExpectedCompletionDateTime: {
        tag: "00404011",
        vr: "DT",
        vm: "1",
    },
    ResultingGeneralPurposePerformedProcedureStepsSequence: {
        tag: "00404015",
        vr: "SQ",
        vm: "1",
    },
    ReferencedGeneralPurposeScheduledProcedureStepSequence: {
        tag: "00404016",
        vr: "SQ",
        vm: "1",
    },
    ScheduledWorkitemCodeSequence: {
        tag: "00404018",
        vr: "SQ",
        vm: "1",
    },
    PerformedWorkitemCodeSequence: {
        tag: "00404019",
        vr: "SQ",
        vm: "1",
    },
    InputAvailabilityFlag: {
        tag: "00404020",
        vr: "CS",
        vm: "1",
    },
    InputInformationSequence: {
        tag: "00404021",
        vr: "SQ",
        vm: "1",
    },
    RelevantInformationSequence: {
        tag: "00404022",
        vr: "SQ",
        vm: "1",
    },
    ReferencedGeneralPurposeScheduledProcedureStepTransactionUID: {
        tag: "00404023",
        vr: "UI",
        vm: "1",
    },
    ScheduledStationNameCodeSequence: {
        tag: "00404025",
        vr: "SQ",
        vm: "1",
    },
    ScheduledStationClassCodeSequence: {
        tag: "00404026",
        vr: "SQ",
        vm: "1",
    },
    ScheduledStationGeographicLocationCodeSequence: {
        tag: "00404027",
        vr: "SQ",
        vm: "1",
    },
    PerformedStationNameCodeSequence: {
        tag: "00404028",
        vr: "SQ",
        vm: "1",
    },
    PerformedStationClassCodeSequence: {
        tag: "00404029",
        vr: "SQ",
        vm: "1",
    },
    PerformedStationGeographicLocationCodeSequence: {
        tag: "00404030",
        vr: "SQ",
        vm: "1",
    },
    RequestedSubsequentWorkitemCodeSequence: {
        tag: "00404031",
        vr: "SQ",
        vm: "1",
    },
    NonDICOMOutputCodeSequence: {
        tag: "00404032",
        vr: "SQ",
        vm: "1",
    },
    OutputInformationSequence: {
        tag: "00404033",
        vr: "SQ",
        vm: "1",
    },
    ScheduledHumanPerformersSequence: {
        tag: "00404034",
        vr: "SQ",
        vm: "1",
    },
    ActualHumanPerformersSequence: {
        tag: "00404035",
        vr: "SQ",
        vm: "1",
    },
    HumanPerformerOrganization: {
        tag: "00404036",
        vr: "LO",
        vm: "1",
    },
    HumanPerformerName: {
        tag: "00404037",
        vr: "PN",
        vm: "1",
    },
    RawDataHandling: {
        tag: "00404040",
        vr: "CS",
        vm: "1",
    },
    InputReadinessState: {
        tag: "00404041",
        vr: "CS",
        vm: "1",
    },
    PerformedProcedureStepStartDateTime: {
        tag: "00404050",
        vr: "DT",
        vm: "1",
    },
    PerformedProcedureStepEndDateTime: {
        tag: "00404051",
        vr: "DT",
        vm: "1",
    },
    ProcedureStepCancellationDateTime: {
        tag: "00404052",
        vr: "DT",
        vm: "1",
    },
    OutputDestinationSequence: {
        tag: "00404070",
        vr: "SQ",
        vm: "1",
    },
    DICOMStorageSequence: {
        tag: "00404071",
        vr: "SQ",
        vm: "1",
    },
    STOWRSStorageSequence: {
        tag: "00404072",
        vr: "SQ",
        vm: "1",
    },
    StorageURL: {
        tag: "00404073",
        vr: "UR",
        vm: "1",
    },
    XDSStorageSequence: {
        tag: "00404074",
        vr: "SQ",
        vm: "1",
    },
    EntranceDoseInmGy: {
        tag: "00408302",
        vr: "DS",
        vm: "1",
    },
    EntranceDoseDerivation: {
        tag: "00408303",
        vr: "CS",
        vm: "1",
    },
    ParametricMapFrameTypeSequence: {
        tag: "00409092",
        vr: "SQ",
        vm: "1",
    },
    ReferencedImageRealWorldValueMappingSequence: {
        tag: "00409094",
        vr: "SQ",
        vm: "1",
    },
    RealWorldValueMappingSequence: {
        tag: "00409096",
        vr: "SQ",
        vm: "1",
    },
    PixelValueMappingCodeSequence: {
        tag: "00409098",
        vr: "SQ",
        vm: "1",
    },
    LUTLabel: {
        tag: "00409210",
        vr: "SH",
        vm: "1",
    },
    RealWorldValueLastValueMapped: {
        tag: "00409211",
        vr: "US or SS",
        vm: "1",
    },
    RealWorldValueLUTData: {
        tag: "00409212",
        vr: "FD",
        vm: "1-n",
    },
    DoubleFloatRealWorldValueLastValueMapped: {
        tag: "00409213",
        vr: "FD",
        vm: "1",
    },
    DoubleFloatRealWorldValueFirstValueMapped: {
        tag: "00409214",
        vr: "FD",
        vm: "1",
    },
    RealWorldValueFirstValueMapped: {
        tag: "00409216",
        vr: "US or SS",
        vm: "1",
    },
    QuantityDefinitionSequence: {
        tag: "00409220",
        vr: "SQ",
        vm: "1",
    },
    RealWorldValueIntercept: {
        tag: "00409224",
        vr: "FD",
        vm: "1",
    },
    RealWorldValueSlope: {
        tag: "00409225",
        vr: "FD",
        vm: "1",
    },
    FindingsFlagTrial: {
        tag: "0040A007",
        vr: "CS",
        vm: "1",
    },
    RelationshipType: {
        tag: "0040A010",
        vr: "CS",
        vm: "1",
    },
    FindingsSequenceTrial: {
        tag: "0040A020",
        vr: "SQ",
        vm: "1",
    },
    FindingsGroupUIDTrial: {
        tag: "0040A021",
        vr: "UI",
        vm: "1",
    },
    ReferencedFindingsGroupUIDTrial: {
        tag: "0040A022",
        vr: "UI",
        vm: "1",
    },
    FindingsGroupRecordingDateTrial: {
        tag: "0040A023",
        vr: "DA",
        vm: "1",
    },
    FindingsGroupRecordingTimeTrial: {
        tag: "0040A024",
        vr: "TM",
        vm: "1",
    },
    FindingsSourceCategoryCodeSequenceTrial: {
        tag: "0040A026",
        vr: "SQ",
        vm: "1",
    },
    VerifyingOrganization: {
        tag: "0040A027",
        vr: "LO",
        vm: "1",
    },
    DocumentingOrganizationIdentifierCodeSequenceTrial: {
        tag: "0040A028",
        vr: "SQ",
        vm: "1",
    },
    VerificationDateTime: {
        tag: "0040A030",
        vr: "DT",
        vm: "1",
    },
    ObservationDateTime: {
        tag: "0040A032",
        vr: "DT",
        vm: "1",
    },
    ObservationStartDateTime: {
        tag: "0040A033",
        vr: "DT",
        vm: "1",
    },
    EffectiveStartDateTime: {
        tag: "0040A034",
        vr: "DT",
        vm: "1",
    },
    EffectiveStopDateTime: {
        tag: "0040A035",
        vr: "DT",
        vm: "1",
    },
    ValueType: {
        tag: "0040A040",
        vr: "CS",
        vm: "1",
    },
    ConceptNameCodeSequence: {
        tag: "0040A043",
        vr: "SQ",
        vm: "1",
    },
    MeasurementPrecisionDescriptionTrial: {
        tag: "0040A047",
        vr: "LO",
        vm: "1",
    },
    ContinuityOfContent: {
        tag: "0040A050",
        vr: "CS",
        vm: "1",
    },
    UrgencyOrPriorityAlertsTrial: {
        tag: "0040A057",
        vr: "CS",
        vm: "1-n",
    },
    SequencingIndicatorTrial: {
        tag: "0040A060",
        vr: "LO",
        vm: "1",
    },
    DocumentIdentifierCodeSequenceTrial: {
        tag: "0040A066",
        vr: "SQ",
        vm: "1",
    },
    DocumentAuthorTrial: {
        tag: "0040A067",
        vr: "PN",
        vm: "1",
    },
    DocumentAuthorIdentifierCodeSequenceTrial: {
        tag: "0040A068",
        vr: "SQ",
        vm: "1",
    },
    IdentifierCodeSequenceTrial: {
        tag: "0040A070",
        vr: "SQ",
        vm: "1",
    },
    VerifyingObserverSequence: {
        tag: "0040A073",
        vr: "SQ",
        vm: "1",
    },
    ObjectBinaryIdentifierTrial: {
        tag: "0040A074",
        vr: "OB",
        vm: "1",
    },
    VerifyingObserverName: {
        tag: "0040A075",
        vr: "PN",
        vm: "1",
    },
    DocumentingObserverIdentifierCodeSequenceTrial: {
        tag: "0040A076",
        vr: "SQ",
        vm: "1",
    },
    AuthorObserverSequence: {
        tag: "0040A078",
        vr: "SQ",
        vm: "1",
    },
    ParticipantSequence: {
        tag: "0040A07A",
        vr: "SQ",
        vm: "1",
    },
    CustodialOrganizationSequence: {
        tag: "0040A07C",
        vr: "SQ",
        vm: "1",
    },
    ParticipationType: {
        tag: "0040A080",
        vr: "CS",
        vm: "1",
    },
    ParticipationDateTime: {
        tag: "0040A082",
        vr: "DT",
        vm: "1",
    },
    ObserverType: {
        tag: "0040A084",
        vr: "CS",
        vm: "1",
    },
    ProcedureIdentifierCodeSequenceTrial: {
        tag: "0040A085",
        vr: "SQ",
        vm: "1",
    },
    VerifyingObserverIdentificationCodeSequence: {
        tag: "0040A088",
        vr: "SQ",
        vm: "1",
    },
    ObjectDirectoryBinaryIdentifierTrial: {
        tag: "0040A089",
        vr: "OB",
        vm: "1",
    },
    EquivalentCDADocumentSequence: {
        tag: "0040A090",
        vr: "SQ",
        vm: "1",
    },
    ReferencedWaveformChannels: {
        tag: "0040A0B0",
        vr: "US",
        vm: "2-2n",
    },
    DateOfDocumentOrVerbalTransactionTrial: {
        tag: "0040A110",
        vr: "DA",
        vm: "1",
    },
    TimeOfDocumentCreationOrVerbalTransactionTrial: {
        tag: "0040A112",
        vr: "TM",
        vm: "1",
    },
    DateTime: {
        tag: "0040A120",
        vr: "DT",
        vm: "1",
    },
    Date: {
        tag: "0040A121",
        vr: "DA",
        vm: "1",
    },
    Time: {
        tag: "0040A122",
        vr: "TM",
        vm: "1",
    },
    PersonName: {
        tag: "0040A123",
        vr: "PN",
        vm: "1",
    },
    UID: {
        tag: "0040A124",
        vr: "UI",
        vm: "1",
    },
    ReportStatusIDTrial: {
        tag: "0040A125",
        vr: "CS",
        vm: "2",
    },
    TemporalRangeType: {
        tag: "0040A130",
        vr: "CS",
        vm: "1",
    },
    ReferencedSamplePositions: {
        tag: "0040A132",
        vr: "UL",
        vm: "1-n",
    },
    ReferencedFrameNumbers: {
        tag: "0040A136",
        vr: "US",
        vm: "1-n",
    },
    ReferencedTimeOffsets: {
        tag: "0040A138",
        vr: "DS",
        vm: "1-n",
    },
    ReferencedDateTime: {
        tag: "0040A13A",
        vr: "DT",
        vm: "1-n",
    },
    TextValue: {
        tag: "0040A160",
        vr: "UT",
        vm: "1",
    },
    FloatingPointValue: {
        tag: "0040A161",
        vr: "FD",
        vm: "1-n",
    },
    RationalNumeratorValue: {
        tag: "0040A162",
        vr: "SL",
        vm: "1-n",
    },
    RationalDenominatorValue: {
        tag: "0040A163",
        vr: "UL",
        vm: "1-n",
    },
    ObservationCategoryCodeSequenceTrial: {
        tag: "0040A167",
        vr: "SQ",
        vm: "1",
    },
    ConceptCodeSequence: {
        tag: "0040A168",
        vr: "SQ",
        vm: "1",
    },
    BibliographicCitationTrial: {
        tag: "0040A16A",
        vr: "ST",
        vm: "1",
    },
    PurposeOfReferenceCodeSequence: {
        tag: "0040A170",
        vr: "SQ",
        vm: "1",
    },
    ObservationUID: {
        tag: "0040A171",
        vr: "UI",
        vm: "1",
    },
    ReferencedObservationUIDTrial: {
        tag: "0040A172",
        vr: "UI",
        vm: "1",
    },
    ReferencedObservationClassTrial: {
        tag: "0040A173",
        vr: "CS",
        vm: "1",
    },
    ReferencedObjectObservationClassTrial: {
        tag: "0040A174",
        vr: "CS",
        vm: "1",
    },
    AnnotationGroupNumber: {
        tag: "0040A180",
        vr: "US",
        vm: "1",
    },
    ObservationDateTrial: {
        tag: "0040A192",
        vr: "DA",
        vm: "1",
    },
    ObservationTimeTrial: {
        tag: "0040A193",
        vr: "TM",
        vm: "1",
    },
    MeasurementAutomationTrial: {
        tag: "0040A194",
        vr: "CS",
        vm: "1",
    },
    ModifierCodeSequence: {
        tag: "0040A195",
        vr: "SQ",
        vm: "1",
    },
    IdentificationDescriptionTrial: {
        tag: "0040A224",
        vr: "ST",
        vm: "1",
    },
    CoordinatesSetGeometricTypeTrial: {
        tag: "0040A290",
        vr: "CS",
        vm: "1",
    },
    AlgorithmCodeSequenceTrial: {
        tag: "0040A296",
        vr: "SQ",
        vm: "1",
    },
    AlgorithmDescriptionTrial: {
        tag: "0040A297",
        vr: "ST",
        vm: "1",
    },
    PixelCoordinatesSetTrial: {
        tag: "0040A29A",
        vr: "SL",
        vm: "2-2n",
    },
    MeasuredValueSequence: {
        tag: "0040A300",
        vr: "SQ",
        vm: "1",
    },
    NumericValueQualifierCodeSequence: {
        tag: "0040A301",
        vr: "SQ",
        vm: "1",
    },
    CurrentObserverTrial: {
        tag: "0040A307",
        vr: "PN",
        vm: "1",
    },
    NumericValue: {
        tag: "0040A30A",
        vr: "DS",
        vm: "1-n",
    },
    ReferencedAccessionSequenceTrial: {
        tag: "0040A313",
        vr: "SQ",
        vm: "1",
    },
    ReportStatusCommentTrial: {
        tag: "0040A33A",
        vr: "ST",
        vm: "1",
    },
    ProcedureContextSequenceTrial: {
        tag: "0040A340",
        vr: "SQ",
        vm: "1",
    },
    VerbalSourceTrial: {
        tag: "0040A352",
        vr: "PN",
        vm: "1",
    },
    AddressTrial: {
        tag: "0040A353",
        vr: "ST",
        vm: "1",
    },
    TelephoneNumberTrial: {
        tag: "0040A354",
        vr: "LO",
        vm: "1",
    },
    VerbalSourceIdentifierCodeSequenceTrial: {
        tag: "0040A358",
        vr: "SQ",
        vm: "1",
    },
    PredecessorDocumentsSequence: {
        tag: "0040A360",
        vr: "SQ",
        vm: "1",
    },
    ReferencedRequestSequence: {
        tag: "0040A370",
        vr: "SQ",
        vm: "1",
    },
    PerformedProcedureCodeSequence: {
        tag: "0040A372",
        vr: "SQ",
        vm: "1",
    },
    CurrentRequestedProcedureEvidenceSequence: {
        tag: "0040A375",
        vr: "SQ",
        vm: "1",
    },
    ReportDetailSequenceTrial: {
        tag: "0040A380",
        vr: "SQ",
        vm: "1",
    },
    PertinentOtherEvidenceSequence: {
        tag: "0040A385",
        vr: "SQ",
        vm: "1",
    },
    HL7StructuredDocumentReferenceSequence: {
        tag: "0040A390",
        vr: "SQ",
        vm: "1",
    },
    ObservationSubjectUIDTrial: {
        tag: "0040A402",
        vr: "UI",
        vm: "1",
    },
    ObservationSubjectClassTrial: {
        tag: "0040A403",
        vr: "CS",
        vm: "1",
    },
    ObservationSubjectTypeCodeSequenceTrial: {
        tag: "0040A404",
        vr: "SQ",
        vm: "1",
    },
    CompletionFlag: {
        tag: "0040A491",
        vr: "CS",
        vm: "1",
    },
    CompletionFlagDescription: {
        tag: "0040A492",
        vr: "LO",
        vm: "1",
    },
    VerificationFlag: {
        tag: "0040A493",
        vr: "CS",
        vm: "1",
    },
    ArchiveRequested: {
        tag: "0040A494",
        vr: "CS",
        vm: "1",
    },
    PreliminaryFlag: {
        tag: "0040A496",
        vr: "CS",
        vm: "1",
    },
    ContentTemplateSequence: {
        tag: "0040A504",
        vr: "SQ",
        vm: "1",
    },
    IdenticalDocumentsSequence: {
        tag: "0040A525",
        vr: "SQ",
        vm: "1",
    },
    ObservationSubjectContextFlagTrial: {
        tag: "0040A600",
        vr: "CS",
        vm: "1",
    },
    ObserverContextFlagTrial: {
        tag: "0040A601",
        vr: "CS",
        vm: "1",
    },
    ProcedureContextFlagTrial: {
        tag: "0040A603",
        vr: "CS",
        vm: "1",
    },
    ContentSequence: {
        tag: "0040A730",
        vr: "SQ",
        vm: "1",
    },
    RelationshipSequenceTrial: {
        tag: "0040A731",
        vr: "SQ",
        vm: "1",
    },
    RelationshipTypeCodeSequenceTrial: {
        tag: "0040A732",
        vr: "SQ",
        vm: "1",
    },
    LanguageCodeSequenceTrial: {
        tag: "0040A744",
        vr: "SQ",
        vm: "1",
    },
    TabulatedValuesSequence: {
        tag: "0040A801",
        vr: "SQ",
        vm: "1",
    },
    NumberOfTableRows: {
        tag: "0040A802",
        vr: "UL",
        vm: "1",
    },
    NumberOfTableColumns: {
        tag: "0040A803",
        vr: "UL",
        vm: "1",
    },
    TableRowNumber: {
        tag: "0040A804",
        vr: "UL",
        vm: "1",
    },
    TableColumnNumber: {
        tag: "0040A805",
        vr: "UL",
        vm: "1",
    },
    TableRowDefinitionSequence: {
        tag: "0040A806",
        vr: "SQ",
        vm: "1",
    },
    TableColumnDefinitionSequence: {
        tag: "0040A807",
        vr: "SQ",
        vm: "1",
    },
    CellValuesSequence: {
        tag: "0040A808",
        vr: "SQ",
        vm: "1",
    },
    UniformResourceLocatorTrial: {
        tag: "0040A992",
        vr: "ST",
        vm: "1",
    },
    WaveformAnnotationSequence: {
        tag: "0040B020",
        vr: "SQ",
        vm: "1",
    },
    StructuredWaveformAnnotationSequence: {
        tag: "0040B030",
        vr: "SQ",
        vm: "1",
    },
    WaveformAnnotationDisplaySelectionSequence: {
        tag: "0040B031",
        vr: "SQ",
        vm: "1",
    },
    ReferencedMontageIndex: {
        tag: "0040B032",
        vr: "US",
        vm: "1",
    },
    WaveformTextualAnnotationSequence: {
        tag: "0040B033",
        vr: "SQ",
        vm: "1",
    },
    AnnotationDateTime: {
        tag: "0040B034",
        vr: "DT",
        vm: "1",
    },
    DisplayedWaveformSegmentSequence: {
        tag: "0040B035",
        vr: "SQ",
        vm: "1",
    },
    SegmentDefinitionDateTime: {
        tag: "0040B036",
        vr: "DT",
        vm: "1",
    },
    MontageActivationSequence: {
        tag: "0040B037",
        vr: "SQ",
        vm: "1",
    },
    MontageActivationTimeOffset: {
        tag: "0040B038",
        vr: "DS",
        vm: "1",
    },
    WaveformMontageSequence: {
        tag: "0040B039",
        vr: "SQ",
        vm: "1",
    },
    ReferencedMontageChannelNumber: {
        tag: "0040B03A",
        vr: "IS",
        vm: "1",
    },
    MontageName: {
        tag: "0040B03B",
        vr: "LT",
        vm: "1",
    },
    MontageChannelSequence: {
        tag: "0040B03C",
        vr: "SQ",
        vm: "1",
    },
    MontageIndex: {
        tag: "0040B03D",
        vr: "US",
        vm: "1",
    },
    MontageChannelNumber: {
        tag: "0040B03E",
        vr: "IS",
        vm: "1",
    },
    MontageChannelLabel: {
        tag: "0040B03F",
        vr: "LO",
        vm: "1",
    },
    MontageChannelSourceCodeSequence: {
        tag: "0040B040",
        vr: "SQ",
        vm: "1",
    },
    ContributingChannelSourcesSequence: {
        tag: "0040B041",
        vr: "SQ",
        vm: "1",
    },
    ChannelWeight: {
        tag: "0040B042",
        vr: "FL",
        vm: "1",
    },
    TemplateIdentifier: {
        tag: "0040DB00",
        vr: "CS",
        vm: "1",
    },
    TemplateVersion: {
        tag: "0040DB06",
        vr: "DT",
        vm: "1",
    },
    TemplateLocalVersion: {
        tag: "0040DB07",
        vr: "DT",
        vm: "1",
    },
    TemplateExtensionFlag: {
        tag: "0040DB0B",
        vr: "CS",
        vm: "1",
    },
    TemplateExtensionOrganizationUID: {
        tag: "0040DB0C",
        vr: "UI",
        vm: "1",
    },
    TemplateExtensionCreatorUID: {
        tag: "0040DB0D",
        vr: "UI",
        vm: "1",
    },
    ReferencedContentItemIdentifier: {
        tag: "0040DB73",
        vr: "UL",
        vm: "1-n",
    },
    HL7InstanceIdentifier: {
        tag: "0040E001",
        vr: "ST",
        vm: "1",
    },
    HL7DocumentEffectiveTime: {
        tag: "0040E004",
        vr: "DT",
        vm: "1",
    },
    HL7DocumentTypeCodeSequence: {
        tag: "0040E006",
        vr: "SQ",
        vm: "1",
    },
    DocumentClassCodeSequence: {
        tag: "0040E008",
        vr: "SQ",
        vm: "1",
    },
    RetrieveURI: {
        tag: "0040E010",
        vr: "UR",
        vm: "1",
    },
    RetrieveLocationUID: {
        tag: "0040E011",
        vr: "UI",
        vm: "1",
    },
    TypeOfInstances: {
        tag: "0040E020",
        vr: "CS",
        vm: "1",
    },
    DICOMRetrievalSequence: {
        tag: "0040E021",
        vr: "SQ",
        vm: "1",
    },
    DICOMMediaRetrievalSequence: {
        tag: "0040E022",
        vr: "SQ",
        vm: "1",
    },
    WADORetrievalSequence: {
        tag: "0040E023",
        vr: "SQ",
        vm: "1",
    },
    XDSRetrievalSequence: {
        tag: "0040E024",
        vr: "SQ",
        vm: "1",
    },
    WADORSRetrievalSequence: {
        tag: "0040E025",
        vr: "SQ",
        vm: "1",
    },
    RepositoryUniqueID: {
        tag: "0040E030",
        vr: "UI",
        vm: "1",
    },
    HomeCommunityID: {
        tag: "0040E031",
        vr: "UI",
        vm: "1",
    },
    DocumentTitle: {
        tag: "00420010",
        vr: "ST",
        vm: "1",
    },
    EncapsulatedDocument: {
        tag: "00420011",
        vr: "OB",
        vm: "1",
    },
    MIMETypeOfEncapsulatedDocument: {
        tag: "00420012",
        vr: "LO",
        vm: "1",
    },
    SourceInstanceSequence: {
        tag: "00420013",
        vr: "SQ",
        vm: "1",
    },
    ListOfMIMETypes: {
        tag: "00420014",
        vr: "LO",
        vm: "1-n",
    },
    EncapsulatedDocumentLength: {
        tag: "00420015",
        vr: "UL",
        vm: "1",
    },
    ProductPackageIdentifier: {
        tag: "00440001",
        vr: "ST",
        vm: "1",
    },
    SubstanceAdministrationApproval: {
        tag: "00440002",
        vr: "CS",
        vm: "1",
    },
    ApprovalStatusFurtherDescription: {
        tag: "00440003",
        vr: "LT",
        vm: "1",
    },
    ApprovalStatusDateTime: {
        tag: "00440004",
        vr: "DT",
        vm: "1",
    },
    ProductTypeCodeSequence: {
        tag: "00440007",
        vr: "SQ",
        vm: "1",
    },
    ProductName: {
        tag: "00440008",
        vr: "LO",
        vm: "1-n",
    },
    ProductDescription: {
        tag: "00440009",
        vr: "LT",
        vm: "1",
    },
    ProductLotIdentifier: {
        tag: "0044000A",
        vr: "LO",
        vm: "1",
    },
    ProductExpirationDateTime: {
        tag: "0044000B",
        vr: "DT",
        vm: "1",
    },
    SubstanceAdministrationDateTime: {
        tag: "00440010",
        vr: "DT",
        vm: "1",
    },
    SubstanceAdministrationNotes: {
        tag: "00440011",
        vr: "LO",
        vm: "1",
    },
    SubstanceAdministrationDeviceID: {
        tag: "00440012",
        vr: "LO",
        vm: "1",
    },
    ProductParameterSequence: {
        tag: "00440013",
        vr: "SQ",
        vm: "1",
    },
    SubstanceAdministrationParameterSequence: {
        tag: "00440019",
        vr: "SQ",
        vm: "1",
    },
    ApprovalSequence: {
        tag: "00440100",
        vr: "SQ",
        vm: "1",
    },
    AssertionCodeSequence: {
        tag: "00440101",
        vr: "SQ",
        vm: "1",
    },
    AssertionUID: {
        tag: "00440102",
        vr: "UI",
        vm: "1",
    },
    AsserterIdentificationSequence: {
        tag: "00440103",
        vr: "SQ",
        vm: "1",
    },
    AssertionDateTime: {
        tag: "00440104",
        vr: "DT",
        vm: "1",
    },
    AssertionExpirationDateTime: {
        tag: "00440105",
        vr: "DT",
        vm: "1",
    },
    AssertionComments: {
        tag: "00440106",
        vr: "UT",
        vm: "1",
    },
    RelatedAssertionSequence: {
        tag: "00440107",
        vr: "SQ",
        vm: "1",
    },
    ReferencedAssertionUID: {
        tag: "00440108",
        vr: "UI",
        vm: "1",
    },
    ApprovalSubjectSequence: {
        tag: "00440109",
        vr: "SQ",
        vm: "1",
    },
    OrganizationalRoleCodeSequence: {
        tag: "0044010A",
        vr: "SQ",
        vm: "1",
    },
    RTAssertionsSequence: {
        tag: "00440110",
        vr: "SQ",
        vm: "1",
    },
    LensDescription: {
        tag: "00460012",
        vr: "LO",
        vm: "1",
    },
    RightLensSequence: {
        tag: "00460014",
        vr: "SQ",
        vm: "1",
    },
    LeftLensSequence: {
        tag: "00460015",
        vr: "SQ",
        vm: "1",
    },
    UnspecifiedLateralityLensSequence: {
        tag: "00460016",
        vr: "SQ",
        vm: "1",
    },
    CylinderSequence: {
        tag: "00460018",
        vr: "SQ",
        vm: "1",
    },
    PrismSequence: {
        tag: "00460028",
        vr: "SQ",
        vm: "1",
    },
    HorizontalPrismPower: {
        tag: "00460030",
        vr: "FD",
        vm: "1",
    },
    HorizontalPrismBase: {
        tag: "00460032",
        vr: "CS",
        vm: "1",
    },
    VerticalPrismPower: {
        tag: "00460034",
        vr: "FD",
        vm: "1",
    },
    VerticalPrismBase: {
        tag: "00460036",
        vr: "CS",
        vm: "1",
    },
    LensSegmentType: {
        tag: "00460038",
        vr: "CS",
        vm: "1",
    },
    OpticalTransmittance: {
        tag: "00460040",
        vr: "FD",
        vm: "1",
    },
    ChannelWidth: {
        tag: "00460042",
        vr: "FD",
        vm: "1",
    },
    PupilSize: {
        tag: "00460044",
        vr: "FD",
        vm: "1",
    },
    CornealSize: {
        tag: "00460046",
        vr: "FD",
        vm: "1",
    },
    CornealSizeSequence: {
        tag: "00460047",
        vr: "SQ",
        vm: "1",
    },
    AutorefractionRightEyeSequence: {
        tag: "00460050",
        vr: "SQ",
        vm: "1",
    },
    AutorefractionLeftEyeSequence: {
        tag: "00460052",
        vr: "SQ",
        vm: "1",
    },
    DistancePupillaryDistance: {
        tag: "00460060",
        vr: "FD",
        vm: "1",
    },
    NearPupillaryDistance: {
        tag: "00460062",
        vr: "FD",
        vm: "1",
    },
    IntermediatePupillaryDistance: {
        tag: "00460063",
        vr: "FD",
        vm: "1",
    },
    OtherPupillaryDistance: {
        tag: "00460064",
        vr: "FD",
        vm: "1",
    },
    KeratometryRightEyeSequence: {
        tag: "00460070",
        vr: "SQ",
        vm: "1",
    },
    KeratometryLeftEyeSequence: {
        tag: "00460071",
        vr: "SQ",
        vm: "1",
    },
    SteepKeratometricAxisSequence: {
        tag: "00460074",
        vr: "SQ",
        vm: "1",
    },
    RadiusOfCurvature: {
        tag: "00460075",
        vr: "FD",
        vm: "1",
    },
    KeratometricPower: {
        tag: "00460076",
        vr: "FD",
        vm: "1",
    },
    KeratometricAxis: {
        tag: "00460077",
        vr: "FD",
        vm: "1",
    },
    FlatKeratometricAxisSequence: {
        tag: "00460080",
        vr: "SQ",
        vm: "1",
    },
    BackgroundColor: {
        tag: "00460092",
        vr: "CS",
        vm: "1",
    },
    Optotype: {
        tag: "00460094",
        vr: "CS",
        vm: "1",
    },
    OptotypePresentation: {
        tag: "00460095",
        vr: "CS",
        vm: "1",
    },
    SubjectiveRefractionRightEyeSequence: {
        tag: "00460097",
        vr: "SQ",
        vm: "1",
    },
    SubjectiveRefractionLeftEyeSequence: {
        tag: "00460098",
        vr: "SQ",
        vm: "1",
    },
    AddNearSequence: {
        tag: "00460100",
        vr: "SQ",
        vm: "1",
    },
    AddIntermediateSequence: {
        tag: "00460101",
        vr: "SQ",
        vm: "1",
    },
    AddOtherSequence: {
        tag: "00460102",
        vr: "SQ",
        vm: "1",
    },
    AddPower: {
        tag: "00460104",
        vr: "FD",
        vm: "1",
    },
    ViewingDistance: {
        tag: "00460106",
        vr: "FD",
        vm: "1",
    },
    CorneaMeasurementsSequence: {
        tag: "00460110",
        vr: "SQ",
        vm: "1",
    },
    SourceOfCorneaMeasurementDataCodeSequence: {
        tag: "00460111",
        vr: "SQ",
        vm: "1",
    },
    SteepCornealAxisSequence: {
        tag: "00460112",
        vr: "SQ",
        vm: "1",
    },
    FlatCornealAxisSequence: {
        tag: "00460113",
        vr: "SQ",
        vm: "1",
    },
    CornealPower: {
        tag: "00460114",
        vr: "FD",
        vm: "1",
    },
    CornealAxis: {
        tag: "00460115",
        vr: "FD",
        vm: "1",
    },
    CorneaMeasurementMethodCodeSequence: {
        tag: "00460116",
        vr: "SQ",
        vm: "1",
    },
    RefractiveIndexOfCornea: {
        tag: "00460117",
        vr: "FL",
        vm: "1",
    },
    RefractiveIndexOfAqueousHumor: {
        tag: "00460118",
        vr: "FL",
        vm: "1",
    },
    VisualAcuityTypeCodeSequence: {
        tag: "00460121",
        vr: "SQ",
        vm: "1",
    },
    VisualAcuityRightEyeSequence: {
        tag: "00460122",
        vr: "SQ",
        vm: "1",
    },
    VisualAcuityLeftEyeSequence: {
        tag: "00460123",
        vr: "SQ",
        vm: "1",
    },
    VisualAcuityBothEyesOpenSequence: {
        tag: "00460124",
        vr: "SQ",
        vm: "1",
    },
    ViewingDistanceType: {
        tag: "00460125",
        vr: "CS",
        vm: "1",
    },
    VisualAcuityModifiers: {
        tag: "00460135",
        vr: "SS",
        vm: "2",
    },
    DecimalVisualAcuity: {
        tag: "00460137",
        vr: "FD",
        vm: "1",
    },
    OptotypeDetailedDefinition: {
        tag: "00460139",
        vr: "LO",
        vm: "1",
    },
    ReferencedRefractiveMeasurementsSequence: {
        tag: "00460145",
        vr: "SQ",
        vm: "1",
    },
    SpherePower: {
        tag: "00460146",
        vr: "FD",
        vm: "1",
    },
    CylinderPower: {
        tag: "00460147",
        vr: "FD",
        vm: "1",
    },
    CornealTopographySurface: {
        tag: "00460201",
        vr: "CS",
        vm: "1",
    },
    CornealVertexLocation: {
        tag: "00460202",
        vr: "FL",
        vm: "2",
    },
    PupilCentroidXCoordinate: {
        tag: "00460203",
        vr: "FL",
        vm: "1",
    },
    PupilCentroidYCoordinate: {
        tag: "00460204",
        vr: "FL",
        vm: "1",
    },
    EquivalentPupilRadius: {
        tag: "00460205",
        vr: "FL",
        vm: "1",
    },
    CornealTopographyMapTypeCodeSequence: {
        tag: "00460207",
        vr: "SQ",
        vm: "1",
    },
    VerticesOfTheOutlineOfPupil: {
        tag: "00460208",
        vr: "IS",
        vm: "2-2n",
    },
    CornealTopographyMappingNormalsSequence: {
        tag: "00460210",
        vr: "SQ",
        vm: "1",
    },
    MaximumCornealCurvatureSequence: {
        tag: "00460211",
        vr: "SQ",
        vm: "1",
    },
    MaximumCornealCurvature: {
        tag: "00460212",
        vr: "FL",
        vm: "1",
    },
    MaximumCornealCurvatureLocation: {
        tag: "00460213",
        vr: "FL",
        vm: "2",
    },
    MinimumKeratometricSequence: {
        tag: "00460215",
        vr: "SQ",
        vm: "1",
    },
    SimulatedKeratometricCylinderSequence: {
        tag: "00460218",
        vr: "SQ",
        vm: "1",
    },
    AverageCornealPower: {
        tag: "00460220",
        vr: "FL",
        vm: "1",
    },
    CornealISValue: {
        tag: "00460224",
        vr: "FL",
        vm: "1",
    },
    AnalyzedArea: {
        tag: "00460227",
        vr: "FL",
        vm: "1",
    },
    SurfaceRegularityIndex: {
        tag: "00460230",
        vr: "FL",
        vm: "1",
    },
    SurfaceAsymmetryIndex: {
        tag: "00460232",
        vr: "FL",
        vm: "1",
    },
    CornealEccentricityIndex: {
        tag: "00460234",
        vr: "FL",
        vm: "1",
    },
    KeratoconusPredictionIndex: {
        tag: "00460236",
        vr: "FL",
        vm: "1",
    },
    DecimalPotentialVisualAcuity: {
        tag: "00460238",
        vr: "FL",
        vm: "1",
    },
    CornealTopographyMapQualityEvaluation: {
        tag: "00460242",
        vr: "CS",
        vm: "1",
    },
    SourceImageCornealProcessedDataSequence: {
        tag: "00460244",
        vr: "SQ",
        vm: "1",
    },
    CornealPointLocation: {
        tag: "00460247",
        vr: "FL",
        vm: "3",
    },
    CornealPointEstimated: {
        tag: "00460248",
        vr: "CS",
        vm: "1",
    },
    AxialPower: {
        tag: "00460249",
        vr: "FL",
        vm: "1",
    },
    TangentialPower: {
        tag: "00460250",
        vr: "FL",
        vm: "1",
    },
    RefractivePower: {
        tag: "00460251",
        vr: "FL",
        vm: "1",
    },
    RelativeElevation: {
        tag: "00460252",
        vr: "FL",
        vm: "1",
    },
    CornealWavefront: {
        tag: "00460253",
        vr: "FL",
        vm: "1",
    },
    ImagedVolumeWidth: {
        tag: "00480001",
        vr: "FL",
        vm: "1",
    },
    ImagedVolumeHeight: {
        tag: "00480002",
        vr: "FL",
        vm: "1",
    },
    ImagedVolumeDepth: {
        tag: "00480003",
        vr: "FL",
        vm: "1",
    },
    TotalPixelMatrixColumns: {
        tag: "00480006",
        vr: "UL",
        vm: "1",
    },
    TotalPixelMatrixRows: {
        tag: "00480007",
        vr: "UL",
        vm: "1",
    },
    TotalPixelMatrixOriginSequence: {
        tag: "00480008",
        vr: "SQ",
        vm: "1",
    },
    SpecimenLabelInImage: {
        tag: "00480010",
        vr: "CS",
        vm: "1",
    },
    FocusMethod: {
        tag: "00480011",
        vr: "CS",
        vm: "1",
    },
    ExtendedDepthOfField: {
        tag: "00480012",
        vr: "CS",
        vm: "1",
    },
    NumberOfFocalPlanes: {
        tag: "00480013",
        vr: "US",
        vm: "1",
    },
    DistanceBetweenFocalPlanes: {
        tag: "00480014",
        vr: "FL",
        vm: "1",
    },
    RecommendedAbsentPixelCIELabValue: {
        tag: "00480015",
        vr: "US",
        vm: "3",
    },
    IlluminatorTypeCodeSequence: {
        tag: "00480100",
        vr: "SQ",
        vm: "1",
    },
    ImageOrientationSlide: {
        tag: "00480102",
        vr: "DS",
        vm: "6",
    },
    OpticalPathSequence: {
        tag: "00480105",
        vr: "SQ",
        vm: "1",
    },
    OpticalPathIdentifier: {
        tag: "00480106",
        vr: "SH",
        vm: "1",
    },
    OpticalPathDescription: {
        tag: "00480107",
        vr: "ST",
        vm: "1",
    },
    IlluminationColorCodeSequence: {
        tag: "00480108",
        vr: "SQ",
        vm: "1",
    },
    SpecimenReferenceSequence: {
        tag: "00480110",
        vr: "SQ",
        vm: "1",
    },
    CondenserLensPower: {
        tag: "00480111",
        vr: "DS",
        vm: "1",
    },
    ObjectiveLensPower: {
        tag: "00480112",
        vr: "DS",
        vm: "1",
    },
    ObjectiveLensNumericalAperture: {
        tag: "00480113",
        vr: "DS",
        vm: "1",
    },
    ConfocalMode: {
        tag: "00480114",
        vr: "CS",
        vm: "1",
    },
    TissueLocation: {
        tag: "00480115",
        vr: "CS",
        vm: "1",
    },
    ConfocalMicroscopyImageFrameTypeSequence: {
        tag: "00480116",
        vr: "SQ",
        vm: "1",
    },
    ImageAcquisitionDepth: {
        tag: "00480117",
        vr: "FD",
        vm: "1",
    },
    PaletteColorLookupTableSequence: {
        tag: "00480120",
        vr: "SQ",
        vm: "1",
    },
    ReferencedImageNavigationSequence: {
        tag: "00480200",
        vr: "SQ",
        vm: "1",
    },
    TopLeftHandCornerOfLocalizerArea: {
        tag: "00480201",
        vr: "US",
        vm: "2",
    },
    BottomRightHandCornerOfLocalizerArea: {
        tag: "00480202",
        vr: "US",
        vm: "2",
    },
    OpticalPathIdentificationSequence: {
        tag: "00480207",
        vr: "SQ",
        vm: "1",
    },
    PlanePositionSlideSequence: {
        tag: "0048021A",
        vr: "SQ",
        vm: "1",
    },
    ColumnPositionInTotalImagePixelMatrix: {
        tag: "0048021E",
        vr: "SL",
        vm: "1",
    },
    RowPositionInTotalImagePixelMatrix: {
        tag: "0048021F",
        vr: "SL",
        vm: "1",
    },
    PixelOriginInterpretation: {
        tag: "00480301",
        vr: "CS",
        vm: "1",
    },
    NumberOfOpticalPaths: {
        tag: "00480302",
        vr: "UL",
        vm: "1",
    },
    TotalPixelMatrixFocalPlanes: {
        tag: "00480303",
        vr: "UL",
        vm: "1",
    },
    TilesOverlap: {
        tag: "00480304",
        vr: "CS",
        vm: "1",
    },
    CalibrationImage: {
        tag: "00500004",
        vr: "CS",
        vm: "1",
    },
    DeviceSequence: {
        tag: "00500010",
        vr: "SQ",
        vm: "1",
    },
    ContainerComponentTypeCodeSequence: {
        tag: "00500012",
        vr: "SQ",
        vm: "1",
    },
    ContainerComponentThickness: {
        tag: "00500013",
        vr: "FD",
        vm: "1",
    },
    DeviceLength: {
        tag: "00500014",
        vr: "DS",
        vm: "1",
    },
    ContainerComponentWidth: {
        tag: "00500015",
        vr: "FD",
        vm: "1",
    },
    DeviceDiameter: {
        tag: "00500016",
        vr: "DS",
        vm: "1",
    },
    DeviceDiameterUnits: {
        tag: "00500017",
        vr: "CS",
        vm: "1",
    },
    DeviceVolume: {
        tag: "00500018",
        vr: "DS",
        vm: "1",
    },
    InterMarkerDistance: {
        tag: "00500019",
        vr: "DS",
        vm: "1",
    },
    ContainerComponentMaterial: {
        tag: "0050001A",
        vr: "CS",
        vm: "1",
    },
    ContainerComponentID: {
        tag: "0050001B",
        vr: "LO",
        vm: "1",
    },
    ContainerComponentLength: {
        tag: "0050001C",
        vr: "FD",
        vm: "1",
    },
    ContainerComponentDiameter: {
        tag: "0050001D",
        vr: "FD",
        vm: "1",
    },
    ContainerComponentDescription: {
        tag: "0050001E",
        vr: "LO",
        vm: "1",
    },
    DeviceDescription: {
        tag: "00500020",
        vr: "LO",
        vm: "1",
    },
    LongDeviceDescription: {
        tag: "00500021",
        vr: "ST",
        vm: "1",
    },
    ContrastBolusIngredientPercentByVolume: {
        tag: "00520001",
        vr: "FL",
        vm: "1",
    },
    OCTFocalDistance: {
        tag: "00520002",
        vr: "FD",
        vm: "1",
    },
    BeamSpotSize: {
        tag: "00520003",
        vr: "FD",
        vm: "1",
    },
    EffectiveRefractiveIndex: {
        tag: "00520004",
        vr: "FD",
        vm: "1",
    },
    OCTAcquisitionDomain: {
        tag: "00520006",
        vr: "CS",
        vm: "1",
    },
    OCTOpticalCenterWavelength: {
        tag: "00520007",
        vr: "FD",
        vm: "1",
    },
    AxialResolution: {
        tag: "00520008",
        vr: "FD",
        vm: "1",
    },
    RangingDepth: {
        tag: "00520009",
        vr: "FD",
        vm: "1",
    },
    ALineRate: {
        tag: "00520011",
        vr: "FD",
        vm: "1",
    },
    ALinesPerFrame: {
        tag: "00520012",
        vr: "US",
        vm: "1",
    },
    CatheterRotationalRate: {
        tag: "00520013",
        vr: "FD",
        vm: "1",
    },
    ALinePixelSpacing: {
        tag: "00520014",
        vr: "FD",
        vm: "1",
    },
    ModeOfPercutaneousAccessSequence: {
        tag: "00520016",
        vr: "SQ",
        vm: "1",
    },
    IntravascularOCTFrameTypeSequence: {
        tag: "00520025",
        vr: "SQ",
        vm: "1",
    },
    OCTZOffsetApplied: {
        tag: "00520026",
        vr: "CS",
        vm: "1",
    },
    IntravascularFrameContentSequence: {
        tag: "00520027",
        vr: "SQ",
        vm: "1",
    },
    IntravascularLongitudinalDistance: {
        tag: "00520028",
        vr: "FD",
        vm: "1",
    },
    IntravascularOCTFrameContentSequence: {
        tag: "00520029",
        vr: "SQ",
        vm: "1",
    },
    OCTZOffsetCorrection: {
        tag: "00520030",
        vr: "SS",
        vm: "1",
    },
    CatheterDirectionOfRotation: {
        tag: "00520031",
        vr: "CS",
        vm: "1",
    },
    SeamLineLocation: {
        tag: "00520033",
        vr: "FD",
        vm: "1",
    },
    FirstALineLocation: {
        tag: "00520034",
        vr: "FD",
        vm: "1",
    },
    SeamLineIndex: {
        tag: "00520036",
        vr: "US",
        vm: "1",
    },
    NumberOfPaddedALines: {
        tag: "00520038",
        vr: "US",
        vm: "1",
    },
    InterpolationType: {
        tag: "00520039",
        vr: "CS",
        vm: "1",
    },
    RefractiveIndexApplied: {
        tag: "0052003A",
        vr: "CS",
        vm: "1",
    },
    EnergyWindowVector: {
        tag: "00540010",
        vr: "US",
        vm: "1-n",
    },
    NumberOfEnergyWindows: {
        tag: "00540011",
        vr: "US",
        vm: "1",
    },
    EnergyWindowInformationSequence: {
        tag: "00540012",
        vr: "SQ",
        vm: "1",
    },
    EnergyWindowRangeSequence: {
        tag: "00540013",
        vr: "SQ",
        vm: "1",
    },
    EnergyWindowLowerLimit: {
        tag: "00540014",
        vr: "DS",
        vm: "1",
    },
    EnergyWindowUpperLimit: {
        tag: "00540015",
        vr: "DS",
        vm: "1",
    },
    RadiopharmaceuticalInformationSequence: {
        tag: "00540016",
        vr: "SQ",
        vm: "1",
    },
    ResidualSyringeCounts: {
        tag: "00540017",
        vr: "IS",
        vm: "1",
    },
    EnergyWindowName: {
        tag: "00540018",
        vr: "SH",
        vm: "1",
    },
    DetectorVector: {
        tag: "00540020",
        vr: "US",
        vm: "1-n",
    },
    NumberOfDetectors: {
        tag: "00540021",
        vr: "US",
        vm: "1",
    },
    DetectorInformationSequence: {
        tag: "00540022",
        vr: "SQ",
        vm: "1",
    },
    PhaseVector: {
        tag: "00540030",
        vr: "US",
        vm: "1-n",
    },
    NumberOfPhases: {
        tag: "00540031",
        vr: "US",
        vm: "1",
    },
    PhaseInformationSequence: {
        tag: "00540032",
        vr: "SQ",
        vm: "1",
    },
    NumberOfFramesInPhase: {
        tag: "00540033",
        vr: "US",
        vm: "1",
    },
    PhaseDelay: {
        tag: "00540036",
        vr: "IS",
        vm: "1",
    },
    PauseBetweenFrames: {
        tag: "00540038",
        vr: "IS",
        vm: "1",
    },
    PhaseDescription: {
        tag: "00540039",
        vr: "CS",
        vm: "1",
    },
    RotationVector: {
        tag: "00540050",
        vr: "US",
        vm: "1-n",
    },
    NumberOfRotations: {
        tag: "00540051",
        vr: "US",
        vm: "1",
    },
    RotationInformationSequence: {
        tag: "00540052",
        vr: "SQ",
        vm: "1",
    },
    NumberOfFramesInRotation: {
        tag: "00540053",
        vr: "US",
        vm: "1",
    },
    RRIntervalVector: {
        tag: "00540060",
        vr: "US",
        vm: "1-n",
    },
    NumberOfRRIntervals: {
        tag: "00540061",
        vr: "US",
        vm: "1",
    },
    GatedInformationSequence: {
        tag: "00540062",
        vr: "SQ",
        vm: "1",
    },
    DataInformationSequence: {
        tag: "00540063",
        vr: "SQ",
        vm: "1",
    },
    TimeSlotVector: {
        tag: "00540070",
        vr: "US",
        vm: "1-n",
    },
    NumberOfTimeSlots: {
        tag: "00540071",
        vr: "US",
        vm: "1",
    },
    TimeSlotInformationSequence: {
        tag: "00540072",
        vr: "SQ",
        vm: "1",
    },
    TimeSlotTime: {
        tag: "00540073",
        vr: "DS",
        vm: "1",
    },
    SliceVector: {
        tag: "00540080",
        vr: "US",
        vm: "1-n",
    },
    NumberOfSlices: {
        tag: "00540081",
        vr: "US",
        vm: "1",
    },
    AngularViewVector: {
        tag: "00540090",
        vr: "US",
        vm: "1-n",
    },
    TimeSliceVector: {
        tag: "00540100",
        vr: "US",
        vm: "1-n",
    },
    NumberOfTimeSlices: {
        tag: "00540101",
        vr: "US",
        vm: "1",
    },
    StartAngle: {
        tag: "00540200",
        vr: "DS",
        vm: "1",
    },
    TypeOfDetectorMotion: {
        tag: "00540202",
        vr: "CS",
        vm: "1",
    },
    TriggerVector: {
        tag: "00540210",
        vr: "IS",
        vm: "1-n",
    },
    NumberOfTriggersInPhase: {
        tag: "00540211",
        vr: "US",
        vm: "1",
    },
    ViewCodeSequence: {
        tag: "00540220",
        vr: "SQ",
        vm: "1",
    },
    ViewModifierCodeSequence: {
        tag: "00540222",
        vr: "SQ",
        vm: "1",
    },
    RadionuclideCodeSequence: {
        tag: "00540300",
        vr: "SQ",
        vm: "1",
    },
    AdministrationRouteCodeSequence: {
        tag: "00540302",
        vr: "SQ",
        vm: "1",
    },
    RadiopharmaceuticalCodeSequence: {
        tag: "00540304",
        vr: "SQ",
        vm: "1",
    },
    CalibrationDataSequence: {
        tag: "00540306",
        vr: "SQ",
        vm: "1",
    },
    EnergyWindowNumber: {
        tag: "00540308",
        vr: "US",
        vm: "1",
    },
    ImageID: {
        tag: "00540400",
        vr: "SH",
        vm: "1",
    },
    PatientOrientationCodeSequence: {
        tag: "00540410",
        vr: "SQ",
        vm: "1",
    },
    PatientOrientationModifierCodeSequence: {
        tag: "00540412",
        vr: "SQ",
        vm: "1",
    },
    PatientGantryRelationshipCodeSequence: {
        tag: "00540414",
        vr: "SQ",
        vm: "1",
    },
    SliceProgressionDirection: {
        tag: "00540500",
        vr: "CS",
        vm: "1",
    },
    ScanProgressionDirection: {
        tag: "00540501",
        vr: "CS",
        vm: "1",
    },
    SeriesType: {
        tag: "00541000",
        vr: "CS",
        vm: "2",
    },
    Units: {
        tag: "00541001",
        vr: "CS",
        vm: "1",
    },
    CountsSource: {
        tag: "00541002",
        vr: "CS",
        vm: "1",
    },
    ReprojectionMethod: {
        tag: "00541004",
        vr: "CS",
        vm: "1",
    },
    SUVType: {
        tag: "00541006",
        vr: "CS",
        vm: "1",
    },
    RandomsCorrectionMethod: {
        tag: "00541100",
        vr: "CS",
        vm: "1",
    },
    AttenuationCorrectionMethod: {
        tag: "00541101",
        vr: "LO",
        vm: "1",
    },
    DecayCorrection: {
        tag: "00541102",
        vr: "CS",
        vm: "1",
    },
    ReconstructionMethod: {
        tag: "00541103",
        vr: "LO",
        vm: "1",
    },
    DetectorLinesOfResponseUsed: {
        tag: "00541104",
        vr: "LO",
        vm: "1",
    },
    ScatterCorrectionMethod: {
        tag: "00541105",
        vr: "LO",
        vm: "1",
    },
    AxialAcceptance: {
        tag: "00541200",
        vr: "DS",
        vm: "1",
    },
    AxialMash: {
        tag: "00541201",
        vr: "IS",
        vm: "2",
    },
    TransverseMash: {
        tag: "00541202",
        vr: "IS",
        vm: "1",
    },
    DetectorElementSize: {
        tag: "00541203",
        vr: "DS",
        vm: "2",
    },
    CoincidenceWindowWidth: {
        tag: "00541210",
        vr: "DS",
        vm: "1",
    },
    SecondaryCountsType: {
        tag: "00541220",
        vr: "CS",
        vm: "1-n",
    },
    FrameReferenceTime: {
        tag: "00541300",
        vr: "DS",
        vm: "1",
    },
    PrimaryPromptsCountsAccumulated: {
        tag: "00541310",
        vr: "IS",
        vm: "1",
    },
    SecondaryCountsAccumulated: {
        tag: "00541311",
        vr: "IS",
        vm: "1-n",
    },
    SliceSensitivityFactor: {
        tag: "00541320",
        vr: "DS",
        vm: "1",
    },
    DecayFactor: {
        tag: "00541321",
        vr: "DS",
        vm: "1",
    },
    DoseCalibrationFactor: {
        tag: "00541322",
        vr: "DS",
        vm: "1",
    },
    ScatterFractionFactor: {
        tag: "00541323",
        vr: "DS",
        vm: "1",
    },
    DeadTimeFactor: {
        tag: "00541324",
        vr: "DS",
        vm: "1",
    },
    ImageIndex: {
        tag: "00541330",
        vr: "US",
        vm: "1",
    },
    CountsIncluded: {
        tag: "00541400",
        vr: "CS",
        vm: "1-n",
    },
    DeadTimeCorrectionFlag: {
        tag: "00541401",
        vr: "CS",
        vm: "1",
    },
    HistogramSequence: {
        tag: "00603000",
        vr: "SQ",
        vm: "1",
    },
    HistogramNumberOfBins: {
        tag: "00603002",
        vr: "US",
        vm: "1",
    },
    HistogramFirstBinValue: {
        tag: "00603004",
        vr: "US or SS",
        vm: "1",
    },
    HistogramLastBinValue: {
        tag: "00603006",
        vr: "US or SS",
        vm: "1",
    },
    HistogramBinWidth: {
        tag: "00603008",
        vr: "US",
        vm: "1",
    },
    HistogramExplanation: {
        tag: "00603010",
        vr: "LO",
        vm: "1",
    },
    HistogramData: {
        tag: "00603020",
        vr: "UL",
        vm: "1-n",
    },
    SegmentationType: {
        tag: "00620001",
        vr: "CS",
        vm: "1",
    },
    SegmentSequence: {
        tag: "00620002",
        vr: "SQ",
        vm: "1",
    },
    SegmentedPropertyCategoryCodeSequence: {
        tag: "00620003",
        vr: "SQ",
        vm: "1",
    },
    SegmentNumber: {
        tag: "00620004",
        vr: "US",
        vm: "1",
    },
    SegmentLabel: {
        tag: "00620005",
        vr: "LO",
        vm: "1",
    },
    SegmentDescription: {
        tag: "00620006",
        vr: "ST",
        vm: "1",
    },
    SegmentationAlgorithmIdentificationSequence: {
        tag: "00620007",
        vr: "SQ",
        vm: "1",
    },
    SegmentAlgorithmType: {
        tag: "00620008",
        vr: "CS",
        vm: "1",
    },
    SegmentAlgorithmName: {
        tag: "00620009",
        vr: "LO",
        vm: "1-n",
    },
    SegmentIdentificationSequence: {
        tag: "0062000A",
        vr: "SQ",
        vm: "1",
    },
    ReferencedSegmentNumber: {
        tag: "0062000B",
        vr: "US",
        vm: "1-n",
    },
    RecommendedDisplayGrayscaleValue: {
        tag: "0062000C",
        vr: "US",
        vm: "1",
    },
    RecommendedDisplayCIELabValue: {
        tag: "0062000D",
        vr: "US",
        vm: "3",
    },
    MaximumFractionalValue: {
        tag: "0062000E",
        vr: "US",
        vm: "1",
    },
    SegmentedPropertyTypeCodeSequence: {
        tag: "0062000F",
        vr: "SQ",
        vm: "1",
    },
    SegmentationFractionalType: {
        tag: "00620010",
        vr: "CS",
        vm: "1",
    },
    SegmentedPropertyTypeModifierCodeSequence: {
        tag: "00620011",
        vr: "SQ",
        vm: "1",
    },
    UsedSegmentsSequence: {
        tag: "00620012",
        vr: "SQ",
        vm: "1",
    },
    SegmentsOverlap: {
        tag: "00620013",
        vr: "CS",
        vm: "1",
    },
    TrackingID: {
        tag: "00620020",
        vr: "UT",
        vm: "1",
    },
    TrackingUID: {
        tag: "00620021",
        vr: "UI",
        vm: "1",
    },
    DeformableRegistrationSequence: {
        tag: "00640002",
        vr: "SQ",
        vm: "1",
    },
    SourceFrameOfReferenceUID: {
        tag: "00640003",
        vr: "UI",
        vm: "1",
    },
    DeformableRegistrationGridSequence: {
        tag: "00640005",
        vr: "SQ",
        vm: "1",
    },
    GridDimensions: {
        tag: "00640007",
        vr: "UL",
        vm: "3",
    },
    GridResolution: {
        tag: "00640008",
        vr: "FD",
        vm: "3",
    },
    VectorGridData: {
        tag: "00640009",
        vr: "OF",
        vm: "1",
    },
    PreDeformationMatrixRegistrationSequence: {
        tag: "0064000F",
        vr: "SQ",
        vm: "1",
    },
    PostDeformationMatrixRegistrationSequence: {
        tag: "00640010",
        vr: "SQ",
        vm: "1",
    },
    NumberOfSurfaces: {
        tag: "00660001",
        vr: "UL",
        vm: "1",
    },
    SurfaceSequence: {
        tag: "00660002",
        vr: "SQ",
        vm: "1",
    },
    SurfaceNumber: {
        tag: "00660003",
        vr: "UL",
        vm: "1",
    },
    SurfaceComments: {
        tag: "00660004",
        vr: "LT",
        vm: "1",
    },
    SurfaceOffset: {
        tag: "00660005",
        vr: "FL",
        vm: "1",
    },
    SurfaceProcessing: {
        tag: "00660009",
        vr: "CS",
        vm: "1",
    },
    SurfaceProcessingRatio: {
        tag: "0066000A",
        vr: "FL",
        vm: "1",
    },
    SurfaceProcessingDescription: {
        tag: "0066000B",
        vr: "LO",
        vm: "1",
    },
    RecommendedPresentationOpacity: {
        tag: "0066000C",
        vr: "FL",
        vm: "1",
    },
    RecommendedPresentationType: {
        tag: "0066000D",
        vr: "CS",
        vm: "1",
    },
    FiniteVolume: {
        tag: "0066000E",
        vr: "CS",
        vm: "1",
    },
    Manifold: {
        tag: "00660010",
        vr: "CS",
        vm: "1",
    },
    SurfacePointsSequence: {
        tag: "00660011",
        vr: "SQ",
        vm: "1",
    },
    SurfacePointsNormalsSequence: {
        tag: "00660012",
        vr: "SQ",
        vm: "1",
    },
    SurfaceMeshPrimitivesSequence: {
        tag: "00660013",
        vr: "SQ",
        vm: "1",
    },
    NumberOfSurfacePoints: {
        tag: "00660015",
        vr: "UL",
        vm: "1",
    },
    PointCoordinatesData: {
        tag: "00660016",
        vr: "OF",
        vm: "1",
    },
    PointPositionAccuracy: {
        tag: "00660017",
        vr: "FL",
        vm: "3",
    },
    MeanPointDistance: {
        tag: "00660018",
        vr: "FL",
        vm: "1",
    },
    MaximumPointDistance: {
        tag: "00660019",
        vr: "FL",
        vm: "1",
    },
    PointsBoundingBoxCoordinates: {
        tag: "0066001A",
        vr: "FL",
        vm: "6",
    },
    AxisOfRotation: {
        tag: "0066001B",
        vr: "FL",
        vm: "3",
    },
    CenterOfRotation: {
        tag: "0066001C",
        vr: "FL",
        vm: "3",
    },
    NumberOfVectors: {
        tag: "0066001E",
        vr: "UL",
        vm: "1",
    },
    VectorDimensionality: {
        tag: "0066001F",
        vr: "US",
        vm: "1",
    },
    VectorAccuracy: {
        tag: "00660020",
        vr: "FL",
        vm: "1-n",
    },
    VectorCoordinateData: {
        tag: "00660021",
        vr: "OF",
        vm: "1",
    },
    DoublePointCoordinatesData: {
        tag: "00660022",
        vr: "OD",
        vm: "1",
    },
    TrianglePointIndexList: {
        tag: "00660023",
        vr: "OW",
        vm: "1",
    },
    EdgePointIndexList: {
        tag: "00660024",
        vr: "OW",
        vm: "1",
    },
    VertexPointIndexList: {
        tag: "00660025",
        vr: "OW",
        vm: "1",
    },
    TriangleStripSequence: {
        tag: "00660026",
        vr: "SQ",
        vm: "1",
    },
    TriangleFanSequence: {
        tag: "00660027",
        vr: "SQ",
        vm: "1",
    },
    LineSequence: {
        tag: "00660028",
        vr: "SQ",
        vm: "1",
    },
    PrimitivePointIndexList: {
        tag: "00660029",
        vr: "OW",
        vm: "1",
    },
    SurfaceCount: {
        tag: "0066002A",
        vr: "UL",
        vm: "1",
    },
    ReferencedSurfaceSequence: {
        tag: "0066002B",
        vr: "SQ",
        vm: "1",
    },
    ReferencedSurfaceNumber: {
        tag: "0066002C",
        vr: "UL",
        vm: "1",
    },
    SegmentSurfaceGenerationAlgorithmIdentificationSequence: {
        tag: "0066002D",
        vr: "SQ",
        vm: "1",
    },
    SegmentSurfaceSourceInstanceSequence: {
        tag: "0066002E",
        vr: "SQ",
        vm: "1",
    },
    AlgorithmFamilyCodeSequence: {
        tag: "0066002F",
        vr: "SQ",
        vm: "1",
    },
    AlgorithmNameCodeSequence: {
        tag: "00660030",
        vr: "SQ",
        vm: "1",
    },
    AlgorithmVersion: {
        tag: "00660031",
        vr: "LO",
        vm: "1",
    },
    AlgorithmParameters: {
        tag: "00660032",
        vr: "LT",
        vm: "1",
    },
    FacetSequence: {
        tag: "00660034",
        vr: "SQ",
        vm: "1",
    },
    SurfaceProcessingAlgorithmIdentificationSequence: {
        tag: "00660035",
        vr: "SQ",
        vm: "1",
    },
    AlgorithmName: {
        tag: "00660036",
        vr: "LO",
        vm: "1",
    },
    RecommendedPointRadius: {
        tag: "00660037",
        vr: "FL",
        vm: "1",
    },
    RecommendedLineThickness: {
        tag: "00660038",
        vr: "FL",
        vm: "1",
    },
    LongPrimitivePointIndexList: {
        tag: "00660040",
        vr: "OL",
        vm: "1",
    },
    LongTrianglePointIndexList: {
        tag: "00660041",
        vr: "OL",
        vm: "1",
    },
    LongEdgePointIndexList: {
        tag: "00660042",
        vr: "OL",
        vm: "1",
    },
    LongVertexPointIndexList: {
        tag: "00660043",
        vr: "OL",
        vm: "1",
    },
    TrackSetSequence: {
        tag: "00660101",
        vr: "SQ",
        vm: "1",
    },
    TrackSequence: {
        tag: "00660102",
        vr: "SQ",
        vm: "1",
    },
    RecommendedDisplayCIELabValueList: {
        tag: "00660103",
        vr: "OW",
        vm: "1",
    },
    TrackingAlgorithmIdentificationSequence: {
        tag: "00660104",
        vr: "SQ",
        vm: "1",
    },
    TrackSetNumber: {
        tag: "00660105",
        vr: "UL",
        vm: "1",
    },
    TrackSetLabel: {
        tag: "00660106",
        vr: "LO",
        vm: "1",
    },
    TrackSetDescription: {
        tag: "00660107",
        vr: "UT",
        vm: "1",
    },
    TrackSetAnatomicalTypeCodeSequence: {
        tag: "00660108",
        vr: "SQ",
        vm: "1",
    },
    MeasurementsSequence: {
        tag: "00660121",
        vr: "SQ",
        vm: "1",
    },
    TrackSetStatisticsSequence: {
        tag: "00660124",
        vr: "SQ",
        vm: "1",
    },
    FloatingPointValues: {
        tag: "00660125",
        vr: "OF",
        vm: "1",
    },
    TrackPointIndexList: {
        tag: "00660129",
        vr: "OL",
        vm: "1",
    },
    TrackStatisticsSequence: {
        tag: "00660130",
        vr: "SQ",
        vm: "1",
    },
    MeasurementValuesSequence: {
        tag: "00660132",
        vr: "SQ",
        vm: "1",
    },
    DiffusionAcquisitionCodeSequence: {
        tag: "00660133",
        vr: "SQ",
        vm: "1",
    },
    DiffusionModelCodeSequence: {
        tag: "00660134",
        vr: "SQ",
        vm: "1",
    },
    ImplantSize: {
        tag: "00686210",
        vr: "LO",
        vm: "1",
    },
    ImplantTemplateVersion: {
        tag: "00686221",
        vr: "LO",
        vm: "1",
    },
    ReplacedImplantTemplateSequence: {
        tag: "00686222",
        vr: "SQ",
        vm: "1",
    },
    ImplantType: {
        tag: "00686223",
        vr: "CS",
        vm: "1",
    },
    DerivationImplantTemplateSequence: {
        tag: "00686224",
        vr: "SQ",
        vm: "1",
    },
    OriginalImplantTemplateSequence: {
        tag: "00686225",
        vr: "SQ",
        vm: "1",
    },
    EffectiveDateTime: {
        tag: "00686226",
        vr: "DT",
        vm: "1",
    },
    ImplantTargetAnatomySequence: {
        tag: "00686230",
        vr: "SQ",
        vm: "1",
    },
    InformationFromManufacturerSequence: {
        tag: "00686260",
        vr: "SQ",
        vm: "1",
    },
    NotificationFromManufacturerSequence: {
        tag: "00686265",
        vr: "SQ",
        vm: "1",
    },
    InformationIssueDateTime: {
        tag: "00686270",
        vr: "DT",
        vm: "1",
    },
    InformationSummary: {
        tag: "00686280",
        vr: "ST",
        vm: "1",
    },
    ImplantRegulatoryDisapprovalCodeSequence: {
        tag: "006862A0",
        vr: "SQ",
        vm: "1",
    },
    OverallTemplateSpatialTolerance: {
        tag: "006862A5",
        vr: "FD",
        vm: "1",
    },
    HPGLDocumentSequence: {
        tag: "006862C0",
        vr: "SQ",
        vm: "1",
    },
    HPGLDocumentID: {
        tag: "006862D0",
        vr: "US",
        vm: "1",
    },
    HPGLDocumentLabel: {
        tag: "006862D5",
        vr: "LO",
        vm: "1",
    },
    ViewOrientationCodeSequence: {
        tag: "006862E0",
        vr: "SQ",
        vm: "1",
    },
    ViewOrientationModifierCodeSequence: {
        tag: "006862F0",
        vr: "SQ",
        vm: "1",
    },
    HPGLDocumentScaling: {
        tag: "006862F2",
        vr: "FD",
        vm: "1",
    },
    HPGLDocument: {
        tag: "00686300",
        vr: "OB",
        vm: "1",
    },
    HPGLContourPenNumber: {
        tag: "00686310",
        vr: "US",
        vm: "1",
    },
    HPGLPenSequence: {
        tag: "00686320",
        vr: "SQ",
        vm: "1",
    },
    HPGLPenNumber: {
        tag: "00686330",
        vr: "US",
        vm: "1",
    },
    HPGLPenLabel: {
        tag: "00686340",
        vr: "LO",
        vm: "1",
    },
    HPGLPenDescription: {
        tag: "00686345",
        vr: "ST",
        vm: "1",
    },
    RecommendedRotationPoint: {
        tag: "00686346",
        vr: "FD",
        vm: "2",
    },
    BoundingRectangle: {
        tag: "00686347",
        vr: "FD",
        vm: "4",
    },
    ImplantTemplate3DModelSurfaceNumber: {
        tag: "00686350",
        vr: "US",
        vm: "1-n",
    },
    SurfaceModelDescriptionSequence: {
        tag: "00686360",
        vr: "SQ",
        vm: "1",
    },
    SurfaceModelLabel: {
        tag: "00686380",
        vr: "LO",
        vm: "1",
    },
    SurfaceModelScalingFactor: {
        tag: "00686390",
        vr: "FD",
        vm: "1",
    },
    MaterialsCodeSequence: {
        tag: "006863A0",
        vr: "SQ",
        vm: "1",
    },
    CoatingMaterialsCodeSequence: {
        tag: "006863A4",
        vr: "SQ",
        vm: "1",
    },
    ImplantTypeCodeSequence: {
        tag: "006863A8",
        vr: "SQ",
        vm: "1",
    },
    FixationMethodCodeSequence: {
        tag: "006863AC",
        vr: "SQ",
        vm: "1",
    },
    MatingFeatureSetsSequence: {
        tag: "006863B0",
        vr: "SQ",
        vm: "1",
    },
    MatingFeatureSetID: {
        tag: "006863C0",
        vr: "US",
        vm: "1",
    },
    MatingFeatureSetLabel: {
        tag: "006863D0",
        vr: "LO",
        vm: "1",
    },
    MatingFeatureSequence: {
        tag: "006863E0",
        vr: "SQ",
        vm: "1",
    },
    MatingFeatureID: {
        tag: "006863F0",
        vr: "US",
        vm: "1",
    },
    MatingFeatureDegreeOfFreedomSequence: {
        tag: "00686400",
        vr: "SQ",
        vm: "1",
    },
    DegreeOfFreedomID: {
        tag: "00686410",
        vr: "US",
        vm: "1",
    },
    DegreeOfFreedomType: {
        tag: "00686420",
        vr: "CS",
        vm: "1",
    },
    TwoDMatingFeatureCoordinatesSequence: {
        tag: "00686430",
        vr: "SQ",
        vm: "1",
    },
    ReferencedHPGLDocumentID: {
        tag: "00686440",
        vr: "US",
        vm: "1",
    },
    TwoDMatingPoint: {
        tag: "00686450",
        vr: "FD",
        vm: "2",
    },
    TwoDMatingAxes: {
        tag: "00686460",
        vr: "FD",
        vm: "4",
    },
    TwoDDegreeOfFreedomSequence: {
        tag: "00686470",
        vr: "SQ",
        vm: "1",
    },
    ThreeDDegreeOfFreedomAxis: {
        tag: "00686490",
        vr: "FD",
        vm: "3",
    },
    RangeOfFreedom: {
        tag: "006864A0",
        vr: "FD",
        vm: "2",
    },
    ThreeDMatingPoint: {
        tag: "006864C0",
        vr: "FD",
        vm: "3",
    },
    ThreeDMatingAxes: {
        tag: "006864D0",
        vr: "FD",
        vm: "9",
    },
    TwoDDegreeOfFreedomAxis: {
        tag: "006864F0",
        vr: "FD",
        vm: "3",
    },
    PlanningLandmarkPointSequence: {
        tag: "00686500",
        vr: "SQ",
        vm: "1",
    },
    PlanningLandmarkLineSequence: {
        tag: "00686510",
        vr: "SQ",
        vm: "1",
    },
    PlanningLandmarkPlaneSequence: {
        tag: "00686520",
        vr: "SQ",
        vm: "1",
    },
    PlanningLandmarkID: {
        tag: "00686530",
        vr: "US",
        vm: "1",
    },
    PlanningLandmarkDescription: {
        tag: "00686540",
        vr: "LO",
        vm: "1",
    },
    PlanningLandmarkIdentificationCodeSequence: {
        tag: "00686545",
        vr: "SQ",
        vm: "1",
    },
    TwoDPointCoordinatesSequence: {
        tag: "00686550",
        vr: "SQ",
        vm: "1",
    },
    TwoDPointCoordinates: {
        tag: "00686560",
        vr: "FD",
        vm: "2",
    },
    ThreeDPointCoordinates: {
        tag: "00686590",
        vr: "FD",
        vm: "3",
    },
    TwoDLineCoordinatesSequence: {
        tag: "006865A0",
        vr: "SQ",
        vm: "1",
    },
    TwoDLineCoordinates: {
        tag: "006865B0",
        vr: "FD",
        vm: "4",
    },
    ThreeDLineCoordinates: {
        tag: "006865D0",
        vr: "FD",
        vm: "6",
    },
    TwoDPlaneCoordinatesSequence: {
        tag: "006865E0",
        vr: "SQ",
        vm: "1",
    },
    TwoDPlaneIntersection: {
        tag: "006865F0",
        vr: "FD",
        vm: "4",
    },
    ThreeDPlaneOrigin: {
        tag: "00686610",
        vr: "FD",
        vm: "3",
    },
    ThreeDPlaneNormal: {
        tag: "00686620",
        vr: "FD",
        vm: "3",
    },
    ModelModification: {
        tag: "00687001",
        vr: "CS",
        vm: "1",
    },
    ModelMirroring: {
        tag: "00687002",
        vr: "CS",
        vm: "1",
    },
    ModelUsageCodeSequence: {
        tag: "00687003",
        vr: "SQ",
        vm: "1",
    },
    ModelGroupUID: {
        tag: "00687004",
        vr: "UI",
        vm: "1",
    },
    RelativeURIReferenceWithinEncapsulatedDocument: {
        tag: "00687005",
        vr: "UR",
        vm: "1",
    },
    AnnotationCoordinateType: {
        tag: "006A0001",
        vr: "CS",
        vm: "1",
    },
    AnnotationGroupSequence: {
        tag: "006A0002",
        vr: "SQ",
        vm: "1",
    },
    AnnotationGroupUID: {
        tag: "006A0003",
        vr: "UI",
        vm: "1",
    },
    AnnotationGroupLabel: {
        tag: "006A0005",
        vr: "LO",
        vm: "1",
    },
    AnnotationGroupDescription: {
        tag: "006A0006",
        vr: "UT",
        vm: "1",
    },
    AnnotationGroupGenerationType: {
        tag: "006A0007",
        vr: "CS",
        vm: "1",
    },
    AnnotationGroupAlgorithmIdentificationSequence: {
        tag: "006A0008",
        vr: "SQ",
        vm: "1",
    },
    AnnotationPropertyCategoryCodeSequence: {
        tag: "006A0009",
        vr: "SQ",
        vm: "1",
    },
    AnnotationPropertyTypeCodeSequence: {
        tag: "006A000A",
        vr: "SQ",
        vm: "1",
    },
    AnnotationPropertyTypeModifierCodeSequence: {
        tag: "006A000B",
        vr: "SQ",
        vm: "1",
    },
    NumberOfAnnotations: {
        tag: "006A000C",
        vr: "UL",
        vm: "1",
    },
    AnnotationAppliesToAllOpticalPaths: {
        tag: "006A000D",
        vr: "CS",
        vm: "1",
    },
    ReferencedOpticalPathIdentifier: {
        tag: "006A000E",
        vr: "SH",
        vm: "1-n",
    },
    AnnotationAppliesToAllZPlanes: {
        tag: "006A000F",
        vr: "CS",
        vm: "1",
    },
    CommonZCoordinateValue: {
        tag: "006A0010",
        vr: "FD",
        vm: "1-n",
    },
    AnnotationIndexList: {
        tag: "006A0011",
        vr: "OL",
        vm: "1",
    },
    GraphicAnnotationSequence: {
        tag: "00700001",
        vr: "SQ",
        vm: "1",
    },
    GraphicLayer: {
        tag: "00700002",
        vr: "CS",
        vm: "1",
    },
    BoundingBoxAnnotationUnits: {
        tag: "00700003",
        vr: "CS",
        vm: "1",
    },
    AnchorPointAnnotationUnits: {
        tag: "00700004",
        vr: "CS",
        vm: "1",
    },
    GraphicAnnotationUnits: {
        tag: "00700005",
        vr: "CS",
        vm: "1",
    },
    UnformattedTextValue: {
        tag: "00700006",
        vr: "ST",
        vm: "1",
    },
    TextObjectSequence: {
        tag: "00700008",
        vr: "SQ",
        vm: "1",
    },
    GraphicObjectSequence: {
        tag: "00700009",
        vr: "SQ",
        vm: "1",
    },
    BoundingBoxTopLeftHandCorner: {
        tag: "00700010",
        vr: "FL",
        vm: "2",
    },
    BoundingBoxBottomRightHandCorner: {
        tag: "00700011",
        vr: "FL",
        vm: "2",
    },
    BoundingBoxTextHorizontalJustification: {
        tag: "00700012",
        vr: "CS",
        vm: "1",
    },
    AnchorPoint: {
        tag: "00700014",
        vr: "FL",
        vm: "2",
    },
    AnchorPointVisibility: {
        tag: "00700015",
        vr: "CS",
        vm: "1",
    },
    GraphicDimensions: {
        tag: "00700020",
        vr: "US",
        vm: "1",
    },
    NumberOfGraphicPoints: {
        tag: "00700021",
        vr: "US",
        vm: "1",
    },
    GraphicData: {
        tag: "00700022",
        vr: "FL",
        vm: "2-n",
    },
    GraphicType: {
        tag: "00700023",
        vr: "CS",
        vm: "1",
    },
    GraphicFilled: {
        tag: "00700024",
        vr: "CS",
        vm: "1",
    },
    ImageRotationRetired: {
        tag: "00700040",
        vr: "IS",
        vm: "1",
    },
    ImageHorizontalFlip: {
        tag: "00700041",
        vr: "CS",
        vm: "1",
    },
    ImageRotation: {
        tag: "00700042",
        vr: "US",
        vm: "1",
    },
    DisplayedAreaTopLeftHandCornerTrial: {
        tag: "00700050",
        vr: "US",
        vm: "2",
    },
    DisplayedAreaBottomRightHandCornerTrial: {
        tag: "00700051",
        vr: "US",
        vm: "2",
    },
    DisplayedAreaTopLeftHandCorner: {
        tag: "00700052",
        vr: "SL",
        vm: "2",
    },
    DisplayedAreaBottomRightHandCorner: {
        tag: "00700053",
        vr: "SL",
        vm: "2",
    },
    DisplayedAreaSelectionSequence: {
        tag: "0070005A",
        vr: "SQ",
        vm: "1",
    },
    GraphicLayerSequence: {
        tag: "00700060",
        vr: "SQ",
        vm: "1",
    },
    GraphicLayerOrder: {
        tag: "00700062",
        vr: "IS",
        vm: "1",
    },
    GraphicLayerRecommendedDisplayGrayscaleValue: {
        tag: "00700066",
        vr: "US",
        vm: "1",
    },
    GraphicLayerRecommendedDisplayRGBValue: {
        tag: "00700067",
        vr: "US",
        vm: "3",
    },
    GraphicLayerDescription: {
        tag: "00700068",
        vr: "LO",
        vm: "1",
    },
    ContentLabel: {
        tag: "00700080",
        vr: "CS",
        vm: "1",
    },
    ContentDescription: {
        tag: "00700081",
        vr: "LO",
        vm: "1",
    },
    PresentationCreationDate: {
        tag: "00700082",
        vr: "DA",
        vm: "1",
    },
    PresentationCreationTime: {
        tag: "00700083",
        vr: "TM",
        vm: "1",
    },
    ContentCreatorName: {
        tag: "00700084",
        vr: "PN",
        vm: "1",
    },
    ContentCreatorIdentificationCodeSequence: {
        tag: "00700086",
        vr: "SQ",
        vm: "1",
    },
    AlternateContentDescriptionSequence: {
        tag: "00700087",
        vr: "SQ",
        vm: "1",
    },
    PresentationSizeMode: {
        tag: "00700100",
        vr: "CS",
        vm: "1",
    },
    PresentationPixelSpacing: {
        tag: "00700101",
        vr: "DS",
        vm: "2",
    },
    PresentationPixelAspectRatio: {
        tag: "00700102",
        vr: "IS",
        vm: "2",
    },
    PresentationPixelMagnificationRatio: {
        tag: "00700103",
        vr: "FL",
        vm: "1",
    },
    GraphicGroupLabel: {
        tag: "00700207",
        vr: "LO",
        vm: "1",
    },
    GraphicGroupDescription: {
        tag: "00700208",
        vr: "ST",
        vm: "1",
    },
    CompoundGraphicSequence: {
        tag: "00700209",
        vr: "SQ",
        vm: "1",
    },
    CompoundGraphicInstanceID: {
        tag: "00700226",
        vr: "UL",
        vm: "1",
    },
    FontName: {
        tag: "00700227",
        vr: "LO",
        vm: "1",
    },
    FontNameType: {
        tag: "00700228",
        vr: "CS",
        vm: "1",
    },
    CSSFontName: {
        tag: "00700229",
        vr: "LO",
        vm: "1",
    },
    RotationAngle: {
        tag: "00700230",
        vr: "FD",
        vm: "1",
    },
    TextStyleSequence: {
        tag: "00700231",
        vr: "SQ",
        vm: "1",
    },
    LineStyleSequence: {
        tag: "00700232",
        vr: "SQ",
        vm: "1",
    },
    FillStyleSequence: {
        tag: "00700233",
        vr: "SQ",
        vm: "1",
    },
    GraphicGroupSequence: {
        tag: "00700234",
        vr: "SQ",
        vm: "1",
    },
    TextColorCIELabValue: {
        tag: "00700241",
        vr: "US",
        vm: "3",
    },
    HorizontalAlignment: {
        tag: "00700242",
        vr: "CS",
        vm: "1",
    },
    VerticalAlignment: {
        tag: "00700243",
        vr: "CS",
        vm: "1",
    },
    ShadowStyle: {
        tag: "00700244",
        vr: "CS",
        vm: "1",
    },
    ShadowOffsetX: {
        tag: "00700245",
        vr: "FL",
        vm: "1",
    },
    ShadowOffsetY: {
        tag: "00700246",
        vr: "FL",
        vm: "1",
    },
    ShadowColorCIELabValue: {
        tag: "00700247",
        vr: "US",
        vm: "3",
    },
    Underlined: {
        tag: "00700248",
        vr: "CS",
        vm: "1",
    },
    Bold: {
        tag: "00700249",
        vr: "CS",
        vm: "1",
    },
    Italic: {
        tag: "00700250",
        vr: "CS",
        vm: "1",
    },
    PatternOnColorCIELabValue: {
        tag: "00700251",
        vr: "US",
        vm: "3",
    },
    PatternOffColorCIELabValue: {
        tag: "00700252",
        vr: "US",
        vm: "3",
    },
    LineThickness: {
        tag: "00700253",
        vr: "FL",
        vm: "1",
    },
    LineDashingStyle: {
        tag: "00700254",
        vr: "CS",
        vm: "1",
    },
    LinePattern: {
        tag: "00700255",
        vr: "UL",
        vm: "1",
    },
    FillPattern: {
        tag: "00700256",
        vr: "OB",
        vm: "1",
    },
    FillMode: {
        tag: "00700257",
        vr: "CS",
        vm: "1",
    },
    ShadowOpacity: {
        tag: "00700258",
        vr: "FL",
        vm: "1",
    },
    GapLength: {
        tag: "00700261",
        vr: "FL",
        vm: "1",
    },
    DiameterOfVisibility: {
        tag: "00700262",
        vr: "FL",
        vm: "1",
    },
    RotationPoint: {
        tag: "00700273",
        vr: "FL",
        vm: "2",
    },
    TickAlignment: {
        tag: "00700274",
        vr: "CS",
        vm: "1",
    },
    ShowTickLabel: {
        tag: "00700278",
        vr: "CS",
        vm: "1",
    },
    TickLabelAlignment: {
        tag: "00700279",
        vr: "CS",
        vm: "1",
    },
    CompoundGraphicUnits: {
        tag: "00700282",
        vr: "CS",
        vm: "1",
    },
    PatternOnOpacity: {
        tag: "00700284",
        vr: "FL",
        vm: "1",
    },
    PatternOffOpacity: {
        tag: "00700285",
        vr: "FL",
        vm: "1",
    },
    MajorTicksSequence: {
        tag: "00700287",
        vr: "SQ",
        vm: "1",
    },
    TickPosition: {
        tag: "00700288",
        vr: "FL",
        vm: "1",
    },
    TickLabel: {
        tag: "00700289",
        vr: "SH",
        vm: "1",
    },
    CompoundGraphicType: {
        tag: "00700294",
        vr: "CS",
        vm: "1",
    },
    GraphicGroupID: {
        tag: "00700295",
        vr: "UL",
        vm: "1",
    },
    ShapeType: {
        tag: "00700306",
        vr: "CS",
        vm: "1",
    },
    RegistrationSequence: {
        tag: "00700308",
        vr: "SQ",
        vm: "1",
    },
    MatrixRegistrationSequence: {
        tag: "00700309",
        vr: "SQ",
        vm: "1",
    },
    MatrixSequence: {
        tag: "0070030A",
        vr: "SQ",
        vm: "1",
    },
    FrameOfReferenceToDisplayedCoordinateSystemTransformationMatrix: {
        tag: "0070030B",
        vr: "FD",
        vm: "16",
    },
    FrameOfReferenceTransformationMatrixType: {
        tag: "0070030C",
        vr: "CS",
        vm: "1",
    },
    RegistrationTypeCodeSequence: {
        tag: "0070030D",
        vr: "SQ",
        vm: "1",
    },
    FiducialDescription: {
        tag: "0070030F",
        vr: "ST",
        vm: "1",
    },
    FiducialIdentifier: {
        tag: "00700310",
        vr: "SH",
        vm: "1",
    },
    FiducialIdentifierCodeSequence: {
        tag: "00700311",
        vr: "SQ",
        vm: "1",
    },
    ContourUncertaintyRadius: {
        tag: "00700312",
        vr: "FD",
        vm: "1",
    },
    UsedFiducialsSequence: {
        tag: "00700314",
        vr: "SQ",
        vm: "1",
    },
    UsedRTStructureSetROISequence: {
        tag: "00700315",
        vr: "SQ",
        vm: "1",
    },
    GraphicCoordinatesDataSequence: {
        tag: "00700318",
        vr: "SQ",
        vm: "1",
    },
    FiducialUID: {
        tag: "0070031A",
        vr: "UI",
        vm: "1",
    },
    ReferencedFiducialUID: {
        tag: "0070031B",
        vr: "UI",
        vm: "1",
    },
    FiducialSetSequence: {
        tag: "0070031C",
        vr: "SQ",
        vm: "1",
    },
    FiducialSequence: {
        tag: "0070031E",
        vr: "SQ",
        vm: "1",
    },
    FiducialsPropertyCategoryCodeSequence: {
        tag: "0070031F",
        vr: "SQ",
        vm: "1",
    },
    GraphicLayerRecommendedDisplayCIELabValue: {
        tag: "00700401",
        vr: "US",
        vm: "3",
    },
    BlendingSequence: {
        tag: "00700402",
        vr: "SQ",
        vm: "1",
    },
    RelativeOpacity: {
        tag: "00700403",
        vr: "FL",
        vm: "1",
    },
    ReferencedSpatialRegistrationSequence: {
        tag: "00700404",
        vr: "SQ",
        vm: "1",
    },
    BlendingPosition: {
        tag: "00700405",
        vr: "CS",
        vm: "1",
    },
    PresentationDisplayCollectionUID: {
        tag: "00701101",
        vr: "UI",
        vm: "1",
    },
    PresentationSequenceCollectionUID: {
        tag: "00701102",
        vr: "UI",
        vm: "1",
    },
    PresentationSequencePositionIndex: {
        tag: "00701103",
        vr: "US",
        vm: "1",
    },
    RenderedImageReferenceSequence: {
        tag: "00701104",
        vr: "SQ",
        vm: "1",
    },
    VolumetricPresentationStateInputSequence: {
        tag: "00701201",
        vr: "SQ",
        vm: "1",
    },
    PresentationInputType: {
        tag: "00701202",
        vr: "CS",
        vm: "1",
    },
    InputSequencePositionIndex: {
        tag: "00701203",
        vr: "US",
        vm: "1",
    },
    Crop: {
        tag: "00701204",
        vr: "CS",
        vm: "1",
    },
    CroppingSpecificationIndex: {
        tag: "00701205",
        vr: "US",
        vm: "1-n",
    },
    CompositingMethod: {
        tag: "00701206",
        vr: "CS",
        vm: "1",
    },
    VolumetricPresentationInputNumber: {
        tag: "00701207",
        vr: "US",
        vm: "1",
    },
    ImageVolumeGeometry: {
        tag: "00701208",
        vr: "CS",
        vm: "1",
    },
    VolumetricPresentationInputSetUID: {
        tag: "00701209",
        vr: "UI",
        vm: "1",
    },
    VolumetricPresentationInputSetSequence: {
        tag: "0070120A",
        vr: "SQ",
        vm: "1",
    },
    GlobalCrop: {
        tag: "0070120B",
        vr: "CS",
        vm: "1",
    },
    GlobalCroppingSpecificationIndex: {
        tag: "0070120C",
        vr: "US",
        vm: "1-n",
    },
    RenderingMethod: {
        tag: "0070120D",
        vr: "CS",
        vm: "1",
    },
    VolumeCroppingSequence: {
        tag: "00701301",
        vr: "SQ",
        vm: "1",
    },
    VolumeCroppingMethod: {
        tag: "00701302",
        vr: "CS",
        vm: "1",
    },
    BoundingBoxCrop: {
        tag: "00701303",
        vr: "FD",
        vm: "6",
    },
    ObliqueCroppingPlaneSequence: {
        tag: "00701304",
        vr: "SQ",
        vm: "1",
    },
    Plane: {
        tag: "00701305",
        vr: "FD",
        vm: "4",
    },
    PlaneNormal: {
        tag: "00701306",
        vr: "FD",
        vm: "3",
    },
    CroppingSpecificationNumber: {
        tag: "00701309",
        vr: "US",
        vm: "1",
    },
    MultiPlanarReconstructionStyle: {
        tag: "00701501",
        vr: "CS",
        vm: "1",
    },
    MPRThicknessType: {
        tag: "00701502",
        vr: "CS",
        vm: "1",
    },
    MPRSlabThickness: {
        tag: "00701503",
        vr: "FD",
        vm: "1",
    },
    MPRTopLeftHandCorner: {
        tag: "00701505",
        vr: "FD",
        vm: "3",
    },
    MPRViewWidthDirection: {
        tag: "00701507",
        vr: "FD",
        vm: "3",
    },
    MPRViewWidth: {
        tag: "00701508",
        vr: "FD",
        vm: "1",
    },
    NumberOfVolumetricCurvePoints: {
        tag: "0070150C",
        vr: "UL",
        vm: "1",
    },
    VolumetricCurvePoints: {
        tag: "0070150D",
        vr: "OD",
        vm: "1",
    },
    MPRViewHeightDirection: {
        tag: "00701511",
        vr: "FD",
        vm: "3",
    },
    MPRViewHeight: {
        tag: "00701512",
        vr: "FD",
        vm: "1",
    },
    RenderProjection: {
        tag: "00701602",
        vr: "CS",
        vm: "1",
    },
    ViewpointPosition: {
        tag: "00701603",
        vr: "FD",
        vm: "3",
    },
    ViewpointLookAtPoint: {
        tag: "00701604",
        vr: "FD",
        vm: "3",
    },
    ViewpointUpDirection: {
        tag: "00701605",
        vr: "FD",
        vm: "3",
    },
    RenderFieldOfView: {
        tag: "00701606",
        vr: "FD",
        vm: "6",
    },
    SamplingStepSize: {
        tag: "00701607",
        vr: "FD",
        vm: "1",
    },
    ShadingStyle: {
        tag: "00701701",
        vr: "CS",
        vm: "1",
    },
    AmbientReflectionIntensity: {
        tag: "00701702",
        vr: "FD",
        vm: "1",
    },
    LightDirection: {
        tag: "00701703",
        vr: "FD",
        vm: "3",
    },
    DiffuseReflectionIntensity: {
        tag: "00701704",
        vr: "FD",
        vm: "1",
    },
    SpecularReflectionIntensity: {
        tag: "00701705",
        vr: "FD",
        vm: "1",
    },
    Shininess: {
        tag: "00701706",
        vr: "FD",
        vm: "1",
    },
    PresentationStateClassificationComponentSequence: {
        tag: "00701801",
        vr: "SQ",
        vm: "1",
    },
    ComponentType: {
        tag: "00701802",
        vr: "CS",
        vm: "1",
    },
    ComponentInputSequence: {
        tag: "00701803",
        vr: "SQ",
        vm: "1",
    },
    VolumetricPresentationInputIndex: {
        tag: "00701804",
        vr: "US",
        vm: "1",
    },
    PresentationStateCompositorComponentSequence: {
        tag: "00701805",
        vr: "SQ",
        vm: "1",
    },
    WeightingTransferFunctionSequence: {
        tag: "00701806",
        vr: "SQ",
        vm: "1",
    },
    WeightingLookupTableDescriptor: {
        tag: "00701807",
        vr: "US",
        vm: "3",
    },
    WeightingLookupTableData: {
        tag: "00701808",
        vr: "OB",
        vm: "1",
    },
    VolumetricAnnotationSequence: {
        tag: "00701901",
        vr: "SQ",
        vm: "1",
    },
    ReferencedStructuredContextSequence: {
        tag: "00701903",
        vr: "SQ",
        vm: "1",
    },
    ReferencedContentItem: {
        tag: "00701904",
        vr: "UI",
        vm: "1",
    },
    VolumetricPresentationInputAnnotationSequence: {
        tag: "00701905",
        vr: "SQ",
        vm: "1",
    },
    AnnotationClipping: {
        tag: "00701907",
        vr: "CS",
        vm: "1",
    },
    PresentationAnimationStyle: {
        tag: "00701A01",
        vr: "CS",
        vm: "1",
    },
    RecommendedAnimationRate: {
        tag: "00701A03",
        vr: "FD",
        vm: "1",
    },
    AnimationCurveSequence: {
        tag: "00701A04",
        vr: "SQ",
        vm: "1",
    },
    AnimationStepSize: {
        tag: "00701A05",
        vr: "FD",
        vm: "1",
    },
    SwivelRange: {
        tag: "00701A06",
        vr: "FD",
        vm: "1",
    },
    VolumetricCurveUpDirections: {
        tag: "00701A07",
        vr: "OD",
        vm: "1",
    },
    VolumeStreamSequence: {
        tag: "00701A08",
        vr: "SQ",
        vm: "1",
    },
    RGBATransferFunctionDescription: {
        tag: "00701A09",
        vr: "LO",
        vm: "1",
    },
    AdvancedBlendingSequence: {
        tag: "00701B01",
        vr: "SQ",
        vm: "1",
    },
    BlendingInputNumber: {
        tag: "00701B02",
        vr: "US",
        vm: "1",
    },
    BlendingDisplayInputSequence: {
        tag: "00701B03",
        vr: "SQ",
        vm: "1",
    },
    BlendingDisplaySequence: {
        tag: "00701B04",
        vr: "SQ",
        vm: "1",
    },
    BlendingMode: {
        tag: "00701B06",
        vr: "CS",
        vm: "1",
    },
    TimeSeriesBlending: {
        tag: "00701B07",
        vr: "CS",
        vm: "1",
    },
    GeometryForDisplay: {
        tag: "00701B08",
        vr: "CS",
        vm: "1",
    },
    ThresholdSequence: {
        tag: "00701B11",
        vr: "SQ",
        vm: "1",
    },
    ThresholdValueSequence: {
        tag: "00701B12",
        vr: "SQ",
        vm: "1",
    },
    ThresholdType: {
        tag: "00701B13",
        vr: "CS",
        vm: "1",
    },
    ThresholdValue: {
        tag: "00701B14",
        vr: "FD",
        vm: "1",
    },
    HangingProtocolName: {
        tag: "00720002",
        vr: "SH",
        vm: "1",
    },
    HangingProtocolDescription: {
        tag: "00720004",
        vr: "LO",
        vm: "1",
    },
    HangingProtocolLevel: {
        tag: "00720006",
        vr: "CS",
        vm: "1",
    },
    HangingProtocolCreator: {
        tag: "00720008",
        vr: "LO",
        vm: "1",
    },
    HangingProtocolCreationDateTime: {
        tag: "0072000A",
        vr: "DT",
        vm: "1",
    },
    HangingProtocolDefinitionSequence: {
        tag: "0072000C",
        vr: "SQ",
        vm: "1",
    },
    HangingProtocolUserIdentificationCodeSequence: {
        tag: "0072000E",
        vr: "SQ",
        vm: "1",
    },
    HangingProtocolUserGroupName: {
        tag: "00720010",
        vr: "LO",
        vm: "1",
    },
    SourceHangingProtocolSequence: {
        tag: "00720012",
        vr: "SQ",
        vm: "1",
    },
    NumberOfPriorsReferenced: {
        tag: "00720014",
        vr: "US",
        vm: "1",
    },
    ImageSetsSequence: {
        tag: "00720020",
        vr: "SQ",
        vm: "1",
    },
    ImageSetSelectorSequence: {
        tag: "00720022",
        vr: "SQ",
        vm: "1",
    },
    ImageSetSelectorUsageFlag: {
        tag: "00720024",
        vr: "CS",
        vm: "1",
    },
    SelectorAttribute: {
        tag: "00720026",
        vr: "AT",
        vm: "1",
    },
    SelectorValueNumber: {
        tag: "00720028",
        vr: "US",
        vm: "1",
    },
    TimeBasedImageSetsSequence: {
        tag: "00720030",
        vr: "SQ",
        vm: "1",
    },
    ImageSetNumber: {
        tag: "00720032",
        vr: "US",
        vm: "1",
    },
    ImageSetSelectorCategory: {
        tag: "00720034",
        vr: "CS",
        vm: "1",
    },
    RelativeTime: {
        tag: "00720038",
        vr: "US",
        vm: "2",
    },
    RelativeTimeUnits: {
        tag: "0072003A",
        vr: "CS",
        vm: "1",
    },
    AbstractPriorValue: {
        tag: "0072003C",
        vr: "SS",
        vm: "2",
    },
    AbstractPriorCodeSequence: {
        tag: "0072003E",
        vr: "SQ",
        vm: "1",
    },
    ImageSetLabel: {
        tag: "00720040",
        vr: "LO",
        vm: "1",
    },
    SelectorAttributeVR: {
        tag: "00720050",
        vr: "CS",
        vm: "1",
    },
    SelectorSequencePointer: {
        tag: "00720052",
        vr: "AT",
        vm: "1-n",
    },
    SelectorSequencePointerPrivateCreator: {
        tag: "00720054",
        vr: "LO",
        vm: "1-n",
    },
    SelectorAttributePrivateCreator: {
        tag: "00720056",
        vr: "LO",
        vm: "1",
    },
    SelectorAEValue: {
        tag: "0072005E",
        vr: "AE",
        vm: "1-n",
    },
    SelectorASValue: {
        tag: "0072005F",
        vr: "AS",
        vm: "1-n",
    },
    SelectorATValue: {
        tag: "00720060",
        vr: "AT",
        vm: "1-n",
    },
    SelectorDAValue: {
        tag: "00720061",
        vr: "DA",
        vm: "1-n",
    },
    SelectorCSValue: {
        tag: "00720062",
        vr: "CS",
        vm: "1-n",
    },
    SelectorDTValue: {
        tag: "00720063",
        vr: "DT",
        vm: "1-n",
    },
    SelectorISValue: {
        tag: "00720064",
        vr: "IS",
        vm: "1-n",
    },
    SelectorOBValue: {
        tag: "00720065",
        vr: "OB",
        vm: "1",
    },
    SelectorLOValue: {
        tag: "00720066",
        vr: "LO",
        vm: "1-n",
    },
    SelectorOFValue: {
        tag: "00720067",
        vr: "OF",
        vm: "1",
    },
    SelectorLTValue: {
        tag: "00720068",
        vr: "LT",
        vm: "1",
    },
    SelectorOWValue: {
        tag: "00720069",
        vr: "OW",
        vm: "1",
    },
    SelectorPNValue: {
        tag: "0072006A",
        vr: "PN",
        vm: "1-n",
    },
    SelectorTMValue: {
        tag: "0072006B",
        vr: "TM",
        vm: "1-n",
    },
    SelectorSHValue: {
        tag: "0072006C",
        vr: "SH",
        vm: "1-n",
    },
    SelectorUNValue: {
        tag: "0072006D",
        vr: "UN",
        vm: "1",
    },
    SelectorSTValue: {
        tag: "0072006E",
        vr: "ST",
        vm: "1",
    },
    SelectorUCValue: {
        tag: "0072006F",
        vr: "UC",
        vm: "1-n",
    },
    SelectorUTValue: {
        tag: "00720070",
        vr: "UT",
        vm: "1",
    },
    SelectorURValue: {
        tag: "00720071",
        vr: "UR",
        vm: "1",
    },
    SelectorDSValue: {
        tag: "00720072",
        vr: "DS",
        vm: "1-n",
    },
    SelectorODValue: {
        tag: "00720073",
        vr: "OD",
        vm: "1",
    },
    SelectorFDValue: {
        tag: "00720074",
        vr: "FD",
        vm: "1-n",
    },
    SelectorOLValue: {
        tag: "00720075",
        vr: "OL",
        vm: "1",
    },
    SelectorFLValue: {
        tag: "00720076",
        vr: "FL",
        vm: "1-n",
    },
    SelectorULValue: {
        tag: "00720078",
        vr: "UL",
        vm: "1-n",
    },
    SelectorUSValue: {
        tag: "0072007A",
        vr: "US",
        vm: "1-n",
    },
    SelectorSLValue: {
        tag: "0072007C",
        vr: "SL",
        vm: "1-n",
    },
    SelectorSSValue: {
        tag: "0072007E",
        vr: "SS",
        vm: "1-n",
    },
    SelectorUIValue: {
        tag: "0072007F",
        vr: "UI",
        vm: "1-n",
    },
    SelectorCodeSequenceValue: {
        tag: "00720080",
        vr: "SQ",
        vm: "1",
    },
    SelectorOVValue: {
        tag: "00720081",
        vr: "OV",
        vm: "1",
    },
    SelectorSVValue: {
        tag: "00720082",
        vr: "SV",
        vm: "1-n",
    },
    SelectorUVValue: {
        tag: "00720083",
        vr: "UV",
        vm: "1-n",
    },
    NumberOfScreens: {
        tag: "00720100",
        vr: "US",
        vm: "1",
    },
    NominalScreenDefinitionSequence: {
        tag: "00720102",
        vr: "SQ",
        vm: "1",
    },
    NumberOfVerticalPixels: {
        tag: "00720104",
        vr: "US",
        vm: "1",
    },
    NumberOfHorizontalPixels: {
        tag: "00720106",
        vr: "US",
        vm: "1",
    },
    DisplayEnvironmentSpatialPosition: {
        tag: "00720108",
        vr: "FD",
        vm: "4",
    },
    ScreenMinimumGrayscaleBitDepth: {
        tag: "0072010A",
        vr: "US",
        vm: "1",
    },
    ScreenMinimumColorBitDepth: {
        tag: "0072010C",
        vr: "US",
        vm: "1",
    },
    ApplicationMaximumRepaintTime: {
        tag: "0072010E",
        vr: "US",
        vm: "1",
    },
    DisplaySetsSequence: {
        tag: "00720200",
        vr: "SQ",
        vm: "1",
    },
    DisplaySetNumber: {
        tag: "00720202",
        vr: "US",
        vm: "1",
    },
    DisplaySetLabel: {
        tag: "00720203",
        vr: "LO",
        vm: "1",
    },
    DisplaySetPresentationGroup: {
        tag: "00720204",
        vr: "US",
        vm: "1",
    },
    DisplaySetPresentationGroupDescription: {
        tag: "00720206",
        vr: "LO",
        vm: "1",
    },
    PartialDataDisplayHandling: {
        tag: "00720208",
        vr: "CS",
        vm: "1",
    },
    SynchronizedScrollingSequence: {
        tag: "00720210",
        vr: "SQ",
        vm: "1",
    },
    DisplaySetScrollingGroup: {
        tag: "00720212",
        vr: "US",
        vm: "2-n",
    },
    NavigationIndicatorSequence: {
        tag: "00720214",
        vr: "SQ",
        vm: "1",
    },
    NavigationDisplaySet: {
        tag: "00720216",
        vr: "US",
        vm: "1",
    },
    ReferenceDisplaySets: {
        tag: "00720218",
        vr: "US",
        vm: "1-n",
    },
    ImageBoxesSequence: {
        tag: "00720300",
        vr: "SQ",
        vm: "1",
    },
    ImageBoxNumber: {
        tag: "00720302",
        vr: "US",
        vm: "1",
    },
    ImageBoxLayoutType: {
        tag: "00720304",
        vr: "CS",
        vm: "1",
    },
    ImageBoxTileHorizontalDimension: {
        tag: "00720306",
        vr: "US",
        vm: "1",
    },
    ImageBoxTileVerticalDimension: {
        tag: "00720308",
        vr: "US",
        vm: "1",
    },
    ImageBoxScrollDirection: {
        tag: "00720310",
        vr: "CS",
        vm: "1",
    },
    ImageBoxSmallScrollType: {
        tag: "00720312",
        vr: "CS",
        vm: "1",
    },
    ImageBoxSmallScrollAmount: {
        tag: "00720314",
        vr: "US",
        vm: "1",
    },
    ImageBoxLargeScrollType: {
        tag: "00720316",
        vr: "CS",
        vm: "1",
    },
    ImageBoxLargeScrollAmount: {
        tag: "00720318",
        vr: "US",
        vm: "1",
    },
    ImageBoxOverlapPriority: {
        tag: "00720320",
        vr: "US",
        vm: "1",
    },
    CineRelativeToRealTime: {
        tag: "00720330",
        vr: "FD",
        vm: "1",
    },
    FilterOperationsSequence: {
        tag: "00720400",
        vr: "SQ",
        vm: "1",
    },
    FilterByCategory: {
        tag: "00720402",
        vr: "CS",
        vm: "1",
    },
    FilterByAttributePresence: {
        tag: "00720404",
        vr: "CS",
        vm: "1",
    },
    FilterByOperator: {
        tag: "00720406",
        vr: "CS",
        vm: "1",
    },
    StructuredDisplayBackgroundCIELabValue: {
        tag: "00720420",
        vr: "US",
        vm: "3",
    },
    EmptyImageBoxCIELabValue: {
        tag: "00720421",
        vr: "US",
        vm: "3",
    },
    StructuredDisplayImageBoxSequence: {
        tag: "00720422",
        vr: "SQ",
        vm: "1",
    },
    StructuredDisplayTextBoxSequence: {
        tag: "00720424",
        vr: "SQ",
        vm: "1",
    },
    ReferencedFirstFrameSequence: {
        tag: "00720427",
        vr: "SQ",
        vm: "1",
    },
    ImageBoxSynchronizationSequence: {
        tag: "00720430",
        vr: "SQ",
        vm: "1",
    },
    SynchronizedImageBoxList: {
        tag: "00720432",
        vr: "US",
        vm: "2-n",
    },
    TypeOfSynchronization: {
        tag: "00720434",
        vr: "CS",
        vm: "1",
    },
    BlendingOperationType: {
        tag: "00720500",
        vr: "CS",
        vm: "1",
    },
    ReformattingOperationType: {
        tag: "00720510",
        vr: "CS",
        vm: "1",
    },
    ReformattingThickness: {
        tag: "00720512",
        vr: "FD",
        vm: "1",
    },
    ReformattingInterval: {
        tag: "00720514",
        vr: "FD",
        vm: "1",
    },
    ReformattingOperationInitialViewDirection: {
        tag: "00720516",
        vr: "CS",
        vm: "1",
    },
    ThreeDRenderingType: {
        tag: "00720520",
        vr: "CS",
        vm: "1-n",
    },
    SortingOperationsSequence: {
        tag: "00720600",
        vr: "SQ",
        vm: "1",
    },
    SortByCategory: {
        tag: "00720602",
        vr: "CS",
        vm: "1",
    },
    SortingDirection: {
        tag: "00720604",
        vr: "CS",
        vm: "1",
    },
    DisplaySetPatientOrientation: {
        tag: "00720700",
        vr: "CS",
        vm: "2",
    },
    VOIType: {
        tag: "00720702",
        vr: "CS",
        vm: "1",
    },
    PseudoColorType: {
        tag: "00720704",
        vr: "CS",
        vm: "1",
    },
    PseudoColorPaletteInstanceReferenceSequence: {
        tag: "00720705",
        vr: "SQ",
        vm: "1",
    },
    ShowGrayscaleInverted: {
        tag: "00720706",
        vr: "CS",
        vm: "1",
    },
    ShowImageTrueSizeFlag: {
        tag: "00720710",
        vr: "CS",
        vm: "1",
    },
    ShowGraphicAnnotationFlag: {
        tag: "00720712",
        vr: "CS",
        vm: "1",
    },
    ShowPatientDemographicsFlag: {
        tag: "00720714",
        vr: "CS",
        vm: "1",
    },
    ShowAcquisitionTechniquesFlag: {
        tag: "00720716",
        vr: "CS",
        vm: "1",
    },
    DisplaySetHorizontalJustification: {
        tag: "00720717",
        vr: "CS",
        vm: "1",
    },
    DisplaySetVerticalJustification: {
        tag: "00720718",
        vr: "CS",
        vm: "1",
    },
    ContinuationStartMeterset: {
        tag: "00740120",
        vr: "FD",
        vm: "1",
    },
    ContinuationEndMeterset: {
        tag: "00740121",
        vr: "FD",
        vm: "1",
    },
    ProcedureStepState: {
        tag: "00741000",
        vr: "CS",
        vm: "1",
    },
    ProcedureStepProgressInformationSequence: {
        tag: "00741002",
        vr: "SQ",
        vm: "1",
    },
    ProcedureStepProgress: {
        tag: "00741004",
        vr: "DS",
        vm: "1",
    },
    ProcedureStepProgressDescription: {
        tag: "00741006",
        vr: "ST",
        vm: "1",
    },
    ProcedureStepProgressParametersSequence: {
        tag: "00741007",
        vr: "SQ",
        vm: "1",
    },
    ProcedureStepCommunicationsURISequence: {
        tag: "00741008",
        vr: "SQ",
        vm: "1",
    },
    ContactURI: {
        tag: "0074100A",
        vr: "UR",
        vm: "1",
    },
    ContactDisplayName: {
        tag: "0074100C",
        vr: "LO",
        vm: "1",
    },
    ProcedureStepDiscontinuationReasonCodeSequence: {
        tag: "0074100E",
        vr: "SQ",
        vm: "1",
    },
    BeamTaskSequence: {
        tag: "00741020",
        vr: "SQ",
        vm: "1",
    },
    BeamTaskType: {
        tag: "00741022",
        vr: "CS",
        vm: "1",
    },
    BeamOrderIndexTrial: {
        tag: "00741024",
        vr: "IS",
        vm: "1",
    },
    AutosequenceFlag: {
        tag: "00741025",
        vr: "CS",
        vm: "1",
    },
    TableTopVerticalAdjustedPosition: {
        tag: "00741026",
        vr: "FD",
        vm: "1",
    },
    TableTopLongitudinalAdjustedPosition: {
        tag: "00741027",
        vr: "FD",
        vm: "1",
    },
    TableTopLateralAdjustedPosition: {
        tag: "00741028",
        vr: "FD",
        vm: "1",
    },
    PatientSupportAdjustedAngle: {
        tag: "0074102A",
        vr: "FD",
        vm: "1",
    },
    TableTopEccentricAdjustedAngle: {
        tag: "0074102B",
        vr: "FD",
        vm: "1",
    },
    TableTopPitchAdjustedAngle: {
        tag: "0074102C",
        vr: "FD",
        vm: "1",
    },
    TableTopRollAdjustedAngle: {
        tag: "0074102D",
        vr: "FD",
        vm: "1",
    },
    DeliveryVerificationImageSequence: {
        tag: "00741030",
        vr: "SQ",
        vm: "1",
    },
    VerificationImageTiming: {
        tag: "00741032",
        vr: "CS",
        vm: "1",
    },
    DoubleExposureFlag: {
        tag: "00741034",
        vr: "CS",
        vm: "1",
    },
    DoubleExposureOrdering: {
        tag: "00741036",
        vr: "CS",
        vm: "1",
    },
    DoubleExposureMetersetTrial: {
        tag: "00741038",
        vr: "DS",
        vm: "1",
    },
    DoubleExposureFieldDeltaTrial: {
        tag: "0074103A",
        vr: "DS",
        vm: "4",
    },
    RelatedReferenceRTImageSequence: {
        tag: "00741040",
        vr: "SQ",
        vm: "1",
    },
    GeneralMachineVerificationSequence: {
        tag: "00741042",
        vr: "SQ",
        vm: "1",
    },
    ConventionalMachineVerificationSequence: {
        tag: "00741044",
        vr: "SQ",
        vm: "1",
    },
    IonMachineVerificationSequence: {
        tag: "00741046",
        vr: "SQ",
        vm: "1",
    },
    FailedAttributesSequence: {
        tag: "00741048",
        vr: "SQ",
        vm: "1",
    },
    OverriddenAttributesSequence: {
        tag: "0074104A",
        vr: "SQ",
        vm: "1",
    },
    ConventionalControlPointVerificationSequence: {
        tag: "0074104C",
        vr: "SQ",
        vm: "1",
    },
    IonControlPointVerificationSequence: {
        tag: "0074104E",
        vr: "SQ",
        vm: "1",
    },
    AttributeOccurrenceSequence: {
        tag: "00741050",
        vr: "SQ",
        vm: "1",
    },
    AttributeOccurrencePointer: {
        tag: "00741052",
        vr: "AT",
        vm: "1",
    },
    AttributeItemSelector: {
        tag: "00741054",
        vr: "UL",
        vm: "1",
    },
    AttributeOccurrencePrivateCreator: {
        tag: "00741056",
        vr: "LO",
        vm: "1",
    },
    SelectorSequencePointerItems: {
        tag: "00741057",
        vr: "IS",
        vm: "1-n",
    },
    ScheduledProcedureStepPriority: {
        tag: "00741200",
        vr: "CS",
        vm: "1",
    },
    WorklistLabel: {
        tag: "00741202",
        vr: "LO",
        vm: "1",
    },
    ProcedureStepLabel: {
        tag: "00741204",
        vr: "LO",
        vm: "1",
    },
    ScheduledProcessingParametersSequence: {
        tag: "00741210",
        vr: "SQ",
        vm: "1",
    },
    PerformedProcessingParametersSequence: {
        tag: "00741212",
        vr: "SQ",
        vm: "1",
    },
    UnifiedProcedureStepPerformedProcedureSequence: {
        tag: "00741216",
        vr: "SQ",
        vm: "1",
    },
    RelatedProcedureStepSequence: {
        tag: "00741220",
        vr: "SQ",
        vm: "1",
    },
    ProcedureStepRelationshipType: {
        tag: "00741222",
        vr: "LO",
        vm: "1",
    },
    ReplacedProcedureStepSequence: {
        tag: "00741224",
        vr: "SQ",
        vm: "1",
    },
    DeletionLock: {
        tag: "00741230",
        vr: "LO",
        vm: "1",
    },
    ReceivingAE: {
        tag: "00741234",
        vr: "AE",
        vm: "1",
    },
    RequestingAE: {
        tag: "00741236",
        vr: "AE",
        vm: "1",
    },
    ReasonForCancellation: {
        tag: "00741238",
        vr: "LT",
        vm: "1",
    },
    SCPStatus: {
        tag: "00741242",
        vr: "CS",
        vm: "1",
    },
    SubscriptionListStatus: {
        tag: "00741244",
        vr: "CS",
        vm: "1",
    },
    UnifiedProcedureStepListStatus: {
        tag: "00741246",
        vr: "CS",
        vm: "1",
    },
    BeamOrderIndex: {
        tag: "00741324",
        vr: "UL",
        vm: "1",
    },
    DoubleExposureMeterset: {
        tag: "00741338",
        vr: "FD",
        vm: "1",
    },
    DoubleExposureFieldDelta: {
        tag: "0074133A",
        vr: "FD",
        vm: "4",
    },
    BrachyTaskSequence: {
        tag: "00741401",
        vr: "SQ",
        vm: "1",
    },
    ContinuationStartTotalReferenceAirKerma: {
        tag: "00741402",
        vr: "DS",
        vm: "1",
    },
    ContinuationEndTotalReferenceAirKerma: {
        tag: "00741403",
        vr: "DS",
        vm: "1",
    },
    ContinuationPulseNumber: {
        tag: "00741404",
        vr: "IS",
        vm: "1",
    },
    ChannelDeliveryOrderSequence: {
        tag: "00741405",
        vr: "SQ",
        vm: "1",
    },
    ReferencedChannelNumber: {
        tag: "00741406",
        vr: "IS",
        vm: "1",
    },
    StartCumulativeTimeWeight: {
        tag: "00741407",
        vr: "DS",
        vm: "1",
    },
    EndCumulativeTimeWeight: {
        tag: "00741408",
        vr: "DS",
        vm: "1",
    },
    OmittedChannelSequence: {
        tag: "00741409",
        vr: "SQ",
        vm: "1",
    },
    ReasonForChannelOmission: {
        tag: "0074140A",
        vr: "CS",
        vm: "1",
    },
    ReasonForChannelOmissionDescription: {
        tag: "0074140B",
        vr: "LO",
        vm: "1",
    },
    ChannelDeliveryOrderIndex: {
        tag: "0074140C",
        vr: "IS",
        vm: "1",
    },
    ChannelDeliveryContinuationSequence: {
        tag: "0074140D",
        vr: "SQ",
        vm: "1",
    },
    OmittedApplicationSetupSequence: {
        tag: "0074140E",
        vr: "SQ",
        vm: "1",
    },
    ImplantAssemblyTemplateName: {
        tag: "00760001",
        vr: "LO",
        vm: "1",
    },
    ImplantAssemblyTemplateIssuer: {
        tag: "00760003",
        vr: "LO",
        vm: "1",
    },
    ImplantAssemblyTemplateVersion: {
        tag: "00760006",
        vr: "LO",
        vm: "1",
    },
    ReplacedImplantAssemblyTemplateSequence: {
        tag: "00760008",
        vr: "SQ",
        vm: "1",
    },
    ImplantAssemblyTemplateType: {
        tag: "0076000A",
        vr: "CS",
        vm: "1",
    },
    OriginalImplantAssemblyTemplateSequence: {
        tag: "0076000C",
        vr: "SQ",
        vm: "1",
    },
    DerivationImplantAssemblyTemplateSequence: {
        tag: "0076000E",
        vr: "SQ",
        vm: "1",
    },
    ImplantAssemblyTemplateTargetAnatomySequence: {
        tag: "00760010",
        vr: "SQ",
        vm: "1",
    },
    ProcedureTypeCodeSequence: {
        tag: "00760020",
        vr: "SQ",
        vm: "1",
    },
    SurgicalTechnique: {
        tag: "00760030",
        vr: "LO",
        vm: "1",
    },
    ComponentTypesSequence: {
        tag: "00760032",
        vr: "SQ",
        vm: "1",
    },
    ComponentTypeCodeSequence: {
        tag: "00760034",
        vr: "SQ",
        vm: "1",
    },
    ExclusiveComponentType: {
        tag: "00760036",
        vr: "CS",
        vm: "1",
    },
    MandatoryComponentType: {
        tag: "00760038",
        vr: "CS",
        vm: "1",
    },
    ComponentSequence: {
        tag: "00760040",
        vr: "SQ",
        vm: "1",
    },
    ComponentID: {
        tag: "00760055",
        vr: "US",
        vm: "1",
    },
    ComponentAssemblySequence: {
        tag: "00760060",
        vr: "SQ",
        vm: "1",
    },
    Component1ReferencedID: {
        tag: "00760070",
        vr: "US",
        vm: "1",
    },
    Component1ReferencedMatingFeatureSetID: {
        tag: "00760080",
        vr: "US",
        vm: "1",
    },
    Component1ReferencedMatingFeatureID: {
        tag: "00760090",
        vr: "US",
        vm: "1",
    },
    Component2ReferencedID: {
        tag: "007600A0",
        vr: "US",
        vm: "1",
    },
    Component2ReferencedMatingFeatureSetID: {
        tag: "007600B0",
        vr: "US",
        vm: "1",
    },
    Component2ReferencedMatingFeatureID: {
        tag: "007600C0",
        vr: "US",
        vm: "1",
    },
    ImplantTemplateGroupName: {
        tag: "00780001",
        vr: "LO",
        vm: "1",
    },
    ImplantTemplateGroupDescription: {
        tag: "00780010",
        vr: "ST",
        vm: "1",
    },
    ImplantTemplateGroupIssuer: {
        tag: "00780020",
        vr: "LO",
        vm: "1",
    },
    ImplantTemplateGroupVersion: {
        tag: "00780024",
        vr: "LO",
        vm: "1",
    },
    ReplacedImplantTemplateGroupSequence: {
        tag: "00780026",
        vr: "SQ",
        vm: "1",
    },
    ImplantTemplateGroupTargetAnatomySequence: {
        tag: "00780028",
        vr: "SQ",
        vm: "1",
    },
    ImplantTemplateGroupMembersSequence: {
        tag: "0078002A",
        vr: "SQ",
        vm: "1",
    },
    ImplantTemplateGroupMemberID: {
        tag: "0078002E",
        vr: "US",
        vm: "1",
    },
    ThreeDImplantTemplateGroupMemberMatchingPoint: {
        tag: "00780050",
        vr: "FD",
        vm: "3",
    },
    ThreeDImplantTemplateGroupMemberMatchingAxes: {
        tag: "00780060",
        vr: "FD",
        vm: "9",
    },
    ImplantTemplateGroupMemberMatching2DCoordinatesSequence: {
        tag: "00780070",
        vr: "SQ",
        vm: "1",
    },
    TwoDImplantTemplateGroupMemberMatchingPoint: {
        tag: "00780090",
        vr: "FD",
        vm: "2",
    },
    TwoDImplantTemplateGroupMemberMatchingAxes: {
        tag: "007800A0",
        vr: "FD",
        vm: "4",
    },
    ImplantTemplateGroupVariationDimensionSequence: {
        tag: "007800B0",
        vr: "SQ",
        vm: "1",
    },
    ImplantTemplateGroupVariationDimensionName: {
        tag: "007800B2",
        vr: "LO",
        vm: "1",
    },
    ImplantTemplateGroupVariationDimensionRankSequence: {
        tag: "007800B4",
        vr: "SQ",
        vm: "1",
    },
    ReferencedImplantTemplateGroupMemberID: {
        tag: "007800B6",
        vr: "US",
        vm: "1",
    },
    ImplantTemplateGroupVariationDimensionRank: {
        tag: "007800B8",
        vr: "US",
        vm: "1",
    },
    SurfaceScanAcquisitionTypeCodeSequence: {
        tag: "00800001",
        vr: "SQ",
        vm: "1",
    },
    SurfaceScanModeCodeSequence: {
        tag: "00800002",
        vr: "SQ",
        vm: "1",
    },
    RegistrationMethodCodeSequence: {
        tag: "00800003",
        vr: "SQ",
        vm: "1",
    },
    ShotDurationTime: {
        tag: "00800004",
        vr: "FD",
        vm: "1",
    },
    ShotOffsetTime: {
        tag: "00800005",
        vr: "FD",
        vm: "1",
    },
    SurfacePointPresentationValueData: {
        tag: "00800006",
        vr: "US",
        vm: "1-n",
    },
    SurfacePointColorCIELabValueData: {
        tag: "00800007",
        vr: "US",
        vm: "3-3n",
    },
    UVMappingSequence: {
        tag: "00800008",
        vr: "SQ",
        vm: "1",
    },
    TextureLabel: {
        tag: "00800009",
        vr: "SH",
        vm: "1",
    },
    UValueData: {
        tag: "00800010",
        vr: "OF",
        vm: "1",
    },
    VValueData: {
        tag: "00800011",
        vr: "OF",
        vm: "1",
    },
    ReferencedTextureSequence: {
        tag: "00800012",
        vr: "SQ",
        vm: "1",
    },
    ReferencedSurfaceDataSequence: {
        tag: "00800013",
        vr: "SQ",
        vm: "1",
    },
    AssessmentSummary: {
        tag: "00820001",
        vr: "CS",
        vm: "1",
    },
    AssessmentSummaryDescription: {
        tag: "00820003",
        vr: "UT",
        vm: "1",
    },
    AssessedSOPInstanceSequence: {
        tag: "00820004",
        vr: "SQ",
        vm: "1",
    },
    ReferencedComparisonSOPInstanceSequence: {
        tag: "00820005",
        vr: "SQ",
        vm: "1",
    },
    NumberOfAssessmentObservations: {
        tag: "00820006",
        vr: "UL",
        vm: "1",
    },
    AssessmentObservationsSequence: {
        tag: "00820007",
        vr: "SQ",
        vm: "1",
    },
    ObservationSignificance: {
        tag: "00820008",
        vr: "CS",
        vm: "1",
    },
    ObservationDescription: {
        tag: "0082000A",
        vr: "UT",
        vm: "1",
    },
    StructuredConstraintObservationSequence: {
        tag: "0082000C",
        vr: "SQ",
        vm: "1",
    },
    AssessedAttributeValueSequence: {
        tag: "00820010",
        vr: "SQ",
        vm: "1",
    },
    AssessmentSetID: {
        tag: "00820016",
        vr: "LO",
        vm: "1",
    },
    AssessmentRequesterSequence: {
        tag: "00820017",
        vr: "SQ",
        vm: "1",
    },
    SelectorAttributeName: {
        tag: "00820018",
        vr: "LO",
        vm: "1",
    },
    SelectorAttributeKeyword: {
        tag: "00820019",
        vr: "LO",
        vm: "1",
    },
    AssessmentTypeCodeSequence: {
        tag: "00820021",
        vr: "SQ",
        vm: "1",
    },
    ObservationBasisCodeSequence: {
        tag: "00820022",
        vr: "SQ",
        vm: "1",
    },
    AssessmentLabel: {
        tag: "00820023",
        vr: "LO",
        vm: "1",
    },
    ConstraintType: {
        tag: "00820032",
        vr: "CS",
        vm: "1",
    },
    SpecificationSelectionGuidance: {
        tag: "00820033",
        vr: "UT",
        vm: "1",
    },
    ConstraintValueSequence: {
        tag: "00820034",
        vr: "SQ",
        vm: "1",
    },
    RecommendedDefaultValueSequence: {
        tag: "00820035",
        vr: "SQ",
        vm: "1",
    },
    ConstraintViolationSignificance: {
        tag: "00820036",
        vr: "CS",
        vm: "1",
    },
    ConstraintViolationCondition: {
        tag: "00820037",
        vr: "UT",
        vm: "1",
    },
    ModifiableConstraintFlag: {
        tag: "00820038",
        vr: "CS",
        vm: "1",
    },
    StorageMediaFileSetID: {
        tag: "00880130",
        vr: "SH",
        vm: "1",
    },
    StorageMediaFileSetUID: {
        tag: "00880140",
        vr: "UI",
        vm: "1",
    },
    IconImageSequence: {
        tag: "00880200",
        vr: "SQ",
        vm: "1",
    },
    TopicTitle: {
        tag: "00880904",
        vr: "LO",
        vm: "1",
    },
    TopicSubject: {
        tag: "00880906",
        vr: "ST",
        vm: "1",
    },
    TopicAuthor: {
        tag: "00880910",
        vr: "LO",
        vm: "1",
    },
    TopicKeywords: {
        tag: "00880912",
        vr: "LO",
        vm: "1-32",
    },
    SOPInstanceStatus: {
        tag: "01000410",
        vr: "CS",
        vm: "1",
    },
    SOPAuthorizationDateTime: {
        tag: "01000420",
        vr: "DT",
        vm: "1",
    },
    SOPAuthorizationComment: {
        tag: "01000424",
        vr: "LT",
        vm: "1",
    },
    AuthorizationEquipmentCertificationNumber: {
        tag: "01000426",
        vr: "LO",
        vm: "1",
    },
    MACIDNumber: {
        tag: "04000005",
        vr: "US",
        vm: "1",
    },
    MACCalculationTransferSyntaxUID: {
        tag: "04000010",
        vr: "UI",
        vm: "1",
    },
    MACAlgorithm: {
        tag: "04000015",
        vr: "CS",
        vm: "1",
    },
    DataElementsSigned: {
        tag: "04000020",
        vr: "AT",
        vm: "1-n",
    },
    DigitalSignatureUID: {
        tag: "04000100",
        vr: "UI",
        vm: "1",
    },
    DigitalSignatureDateTime: {
        tag: "04000105",
        vr: "DT",
        vm: "1",
    },
    CertificateType: {
        tag: "04000110",
        vr: "CS",
        vm: "1",
    },
    CertificateOfSigner: {
        tag: "04000115",
        vr: "OB",
        vm: "1",
    },
    Signature: {
        tag: "04000120",
        vr: "OB",
        vm: "1",
    },
    CertifiedTimestampType: {
        tag: "04000305",
        vr: "CS",
        vm: "1",
    },
    CertifiedTimestamp: {
        tag: "04000310",
        vr: "OB",
        vm: "1",
    },
    DigitalSignaturePurposeCodeSequence: {
        tag: "04000401",
        vr: "SQ",
        vm: "1",
    },
    ReferencedDigitalSignatureSequence: {
        tag: "04000402",
        vr: "SQ",
        vm: "1",
    },
    ReferencedSOPInstanceMACSequence: {
        tag: "04000403",
        vr: "SQ",
        vm: "1",
    },
    MAC: {
        tag: "04000404",
        vr: "OB",
        vm: "1",
    },
    EncryptedAttributesSequence: {
        tag: "04000500",
        vr: "SQ",
        vm: "1",
    },
    EncryptedContentTransferSyntaxUID: {
        tag: "04000510",
        vr: "UI",
        vm: "1",
    },
    EncryptedContent: {
        tag: "04000520",
        vr: "OB",
        vm: "1",
    },
    ModifiedAttributesSequence: {
        tag: "04000550",
        vr: "SQ",
        vm: "1",
    },
    NonconformingModifiedAttributesSequence: {
        tag: "04000551",
        vr: "SQ",
        vm: "1",
    },
    NonconformingDataElementValue: {
        tag: "04000552",
        vr: "OB",
        vm: "1",
    },
    OriginalAttributesSequence: {
        tag: "04000561",
        vr: "SQ",
        vm: "1",
    },
    AttributeModificationDateTime: {
        tag: "04000562",
        vr: "DT",
        vm: "1",
    },
    ModifyingSystem: {
        tag: "04000563",
        vr: "LO",
        vm: "1",
    },
    SourceOfPreviousValues: {
        tag: "04000564",
        vr: "LO",
        vm: "1",
    },
    ReasonForTheAttributeModification: {
        tag: "04000565",
        vr: "CS",
        vm: "1",
    },
    InstanceOriginStatus: {
        tag: "04000600",
        vr: "CS",
        vm: "1",
    },
    EscapeTriplet: {
        tag: "1000xxx0",
        vr: "US",
        vm: "3",
    },
    RunLengthTriplet: {
        tag: "1000xxx1",
        vr: "US",
        vm: "3",
    },
    HuffmanTableSize: {
        tag: "1000xxx2",
        vr: "US",
        vm: "1",
    },
    HuffmanTableTriplet: {
        tag: "1000xxx3",
        vr: "US",
        vm: "3",
    },
    ShiftTableSize: {
        tag: "1000xxx4",
        vr: "US",
        vm: "1",
    },
    ShiftTableTriplet: {
        tag: "1000xxx5",
        vr: "US",
        vm: "3",
    },
    ZonalMap: {
        tag: "1010xxxx",
        vr: "US",
        vm: "1-n",
    },
    NumberOfCopies: {
        tag: "20000010",
        vr: "IS",
        vm: "1",
    },
    PrinterConfigurationSequence: {
        tag: "2000001E",
        vr: "SQ",
        vm: "1",
    },
    PrintPriority: {
        tag: "20000020",
        vr: "CS",
        vm: "1",
    },
    MediumType: {
        tag: "20000030",
        vr: "CS",
        vm: "1",
    },
    FilmDestination: {
        tag: "20000040",
        vr: "CS",
        vm: "1",
    },
    FilmSessionLabel: {
        tag: "20000050",
        vr: "LO",
        vm: "1",
    },
    MemoryAllocation: {
        tag: "20000060",
        vr: "IS",
        vm: "1",
    },
    MaximumMemoryAllocation: {
        tag: "20000061",
        vr: "IS",
        vm: "1",
    },
    ColorImagePrintingFlag: {
        tag: "20000062",
        vr: "CS",
        vm: "1",
    },
    CollationFlag: {
        tag: "20000063",
        vr: "CS",
        vm: "1",
    },
    AnnotationFlag: {
        tag: "20000065",
        vr: "CS",
        vm: "1",
    },
    ImageOverlayFlag: {
        tag: "20000067",
        vr: "CS",
        vm: "1",
    },
    PresentationLUTFlag: {
        tag: "20000069",
        vr: "CS",
        vm: "1",
    },
    ImageBoxPresentationLUTFlag: {
        tag: "2000006A",
        vr: "CS",
        vm: "1",
    },
    MemoryBitDepth: {
        tag: "200000A0",
        vr: "US",
        vm: "1",
    },
    PrintingBitDepth: {
        tag: "200000A1",
        vr: "US",
        vm: "1",
    },
    MediaInstalledSequence: {
        tag: "200000A2",
        vr: "SQ",
        vm: "1",
    },
    OtherMediaAvailableSequence: {
        tag: "200000A4",
        vr: "SQ",
        vm: "1",
    },
    SupportedImageDisplayFormatsSequence: {
        tag: "200000A8",
        vr: "SQ",
        vm: "1",
    },
    ReferencedFilmBoxSequence: {
        tag: "20000500",
        vr: "SQ",
        vm: "1",
    },
    ReferencedStoredPrintSequence: {
        tag: "20000510",
        vr: "SQ",
        vm: "1",
    },
    ImageDisplayFormat: {
        tag: "20100010",
        vr: "ST",
        vm: "1",
    },
    AnnotationDisplayFormatID: {
        tag: "20100030",
        vr: "CS",
        vm: "1",
    },
    FilmOrientation: {
        tag: "20100040",
        vr: "CS",
        vm: "1",
    },
    FilmSizeID: {
        tag: "20100050",
        vr: "CS",
        vm: "1",
    },
    PrinterResolutionID: {
        tag: "20100052",
        vr: "CS",
        vm: "1",
    },
    DefaultPrinterResolutionID: {
        tag: "20100054",
        vr: "CS",
        vm: "1",
    },
    MagnificationType: {
        tag: "20100060",
        vr: "CS",
        vm: "1",
    },
    SmoothingType: {
        tag: "20100080",
        vr: "CS",
        vm: "1",
    },
    DefaultMagnificationType: {
        tag: "201000A6",
        vr: "CS",
        vm: "1",
    },
    OtherMagnificationTypesAvailable: {
        tag: "201000A7",
        vr: "CS",
        vm: "1-n",
    },
    DefaultSmoothingType: {
        tag: "201000A8",
        vr: "CS",
        vm: "1",
    },
    OtherSmoothingTypesAvailable: {
        tag: "201000A9",
        vr: "CS",
        vm: "1-n",
    },
    BorderDensity: {
        tag: "20100100",
        vr: "CS",
        vm: "1",
    },
    EmptyImageDensity: {
        tag: "20100110",
        vr: "CS",
        vm: "1",
    },
    MinDensity: {
        tag: "20100120",
        vr: "US",
        vm: "1",
    },
    MaxDensity: {
        tag: "20100130",
        vr: "US",
        vm: "1",
    },
    Trim: {
        tag: "20100140",
        vr: "CS",
        vm: "1",
    },
    ConfigurationInformation: {
        tag: "20100150",
        vr: "ST",
        vm: "1",
    },
    ConfigurationInformationDescription: {
        tag: "20100152",
        vr: "LT",
        vm: "1",
    },
    MaximumCollatedFilms: {
        tag: "20100154",
        vr: "IS",
        vm: "1",
    },
    Illumination: {
        tag: "2010015E",
        vr: "US",
        vm: "1",
    },
    ReflectedAmbientLight: {
        tag: "20100160",
        vr: "US",
        vm: "1",
    },
    PrinterPixelSpacing: {
        tag: "20100376",
        vr: "DS",
        vm: "2",
    },
    ReferencedFilmSessionSequence: {
        tag: "20100500",
        vr: "SQ",
        vm: "1",
    },
    ReferencedImageBoxSequence: {
        tag: "20100510",
        vr: "SQ",
        vm: "1",
    },
    ReferencedBasicAnnotationBoxSequence: {
        tag: "20100520",
        vr: "SQ",
        vm: "1",
    },
    ImageBoxPosition: {
        tag: "20200010",
        vr: "US",
        vm: "1",
    },
    Polarity: {
        tag: "20200020",
        vr: "CS",
        vm: "1",
    },
    RequestedImageSize: {
        tag: "20200030",
        vr: "DS",
        vm: "1",
    },
    RequestedDecimateCropBehavior: {
        tag: "20200040",
        vr: "CS",
        vm: "1",
    },
    RequestedResolutionID: {
        tag: "20200050",
        vr: "CS",
        vm: "1",
    },
    RequestedImageSizeFlag: {
        tag: "202000A0",
        vr: "CS",
        vm: "1",
    },
    DecimateCropResult: {
        tag: "202000A2",
        vr: "CS",
        vm: "1",
    },
    BasicGrayscaleImageSequence: {
        tag: "20200110",
        vr: "SQ",
        vm: "1",
    },
    BasicColorImageSequence: {
        tag: "20200111",
        vr: "SQ",
        vm: "1",
    },
    ReferencedImageOverlayBoxSequence: {
        tag: "20200130",
        vr: "SQ",
        vm: "1",
    },
    ReferencedVOILUTBoxSequence: {
        tag: "20200140",
        vr: "SQ",
        vm: "1",
    },
    AnnotationPosition: {
        tag: "20300010",
        vr: "US",
        vm: "1",
    },
    TextString: {
        tag: "20300020",
        vr: "LO",
        vm: "1",
    },
    ReferencedOverlayPlaneSequence: {
        tag: "20400010",
        vr: "SQ",
        vm: "1",
    },
    ReferencedOverlayPlaneGroups: {
        tag: "20400011",
        vr: "US",
        vm: "1-99",
    },
    OverlayPixelDataSequence: {
        tag: "20400020",
        vr: "SQ",
        vm: "1",
    },
    OverlayMagnificationType: {
        tag: "20400060",
        vr: "CS",
        vm: "1",
    },
    OverlaySmoothingType: {
        tag: "20400070",
        vr: "CS",
        vm: "1",
    },
    OverlayOrImageMagnification: {
        tag: "20400072",
        vr: "CS",
        vm: "1",
    },
    MagnifyToNumberOfColumns: {
        tag: "20400074",
        vr: "US",
        vm: "1",
    },
    OverlayForegroundDensity: {
        tag: "20400080",
        vr: "CS",
        vm: "1",
    },
    OverlayBackgroundDensity: {
        tag: "20400082",
        vr: "CS",
        vm: "1",
    },
    OverlayMode: {
        tag: "20400090",
        vr: "CS",
        vm: "1",
    },
    ThresholdDensity: {
        tag: "20400100",
        vr: "CS",
        vm: "1",
    },
    ReferencedImageBoxSequenceRetired: {
        tag: "20400500",
        vr: "SQ",
        vm: "1",
    },
    PresentationLUTSequence: {
        tag: "20500010",
        vr: "SQ",
        vm: "1",
    },
    PresentationLUTShape: {
        tag: "20500020",
        vr: "CS",
        vm: "1",
    },
    ReferencedPresentationLUTSequence: {
        tag: "20500500",
        vr: "SQ",
        vm: "1",
    },
    PrintJobID: {
        tag: "21000010",
        vr: "SH",
        vm: "1",
    },
    ExecutionStatus: {
        tag: "21000020",
        vr: "CS",
        vm: "1",
    },
    ExecutionStatusInfo: {
        tag: "21000030",
        vr: "CS",
        vm: "1",
    },
    CreationDate: {
        tag: "21000040",
        vr: "DA",
        vm: "1",
    },
    CreationTime: {
        tag: "21000050",
        vr: "TM",
        vm: "1",
    },
    Originator: {
        tag: "21000070",
        vr: "AE",
        vm: "1",
    },
    DestinationAE: {
        tag: "21000140",
        vr: "AE",
        vm: "1",
    },
    OwnerID: {
        tag: "21000160",
        vr: "SH",
        vm: "1",
    },
    NumberOfFilms: {
        tag: "21000170",
        vr: "IS",
        vm: "1",
    },
    ReferencedPrintJobSequencePullStoredPrint: {
        tag: "21000500",
        vr: "SQ",
        vm: "1",
    },
    PrinterStatus: {
        tag: "21100010",
        vr: "CS",
        vm: "1",
    },
    PrinterStatusInfo: {
        tag: "21100020",
        vr: "CS",
        vm: "1",
    },
    PrinterName: {
        tag: "21100030",
        vr: "LO",
        vm: "1",
    },
    PrintQueueID: {
        tag: "21100099",
        vr: "SH",
        vm: "1",
    },
    QueueStatus: {
        tag: "21200010",
        vr: "CS",
        vm: "1",
    },
    PrintJobDescriptionSequence: {
        tag: "21200050",
        vr: "SQ",
        vm: "1",
    },
    ReferencedPrintJobSequence: {
        tag: "21200070",
        vr: "SQ",
        vm: "1",
    },
    PrintManagementCapabilitiesSequence: {
        tag: "21300010",
        vr: "SQ",
        vm: "1",
    },
    PrinterCharacteristicsSequence: {
        tag: "21300015",
        vr: "SQ",
        vm: "1",
    },
    FilmBoxContentSequence: {
        tag: "21300030",
        vr: "SQ",
        vm: "1",
    },
    ImageBoxContentSequence: {
        tag: "21300040",
        vr: "SQ",
        vm: "1",
    },
    AnnotationContentSequence: {
        tag: "21300050",
        vr: "SQ",
        vm: "1",
    },
    ImageOverlayBoxContentSequence: {
        tag: "21300060",
        vr: "SQ",
        vm: "1",
    },
    PresentationLUTContentSequence: {
        tag: "21300080",
        vr: "SQ",
        vm: "1",
    },
    ProposedStudySequence: {
        tag: "213000A0",
        vr: "SQ",
        vm: "1",
    },
    OriginalImageSequence: {
        tag: "213000C0",
        vr: "SQ",
        vm: "1",
    },
    LabelUsingInformationExtractedFromInstances: {
        tag: "22000001",
        vr: "CS",
        vm: "1",
    },
    LabelText: {
        tag: "22000002",
        vr: "UT",
        vm: "1",
    },
    LabelStyleSelection: {
        tag: "22000003",
        vr: "CS",
        vm: "1",
    },
    MediaDisposition: {
        tag: "22000004",
        vr: "LT",
        vm: "1",
    },
    BarcodeValue: {
        tag: "22000005",
        vr: "LT",
        vm: "1",
    },
    BarcodeSymbology: {
        tag: "22000006",
        vr: "CS",
        vm: "1",
    },
    AllowMediaSplitting: {
        tag: "22000007",
        vr: "CS",
        vm: "1",
    },
    IncludeNonDICOMObjects: {
        tag: "22000008",
        vr: "CS",
        vm: "1",
    },
    IncludeDisplayApplication: {
        tag: "22000009",
        vr: "CS",
        vm: "1",
    },
    PreserveCompositeInstancesAfterMediaCreation: {
        tag: "2200000A",
        vr: "CS",
        vm: "1",
    },
    TotalNumberOfPiecesOfMediaCreated: {
        tag: "2200000B",
        vr: "US",
        vm: "1",
    },
    RequestedMediaApplicationProfile: {
        tag: "2200000C",
        vr: "LO",
        vm: "1",
    },
    ReferencedStorageMediaSequence: {
        tag: "2200000D",
        vr: "SQ",
        vm: "1",
    },
    FailureAttributes: {
        tag: "2200000E",
        vr: "AT",
        vm: "1-n",
    },
    AllowLossyCompression: {
        tag: "2200000F",
        vr: "CS",
        vm: "1",
    },
    RequestPriority: {
        tag: "22000020",
        vr: "CS",
        vm: "1",
    },
    RTImageLabel: {
        tag: "30020002",
        vr: "SH",
        vm: "1",
    },
    RTImageName: {
        tag: "30020003",
        vr: "LO",
        vm: "1",
    },
    RTImageDescription: {
        tag: "30020004",
        vr: "ST",
        vm: "1",
    },
    ReportedValuesOrigin: {
        tag: "3002000A",
        vr: "CS",
        vm: "1",
    },
    RTImagePlane: {
        tag: "3002000C",
        vr: "CS",
        vm: "1",
    },
    XRayImageReceptorTranslation: {
        tag: "3002000D",
        vr: "DS",
        vm: "3",
    },
    XRayImageReceptorAngle: {
        tag: "3002000E",
        vr: "DS",
        vm: "1",
    },
    RTImageOrientation: {
        tag: "30020010",
        vr: "DS",
        vm: "6",
    },
    ImagePlanePixelSpacing: {
        tag: "30020011",
        vr: "DS",
        vm: "2",
    },
    RTImagePosition: {
        tag: "30020012",
        vr: "DS",
        vm: "2",
    },
    RadiationMachineName: {
        tag: "30020020",
        vr: "SH",
        vm: "1",
    },
    RadiationMachineSAD: {
        tag: "30020022",
        vr: "DS",
        vm: "1",
    },
    RadiationMachineSSD: {
        tag: "30020024",
        vr: "DS",
        vm: "1",
    },
    RTImageSID: {
        tag: "30020026",
        vr: "DS",
        vm: "1",
    },
    SourceToReferenceObjectDistance: {
        tag: "30020028",
        vr: "DS",
        vm: "1",
    },
    FractionNumber: {
        tag: "30020029",
        vr: "IS",
        vm: "1",
    },
    ExposureSequence: {
        tag: "30020030",
        vr: "SQ",
        vm: "1",
    },
    MetersetExposure: {
        tag: "30020032",
        vr: "DS",
        vm: "1",
    },
    DiaphragmPosition: {
        tag: "30020034",
        vr: "DS",
        vm: "4",
    },
    FluenceMapSequence: {
        tag: "30020040",
        vr: "SQ",
        vm: "1",
    },
    FluenceDataSource: {
        tag: "30020041",
        vr: "CS",
        vm: "1",
    },
    FluenceDataScale: {
        tag: "30020042",
        vr: "DS",
        vm: "1",
    },
    PrimaryFluenceModeSequence: {
        tag: "30020050",
        vr: "SQ",
        vm: "1",
    },
    FluenceMode: {
        tag: "30020051",
        vr: "CS",
        vm: "1",
    },
    FluenceModeID: {
        tag: "30020052",
        vr: "SH",
        vm: "1",
    },
    SelectedFrameNumber: {
        tag: "30020100",
        vr: "IS",
        vm: "1",
    },
    SelectedFrameFunctionalGroupsSequence: {
        tag: "30020101",
        vr: "SQ",
        vm: "1",
    },
    RTImageFrameGeneralContentSequence: {
        tag: "30020102",
        vr: "SQ",
        vm: "1",
    },
    RTImageFrameContextSequence: {
        tag: "30020103",
        vr: "SQ",
        vm: "1",
    },
    RTImageScopeSequence: {
        tag: "30020104",
        vr: "SQ",
        vm: "1",
    },
    BeamModifierCoordinatesPresenceFlag: {
        tag: "30020105",
        vr: "CS",
        vm: "1",
    },
    StartCumulativeMeterset: {
        tag: "30020106",
        vr: "FD",
        vm: "1",
    },
    StopCumulativeMeterset: {
        tag: "30020107",
        vr: "FD",
        vm: "1",
    },
    RTAcquisitionPatientPositionSequence: {
        tag: "30020108",
        vr: "SQ",
        vm: "1",
    },
    RTImageFrameImagingDevicePositionSequence: {
        tag: "30020109",
        vr: "SQ",
        vm: "1",
    },
    RTImageFramekVRadiationAcquisitionSequence: {
        tag: "3002010A",
        vr: "SQ",
        vm: "1",
    },
    RTImageFrameMVRadiationAcquisitionSequence: {
        tag: "3002010B",
        vr: "SQ",
        vm: "1",
    },
    RTImageFrameRadiationAcquisitionSequence: {
        tag: "3002010C",
        vr: "SQ",
        vm: "1",
    },
    ImagingSourcePositionSequence: {
        tag: "3002010D",
        vr: "SQ",
        vm: "1",
    },
    ImageReceptorPositionSequence: {
        tag: "3002010E",
        vr: "SQ",
        vm: "1",
    },
    DevicePositionToEquipmentMappingMatrix: {
        tag: "3002010F",
        vr: "FD",
        vm: "16",
    },
    DevicePositionParameterSequence: {
        tag: "30020110",
        vr: "SQ",
        vm: "1",
    },
    ImagingSourceLocationSpecificationType: {
        tag: "30020111",
        vr: "CS",
        vm: "1",
    },
    ImagingDeviceLocationMatrixSequence: {
        tag: "30020112",
        vr: "SQ",
        vm: "1",
    },
    ImagingDeviceLocationParameterSequence: {
        tag: "30020113",
        vr: "SQ",
        vm: "1",
    },
    ImagingApertureSequence: {
        tag: "30020114",
        vr: "SQ",
        vm: "1",
    },
    ImagingApertureSpecificationType: {
        tag: "30020115",
        vr: "CS",
        vm: "1",
    },
    NumberOfAcquisitionDevices: {
        tag: "30020116",
        vr: "US",
        vm: "1",
    },
    AcquisitionDeviceSequence: {
        tag: "30020117",
        vr: "SQ",
        vm: "1",
    },
    AcquisitionTaskSequence: {
        tag: "30020118",
        vr: "SQ",
        vm: "1",
    },
    AcquisitionTaskWorkitemCodeSequence: {
        tag: "30020119",
        vr: "SQ",
        vm: "1",
    },
    AcquisitionSubtaskSequence: {
        tag: "3002011A",
        vr: "SQ",
        vm: "1",
    },
    SubtaskWorkitemCodeSequence: {
        tag: "3002011B",
        vr: "SQ",
        vm: "1",
    },
    AcquisitionTaskIndex: {
        tag: "3002011C",
        vr: "US",
        vm: "1",
    },
    AcquisitionSubtaskIndex: {
        tag: "3002011D",
        vr: "US",
        vm: "1",
    },
    ReferencedBaselineParametersRTRadiationInstanceSequence: {
        tag: "3002011E",
        vr: "SQ",
        vm: "1",
    },
    PositionAcquisitionTemplateIdentificationSequence: {
        tag: "3002011F",
        vr: "SQ",
        vm: "1",
    },
    PositionAcquisitionTemplateID: {
        tag: "30020120",
        vr: "ST",
        vm: "1",
    },
    PositionAcquisitionTemplateName: {
        tag: "30020121",
        vr: "LO",
        vm: "1",
    },
    PositionAcquisitionTemplateCodeSequence: {
        tag: "30020122",
        vr: "SQ",
        vm: "1",
    },
    PositionAcquisitionTemplateDescription: {
        tag: "30020123",
        vr: "LT",
        vm: "1",
    },
    AcquisitionTaskApplicabilitySequence: {
        tag: "30020124",
        vr: "SQ",
        vm: "1",
    },
    ProjectionImagingAcquisitionParameterSequence: {
        tag: "30020125",
        vr: "SQ",
        vm: "1",
    },
    CTImagingAcquisitionParameterSequence: {
        tag: "30020126",
        vr: "SQ",
        vm: "1",
    },
    KVImagingGenerationParametersSequence: {
        tag: "30020127",
        vr: "SQ",
        vm: "1",
    },
    MVImagingGenerationParametersSequence: {
        tag: "30020128",
        vr: "SQ",
        vm: "1",
    },
    AcquisitionSignalType: {
        tag: "30020129",
        vr: "CS",
        vm: "1",
    },
    AcquisitionMethod: {
        tag: "3002012A",
        vr: "CS",
        vm: "1",
    },
    ScanStartPositionSequence: {
        tag: "3002012B",
        vr: "SQ",
        vm: "1",
    },
    ScanStopPositionSequence: {
        tag: "3002012C",
        vr: "SQ",
        vm: "1",
    },
    ImagingSourceToBeamModifierDefinitionPlaneDistance: {
        tag: "3002012D",
        vr: "FD",
        vm: "1",
    },
    ScanArcType: {
        tag: "3002012E",
        vr: "CS",
        vm: "1",
    },
    DetectorPositioningType: {
        tag: "3002012F",
        vr: "CS",
        vm: "1",
    },
    AdditionalRTAccessoryDeviceSequence: {
        tag: "30020130",
        vr: "SQ",
        vm: "1",
    },
    DeviceSpecificAcquisitionParameterSequence: {
        tag: "30020131",
        vr: "SQ",
        vm: "1",
    },
    ReferencedPositionReferenceInstanceSequence: {
        tag: "30020132",
        vr: "SQ",
        vm: "1",
    },
    EnergyDerivationCodeSequence: {
        tag: "30020133",
        vr: "SQ",
        vm: "1",
    },
    MaximumCumulativeMetersetExposure: {
        tag: "30020134",
        vr: "FD",
        vm: "1",
    },
    AcquisitionInitiationSequence: {
        tag: "30020135",
        vr: "SQ",
        vm: "1",
    },
    RTConeBeamImagingGeometrySequence: {
        tag: "30020136",
        vr: "SQ",
        vm: "1",
    },
    DVHType: {
        tag: "30040001",
        vr: "CS",
        vm: "1",
    },
    DoseUnits: {
        tag: "30040002",
        vr: "CS",
        vm: "1",
    },
    DoseType: {
        tag: "30040004",
        vr: "CS",
        vm: "1",
    },
    SpatialTransformOfDose: {
        tag: "30040005",
        vr: "CS",
        vm: "1",
    },
    DoseComment: {
        tag: "30040006",
        vr: "LO",
        vm: "1",
    },
    NormalizationPoint: {
        tag: "30040008",
        vr: "DS",
        vm: "3",
    },
    DoseSummationType: {
        tag: "3004000A",
        vr: "CS",
        vm: "1",
    },
    GridFrameOffsetVector: {
        tag: "3004000C",
        vr: "DS",
        vm: "2-n",
    },
    DoseGridScaling: {
        tag: "3004000E",
        vr: "DS",
        vm: "1",
    },
    RTDoseROISequence: {
        tag: "30040010",
        vr: "SQ",
        vm: "1",
    },
    DoseValue: {
        tag: "30040012",
        vr: "DS",
        vm: "1",
    },
    TissueHeterogeneityCorrection: {
        tag: "30040014",
        vr: "CS",
        vm: "1-3",
    },
    RecommendedIsodoseLevelSequence: {
        tag: "30040016",
        vr: "SQ",
        vm: "1",
    },
    DVHNormalizationPoint: {
        tag: "30040040",
        vr: "DS",
        vm: "3",
    },
    DVHNormalizationDoseValue: {
        tag: "30040042",
        vr: "DS",
        vm: "1",
    },
    DVHSequence: {
        tag: "30040050",
        vr: "SQ",
        vm: "1",
    },
    DVHDoseScaling: {
        tag: "30040052",
        vr: "DS",
        vm: "1",
    },
    DVHVolumeUnits: {
        tag: "30040054",
        vr: "CS",
        vm: "1",
    },
    DVHNumberOfBins: {
        tag: "30040056",
        vr: "IS",
        vm: "1",
    },
    DVHData: {
        tag: "30040058",
        vr: "DS",
        vm: "2-2n",
    },
    DVHReferencedROISequence: {
        tag: "30040060",
        vr: "SQ",
        vm: "1",
    },
    DVHROIContributionType: {
        tag: "30040062",
        vr: "CS",
        vm: "1",
    },
    DVHMinimumDose: {
        tag: "30040070",
        vr: "DS",
        vm: "1",
    },
    DVHMaximumDose: {
        tag: "30040072",
        vr: "DS",
        vm: "1",
    },
    DVHMeanDose: {
        tag: "30040074",
        vr: "DS",
        vm: "1",
    },
    DoseCalculationModelSequence: {
        tag: "30040080",
        vr: "SQ",
        vm: "1",
    },
    DoseCalculationAlgorithmSequence: {
        tag: "30040081",
        vr: "SQ",
        vm: "1",
    },
    CommissioningStatus: {
        tag: "30040082",
        vr: "CS",
        vm: "1",
    },
    DoseCalculationModelParameterSequence: {
        tag: "30040083",
        vr: "SQ",
        vm: "1",
    },
    DoseDepositionCalculationMedium: {
        tag: "30040084",
        vr: "CS",
        vm: "1",
    },
    StructureSetLabel: {
        tag: "30060002",
        vr: "SH",
        vm: "1",
    },
    StructureSetName: {
        tag: "30060004",
        vr: "LO",
        vm: "1",
    },
    StructureSetDescription: {
        tag: "30060006",
        vr: "ST",
        vm: "1",
    },
    StructureSetDate: {
        tag: "30060008",
        vr: "DA",
        vm: "1",
    },
    StructureSetTime: {
        tag: "30060009",
        vr: "TM",
        vm: "1",
    },
    ReferencedFrameOfReferenceSequence: {
        tag: "30060010",
        vr: "SQ",
        vm: "1",
    },
    RTReferencedStudySequence: {
        tag: "30060012",
        vr: "SQ",
        vm: "1",
    },
    RTReferencedSeriesSequence: {
        tag: "30060014",
        vr: "SQ",
        vm: "1",
    },
    ContourImageSequence: {
        tag: "30060016",
        vr: "SQ",
        vm: "1",
    },
    PredecessorStructureSetSequence: {
        tag: "30060018",
        vr: "SQ",
        vm: "1",
    },
    StructureSetROISequence: {
        tag: "30060020",
        vr: "SQ",
        vm: "1",
    },
    ROINumber: {
        tag: "30060022",
        vr: "IS",
        vm: "1",
    },
    ReferencedFrameOfReferenceUID: {
        tag: "30060024",
        vr: "UI",
        vm: "1",
    },
    ROIName: {
        tag: "30060026",
        vr: "LO",
        vm: "1",
    },
    ROIDescription: {
        tag: "30060028",
        vr: "ST",
        vm: "1",
    },
    ROIDisplayColor: {
        tag: "3006002A",
        vr: "IS",
        vm: "3",
    },
    ROIVolume: {
        tag: "3006002C",
        vr: "DS",
        vm: "1",
    },
    ROIDateTime: {
        tag: "3006002D",
        vr: "DT",
        vm: "1",
    },
    ROIObservationDateTime: {
        tag: "3006002E",
        vr: "DT",
        vm: "1",
    },
    RTRelatedROISequence: {
        tag: "30060030",
        vr: "SQ",
        vm: "1",
    },
    RTROIRelationship: {
        tag: "30060033",
        vr: "CS",
        vm: "1",
    },
    ROIGenerationAlgorithm: {
        tag: "30060036",
        vr: "CS",
        vm: "1",
    },
    ROIDerivationAlgorithmIdentificationSequence: {
        tag: "30060037",
        vr: "SQ",
        vm: "1",
    },
    ROIGenerationDescription: {
        tag: "30060038",
        vr: "LO",
        vm: "1",
    },
    ROIContourSequence: {
        tag: "30060039",
        vr: "SQ",
        vm: "1",
    },
    ContourSequence: {
        tag: "30060040",
        vr: "SQ",
        vm: "1",
    },
    ContourGeometricType: {
        tag: "30060042",
        vr: "CS",
        vm: "1",
    },
    ContourSlabThickness: {
        tag: "30060044",
        vr: "DS",
        vm: "1",
    },
    ContourOffsetVector: {
        tag: "30060045",
        vr: "DS",
        vm: "3",
    },
    NumberOfContourPoints: {
        tag: "30060046",
        vr: "IS",
        vm: "1",
    },
    ContourNumber: {
        tag: "30060048",
        vr: "IS",
        vm: "1",
    },
    AttachedContours: {
        tag: "30060049",
        vr: "IS",
        vm: "1-n",
    },
    SourcePixelPlanesCharacteristicsSequence: {
        tag: "3006004A",
        vr: "SQ",
        vm: "1",
    },
    SourceSeriesSequence: {
        tag: "3006004B",
        vr: "SQ",
        vm: "1",
    },
    SourceSeriesInformationSequence: {
        tag: "3006004C",
        vr: "SQ",
        vm: "1",
    },
    ROICreatorSequence: {
        tag: "3006004D",
        vr: "SQ",
        vm: "1",
    },
    ROIInterpreterSequence: {
        tag: "3006004E",
        vr: "SQ",
        vm: "1",
    },
    ROIObservationContextCodeSequence: {
        tag: "3006004F",
        vr: "SQ",
        vm: "1",
    },
    ContourData: {
        tag: "30060050",
        vr: "DS",
        vm: "3-3n",
    },
    RTROIObservationsSequence: {
        tag: "30060080",
        vr: "SQ",
        vm: "1",
    },
    ObservationNumber: {
        tag: "30060082",
        vr: "IS",
        vm: "1",
    },
    ReferencedROINumber: {
        tag: "30060084",
        vr: "IS",
        vm: "1",
    },
    ROIObservationLabel: {
        tag: "30060085",
        vr: "SH",
        vm: "1",
    },
    RTROIIdentificationCodeSequence: {
        tag: "30060086",
        vr: "SQ",
        vm: "1",
    },
    ROIObservationDescription: {
        tag: "30060088",
        vr: "ST",
        vm: "1",
    },
    RelatedRTROIObservationsSequence: {
        tag: "300600A0",
        vr: "SQ",
        vm: "1",
    },
    RTROIInterpretedType: {
        tag: "300600A4",
        vr: "CS",
        vm: "1",
    },
    ROIInterpreter: {
        tag: "300600A6",
        vr: "PN",
        vm: "1",
    },
    ROIPhysicalPropertiesSequence: {
        tag: "300600B0",
        vr: "SQ",
        vm: "1",
    },
    ROIPhysicalProperty: {
        tag: "300600B2",
        vr: "CS",
        vm: "1",
    },
    ROIPhysicalPropertyValue: {
        tag: "300600B4",
        vr: "DS",
        vm: "1",
    },
    ROIElementalCompositionSequence: {
        tag: "300600B6",
        vr: "SQ",
        vm: "1",
    },
    ROIElementalCompositionAtomicNumber: {
        tag: "300600B7",
        vr: "US",
        vm: "1",
    },
    ROIElementalCompositionAtomicMassFraction: {
        tag: "300600B8",
        vr: "FL",
        vm: "1",
    },
    AdditionalRTROIIdentificationCodeSequence: {
        tag: "300600B9",
        vr: "SQ",
        vm: "1",
    },
    FrameOfReferenceRelationshipSequence: {
        tag: "300600C0",
        vr: "SQ",
        vm: "1",
    },
    RelatedFrameOfReferenceUID: {
        tag: "300600C2",
        vr: "UI",
        vm: "1",
    },
    FrameOfReferenceTransformationType: {
        tag: "300600C4",
        vr: "CS",
        vm: "1",
    },
    FrameOfReferenceTransformationMatrix: {
        tag: "300600C6",
        vr: "DS",
        vm: "16",
    },
    FrameOfReferenceTransformationComment: {
        tag: "300600C8",
        vr: "LO",
        vm: "1",
    },
    PatientLocationCoordinatesSequence: {
        tag: "300600C9",
        vr: "SQ",
        vm: "1",
    },
    PatientLocationCoordinatesCodeSequence: {
        tag: "300600CA",
        vr: "SQ",
        vm: "1",
    },
    PatientSupportPositionSequence: {
        tag: "300600CB",
        vr: "SQ",
        vm: "1",
    },
    MeasuredDoseReferenceSequence: {
        tag: "30080010",
        vr: "SQ",
        vm: "1",
    },
    MeasuredDoseDescription: {
        tag: "30080012",
        vr: "ST",
        vm: "1",
    },
    MeasuredDoseType: {
        tag: "30080014",
        vr: "CS",
        vm: "1",
    },
    MeasuredDoseValue: {
        tag: "30080016",
        vr: "DS",
        vm: "1",
    },
    TreatmentSessionBeamSequence: {
        tag: "30080020",
        vr: "SQ",
        vm: "1",
    },
    TreatmentSessionIonBeamSequence: {
        tag: "30080021",
        vr: "SQ",
        vm: "1",
    },
    CurrentFractionNumber: {
        tag: "30080022",
        vr: "IS",
        vm: "1",
    },
    TreatmentControlPointDate: {
        tag: "30080024",
        vr: "DA",
        vm: "1",
    },
    TreatmentControlPointTime: {
        tag: "30080025",
        vr: "TM",
        vm: "1",
    },
    TreatmentTerminationStatus: {
        tag: "3008002A",
        vr: "CS",
        vm: "1",
    },
    TreatmentTerminationCode: {
        tag: "3008002B",
        vr: "SH",
        vm: "1",
    },
    TreatmentVerificationStatus: {
        tag: "3008002C",
        vr: "CS",
        vm: "1",
    },
    ReferencedTreatmentRecordSequence: {
        tag: "30080030",
        vr: "SQ",
        vm: "1",
    },
    SpecifiedPrimaryMeterset: {
        tag: "30080032",
        vr: "DS",
        vm: "1",
    },
    SpecifiedSecondaryMeterset: {
        tag: "30080033",
        vr: "DS",
        vm: "1",
    },
    DeliveredPrimaryMeterset: {
        tag: "30080036",
        vr: "DS",
        vm: "1",
    },
    DeliveredSecondaryMeterset: {
        tag: "30080037",
        vr: "DS",
        vm: "1",
    },
    SpecifiedTreatmentTime: {
        tag: "3008003A",
        vr: "DS",
        vm: "1",
    },
    DeliveredTreatmentTime: {
        tag: "3008003B",
        vr: "DS",
        vm: "1",
    },
    ControlPointDeliverySequence: {
        tag: "30080040",
        vr: "SQ",
        vm: "1",
    },
    IonControlPointDeliverySequence: {
        tag: "30080041",
        vr: "SQ",
        vm: "1",
    },
    SpecifiedMeterset: {
        tag: "30080042",
        vr: "DS",
        vm: "1",
    },
    DeliveredMeterset: {
        tag: "30080044",
        vr: "DS",
        vm: "1",
    },
    MetersetRateSet: {
        tag: "30080045",
        vr: "FL",
        vm: "1",
    },
    MetersetRateDelivered: {
        tag: "30080046",
        vr: "FL",
        vm: "1",
    },
    ScanSpotMetersetsDelivered: {
        tag: "30080047",
        vr: "FL",
        vm: "1-n",
    },
    DoseRateDelivered: {
        tag: "30080048",
        vr: "DS",
        vm: "1",
    },
    TreatmentSummaryCalculatedDoseReferenceSequence: {
        tag: "30080050",
        vr: "SQ",
        vm: "1",
    },
    CumulativeDoseToDoseReference: {
        tag: "30080052",
        vr: "DS",
        vm: "1",
    },
    FirstTreatmentDate: {
        tag: "30080054",
        vr: "DA",
        vm: "1",
    },
    MostRecentTreatmentDate: {
        tag: "30080056",
        vr: "DA",
        vm: "1",
    },
    NumberOfFractionsDelivered: {
        tag: "3008005A",
        vr: "IS",
        vm: "1",
    },
    OverrideSequence: {
        tag: "30080060",
        vr: "SQ",
        vm: "1",
    },
    ParameterSequencePointer: {
        tag: "30080061",
        vr: "AT",
        vm: "1",
    },
    OverrideParameterPointer: {
        tag: "30080062",
        vr: "AT",
        vm: "1",
    },
    ParameterItemIndex: {
        tag: "30080063",
        vr: "IS",
        vm: "1",
    },
    MeasuredDoseReferenceNumber: {
        tag: "30080064",
        vr: "IS",
        vm: "1",
    },
    ParameterPointer: {
        tag: "30080065",
        vr: "AT",
        vm: "1",
    },
    OverrideReason: {
        tag: "30080066",
        vr: "ST",
        vm: "1",
    },
    ParameterValueNumber: {
        tag: "30080067",
        vr: "US",
        vm: "1",
    },
    CorrectedParameterSequence: {
        tag: "30080068",
        vr: "SQ",
        vm: "1",
    },
    CorrectionValue: {
        tag: "3008006A",
        vr: "FL",
        vm: "1",
    },
    CalculatedDoseReferenceSequence: {
        tag: "30080070",
        vr: "SQ",
        vm: "1",
    },
    CalculatedDoseReferenceNumber: {
        tag: "30080072",
        vr: "IS",
        vm: "1",
    },
    CalculatedDoseReferenceDescription: {
        tag: "30080074",
        vr: "ST",
        vm: "1",
    },
    CalculatedDoseReferenceDoseValue: {
        tag: "30080076",
        vr: "DS",
        vm: "1",
    },
    StartMeterset: {
        tag: "30080078",
        vr: "DS",
        vm: "1",
    },
    EndMeterset: {
        tag: "3008007A",
        vr: "DS",
        vm: "1",
    },
    ReferencedMeasuredDoseReferenceSequence: {
        tag: "30080080",
        vr: "SQ",
        vm: "1",
    },
    ReferencedMeasuredDoseReferenceNumber: {
        tag: "30080082",
        vr: "IS",
        vm: "1",
    },
    ReferencedCalculatedDoseReferenceSequence: {
        tag: "30080090",
        vr: "SQ",
        vm: "1",
    },
    ReferencedCalculatedDoseReferenceNumber: {
        tag: "30080092",
        vr: "IS",
        vm: "1",
    },
    BeamLimitingDeviceLeafPairsSequence: {
        tag: "300800A0",
        vr: "SQ",
        vm: "1",
    },
    EnhancedRTBeamLimitingDeviceSequence: {
        tag: "300800A1",
        vr: "SQ",
        vm: "1",
    },
    EnhancedRTBeamLimitingOpeningSequence: {
        tag: "300800A2",
        vr: "SQ",
        vm: "1",
    },
    EnhancedRTBeamLimitingDeviceDefinitionFlag: {
        tag: "300800A3",
        vr: "CS",
        vm: "1",
    },
    ParallelRTBeamDelimiterOpeningExtents: {
        tag: "300800A4",
        vr: "FD",
        vm: "2-2n",
    },
    RecordedWedgeSequence: {
        tag: "300800B0",
        vr: "SQ",
        vm: "1",
    },
    RecordedCompensatorSequence: {
        tag: "300800C0",
        vr: "SQ",
        vm: "1",
    },
    RecordedBlockSequence: {
        tag: "300800D0",
        vr: "SQ",
        vm: "1",
    },
    RecordedBlockSlabSequence: {
        tag: "300800D1",
        vr: "SQ",
        vm: "1",
    },
    TreatmentSummaryMeasuredDoseReferenceSequence: {
        tag: "300800E0",
        vr: "SQ",
        vm: "1",
    },
    RecordedSnoutSequence: {
        tag: "300800F0",
        vr: "SQ",
        vm: "1",
    },
    RecordedRangeShifterSequence: {
        tag: "300800F2",
        vr: "SQ",
        vm: "1",
    },
    RecordedLateralSpreadingDeviceSequence: {
        tag: "300800F4",
        vr: "SQ",
        vm: "1",
    },
    RecordedRangeModulatorSequence: {
        tag: "300800F6",
        vr: "SQ",
        vm: "1",
    },
    RecordedSourceSequence: {
        tag: "30080100",
        vr: "SQ",
        vm: "1",
    },
    SourceSerialNumber: {
        tag: "30080105",
        vr: "LO",
        vm: "1",
    },
    TreatmentSessionApplicationSetupSequence: {
        tag: "30080110",
        vr: "SQ",
        vm: "1",
    },
    ApplicationSetupCheck: {
        tag: "30080116",
        vr: "CS",
        vm: "1",
    },
    RecordedBrachyAccessoryDeviceSequence: {
        tag: "30080120",
        vr: "SQ",
        vm: "1",
    },
    ReferencedBrachyAccessoryDeviceNumber: {
        tag: "30080122",
        vr: "IS",
        vm: "1",
    },
    RecordedChannelSequence: {
        tag: "30080130",
        vr: "SQ",
        vm: "1",
    },
    SpecifiedChannelTotalTime: {
        tag: "30080132",
        vr: "DS",
        vm: "1",
    },
    DeliveredChannelTotalTime: {
        tag: "30080134",
        vr: "DS",
        vm: "1",
    },
    SpecifiedNumberOfPulses: {
        tag: "30080136",
        vr: "IS",
        vm: "1",
    },
    DeliveredNumberOfPulses: {
        tag: "30080138",
        vr: "IS",
        vm: "1",
    },
    SpecifiedPulseRepetitionInterval: {
        tag: "3008013A",
        vr: "DS",
        vm: "1",
    },
    DeliveredPulseRepetitionInterval: {
        tag: "3008013C",
        vr: "DS",
        vm: "1",
    },
    RecordedSourceApplicatorSequence: {
        tag: "30080140",
        vr: "SQ",
        vm: "1",
    },
    ReferencedSourceApplicatorNumber: {
        tag: "30080142",
        vr: "IS",
        vm: "1",
    },
    RecordedChannelShieldSequence: {
        tag: "30080150",
        vr: "SQ",
        vm: "1",
    },
    ReferencedChannelShieldNumber: {
        tag: "30080152",
        vr: "IS",
        vm: "1",
    },
    BrachyControlPointDeliveredSequence: {
        tag: "30080160",
        vr: "SQ",
        vm: "1",
    },
    SafePositionExitDate: {
        tag: "30080162",
        vr: "DA",
        vm: "1",
    },
    SafePositionExitTime: {
        tag: "30080164",
        vr: "TM",
        vm: "1",
    },
    SafePositionReturnDate: {
        tag: "30080166",
        vr: "DA",
        vm: "1",
    },
    SafePositionReturnTime: {
        tag: "30080168",
        vr: "TM",
        vm: "1",
    },
    PulseSpecificBrachyControlPointDeliveredSequence: {
        tag: "30080171",
        vr: "SQ",
        vm: "1",
    },
    PulseNumber: {
        tag: "30080172",
        vr: "US",
        vm: "1",
    },
    BrachyPulseControlPointDeliveredSequence: {
        tag: "30080173",
        vr: "SQ",
        vm: "1",
    },
    CurrentTreatmentStatus: {
        tag: "30080200",
        vr: "CS",
        vm: "1",
    },
    TreatmentStatusComment: {
        tag: "30080202",
        vr: "ST",
        vm: "1",
    },
    FractionGroupSummarySequence: {
        tag: "30080220",
        vr: "SQ",
        vm: "1",
    },
    ReferencedFractionNumber: {
        tag: "30080223",
        vr: "IS",
        vm: "1",
    },
    FractionGroupType: {
        tag: "30080224",
        vr: "CS",
        vm: "1",
    },
    BeamStopperPosition: {
        tag: "30080230",
        vr: "CS",
        vm: "1",
    },
    FractionStatusSummarySequence: {
        tag: "30080240",
        vr: "SQ",
        vm: "1",
    },
    TreatmentDate: {
        tag: "30080250",
        vr: "DA",
        vm: "1",
    },
    TreatmentTime: {
        tag: "30080251",
        vr: "TM",
        vm: "1",
    },
    RTPlanLabel: {
        tag: "300A0002",
        vr: "SH",
        vm: "1",
    },
    RTPlanName: {
        tag: "300A0003",
        vr: "LO",
        vm: "1",
    },
    RTPlanDescription: {
        tag: "300A0004",
        vr: "ST",
        vm: "1",
    },
    RTPlanDate: {
        tag: "300A0006",
        vr: "DA",
        vm: "1",
    },
    RTPlanTime: {
        tag: "300A0007",
        vr: "TM",
        vm: "1",
    },
    TreatmentProtocols: {
        tag: "300A0009",
        vr: "LO",
        vm: "1-n",
    },
    PlanIntent: {
        tag: "300A000A",
        vr: "CS",
        vm: "1",
    },
    TreatmentSites: {
        tag: "300A000B",
        vr: "LO",
        vm: "1-n",
    },
    RTPlanGeometry: {
        tag: "300A000C",
        vr: "CS",
        vm: "1",
    },
    PrescriptionDescription: {
        tag: "300A000E",
        vr: "ST",
        vm: "1",
    },
    DoseReferenceSequence: {
        tag: "300A0010",
        vr: "SQ",
        vm: "1",
    },
    DoseReferenceNumber: {
        tag: "300A0012",
        vr: "IS",
        vm: "1",
    },
    DoseReferenceUID: {
        tag: "300A0013",
        vr: "UI",
        vm: "1",
    },
    DoseReferenceStructureType: {
        tag: "300A0014",
        vr: "CS",
        vm: "1",
    },
    NominalBeamEnergyUnit: {
        tag: "300A0015",
        vr: "CS",
        vm: "1",
    },
    DoseReferenceDescription: {
        tag: "300A0016",
        vr: "LO",
        vm: "1",
    },
    DoseReferencePointCoordinates: {
        tag: "300A0018",
        vr: "DS",
        vm: "3",
    },
    NominalPriorDose: {
        tag: "300A001A",
        vr: "DS",
        vm: "1",
    },
    DoseReferenceType: {
        tag: "300A0020",
        vr: "CS",
        vm: "1",
    },
    ConstraintWeight: {
        tag: "300A0021",
        vr: "DS",
        vm: "1",
    },
    DeliveryWarningDose: {
        tag: "300A0022",
        vr: "DS",
        vm: "1",
    },
    DeliveryMaximumDose: {
        tag: "300A0023",
        vr: "DS",
        vm: "1",
    },
    TargetMinimumDose: {
        tag: "300A0025",
        vr: "DS",
        vm: "1",
    },
    TargetPrescriptionDose: {
        tag: "300A0026",
        vr: "DS",
        vm: "1",
    },
    TargetMaximumDose: {
        tag: "300A0027",
        vr: "DS",
        vm: "1",
    },
    TargetUnderdoseVolumeFraction: {
        tag: "300A0028",
        vr: "DS",
        vm: "1",
    },
    OrganAtRiskFullVolumeDose: {
        tag: "300A002A",
        vr: "DS",
        vm: "1",
    },
    OrganAtRiskLimitDose: {
        tag: "300A002B",
        vr: "DS",
        vm: "1",
    },
    OrganAtRiskMaximumDose: {
        tag: "300A002C",
        vr: "DS",
        vm: "1",
    },
    OrganAtRiskOverdoseVolumeFraction: {
        tag: "300A002D",
        vr: "DS",
        vm: "1",
    },
    ToleranceTableSequence: {
        tag: "300A0040",
        vr: "SQ",
        vm: "1",
    },
    ToleranceTableNumber: {
        tag: "300A0042",
        vr: "IS",
        vm: "1",
    },
    ToleranceTableLabel: {
        tag: "300A0043",
        vr: "SH",
        vm: "1",
    },
    GantryAngleTolerance: {
        tag: "300A0044",
        vr: "DS",
        vm: "1",
    },
    BeamLimitingDeviceAngleTolerance: {
        tag: "300A0046",
        vr: "DS",
        vm: "1",
    },
    BeamLimitingDeviceToleranceSequence: {
        tag: "300A0048",
        vr: "SQ",
        vm: "1",
    },
    BeamLimitingDevicePositionTolerance: {
        tag: "300A004A",
        vr: "DS",
        vm: "1",
    },
    SnoutPositionTolerance: {
        tag: "300A004B",
        vr: "FL",
        vm: "1",
    },
    PatientSupportAngleTolerance: {
        tag: "300A004C",
        vr: "DS",
        vm: "1",
    },
    TableTopEccentricAngleTolerance: {
        tag: "300A004E",
        vr: "DS",
        vm: "1",
    },
    TableTopPitchAngleTolerance: {
        tag: "300A004F",
        vr: "FL",
        vm: "1",
    },
    TableTopRollAngleTolerance: {
        tag: "300A0050",
        vr: "FL",
        vm: "1",
    },
    TableTopVerticalPositionTolerance: {
        tag: "300A0051",
        vr: "DS",
        vm: "1",
    },
    TableTopLongitudinalPositionTolerance: {
        tag: "300A0052",
        vr: "DS",
        vm: "1",
    },
    TableTopLateralPositionTolerance: {
        tag: "300A0053",
        vr: "DS",
        vm: "1",
    },
    TableTopPositionAlignmentUID: {
        tag: "300A0054",
        vr: "UI",
        vm: "1",
    },
    RTPlanRelationship: {
        tag: "300A0055",
        vr: "CS",
        vm: "1",
    },
    FractionGroupSequence: {
        tag: "300A0070",
        vr: "SQ",
        vm: "1",
    },
    FractionGroupNumber: {
        tag: "300A0071",
        vr: "IS",
        vm: "1",
    },
    FractionGroupDescription: {
        tag: "300A0072",
        vr: "LO",
        vm: "1",
    },
    NumberOfFractionsPlanned: {
        tag: "300A0078",
        vr: "IS",
        vm: "1",
    },
    NumberOfFractionPatternDigitsPerDay: {
        tag: "300A0079",
        vr: "IS",
        vm: "1",
    },
    RepeatFractionCycleLength: {
        tag: "300A007A",
        vr: "IS",
        vm: "1",
    },
    FractionPattern: {
        tag: "300A007B",
        vr: "LT",
        vm: "1",
    },
    NumberOfBeams: {
        tag: "300A0080",
        vr: "IS",
        vm: "1",
    },
    BeamDoseSpecificationPoint: {
        tag: "300A0082",
        vr: "DS",
        vm: "3",
    },
    ReferencedDoseReferenceUID: {
        tag: "300A0083",
        vr: "UI",
        vm: "1",
    },
    BeamDose: {
        tag: "300A0084",
        vr: "DS",
        vm: "1",
    },
    BeamMeterset: {
        tag: "300A0086",
        vr: "DS",
        vm: "1",
    },
    BeamDosePointDepth: {
        tag: "300A0088",
        vr: "FL",
        vm: "1",
    },
    BeamDosePointEquivalentDepth: {
        tag: "300A0089",
        vr: "FL",
        vm: "1",
    },
    BeamDosePointSSD: {
        tag: "300A008A",
        vr: "FL",
        vm: "1",
    },
    BeamDoseMeaning: {
        tag: "300A008B",
        vr: "CS",
        vm: "1",
    },
    BeamDoseVerificationControlPointSequence: {
        tag: "300A008C",
        vr: "SQ",
        vm: "1",
    },
    AverageBeamDosePointDepth: {
        tag: "300A008D",
        vr: "FL",
        vm: "1",
    },
    AverageBeamDosePointEquivalentDepth: {
        tag: "300A008E",
        vr: "FL",
        vm: "1",
    },
    AverageBeamDosePointSSD: {
        tag: "300A008F",
        vr: "FL",
        vm: "1",
    },
    BeamDoseType: {
        tag: "300A0090",
        vr: "CS",
        vm: "1",
    },
    AlternateBeamDose: {
        tag: "300A0091",
        vr: "DS",
        vm: "1",
    },
    AlternateBeamDoseType: {
        tag: "300A0092",
        vr: "CS",
        vm: "1",
    },
    DepthValueAveragingFlag: {
        tag: "300A0093",
        vr: "CS",
        vm: "1",
    },
    BeamDosePointSourceToExternalContourDistance: {
        tag: "300A0094",
        vr: "DS",
        vm: "1",
    },
    NumberOfBrachyApplicationSetups: {
        tag: "300A00A0",
        vr: "IS",
        vm: "1",
    },
    BrachyApplicationSetupDoseSpecificationPoint: {
        tag: "300A00A2",
        vr: "DS",
        vm: "3",
    },
    BrachyApplicationSetupDose: {
        tag: "300A00A4",
        vr: "DS",
        vm: "1",
    },
    BeamSequence: {
        tag: "300A00B0",
        vr: "SQ",
        vm: "1",
    },
    TreatmentMachineName: {
        tag: "300A00B2",
        vr: "SH",
        vm: "1",
    },
    PrimaryDosimeterUnit: {
        tag: "300A00B3",
        vr: "CS",
        vm: "1",
    },
    SourceAxisDistance: {
        tag: "300A00B4",
        vr: "DS",
        vm: "1",
    },
    BeamLimitingDeviceSequence: {
        tag: "300A00B6",
        vr: "SQ",
        vm: "1",
    },
    RTBeamLimitingDeviceType: {
        tag: "300A00B8",
        vr: "CS",
        vm: "1",
    },
    SourceToBeamLimitingDeviceDistance: {
        tag: "300A00BA",
        vr: "DS",
        vm: "1",
    },
    IsocenterToBeamLimitingDeviceDistance: {
        tag: "300A00BB",
        vr: "FL",
        vm: "1",
    },
    NumberOfLeafJawPairs: {
        tag: "300A00BC",
        vr: "IS",
        vm: "1",
    },
    LeafPositionBoundaries: {
        tag: "300A00BE",
        vr: "DS",
        vm: "3-n",
    },
    BeamNumber: {
        tag: "300A00C0",
        vr: "IS",
        vm: "1",
    },
    BeamName: {
        tag: "300A00C2",
        vr: "LO",
        vm: "1",
    },
    BeamDescription: {
        tag: "300A00C3",
        vr: "ST",
        vm: "1",
    },
    BeamType: {
        tag: "300A00C4",
        vr: "CS",
        vm: "1",
    },
    BeamDeliveryDurationLimit: {
        tag: "300A00C5",
        vr: "FD",
        vm: "1",
    },
    RadiationType: {
        tag: "300A00C6",
        vr: "CS",
        vm: "1",
    },
    HighDoseTechniqueType: {
        tag: "300A00C7",
        vr: "CS",
        vm: "1",
    },
    ReferenceImageNumber: {
        tag: "300A00C8",
        vr: "IS",
        vm: "1",
    },
    PlannedVerificationImageSequence: {
        tag: "300A00CA",
        vr: "SQ",
        vm: "1",
    },
    ImagingDeviceSpecificAcquisitionParameters: {
        tag: "300A00CC",
        vr: "LO",
        vm: "1-n",
    },
    TreatmentDeliveryType: {
        tag: "300A00CE",
        vr: "CS",
        vm: "1",
    },
    NumberOfWedges: {
        tag: "300A00D0",
        vr: "IS",
        vm: "1",
    },
    WedgeSequence: {
        tag: "300A00D1",
        vr: "SQ",
        vm: "1",
    },
    WedgeNumber: {
        tag: "300A00D2",
        vr: "IS",
        vm: "1",
    },
    WedgeType: {
        tag: "300A00D3",
        vr: "CS",
        vm: "1",
    },
    WedgeID: {
        tag: "300A00D4",
        vr: "SH",
        vm: "1",
    },
    WedgeAngle: {
        tag: "300A00D5",
        vr: "IS",
        vm: "1",
    },
    WedgeFactor: {
        tag: "300A00D6",
        vr: "DS",
        vm: "1",
    },
    TotalWedgeTrayWaterEquivalentThickness: {
        tag: "300A00D7",
        vr: "FL",
        vm: "1",
    },
    WedgeOrientation: {
        tag: "300A00D8",
        vr: "DS",
        vm: "1",
    },
    IsocenterToWedgeTrayDistance: {
        tag: "300A00D9",
        vr: "FL",
        vm: "1",
    },
    SourceToWedgeTrayDistance: {
        tag: "300A00DA",
        vr: "DS",
        vm: "1",
    },
    WedgeThinEdgePosition: {
        tag: "300A00DB",
        vr: "FL",
        vm: "1",
    },
    BolusID: {
        tag: "300A00DC",
        vr: "SH",
        vm: "1",
    },
    BolusDescription: {
        tag: "300A00DD",
        vr: "ST",
        vm: "1",
    },
    EffectiveWedgeAngle: {
        tag: "300A00DE",
        vr: "DS",
        vm: "1",
    },
    NumberOfCompensators: {
        tag: "300A00E0",
        vr: "IS",
        vm: "1",
    },
    MaterialID: {
        tag: "300A00E1",
        vr: "SH",
        vm: "1",
    },
    TotalCompensatorTrayFactor: {
        tag: "300A00E2",
        vr: "DS",
        vm: "1",
    },
    CompensatorSequence: {
        tag: "300A00E3",
        vr: "SQ",
        vm: "1",
    },
    CompensatorNumber: {
        tag: "300A00E4",
        vr: "IS",
        vm: "1",
    },
    CompensatorID: {
        tag: "300A00E5",
        vr: "SH",
        vm: "1",
    },
    SourceToCompensatorTrayDistance: {
        tag: "300A00E6",
        vr: "DS",
        vm: "1",
    },
    CompensatorRows: {
        tag: "300A00E7",
        vr: "IS",
        vm: "1",
    },
    CompensatorColumns: {
        tag: "300A00E8",
        vr: "IS",
        vm: "1",
    },
    CompensatorPixelSpacing: {
        tag: "300A00E9",
        vr: "DS",
        vm: "2",
    },
    CompensatorPosition: {
        tag: "300A00EA",
        vr: "DS",
        vm: "2",
    },
    CompensatorTransmissionData: {
        tag: "300A00EB",
        vr: "DS",
        vm: "1-n",
    },
    CompensatorThicknessData: {
        tag: "300A00EC",
        vr: "DS",
        vm: "1-n",
    },
    NumberOfBoli: {
        tag: "300A00ED",
        vr: "IS",
        vm: "1",
    },
    CompensatorType: {
        tag: "300A00EE",
        vr: "CS",
        vm: "1",
    },
    CompensatorTrayID: {
        tag: "300A00EF",
        vr: "SH",
        vm: "1",
    },
    NumberOfBlocks: {
        tag: "300A00F0",
        vr: "IS",
        vm: "1",
    },
    TotalBlockTrayFactor: {
        tag: "300A00F2",
        vr: "DS",
        vm: "1",
    },
    TotalBlockTrayWaterEquivalentThickness: {
        tag: "300A00F3",
        vr: "FL",
        vm: "1",
    },
    BlockSequence: {
        tag: "300A00F4",
        vr: "SQ",
        vm: "1",
    },
    BlockTrayID: {
        tag: "300A00F5",
        vr: "SH",
        vm: "1",
    },
    SourceToBlockTrayDistance: {
        tag: "300A00F6",
        vr: "DS",
        vm: "1",
    },
    IsocenterToBlockTrayDistance: {
        tag: "300A00F7",
        vr: "FL",
        vm: "1",
    },
    BlockType: {
        tag: "300A00F8",
        vr: "CS",
        vm: "1",
    },
    AccessoryCode: {
        tag: "300A00F9",
        vr: "LO",
        vm: "1",
    },
    BlockDivergence: {
        tag: "300A00FA",
        vr: "CS",
        vm: "1",
    },
    BlockMountingPosition: {
        tag: "300A00FB",
        vr: "CS",
        vm: "1",
    },
    BlockNumber: {
        tag: "300A00FC",
        vr: "IS",
        vm: "1",
    },
    BlockName: {
        tag: "300A00FE",
        vr: "LO",
        vm: "1",
    },
    BlockThickness: {
        tag: "300A0100",
        vr: "DS",
        vm: "1",
    },
    BlockTransmission: {
        tag: "300A0102",
        vr: "DS",
        vm: "1",
    },
    BlockNumberOfPoints: {
        tag: "300A0104",
        vr: "IS",
        vm: "1",
    },
    BlockData: {
        tag: "300A0106",
        vr: "DS",
        vm: "2-2n",
    },
    ApplicatorSequence: {
        tag: "300A0107",
        vr: "SQ",
        vm: "1",
    },
    ApplicatorID: {
        tag: "300A0108",
        vr: "SH",
        vm: "1",
    },
    ApplicatorType: {
        tag: "300A0109",
        vr: "CS",
        vm: "1",
    },
    ApplicatorDescription: {
        tag: "300A010A",
        vr: "LO",
        vm: "1",
    },
    CumulativeDoseReferenceCoefficient: {
        tag: "300A010C",
        vr: "DS",
        vm: "1",
    },
    FinalCumulativeMetersetWeight: {
        tag: "300A010E",
        vr: "DS",
        vm: "1",
    },
    NumberOfControlPoints: {
        tag: "300A0110",
        vr: "IS",
        vm: "1",
    },
    ControlPointSequence: {
        tag: "300A0111",
        vr: "SQ",
        vm: "1",
    },
    ControlPointIndex: {
        tag: "300A0112",
        vr: "IS",
        vm: "1",
    },
    NominalBeamEnergy: {
        tag: "300A0114",
        vr: "DS",
        vm: "1",
    },
    DoseRateSet: {
        tag: "300A0115",
        vr: "DS",
        vm: "1",
    },
    WedgePositionSequence: {
        tag: "300A0116",
        vr: "SQ",
        vm: "1",
    },
    WedgePosition: {
        tag: "300A0118",
        vr: "CS",
        vm: "1",
    },
    BeamLimitingDevicePositionSequence: {
        tag: "300A011A",
        vr: "SQ",
        vm: "1",
    },
    LeafJawPositions: {
        tag: "300A011C",
        vr: "DS",
        vm: "2-2n",
    },
    GantryAngle: {
        tag: "300A011E",
        vr: "DS",
        vm: "1",
    },
    GantryRotationDirection: {
        tag: "300A011F",
        vr: "CS",
        vm: "1",
    },
    BeamLimitingDeviceAngle: {
        tag: "300A0120",
        vr: "DS",
        vm: "1",
    },
    BeamLimitingDeviceRotationDirection: {
        tag: "300A0121",
        vr: "CS",
        vm: "1",
    },
    PatientSupportAngle: {
        tag: "300A0122",
        vr: "DS",
        vm: "1",
    },
    PatientSupportRotationDirection: {
        tag: "300A0123",
        vr: "CS",
        vm: "1",
    },
    TableTopEccentricAxisDistance: {
        tag: "300A0124",
        vr: "DS",
        vm: "1",
    },
    TableTopEccentricAngle: {
        tag: "300A0125",
        vr: "DS",
        vm: "1",
    },
    TableTopEccentricRotationDirection: {
        tag: "300A0126",
        vr: "CS",
        vm: "1",
    },
    TableTopVerticalPosition: {
        tag: "300A0128",
        vr: "DS",
        vm: "1",
    },
    TableTopLongitudinalPosition: {
        tag: "300A0129",
        vr: "DS",
        vm: "1",
    },
    TableTopLateralPosition: {
        tag: "300A012A",
        vr: "DS",
        vm: "1",
    },
    IsocenterPosition: {
        tag: "300A012C",
        vr: "DS",
        vm: "3",
    },
    SurfaceEntryPoint: {
        tag: "300A012E",
        vr: "DS",
        vm: "3",
    },
    SourceToSurfaceDistance: {
        tag: "300A0130",
        vr: "DS",
        vm: "1",
    },
    AverageBeamDosePointSourceToExternalContourDistance: {
        tag: "300A0131",
        vr: "FL",
        vm: "1",
    },
    SourceToExternalContourDistance: {
        tag: "300A0132",
        vr: "FL",
        vm: "1",
    },
    ExternalContourEntryPoint: {
        tag: "300A0133",
        vr: "FL",
        vm: "3",
    },
    CumulativeMetersetWeight: {
        tag: "300A0134",
        vr: "DS",
        vm: "1",
    },
    TableTopPitchAngle: {
        tag: "300A0140",
        vr: "FL",
        vm: "1",
    },
    TableTopPitchRotationDirection: {
        tag: "300A0142",
        vr: "CS",
        vm: "1",
    },
    TableTopRollAngle: {
        tag: "300A0144",
        vr: "FL",
        vm: "1",
    },
    TableTopRollRotationDirection: {
        tag: "300A0146",
        vr: "CS",
        vm: "1",
    },
    HeadFixationAngle: {
        tag: "300A0148",
        vr: "FL",
        vm: "1",
    },
    GantryPitchAngle: {
        tag: "300A014A",
        vr: "FL",
        vm: "1",
    },
    GantryPitchRotationDirection: {
        tag: "300A014C",
        vr: "CS",
        vm: "1",
    },
    GantryPitchAngleTolerance: {
        tag: "300A014E",
        vr: "FL",
        vm: "1",
    },
    FixationEye: {
        tag: "300A0150",
        vr: "CS",
        vm: "1",
    },
    ChairHeadFramePosition: {
        tag: "300A0151",
        vr: "DS",
        vm: "1",
    },
    HeadFixationAngleTolerance: {
        tag: "300A0152",
        vr: "DS",
        vm: "1",
    },
    ChairHeadFramePositionTolerance: {
        tag: "300A0153",
        vr: "DS",
        vm: "1",
    },
    FixationLightAzimuthalAngleTolerance: {
        tag: "300A0154",
        vr: "DS",
        vm: "1",
    },
    FixationLightPolarAngleTolerance: {
        tag: "300A0155",
        vr: "DS",
        vm: "1",
    },
    PatientSetupSequence: {
        tag: "300A0180",
        vr: "SQ",
        vm: "1",
    },
    PatientSetupNumber: {
        tag: "300A0182",
        vr: "IS",
        vm: "1",
    },
    PatientSetupLabel: {
        tag: "300A0183",
        vr: "LO",
        vm: "1",
    },
    PatientAdditionalPosition: {
        tag: "300A0184",
        vr: "LO",
        vm: "1",
    },
    FixationDeviceSequence: {
        tag: "300A0190",
        vr: "SQ",
        vm: "1",
    },
    FixationDeviceType: {
        tag: "300A0192",
        vr: "CS",
        vm: "1",
    },
    FixationDeviceLabel: {
        tag: "300A0194",
        vr: "SH",
        vm: "1",
    },
    FixationDeviceDescription: {
        tag: "300A0196",
        vr: "ST",
        vm: "1",
    },
    FixationDevicePosition: {
        tag: "300A0198",
        vr: "SH",
        vm: "1",
    },
    FixationDevicePitchAngle: {
        tag: "300A0199",
        vr: "FL",
        vm: "1",
    },
    FixationDeviceRollAngle: {
        tag: "300A019A",
        vr: "FL",
        vm: "1",
    },
    ShieldingDeviceSequence: {
        tag: "300A01A0",
        vr: "SQ",
        vm: "1",
    },
    ShieldingDeviceType: {
        tag: "300A01A2",
        vr: "CS",
        vm: "1",
    },
    ShieldingDeviceLabel: {
        tag: "300A01A4",
        vr: "SH",
        vm: "1",
    },
    ShieldingDeviceDescription: {
        tag: "300A01A6",
        vr: "ST",
        vm: "1",
    },
    ShieldingDevicePosition: {
        tag: "300A01A8",
        vr: "SH",
        vm: "1",
    },
    SetupTechnique: {
        tag: "300A01B0",
        vr: "CS",
        vm: "1",
    },
    SetupTechniqueDescription: {
        tag: "300A01B2",
        vr: "ST",
        vm: "1",
    },
    SetupDeviceSequence: {
        tag: "300A01B4",
        vr: "SQ",
        vm: "1",
    },
    SetupDeviceType: {
        tag: "300A01B6",
        vr: "CS",
        vm: "1",
    },
    SetupDeviceLabel: {
        tag: "300A01B8",
        vr: "SH",
        vm: "1",
    },
    SetupDeviceDescription: {
        tag: "300A01BA",
        vr: "ST",
        vm: "1",
    },
    SetupDeviceParameter: {
        tag: "300A01BC",
        vr: "DS",
        vm: "1",
    },
    SetupReferenceDescription: {
        tag: "300A01D0",
        vr: "ST",
        vm: "1",
    },
    TableTopVerticalSetupDisplacement: {
        tag: "300A01D2",
        vr: "DS",
        vm: "1",
    },
    TableTopLongitudinalSetupDisplacement: {
        tag: "300A01D4",
        vr: "DS",
        vm: "1",
    },
    TableTopLateralSetupDisplacement: {
        tag: "300A01D6",
        vr: "DS",
        vm: "1",
    },
    BrachyTreatmentTechnique: {
        tag: "300A0200",
        vr: "CS",
        vm: "1",
    },
    BrachyTreatmentType: {
        tag: "300A0202",
        vr: "CS",
        vm: "1",
    },
    TreatmentMachineSequence: {
        tag: "300A0206",
        vr: "SQ",
        vm: "1",
    },
    SourceSequence: {
        tag: "300A0210",
        vr: "SQ",
        vm: "1",
    },
    SourceNumber: {
        tag: "300A0212",
        vr: "IS",
        vm: "1",
    },
    SourceType: {
        tag: "300A0214",
        vr: "CS",
        vm: "1",
    },
    SourceManufacturer: {
        tag: "300A0216",
        vr: "LO",
        vm: "1",
    },
    ActiveSourceDiameter: {
        tag: "300A0218",
        vr: "DS",
        vm: "1",
    },
    ActiveSourceLength: {
        tag: "300A021A",
        vr: "DS",
        vm: "1",
    },
    SourceModelID: {
        tag: "300A021B",
        vr: "SH",
        vm: "1",
    },
    SourceDescription: {
        tag: "300A021C",
        vr: "LO",
        vm: "1",
    },
    SourceEncapsulationNominalThickness: {
        tag: "300A0222",
        vr: "DS",
        vm: "1",
    },
    SourceEncapsulationNominalTransmission: {
        tag: "300A0224",
        vr: "DS",
        vm: "1",
    },
    SourceIsotopeName: {
        tag: "300A0226",
        vr: "LO",
        vm: "1",
    },
    SourceIsotopeHalfLife: {
        tag: "300A0228",
        vr: "DS",
        vm: "1",
    },
    SourceStrengthUnits: {
        tag: "300A0229",
        vr: "CS",
        vm: "1",
    },
    ReferenceAirKermaRate: {
        tag: "300A022A",
        vr: "DS",
        vm: "1",
    },
    SourceStrength: {
        tag: "300A022B",
        vr: "DS",
        vm: "1",
    },
    SourceStrengthReferenceDate: {
        tag: "300A022C",
        vr: "DA",
        vm: "1",
    },
    SourceStrengthReferenceTime: {
        tag: "300A022E",
        vr: "TM",
        vm: "1",
    },
    ApplicationSetupSequence: {
        tag: "300A0230",
        vr: "SQ",
        vm: "1",
    },
    ApplicationSetupType: {
        tag: "300A0232",
        vr: "CS",
        vm: "1",
    },
    ApplicationSetupNumber: {
        tag: "300A0234",
        vr: "IS",
        vm: "1",
    },
    ApplicationSetupName: {
        tag: "300A0236",
        vr: "LO",
        vm: "1",
    },
    ApplicationSetupManufacturer: {
        tag: "300A0238",
        vr: "LO",
        vm: "1",
    },
    TemplateNumber: {
        tag: "300A0240",
        vr: "IS",
        vm: "1",
    },
    TemplateType: {
        tag: "300A0242",
        vr: "SH",
        vm: "1",
    },
    TemplateName: {
        tag: "300A0244",
        vr: "LO",
        vm: "1",
    },
    TotalReferenceAirKerma: {
        tag: "300A0250",
        vr: "DS",
        vm: "1",
    },
    BrachyAccessoryDeviceSequence: {
        tag: "300A0260",
        vr: "SQ",
        vm: "1",
    },
    BrachyAccessoryDeviceNumber: {
        tag: "300A0262",
        vr: "IS",
        vm: "1",
    },
    BrachyAccessoryDeviceID: {
        tag: "300A0263",
        vr: "SH",
        vm: "1",
    },
    BrachyAccessoryDeviceType: {
        tag: "300A0264",
        vr: "CS",
        vm: "1",
    },
    BrachyAccessoryDeviceName: {
        tag: "300A0266",
        vr: "LO",
        vm: "1",
    },
    BrachyAccessoryDeviceNominalThickness: {
        tag: "300A026A",
        vr: "DS",
        vm: "1",
    },
    BrachyAccessoryDeviceNominalTransmission: {
        tag: "300A026C",
        vr: "DS",
        vm: "1",
    },
    ChannelEffectiveLength: {
        tag: "300A0271",
        vr: "DS",
        vm: "1",
    },
    ChannelInnerLength: {
        tag: "300A0272",
        vr: "DS",
        vm: "1",
    },
    AfterloaderChannelID: {
        tag: "300A0273",
        vr: "SH",
        vm: "1",
    },
    SourceApplicatorTipLength: {
        tag: "300A0274",
        vr: "DS",
        vm: "1",
    },
    ChannelSequence: {
        tag: "300A0280",
        vr: "SQ",
        vm: "1",
    },
    ChannelNumber: {
        tag: "300A0282",
        vr: "IS",
        vm: "1",
    },
    ChannelLength: {
        tag: "300A0284",
        vr: "DS",
        vm: "1",
    },
    ChannelTotalTime: {
        tag: "300A0286",
        vr: "DS",
        vm: "1",
    },
    SourceMovementType: {
        tag: "300A0288",
        vr: "CS",
        vm: "1",
    },
    NumberOfPulses: {
        tag: "300A028A",
        vr: "IS",
        vm: "1",
    },
    PulseRepetitionInterval: {
        tag: "300A028C",
        vr: "DS",
        vm: "1",
    },
    SourceApplicatorNumber: {
        tag: "300A0290",
        vr: "IS",
        vm: "1",
    },
    SourceApplicatorID: {
        tag: "300A0291",
        vr: "SH",
        vm: "1",
    },
    SourceApplicatorType: {
        tag: "300A0292",
        vr: "CS",
        vm: "1",
    },
    SourceApplicatorName: {
        tag: "300A0294",
        vr: "LO",
        vm: "1",
    },
    SourceApplicatorLength: {
        tag: "300A0296",
        vr: "DS",
        vm: "1",
    },
    SourceApplicatorManufacturer: {
        tag: "300A0298",
        vr: "LO",
        vm: "1",
    },
    SourceApplicatorWallNominalThickness: {
        tag: "300A029C",
        vr: "DS",
        vm: "1",
    },
    SourceApplicatorWallNominalTransmission: {
        tag: "300A029E",
        vr: "DS",
        vm: "1",
    },
    SourceApplicatorStepSize: {
        tag: "300A02A0",
        vr: "DS",
        vm: "1",
    },
    ApplicatorShapeReferencedROINumber: {
        tag: "300A02A1",
        vr: "IS",
        vm: "1",
    },
    TransferTubeNumber: {
        tag: "300A02A2",
        vr: "IS",
        vm: "1",
    },
    TransferTubeLength: {
        tag: "300A02A4",
        vr: "DS",
        vm: "1",
    },
    ChannelShieldSequence: {
        tag: "300A02B0",
        vr: "SQ",
        vm: "1",
    },
    ChannelShieldNumber: {
        tag: "300A02B2",
        vr: "IS",
        vm: "1",
    },
    ChannelShieldID: {
        tag: "300A02B3",
        vr: "SH",
        vm: "1",
    },
    ChannelShieldName: {
        tag: "300A02B4",
        vr: "LO",
        vm: "1",
    },
    ChannelShieldNominalThickness: {
        tag: "300A02B8",
        vr: "DS",
        vm: "1",
    },
    ChannelShieldNominalTransmission: {
        tag: "300A02BA",
        vr: "DS",
        vm: "1",
    },
    FinalCumulativeTimeWeight: {
        tag: "300A02C8",
        vr: "DS",
        vm: "1",
    },
    BrachyControlPointSequence: {
        tag: "300A02D0",
        vr: "SQ",
        vm: "1",
    },
    ControlPointRelativePosition: {
        tag: "300A02D2",
        vr: "DS",
        vm: "1",
    },
    ControlPoint3DPosition: {
        tag: "300A02D4",
        vr: "DS",
        vm: "3",
    },
    CumulativeTimeWeight: {
        tag: "300A02D6",
        vr: "DS",
        vm: "1",
    },
    CompensatorDivergence: {
        tag: "300A02E0",
        vr: "CS",
        vm: "1",
    },
    CompensatorMountingPosition: {
        tag: "300A02E1",
        vr: "CS",
        vm: "1",
    },
    SourceToCompensatorDistance: {
        tag: "300A02E2",
        vr: "DS",
        vm: "1-n",
    },
    TotalCompensatorTrayWaterEquivalentThickness: {
        tag: "300A02E3",
        vr: "FL",
        vm: "1",
    },
    IsocenterToCompensatorTrayDistance: {
        tag: "300A02E4",
        vr: "FL",
        vm: "1",
    },
    CompensatorColumnOffset: {
        tag: "300A02E5",
        vr: "FL",
        vm: "1",
    },
    IsocenterToCompensatorDistances: {
        tag: "300A02E6",
        vr: "FL",
        vm: "1-n",
    },
    CompensatorRelativeStoppingPowerRatio: {
        tag: "300A02E7",
        vr: "FL",
        vm: "1",
    },
    CompensatorMillingToolDiameter: {
        tag: "300A02E8",
        vr: "FL",
        vm: "1",
    },
    IonRangeCompensatorSequence: {
        tag: "300A02EA",
        vr: "SQ",
        vm: "1",
    },
    CompensatorDescription: {
        tag: "300A02EB",
        vr: "LT",
        vm: "1",
    },
    CompensatorSurfaceRepresentationFlag: {
        tag: "300A02EC",
        vr: "CS",
        vm: "1",
    },
    RadiationMassNumber: {
        tag: "300A0302",
        vr: "IS",
        vm: "1",
    },
    RadiationAtomicNumber: {
        tag: "300A0304",
        vr: "IS",
        vm: "1",
    },
    RadiationChargeState: {
        tag: "300A0306",
        vr: "SS",
        vm: "1",
    },
    ScanMode: {
        tag: "300A0308",
        vr: "CS",
        vm: "1",
    },
    ModulatedScanModeType: {
        tag: "300A0309",
        vr: "CS",
        vm: "1",
    },
    VirtualSourceAxisDistances: {
        tag: "300A030A",
        vr: "FL",
        vm: "2",
    },
    SnoutSequence: {
        tag: "300A030C",
        vr: "SQ",
        vm: "1",
    },
    SnoutPosition: {
        tag: "300A030D",
        vr: "FL",
        vm: "1",
    },
    SnoutID: {
        tag: "300A030F",
        vr: "SH",
        vm: "1",
    },
    NumberOfRangeShifters: {
        tag: "300A0312",
        vr: "IS",
        vm: "1",
    },
    RangeShifterSequence: {
        tag: "300A0314",
        vr: "SQ",
        vm: "1",
    },
    RangeShifterNumber: {
        tag: "300A0316",
        vr: "IS",
        vm: "1",
    },
    RangeShifterID: {
        tag: "300A0318",
        vr: "SH",
        vm: "1",
    },
    RangeShifterType: {
        tag: "300A0320",
        vr: "CS",
        vm: "1",
    },
    RangeShifterDescription: {
        tag: "300A0322",
        vr: "LO",
        vm: "1",
    },
    NumberOfLateralSpreadingDevices: {
        tag: "300A0330",
        vr: "IS",
        vm: "1",
    },
    LateralSpreadingDeviceSequence: {
        tag: "300A0332",
        vr: "SQ",
        vm: "1",
    },
    LateralSpreadingDeviceNumber: {
        tag: "300A0334",
        vr: "IS",
        vm: "1",
    },
    LateralSpreadingDeviceID: {
        tag: "300A0336",
        vr: "SH",
        vm: "1",
    },
    LateralSpreadingDeviceType: {
        tag: "300A0338",
        vr: "CS",
        vm: "1",
    },
    LateralSpreadingDeviceDescription: {
        tag: "300A033A",
        vr: "LO",
        vm: "1",
    },
    LateralSpreadingDeviceWaterEquivalentThickness: {
        tag: "300A033C",
        vr: "FL",
        vm: "1",
    },
    NumberOfRangeModulators: {
        tag: "300A0340",
        vr: "IS",
        vm: "1",
    },
    RangeModulatorSequence: {
        tag: "300A0342",
        vr: "SQ",
        vm: "1",
    },
    RangeModulatorNumber: {
        tag: "300A0344",
        vr: "IS",
        vm: "1",
    },
    RangeModulatorID: {
        tag: "300A0346",
        vr: "SH",
        vm: "1",
    },
    RangeModulatorType: {
        tag: "300A0348",
        vr: "CS",
        vm: "1",
    },
    RangeModulatorDescription: {
        tag: "300A034A",
        vr: "LO",
        vm: "1",
    },
    BeamCurrentModulationID: {
        tag: "300A034C",
        vr: "SH",
        vm: "1",
    },
    PatientSupportType: {
        tag: "300A0350",
        vr: "CS",
        vm: "1",
    },
    PatientSupportID: {
        tag: "300A0352",
        vr: "SH",
        vm: "1",
    },
    PatientSupportAccessoryCode: {
        tag: "300A0354",
        vr: "LO",
        vm: "1",
    },
    TrayAccessoryCode: {
        tag: "300A0355",
        vr: "LO",
        vm: "1",
    },
    FixationLightAzimuthalAngle: {
        tag: "300A0356",
        vr: "FL",
        vm: "1",
    },
    FixationLightPolarAngle: {
        tag: "300A0358",
        vr: "FL",
        vm: "1",
    },
    MetersetRate: {
        tag: "300A035A",
        vr: "FL",
        vm: "1",
    },
    RangeShifterSettingsSequence: {
        tag: "300A0360",
        vr: "SQ",
        vm: "1",
    },
    RangeShifterSetting: {
        tag: "300A0362",
        vr: "LO",
        vm: "1",
    },
    IsocenterToRangeShifterDistance: {
        tag: "300A0364",
        vr: "FL",
        vm: "1",
    },
    RangeShifterWaterEquivalentThickness: {
        tag: "300A0366",
        vr: "FL",
        vm: "1",
    },
    LateralSpreadingDeviceSettingsSequence: {
        tag: "300A0370",
        vr: "SQ",
        vm: "1",
    },
    LateralSpreadingDeviceSetting: {
        tag: "300A0372",
        vr: "LO",
        vm: "1",
    },
    IsocenterToLateralSpreadingDeviceDistance: {
        tag: "300A0374",
        vr: "FL",
        vm: "1",
    },
    RangeModulatorSettingsSequence: {
        tag: "300A0380",
        vr: "SQ",
        vm: "1",
    },
    RangeModulatorGatingStartValue: {
        tag: "300A0382",
        vr: "FL",
        vm: "1",
    },
    RangeModulatorGatingStopValue: {
        tag: "300A0384",
        vr: "FL",
        vm: "1",
    },
    RangeModulatorGatingStartWaterEquivalentThickness: {
        tag: "300A0386",
        vr: "FL",
        vm: "1",
    },
    RangeModulatorGatingStopWaterEquivalentThickness: {
        tag: "300A0388",
        vr: "FL",
        vm: "1",
    },
    IsocenterToRangeModulatorDistance: {
        tag: "300A038A",
        vr: "FL",
        vm: "1",
    },
    ScanSpotTimeOffset: {
        tag: "300A038F",
        vr: "FL",
        vm: "1-n",
    },
    ScanSpotTuneID: {
        tag: "300A0390",
        vr: "SH",
        vm: "1",
    },
    ScanSpotPrescribedIndices: {
        tag: "300A0391",
        vr: "IS",
        vm: "1-n",
    },
    NumberOfScanSpotPositions: {
        tag: "300A0392",
        vr: "IS",
        vm: "1",
    },
    ScanSpotReordered: {
        tag: "300A0393",
        vr: "CS",
        vm: "1",
    },
    ScanSpotPositionMap: {
        tag: "300A0394",
        vr: "FL",
        vm: "1-n",
    },
    ScanSpotReorderingAllowed: {
        tag: "300A0395",
        vr: "CS",
        vm: "1",
    },
    ScanSpotMetersetWeights: {
        tag: "300A0396",
        vr: "FL",
        vm: "1-n",
    },
    ScanningSpotSize: {
        tag: "300A0398",
        vr: "FL",
        vm: "2",
    },
    ScanSpotSizesDelivered: {
        tag: "300A0399",
        vr: "FL",
        vm: "2-2n",
    },
    NumberOfPaintings: {
        tag: "300A039A",
        vr: "IS",
        vm: "1",
    },
    ScanSpotGantryAngles: {
        tag: "300A039B",
        vr: "FL",
        vm: "1-n",
    },
    ScanSpotPatientSupportAngles: {
        tag: "300A039C",
        vr: "FL",
        vm: "1-n",
    },
    IonToleranceTableSequence: {
        tag: "300A03A0",
        vr: "SQ",
        vm: "1",
    },
    IonBeamSequence: {
        tag: "300A03A2",
        vr: "SQ",
        vm: "1",
    },
    IonBeamLimitingDeviceSequence: {
        tag: "300A03A4",
        vr: "SQ",
        vm: "1",
    },
    IonBlockSequence: {
        tag: "300A03A6",
        vr: "SQ",
        vm: "1",
    },
    IonControlPointSequence: {
        tag: "300A03A8",
        vr: "SQ",
        vm: "1",
    },
    IonWedgeSequence: {
        tag: "300A03AA",
        vr: "SQ",
        vm: "1",
    },
    IonWedgePositionSequence: {
        tag: "300A03AC",
        vr: "SQ",
        vm: "1",
    },
    ReferencedSetupImageSequence: {
        tag: "300A0401",
        vr: "SQ",
        vm: "1",
    },
    SetupImageComment: {
        tag: "300A0402",
        vr: "ST",
        vm: "1",
    },
    MotionSynchronizationSequence: {
        tag: "300A0410",
        vr: "SQ",
        vm: "1",
    },
    ControlPointOrientation: {
        tag: "300A0412",
        vr: "FL",
        vm: "3",
    },
    GeneralAccessorySequence: {
        tag: "300A0420",
        vr: "SQ",
        vm: "1",
    },
    GeneralAccessoryID: {
        tag: "300A0421",
        vr: "SH",
        vm: "1",
    },
    GeneralAccessoryDescription: {
        tag: "300A0422",
        vr: "ST",
        vm: "1",
    },
    GeneralAccessoryType: {
        tag: "300A0423",
        vr: "CS",
        vm: "1",
    },
    GeneralAccessoryNumber: {
        tag: "300A0424",
        vr: "IS",
        vm: "1",
    },
    SourceToGeneralAccessoryDistance: {
        tag: "300A0425",
        vr: "FL",
        vm: "1",
    },
    IsocenterToGeneralAccessoryDistance: {
        tag: "300A0426",
        vr: "DS",
        vm: "1",
    },
    ApplicatorGeometrySequence: {
        tag: "300A0431",
        vr: "SQ",
        vm: "1",
    },
    ApplicatorApertureShape: {
        tag: "300A0432",
        vr: "CS",
        vm: "1",
    },
    ApplicatorOpening: {
        tag: "300A0433",
        vr: "FL",
        vm: "1",
    },
    ApplicatorOpeningX: {
        tag: "300A0434",
        vr: "FL",
        vm: "1",
    },
    ApplicatorOpeningY: {
        tag: "300A0435",
        vr: "FL",
        vm: "1",
    },
    SourceToApplicatorMountingPositionDistance: {
        tag: "300A0436",
        vr: "FL",
        vm: "1",
    },
    NumberOfBlockSlabItems: {
        tag: "300A0440",
        vr: "IS",
        vm: "1",
    },
    BlockSlabSequence: {
        tag: "300A0441",
        vr: "SQ",
        vm: "1",
    },
    BlockSlabThickness: {
        tag: "300A0442",
        vr: "DS",
        vm: "1",
    },
    BlockSlabNumber: {
        tag: "300A0443",
        vr: "US",
        vm: "1",
    },
    DeviceMotionControlSequence: {
        tag: "300A0450",
        vr: "SQ",
        vm: "1",
    },
    DeviceMotionExecutionMode: {
        tag: "300A0451",
        vr: "CS",
        vm: "1",
    },
    DeviceMotionObservationMode: {
        tag: "300A0452",
        vr: "CS",
        vm: "1",
    },
    DeviceMotionParameterCodeSequence: {
        tag: "300A0453",
        vr: "SQ",
        vm: "1",
    },
    DistalDepthFraction: {
        tag: "300A0501",
        vr: "FL",
        vm: "1",
    },
    DistalDepth: {
        tag: "300A0502",
        vr: "FL",
        vm: "1",
    },
    NominalRangeModulationFractions: {
        tag: "300A0503",
        vr: "FL",
        vm: "2",
    },
    NominalRangeModulatedRegionDepths: {
        tag: "300A0504",
        vr: "FL",
        vm: "2",
    },
    DepthDoseParametersSequence: {
        tag: "300A0505",
        vr: "SQ",
        vm: "1",
    },
    DeliveredDepthDoseParametersSequence: {
        tag: "300A0506",
        vr: "SQ",
        vm: "1",
    },
    DeliveredDistalDepthFraction: {
        tag: "300A0507",
        vr: "FL",
        vm: "1",
    },
    DeliveredDistalDepth: {
        tag: "300A0508",
        vr: "FL",
        vm: "1",
    },
    DeliveredNominalRangeModulationFractions: {
        tag: "300A0509",
        vr: "FL",
        vm: "2",
    },
    DeliveredNominalRangeModulatedRegionDepths: {
        tag: "300A0510",
        vr: "FL",
        vm: "2",
    },
    DeliveredReferenceDoseDefinition: {
        tag: "300A0511",
        vr: "CS",
        vm: "1",
    },
    ReferenceDoseDefinition: {
        tag: "300A0512",
        vr: "CS",
        vm: "1",
    },
    RTControlPointIndex: {
        tag: "300A0600",
        vr: "US",
        vm: "1",
    },
    RadiationGenerationModeIndex: {
        tag: "300A0601",
        vr: "US",
        vm: "1",
    },
    ReferencedDefinedDeviceIndex: {
        tag: "300A0602",
        vr: "US",
        vm: "1",
    },
    RadiationDoseIdentificationIndex: {
        tag: "300A0603",
        vr: "US",
        vm: "1",
    },
    NumberOfRTControlPoints: {
        tag: "300A0604",
        vr: "US",
        vm: "1",
    },
    ReferencedRadiationGenerationModeIndex: {
        tag: "300A0605",
        vr: "US",
        vm: "1",
    },
    TreatmentPositionIndex: {
        tag: "300A0606",
        vr: "US",
        vm: "1",
    },
    ReferencedDeviceIndex: {
        tag: "300A0607",
        vr: "US",
        vm: "1",
    },
    TreatmentPositionGroupLabel: {
        tag: "300A0608",
        vr: "LO",
        vm: "1",
    },
    TreatmentPositionGroupUID: {
        tag: "300A0609",
        vr: "UI",
        vm: "1",
    },
    TreatmentPositionGroupSequence: {
        tag: "300A060A",
        vr: "SQ",
        vm: "1",
    },
    ReferencedTreatmentPositionIndex: {
        tag: "300A060B",
        vr: "US",
        vm: "1",
    },
    ReferencedRadiationDoseIdentificationIndex: {
        tag: "300A060C",
        vr: "US",
        vm: "1",
    },
    RTAccessoryHolderWaterEquivalentThickness: {
        tag: "300A060D",
        vr: "FD",
        vm: "1",
    },
    ReferencedRTAccessoryHolderDeviceIndex: {
        tag: "300A060E",
        vr: "US",
        vm: "1",
    },
    RTAccessoryHolderSlotExistenceFlag: {
        tag: "300A060F",
        vr: "CS",
        vm: "1",
    },
    RTAccessoryHolderSlotSequence: {
        tag: "300A0610",
        vr: "SQ",
        vm: "1",
    },
    RTAccessoryHolderSlotID: {
        tag: "300A0611",
        vr: "LO",
        vm: "1",
    },
    RTAccessoryHolderSlotDistance: {
        tag: "300A0612",
        vr: "FD",
        vm: "1",
    },
    RTAccessorySlotDistance: {
        tag: "300A0613",
        vr: "FD",
        vm: "1",
    },
    RTAccessoryHolderDefinitionSequence: {
        tag: "300A0614",
        vr: "SQ",
        vm: "1",
    },
    RTAccessoryDeviceSlotID: {
        tag: "300A0615",
        vr: "LO",
        vm: "1",
    },
    RTRadiationSequence: {
        tag: "300A0616",
        vr: "SQ",
        vm: "1",
    },
    RadiationDoseSequence: {
        tag: "300A0617",
        vr: "SQ",
        vm: "1",
    },
    RadiationDoseIdentificationSequence: {
        tag: "300A0618",
        vr: "SQ",
        vm: "1",
    },
    RadiationDoseIdentificationLabel: {
        tag: "300A0619",
        vr: "LO",
        vm: "1",
    },
    ReferenceDoseType: {
        tag: "300A061A",
        vr: "CS",
        vm: "1",
    },
    PrimaryDoseValueIndicator: {
        tag: "300A061B",
        vr: "CS",
        vm: "1",
    },
    DoseValuesSequence: {
        tag: "300A061C",
        vr: "SQ",
        vm: "1",
    },
    DoseValuePurpose: {
        tag: "300A061D",
        vr: "CS",
        vm: "1-n",
    },
    ReferenceDosePointCoordinates: {
        tag: "300A061E",
        vr: "FD",
        vm: "3",
    },
    RadiationDoseValuesParametersSequence: {
        tag: "300A061F",
        vr: "SQ",
        vm: "1",
    },
    MetersetToDoseMappingSequence: {
        tag: "300A0620",
        vr: "SQ",
        vm: "1",
    },
    ExpectedInVivoMeasurementValuesSequence: {
        tag: "300A0621",
        vr: "SQ",
        vm: "1",
    },
    ExpectedInVivoMeasurementValueIndex: {
        tag: "300A0622",
        vr: "US",
        vm: "1",
    },
    RadiationDoseInVivoMeasurementLabel: {
        tag: "300A0623",
        vr: "LO",
        vm: "1",
    },
    RadiationDoseCentralAxisDisplacement: {
        tag: "300A0624",
        vr: "FD",
        vm: "2",
    },
    RadiationDoseValue: {
        tag: "300A0625",
        vr: "FD",
        vm: "1",
    },
    RadiationDoseSourceToSkinDistance: {
        tag: "300A0626",
        vr: "FD",
        vm: "1",
    },
    RadiationDoseMeasurementPointCoordinates: {
        tag: "300A0627",
        vr: "FD",
        vm: "3",
    },
    RadiationDoseSourceToExternalContourDistance: {
        tag: "300A0628",
        vr: "FD",
        vm: "1",
    },
    RTToleranceSetSequence: {
        tag: "300A0629",
        vr: "SQ",
        vm: "1",
    },
    RTToleranceSetLabel: {
        tag: "300A062A",
        vr: "LO",
        vm: "1",
    },
    AttributeToleranceValuesSequence: {
        tag: "300A062B",
        vr: "SQ",
        vm: "1",
    },
    ToleranceValue: {
        tag: "300A062C",
        vr: "FD",
        vm: "1",
    },
    PatientSupportPositionToleranceSequence: {
        tag: "300A062D",
        vr: "SQ",
        vm: "1",
    },
    TreatmentTimeLimit: {
        tag: "300A062E",
        vr: "FD",
        vm: "1",
    },
    CArmPhotonElectronControlPointSequence: {
        tag: "300A062F",
        vr: "SQ",
        vm: "1",
    },
    ReferencedRTRadiationSequence: {
        tag: "300A0630",
        vr: "SQ",
        vm: "1",
    },
    ReferencedRTInstanceSequence: {
        tag: "300A0631",
        vr: "SQ",
        vm: "1",
    },
    ReferencedRTPatientSetupSequence: {
        tag: "300A0632",
        vr: "SQ",
        vm: "1",
    },
    SourceToPatientSurfaceDistance: {
        tag: "300A0634",
        vr: "FD",
        vm: "1",
    },
    TreatmentMachineSpecialModeCodeSequence: {
        tag: "300A0635",
        vr: "SQ",
        vm: "1",
    },
    IntendedNumberOfFractions: {
        tag: "300A0636",
        vr: "US",
        vm: "1",
    },
    RTRadiationSetIntent: {
        tag: "300A0637",
        vr: "CS",
        vm: "1",
    },
    RTRadiationPhysicalAndGeometricContentDetailFlag: {
        tag: "300A0638",
        vr: "CS",
        vm: "1",
    },
    RTRecordFlag: {
        tag: "300A0639",
        vr: "CS",
        vm: "1",
    },
    TreatmentDeviceIdentificationSequence: {
        tag: "300A063A",
        vr: "SQ",
        vm: "1",
    },
    ReferencedRTPhysicianIntentSequence: {
        tag: "300A063B",
        vr: "SQ",
        vm: "1",
    },
    CumulativeMeterset: {
        tag: "300A063C",
        vr: "FD",
        vm: "1",
    },
    DeliveryRate: {
        tag: "300A063D",
        vr: "FD",
        vm: "1",
    },
    DeliveryRateUnitSequence: {
        tag: "300A063E",
        vr: "SQ",
        vm: "1",
    },
    TreatmentPositionSequence: {
        tag: "300A063F",
        vr: "SQ",
        vm: "1",
    },
    RadiationSourceAxisDistance: {
        tag: "300A0640",
        vr: "FD",
        vm: "1",
    },
    NumberOfRTBeamLimitingDevices: {
        tag: "300A0641",
        vr: "US",
        vm: "1",
    },
    RTBeamLimitingDeviceProximalDistance: {
        tag: "300A0642",
        vr: "FD",
        vm: "1",
    },
    RTBeamLimitingDeviceDistalDistance: {
        tag: "300A0643",
        vr: "FD",
        vm: "1",
    },
    ParallelRTBeamDelimiterDeviceOrientationLabelCodeSequence: {
        tag: "300A0644",
        vr: "SQ",
        vm: "1",
    },
    BeamModifierOrientationAngle: {
        tag: "300A0645",
        vr: "FD",
        vm: "1",
    },
    FixedRTBeamDelimiterDeviceSequence: {
        tag: "300A0646",
        vr: "SQ",
        vm: "1",
    },
    ParallelRTBeamDelimiterDeviceSequence: {
        tag: "300A0647",
        vr: "SQ",
        vm: "1",
    },
    NumberOfParallelRTBeamDelimiters: {
        tag: "300A0648",
        vr: "US",
        vm: "1",
    },
    ParallelRTBeamDelimiterBoundaries: {
        tag: "300A0649",
        vr: "FD",
        vm: "2-n",
    },
    ParallelRTBeamDelimiterPositions: {
        tag: "300A064A",
        vr: "FD",
        vm: "2-n",
    },
    RTBeamLimitingDeviceOffset: {
        tag: "300A064B",
        vr: "FD",
        vm: "2",
    },
    RTBeamDelimiterGeometrySequence: {
        tag: "300A064C",
        vr: "SQ",
        vm: "1",
    },
    RTBeamLimitingDeviceDefinitionSequence: {
        tag: "300A064D",
        vr: "SQ",
        vm: "1",
    },
    ParallelRTBeamDelimiterOpeningMode: {
        tag: "300A064E",
        vr: "CS",
        vm: "1",
    },
    ParallelRTBeamDelimiterLeafMountingSide: {
        tag: "300A064F",
        vr: "CS",
        vm: "1-n",
    },
    PatientSetupUID: {
        tag: "300A0650",
        vr: "UI",
        vm: "1",
    },
    WedgeDefinitionSequence: {
        tag: "300A0651",
        vr: "SQ",
        vm: "1",
    },
    RadiationBeamWedgeAngle: {
        tag: "300A0652",
        vr: "FD",
        vm: "1",
    },
    RadiationBeamWedgeThinEdgeDistance: {
        tag: "300A0653",
        vr: "FD",
        vm: "1",
    },
    RadiationBeamEffectiveWedgeAngle: {
        tag: "300A0654",
        vr: "FD",
        vm: "1",
    },
    NumberOfWedgePositions: {
        tag: "300A0655",
        vr: "US",
        vm: "1",
    },
    RTBeamLimitingDeviceOpeningSequence: {
        tag: "300A0656",
        vr: "SQ",
        vm: "1",
    },
    NumberOfRTBeamLimitingDeviceOpenings: {
        tag: "300A0657",
        vr: "US",
        vm: "1",
    },
    RadiationDosimeterUnitSequence: {
        tag: "300A0658",
        vr: "SQ",
        vm: "1",
    },
    RTDeviceDistanceReferenceLocationCodeSequence: {
        tag: "300A0659",
        vr: "SQ",
        vm: "1",
    },
    RadiationDeviceConfigurationAndCommissioningKeySequence: {
        tag: "300A065A",
        vr: "SQ",
        vm: "1",
    },
    PatientSupportPositionParameterSequence: {
        tag: "300A065B",
        vr: "SQ",
        vm: "1",
    },
    PatientSupportPositionSpecificationMethod: {
        tag: "300A065C",
        vr: "CS",
        vm: "1",
    },
    PatientSupportPositionDeviceParameterSequence: {
        tag: "300A065D",
        vr: "SQ",
        vm: "1",
    },
    DeviceOrderIndex: {
        tag: "300A065E",
        vr: "US",
        vm: "1",
    },
    PatientSupportPositionParameterOrderIndex: {
        tag: "300A065F",
        vr: "US",
        vm: "1",
    },
    PatientSupportPositionDeviceToleranceSequence: {
        tag: "300A0660",
        vr: "SQ",
        vm: "1",
    },
    PatientSupportPositionToleranceOrderIndex: {
        tag: "300A0661",
        vr: "US",
        vm: "1",
    },
    CompensatorDefinitionSequence: {
        tag: "300A0662",
        vr: "SQ",
        vm: "1",
    },
    CompensatorMapOrientation: {
        tag: "300A0663",
        vr: "CS",
        vm: "1",
    },
    CompensatorProximalThicknessMap: {
        tag: "300A0664",
        vr: "OF",
        vm: "1",
    },
    CompensatorDistalThicknessMap: {
        tag: "300A0665",
        vr: "OF",
        vm: "1",
    },
    CompensatorBasePlaneOffset: {
        tag: "300A0666",
        vr: "FD",
        vm: "1",
    },
    CompensatorShapeFabricationCodeSequence: {
        tag: "300A0667",
        vr: "SQ",
        vm: "1",
    },
    CompensatorShapeSequence: {
        tag: "300A0668",
        vr: "SQ",
        vm: "1",
    },
    RadiationBeamCompensatorMillingToolDiameter: {
        tag: "300A0669",
        vr: "FD",
        vm: "1",
    },
    BlockDefinitionSequence: {
        tag: "300A066A",
        vr: "SQ",
        vm: "1",
    },
    BlockEdgeData: {
        tag: "300A066B",
        vr: "OF",
        vm: "1",
    },
    BlockOrientation: {
        tag: "300A066C",
        vr: "CS",
        vm: "1",
    },
    RadiationBeamBlockThickness: {
        tag: "300A066D",
        vr: "FD",
        vm: "1",
    },
    RadiationBeamBlockSlabThickness: {
        tag: "300A066E",
        vr: "FD",
        vm: "1",
    },
    BlockEdgeDataSequence: {
        tag: "300A066F",
        vr: "SQ",
        vm: "1",
    },
    NumberOfRTAccessoryHolders: {
        tag: "300A0670",
        vr: "US",
        vm: "1",
    },
    GeneralAccessoryDefinitionSequence: {
        tag: "300A0671",
        vr: "SQ",
        vm: "1",
    },
    NumberOfGeneralAccessories: {
        tag: "300A0672",
        vr: "US",
        vm: "1",
    },
    BolusDefinitionSequence: {
        tag: "300A0673",
        vr: "SQ",
        vm: "1",
    },
    NumberOfBoluses: {
        tag: "300A0674",
        vr: "US",
        vm: "1",
    },
    EquipmentFrameOfReferenceUID: {
        tag: "300A0675",
        vr: "UI",
        vm: "1",
    },
    EquipmentFrameOfReferenceDescription: {
        tag: "300A0676",
        vr: "ST",
        vm: "1",
    },
    EquipmentReferencePointCoordinatesSequence: {
        tag: "300A0677",
        vr: "SQ",
        vm: "1",
    },
    EquipmentReferencePointCodeSequence: {
        tag: "300A0678",
        vr: "SQ",
        vm: "1",
    },
    RTBeamLimitingDeviceAngle: {
        tag: "300A0679",
        vr: "FD",
        vm: "1",
    },
    SourceRollAngle: {
        tag: "300A067A",
        vr: "FD",
        vm: "1",
    },
    RadiationGenerationModeSequence: {
        tag: "300A067B",
        vr: "SQ",
        vm: "1",
    },
    RadiationGenerationModeLabel: {
        tag: "300A067C",
        vr: "SH",
        vm: "1",
    },
    RadiationGenerationModeDescription: {
        tag: "300A067D",
        vr: "ST",
        vm: "1",
    },
    RadiationGenerationModeMachineCodeSequence: {
        tag: "300A067E",
        vr: "SQ",
        vm: "1",
    },
    RadiationTypeCodeSequence: {
        tag: "300A067F",
        vr: "SQ",
        vm: "1",
    },
    NominalEnergy: {
        tag: "300A0680",
        vr: "DS",
        vm: "1",
    },
    MinimumNominalEnergy: {
        tag: "300A0681",
        vr: "DS",
        vm: "1",
    },
    MaximumNominalEnergy: {
        tag: "300A0682",
        vr: "DS",
        vm: "1",
    },
    RadiationFluenceModifierCodeSequence: {
        tag: "300A0683",
        vr: "SQ",
        vm: "1",
    },
    EnergyUnitCodeSequence: {
        tag: "300A0684",
        vr: "SQ",
        vm: "1",
    },
    NumberOfRadiationGenerationModes: {
        tag: "300A0685",
        vr: "US",
        vm: "1",
    },
    PatientSupportDevicesSequence: {
        tag: "300A0686",
        vr: "SQ",
        vm: "1",
    },
    NumberOfPatientSupportDevices: {
        tag: "300A0687",
        vr: "US",
        vm: "1",
    },
    RTBeamModifierDefinitionDistance: {
        tag: "300A0688",
        vr: "FD",
        vm: "1",
    },
    BeamAreaLimitSequence: {
        tag: "300A0689",
        vr: "SQ",
        vm: "1",
    },
    ReferencedRTPrescriptionSequence: {
        tag: "300A068A",
        vr: "SQ",
        vm: "1",
    },
    DoseValueInterpretation: {
        tag: "300A068B",
        vr: "CS",
        vm: "1",
    },
    TreatmentSessionUID: {
        tag: "300A0700",
        vr: "UI",
        vm: "1",
    },
    RTRadiationUsage: {
        tag: "300A0701",
        vr: "CS",
        vm: "1",
    },
    ReferencedRTRadiationSetSequence: {
        tag: "300A0702",
        vr: "SQ",
        vm: "1",
    },
    ReferencedRTRadiationRecordSequence: {
        tag: "300A0703",
        vr: "SQ",
        vm: "1",
    },
    RTRadiationSetDeliveryNumber: {
        tag: "300A0704",
        vr: "US",
        vm: "1",
    },
    ClinicalFractionNumber: {
        tag: "300A0705",
        vr: "US",
        vm: "1",
    },
    RTTreatmentFractionCompletionStatus: {
        tag: "300A0706",
        vr: "CS",
        vm: "1",
    },
    RTRadiationSetUsage: {
        tag: "300A0707",
        vr: "CS",
        vm: "1",
    },
    TreatmentDeliveryContinuationFlag: {
        tag: "300A0708",
        vr: "CS",
        vm: "1",
    },
    TreatmentRecordContentOrigin: {
        tag: "300A0709",
        vr: "CS",
        vm: "1",
    },
    RTTreatmentTerminationStatus: {
        tag: "300A0714",
        vr: "CS",
        vm: "1",
    },
    RTTreatmentTerminationReasonCodeSequence: {
        tag: "300A0715",
        vr: "SQ",
        vm: "1",
    },
    MachineSpecificTreatmentTerminationCodeSequence: {
        tag: "300A0716",
        vr: "SQ",
        vm: "1",
    },
    RTRadiationSalvageRecordControlPointSequence: {
        tag: "300A0722",
        vr: "SQ",
        vm: "1",
    },
    StartingMetersetValueKnownFlag: {
        tag: "300A0723",
        vr: "CS",
        vm: "1",
    },
    TreatmentTerminationDescription: {
        tag: "300A0730",
        vr: "ST",
        vm: "1",
    },
    TreatmentToleranceViolationSequence: {
        tag: "300A0731",
        vr: "SQ",
        vm: "1",
    },
    TreatmentToleranceViolationCategory: {
        tag: "300A0732",
        vr: "CS",
        vm: "1",
    },
    TreatmentToleranceViolationAttributeSequence: {
        tag: "300A0733",
        vr: "SQ",
        vm: "1",
    },
    TreatmentToleranceViolationDescription: {
        tag: "300A0734",
        vr: "ST",
        vm: "1",
    },
    TreatmentToleranceViolationIdentification: {
        tag: "300A0735",
        vr: "ST",
        vm: "1",
    },
    TreatmentToleranceViolationDateTime: {
        tag: "300A0736",
        vr: "DT",
        vm: "1",
    },
    RecordedRTControlPointDateTime: {
        tag: "300A073A",
        vr: "DT",
        vm: "1",
    },
    ReferencedRadiationRTControlPointIndex: {
        tag: "300A073B",
        vr: "US",
        vm: "1",
    },
    AlternateValueSequence: {
        tag: "300A073E",
        vr: "SQ",
        vm: "1",
    },
    ConfirmationSequence: {
        tag: "300A073F",
        vr: "SQ",
        vm: "1",
    },
    InterlockSequence: {
        tag: "300A0740",
        vr: "SQ",
        vm: "1",
    },
    InterlockDateTime: {
        tag: "300A0741",
        vr: "DT",
        vm: "1",
    },
    InterlockDescription: {
        tag: "300A0742",
        vr: "ST",
        vm: "1",
    },
    InterlockOriginatingDeviceSequence: {
        tag: "300A0743",
        vr: "SQ",
        vm: "1",
    },
    InterlockCodeSequence: {
        tag: "300A0744",
        vr: "SQ",
        vm: "1",
    },
    InterlockResolutionCodeSequence: {
        tag: "300A0745",
        vr: "SQ",
        vm: "1",
    },
    InterlockResolutionUserSequence: {
        tag: "300A0746",
        vr: "SQ",
        vm: "1",
    },
    OverrideDateTime: {
        tag: "300A0760",
        vr: "DT",
        vm: "1",
    },
    TreatmentToleranceViolationTypeCodeSequence: {
        tag: "300A0761",
        vr: "SQ",
        vm: "1",
    },
    TreatmentToleranceViolationCauseCodeSequence: {
        tag: "300A0762",
        vr: "SQ",
        vm: "1",
    },
    MeasuredMetersetToDoseMappingSequence: {
        tag: "300A0772",
        vr: "SQ",
        vm: "1",
    },
    ReferencedExpectedInVivoMeasurementValueIndex: {
        tag: "300A0773",
        vr: "US",
        vm: "1",
    },
    DoseMeasurementDeviceCodeSequence: {
        tag: "300A0774",
        vr: "SQ",
        vm: "1",
    },
    AdditionalParameterRecordingInstanceSequence: {
        tag: "300A0780",
        vr: "SQ",
        vm: "1",
    },
    InterlockOriginDescription: {
        tag: "300A0783",
        vr: "ST",
        vm: "1",
    },
    RTPatientPositionScopeSequence: {
        tag: "300A0784",
        vr: "SQ",
        vm: "1",
    },
    ReferencedTreatmentPositionGroupUID: {
        tag: "300A0785",
        vr: "UI",
        vm: "1",
    },
    RadiationOrderIndex: {
        tag: "300A0786",
        vr: "US",
        vm: "1",
    },
    OmittedRadiationSequence: {
        tag: "300A0787",
        vr: "SQ",
        vm: "1",
    },
    ReasonForOmissionCodeSequence: {
        tag: "300A0788",
        vr: "SQ",
        vm: "1",
    },
    RTDeliveryStartPatientPositionSequence: {
        tag: "300A0789",
        vr: "SQ",
        vm: "1",
    },
    RTTreatmentPreparationPatientPositionSequence: {
        tag: "300A078A",
        vr: "SQ",
        vm: "1",
    },
    ReferencedRTTreatmentPreparationSequence: {
        tag: "300A078B",
        vr: "SQ",
        vm: "1",
    },
    ReferencedPatientSetupPhotoSequence: {
        tag: "300A078C",
        vr: "SQ",
        vm: "1",
    },
    PatientTreatmentPreparationMethodCodeSequence: {
        tag: "300A078D",
        vr: "SQ",
        vm: "1",
    },
    PatientTreatmentPreparationProcedureParameterDescription: {
        tag: "300A078E",
        vr: "LT",
        vm: "1",
    },
    PatientTreatmentPreparationDeviceSequence: {
        tag: "300A078F",
        vr: "SQ",
        vm: "1",
    },
    PatientTreatmentPreparationProcedureSequence: {
        tag: "300A0790",
        vr: "SQ",
        vm: "1",
    },
    PatientTreatmentPreparationProcedureCodeSequence: {
        tag: "300A0791",
        vr: "SQ",
        vm: "1",
    },
    PatientTreatmentPreparationMethodDescription: {
        tag: "300A0792",
        vr: "LT",
        vm: "1",
    },
    PatientTreatmentPreparationProcedureParameterSequence: {
        tag: "300A0793",
        vr: "SQ",
        vm: "1",
    },
    PatientSetupPhotoDescription: {
        tag: "300A0794",
        vr: "LT",
        vm: "1",
    },
    PatientTreatmentPreparationProcedureIndex: {
        tag: "300A0795",
        vr: "US",
        vm: "1",
    },
    ReferencedPatientSetupProcedureIndex: {
        tag: "300A0796",
        vr: "US",
        vm: "1",
    },
    RTRadiationTaskSequence: {
        tag: "300A0797",
        vr: "SQ",
        vm: "1",
    },
    RTPatientPositionDisplacementSequence: {
        tag: "300A0798",
        vr: "SQ",
        vm: "1",
    },
    RTPatientPositionSequence: {
        tag: "300A0799",
        vr: "SQ",
        vm: "1",
    },
    DisplacementReferenceLabel: {
        tag: "300A079A",
        vr: "LO",
        vm: "1",
    },
    DisplacementMatrix: {
        tag: "300A079B",
        vr: "FD",
        vm: "16",
    },
    PatientSupportDisplacementSequence: {
        tag: "300A079C",
        vr: "SQ",
        vm: "1",
    },
    DisplacementReferenceLocationCodeSequence: {
        tag: "300A079D",
        vr: "SQ",
        vm: "1",
    },
    RTRadiationSetDeliveryUsage: {
        tag: "300A079E",
        vr: "CS",
        vm: "1",
    },
    PatientTreatmentPreparationSequence: {
        tag: "300A079F",
        vr: "SQ",
        vm: "1",
    },
    PatientToEquipmentRelationshipSequence: {
        tag: "300A07A0",
        vr: "SQ",
        vm: "1",
    },
    ImagingEquipmentToTreatmentDeliveryDeviceRelationshipSequence: {
        tag: "300A07A1",
        vr: "SQ",
        vm: "1",
    },
    ReferencedRTPlanSequence: {
        tag: "300C0002",
        vr: "SQ",
        vm: "1",
    },
    ReferencedBeamSequence: {
        tag: "300C0004",
        vr: "SQ",
        vm: "1",
    },
    ReferencedBeamNumber: {
        tag: "300C0006",
        vr: "IS",
        vm: "1",
    },
    ReferencedReferenceImageNumber: {
        tag: "300C0007",
        vr: "IS",
        vm: "1",
    },
    StartCumulativeMetersetWeight: {
        tag: "300C0008",
        vr: "DS",
        vm: "1",
    },
    EndCumulativeMetersetWeight: {
        tag: "300C0009",
        vr: "DS",
        vm: "1",
    },
    ReferencedBrachyApplicationSetupSequence: {
        tag: "300C000A",
        vr: "SQ",
        vm: "1",
    },
    ReferencedBrachyApplicationSetupNumber: {
        tag: "300C000C",
        vr: "IS",
        vm: "1",
    },
    ReferencedSourceNumber: {
        tag: "300C000E",
        vr: "IS",
        vm: "1",
    },
    ReferencedFractionGroupSequence: {
        tag: "300C0020",
        vr: "SQ",
        vm: "1",
    },
    ReferencedFractionGroupNumber: {
        tag: "300C0022",
        vr: "IS",
        vm: "1",
    },
    ReferencedVerificationImageSequence: {
        tag: "300C0040",
        vr: "SQ",
        vm: "1",
    },
    ReferencedReferenceImageSequence: {
        tag: "300C0042",
        vr: "SQ",
        vm: "1",
    },
    ReferencedDoseReferenceSequence: {
        tag: "300C0050",
        vr: "SQ",
        vm: "1",
    },
    ReferencedDoseReferenceNumber: {
        tag: "300C0051",
        vr: "IS",
        vm: "1",
    },
    BrachyReferencedDoseReferenceSequence: {
        tag: "300C0055",
        vr: "SQ",
        vm: "1",
    },
    ReferencedStructureSetSequence: {
        tag: "300C0060",
        vr: "SQ",
        vm: "1",
    },
    ReferencedPatientSetupNumber: {
        tag: "300C006A",
        vr: "IS",
        vm: "1",
    },
    ReferencedDoseSequence: {
        tag: "300C0080",
        vr: "SQ",
        vm: "1",
    },
    ReferencedToleranceTableNumber: {
        tag: "300C00A0",
        vr: "IS",
        vm: "1",
    },
    ReferencedBolusSequence: {
        tag: "300C00B0",
        vr: "SQ",
        vm: "1",
    },
    ReferencedWedgeNumber: {
        tag: "300C00C0",
        vr: "IS",
        vm: "1",
    },
    ReferencedCompensatorNumber: {
        tag: "300C00D0",
        vr: "IS",
        vm: "1",
    },
    ReferencedBlockNumber: {
        tag: "300C00E0",
        vr: "IS",
        vm: "1",
    },
    ReferencedControlPointIndex: {
        tag: "300C00F0",
        vr: "IS",
        vm: "1",
    },
    ReferencedControlPointSequence: {
        tag: "300C00F2",
        vr: "SQ",
        vm: "1",
    },
    ReferencedStartControlPointIndex: {
        tag: "300C00F4",
        vr: "IS",
        vm: "1",
    },
    ReferencedStopControlPointIndex: {
        tag: "300C00F6",
        vr: "IS",
        vm: "1",
    },
    ReferencedRangeShifterNumber: {
        tag: "300C0100",
        vr: "IS",
        vm: "1",
    },
    ReferencedLateralSpreadingDeviceNumber: {
        tag: "300C0102",
        vr: "IS",
        vm: "1",
    },
    ReferencedRangeModulatorNumber: {
        tag: "300C0104",
        vr: "IS",
        vm: "1",
    },
    OmittedBeamTaskSequence: {
        tag: "300C0111",
        vr: "SQ",
        vm: "1",
    },
    ReasonForOmission: {
        tag: "300C0112",
        vr: "CS",
        vm: "1",
    },
    ReasonForOmissionDescription: {
        tag: "300C0113",
        vr: "LO",
        vm: "1",
    },
    PrescriptionOverviewSequence: {
        tag: "300C0114",
        vr: "SQ",
        vm: "1",
    },
    TotalPrescriptionDose: {
        tag: "300C0115",
        vr: "FL",
        vm: "1",
    },
    PlanOverviewSequence: {
        tag: "300C0116",
        vr: "SQ",
        vm: "1",
    },
    PlanOverviewIndex: {
        tag: "300C0117",
        vr: "US",
        vm: "1",
    },
    ReferencedPlanOverviewIndex: {
        tag: "300C0118",
        vr: "US",
        vm: "1",
    },
    NumberOfFractionsIncluded: {
        tag: "300C0119",
        vr: "US",
        vm: "1",
    },
    DoseCalibrationConditionsSequence: {
        tag: "300C0120",
        vr: "SQ",
        vm: "1",
    },
    AbsorbedDoseToMetersetRatio: {
        tag: "300C0121",
        vr: "FD",
        vm: "1",
    },
    DelineatedRadiationFieldSize: {
        tag: "300C0122",
        vr: "FD",
        vm: "2",
    },
    DoseCalibrationConditionsVerifiedFlag: {
        tag: "300C0123",
        vr: "CS",
        vm: "1",
    },
    CalibrationReferencePointDepth: {
        tag: "300C0124",
        vr: "FD",
        vm: "1",
    },
    GatingBeamHoldTransitionSequence: {
        tag: "300C0125",
        vr: "SQ",
        vm: "1",
    },
    BeamHoldTransition: {
        tag: "300C0126",
        vr: "CS",
        vm: "1",
    },
    BeamHoldTransitionDateTime: {
        tag: "300C0127",
        vr: "DT",
        vm: "1",
    },
    BeamHoldOriginatingDeviceSequence: {
        tag: "300C0128",
        vr: "SQ",
        vm: "1",
    },
    BeamHoldTransitionTriggerSource: {
        tag: "300C0129",
        vr: "CS",
        vm: "1",
    },
    ApprovalStatus: {
        tag: "300E0002",
        vr: "CS",
        vm: "1",
    },
    ReviewDate: {
        tag: "300E0004",
        vr: "DA",
        vm: "1",
    },
    ReviewTime: {
        tag: "300E0005",
        vr: "TM",
        vm: "1",
    },
    ReviewerName: {
        tag: "300E0008",
        vr: "PN",
        vm: "1",
    },
    RadiobiologicalDoseEffectSequence: {
        tag: "30100001",
        vr: "SQ",
        vm: "1",
    },
    RadiobiologicalDoseEffectFlag: {
        tag: "30100002",
        vr: "CS",
        vm: "1",
    },
    EffectiveDoseCalculationMethodCategoryCodeSequence: {
        tag: "30100003",
        vr: "SQ",
        vm: "1",
    },
    EffectiveDoseCalculationMethodCodeSequence: {
        tag: "30100004",
        vr: "SQ",
        vm: "1",
    },
    EffectiveDoseCalculationMethodDescription: {
        tag: "30100005",
        vr: "LO",
        vm: "1",
    },
    ConceptualVolumeUID: {
        tag: "30100006",
        vr: "UI",
        vm: "1",
    },
    OriginatingSOPInstanceReferenceSequence: {
        tag: "30100007",
        vr: "SQ",
        vm: "1",
    },
    ConceptualVolumeConstituentSequence: {
        tag: "30100008",
        vr: "SQ",
        vm: "1",
    },
    EquivalentConceptualVolumeInstanceReferenceSequence: {
        tag: "30100009",
        vr: "SQ",
        vm: "1",
    },
    EquivalentConceptualVolumesSequence: {
        tag: "3010000A",
        vr: "SQ",
        vm: "1",
    },
    ReferencedConceptualVolumeUID: {
        tag: "3010000B",
        vr: "UI",
        vm: "1",
    },
    ConceptualVolumeCombinationExpression: {
        tag: "3010000C",
        vr: "UT",
        vm: "1",
    },
    ConceptualVolumeConstituentIndex: {
        tag: "3010000D",
        vr: "US",
        vm: "1",
    },
    ConceptualVolumeCombinationFlag: {
        tag: "3010000E",
        vr: "CS",
        vm: "1",
    },
    ConceptualVolumeCombinationDescription: {
        tag: "3010000F",
        vr: "ST",
        vm: "1",
    },
    ConceptualVolumeSegmentationDefinedFlag: {
        tag: "30100010",
        vr: "CS",
        vm: "1",
    },
    ConceptualVolumeSegmentationReferenceSequence: {
        tag: "30100011",
        vr: "SQ",
        vm: "1",
    },
    ConceptualVolumeConstituentSegmentationReferenceSequence: {
        tag: "30100012",
        vr: "SQ",
        vm: "1",
    },
    ConstituentConceptualVolumeUID: {
        tag: "30100013",
        vr: "UI",
        vm: "1",
    },
    DerivationConceptualVolumeSequence: {
        tag: "30100014",
        vr: "SQ",
        vm: "1",
    },
    SourceConceptualVolumeUID: {
        tag: "30100015",
        vr: "UI",
        vm: "1",
    },
    ConceptualVolumeDerivationAlgorithmSequence: {
        tag: "30100016",
        vr: "SQ",
        vm: "1",
    },
    ConceptualVolumeDescription: {
        tag: "30100017",
        vr: "ST",
        vm: "1",
    },
    SourceConceptualVolumeSequence: {
        tag: "30100018",
        vr: "SQ",
        vm: "1",
    },
    AuthorIdentificationSequence: {
        tag: "30100019",
        vr: "SQ",
        vm: "1",
    },
    ManufacturerModelVersion: {
        tag: "3010001A",
        vr: "LO",
        vm: "1",
    },
    DeviceAlternateIdentifier: {
        tag: "3010001B",
        vr: "UC",
        vm: "1",
    },
    DeviceAlternateIdentifierType: {
        tag: "3010001C",
        vr: "CS",
        vm: "1",
    },
    DeviceAlternateIdentifierFormat: {
        tag: "3010001D",
        vr: "LT",
        vm: "1",
    },
    SegmentationCreationTemplateLabel: {
        tag: "3010001E",
        vr: "LO",
        vm: "1",
    },
    SegmentationTemplateUID: {
        tag: "3010001F",
        vr: "UI",
        vm: "1",
    },
    ReferencedSegmentReferenceIndex: {
        tag: "30100020",
        vr: "US",
        vm: "1",
    },
    SegmentReferenceSequence: {
        tag: "30100021",
        vr: "SQ",
        vm: "1",
    },
    SegmentReferenceIndex: {
        tag: "30100022",
        vr: "US",
        vm: "1",
    },
    DirectSegmentReferenceSequence: {
        tag: "30100023",
        vr: "SQ",
        vm: "1",
    },
    CombinationSegmentReferenceSequence: {
        tag: "30100024",
        vr: "SQ",
        vm: "1",
    },
    ConceptualVolumeSequence: {
        tag: "30100025",
        vr: "SQ",
        vm: "1",
    },
    SegmentedRTAccessoryDeviceSequence: {
        tag: "30100026",
        vr: "SQ",
        vm: "1",
    },
    SegmentCharacteristicsSequence: {
        tag: "30100027",
        vr: "SQ",
        vm: "1",
    },
    RelatedSegmentCharacteristicsSequence: {
        tag: "30100028",
        vr: "SQ",
        vm: "1",
    },
    SegmentCharacteristicsPrecedence: {
        tag: "30100029",
        vr: "US",
        vm: "1",
    },
    RTSegmentAnnotationSequence: {
        tag: "3010002A",
        vr: "SQ",
        vm: "1",
    },
    SegmentAnnotationCategoryCodeSequence: {
        tag: "3010002B",
        vr: "SQ",
        vm: "1",
    },
    SegmentAnnotationTypeCodeSequence: {
        tag: "3010002C",
        vr: "SQ",
        vm: "1",
    },
    DeviceLabel: {
        tag: "3010002D",
        vr: "LO",
        vm: "1",
    },
    DeviceTypeCodeSequence: {
        tag: "3010002E",
        vr: "SQ",
        vm: "1",
    },
    SegmentAnnotationTypeModifierCodeSequence: {
        tag: "3010002F",
        vr: "SQ",
        vm: "1",
    },
    PatientEquipmentRelationshipCodeSequence: {
        tag: "30100030",
        vr: "SQ",
        vm: "1",
    },
    ReferencedFiducialsUID: {
        tag: "30100031",
        vr: "UI",
        vm: "1",
    },
    PatientTreatmentOrientationSequence: {
        tag: "30100032",
        vr: "SQ",
        vm: "1",
    },
    UserContentLabel: {
        tag: "30100033",
        vr: "SH",
        vm: "1",
    },
    UserContentLongLabel: {
        tag: "30100034",
        vr: "LO",
        vm: "1",
    },
    EntityLabel: {
        tag: "30100035",
        vr: "SH",
        vm: "1",
    },
    EntityName: {
        tag: "30100036",
        vr: "LO",
        vm: "1",
    },
    EntityDescription: {
        tag: "30100037",
        vr: "ST",
        vm: "1",
    },
    EntityLongLabel: {
        tag: "30100038",
        vr: "LO",
        vm: "1",
    },
    DeviceIndex: {
        tag: "30100039",
        vr: "US",
        vm: "1",
    },
    RTTreatmentPhaseIndex: {
        tag: "3010003A",
        vr: "US",
        vm: "1",
    },
    RTTreatmentPhaseUID: {
        tag: "3010003B",
        vr: "UI",
        vm: "1",
    },
    RTPrescriptionIndex: {
        tag: "3010003C",
        vr: "US",
        vm: "1",
    },
    RTSegmentAnnotationIndex: {
        tag: "3010003D",
        vr: "US",
        vm: "1",
    },
    BasisRTTreatmentPhaseIndex: {
        tag: "3010003E",
        vr: "US",
        vm: "1",
    },
    RelatedRTTreatmentPhaseIndex: {
        tag: "3010003F",
        vr: "US",
        vm: "1",
    },
    ReferencedRTTreatmentPhaseIndex: {
        tag: "30100040",
        vr: "US",
        vm: "1",
    },
    ReferencedRTPrescriptionIndex: {
        tag: "30100041",
        vr: "US",
        vm: "1",
    },
    ReferencedParentRTPrescriptionIndex: {
        tag: "30100042",
        vr: "US",
        vm: "1",
    },
    ManufacturerDeviceIdentifier: {
        tag: "30100043",
        vr: "ST",
        vm: "1",
    },
    InstanceLevelReferencedPerformedProcedureStepSequence: {
        tag: "30100044",
        vr: "SQ",
        vm: "1",
    },
    RTTreatmentPhaseIntentPresenceFlag: {
        tag: "30100045",
        vr: "CS",
        vm: "1",
    },
    RadiotherapyTreatmentType: {
        tag: "30100046",
        vr: "CS",
        vm: "1",
    },
    TeletherapyRadiationType: {
        tag: "30100047",
        vr: "CS",
        vm: "1-n",
    },
    BrachytherapySourceType: {
        tag: "30100048",
        vr: "CS",
        vm: "1-n",
    },
    ReferencedRTTreatmentPhaseSequence: {
        tag: "30100049",
        vr: "SQ",
        vm: "1",
    },
    ReferencedDirectSegmentInstanceSequence: {
        tag: "3010004A",
        vr: "SQ",
        vm: "1",
    },
    IntendedRTTreatmentPhaseSequence: {
        tag: "3010004B",
        vr: "SQ",
        vm: "1",
    },
    IntendedPhaseStartDate: {
        tag: "3010004C",
        vr: "DA",
        vm: "1",
    },
    IntendedPhaseEndDate: {
        tag: "3010004D",
        vr: "DA",
        vm: "1",
    },
    RTTreatmentPhaseIntervalSequence: {
        tag: "3010004E",
        vr: "SQ",
        vm: "1",
    },
    TemporalRelationshipIntervalAnchor: {
        tag: "3010004F",
        vr: "CS",
        vm: "1",
    },
    MinimumNumberOfIntervalDays: {
        tag: "30100050",
        vr: "FD",
        vm: "1",
    },
    MaximumNumberOfIntervalDays: {
        tag: "30100051",
        vr: "FD",
        vm: "1",
    },
    PertinentSOPClassesInStudy: {
        tag: "30100052",
        vr: "UI",
        vm: "1-n",
    },
    PertinentSOPClassesInSeries: {
        tag: "30100053",
        vr: "UI",
        vm: "1-n",
    },
    RTPrescriptionLabel: {
        tag: "30100054",
        vr: "LO",
        vm: "1",
    },
    RTPhysicianIntentPredecessorSequence: {
        tag: "30100055",
        vr: "SQ",
        vm: "1",
    },
    RTTreatmentApproachLabel: {
        tag: "30100056",
        vr: "LO",
        vm: "1",
    },
    RTPhysicianIntentSequence: {
        tag: "30100057",
        vr: "SQ",
        vm: "1",
    },
    RTPhysicianIntentIndex: {
        tag: "30100058",
        vr: "US",
        vm: "1",
    },
    RTTreatmentIntentType: {
        tag: "30100059",
        vr: "CS",
        vm: "1",
    },
    RTPhysicianIntentNarrative: {
        tag: "3010005A",
        vr: "UT",
        vm: "1",
    },
    RTProtocolCodeSequence: {
        tag: "3010005B",
        vr: "SQ",
        vm: "1",
    },
    ReasonForSuperseding: {
        tag: "3010005C",
        vr: "ST",
        vm: "1",
    },
    RTDiagnosisCodeSequence: {
        tag: "3010005D",
        vr: "SQ",
        vm: "1",
    },
    ReferencedRTPhysicianIntentIndex: {
        tag: "3010005E",
        vr: "US",
        vm: "1",
    },
    RTPhysicianIntentInputInstanceSequence: {
        tag: "3010005F",
        vr: "SQ",
        vm: "1",
    },
    RTAnatomicPrescriptionSequence: {
        tag: "30100060",
        vr: "SQ",
        vm: "1",
    },
    PriorTreatmentDoseDescription: {
        tag: "30100061",
        vr: "UT",
        vm: "1",
    },
    PriorTreatmentReferenceSequence: {
        tag: "30100062",
        vr: "SQ",
        vm: "1",
    },
    DosimetricObjectiveEvaluationScope: {
        tag: "30100063",
        vr: "CS",
        vm: "1",
    },
    TherapeuticRoleCategoryCodeSequence: {
        tag: "30100064",
        vr: "SQ",
        vm: "1",
    },
    TherapeuticRoleTypeCodeSequence: {
        tag: "30100065",
        vr: "SQ",
        vm: "1",
    },
    ConceptualVolumeOptimizationPrecedence: {
        tag: "30100066",
        vr: "US",
        vm: "1",
    },
    ConceptualVolumeCategoryCodeSequence: {
        tag: "30100067",
        vr: "SQ",
        vm: "1",
    },
    ConceptualVolumeBlockingConstraint: {
        tag: "30100068",
        vr: "CS",
        vm: "1",
    },
    ConceptualVolumeTypeCodeSequence: {
        tag: "30100069",
        vr: "SQ",
        vm: "1",
    },
    ConceptualVolumeTypeModifierCodeSequence: {
        tag: "3010006A",
        vr: "SQ",
        vm: "1",
    },
    RTPrescriptionSequence: {
        tag: "3010006B",
        vr: "SQ",
        vm: "1",
    },
    DosimetricObjectiveSequence: {
        tag: "3010006C",
        vr: "SQ",
        vm: "1",
    },
    DosimetricObjectiveTypeCodeSequence: {
        tag: "3010006D",
        vr: "SQ",
        vm: "1",
    },
    DosimetricObjectiveUID: {
        tag: "3010006E",
        vr: "UI",
        vm: "1",
    },
    ReferencedDosimetricObjectiveUID: {
        tag: "3010006F",
        vr: "UI",
        vm: "1",
    },
    DosimetricObjectiveParameterSequence: {
        tag: "30100070",
        vr: "SQ",
        vm: "1",
    },
    ReferencedDosimetricObjectivesSequence: {
        tag: "30100071",
        vr: "SQ",
        vm: "1",
    },
    AbsoluteDosimetricObjectiveFlag: {
        tag: "30100073",
        vr: "CS",
        vm: "1",
    },
    DosimetricObjectiveWeight: {
        tag: "30100074",
        vr: "FD",
        vm: "1",
    },
    DosimetricObjectivePurpose: {
        tag: "30100075",
        vr: "CS",
        vm: "1",
    },
    PlanningInputInformationSequence: {
        tag: "30100076",
        vr: "SQ",
        vm: "1",
    },
    TreatmentSite: {
        tag: "30100077",
        vr: "LO",
        vm: "1",
    },
    TreatmentSiteCodeSequence: {
        tag: "30100078",
        vr: "SQ",
        vm: "1",
    },
    FractionPatternSequence: {
        tag: "30100079",
        vr: "SQ",
        vm: "1",
    },
    TreatmentTechniqueNotes: {
        tag: "3010007A",
        vr: "UT",
        vm: "1",
    },
    PrescriptionNotes: {
        tag: "3010007B",
        vr: "UT",
        vm: "1",
    },
    NumberOfIntervalFractions: {
        tag: "3010007C",
        vr: "IS",
        vm: "1",
    },
    NumberOfFractions: {
        tag: "3010007D",
        vr: "US",
        vm: "1",
    },
    IntendedDeliveryDuration: {
        tag: "3010007E",
        vr: "US",
        vm: "1",
    },
    FractionationNotes: {
        tag: "3010007F",
        vr: "UT",
        vm: "1",
    },
    RTTreatmentTechniqueCodeSequence: {
        tag: "30100080",
        vr: "SQ",
        vm: "1",
    },
    PrescriptionNotesSequence: {
        tag: "30100081",
        vr: "SQ",
        vm: "1",
    },
    FractionBasedRelationshipSequence: {
        tag: "30100082",
        vr: "SQ",
        vm: "1",
    },
    FractionBasedRelationshipIntervalAnchor: {
        tag: "30100083",
        vr: "CS",
        vm: "1",
    },
    MinimumHoursBetweenFractions: {
        tag: "30100084",
        vr: "FD",
        vm: "1",
    },
    IntendedFractionStartTime: {
        tag: "30100085",
        vr: "TM",
        vm: "1-n",
    },
    IntendedStartDayOfWeek: {
        tag: "30100086",
        vr: "LT",
        vm: "1",
    },
    WeekdayFractionPatternSequence: {
        tag: "30100087",
        vr: "SQ",
        vm: "1",
    },
    DeliveryTimeStructureCodeSequence: {
        tag: "30100088",
        vr: "SQ",
        vm: "1",
    },
    TreatmentSiteModifierCodeSequence: {
        tag: "30100089",
        vr: "SQ",
        vm: "1",
    },
    RoboticBaseLocationIndicator: {
        tag: "30100090",
        vr: "CS",
        vm: "1",
    },
    RoboticPathNodeSetCodeSequence: {
        tag: "30100091",
        vr: "SQ",
        vm: "1",
    },
    RoboticNodeIdentifier: {
        tag: "30100092",
        vr: "UL",
        vm: "1",
    },
    RTTreatmentSourceCoordinates: {
        tag: "30100093",
        vr: "FD",
        vm: "3",
    },
    RadiationSourceCoordinateSystemYawAngle: {
        tag: "30100094",
        vr: "FD",
        vm: "1",
    },
    RadiationSourceCoordinateSystemRollAngle: {
        tag: "30100095",
        vr: "FD",
        vm: "1",
    },
    RadiationSourceCoordinateSystemPitchAngle: {
        tag: "30100096",
        vr: "FD",
        vm: "1",
    },
    RoboticPathControlPointSequence: {
        tag: "30100097",
        vr: "SQ",
        vm: "1",
    },
    TomotherapeuticControlPointSequence: {
        tag: "30100098",
        vr: "SQ",
        vm: "1",
    },
    TomotherapeuticLeafOpenDurations: {
        tag: "30100099",
        vr: "FD",
        vm: "1-n",
    },
    TomotherapeuticLeafInitialClosedDurations: {
        tag: "3010009A",
        vr: "FD",
        vm: "1-n",
    },
    ConceptualVolumeIdentificationSequence: {
        tag: "301000A0",
        vr: "SQ",
        vm: "1",
    },
    Arbitrary: {
        tag: "40000010",
        vr: "LT",
        vm: "1",
    },
    TextComments: {
        tag: "40004000",
        vr: "LT",
        vm: "1",
    },
    ResultsID: {
        tag: "40080040",
        vr: "SH",
        vm: "1",
    },
    ResultsIDIssuer: {
        tag: "40080042",
        vr: "LO",
        vm: "1",
    },
    ReferencedInterpretationSequence: {
        tag: "40080050",
        vr: "SQ",
        vm: "1",
    },
    ReportProductionStatusTrial: {
        tag: "400800FF",
        vr: "CS",
        vm: "1",
    },
    InterpretationRecordedDate: {
        tag: "40080100",
        vr: "DA",
        vm: "1",
    },
    InterpretationRecordedTime: {
        tag: "40080101",
        vr: "TM",
        vm: "1",
    },
    InterpretationRecorder: {
        tag: "40080102",
        vr: "PN",
        vm: "1",
    },
    ReferenceToRecordedSound: {
        tag: "40080103",
        vr: "LO",
        vm: "1",
    },
    InterpretationTranscriptionDate: {
        tag: "40080108",
        vr: "DA",
        vm: "1",
    },
    InterpretationTranscriptionTime: {
        tag: "40080109",
        vr: "TM",
        vm: "1",
    },
    InterpretationTranscriber: {
        tag: "4008010A",
        vr: "PN",
        vm: "1",
    },
    InterpretationText: {
        tag: "4008010B",
        vr: "ST",
        vm: "1",
    },
    InterpretationAuthor: {
        tag: "4008010C",
        vr: "PN",
        vm: "1",
    },
    InterpretationApproverSequence: {
        tag: "40080111",
        vr: "SQ",
        vm: "1",
    },
    InterpretationApprovalDate: {
        tag: "40080112",
        vr: "DA",
        vm: "1",
    },
    InterpretationApprovalTime: {
        tag: "40080113",
        vr: "TM",
        vm: "1",
    },
    PhysicianApprovingInterpretation: {
        tag: "40080114",
        vr: "PN",
        vm: "1",
    },
    InterpretationDiagnosisDescription: {
        tag: "40080115",
        vr: "LT",
        vm: "1",
    },
    InterpretationDiagnosisCodeSequence: {
        tag: "40080117",
        vr: "SQ",
        vm: "1",
    },
    ResultsDistributionListSequence: {
        tag: "40080118",
        vr: "SQ",
        vm: "1",
    },
    DistributionName: {
        tag: "40080119",
        vr: "PN",
        vm: "1",
    },
    DistributionAddress: {
        tag: "4008011A",
        vr: "LO",
        vm: "1",
    },
    InterpretationID: {
        tag: "40080200",
        vr: "SH",
        vm: "1",
    },
    InterpretationIDIssuer: {
        tag: "40080202",
        vr: "LO",
        vm: "1",
    },
    InterpretationTypeID: {
        tag: "40080210",
        vr: "CS",
        vm: "1",
    },
    InterpretationStatusID: {
        tag: "40080212",
        vr: "CS",
        vm: "1",
    },
    Impressions: {
        tag: "40080300",
        vr: "ST",
        vm: "1",
    },
    ResultsComments: {
        tag: "40084000",
        vr: "ST",
        vm: "1",
    },
    LowEnergyDetectors: {
        tag: "40100001",
        vr: "CS",
        vm: "1",
    },
    HighEnergyDetectors: {
        tag: "40100002",
        vr: "CS",
        vm: "1",
    },
    DetectorGeometrySequence: {
        tag: "40100004",
        vr: "SQ",
        vm: "1",
    },
    ThreatROIVoxelSequence: {
        tag: "40101001",
        vr: "SQ",
        vm: "1",
    },
    ThreatROIBase: {
        tag: "40101004",
        vr: "FL",
        vm: "3",
    },
    ThreatROIExtents: {
        tag: "40101005",
        vr: "FL",
        vm: "3",
    },
    ThreatROIBitmap: {
        tag: "40101006",
        vr: "OB",
        vm: "1",
    },
    RouteSegmentID: {
        tag: "40101007",
        vr: "SH",
        vm: "1",
    },
    GantryType: {
        tag: "40101008",
        vr: "CS",
        vm: "1",
    },
    OOIOwnerType: {
        tag: "40101009",
        vr: "CS",
        vm: "1",
    },
    RouteSegmentSequence: {
        tag: "4010100A",
        vr: "SQ",
        vm: "1",
    },
    PotentialThreatObjectID: {
        tag: "40101010",
        vr: "US",
        vm: "1",
    },
    ThreatSequence: {
        tag: "40101011",
        vr: "SQ",
        vm: "1",
    },
    ThreatCategory: {
        tag: "40101012",
        vr: "CS",
        vm: "1",
    },
    ThreatCategoryDescription: {
        tag: "40101013",
        vr: "LT",
        vm: "1",
    },
    ATDAbilityAssessment: {
        tag: "40101014",
        vr: "CS",
        vm: "1",
    },
    ATDAssessmentFlag: {
        tag: "40101015",
        vr: "CS",
        vm: "1",
    },
    ATDAssessmentProbability: {
        tag: "40101016",
        vr: "FL",
        vm: "1",
    },
    Mass: {
        tag: "40101017",
        vr: "FL",
        vm: "1",
    },
    Density: {
        tag: "40101018",
        vr: "FL",
        vm: "1",
    },
    ZEffective: {
        tag: "40101019",
        vr: "FL",
        vm: "1",
    },
    BoardingPassID: {
        tag: "4010101A",
        vr: "SH",
        vm: "1",
    },
    CenterOfMass: {
        tag: "4010101B",
        vr: "FL",
        vm: "3",
    },
    CenterOfPTO: {
        tag: "4010101C",
        vr: "FL",
        vm: "3",
    },
    BoundingPolygon: {
        tag: "4010101D",
        vr: "FL",
        vm: "6-n",
    },
    RouteSegmentStartLocationID: {
        tag: "4010101E",
        vr: "SH",
        vm: "1",
    },
    RouteSegmentEndLocationID: {
        tag: "4010101F",
        vr: "SH",
        vm: "1",
    },
    RouteSegmentLocationIDType: {
        tag: "40101020",
        vr: "CS",
        vm: "1",
    },
    AbortReason: {
        tag: "40101021",
        vr: "CS",
        vm: "1-n",
    },
    VolumeOfPTO: {
        tag: "40101023",
        vr: "FL",
        vm: "1",
    },
    AbortFlag: {
        tag: "40101024",
        vr: "CS",
        vm: "1",
    },
    RouteSegmentStartTime: {
        tag: "40101025",
        vr: "DT",
        vm: "1",
    },
    RouteSegmentEndTime: {
        tag: "40101026",
        vr: "DT",
        vm: "1",
    },
    TDRType: {
        tag: "40101027",
        vr: "CS",
        vm: "1",
    },
    InternationalRouteSegment: {
        tag: "40101028",
        vr: "CS",
        vm: "1",
    },
    ThreatDetectionAlgorithmAndVersion: {
        tag: "40101029",
        vr: "LO",
        vm: "1-n",
    },
    AssignedLocation: {
        tag: "4010102A",
        vr: "SH",
        vm: "1",
    },
    AlarmDecisionTime: {
        tag: "4010102B",
        vr: "DT",
        vm: "1",
    },
    AlarmDecision: {
        tag: "40101031",
        vr: "CS",
        vm: "1",
    },
    NumberOfTotalObjects: {
        tag: "40101033",
        vr: "US",
        vm: "1",
    },
    NumberOfAlarmObjects: {
        tag: "40101034",
        vr: "US",
        vm: "1",
    },
    PTORepresentationSequence: {
        tag: "40101037",
        vr: "SQ",
        vm: "1",
    },
    ATDAssessmentSequence: {
        tag: "40101038",
        vr: "SQ",
        vm: "1",
    },
    TIPType: {
        tag: "40101039",
        vr: "CS",
        vm: "1",
    },
    DICOSVersion: {
        tag: "4010103A",
        vr: "CS",
        vm: "1",
    },
    OOIOwnerCreationTime: {
        tag: "40101041",
        vr: "DT",
        vm: "1",
    },
    OOIType: {
        tag: "40101042",
        vr: "CS",
        vm: "1",
    },
    OOISize: {
        tag: "40101043",
        vr: "FL",
        vm: "3",
    },
    AcquisitionStatus: {
        tag: "40101044",
        vr: "CS",
        vm: "1",
    },
    BasisMaterialsCodeSequence: {
        tag: "40101045",
        vr: "SQ",
        vm: "1",
    },
    PhantomType: {
        tag: "40101046",
        vr: "CS",
        vm: "1",
    },
    OOIOwnerSequence: {
        tag: "40101047",
        vr: "SQ",
        vm: "1",
    },
    ScanType: {
        tag: "40101048",
        vr: "CS",
        vm: "1",
    },
    ItineraryID: {
        tag: "40101051",
        vr: "LO",
        vm: "1",
    },
    ItineraryIDType: {
        tag: "40101052",
        vr: "SH",
        vm: "1",
    },
    ItineraryIDAssigningAuthority: {
        tag: "40101053",
        vr: "LO",
        vm: "1",
    },
    RouteID: {
        tag: "40101054",
        vr: "SH",
        vm: "1",
    },
    RouteIDAssigningAuthority: {
        tag: "40101055",
        vr: "SH",
        vm: "1",
    },
    InboundArrivalType: {
        tag: "40101056",
        vr: "CS",
        vm: "1",
    },
    CarrierID: {
        tag: "40101058",
        vr: "SH",
        vm: "1",
    },
    CarrierIDAssigningAuthority: {
        tag: "40101059",
        vr: "CS",
        vm: "1",
    },
    SourceOrientation: {
        tag: "40101060",
        vr: "FL",
        vm: "3",
    },
    SourcePosition: {
        tag: "40101061",
        vr: "FL",
        vm: "3",
    },
    BeltHeight: {
        tag: "40101062",
        vr: "FL",
        vm: "1",
    },
    AlgorithmRoutingCodeSequence: {
        tag: "40101064",
        vr: "SQ",
        vm: "1",
    },
    TransportClassification: {
        tag: "40101067",
        vr: "CS",
        vm: "1",
    },
    OOITypeDescriptor: {
        tag: "40101068",
        vr: "LT",
        vm: "1",
    },
    TotalProcessingTime: {
        tag: "40101069",
        vr: "FL",
        vm: "1",
    },
    DetectorCalibrationData: {
        tag: "4010106C",
        vr: "OB",
        vm: "1",
    },
    AdditionalScreeningPerformed: {
        tag: "4010106D",
        vr: "CS",
        vm: "1",
    },
    AdditionalInspectionSelectionCriteria: {
        tag: "4010106E",
        vr: "CS",
        vm: "1",
    },
    AdditionalInspectionMethodSequence: {
        tag: "4010106F",
        vr: "SQ",
        vm: "1",
    },
    AITDeviceType: {
        tag: "40101070",
        vr: "CS",
        vm: "1",
    },
    QRMeasurementsSequence: {
        tag: "40101071",
        vr: "SQ",
        vm: "1",
    },
    TargetMaterialSequence: {
        tag: "40101072",
        vr: "SQ",
        vm: "1",
    },
    SNRThreshold: {
        tag: "40101073",
        vr: "FD",
        vm: "1",
    },
    ImageScaleRepresentation: {
        tag: "40101075",
        vr: "DS",
        vm: "1",
    },
    ReferencedPTOSequence: {
        tag: "40101076",
        vr: "SQ",
        vm: "1",
    },
    ReferencedTDRInstanceSequence: {
        tag: "40101077",
        vr: "SQ",
        vm: "1",
    },
    PTOLocationDescription: {
        tag: "40101078",
        vr: "ST",
        vm: "1",
    },
    AnomalyLocatorIndicatorSequence: {
        tag: "40101079",
        vr: "SQ",
        vm: "1",
    },
    AnomalyLocatorIndicator: {
        tag: "4010107A",
        vr: "FL",
        vm: "3",
    },
    PTORegionSequence: {
        tag: "4010107B",
        vr: "SQ",
        vm: "1",
    },
    InspectionSelectionCriteria: {
        tag: "4010107C",
        vr: "CS",
        vm: "1",
    },
    SecondaryInspectionMethodSequence: {
        tag: "4010107D",
        vr: "SQ",
        vm: "1",
    },
    PRCSToRCSOrientation: {
        tag: "4010107E",
        vr: "DS",
        vm: "6",
    },
    MACParametersSequence: {
        tag: "4FFE0001",
        vr: "SQ",
        vm: "1",
    },
    CurveDimensions: {
        tag: "50xx0005",
        vr: "US",
        vm: "1",
    },
    NumberOfPoints: {
        tag: "50xx0010",
        vr: "US",
        vm: "1",
    },
    TypeOfData: {
        tag: "50xx0020",
        vr: "CS",
        vm: "1",
    },
    CurveDescription: {
        tag: "50xx0022",
        vr: "LO",
        vm: "1",
    },
    AxisUnits: {
        tag: "50xx0030",
        vr: "SH",
        vm: "1-n",
    },
    AxisLabels: {
        tag: "50xx0040",
        vr: "SH",
        vm: "1-n",
    },
    DataValueRepresentation: {
        tag: "50xx0103",
        vr: "US",
        vm: "1",
    },
    MinimumCoordinateValue: {
        tag: "50xx0104",
        vr: "US",
        vm: "1-n",
    },
    MaximumCoordinateValue: {
        tag: "50xx0105",
        vr: "US",
        vm: "1-n",
    },
    CurveRange: {
        tag: "50xx0106",
        vr: "SH",
        vm: "1-n",
    },
    CurveDataDescriptor: {
        tag: "50xx0110",
        vr: "US",
        vm: "1-n",
    },
    CoordinateStartValue: {
        tag: "50xx0112",
        vr: "US",
        vm: "1-n",
    },
    CoordinateStepValue: {
        tag: "50xx0114",
        vr: "US",
        vm: "1-n",
    },
    CurveActivationLayer: {
        tag: "50xx1001",
        vr: "CS",
        vm: "1",
    },
    AudioType: {
        tag: "50xx2000",
        vr: "US",
        vm: "1",
    },
    AudioSampleFormat: {
        tag: "50xx2002",
        vr: "US",
        vm: "1",
    },
    NumberOfChannels: {
        tag: "50xx2004",
        vr: "US",
        vm: "1",
    },
    NumberOfSamples: {
        tag: "50xx2006",
        vr: "UL",
        vm: "1",
    },
    SampleRate: {
        tag: "50xx2008",
        vr: "UL",
        vm: "1",
    },
    TotalTime: {
        tag: "50xx200A",
        vr: "UL",
        vm: "1",
    },
    AudioSampleData: {
        tag: "50xx200C",
        vr: "OB or OW",
        vm: "1",
    },
    AudioComments: {
        tag: "50xx200E",
        vr: "LT",
        vm: "1",
    },
    CurveLabel: {
        tag: "50xx2500",
        vr: "LO",
        vm: "1",
    },
    CurveReferencedOverlaySequence: {
        tag: "50xx2600",
        vr: "SQ",
        vm: "1",
    },
    CurveReferencedOverlayGroup: {
        tag: "50xx2610",
        vr: "US",
        vm: "1",
    },
    CurveData: {
        tag: "50xx3000",
        vr: "OB or OW",
        vm: "1",
    },
    SharedFunctionalGroupsSequence: {
        tag: "52009229",
        vr: "SQ",
        vm: "1",
    },
    PerFrameFunctionalGroupsSequence: {
        tag: "52009230",
        vr: "SQ",
        vm: "1",
    },
    WaveformSequence: {
        tag: "54000100",
        vr: "SQ",
        vm: "1",
    },
    ChannelMinimumValue: {
        tag: "54000110",
        vr: "OB or OW",
        vm: "1",
    },
    ChannelMaximumValue: {
        tag: "54000112",
        vr: "OB or OW",
        vm: "1",
    },
    WaveformBitsAllocated: {
        tag: "54001004",
        vr: "US",
        vm: "1",
    },
    WaveformSampleInterpretation: {
        tag: "54001006",
        vr: "CS",
        vm: "1",
    },
    WaveformPaddingValue: {
        tag: "5400100A",
        vr: "OB or OW",
        vm: "1",
    },
    WaveformData: {
        tag: "54001010",
        vr: "OB or OW",
        vm: "1",
    },
    FirstOrderPhaseCorrectionAngle: {
        tag: "56000010",
        vr: "OF",
        vm: "1",
    },
    SpectroscopyData: {
        tag: "56000020",
        vr: "OF",
        vm: "1",
    },
    OverlayRows: {
        tag: "60xx0010",
        vr: "US",
        vm: "1",
    },
    OverlayColumns: {
        tag: "60xx0011",
        vr: "US",
        vm: "1",
    },
    OverlayPlanes: {
        tag: "60xx0012",
        vr: "US",
        vm: "1",
    },
    NumberOfFramesInOverlay: {
        tag: "60xx0015",
        vr: "IS",
        vm: "1",
    },
    OverlayDescription: {
        tag: "60xx0022",
        vr: "LO",
        vm: "1",
    },
    OverlayType: {
        tag: "60xx0040",
        vr: "CS",
        vm: "1",
    },
    OverlaySubtype: {
        tag: "60xx0045",
        vr: "LO",
        vm: "1",
    },
    OverlayOrigin: {
        tag: "60xx0050",
        vr: "SS",
        vm: "2",
    },
    ImageFrameOrigin: {
        tag: "60xx0051",
        vr: "US",
        vm: "1",
    },
    OverlayPlaneOrigin: {
        tag: "60xx0052",
        vr: "US",
        vm: "1",
    },
    OverlayCompressionCode: {
        tag: "60xx0060",
        vr: "CS",
        vm: "1",
    },
    OverlayCompressionOriginator: {
        tag: "60xx0061",
        vr: "SH",
        vm: "1",
    },
    OverlayCompressionLabel: {
        tag: "60xx0062",
        vr: "SH",
        vm: "1",
    },
    OverlayCompressionDescription: {
        tag: "60xx0063",
        vr: "CS",
        vm: "1",
    },
    OverlayCompressionStepPointers: {
        tag: "60xx0066",
        vr: "AT",
        vm: "1-n",
    },
    OverlayRepeatInterval: {
        tag: "60xx0068",
        vr: "US",
        vm: "1",
    },
    OverlayBitsGrouped: {
        tag: "60xx0069",
        vr: "US",
        vm: "1",
    },
    OverlayBitsAllocated: {
        tag: "60xx0100",
        vr: "US",
        vm: "1",
    },
    OverlayBitPosition: {
        tag: "60xx0102",
        vr: "US",
        vm: "1",
    },
    OverlayFormat: {
        tag: "60xx0110",
        vr: "CS",
        vm: "1",
    },
    OverlayLocation: {
        tag: "60xx0200",
        vr: "US",
        vm: "1",
    },
    OverlayCodeLabel: {
        tag: "60xx0800",
        vr: "CS",
        vm: "1-n",
    },
    OverlayNumberOfTables: {
        tag: "60xx0802",
        vr: "US",
        vm: "1",
    },
    OverlayCodeTableLocation: {
        tag: "60xx0803",
        vr: "AT",
        vm: "1-n",
    },
    OverlayBitsForCodeWord: {
        tag: "60xx0804",
        vr: "US",
        vm: "1",
    },
    OverlayActivationLayer: {
        tag: "60xx1001",
        vr: "CS",
        vm: "1",
    },
    OverlayDescriptorGray: {
        tag: "60xx1100",
        vr: "US",
        vm: "1",
    },
    OverlayDescriptorRed: {
        tag: "60xx1101",
        vr: "US",
        vm: "1",
    },
    OverlayDescriptorGreen: {
        tag: "60xx1102",
        vr: "US",
        vm: "1",
    },
    OverlayDescriptorBlue: {
        tag: "60xx1103",
        vr: "US",
        vm: "1",
    },
    OverlaysGray: {
        tag: "60xx1200",
        vr: "US",
        vm: "1-n",
    },
    OverlaysRed: {
        tag: "60xx1201",
        vr: "US",
        vm: "1-n",
    },
    OverlaysGreen: {
        tag: "60xx1202",
        vr: "US",
        vm: "1-n",
    },
    OverlaysBlue: {
        tag: "60xx1203",
        vr: "US",
        vm: "1-n",
    },
    ROIArea: {
        tag: "60xx1301",
        vr: "IS",
        vm: "1",
    },
    ROIMean: {
        tag: "60xx1302",
        vr: "DS",
        vm: "1",
    },
    ROIStandardDeviation: {
        tag: "60xx1303",
        vr: "DS",
        vm: "1",
    },
    OverlayLabel: {
        tag: "60xx1500",
        vr: "LO",
        vm: "1",
    },
    OverlayData: {
        tag: "60xx3000",
        vr: "OB or OW",
        vm: "1",
    },
    OverlayComments: {
        tag: "60xx4000",
        vr: "LT",
        vm: "1",
    },
    ExtendedOffsetTable: {
        tag: "7FE00001",
        vr: "OV",
        vm: "1",
    },
    ExtendedOffsetTableLengths: {
        tag: "7FE00002",
        vr: "OV",
        vm: "1",
    },
    EncapsulatedPixelDataValueTotalLength: {
        tag: "7FE00003",
        vr: "UV",
        vm: "1",
    },
    FloatPixelData: {
        tag: "7FE00008",
        vr: "OF",
        vm: "1",
    },
    DoubleFloatPixelData: {
        tag: "7FE00009",
        vr: "OD",
        vm: "1",
    },
    PixelData: {
        tag: "7FE00010",
        vr: "OB or OW",
        vm: "1",
    },
    CoefficientsSDVN: {
        tag: "7FE00020",
        vr: "OW",
        vm: "1",
    },
    CoefficientsSDHN: {
        tag: "7FE00030",
        vr: "OW",
        vm: "1",
    },
    CoefficientsSDDN: {
        tag: "7FE00040",
        vr: "OW",
        vm: "1",
    },
    VariablePixelData: {
        tag: "7Fxx0010",
        vr: "OB or OW",
        vm: "1",
    },
    VariableNextDataGroup: {
        tag: "7Fxx0011",
        vr: "US",
        vm: "1",
    },
    VariableCoefficientsSDVN: {
        tag: "7Fxx0020",
        vr: "OW",
        vm: "1",
    },
    VariableCoefficientsSDHN: {
        tag: "7Fxx0030",
        vr: "OW",
        vm: "1",
    },
    VariableCoefficientsSDDN: {
        tag: "7Fxx0040",
        vr: "OW",
        vm: "1",
    },
    DigitalSignaturesSequence: {
        tag: "FFFAFFFA",
        vr: "SQ",
        vm: "1",
    },
    DataSetTrailingPadding: {
        tag: "FFFCFFFC",
        vr: "OB",
        vm: "1",
    },
    Item: {
        tag: "FFFEE000",
        vr: "See Note 2",
        vm: "1",
    },
    ItemDelimitationItem: {
        tag: "FFFEE00D",
        vr: "See Note 2",
        vm: "1",
    },
    SequenceDelimitationItem: {
        tag: "FFFEE0DD",
        vr: "See Note 2",
        vm: "1",
    },
} as const;
