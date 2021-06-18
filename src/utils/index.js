import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "linkedInExperiencePictures",
    resource_type: "auto",
  },
})
export const uploadExperienceImage = multer({
  storage: cloudinaryStorage,
}).single("experienceImage")
