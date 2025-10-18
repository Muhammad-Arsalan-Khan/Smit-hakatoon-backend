import { verifyUser } from "../../utils/jwt.js"
import User from "../../models/userSchema.js" 

async function authCheckAdmin(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "unauthorized access" })
    }
    const isVerify = verifyUser(token)
    if (isVerify?.userId) {
      const user = await User.findById(isVerify.userId)
      if (!user.isAdmin) {
        return res.json({
          message: "only admin can access this API",
          status: false,
        });
      }
      req.user = isVerify
      next()
    } else {
      res.json({
        message: "unAuthorization user",
      });
    }
  } catch (error) {
    res.json({
      message: "unAuthorization user",
    });
  }
}

export {
    authCheckAdmin
}