import express from "express"
const Router = express.Router()
import { signup , login, verifyEmailOTP, resendEmail, logout } from "../controller/auth/auth.js"
import {
    getData,
    createNewChat,
    getAllChats,
    getChatById,
    deleteChat
} from '../controller/user/user.js';
import { authCheck } from "../middleware/authcheck.js"
import upload from "../middleware/multer/multer.js"

//Auth
Router.post("/login", login)
Router.post("/signup", signup)
Router.post("/verifyotp/:id", verifyEmailOTP)
Router.post("/resendemail", resendEmail)
Router.post("/auth/logout", authCheck, logout)


// Chat management routes
Router.post('/chat/new/:id',        createNewChat);                    
Router.get('/chats/:id',            getAllChats);                          
Router.get('/chat/:id/:sessionId',  getChatById);                
Router.delete('/chat/:id',          deleteChat);                      

// Main analysis endpoint
Router.post('/analyze-combined/:id',  upload.single('medicalReportFile'), getData);


export default Router