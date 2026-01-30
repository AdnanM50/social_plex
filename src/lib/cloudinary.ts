import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

export async function uploadImage(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "social-chat-app" }, (error, result) => {
        if (error) reject(error)
        else resolve(result?.secure_url || "")
      })
      .end(buffer)
  })
}

export default cloudinary
