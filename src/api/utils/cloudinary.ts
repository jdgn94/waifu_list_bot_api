import { v2 as cloudinary, UploadApiOptions } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
});

const updateFile = async (file: string, options?: UploadApiOptions) => {
  return await cloudinary.uploader.upload(file, options);
};

const deleteFile = async (file: string) => {
  return await cloudinary.uploader.destroy(file);
};

export { updateFile, deleteFile };
