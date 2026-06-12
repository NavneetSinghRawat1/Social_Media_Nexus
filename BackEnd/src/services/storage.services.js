const { ImageKit } = require("@imagekit/nodejs")
require('dotenv').config();

// console.log(process.env.IMAGEKIT_PRIVATE_KEY);
const ImageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

async function uploadFile(file,name) {
    const result = await ImageKitClient.files.upload({
        file,
        fileName: name + Date.now(),
        folder: "project/picture"
    })
    return result;
}
async function uploadFile_comm(file,name) {
const result = await ImageKitClient.files.upload({
    file,
    fileName: name + Date.now(),
    folder: "project/Communities"
    
})
    return result;
}

async function upload(files,name) {
    const uploadTasks = Array.from(files).map(async (file) => {
        let fileToUpload;
        // Check if the input is a string that starts with http (a URL)
        if (typeof file === 'string' && file.startsWith('http')) {
            fileToUpload = file;
        } else if (file && file.buffer) {
            // Fallback to Base64 if it's a file object from your computer
            fileToUpload = file.buffer.toString('base64');
        } else {
            throw new Error("Invalid file input type");
        }
        // const base64Data = file.buffer.toString('base64');
        return await uploadFile(fileToUpload, name); 
    });
    try {
        return await Promise.all(uploadTasks);
        // console.log("Queue complete:", results);

    } catch (error) {
        console.error("Queue error:", error);
    }
}

async function deletePic(fileId) {
    try {
        const response = await ImageKitClient.files.delete(fileId);
        // console.log("File deleted successfully:", response);
        return response;
    } catch (error) {
        console.error("Failed to delete file from ImageKit:", error);
        throw error;
    }
}

module.exports = { uploadFile,uploadFile_comm,upload,deletePic}