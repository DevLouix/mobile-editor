// global.d.ts
interface Window {
    showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
  }
  