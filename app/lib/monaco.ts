import { FileItem } from '@/types/main';
import * as monaco from 'monaco-editor';

// Function to create Monaco models from a directory structure
function createMonacoModelsFromDir(directoryStructure:FileItem[]) {
  // Recursively iterate over the directory structure
  directoryStructure.forEach(item => {
    // If the item is a file (not a directory), create a Monaco model for it
    if (!item.isDirectory && item.content) {
      createMonacoModel(item);
    }

    // If the item is a directory, recurse into it and process its children
    if (item.isDirectory && item.children && item.children.length > 0) {
      createMonacoModelsFromDir(item.children);
    }
  });
}

// Function to create and add a Monaco model for a file
function createMonacoModel(file:FileItem) {
  // The file content is stored in `file.content`
  const content = file.content;

  // We determine the language based on the file name extension
  let language = getFileLang(file.name); // Default language if no extension
  
  // Create a Monaco model using the file content
  const model = monaco.editor.createModel(
    content,                    // The content of the file
    language,                   // Language for syntax highlighting
    monaco.Uri.parse(file.path) // URI for the file (use the file path as URI)
  );

  // Create an editor instance for this file's model
  const container = document.createElement('div');
  container.style.height = '400px'; // Define the height of the editor container
  document.body.appendChild(container); // Add the container to the document body
  
  const editor = monaco.editor.create(container, {
    model: model // Attach the model to the Monaco editor instance
  });
};

// Call the function to create models from the directory structure
//createMonacoModelsFromStructure(directoryStructure);

function getFileLang(name: string): string {
    // Extract the file extension from the name
    const extension = name?.split(".").pop()?.toLowerCase(); // Get extension, normalize to lowercase
  
    // Map file extensions to language names or file types
    const languageMap: Record<string, string> = {
      js: "javascript",
      ts: "typescript",
      jsx: "javascript",
      tsx: "typescript",
      html: "html",
      css: "css",
      scss: "sass/scss",
      less: "less",
      java: "java",
      py: "python",
      rb: "ruby",
      php: "php",
      go: "go",
      c: "c",
      cpp: "c++",
      rust: "rust",
      swift: "swift",
      kotlin: "kotlin",
      sql: "sql",
      md: "markdown",
      json: "json",
      yaml: "yaml",
      xml: "xml",
      txt: "plain text",
      csv: "csv",
      exe: "executable",
      pdf: "pdf",
      png: "png image",
      jpg: "jpg image",
      gif: "gif image",
      mp4: "mp4 video",
      mp3: "mp3 audio",
      // Add more file extensions as needed...
    };
  
    // Return the corresponding language or file type in lowercase
    return extension ? languageMap[extension] || "unknown" : "unknown";
  }