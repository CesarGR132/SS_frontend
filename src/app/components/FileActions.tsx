"use client";

import { useState } from "react";
import { UploadModal } from "./UploadModal";
import { FolderModal } from "./FolderModal";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

type Props = {
  setIsLoading: (val: boolean) => void;
};

export const FileActions = ({ setIsLoading }: Props) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  
  return (
    <>
      <div className="mb-4 flex flex-wrap gap-4 items-end justify-end">
        <button
          onClick={() => setIsNewFolderOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 cursor-pointer"
          title="Crear nueva carpeta"
        >
          <CreateNewFolderIcon />
        </button>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 cursor-pointer"
          title="Subir nuevo archivo"
        >
          <NoteAddIcon />
        </button>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        setIsLoading={setIsLoading}
      />

      <FolderModal
        isOpen={isNewFolderOpen}
        onClose={() => setIsNewFolderOpen(false)}
        setIsLoading={setIsLoading}
      />
    </>
  );
};
