import { driveSubject } from "../observer/DriveSubject";
import { fetchTree } from "../services/storageApi";

export async function refreshTree() {
    const newTree = await fetchTree();
    driveSubject.setTree(newTree);
}
