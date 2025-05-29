"use client";

import { useState } from "react";
import { driveSubject } from "../observer/DriveSubject";
import { addNewFolder } from "../services/storageApi";
import { refreshTree } from "../utils/refreshTree";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    setIsLoading: (val: boolean) => void;
};

export const FolderModal = ({ isOpen, onClose, setIsLoading }: Props) => {
    const [folderName, setFolderName] = useState("");

    const handleCreateFolder = async () => {
        const path = driveSubject.getCurrentNode()?.path;
        if (!path || !folderName.trim()) return;

        setIsLoading(true);
        try {
            await addNewFolder(folderName.trim(), path);
            await refreshTree();
            onClose();
            setFolderName("");
            alert("fOLDER CREATED SUCCESSFULLY")
        } catch (err) {
            alert("Something went wrong, when creating folder")
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-900">Crear nueva carpeta</h2>

        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Nombre de la carpeta"
          className="border px-3 py-2 rounded w-full mb-4"
        />

        <button
          onClick={handleCreateFolder}
          disabled={!folderName.trim()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Crear
        </button>
      </div>
    </div>
  );

}