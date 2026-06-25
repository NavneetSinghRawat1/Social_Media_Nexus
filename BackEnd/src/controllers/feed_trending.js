const express = require("express");
const router = express.Router();
const pool = require("../db/db"); 
const jwt = require("jsonwebtoken");
router.get("/", async (req, res) => {
    try {

        const limit = parseInt(req.query.limit) || 15;

        const cursorScore = req.query.cursorScore
            ? parseFloat(req.query.cursorScore)
            : null;

        const cursorPostId = req.query.cursorPostId || null;

        let userId = null;

        try {
            const token=req.cookies.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user_sending_data = decoded;
            userId = decoded?.id || null;
        } catch (err) {
            userId = null; 
        }
        let query = `
            SELECT
                p.*,
                users.profile_photo,
        `;

        const values = [];

        if (userId) {
            values.push(userId);

            query += `
                EXISTS (
                    SELECT 1
                    FROM user_liked_posts ulp
                    WHERE ulp.user_id = $1
                    AND ulp.post_id = p.post_id
                ) AS "isliked",
            `;
        } else {
            query += `
                false AS "isliked",
            `;
        }
        // const values = [];
        query+=`    (
                    SELECT COALESCE(
                        json_agg(tags.tag_name),
                        '[]'
                    )
                    FROM post_tags
                    INNER JOIN tags
                    ON post_tags.tag_id = tags.id
                    WHERE post_tags.post_id = p.post_id
                ) AS tags,

                (
                    COALESCE(pe.engagement_score, 0)
                    /
                    GREATEST(
                        EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600,
                        1
                    )
                ) AS trending_score

            FROM posts p

            INNER JOIN users
            ON p.creator_id = users.user_id

            LEFT JOIN post_engagement pe
            ON pe.post_id = p.post_id
        `;

        const scorePlaceholder = values.length + 1;
        const postPlaceholder = values.length + 2;
       
        if (cursorScore !== null && cursorPostId !== null) {

            query += `
                WHERE
                (
                    (
                        COALESCE(pe.engagement_score, 0)
                        /
                        GREATEST(
                            EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600,
                            1
                        )
                    ) < $${scorePlaceholder}
                )

                OR

                (
                    (
                        COALESCE(pe.engagement_score, 0)
                        /
                        GREATEST(
                            EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600,
                            1
                        )
                    ) = $${scorePlaceholder}

                    AND p.post_id < $${postPlaceholder}
                )
            `;

            values.push(cursorScore);
            values.push(cursorPostId);
        }

        query += `
            ORDER BY trending_score DESC, p.post_id DESC
            LIMIT ${limit}
        `;

        const result = await pool.query(query, values);

        const posts = result.rows;

        let nextCursor = null;

        if (posts.length > 0) {
            const lastPost = posts[posts.length - 1];

            nextCursor = {
                cursorScore: lastPost.trending_score,
                cursorPostId: lastPost.post_id,
            };
        }

        res.json({
            posts,
            nextCursor,
            hasMore: posts.length === limit,
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Server Error",
        });
    }
});

module.exports = router;