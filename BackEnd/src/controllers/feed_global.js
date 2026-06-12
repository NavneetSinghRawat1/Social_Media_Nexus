const express = require("express");
const router = express.Router();
const pool = require("../db/db"); // your pg connection
// const authMiddleware = require("../middleware/auth.middleware");
const jwt = require("jsonwebtoken");
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 15;

        // const cursorCreatedAt = req.query.cursorCreatedAt || null;

        // const cursorPostId = req.query.cursorPostId || null;
        const cursorFeedId = req.query.cursorFeedId || null;

        let userId = null;

        try {
            const token = req.cookies.token;

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            req.user_sending_data = decoded;

            userId = decoded?.id || null;

        } catch (err) {
            userId = null; // guest user
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

        query += `
                (
                    SELECT COALESCE(
                        json_agg(tags.tag_name),
                        '[]'
                    )
                    FROM post_tags
                    INNER JOIN tags
                    ON post_tags.tag_id = tags.id
                    WHERE post_tags.post_id = p.post_id
                ) AS tags

            FROM posts p

            INNER JOIN users
            ON p.creator_id = users.user_id
        `;


        if (cursorFeedId) {
            const cursorPlaceholder = values.length + 1;
            query += `
                WHERE p.feed_id < $${cursorPlaceholder}
            `;

            values.push(cursorFeedId);
        }

        query += `
            ORDER BY p.feed_id DESC
            LIMIT ${limit}
        `;

        const result = await pool.query(query, values);

        const posts = result.rows;

        let nextCursor = null;

        if (posts.length > 0) {

            const lastPost = posts[posts.length - 1];
            nextCursor = {
                cursorFeedId: lastPost.feed_id,
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