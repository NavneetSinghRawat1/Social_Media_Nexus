const express = require("express");
const router = express.Router();
const pool = require("../db/db"); 
const jwt = require("jsonwebtoken");
router.get("/", async (req, res) => {
    try {
        const limit = 5;

        let query = `
            SELECT
                c.community_id,
                c.name,
                c.comm_pic,

                COUNT(DISTINCT cm.user_id) AS total_members,

                COUNT(DISTINCT CASE
                    WHEN m.created_at >= NOW() - INTERVAL '24 hours'
                    THEN m.message_id
                END) AS recent_messages,

                COUNT(DISTINCT CASE
                    WHEN m.created_at >= NOW() - INTERVAL '24 hours'
                    THEN m.sender_id
                END) AS active_users,

                MAX(m.created_at) AS last_message_at,

                ROUND(
                    (
                        COUNT(DISTINCT cm.user_id) * 0.3 +
                        COUNT(DISTINCT CASE
                            WHEN m.created_at >= NOW() - INTERVAL '24 hours'
                            THEN m.message_id
                        END) * 0.5 +
                        COUNT(DISTINCT CASE
                            WHEN m.created_at >= NOW() - INTERVAL '24 hours'
                            THEN m.sender_id
                        END) * 0.2
                    )::numeric,
                    2
                ) AS score

            FROM communities c

            LEFT JOIN user_joined_communities cm
                ON cm.community_id = c.community_id

            LEFT JOIN community_messages m
                ON m.community_id = c.community_id

            GROUP BY c.community_id

            ORDER BY score DESC,
                    last_message_at DESC

            LIMIT ${limit};
        `;

        const result = await pool.query(query);

        const table = result.rows;

        res.json({
            table
        });

    } catch (err) {
        // console.error(err);
        res.status(500).json({
            error: "Server Error",
        });
    }
});

module.exports = router;