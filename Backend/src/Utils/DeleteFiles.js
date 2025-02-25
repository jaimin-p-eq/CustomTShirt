import fs from "fs";

const deleteFiles = (filePaths) => {
  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    throw new Error("No files to delete.");
  }

  filePaths.forEach((filePath) => {
    const fileToDelete = filePath;

    if (fs.existsSync(fileToDelete)) {
      fs.unlinkSync(fileToDelete);
    } else {
      console.log(`File not found: ${fileToDelete}`);
    }
  });
};

export default deleteFiles;
