import { NextApiRequest, NextApiResponse } from 'next';
import Busboy from 'busboy';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Base upload directory
const baseUploadDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure the base upload directory exists
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}

// Helper func get dit
const getDirectoryStructure = (dir: string) => {
  return fs.readdirSync(dir).map((file) => {
    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    return {
      name: file,
      isDirectory,
      path: filePath,
      children: isDirectory ? getDirectoryStructure(filePath) : null, // Recursively add children if it's a directory
    };
  });
};


// Helper function to delete files and the directory after session expiry
const deleteTemporaryFolder = (folderPath: string) => {
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      fs.unlinkSync(filePath); // Delete the file
    });
    fs.rmdirSync(folderPath); // Delete the folder
    console.log(`Deleted folder at: ${folderPath}`);
  }
};

// Disable the default Next.js body parser to handle file uploads manually
export const config = {
  api: {
    bodyParser: false, // Disable body parser to use Busboy
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  // Generate a session ID or use the session from cookies
  const sessionId = req.cookies['sessionId'] || uuidv4();

  // Directory for the current session's files
  const userUploadDir = path.join(baseUploadDir, sessionId);

  // Ensure the session's directory exists
  if (!fs.existsSync(userUploadDir)) {
    fs.mkdirSync(userUploadDir);
  }

  const busboy =  Busboy({ headers: req.headers });
  const uploadedFiles: any[] = [];

  // Handling file uploads
  busboy.on('file', (name, file, info) => {
    const { filename, encoding, mimeType } = info;

    // Create a unique file path for each uploaded file
    const filePath = path.join(userUploadDir, `${Date.now()}-${filename}`);

    // Create a writable stream to save the file
    const writeStream = fs.createWriteStream(filePath);

    // Pipe the incoming file data to the write stream
    file.pipe(writeStream);

    // After the file is saved, collect metadata
    writeStream.on('finish', () => {
      uploadedFiles.push({
        filename,
        originalFilename: filename,
        path: filePath,
        encoding,
        mimeType,
      });
    });
  });

  // After the file upload is finished
  busboy.on('finish', () => {
    const dir = getDirectoryStructure(userUploadDir)
    res.status(200).json({
      message: 'Files uploaded successfully',
      dirPath:userUploadDir,
      dir
    });

    // Automatically delete the session's upload folder after 1 hour (adjustable)
    setTimeout(() => {
      deleteTemporaryFolder(userUploadDir); // Cleanup folder after 1 hour
    }, 60 * 60 * 1000); // 1 hour in milliseconds (can adjust this as needed)
  });

  busboy.on('error', (err:any) => {
    console.error('Error during file upload:', err);
    res.status(500).json({ error: 'File upload failed' });
  });

  req.pipe(busboy); // Start parsing the incoming request stream
};
