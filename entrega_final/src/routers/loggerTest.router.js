import { Router } from "express";
import { logger } from "../logger/logger.js";

const router = Router()

router.get("/",(req,res)=> {
    res.render("logger")
})

router.get("/loggertest", (req,res)=>{
    const {level} = req.query
    const message = `Este es un log nivel ${level}`
    switch(level){
     case 'debug':
        logger.debug(message)
        break
    case 'info':
        logger.info(message)
        break
    case 'warning':
        logger.warning(message)
        break
    case 'error':
        logger.error(message)
        break
    case 'fatal':
        logger.error(message)
        break

    default:
        return res.status(400).json({message: 'Log Invalido'})
    }
    res.json({message: `Log mensaje nivel: ${level}`})
})


export default router