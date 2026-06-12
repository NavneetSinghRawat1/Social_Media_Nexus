const pool=require("../db/db");

async function get_communityMessage(req,res) {
    try {

        const { communityId } = req.params;

        const result = await pool.query(
            `
            SELECT
                cm.message_id,
                cm.message,
                cm.created_at,
                cm.sender_id,

                u.username,
                u.profile_photo

            FROM community_messages cm

            JOIN users u
            ON cm.sender_id = u.user_id

            WHERE cm.community_id = $1

            ORDER BY cm.created_at ASC

            LIMIT 50
            `,
            [communityId]
        );
        // console.log("result ",result.rows);
        res.json(result.rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Server error"
        });
    }

};


async function send_communityMessage(req,res) {
     try {

            const { communityId } = req.params;

            const { message } = req.body;

            const senderId = req.user_sending_data.id;

            if (!message || !message.trim()) {
                return res.status(400).json({
                    error: "Message required"
                });
            }

            const result = await pool.query(
                `
                INSERT INTO community_messages
                (
                    community_id,
                    sender_id,
                    message
                )

                VALUES ($1,$2,$3)

                RETURNING *
                `,
                [
                    communityId,
                    senderId,
                    message
                ]
            );

            res.json(result.rows[0]);

        } catch (err) {

            console.log(err);

            res.status(500).json({
                error: "Server error"
            });
        }
}


async function chk_joined_status(req,res) {
    try {
            // console.log("req.user_sending_data -> ",req.user_sending_data);
            const userId = req.user_sending_data.id;

            const { communityId } = req.params;

            const result = await pool.query(
                `
                SELECT *
                FROM user_joined_communities

                WHERE user_id = $1
                AND community_id = $2
                `,
                [userId, communityId]
            );
            // console.log("ajs -> ",result.rows);
            res.json({
                joined: result.rows.length > 0
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({
                error: "Server error"
            });
        }

}

module.exports={get_communityMessage,send_communityMessage,chk_joined_status};