const Pool =require("../db/db");
const {uploadFile_comm,deletePic}=require("../services/storage.services")
require('dotenv').config();
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// async function temp_comm(req,res) {
//     function generateCommunities() {
//         // Pools of data to mix and match
//         const themes = ['Tech', 'Gaming', 'Fitness', 'Cooking', 'Art', 'Music', 'Travel', 'Book', 'Gardening', 'Photography'];
//         const suffixes = ['Hub', 'Central', 'Network', 'Collective', 'Club', 'Sphere', 'Lounge', 'HQ', 'Guild', 'Corner'];
        
//         // Tag dictionary mapping themes to relevant keywords
//         const tagDictionary = {
//             'Tech': ['coding', 'hardware', 'AI', 'software', 'devs'],
//             'Gaming': ['rpg', 'fps', 'streamer', 'pc', 'console'],
//             'Fitness': ['workout', 'running', 'nutrition', 'gym', 'health'],
//             'Cooking': ['recipes', 'baking', 'foodie', 'chef', 'vegan'],
//             'Art': ['painting', 'digitalart', 'sketch', 'design', 'creative'],
//             'Music': ['vinyl', 'guitar', 'indie', 'playlist', 'musicians'],
//             'Travel': ['backpacking', 'wanderlust', 'flights', 'hotels', 'adventure'],
//             'Book': ['novels', 'scifi', 'reading', 'literature', 'reviews'],
//             'Gardening': ['plants', 'botany', 'organic', 'flowers', 'indoorplants'],
//             'Photography': ['canon', 'sony', 'lens', 'editing', 'streetphoto']
//         };

//         const communities = {};

//         for (let i = 1; i <= 4; i++) {
//             // Pick a random theme and a random suffix
//             const theme = themes[Math.floor(Math.random() * themes.length)];
//             const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            
//             // 1. Generate Community Name
//             const communityName = `${theme} ${suffix}`;

//             // 2. Generate Description based on the theme
//             const description = `A welcoming space for everyone passionate about ${theme.toLowerCase()}. Share your projects, ask questions, and connect with fellow enthusiasts!`;

//             // 3. Grab relevant tags (shuffling or slicing to get 3 random tags from that theme)
//             const availableTags = tagDictionary[theme];
//             const tags = availableTags.sort(() => 0.5 - Math.random()).slice(0, 3);

//             // 4. Assign to Object
//             communities[`community_${i}`] = {
//                 name: communityName,
//                 description: description,
//                 tags: tags
//             };
//         }
//         return communities;
//     }

//     // Generate and log the object
//     const communityDatabase = generateCommunities();
//     console.log(communityDatabase);
//     for (const key in communityDatabase) {
//         try {
//             const { name, description, tags } = communityDatabase[key];
//             let pic=process.env.DEFAULT_COMMUNITY_PIC;
//             let pic_fileID=process.env.DEFAULT_COMMUNITY_PIC_FILE_ID;
//             const community = await Pool.query("INSERT INTO communities (name, description,comm_pic,creator_name,fileid,creator_id) VALUES ($1, $2,$3,$4,$5,$6) returning community_id", [name, description, pic, req.user_sending_data.username, pic_fileID, req.user_sending_data.id]);
//             const tag_query = await Pool.query("INSERT INTO tags (tag_name) SELECT * FROM unnest($1::text[]) ON CONFLICT (tag_name) DO UPDATE SET tag_name = EXCLUDED.tag_name RETURNING id;", [tags]);
//             const tagIds = tag_query.rows.map(row => row.id);
//             const community_id_query = await Pool.query("SELECT community_id FROM communities WHERE name = $1", [name]);
//             const community_id = community_id_query.rows[0].community_id;
//             const community_tags = await Pool.query("INSERT INTO community_tags (community_id, tag_id) SELECT $1::uuid, unnest($2::uuid[]) ON CONFLICT DO NOTHING", [community_id, tagIds]);
//             const tagIDS_user_interest = await Pool.query("SELECT tag_id FROM community_tags WHERE community_id = $1;",[community.rows[0].community_id]);
//             const user_update_interest_query = `
//                 INSERT INTO user_tag_interest (
//                     user_id,
//                     tag_id,
//                     interest_score,
//                     created_community_score,
//                     updated_at,
//                     last_interaction_at
//                 )
//                 SELECT $1, unnested_tag_id, $3, $3, NOW(), NOW()
//                 FROM UNNEST($2::uuid[]) AS unnested_tag_id
//                 ON CONFLICT (user_id, tag_id)
//                 DO UPDATE SET
//                 interest_score = user_tag_interest.interest_score + $3,
//                 created_community_score = user_tag_interest.created_community_score + $3,
//                 updated_at = NOW(),
//                 last_interaction_at = NOW();
//                 `;
                
