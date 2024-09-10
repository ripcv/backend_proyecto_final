import tokenModel from "../dao/models/token.model.js";

export async function saveToken(userId,token){
    try {
        const result = await tokenModel.updateOne(
            {userID: userId},
            {$set: {token:token}},
            {upsert: true}
        )
        return result.nModified > 0 || result.upsertedCount > 0;
    } catch (error) {
        //manejar error en log
    }
    
}

export async function validToken(userID,token){
   try {
    const result = await findToken(userID)
    if(!result){
    
       return false   
    }
    if(token===result.token){
        return true
    }
    return false
   } catch (error) {
    //manejar error en log
   }

}

export async function deleteToken(userID){
    try {
        const result = await tokenModel.deleteOne({userID})
        return true
    } catch (err) {
        //manejar error en log
    }
}

export async function findToken(userID){
  return (await tokenModel.findOne({userID}))
}