export class WorkspaceNoPermissionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "WorkspaceNoPermissionError";
    }

    get status() {
        return 403;
    }
}