import cloudinary from "../cloudinary/cloudinary.js"

const fileUploader = async (fileBuffer) => {
  try {
    const response = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      )
      stream.end(fileBuffer)
    })
    return response
  } catch (error) {
    throw new Error("file upload failed " + error.message)
  }
}

export default fileUploader