//                 try {
//                     // Passes the array directly to the query, letting PostgreSQL unroll it
//                     await Pool.query(user_update_interest_query, [req.user_sending_data.id, tagIDS_user_interest.rows.map(row => row.tag_id), process.env.CREATED_COMMUNITY_INTERACTION_SCORE]);
//                     console.log(`Bulk created-community update complete for ${tagIDS_user_interest.rows.length} tags.`);
//                 } catch (error) {
//                     console.error('Error in bulk created-community interest update:', error);
//                     console.log(error.message);
//                     throw error;
//                 }
//             } catch (error) {
//                 console.log(error.message);
//                 res.status(500).json({
//                     message: "Error adding communities"
//                 });
//             }
//         }
//         res.status(200).json({
//             message: "Communities added successfully"
//         });
// }


async function join_creator_Communities(username,communityName) {
    
    try {
        // const chk_comm=await Pool.query("Select name from communities where name=$1",[communityName]);
        // if (!chk_comm.rows.length) {
        //     res.status(401).json({
        //         message:"Invalid Credentials"
        //     })
        // }
        
        const join=await Pool.query("Update communities set members=(array_append(members,$1)) where name=$2 AND NOT ($1 = ANY(members)) returning community_id",[username,communityName]);
        // console.log(join);
        if (join.rows.length!=0) {
            // const query=await Pool.query("UPDATE users SET joined_communities = array_append(joined_communities, $1) WHERE username = $2 AND NOT ($1 = ANY(joined_communities))",[join.rows[0].community_id,username]);
            const query=await Pool.query("Insert into user_joined_communities (user_id,community_id) values ($1,$2)",[req.user_sending_data.id,join.rows[0].community_id]);
            const tag_ids=await Pool.query("SELECT tag_id FROM community_tags WHERE community_id = $1;",[join.rows[0].community_id])
            const query_user_interest = `
                INSERT INTO user_tag_interest (
                    user_id,
                    tag_id,
                    interest_score,
                    joined_community_score,
                    updated_at,
                    last_interaction_at
                )
                SELECT $1, unnested_tag_id, $3, $3, NOW(), NOW()
                FROM UNNEST($2::uuid[]) AS unnested_tag_id
                ON CONFLICT (user_id, tag_id)
                DO UPDATE SET
                    interest_score = user_tag_interest.interest_score + $3,
                    joined_community_score = user_tag_interest.joined_community_score + $3,
                    updated_at = NOW(),
                    last_interaction_at = NOW();
            `;
            try {
                await Pool.query(query_user_interest, [req.user_sending_data.id, tag_ids.rows.map(row => row.tag_id), process.env.JOINED_COMMUNITY_INTERACTION_SCORE]);
                console.log(`Bulk community interest update complete for ${tag_ids.rows.length} tags.`);
            } catch (error) {
                console.error('Error in bulk community interest update:', error);
                throw error;
            }
        }
        // res.status(200).json({
        //     message:"Joined Successfully!"
        // })
    } catch (error) {
        // res.status(500).json({
        //     message:"Something Went Wrong!",
        //     err:error.message
        // })
    }
}
async function createCommunities(req,res) {
    const {name,description,tags}=req.body
    const creator_name=req.user_sending_data.username
    const comm_pic=req.file
    let pic;
    let pic_fileID;
    if (comm_pic) {
        const result = await uploadFile_comm(comm_pic.buffer.toString('base64'),name)
        pic=result.thumbnailUrl;
        pic_fileID=result.fileId
    }
    else{
        pic=process.env.DEFAULT_COMMUNITY_PIC;
        pic_fileID=process.env.DEFAULT_COMMUNITY_PIC_FILE_ID;
    }
    try {
        const community=await Pool.query("INSERT INTO communities (name, description,comm_pic,creator_name,fileid,creator_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING community_id",[name,description,pic,creator_name,pic_fileID,req.user_sending_data.id]);
        // const query=await Pool.query("UPDATE users SET created_communities = array_append(created_communities, $1) WHERE username = $2 AND NOT ($1 = ANY(created_communities))",[community.rows[0].community_id,creator_name]);
        const tag=tags.split(',').map(elm=>elm.toLowerCase().trim());
        const tag_query=await Pool.query("INSERT INTO tags (tag_name) SELECT * FROM unnest($1::text[]) ON CONFLICT (tag_name) DO UPDATE SET tag_name = EXCLUDED.tag_name RETURNING id;",[tag]);
        const tagIds = tag_query.rows.map(row => row.id);
        const community_tags=await Pool.query("INSERT INTO community_tags (community_id, tag_id) SELECT $1::uuid, unnest($2::uuid[]) ON CONFLICT DO NOTHING",[community.rows[0].community_id, tagIds]);
        const tagIDS_user_interest = await Pool.query("SELECT tag_id FROM community_tags WHERE community_id = $1;",[community.rows[0].community_id]);
        const user_update_interest_query = `
            INSERT INTO user_tag_interest (
                user_id,
                tag_id,
                interest_score,
                created_community_score,
                updated_at,
                last_interaction_at
            )
            SELECT $1, unnested_tag_id, $3, $3, NOW(), NOW()
            FROM UNNEST($2::uuid[]) AS unnested_tag_id
            ON CONFLICT (user_id, tag_id)
            DO UPDATE SET
                interest_score = user_tag_interest.interest_score + $3,
                created_community_score = user_tag_interest.created_community_score + $3,
                updated_at = NOW(),
                last_interaction_at = NOW();
        `;

        try {
            // Passes the array directly to the query, letting PostgreSQL unroll it
            await Pool.query(user_update_interest_query, [req.user_sending_data.id, tagIDS_user_interest.rows.map(row => row.tag_id), process.env.CREATED_COMMUNITY_INTERACTION_SCORE]);
            const join=await Pool.query("Update communities set members=(array_append(members,$1)) where name=$2 AND NOT ($1 = ANY(members)) returning community_id",[creator_name,name]);
                // console.log(join);
                if (join.rows.length!=0) {
                    // const query=await Pool.query("UPDATE users SET joined_communities = array_append(joined_communities, $1) WHERE username = $2 AND NOT ($1 = ANY(joined_communities))",[join.rows[0].community_id,username]);
                    const query=await Pool.query("Insert into user_joined_communities (user_id,community_id) values ($1,$2)",[req.user_sending_data.id,join.rows[0].community_id]);
                    const tag_ids=await Pool.query("SELECT tag_id FROM community_tags WHERE community_id = $1;",[join.rows[0].community_id])
                    const query_user_interest = `
                        INSERT INTO user_tag_interest (
                            user_id,
                            tag_id,
                            interest_score,
                            joined_community_score,
                            updated_at,
                            last_interaction_at
                        )
                        SELECT $1, unnested_tag_id, $3, $3, NOW(), NOW()
                        FROM UNNEST($2::uuid[]) AS unnested_tag_id
                        ON CONFLICT (user_id, tag_id)
                        DO UPDATE SET
                            interest_score = user_tag_interest.interest_score + $3,
                            joined_community_score = user_tag_interest.joined_community_score + $3,
                            updated_at = NOW(),
                            last_interaction_at = NOW();
                    `;
                    try {
                        await Pool.query(query_user_interest, [req.user_sending_data.id, tag_ids.rows.map(row => row.tag_id), process.env.JOINED_COMMUNITY_INTERACTION_SCORE]);
                        console.log(`Bulk community interest update complete for ${tag_ids.rows.length} tags.`);
                    } catch (error) {
                        console.error('Error in bulk community interest update:', error);
                        throw error;
                    }
                }
            console.log(`Bulk created-community update complete for ${tagIDS_user_interest.rows.length} tags.`);
        } catch (error) {
            console.error('Error in bulk created-community interest update:', error);
            throw error;
        }
        
        res.status(200).json({
            message:"Community Created Successfully!"
        });
    } catch (error) {
        res.status(500).json({
            err:error.message,
            message:"Something Went Wrong!"
        });        
    }
}

