export type DriveNode = {
    name: string;
    isDirectory: boolean;
    path: string;
    children?: DriveNode[];
    size?: number; // en bytes
    type?: string; // mime type
    modified?: string | number | Date; // fecha de modificación
}