const usermodel = require("../model/usermodel.js");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

// register 
const registerController = async (req,res)=>{
    try {
        const {username,email,password,phone,address} = req.body;
        // validation
        if(!username || !email || !password || !phone){
            return res.status(400).send({
                success:false,
                message:"Please fill all the fields"
            })
        }
        // check user 
        const existinguser = await usermodel.findOne({email});
        if(existinguser){
            return res.status(400).send({
                success:false,
                message:"User already exists"
            })
        }

        // encrypting password
        const salt = bcrypt.genSaltSync(10);
        const haspassword = await bcrypt.hash(password, salt);

        //  create new user
        const user = await usermodel.create({
            username,
            email,
            password: haspassword,
            phone,
            address
        })
        res.status(201).send({
            success:true,
            message:"User registered successfully",
            user
        })

    } catch (error) {
        console.log(error+"error in registerController");
        res.status(500).send({
            success:false,
            message:"Error in registerController",
            error
        });
        
    }
};

const loginController = async (req,res)=>{
    try {
        const {email,password} = req.body;

        // validation
        if(!email || !password){
            return res.status(400).send({
                success:false,
                message:"Please fill all the fields"
            })
        }

        // check user
        const user = await usermodel.findOne({email});
        if(!user){
            return res.status(400).send({
                success:false,
                message:"User does not exist"
            })
        }
        // dcrupyting password
        const ismatch = await bcrypt.compare(password,user.password);
        // check password
        if(!ismatch){
            return res.status(400).send({
                success:false,
                message:"Invalid password"
            })
        }

        // create token
        const token = JWT.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:"7d"});
        // whats the test below this line 
        res.cookie("token", token, {
            httpOnly:true,
            expires: new Date(Date.now() + 7*24*60*60*1000)
        });
        // and above this line

        user.password = undefined;
        res.status(200).send({
            success:true,
            message:"User logged in successfully",
            token,
            user
        });
        

    } catch (error) {
        console.log(error+"error in loginController");
        res.status(500).send({
            success:false,
            message:"Error in loginController",
            error
        });
    }
};

module.exports = { registerController, loginController };