import sevenZipMin from "7zip-min";

type ArchiveType = "7z" | "zip" | "gzip" | "bzip2" | "tar";

type OverwriteMode = "a" | "s" | "u" | "t";

export class SevenZip {
    private type: ArchiveType;
    private source: string;
    private dest: string;
    private cmd: string[] = [];

    constructor(type: ArchiveType = "zip", source = "", dest = "") {
        this.type = type;
        this.source = source;
        this.dest = dest;
    }

    setType(value: ArchiveType) {
        this.type = value;
        return this;
    }

    setSource(value: string) {
        this.source = value;
        return this;
    }

    setDest(value: string) {
        this.dest = value;
        return this;
    }

    addCmd(value: string) {
        this.cmd.push(value);
        return this;
    }

    recursive() {
        if (!this.cmd.includes("-r")) {
            this.cmd.push("-r");
        }
        return this;
    }

    fullyQualifiedFilePaths() {
        if (!this.cmd.includes("-spf2")) {
            this.cmd.push("-spf2");
        }
        return this;
    }

    overwrite(value: OverwriteMode) {
        if (!this.cmd.find((cmd) => cmd.startsWith("-ao"))) {
            this.cmd.push(`-ao${value}`);
        }
        return this;
    }

    async pack() {
        let cmd = ["a", `-t${this.type}`, this.dest, this.source, ...this.cmd];
        if (!this.source) cmd = ["a", `-t${this.type}`, this.dest, ...this.cmd];

        return await sevenZipMin.cmd(cmd);
    }

    static async list(filename: string) {
        return await sevenZipMin.list(filename);
    }
}
