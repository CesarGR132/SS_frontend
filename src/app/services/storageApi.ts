import { cleanLastSlash } from '../utils/cleanPath'
import { DriveNode } from '../types/drive';
const BASE_URL = 'http://localhost:5000/api/storage';

export const addNewFolder = async (folderName: string, folderDate: string, path: string) => {
    path = cleanLastSlash(path);  // <- This is the URL cleaned from the error that cause the frontend.
    const res = await fetch(`${BASE_URL}/createNewFolder`, {  // <- This is the URL aiming to the endpoint.
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderName, path }), 
    });
    return res.json();
};

export const removeFolder = async (folderName: string, folderPath: string) => {
    folderPath = cleanLastSlash(folderPath);
    const res = await fetch(`${BASE_URL}/removeFolder`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderName, folderPath }),
    });
    return res.json();
};

export const removeFile = async (filename: string, filepath: string) => {
    filepath = cleanLastSlash(filepath)
    const res = await fetch(`${BASE_URL}/removeFile`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, filepath }),
    });
    return res.json();
};

export const uploadFiles = async (files: FileList, destinationPath: string) => {
    destinationPath = cleanLastSlash(destinationPath)
    const formData = new FormData();
    for (const file of Array.from(files)) {
        formData.append('files', file);
    }
    formData.append('destinationPath', destinationPath);

    const res = await fetch(`${BASE_URL}/addNewFiles`, {
        method: 'POST',
        body: formData,
    })

    return res.json();
};

export const fetchTree = async (): Promise<DriveNode> => {
    const response = await fetch(`${BASE_URL}/getConfig`);
    if (!response.ok) throw new Error('Something went wrong trying to reload')
    return await response.json();
};