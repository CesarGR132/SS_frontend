export async function fetchFileBlob(filePath: string) {
    console.log('fetching file');
    const response = await fetch('http://localhost:5000/api/storage/getFile', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: filePath }),
    });
  
    if (!response.ok) {
      throw new Error("Error al obtener el archivo");
    }
  
    const blob = await response.blob();

    return {
      blob,
      blobUrl: URL.createObjectURL(blob),
      type: blob.type,
    };
  }
  