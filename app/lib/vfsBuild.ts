import { FileItem } from "@/types/main";
import axios from "axios";

// Function to build the virtual file system tree
export async function buildVFSTree(
  files: FileItem[],
  readApiRoute?: string
): Promise<FileItem[]> {
  const root: FileItem[] = [];

  // Recursive function to create nodes
  const createNode = async (file: FileItem, parentPath: string[]): Promise<FileItem> => {
    const currentPath = file.path; // Directly use the file's initial path

    if (file.isDirectory) {
      // If the file is a directory, initialize it with empty children
      const dirNode: FileItem = {
        name: file.name,
        isDirectory: true,
        path: currentPath,
        children: [], // Initialize children for directory nodes
      };

      // Recursively process any children of the directory
      if (file.children && file.children.length > 0) {
        for (const child of file.children) {
          const childNode = await createNode(child, [...parentPath, file.name]);
          dirNode.children!.push(childNode);
        }
      }

      return dirNode;
    } else {
      // If the file is not a directory, fetch its content and create the file node
      const fileNode: FileItem = {
        name: file.name,
        isDirectory: false,
        path: currentPath,
        content: null,
      };

      try {
        // Use the initial `file.path` for the read request
        const res = await axios.post("api/explorer", {
          action: "read",
          filePath: currentPath, // Use the original path
        });

        if (res.status === 200) {
          fileNode.content = res.data.content;
        } else {
          console.error(`Failed to fetch content for ${currentPath}: ${res.statusText}`);
        }
      } catch (error) {
        console.error(`Error fetching content for ${currentPath}:`, error);
      }

      return fileNode;
    }
  };

  // Process each file item and create the corresponding nodes
  for (const file of files) {
    const node = await createNode(file, []);
    root.push(node);
  }

  return root;
}
