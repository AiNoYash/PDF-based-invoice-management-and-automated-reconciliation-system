const JWT = require("jsonwebtoken");

const authmiddleware = async (req,res,next)=>{
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        JWT.verify(token,process.env.JWT_SECRET,(err,decode)=>{
            if(err){
                return res.status(401).send({
                    success:false,
                    message:"Unauthorized access",
                    error:err
                })
            }else{
                req.body.id = decode.userId;
                next();
            }
            
        })
    }catch (error) {
        console.log(error);
        res.status(401).send({
            success:false,
            message:"please provide auth token",
            error 
        })
    }
}

module.exports = { authmiddleware };