// This function is used to clean the path from a error that cause the frontend that crashes the backend system path
export const cleanLastSlash = (path: string): string => {
    path = path.replace('/', '\\')
    const parts = path.split('\\');
    parts.pop()
    console.log(parts.join('/'))
    return parts.join('/');
}