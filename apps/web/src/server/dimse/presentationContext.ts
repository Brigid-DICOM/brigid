import dcmjsDimse from "dcmjs-dimse";

const { PresentationContextResult, SopClass, StorageClass, TransferSyntax } =
    dcmjsDimse.constants;

const STANDARD_STORAGE_SOP_CLASS_PREFIX = "1.2.840.10008.5.1.4.";

const QUERY_RETRIEVE_SOP_CLASS_PREFIX = "1.2.840.10008.5.1.4.1.2.";

const KNOWN_STORAGE_CLASS_UIDS = new Set<string>(
    Object.values(StorageClass),
);

export const PATIENT_ROOT_QUERY_RETRIEVE_FIND_SOP_CLASS_UID =
    "1.2.840.10008.5.1.4.1.2.1.1";

const KNOWN_QUERY_RETRIEVE_SOP_CLASS_UIDS = new Set<string>([
    PATIENT_ROOT_QUERY_RETRIEVE_FIND_SOP_CLASS_UID,
    SopClass.StudyRootQueryRetrieveInformationModelFind,
    SopClass.StudyRootQueryRetrieveInformationModelMove,
    SopClass.StudyRootQueryRetrieveInformationModelGet,
    SopClass.ModalityWorklistInformationModelFind,
]);

const QUERY_RETRIEVE_FIND_SOP_CLASS_UIDS = new Set<string>([
    PATIENT_ROOT_QUERY_RETRIEVE_FIND_SOP_CLASS_UID,
    SopClass.StudyRootQueryRetrieveInformationModelFind,
]);

export function isVerificationSopClass(abstractSyntaxUid: string): boolean {
    return abstractSyntaxUid === SopClass.Verification;
}

export function isQueryRetrieveFindSopClass(
    abstractSyntaxUid: string,
): boolean {
    return QUERY_RETRIEVE_FIND_SOP_CLASS_UIDS.has(abstractSyntaxUid);
}

export function isQueryRetrieveSopClass(abstractSyntaxUid: string): boolean {
    if (KNOWN_QUERY_RETRIEVE_SOP_CLASS_UIDS.has(abstractSyntaxUid)) {
        return true;
    }

    return abstractSyntaxUid.startsWith(QUERY_RETRIEVE_SOP_CLASS_PREFIX);
}

export function isStorageSopClass(abstractSyntaxUid: string): boolean {
    if (
        isVerificationSopClass(abstractSyntaxUid) ||
        isQueryRetrieveSopClass(abstractSyntaxUid)
    ) {
        return false;
    }

    if (KNOWN_STORAGE_CLASS_UIDS.has(abstractSyntaxUid)) {
        return true;
    }

    if (abstractSyntaxUid.startsWith(STANDARD_STORAGE_SOP_CLASS_PREFIX)) {
        return true;
    }

    return true;
}

function acceptLittleEndianTransferSyntaxes(
    context: dcmjsDimse.association.PresentationContext,
): void {
    for (const transferSyntax of context.getTransferSyntaxUids()) {
        if (
            transferSyntax === TransferSyntax.ImplicitVRLittleEndian ||
            transferSyntax === TransferSyntax.ExplicitVRLittleEndian
        ) {
            context.setResult(PresentationContextResult.Accept, transferSyntax);
        } else {
            context.setResult(
                PresentationContextResult.RejectTransferSyntaxesNotSupported,
            );
        }
    }
}

function acceptAllTransferSyntaxes(
    context: dcmjsDimse.association.PresentationContext,
): void {
    for (const transferSyntax of context.getTransferSyntaxUids()) {
        context.setResult(PresentationContextResult.Accept, transferSyntax);
    }
}

export function negotiatePresentationContext(
    abstractSyntaxUid: string,
    context: dcmjsDimse.association.PresentationContext,
): void {
    if (isVerificationSopClass(abstractSyntaxUid)) {
        acceptLittleEndianTransferSyntaxes(context);
        return;
    }

    if (isQueryRetrieveFindSopClass(abstractSyntaxUid)) {
        acceptLittleEndianTransferSyntaxes(context);
        return;
    }

    if (isQueryRetrieveSopClass(abstractSyntaxUid)) {
        context.setResult(
            PresentationContextResult.RejectAbstractSyntaxNotSupported,
        );
        return;
    }

    if (isStorageSopClass(abstractSyntaxUid)) {
        acceptAllTransferSyntaxes(context);
        return;
    }

    context.setResult(
        PresentationContextResult.RejectAbstractSyntaxNotSupported,
    );
}
