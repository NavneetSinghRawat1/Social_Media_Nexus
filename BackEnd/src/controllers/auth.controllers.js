const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Pool =require("../db/db");
const {uploadFile, deletePic}=require("../services/storage.services")
require('dotenv').config();

async function registerUser(req,res) {
    // console.log("hello ehlo kek");
    const token=req.cookies.token
    if (token){
        res.status(401).json({
            message: "User already logged in"
        })
    }
    const { username, password} = req.body;
    try {
        const hash = await bcrypt.hash(password,10)
        const pic=process.env.DEFAULT_PROFILE_PIC
        const pic_fileID=process.env.DEFAULT_PROFILE_PIC_FILE_ID
        const user = await Pool.query("INSERT INTO users (username, password,profile_photo,fileID) VALUES ($1,$2,$3,$4) RETURNING user_id",[username,hash,pic,pic_fileID]);
        const[{user_id}]=user.rows;
        const token = jwt.sign({
            id:user_id,
            username:username
        }, process.env.JWT_SECRET)

        res.cookie("token", token)

        res.status(201).json({
            user:username,
            picture:pic,
            message: "User registered successfully"
        })
    } catch (error) {     
        res.status(409).json({
            message:"User already exists"
        });
    }
}

async function loginUser(req,res){
    const chk_token=req.cookies.token
    if (chk_token){
        res.status(401).json({
            message: "User already logged in"
        })
    }
    const {username} = req.body;
    const u_password=req.body.password
    const user = await Pool.query("Select * from users Where username=$1",[username]);
    
    if (Object.keys(user.rows).length==0) {
        return res.status(401).json({message:"Invalid credentials"})
    }
    
    const [{user_id,password}]=user.rows;
    
    const isPasswordValid = await bcrypt.compare(u_password,password)
    
    
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" })
    }
    const token = jwt.sign({
        id:user_id,
        username:username
    }, process.env.JWT_SECRET)

    res.cookie("token", token)
    res.status(200).json({
        user:user.rows[0].username,
        picture:user.rows[0].profile_photo,
        message:"User logged in successfully"
    });
    
}

async function logoutUser(req, res) {
    res.clearCookie("token")
    res.status(200).json({ message: "User logged out successfully" })
}

async function updateUser(req, res) {
    try {
        const { u_password, bio } = req.body;
        const profile_photo = req.file;
        const username=req.user_sending_data.username;
        let updateFields = [];
        let queryParams = [];
        let count = 1;
        // 1. Handle Password Hashing (if provided)
        if (u_password) {
            const hash = await bcrypt.hash(u_password, 10);
            updateFields.push(`password = $${count++}`);
            queryParams.push(hash);
        }

        // 2. Handle Image Upload (if provided)
        if (profile_photo) {
            const result = await uploadFile(profile_photo.buffer.toString('base64'), username);
            
            
            updateFields.push(`profile_photo = $${count++}`);
            queryParams.push(result.thumbnailUrl);
            const check=await Pool.query("Select fileid from users where username=$1",[username]);
            const [{fileid}]=check.rows;
            if (fileid!==process.env.DEFAULT_PROFILE_PIC_FILE_ID) {
                const res=await deletePic(fileid);
            }
            updateFields.push(`fileid = $${count++}`);
            queryParams.push(result.fileId);
        }

        // 3. Handle Bio (if provided)
        if (bio !== undefined) { // allows for empty string bio but skips if undefined
            updateFields.push(`bio = $${count++}`);
            queryParams.push(bio);
        }

        // If no fields were provided to update
        if (updateFields.length === 0) {
            return res.status(400).json({ message: "No data provided to update." });
        }

        // 4. Add username as the final parameter for the WHERE clause
        queryParams.push(username);
        const query = `UPDATE users SET ${updateFields.join(', ')} WHERE username = $${count} RETURNING *`;

        const userResult = await Pool.query(query, queryParams);

        if (userResult.rowCount === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({
            message: "Updated successfully"
            // user: userResult.rows[0]
        });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ 
            error: "Internal server error", 
            details: error.message 
        });
    }
}


module.exports={registerUser,loginUser,logoutUser,updateUser}