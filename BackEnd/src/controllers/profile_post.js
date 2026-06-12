const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const jwt = require("jsonwebtoken");
router.get("/", async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user_sending_data = decoded;
        const userId = req.user_sending_data.id;

        // how many posts per request
        const limit = parseInt(req.query.limit) || 15;

        // cursor values
        const cursorCreatedAt = req.query.cursorCreatedAt || null;
        const cursorPostId = req.query.cursorPostId || null;

        let query = `
            SELECT
                p.*,
                u.profile_photo,

                COALESCE(
                    json_agg(DISTINCT t.tag_name)
                    FILTER (WHERE t.tag_name IS NOT NULL),
                    '[]'
                ) AS tags

            FROM posts p

            INNER JOIN users u
            ON p.creator_id = u.user_id

            LEFT JOIN post_tags pt
            ON p.post_id = pt.post_id

            LEFT JOIN tags t
            ON pt.tag_id = t.id

            WHERE p.creator_id = $1
        `;

        const values = [userId];

        // cursor pagination
        if (cursorCreatedAt && cursorPostId) {

            query += `
                AND (
                    p.created_at < $2

                    OR

                    (
                        p.created_at = $2
                        AND p.post_id::text < $3
                    )
                )
            `;

            values.push(cursorCreatedAt);
            values.push(cursorPostId);
        }

        query += `
            GROUP BY
                p.post_id,
                u.profile_photo

            ORDER BY
                p.created_at DESC,
                p.post_id::text DESC

            LIMIT $${values.length + 1}
        `;

        values.push(limit);

        const result = await pool.query(query, values);

        const posts = result.rows;

        let nextCursor = null;

        if (posts.length > 0) {

            const lastPost = posts[posts.length - 1];

            nextCursor = {
                cursorCreatedAt: lastPost.created_at,
                cursorPostId: lastPost.post_id,
            };
        }
        // console.log(posts);
        res.json({
            posts,
            nextCursor,

            // if posts returned are exactly limit,
            // maybe more posts exist
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