async function updateCommunities(req,res) {
    try {
        const {description}=req.body
        const comm_pic=req.file
        const name=req.params.communityName
        const user=req.user_sending_data.username
        const query=await Pool.query("Select name from communities where creator_name=$1",[user])
        const comm=query.rows.map(elm=>elm.name);
        if (!comm.includes(name)) {
            res.status(401).json({
                message: "Invalid credentials" 
            })
        }
        let updateFields = [];
        let queryParams = [];
        let count = 1;
        if (description !== undefined) {
            updateFields.push(`description = $${count++}`);
            queryParams.push(description);
        }

        // 2. Handle Image Upload
        if (comm_pic) {
            // Your upload function logic
            const uploadResult = await uploadFile_comm(comm_pic.buffer.toString('base64'), name);
            updateFields.push(`comm_pic = $${count++}`);
            queryParams.push(uploadResult.thumbnailUrl);
            const check=await Pool.query("Select fileid from communities where name=$1",[name]);
            const [{fileid}]=check.rows;
            if (fileid!==process.env.DEFAULT_COMMUNITY_PIC_FILE_ID) {
                const res=await deletePic(fileid);
            }
            updateFields.push(`fileid = $${count++}`);
            queryParams.push(uploadResult.fileId);
        }

        // 3. Handle Tags (Array of UUIDs)
        

        // If no data was provided at all
        if (updateFields.length === 0) {
            return res.status(400).json({ message: "No fields provided for update." });
        }

        // 4. Finalize and execute the query
        queryParams.push(name);
        const command = `UPDATE communities SET ${updateFields.join(', ')} WHERE name = $${count} RETURNING *`;

        const result = await Pool.query(command, queryParams);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Community not found." });
        }

        res.status(200).json({
            message: "Community updated successfully",
            // data: result.rows[0]
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    
}

// async function updateCommunities_1(req,res) {
//     // const user=await Pool.query("Select * from communities Where name=$1",[name])
//     // const specificData = result.rows[0].tags;
//     // const comm_pic=req.file
//     const {name,description,tags}=req.body
//     try {
//         const result = await Pool.query(
//             "SELECT * FROM communities WHERE name = $1", 
//             [name]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No community found with that name."
//             });
//         }
//         const tag=((result.rows[0].tags).toString()+','+tags).split(',');
//         const [{comm_pic}]=result.rows;
//         let comm_pics;
//         // const comm_pics=(req.file)?req.file:comm_pic;
//         if(req.file){
//             comm_pics=req.file;
            
//             const result = await uploadFile_comm(comm_pics.buffer.toString('base64'),name)
//             const update = await Pool.query(
//                 "Update communities set(description,comm_pic,tags)=($1,$2,$3) where name=$4", 
//                 [description,result.thumbnailUrl,tag,name]
//             );
//         }
//         else{
//             comm_pics=comm_pic;
//             const update = await Pool.query(
//                 "Update communities set(description,tags)=($1,$2) where name=$3", 
//                 [description,tag,name]
//             );
//         }
//         res.status(200).json({
//             message:"updated successfully"
//         })

//     } catch (error) {
//         res.status(500).json({
//             err:error.message,
//             success: false,
//             message: "Internal server error"
//         });
//     }
// }

async function addtag(req,res) {
    const name=req.params.communityName
    const user=req.user_sending_data.username
    const tag=req.params.addtag.toLowerCase().trim()
    try {
        // console.log(name);
        // console.log(user);
        
        const query=await Pool.query("Select name from communities where creator_name=$1",[user])
        const comm=query.rows.map(elm=>elm.name);
        if (!comm.includes(name)) {
            res.status(401).json({
                message: "Invalid credentials" 
            })
        }
        const comm_id=await Pool.query("select community_id from communities where name=$1",[name])
        const tagResult = await Pool.query("INSERT INTO tags (tag_name) VALUES ($1) ON CONFLICT (tag_name) DO UPDATE SET tag_name=EXCLUDED.tag_name RETURNING id",[tag]);
        const tagId = tagResult.rows[0].id;
        await Pool.query("INSERT INTO community_tags (community_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",[comm_id.rows[0].community_id, tagId]);
        res.status(200).json({
            message:"Added Successfully!"
        })
    } catch (error) {
        res.status(500).json({
            message:"Something Went Wrong!",
            err:error.message
        })
    }
}
async function removetag(req,res) {
    try {
        const name=req.params.communityName
        const user=req.user_sending_data.username
        const query=await Pool.query("Select name from communities where creator_name=$1",[user])
        const comm=query.rows.map(elm=>elm.name);
        if (!comm.includes(name)) {
            res.status(401).json({
                message: "Invalid credentials" 
            })
        }
        const tag=req.params.removetag
        const comm_id=await Pool.query("select community_id from communities where name=$1",[name])
        const tag_id=await Pool.query("select id from tags where tag_name=$1",[tag])
        const remove=await Pool.query("Delete from community_tags where community_id=$1 AND tag_id=$2",[comm_id.rows[0].community_id,tag_id.rows[0].id])
        res.status(200).json({
            message:"Removed Successfully!"
        })
    } catch (error) {
        res.status(500).json({
            message:"Something Went Wrong!",
            err:error.message
        })
    }
}

async function joinCommunities(req,res) {
    const {username}=req.user_sending_data
    const {communityName}=req.params
    try {
        const chk_comm=await Pool.query("Select * from communities where name=$1",[communityName]);
        if (!chk_comm.rows.length) {
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        
        // const join=await Pool.query("Update communities set members=(array_append(members,$1)) where name=$2 AND NOT ($1 = ANY(members)) returning community_id",[username,communityName]);
        // console.log(join);
        // if (join.rows.length!=0) {
            // const query=await Pool.query("UPDATE users SET joined_communities = array_append(joined_communities, $1) WHERE username = $2 AND NOT ($1 = ANY(joined_communities))",[join.rows[0].community_id,username]);
            const query=await Pool.query("Insert into user_joined_communities (user_id,community_id) values ($1,$2) ON CONFLICT DO NOTHING",[req.user_sending_data.id,chk_comm.rows[0].community_id]);
            const tag_ids=await Pool.query("SELECT tag_id FROM community_tags WHERE community_id = $1;",[chk_comm.rows[0].community_id])
            const query_user_interest = `
                INSERT INTO user_tag_interest (
                    user_id,
                    tag_id,
                    interest_score,
                    joined_community_score,
                    updated_at,
                    last_interaction_at
                )
                SELECT $1, unnested_tag_id, $3, $3, NOW(), NOW()
                FROM UNNEST($2::uuid[]) AS unnested_tag_id
                ON CONFLICT (user_id, tag_id)
                DO UPDATE SET
                    interest_score = user_tag_interest.interest_score + $3,
                    joined_community_score = user_tag_interest.joined_community_score + $3,
                    updated_at = NOW(),
                    last_interaction_at = NOW();
            `;
            try {
                await Pool.query(query_user_interest, [req.user_sending_data.id, tag_ids.rows.map(row => row.tag_id), process.env.JOINED_COMMUNITY_INTERACTION_SCORE]);
                console.log(`Bulk community interest update complete for ${tag_ids.rows.length} tags.`);
            } catch (error) {
                console.error('Error in bulk community interest update:', error);
                throw error;
            }
        // }
        res.status(200).json({
            message:"Joined Successfully!"
        })
    } catch (error) {
        res.status(500).json({
            message:"Something Went Wrong!",
            err:error.message
        })
    }
}

async function leaveCommunities(req,res) {
    const {username}=req.user_sending_data
    const {communityName}=req.params
    try {
        const chk_comm=await Pool.query("Select * from communities where name=$1",[communityName]);
        if (!chk_comm.rows.length) {
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        // const leave=await Pool.query("Update communities set members=(array_remove(members,$1)) where name=$2 AND ($1 = ANY(members)) returning community_id",[username,communityName]);
        // console.log(leave);
        // if (leave.rows.length!=0) {
            const query=await Pool.query("Delete from user_joined_communities where user_id=$1 and community_id=$2",[req.user_sending_data.id,chk_comm.rows[0].community_id]);
            // const query=await Pool.query("UPDATE users SET joined_communities = array_remove(joined_communities, $1) WHERE username = $2 AND ($1 = ANY(joined_communities))",[leave.rows[0].community_id,username]);
        // }
        // else{
        //     res.status(401).json({
        //         message:"Invalid Credentials"
        //     })
        // }
        res.status(200).json({
            message:"Left Successfully!"
        })
    } catch (error) {
        res.status(500).json({
            message:"Something Went Wrong!",
            err:error.message
        })
    }
}

async function getMessages(req,res) {
    try {
        const query=`SELECT
            message_id,
            community_id,
            sender_id,
            message,
            created_at,
            sender_name,
            sender_profile
        FROM community_messages
        WHERE community_id = $1
        ORDER BY message_id DESC
        LIMIT $2`;
        const data=await Pool.query(query,[req.params.communityName,process.env.MESSAGE_LIMIT]);
        res.status(200).json({
            data:data.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            message:"Something Went Wrong!",
            err:error.message
        })
    }
}

async function postMessage(req,res) {
    try {
        const profile=await Pool.query("Select profile_photo from users where username=$1",[req.user_sending_data.username]);
        const query=`INSERT INTO community_messages(
                community_id,
                sender_id,
                message,
                created_at,
                sender_name,
                sender_profile
            )
            VALUES($1,$2,$3,NOW(),$4,$5)
            RETURNING *`;
        const data=await Pool.query(query,[req.params.community_id,req.user_sending_data.id,req.body.message,req.user_sending_data.username,profile.rows[0].profile_photo]);
        res.status(200).json({
            data:data.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            message:"Something Went Wrong!",
            err:error.message
        })
    }
}

module.exports={createCommunities,updateCommunities,addtag,removetag,joinCommunities,leaveCommunities,
    // temp_comm,
    getMessages,postMessage}