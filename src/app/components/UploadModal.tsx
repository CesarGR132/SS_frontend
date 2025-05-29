"use client";

import { useState, useRef } from "react";
import { uploadFiles } from "../services/storageApi";
import { refreshTree } from "../utils/refreshTree";
import { driveSubject } from "../observer/DriveSubject";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    setIsLoading (val: boolean): void;
};

export const UploadModal = ({ isOpen, onClose, setIsLoading }: Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const handleUpload = async () => {
        if (!selectedFiles) return;

        const path = driveSubject.getCurrentNode()?.path;
        if (!path) return;

        setIsLoading(true);
        try {
            await uploadFiles(selectedFiles, path);
            await refreshTree();
            setSelectedFiles(null);
            if (inputRef.current) {
              inputRef.current.value="";
            }
            onClose();
        } catch (err) {
            alert("Something went wrong when uploading the files");
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
              x
            </button>
    
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Subir archivos</h2>
    
            <input
              ref={inputRef}
              type="file"
              multiple
              className="m-4 ml-0 p-1 hover:bg-gray-200 hover:cursor-pointer"
              onChange={(e) => setSelectedFiles(e.target.files)}
            />
    
            {selectedFiles && (
              <ul className="text-sm text-gray-700 mb-4 max-h-32 overflow-auto border p-2 rounded">
                {Array.from(selectedFiles).map((file) => (
                  <li key={file.name}>{file.name}</li>
                ))}
              </ul>
            )}
    
            <button
              onClick={handleUpload}
              disabled={!selectedFiles}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
            >
              Subir
            </button>
          </div>
        </div>
      );
}