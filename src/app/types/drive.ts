export type DriveNode = {
    name: string
    isDirectory: boolean
    path: string
    children?: DriveNode[]
}