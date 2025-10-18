import { verifyUser } from "../utils/jwt.js"

async function authCheck(req, res, next) {
  const token = req.headers.authorization.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: " unauthorized access " })
  }
  const userData = verifyUser(token)
  if (!userData) {
    return res.status(401).json({ message: "invalid token" })
  }
  req.user = userData
  next()
}

export { authCheck }
