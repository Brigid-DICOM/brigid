export type ThumbnailSource = 
| {
    type: "workspace";
    workspaceId: string;
}
| {
    type: "share",
    token: string;
    password?: string;
}