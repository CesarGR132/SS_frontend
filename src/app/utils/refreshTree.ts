import { driveSubject } from "../observer/DriveSubject";
import { fetchTree } from "../services/storageApi";

export async function refreshTree() {
    const currentPath = driveSubject.getCurrentNode()?.path;
    const previewedFile = driveSubject.getPreviewFile()?.path;
    const newTree = await fetchTree();

    driveSubject.setTree(newTree);

    if (currentPath) {
        driveSubject.openFolderByPath(currentPath);
    }

    if (previewedFile) {
        const match = findNodeByPath(newTree, previewedFile);
        if (match && !match.isDirectory) {
            driveSubject.openFilePreview(match);
        }
    }
}

function findNodeByPath(node: any, targetPath: string): any | null {
    if (node.path === targetPath) return node;
    if (!node.children) return null;

    for (const child of node.children) {
        const result = findNodeByPath(child, targetPath);
        if (result) return result;
    }

    return null;
}
