// copy from https://github.com/dcmjs-org/dcmjs/blob/master/src/utilities/Message.js

import { BufferListStream } from "bl";
import type { ReadStream } from "fs";
import multiStream from "multistream";
import type { Readable } from "stream";

/**
 * @typedef {Object} MultipartEncodedData
 * @property {ArrayBuffer} data The encoded Multipart Data
 * @property {String} boundary The boundary used to divide pieces of the encoded data
 */

/**
 * Converts a String to a Uint8Array.
 * @param {String} str string that should be converted
 * @returns {Uint8Array}
 */
function stringToUint8Array(str: string) {
    const arr = new Uint8Array(str.length);
    for (let i = 0, j = str.length; i < j; i++) {
        arr[i] = str.charCodeAt(i);
    }
    return arr;
}

/**
 * Encode one or more DICOM datasets into a single body so it can be
 * sent using the Multipart Content-Type.
 *
 * @param {ArrayBuffer[]} datasets Array containing each file to be encoded in the multipart body, passed as ArrayBuffers.
 * @param {String} [boundary] Optional string to define a boundary between each part of the multipart body. If this is not specified, a random GUID will be generated.
 * @return {MultipartEncodedData} The Multipart encoded data returned as an Object. This contains both the data itself, and the boundary string used to divide it.
 */
function multipartEncode(
    datasets: ArrayBuffer[],
    boundary: string = guid(),
    contentType: string = "application/dicom",
) {
    const contentTypeString = `Content-Type: ${contentType}`;
    const header = `\r\n--${boundary}\r\n${contentTypeString}\r\n\r\n`;
    const footer = `\r\n--${boundary}--`;
    const headerArray = stringToUint8Array(header);
    const footerArray = stringToUint8Array(footer);
    const headerLength = headerArray.length;
    const footerLength = footerArray.length;

    let length = 0;

    // Calculate the total length for the final array
    const contentArrays = datasets.map((datasetBuffer) => {
        const contentArray = new Uint8Array(datasetBuffer);
        const contentLength = contentArray.length;

        length += headerLength + contentLength + footerLength;

        return contentArray;
    });

    // Allocate the array
    const multipartArray = new Uint8Array(length);

    // Set the initial header
    multipartArray.set(headerArray, 0);

    // Write each dataset into the multipart array
    let position = 0;
    contentArrays.forEach((contentArray) => {
        multipartArray.set(headerArray, position);
        multipartArray.set(contentArray, position + headerLength);

        position += headerLength + contentArray.length;
    });

    multipartArray.set(footerArray, position);

    return {
        data: multipartArray.buffer,
        boundary,
    };
}

function multipartEncodeByStream(
    datasets: {
        stream: ReadStream | Readable;
        size?: number;
        contentLocation?: string;
    }[],
    boundary = guid(),
    contentType = "application/dicom",
) {
    const body = [];

    for (const dataset of datasets) {
        let startInfo = `--${boundary}\r\nContent-Type: ${contentType}\r\n`;
        if (dataset.size) {
            startInfo += `Content-Length: ${dataset.size}\r\n`;
        }
        if (dataset.contentLocation) {
            startInfo += `Content-Location: ${dataset.contentLocation}\r\n`;
        }
        body.push(new BufferListStream(`${startInfo}\r\n`));
        body.push(dataset.stream);
        body.push(new BufferListStream(`\r\n`));
    }

    body.push(new BufferListStream(`--${boundary}--`));

    const stream = new multiStream(body);
    // @ts-expect-error
    stream._items = body;
    // @ts-expect-error
    stream._raw = body;

    return {
        data: stream,
        boundary,
    };
}

/**
 * Create a random GUID
 *
 * @return {string}
 */
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return (
        s4() +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        s4() +
        s4()
    );
}

const message = {
    multipartEncode: multipartEncode,
    multipartEncodeByStream: multipartEncodeByStream,
    guid: guid,
};

export default message;
