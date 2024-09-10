import { validToken } from "../services/resetService.js"

export const isValidToken = async (req, res, next) =>{
const  token  = req.query.token  
const userid = req.query.id
const isValid = await validToken(userid,token)
if(!isValid)
{
   return res.redirect("/reset_password");

}
return next()
}