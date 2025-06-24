"use client";

import { useEffect, useState } from "react";
import { driveSubject } from "../observer/DriveSubject";
import { DriveNode } from "../types/drive";
import { fetchFileBlob } from "../utils/fetchFileBlob";

export const PreviewPanel = () => {
  const [file, setFile] = useState<DriveNode | null>(driveSubject.getPreviewFile());
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [, setContentType] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const newFile = driveSubject.getPreviewFile();
      setFile(newFile);
      setBlobUrl(null);
      setContentType(null);

      if (newFile && !newFile.isDirectory) {
        fetchFileBlob(newFile.path).then(({ blobUrl, type }) => {
          setBlobUrl(blobUrl);
          setContentType(type);
        }).catch(() => {
          setBlobUrl("error");
        });
      }
    };

    driveSubject.subscribe(update);
    update();

    return () => driveSubject.unsubscribe(update);
  }, []);

  if (!file) return null;

  if (blobUrl === "error") return <div>Error al cargar archivo.</div>;

  const ext = file.name.split(".").pop()?.toLowerCase();

  const renderPreview = () => {
    if (!blobUrl) return <div className="text-center">Cargando vista previa...</div>;

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext!)) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={blobUrl} alt={file.name} className="max-h-[80vh] mx-auto" />;
    }

    if (ext === "pdf") {
      return <iframe src={blobUrl} className="w-full h-[80vh]" />;
    }

    if (["txt", "csv", "log"].includes(ext!)) {
      return <iframe src={blobUrl} className="w-full h-[80vh] bg-gray-100 p-4 font-mono text-black" />;
    }

    return <p className="text-center text-gray-600">No se puede previsualizar este tipo de archivo.</p>;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-3xl w-full shadow-xl p-6 relative">
        <button
          className="absolute top-2 right-4 text-gray-600 hover:text-red-600 text-xl cursor-pointer"
          onClick={() => driveSubject.closePreview()}
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">{file.name}</h2>
        {renderPreview()}
      </div>
    </div>
  );
};
