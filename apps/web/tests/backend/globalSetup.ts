import path from "node:path";
import { join } from "desm";
import fsE from "fs-extra";

export async function teardown() {
    await fsE.remove(
        path.resolve(
            join(import.meta.url, "../fixtures/dicomFiles/temp/dicom"),
        ),
    );
}
