import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resolveFilePath = (filePath) => {
  return path.join(__dirname, "../..", filePath);
};

const deleteFiles = (filePaths) => {
  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    throw new Error("No files to delete.");
  }

  filePaths.forEach((filePath) => {
    const resolvedPath = resolveFilePath(filePath);

    if (fs.existsSync(resolvedPath)) {
      fs.unlinkSync(resolvedPath);
      console.log(`Deleted file: ${resolvedPath}`);
    } else {
      console.log(`File not found: ${resolvedPath}`);
    }
  });
};

export default deleteFiles;
