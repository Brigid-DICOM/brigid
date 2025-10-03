/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is part of dcm4che, an implementation of DICOM(TM) in
 * Java(TM), hosted at https://github.com/dcm4che.
 *
 * The Initial Developer of the Original Code is
 * Agfa Healthcare.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 * See @authors listed below
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * Status codes for DICOM operations
 * Ported from dcm4che (Java) to TypeScript
 * from [org.dcm4che3.net.Status](https://github.com/dcm4che/dcm4che/blob/master/dcm4che-net/src/main/java/org/dcm4che3/net/Status.java)
 */
export const DICOM_STATUS = {
    Success: 0x0000,

    Pending: 0xff00,
    PendingWarning: 0xff01,

    Cancel: 0xfe00,

    /** Failure: no such attribute (105H) */
    NoSuchAttribute: 0x0105,

    /** Failure: invalid attribute value (106H) */
    InvalidAttributeValue: 0x0106,

    /** Warning: attribute list error (107H) */
    AttributeListError: 0x0107,

    /** Failure: processing failure (110H) */
    ProcessingFailure: 0x0110,

    /** Failure: duplicate SOP Instance (111H) */
    DuplicateSOPinstance: 0x0111,

    /** Failure: no such SOP Instance (112H) */
    NoSuchObjectInstance: 0x0112,

    /** Failure: no such event type (113H) */
    NoSuchEventType: 0x0113,

    /** Failure: no such argument (114H) */
    NoSuchArgument: 0x0114,

    /** Failure: invalid argument value (115H) */
    InvalidArgumentValue: 0x0115,

    /** Warning: attribute value out of range (116H) */
    AttributeValueOutOfRange: 0x0116,

    /** Failure: invalid SOP Instance (117H) */
    InvalidObjectInstance: 0x0117,

    /** Failure: no such SOP class (118H) */
    NoSuchSOPclass: 0x0118,

    /** Failure: class-instance conflict (119H) */
    ClassInstanceConflict: 0x0119,

    /** Failure: missing Attribute (120H) */
    MissingAttribute: 0x0120,

    /** Failure: missing Attribute Value (121H) */
    MissingAttributeValue: 0x0121,

    /** Refused: SOP Class Not Supported (122H) */
    SOPclassNotSupported: 0x0122,

    /** Failure: no such action type (123H) */
    NoSuchActionType: 0x0123,

    /** Refused: not authorized (124H) */
    NotAuthorized: 0x0124,

    /** Failure: duplicate invocation (210H) */
    DuplicateInvocation: 0x0210,

    /** Failure: unrecognized operation (211H) */
    UnrecognizedOperation: 0x0211,

    /** Failure: mistyped argument (212H) */
    MistypedArgument: 0x0212,

    /** Failure: resource limitation (213H) */
    ResourceLimitation: 0x0213,

    OutOfResources: 0xa700,
    UnableToCalculateNumberOfMatches: 0xa701,
    UnableToPerformSubOperations: 0xa702,
    MoveDestinationUnknown: 0xa801,
    IdentifierDoesNotMatchSOPClass: 0xa900,
    DataSetDoesNotMatchSOPClassError: 0xa900,

    OneOrMoreFailures: 0xb000,
    CoercionOfDataElements: 0xb000,
    ElementsDiscarded: 0xb006,
    DataSetDoesNotMatchSOPClassWarning: 0xb007,

    UnableToProcess: 0xc000,
    CannotUnderstand: 0xc000,

    UPSCreatedWithModifications: 0xb300,
    UPSDeletionLockNotGranted: 0xb301,
    UPSAlreadyInRequestedStateOfCanceled: 0xb304,
    UPSCoercedInvalidValuesToValidValues: 0xb305,
    UPSAlreadyInRequestedStateOfCompleted: 0xb306,

    UPSMayNoLongerBeUpdated: 0xc300,
    UPSTransactionUIDNotCorrect: 0xc301,
    UPSAlreadyInProgress: 0xc302,
    UPSStateMayNotChangedToScheduled: 0xc303,
    UPSNotMetFinalStateRequirements: 0xc304,
    UPSDoesNotExist: 0xc307,
    UPSUnknownReceivingAET: 0xc308,
    UPSNotScheduled: 0xc309,
    UPSNotYetInProgress: 0xc310,
    UPSAlreadyCompleted: 0xc311,
    UPSPerformerCannotBeContacted: 0xc312,
    UPSPerformerChoosesNotToCancel: 0xc313,
    UPSActionNotAppropriate: 0xc314,
    UPSDoesNotSupportEventReports: 0xc315
} as const;

/**
 * Check if status is pending
 */
export function isPending(status: number): boolean {
    return (status & DICOM_STATUS.Pending) === DICOM_STATUS.Pending;
}
