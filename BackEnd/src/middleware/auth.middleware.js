const jwt = require("jsonwebtoken");

async function auth_user(req,res,next) {
    const token = req.cookies.token;
    if (!token) {
        // console.log("token not found");
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user_sending_data=decoded
        // console.log(req.user_sending_data);
        
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Unauthorized" })
    }

    next()
}

// async function auth_user_feed(req,res,next) {
//     const token = req.cookies.token;
//     if (!token) {
//         const posts=await Pool.query(`SELECT posts.*,users.profile_photo,(
//                                             SELECT json_agg(tags.tag_name) 
//                                             FROM post_tags 
//                                             INNER JOIN tags ON post_tags.tag_id = tags.id 
//                                             WHERE post_tags.post_id = posts.post_id
//                                         ) AS tags FROM posts INNER JOIN users ON posts.creator_id = users.user_id order by (EXTRACT(EPOCH FROM posts.created_at) * 0.0000001) limit $1`,[process.env.POSTS_LIMIT]);
//             // console.log("bottle nhi h");
//             // console.log(posts);
//             res.status(200).json({
//                 token:token,
//                 posts:posts.rows
//             })
//     }
//     else{

//     }
// }

module.exports={auth_user}