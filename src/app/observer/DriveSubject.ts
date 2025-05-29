import { DriveNode } from "../types/drive";

type viewMode = "grid" | "list"
type Observer = () => void;

class DriveSubject {
  private observers: Observer[] = [];
  private root: DriveNode | null = null;
  private currentPath: DriveNode[] = [];
  private previewFile: DriveNode | null = null;
  private viewMode: viewMode = "grid";

  getViewMode() {
    return this.viewMode;
  }

  setViewMode(mode: viewMode) {
    this.viewMode = mode;
    this.notify();
  }
  
  subscribe(fn: Observer) {
    this.observers.push(fn);
  }

  unsubscribe(fn: Observer) {
    this.observers = this.observers.filter((obs) => obs !== fn);
  }

  private notify() {
    this.observers.forEach((fn) => fn());
  }

  // Inicializa el árbol
  setTree(root: DriveNode) {
    this.root = root;
    this.currentPath = [root];
    this.previewFile = null;
    this.notify();
  }

  getCurrentNode() {
    return this.currentPath[this.currentPath.length - 1] ?? null;
  }

  getPath() {
    return this.currentPath;
  }

  getPreviewFile() {
    return this.previewFile;
  }

  openFolderByPath(path: string) {
    if (!this.root) return;
    const newPath = this.findPathTo(this.root, path);
    if (newPath) {
      this.currentPath = newPath;
      this.previewFile = null;
      this.notify();
    }
  }

  openFilePreview(file: DriveNode) {
    this.previewFile = file;
    this.notify();
  }

  closePreview() {
    this.previewFile = null;
    this.notify();
  }

  // Encuentra un path como lista de nodos desde la raíz
  private findPathTo(node: DriveNode, targetPath: string, trail: DriveNode[] = []): DriveNode[] | null {
    const normalizedNodePath = node.path.replaceAll("\\", "/");
    const normalizedTargetPath = targetPath.replaceAll("\\", "/");

    if (normalizedNodePath === normalizedTargetPath) {
      return [...trail, node];
    }

    if (!node.children) return null;

    for (const child of node.children) {
      const result = this.findPathTo(child, targetPath, [...trail, node]);
      if (result) return result;
    }

    return null;
  }
}

export const driveSubject = new DriveSubject();
