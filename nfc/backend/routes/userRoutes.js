const express=require("express")
 const UserRouter=express.Router(); 
const {createUser,loginUser,logoutUser,UserInfo,Depot,refreshToken}=require("../controllers/UserControllers")
const {auth}=require("../middlewares/authentification")


UserRouter.post("/create",createUser)
UserRouter.post("/login",loginUser)
UserRouter.post("/logout",auth,logoutUser)
UserRouter.get("/userinfo",auth,UserInfo)
UserRouter.post("/depot",auth,Depot)
UserRouter.post("/refresh-token",auth,refreshToken)


module.exports=UserRouter