import { ZodError } from "zod"

export function errorHandler(err, req, res, next) {
  console.error("Error", err)

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "account already exists, use different email",
    })
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors.map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
    })
  }
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "internal Server Error",
  })
}
