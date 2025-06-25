import React, { RefObject } from "react";

interface PreviewToolbarProps {
  blobUrl: string | null;
  fileName: string;
  onCopy?: () => void;
  copied?: boolean;
  showCopy?: boolean;
  showOpen?: boolean;
  showFullscreen?: boolean;
  previewRef?: RefObject<HTMLElement>;
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  blobUrl,
  fileName,
  onCopy,
  copied,
  showCopy = false,
  showOpen = false,
  showFullscreen = false,
  previewRef,
}) => (
  <div className="flex items-center gap-2 mb-2">
    {showCopy && (
      <button
        className="px-2 py-1 text-md rounded-lg border bg-[#29235c] text-white hover:bg-[#d29d46] hover:scale-105 transition-all duration-300"
        title="Copiar texto"
        onClick={onCopy}
      >
        {copied ? "Copiado!" : "Copiar"}
      </button>
    )}
    <button
      className="px-2 py-1 text-md rounded-lg border bg-[#29235c] text-white hover:bg-[#d29d46] hover:scale-105 transition-all duration-300 "
      title="Descargar archivo"
      onClick={() => {
        if (blobUrl) {
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          link.click();
        }
      }}
    >
      Descargar
    </button>
    {showFullscreen && previewRef && (
      <button
        className="px-2 py-1 text-md rounded-lg border bg-[#29235c] text-white hover:bg-[#d29d46] hover:scale-105 transition-all duration-300"
        title="Pantalla completa"
        onClick={() => {
          if (previewRef.current && previewRef.current.requestFullscreen) {
            previewRef.current.requestFullscreen();
          }
        }}
      >
        Pantalla completa
      </button>
    )}
  </div>
);
