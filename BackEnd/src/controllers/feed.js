const express = require("express");
const router = express.Router();
const pool = require("../db/db"); // your pg connection
// const authMiddleware = require("../middleware/auth.middleware");
const jwt = require("jsonwebtoken");
router.get("/", async (req, res) => {
    try {
        // console.log("feed route hit");
        const token = req.cookies.token;
        
        if (!token) {
            const limit = parseInt(req.query.limit) || 15;
            const cursorScore = req.query.cursorScore ? parseFloat(req.query.cursorScore) : null;
            
            // FIXED: Do not use parseInt. Treat the UUID cursor ID as a string.
            const cursorPostId = req.query.cursorPostId || null;

            let query = `
                SELECT 
                    posts.*,
                    users.profile_photo,
                    (
                        SELECT json_agg(tags.tag_name) 
                        FROM post_tags 
                        INNER JOIN tags ON post_tags.tag_id = tags.id 
                        WHERE post_tags.post_id = posts.post_id
                    ) AS tags,
                    (EXTRACT(EPOCH FROM posts.created_at) * 0.0000001) AS final_score
                FROM posts 
                INNER JOIN users ON posts.creator_id = users.user_id
            `;

            const values = [limit];

            // FIXED: Cast UUID column to TEXT so string comparison operators (<, >) work seamlessly
            if (cursorScore !== null && cursorPostId !== null) {
                query += ` WHERE 
                    ((EXTRACT(EPOCH FROM posts.created_at) * 0.0000001) < $2)
                    OR 
                    ((EXTRACT(EPOCH FROM posts.created_at) * 0.0000001) = $2 AND posts.post_id::text < $3)
                `;
                values.push(cursorScore);
                values.push(cursorPostId); // Will safely accept the UUID string now
            }

            // FIXED: Match the ORDER BY clause with text-casting for consistency
            query += ` ORDER BY (EXTRACT(EPOCH FROM posts.created_at) * 0.0000001) DESC, posts.post_id::text DESC LIMIT $1`;

            const result = await pool.query(query, values);
            const posts = result.rows;

            let nextCursor = null;
            if (posts.length > 0) {
                const lastPost = posts[posts.length - 1];
                nextCursor = {
                    cursorScore: lastPost.final_score,
                    cursorPostId: lastPost.post_id, // Safely passes back your UUID string
                };
            }

            res.json({
                // token: token,
                posts,
                nextCursor,
                hasMore: posts.length === limit
            });
        }
        else{
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user_sending_data = decoded;
            const userId = req.user_sending_data.id;

            const limit = parseInt(req.query.limit) || 15;

            const cursorScore = req.query.cursorScore
                ? parseFloat(req.query.cursorScore)
                : null;

            // const cursorPostId = req.query.cursorPostId
            //     ? parseInt(req.query.cursorPostId)
            //     : null;
            const cursorPostId = req.query.cursorPostId ||null;

            let query = `
                SELECT
                    p.*,
                    u.profile_photo,

                    COALESCE(
                        json_agg(DISTINCT t.tag_name)
                        FILTER (WHERE t.tag_name IS NOT NULL),
                        '[]'
                    ) AS tags,

                    (
                        (COALESCE(SUM(uti.interest_score), 0) * 0.7)
                        +
                        (COALESCE(pe.engagement_score, 0) * 0.2)
                        +
                        (EXTRACT(EPOCH FROM p.created_at) * 0.0000001)
                    ) AS final_score,

                    EXISTS (
                        SELECT 1
                        FROM user_liked_posts ulp
                        WHERE ulp.user_id = $1
                        AND ulp.post_id = p.post_id
                    ) AS isLiked

                FROM posts p

                INNER JOIN users u
                ON p.creator_id = u.user_id

                LEFT JOIN post_tags pt
                ON p.post_id = pt.post_id

                LEFT JOIN tags t
                ON pt.tag_id = t.id

                LEFT JOIN user_tag_interest uti
                ON uti.tag_id = pt.tag_id
                AND uti.user_id = $1

                LEFT JOIN post_engagement pe
                ON pe.post_id = p.post_id
            `;

            const values = [userId];

            if (cursorScore !== null && cursorPostId !== null) {
                query += `
                    GROUP BY
                        p.post_id,
                        pe.engagement_score,
                        u.profile_photo

                    HAVING
                    (
                        (
                            (COALESCE(SUM(uti.interest_score), 0) * 0.7)
                            +
                            (COALESCE(pe.engagement_score, 0) * 0.2)
                            +
                            (EXTRACT(EPOCH FROM p.created_at) * 0.0000001)
                        ) < $2
                    )

                    OR

                    (
                        (
                            (COALESCE(SUM(uti.interest_score), 0) * 0.7)
                            +
                            (COALESCE(pe.engagement_score, 0) * 0.2)
                            +
                            (EXTRACT(EPOCH FROM p.created_at) * 0.0000001)
                        ) = $2

                        AND p.post_id < $3
                    )
                `;

                values.push(cursorScore);
                values.push(cursorPostId);
            } else {
                query += `
                    GROUP BY
                        p.post_id,
                        pe.engagement_score,
                        u.profile_photo
                `;
            }

            query += `
                ORDER BY final_score DESC, p.post_id DESC
                LIMIT ${limit}
            `;

            const result = await pool.query(query, values);
            const user=await pool.query("Select username,profile_photo from users where user_id=$1",[req.user_sending_data.id]);
            const posts = result.rows;

            let nextCursor = null;

            if (posts.length > 0) {
                const lastPost = posts[posts.length - 1];

                nextCursor = {
                    cursorScore: lastPost.final_score,
                    cursorPostId: lastPost.post_id,
                };
            }
            // console.log(posts);
            res.json({
                // token:token,
                posts,
                nextCursor,
                hasMore: posts.length === limit,
                // user:user.rows[0]
            });
    }

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server Error",
        });
    }
});

module.exports = router;