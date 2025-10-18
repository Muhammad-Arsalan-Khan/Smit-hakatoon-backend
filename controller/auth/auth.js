import User from "../../models/userSchema.js" 
import { userValidationSchema, userValidationSchemalogin } from "../../services/validation/userValidation.js"
import bcrypt from "bcryptjs"
import { setUser, setAdmin } from "../../utils/jwt.js"
import { verifyEmail } from "../../services/nodemailer/nodemailer.js"
import EmailOTP from "../../models/EmailOTPSchema.js"

let otpGenrate = Math.floor(100000 + Math.random() * 900000)

async function login(req, res, next) {
  try {
    const { email, password } = req.body
    if(!email || !password){
       const err = new Error("field are required")
       err.statusCode = 400
       throw err
    }
    const data = { email,  password}
    // const validatedData = userValidationSchemalogin.parse(data)
    // if (!validatedData) {
    //    const err = new Error("enter valid input")
    //    err.statusCode = 400
    //    throw err
    // }
    const existingUser = await User.findOne({ email })
    if (!existingUser) {
       const err = new Error("account does not exists")
       err.statusCode = 400
       throw err
    }

    if (!existingUser.isVerified) {
      await verifyEmail(existingUser.email, otpGenrate)
       const err = new Error("unAuthorized user")
       err.statusCode = 401
       throw err
    }

    const isPasswordMatch = await bcrypt.compare( password, existingUser.password)
    if (!isPasswordMatch) {
       const err = new Error("invalid email password")
       err.statusCode = 400
       throw err
    }
    const userData = {
      username: existingUser.name,
      email: existingUser.email,
      id: existingUser._id,
      isVerified: true,
    }
    const id = userData.id
    const token = setUser(id)
    let Verified;
    if (existingUser.isAdmin) {
      const isVerified = existingUser.isVerified
      Verified = setAdmin(isVerified)
    }
    res.status(200).json({
      message: "login successful",
      user: userData,
      token,
      Verified
    })
  } catch (err) {
    next(err)
  }
}

async function signup(req, res, next) {
  try {
    const { name, email, password} = req.body
    if(!name || !email || !password){
      const err = new Error("field are required")
      err.statusCode = 400
      throw err
    }
    const data = { name, email,  password}
    const validatedData = userValidationSchema.parse(data)
    if(!validatedData){
      const err = new Error("enter the valid input")
      err.statusCode = 400
      throw err
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      const err = new Error("Account already exists")
      err.statusCode = 400;
      throw err
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ ...validatedData, password: hashedPassword })
    await newUser.save()
    await verifyEmail(newUser.email, otpGenrate)
    res.status(201).json({ message: "user registered successfully", data: newUser._id || "signup success" })
  } catch (err) {
     next(err)
  }
}

async function verifyEmailOTP(req, res, next)  {
  try {
    const id = req.params.id
    const { email, otp } = req.body

    const otpDoc = await EmailOTP.findOne({ email, otp  });

    if (!otpDoc) {
       const err = new Error("invalid OTP or email")
       err.statusCode = 400
       throw err
    }

    if (otpDoc.isUsed) {
       const err = new Error("OTP already used")
       err.statusCode = 400
       throw err
    }

    if (otpDoc.expiresAt < new Date()) {
      const err = new Error("OTP has expired")
       err.statusCode = 400
       throw err
    }

    otpDoc.isUsed = true
    await otpDoc.save()
     const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        isVerified : true,
      },
      { new: true }
    )
    if (!updatedUser) {
       const err = new Error("user not found")
       err.statusCode = 400
       throw err
    }
    // await EmailOTP.deleteMany({ email })
    return res.status(200).json({ message: "OTP verified successfully" })

  } catch (err) {
    next(err)
  }
}

async function resendEmail(req, res, next){
  try {
  const { email } = req.body
  const existingUser = await User.findOne({ email })
    if (!existingUser) {
       const err = new Error("account does not exists")
       err.statusCode = 400
       throw err
    }
    await verifyEmail(existingUser.email, otpGenrate)
    res.status(200).json({
      message: "OTP resended"
    })
  } catch (err) {
    next(err)
  }
}

async function logout(req, res, err) {
  try {
    res.clearCookie("token")
    if(req.cookies.isVerified){
      res.clearCookie("isVerified")
      return res.json({msg:"logout admin"})
    }
    return res.json({msg:"logout"})
  } catch (err) {
    next(err)
  }
}


export { login, signup, verifyEmailOTP, resendEmail, logout }
