import path from "path";

export const getWritableRoot = () => {
    const cwd = process.cwd();
    
    // 如果當前路徑是在 nexe 的虛擬 filesystem 中，返回執行檔的真實目錄
    if (cwd.startsWith("/snapshot")) {
        return path.dirname(process.execPath);
    }

    return cwd;
}