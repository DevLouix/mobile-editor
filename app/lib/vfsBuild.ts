import { FileItem } from "@/types/main";
import axios from "axios";

export async function buildVFSTree(
  files: FileItem[],
  readApiRoute?: string
): Promise<FileItem[]> {
  const root: FileItem[] = [];

  // Helper function to find or create a directory node
  const findOrCreateNode = (
    name: string,
    path: string,
    parent: FileItem[]
  ): FileItem => {
    let node = parent.find((item) => item.name === name && item.isDirectory);

    if (!node) {
      node = {
        name,
        isDirectory: true,
        path,
        children: [],
      };
      parent.push(node);
    }

    return node;
  };

  for (const file of files) {
    const parts = file.path.split("/"); // Split the path into parts
    let currentNode = root;

    for (let i = 0; i < parts.length; i++) {
      const isLastPart = i === parts.length - 1;
      const part = parts[i];
      const currentPath = parts.slice(0, i + 1).join("/");

      if (isLastPart) {
        if (file.isDirectory) {
          // Add directory node
          findOrCreateNode(part, currentPath, currentNode);
        } else {
          // Add file node and fetch content
          const fileNode: FileItem = {
            name: part,
            isDirectory: false,
            path: currentPath,
            content: null,
          };

          try {
            const res = await axios.post("api/explorer", {
                action: "read",
                filePath: currentPath,
              })
            if (res.status == 200) {
              fileNode.content = await res.data.content;
            } else {
              console.error(
                `Failed to fetch content for ${currentPath}: ${res.statusText}`
              );
            }
          } catch (error) {
            console.error(`Error fetching content for ${currentPath}:`, error);
          }

          currentNode.push(fileNode);
        }
      } else {
        // It's a directory, find or create it
        const directoryNode = findOrCreateNode(part, currentPath, currentNode);
        currentNode = directoryNode.children!;
      }
    }
  }

  return root;
}
