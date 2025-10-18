import express from "express"
const Router = express.Router()
import { signup , login, verifyEmailOTP, resendEmail, logout } from "../controller/auth/auth.js"
import { getDataByAdmin, createDataByAdmin, updateDataByAdmin, modifyDataByAdmin, deleteDataByAdmin } from "../controller/admin/admin.js"
// import {getData, createData, updateData, modifyData, deleteData} from "../controller/user/user.js"
import { getData } from "../controller/user/user.js"
import { authCheck } from "../middleware/authcheck.js"
import { authCheckAdmin } from "../middleware/admin/authcheck.js"
import upload from "../middleware/multer/multer.js"
import { uplodefile } from "../controller/uplodeFile/uplodefile.js"

//Auth
Router.post("/login", login)
Router.post("/signup", signup)
Router.post("/verifyotp/:id", verifyEmailOTP)
Router.post("/resendemail", resendEmail)
Router.post("/auth/logout", authCheck, logout)

//user
Router
  .route("/analyze-combined")
  .post(upload.single("medicalReportFile"),  getData)  //[authCheck, upload.single("image")]
  // .get(authCheck,   getData)
  

// Router
//   .route("/user/:id")
//   .patch(authCheck, updateData)
//   .put(authCheck,   modifyData)
//   .delete(authCheck,deleteData)

// //admin
Router
  .route("/admin")
  .get(authCheckAdmin,   getDataByAdmin   )
  .post(authCheckAdmin,  createDataByAdmin)

Router
  .route("/admin/:id")
  .patch(authCheckAdmin, updateDataByAdmin)
  .put(authCheckAdmin,   modifyDataByAdmin)
  .delete(authCheckAdmin,deleteDataByAdmin)

//img uplode
Router.post("/uplodefile", [authCheck, , upload.single("image")], uplodefile)


export default Router