export interface FileItem {
    name: string;
    isDirectory: boolean;
    path: string;
    children?: FileItem[]; // Optional children property for directories
    content?: any
}

export interface OpenFileItem {
    name: string;
    path: string;
    content?: any
    unSaved: boolean
}

  