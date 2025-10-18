import fileUploader from "../../services/fileUplode/fileUplode.js"

export async function uplodefile(req, res, next) {
  try {
    const fileBuffer = req.file?.buffer
    const response = await fileUploader(fileBuffer)
    return res.json({ message: "file uploaded", data: response , url: response.secure_url })
  } catch (err) {
    next(err)
  }
}
