const Pool =require("../db/db");
const {upload,deletePic}=require("../services/storage.services");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// async function temp_posts(req,res) {
//     function generatePosts() {
//         // const categories = ['Tech', 'Gaming', 'Fitness', 'Food', 'Travel'];
//         const categories = ['Science', 'Music', 'Sports', 'Movies', 'Nature'];
//         // const categories = ['Business', 'Photography', 'Health', 'Education', 'Adventure'];
//         // const categories = [];
        
//         const postPool = {
//             'Science': [
//                 {
//                     title: 'Scientists are exploring energy from ocean waves',
//                     content: 'Researchers around the world are investing heavily in wave energy technology because oceans provide a nearly constant source of motion. Unlike solar panels that depend on sunlight or wind turbines that require strong winds, ocean waves continue moving day and night. Engineers are developing floating systems capable of converting wave movement into electricity that could power entire coastal cities in the future.'
//                 },
//                 {
//                     title: 'Why Mars missions are becoming more realistic',
//                     content: 'Space agencies and private companies are making rapid progress toward human missions to Mars. New spacecraft designs, reusable rocket systems, and advancements in life-support technology are reducing costs and increasing reliability. Scientists believe that understanding Mars could also reveal important information about the future of Earth’s climate and planetary evolution.'
//                 },
//                 {
//                     title: 'The hidden science behind black holes',
//                     content: 'Black holes remain one of the most mysterious objects in the universe. Their gravitational pull is so strong that even light cannot escape once it crosses the event horizon. Recent telescope observations have allowed scientists to capture the first direct images of black holes, helping researchers better understand space-time and gravity.'
//                 },
//                 {
//                     title: 'How artificial organs may transform healthcare',
//                     content: 'Medical researchers are developing artificial organs using advanced biomaterials and 3D printing technology. These innovations could eventually solve organ shortage problems and dramatically improve survival rates for patients waiting for transplants.'
//                 },
//                 {
//                     title: 'The race to build quantum computers',
//                     content: 'Quantum computing could solve problems that traditional computers would take thousands of years to process. Unlike normal computers that use binary bits, quantum systems use qubits that can exist in multiple states simultaneously. This technology may revolutionize medicine, encryption, and scientific simulations.'
//                 }
//             ],

//             'Music': [
//                 {
//                     title: 'Why live concerts feel emotionally powerful',
//                     content: 'Music festivals and concerts create emotional experiences that recordings often cannot replicate. The combination of crowd energy, loud sound systems, and shared excitement activates strong emotional responses that make live performances memorable.'
//                 },
//                 {
//                     title: 'The return of classic instruments in modern songs',
//                     content: 'Many modern producers are reintroducing pianos, violins, and analog synthesizers into digital music production. This blend of old and new technology creates richer sound textures that listeners often describe as more authentic.'
//                 },
//                 {
//                     title: 'How streaming platforms changed the music industry',
//                     content: 'Streaming services completely transformed how people discover and consume music. Independent artists now have direct access to global audiences without relying entirely on record labels, allowing niche genres to grow rapidly online.'
//                 },
//                 {
//                     title: 'The psychology behind catchy songs',
//                     content: 'Catchy melodies often use repetition, predictable rhythm patterns, and emotional chord progressions that make them easy for the brain to remember. Scientists continue studying why certain songs stay in people’s heads for days.'
//                 },
//                 {
//                     title: 'Why lo-fi music became so popular',
//                     content: 'Lo-fi music gained popularity because of its relaxing atmosphere and simple repetitive beats. Many students and professionals use it as background music while studying or working because it improves focus without becoming distracting.'
//                 }
//             ],

//             'Sports': [
//                 {
//                     title: 'Why data analytics is changing sports forever',
//                     content: 'Modern sports teams now rely heavily on data analytics to improve player performance and strategy. Coaches analyze movement patterns, recovery times, and game statistics to make smarter decisions during competitions.'
//                 },
//                 {
//                     title: 'The science of athlete recovery',
//                     content: 'Elite athletes spend enormous amounts of time recovering between training sessions. Ice baths, sleep optimization, stretching routines, and nutrition planning all play major roles in improving long-term performance.'
//                 },
//                 {
//                     title: 'How stadium technology is improving fan experiences',
//                     content: 'Modern sports arenas are introducing advanced displays, AI-assisted crowd management, and immersive sound systems that make live matches more interactive and enjoyable for fans.'
//                 },
//                 {
//                     title: 'Why endurance sports are becoming more popular',
//                     content: 'Marathons, cycling races, and triathlons continue attracting millions of participants because people increasingly view endurance sports as personal challenges rather than just competitions.'
//                 },
//                 {
//                     title: 'The growing impact of esports on traditional sports',
//                     content: 'Traditional sports organizations are investing in esports teams because gaming audiences are rapidly growing worldwide. Some clubs now operate both physical sports divisions and competitive gaming organizations.'
//                 }
//             ],

//             'Movies': [
//                 {
//                     title: 'Why practical effects still matter in cinema',
//                     content: 'Even with modern CGI technology, many filmmakers continue using practical effects because they often look more realistic on screen. Physical explosions, real costumes, and detailed set designs help actors deliver more convincing performances.'
//                 },
//                 {
//                     title: 'How streaming platforms changed filmmaking',
//                     content: 'Streaming services created new opportunities for filmmakers by funding experimental projects that traditional studios might consider too risky. This shift has increased the diversity of storytelling styles worldwide.'
//                 },
//                 {
//                     title: 'The rise of cinematic universes',
//                     content: 'Shared movie universes became extremely successful because audiences enjoy interconnected stories and recurring characters. Studios now carefully plan years of future releases to maintain long-term fan engagement.'
//                 },
//                 {
//                     title: 'Why animated movies appeal to all ages',
//                     content: 'Animated films often combine humor, emotional storytelling, and visual creativity in ways that connect with both children and adults. Many animated movies also explore surprisingly mature themes.'
//                 },
//                 {
//                     title: 'The future of immersive movie experiences',
//                     content: 'Virtual reality and interactive storytelling may redefine cinema in the future. Some filmmakers are experimenting with technology that allows audiences to influence scenes or explore movie environments directly.'
//                 }
//             ],

//             'Nature': [
//                 {
//                     title: 'Why rainforests are vital for Earth',
//                     content: 'Rainforests produce enormous amounts of oxygen and support millions of species. Scientists consider them one of the most important ecosystems for maintaining global climate stability.'
//                 },
//                 {
//                     title: 'The beauty of bioluminescent beaches',
//                     content: 'Certain beaches glow at night because of microscopic marine organisms called phytoplankton. These organisms emit blue light when disturbed by waves, creating stunning natural displays.'
//                 },
//                 {
//                     title: 'How wildlife adapts to extreme climates',
//                     content: 'Animals living in deserts, polar regions, and deep oceans have evolved unique survival strategies that allow them to thrive in conditions humans would find nearly impossible.'
//                 },
//                 {
//                     title: 'The growing importance of conservation efforts',
//                     content: 'Environmental conservation projects are becoming increasingly important as deforestation, pollution, and climate change threaten ecosystems around the world.'
//                 },
//                 {
//                     title: 'Why mountains attract adventure travelers',
//                     content: 'Mountain landscapes provide breathtaking scenery, physical challenges, and a sense of isolation that many travelers find deeply refreshing compared to crowded urban environments.'
//                 }
//             ]
            
//         };

//         // Updated highly reliable public mp4 streams
//         const publicVideos = [
//             'https://vjs.zencdn.net/v/oceans.mp4',
//             'https://avtshare01.rz.tu-ilmenau.de/avt-vqdb-uhd-1/test_1/segments/bigbuck_bunny_8bit_200kbps_360p_60.0fps_vp9.mkv',
//             'https://avtshare01.rz.tu-ilmenau.de/avt-vqdb-uhd-1/test_1/segments/cutting_orange_tuil_2000kbps_1080p_59.94fps_vp9.mkv',
//             'https://avtshare01.rz.tu-ilmenau.de/avt-vqdb-uhd-1/test_1/segments/vegetables_tuil_200kbps_360p_59.94fps_vp9.mkv',
//             'https://avtshare01.rz.tu-ilmenau.de/avt-vqdb-uhd-1/test_1/segments/water_netflix_200kbps_360p_59.94fps_vp9.mkv',
//             'https://avtshare01.rz.tu-ilmenau.de/avt-vqdb-uhd-1/test_2/segments/Dancers_8s_387kbps_720p_60.0fps_h264.mp4'
//         ];

//         const posts = {};

//         for (let i = 1; i <= 3; i++) {
//             const category = categories[Math.floor(Math.random() * categories.length)];
//             const templatePool = postPool[category];
//             const template = templatePool[Math.floor(Math.random() * templatePool.length)];

//             const tags = [category.toLowerCase(), 'trending','viral'];

//             // 1. Initialize addons as an empty array [] by default
//             let addons = [];

//             // 2. Decide media mix: 0 = none, 1 = just images, 2 = just videos, 3 = both mix
//             const mediaMixChoice = Math.floor(Math.random() * 4);

//             if (mediaMixChoice === 1 || mediaMixChoice === 3) {
//                 // Add 1 to 3 random image URLs directly into the array
//                 const imgCount = Math.floor(Math.random() * 3) + 1;
//                 for (let j = 0; j < imgCount; j++) {
//                     const randomImgId = Math.floor(Math.random() * 100) + (i * 2);
//                     addons.push(`https://picsum.photos/id/${randomImgId}/800/600`);
//                 }
//             }

//             if (mediaMixChoice === 2 || mediaMixChoice === 3) {
//                 // Add 1 to 2 random video URLs directly into the array
//                 const vidCount = Math.floor(Math.random() * 2) + 1;
//                 for (let k = 0; k < vidCount; k++) {
//                     addons.push(publicVideos[(i + k) % publicVideos.length]);
//                 }
//             }

//             // Construct final post structure
//             posts[`post_${i}`] = {
//                 title: template.title,
//                 content: template.content,
//                 tags: tags,
//                 addons: addons // Flat array of strings (urls) or empty []
//             };
//         }

//         return posts;
//     }

//     // Generate and log the posts object
//     const postDatabase = generatePosts();
//     console.log(postDatabase);
//     for (const key in postDatabase) {
//         const { title, content, tags, addons } = postDatabase[key];
//         let result=[];
//         let fileIDS=[];
//         result=await upload(addons,req.user_sending_data.username)
//         fileIDS=result.map(elm=>elm.fileId);
//         result=result.map(elm=>elm.url);
//         const post=await Pool.query("Insert into posts(title,content,addons,creator_name,fileids,creator_id) values($1,$2,$3,$4,$5,$6) returning post_id",[title,content,result,req.user_sending_data.username,fileIDS,req.user_sending_data.id]);
//         const tag_query=await Pool.query("INSERT INTO tags (tag_name) SELECT * FROM unnest($1::text[]) ON CONFLICT (tag_name) DO UPDATE SET tag_name = EXCLUDED.tag_name RETURNING id;",[tags]);
//         const tagIds = tag_query.rows.map(row => row.id);
//         const post_tags=await Pool.query("INSERT INTO post_tags (post_id, tag_id) SELECT $1::uuid, unnest($2::uuid[]) ON CONFLICT DO NOTHING",[post.rows[0].post_id, tagIds]);
//         const tag_ids=await Pool.query("SELECT tag_id FROM post_tags WHERE post_id = $1;",[post.rows[0].post_id])
//         const update_interest_query = `
//             INSERT INTO user_tag_interest (
//                 user_id,
//                 tag_id,
//                 interest_score,
//                 created_post_score,
//                 updated_at,
//                 last_interaction_at
//             )
//             SELECT $1, unnested_tag_id, $3, $3, NOW(), NOW()
//             FROM UNNEST($2::uuid[]) AS unnested_tag_id
//             ON CONFLICT (user_id, tag_id)
//             DO UPDATE SET
//                 interest_score = user_tag_interest.interest_score + $3,
//                 created_post_score = user_tag_interest.created_post_score + $3,
//                 updated_at = NOW(),
//                 last_interaction_at = NOW();
//         `;

//         try {
//             await Pool.query(update_interest_query, [req.user_sending_data.id, tag_ids.rows.map(row => row.tag_id), process.env.CREATED_POST_INTERACTION_SCORE]);
//             console.log(`Bulk post interest update complete for ${tag_ids.rows.length} tags.`);
//         } catch (error) {
//             console.error('Error in bulk post interest update:', error);
//             throw error;
//         }
//     }
//     res.status(200).json({
//         message:"Posts Created Successfully!"
//     })
// }

async function createPost(req,res) {
    const{title,content}=req.body
    const tags=req.body.tags.slice(1,-1);
    const addons=req.files
    const creator_name=req.user_sending_data.username
    try {
        if(!title||!content){
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        let result=[];
        let fileIDS=[];
        if (addons.length<11 && addons.length>0) {
            result=await upload(addons,creator_name)
            fileIDS=result.map(elm=>elm.fileId);
            result=result.map(elm=>elm.url);
        }
        else if (addons.length>10) {
            res.status(401).json({
                message:"Maximum 10 addons allowed"
            });
        }
        const post=await Pool.query("Insert into posts(title,content,addons,creator_name,fileids,creator_id) values($1,$2,$3,$4,$5,$6) returning post_id",[title,content,result,creator_name,fileIDS,req.user_sending_data.id]);
        const tag=tags.split(', ').map(elm=>elm.toLowerCase().trim());
        const tag_query=await Pool.query("INSERT INTO tags (tag_name) SELECT * FROM unnest($1::text[]) ON CONFLICT (tag_name) DO UPDATE SET tag_name = EXCLUDED.tag_name RETURNING id;",[tag]);
        const tagIds = tag_query.rows.map(row => row.id);
        const post_tags=await Pool.query("INSERT INTO post_tags (post_id, tag_id) SELECT $1::uuid, unnest($2::uuid[]) ON CONFLICT DO NOTHING",[post.rows[0].post_id, tagIds]);
        const tag_ids=await Pool.query("SELECT tag_id FROM post_tags WHERE post_id = $1;",[post.rows[0].post_id])
        const update_interest_query = `
            INSERT INTO user_tag_interest (
                user_id,
                tag_id,
                interest_score,
                created_post_score,
                updated_at,
                last_interaction_at
            )
            SELECT $1, unnested_tag_id, $3, $3, NOW(), NOW()
            FROM UNNEST($2::uuid[]) AS unnested_tag_id
            ON CONFLICT (user_id, tag_id)
            DO UPDATE SET
                interest_score = user_tag_interest.interest_score + $3,
                created_post_score = user_tag_interest.created_post_score + $3,
                updated_at = NOW(),
                last_interaction_at = NOW();
        `;

        try {
            await Pool.query(update_interest_query, [req.user_sending_data.id, tag_ids.rows.map(row => row.tag_id), process.env.CREATED_POST_INTERACTION_SCORE]);
            console.log(`Bulk post interest update complete for ${tag_ids.rows.length} tags.`);
        } catch (error) {
            console.error('Error in bulk post interest update:', error);
            throw error;
        }
        res.status(200).json({
            message:"Post Created Successfully!",
            // post:post.rows
        })
        
    } catch (error) {
         res.status(500).json({
            err:error.message,
            message:"Something Went Wrong!"
        }); 
    }
}

async function updatePost(req,res) {
    const {post_id}=req.params
    const {title,content}=req.body
    // const {addons}=req.files
    try {
        if(!title||!content){
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        const user=await Pool.query("Select creator_name from posts where post_id=$1",[post_id]);
        if (user.rows[0].creator_name!==req.user_sending_data.username) {
            res.status(401).json({

                message:"Invalid Credentials"
            })
        }
        const chk_post=await Pool.query("Select post_id from posts where post_id=$1",[post_id]);
        if (!chk_post.rows.length) {
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        const post=await Pool.query("Update posts set title=$1,content=$2 where post_id=$3 returning post_id",[title,content,post_id]);
        res.status(200).json({
            message:"Post Updated Successfully!",
            // post:post.rows
        })
    } catch (error) {
        res.status(500).json({
            err:error.message,
            message:"Something Went Wrong!"
        });
    }
}

async function add_addons(req,res) {
    const {post_id}=req.params
    const addons=req.files
    const ALLOWED_ADDONS_ON_POST=process.env.ALLOWED_ADDONS_ON_POST
    try {
        const user=await Pool.query("Select creator_name,addons from posts where post_id=$1",[post_id]);
        if (user.rows[0].creator_name!==req.user_sending_data.username) {
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        // const post=await Pool.query("Select addons from posts where post_id=$1",[post_id]);
        // console.log(post.rows[0].addons);
        if (!user.rows.length) {
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        const remaining_added_addons=ALLOWED_ADDONS_ON_POST-user.rows[0].addons.length;
        if (remaining_added_addons<addons.length) {
            res.status(401).json({
                message:`Maximum ${remaining_added_addons} addons allowed`
            })
        }
        let result=await upload(addons,req.user_sending_data.username)
        let fileids=result.map(elm=>elm.fileId);
        result=result.map(elm=>elm.url);
        // console.log(fileids);
        // console.log(result);
        const post_addons=await Pool.query("Update posts set addons=addons||$1,fileids=fileids||$2 where post_id=$3 returning post_id",[result,fileids,post_id]);
        res.status(200).json({
            message:"Addons Added Successfully!"
        })
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            err:error.message,
            message:"Something Went Wrong!"
        })
    }
}

async function remove_addons(req,res) {


    const {post_id}=req.params
    const {addons}=req.body
    try {
        const user=await Pool.query("Select creator_name,addons,fileids from posts where post_id=$1",[post_id]);
        if (user.rows[0].creator_name!==req.user_sending_data.username) {
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        let user_addons=user.rows[0].addons;
        const post=user_addons;
        if (!post.length) {
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        let temp_addons=addons.split(',');
        let fileids=[];
        try {
            temp_addons.map(elm=>{
                const idx=user_addons.indexOf(elm);
                if(idx==-1){
                    throw new Error("Invalid Credentials")
                }
            })
            temp_addons.map(elm=>{
                const idx=user_addons.indexOf(elm);
                if (idx>-1) {
                    user_addons.splice(idx,1);
                    fileids.push(user.rows[0].fileids[idx]);
                    const result=deletePic(user.rows[0].fileids[idx]);
                }
            })
        } catch (error) {
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        // if (!temp_addons.every(elm=>user_addons.includes(elm))) {
        //     res.status(401).json({
                
        //         message:"Invalid Credentials"
        //     })
        // }
        const post_addons=await Pool.query("Update posts set addons=ARRAY(select x from unnest(addons) x where x <> ALL($1)),fileids=ARRAY(select x from unnest(fileids ) x where x <> ALL($2)) where post_id=$3 returning post_id",[temp_addons,fileids,post_id]);
        // const post_addons=await Pool.query("Update posts set addons=(array_remove(addons,$1)),fileids=(array_remove(fileids,$2)) where post_id=$3 returning post_id",[temp_addons,fileids,post_id]);
        // const post_addons=await Pool.query("Update posts set addons=(array_remove(addons,$1)) where post_id=$2 returning post_id",[addons,post_id]);
        res.status(200).json({
            message:"Addons Removed Successfully!"
        })
    } catch (error) {
        res.status(500).json({
            err:error.message,
            message:"Something Went Wrong!"
        })
    }
}

async function add_tags_to_post(req,res) {
    const {post_id}=req.params
    const {tags}=req.body
    try {
        const user=await Pool.query("Select creator_name from posts where post_id=$1",[post_id]);
        if (user.rows[0].creator_name!==req.user_sending_data.username) {
            res.status(401).json({
                name:user.rows[0].creator_name,
                username:req.user_sending_data.username,
                message:"Invalid Credentials"
            })
        }
        const post=await Pool.query("Select post_id from posts where post_id=$1",[post_id]);
        if (!post.rows.length) {
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        const tag=tags.split(',').map(elm=>elm.toLowerCase().trim());
        const tag_query=await Pool.query("INSERT INTO tags (tag_name) SELECT * FROM unnest($1::text[]) ON CONFLICT (tag_name) DO UPDATE SET tag_name = EXCLUDED.tag_name RETURNING id;",[tag]);
        const tagIds = tag_query.rows.map(row => row.id);
        const post_tags=await Pool.query("INSERT INTO post_tags (post_id, tag_id) SELECT $1::uuid, unnest($2::uuid[]) ON CONFLICT DO NOTHING",[post_id, tagIds]);
        res.status(200).json({
            message:"Tags Added Successfully!"
        })
    } catch (error) {
        res.status(500).json({
            err:error.message,
            message:"Something Went Wrong!"
        });
    }
}

async function remove_tags_to_post(req,res) {
    const {post_id}=req.params
    const {tags}=req.body
    try {
        const user=await Pool.query("Select creator_name from posts where post_id=$1",[post_id]);
        if (user.rows[0].creator_name!==req.user_sending_data.username) {
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        const post=await Pool.query("Select post_id from posts where post_id=$1",[post_id]);
        if (!post.rows.length) {
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        // const tag_query=await Pool.query("INSERT INTO tags (tag_name) SELECT * FROM unnest($1::text[]) ON CONFLICT (tag_name) DO UPDATE SET tag_name = EXCLUDED.tag_name RETURNING id;",[tag]);
        const tag=tags.split(',').map(elm=>elm.toLowerCase().trim());
        const tag_query=await Pool.query("SELECT id FROM tags WHERE tag_name = ANY($1::text[]);",[tag]);
        const tagIds = tag_query.rows.map(row => row.id);
        const post_tags=await Pool.query("DELETE FROM post_tags WHERE post_id = $1 AND NOT (tag_id = ANY($2::uuid[]));",[post_id, tagIds]);
        res.status(200).json({
            message:"Tags Removed Successfully!"
        })

    } catch (error) {
        res.status(500).json({
            err:error.message,
            message:"Something Went Wrong!"
        });
    }
}

async function deletePost(req,res) {
    const {post_id}=req.params
    const {username}=req.user_sending_data

    try {
        const post=await Pool.query("Select post_id,creator_name from posts where post_id=$1",[post_id]);
        if (!post.rows.length || post.rows[0].creator_name!==username) {
            console.log(post);
            
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        const delete_post=await Pool.query("Delete from posts where post_id=$1",[post_id]);
        // const user=await
        // const user=await Pool.query("Update users set post_ids=(array_remove(post_ids,$1)) where username=$2 returning username",[post_id,username]);
        res.status(200).json({
            message:"Post Deleted Successfully!"
        })
    } catch (error) {
        res.status(500).json({
            err:error.message,
            message:"Something Went Wrong!"
        });
    }
}

async function getPost(req,res) {
    // const {post_id}=req.params
    // try {
    //     const post=await Pool.query("Select * from posts where post_id=$1",[post_id]);
    //     if (!post.rows.length) {
    //         res.status(401).json({
    //             message:"Invalid Credentials"
    //         })
    //     }
    //     res.status(200).json({
    //         post:post.rows[0]
    //     })
    // } catch (error) {
    //     res.status(500).json({
    //         err:error.message,
    //         message:"Something Went Wrong!"
    //     });
    // }
}

// async function getPosts(req,res) {
//     // const {username}=req.user_sending_data
//     // const {limit,offset}=req.query
//     // try {
//     //     const posts=await Pool.query("Select * from posts where creator_name=$1 limit $2 offset $3",[username,limit,offset]);
//     //     res.status(200).json({
//     //         posts:posts.rows
//     //     })
//     // } catch (error) {
//     //     res.status(500).json({
//     //         err:error.message,
//     //         message:"Something Went Wrong!"
//     //     });
//     // }
// }

async function likePost(req,res) {
    const {post_id}=req.body
    const {username}=req.user_sending_data
    // const {like}=req.body
    try {
        const post=await Pool.query("Select post_id from posts where post_id=$1",[post_id]);
        if (!post.rows.length) {
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        const user=await Pool.query("Select exists(select 1 from user_liked_posts where user_id=$1 and post_id=$2)",[req.user_sending_data.id,post_id]);
        
        if (!user.rows[0].exists) {
            const like_post=await Pool.query("Update posts set likes=likes+1 where post_id=$1 returning *",[post_id]);
            const like_user=await Pool.query("Insert into user_liked_posts (user_id,post_id) values ($1,$2)",[req.user_sending_data.id,post_id]);
            const get_tags=await Pool.query("SELECT tag_id FROM post_tags WHERE post_id = $1;",[post_id]);
            const query = `
                INSERT INTO user_tag_interest (
                    user_id, tag_id, interest_score, like_score, updated_at, last_interaction_at
                )
                SELECT $1, unnested_tag_id, $3, $3, NOW(), NOW()
                FROM UNNEST($2::uuid[]) AS unnested_tag_id
                ON CONFLICT (user_id, tag_id)
                DO UPDATE SET
                    interest_score = user_tag_interest.interest_score + $3,
                    like_score = user_tag_interest.like_score + $3,
                    updated_at = NOW(),
                    last_interaction_at = NOW();
            `;
            try {
                await Pool.query(query, [req.user_sending_data.id, get_tags.rows.map(row => row.tag_id), process.env.LIKE_INTERACTION_SCORE]);
                console.log(`Bulk update complete for ${get_tags.rows.length} tags.`);
            } catch (error) {
                console.error('Error in bulk update:', error);
                throw error;
            }
            res.status(200).json({
                message:"Post Liked Successfully!"
            })
            // const post_engagement=await Pool.query("UPDATE post_engagement SET engagement_score = ($1 * 2) + ($2 * 3), updated_at = NOW() WHERE post_id = $3;",[like_post.rows[0].likes,like_post.rows[0].comment_count,post_id]);
            const calculatedScore = (like_post.rows[0].likes * 2) + (like_post.rows[0].comment_count * 3);
            const post_engagement=await Pool.query(`INSERT INTO post_engagement (post_id, engagement_score, updated_at)
            VALUES ($1, $2, NOW()) 
            ON CONFLICT (post_id) 
            DO UPDATE SET 
                engagement_score = EXCLUDED.engagement_score,
                updated_at = NOW();
            `,[post_id,calculatedScore]);
        }
        else {
            const like_post=await Pool.query("Update posts set likes=likes-1 where post_id=$1",[post_id]);
            const like_user=await Pool.query("Delete from user_liked_posts where user_id=$1 and post_id=$2",[req.user_sending_data.id,post_id]);
            res.status(200).json({
                message:"Post UnLiked Successfully!"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            err:error.message,
            message:"Something Went Wrong!"
        });
    }
}

async function commentPost(req,res) {
    const {post_id}=req.body
    const {username}=req.user_sending_data
    const {comment}=req.body
    try {
        const post=await Pool.query("Select post_id from posts where post_id=$1",[post_id]);
        if (!post.rows.length) {
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        if (!comment) {
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        // const user= await Pool.query("Select Profile_photo")
        const comment_post=await Pool.query("Insert into comments (content,writer_name,post_id) values($1,$2,$3)",[comment,username,post_id]);
        const comm_count=await Pool.query("Update posts set comment_count=comment_count+1 where post_id=$1 returning *",[post_id]);
        // const update_post_engagement=await Pool.query("UPDATE post_engagement SET engagement_score = ($1 * 2) + ($2 * 3), updated_at = NOW() WHERE post_id = $3;",[comm_count.rows[0].likes,comm_count.rows[0].comment_count,post_id]);
        // const comment_post=await Pool.query("Update posts set comments=ARRAY_APPEND(comments,$1) where post_id=$2",[comment,post_id]);
        const calculatedScore = (comm_count.rows[0].likes * 2) + (comm_count.rows[0].comment_count * 3);
        const post_engagement=await Pool.query(`INSERT INTO post_engagement (post_id, engagement_score, updated_at)
        VALUES ($1, $2, NOW()) 
        ON CONFLICT (post_id) 
        DO UPDATE SET 
            engagement_score = EXCLUDED.engagement_score,
            updated_at = NOW();
        `,[post_id,calculatedScore]);
        
        let query=`
            SELECT comments.*, users.profile_photo
            FROM comments 
            JOIN users ON comments.writer_name = users.username
            where post_id=$1;`;
        const comments_on_post=await Pool.query(query,[post_id]);
        res.status(200).json({
            data:comments_on_post.rows
        })
    } catch (error) {
        res.status(500).json({
            err:error.message,
            message:"Something Went Wrong!"
        });
    }
}

async function getComments(req,res) {
    const {post_id}=req.params
    try {
        let query=`
            SELECT comments.*, users.profile_photo
            FROM comments 
            JOIN users ON comments.writer_name = users.username
            where post_id=$1;`;
        const comments=await Pool.query(query,[post_id]);
        // console.log("hello --> ",comments);
        // console.log("pello --> ",comments.rows);
        res.status(200).json({
            data:comments.rows
        })   
    }catch (error) {
        res.status(500).json({
            err:error.message,
            message:"Something Went Wrong!"
        });
    }
}

async function deleteComment(req,res) {
    const {comment_id}=req.params
    const {username}=req.user_sending_data
    try {
        const comment=await Pool.query("Select id from comments where id=$1 and writer_name=$2",[comment_id,username]);
        if (!comment.rows.length) {
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        const delete_comment=await Pool.query("Delete from comments where id=$1 and writer_name=$2 returning post_id",[comment_id,username]);
        const comm_count=await Pool.query("Update posts set comment_count=comment_count-1 where post_id=$1",[delete_comment.rows[0].post_id]);
        res.status(200).json({
            message:"Comment Deleted Successfully!"
        })
    } catch (error) {
        res.status(500).json({
            err:error.message,
            message:"Something Went Wrong!"
        });
    }
}

async function getPosts(req,res) {
    // console.log(token);
    try {
        
            const token = req.cookies.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user_sending_data=decoded
            const user=await Pool.query("Select username,profile_photo from users where user_id=$1",[req.user_sending_data.id]);
            res.status(200).json({
                // token:token,
                user:user.rows[0]
            })
    } catch (error) {
        res.status(500).json({
            err:error.message,
            message:"Something Went Wrong!"
        });
    }
}


async function chkToken(req, res) {
    try{
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        res.status(200).json({
            message:"Authorized"
        })
    }catch{
        res.status(401).json({
            message:"Unauthorized"
        })
    }
}

async function userInfo(req,res) {
    try {
        // console.log("jhsdkj asdj");
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user_sending_data=decoded
        const user=await Pool.query("Select * from users where user_id=$1",[req.user_sending_data.id]);
        const no_of_posts=await Pool.query("Select count(*) from posts where creator_id=$1",[req.user_sending_data.id]);
        const no_of_join_comm=await Pool.query("Select count(*) from user_joined_communities where user_id=$1",[req.user_sending_data.id]);
        const no_of_created_comm=await Pool.query("Select count(*) from communities where creator_id=$1",[req.user_sending_data.id]);
        res.status(200).json({
            user:user.rows[0],
            no_of_posts:no_of_posts.rows[0].count,
            no_of_join_comm:no_of_join_comm.rows[0].count,
            no_of_created_comm:no_of_created_comm.rows[0].count
        })
    } catch (error) {
        res.status(500).json({
            err:error.message,
            message:"Something Went Wrong!"
        });
    }
}
async function notuserInfo(req,res) {
    try {
        // console.log("jhsdkj asdj");
        // const token = req.cookies.token;
        // const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // req.user_sending_data=decoded
        const username=req.params.not_user
        const user_id=await Pool.query("Select * from users where username=$1",[username]);
        // const user=await Pool.query("Select * from users where username=$1",[user_id.rows[0].user_id]);
        const no_of_posts=await Pool.query("Select count(*) from posts where creator_id=$1",[user_id.rows[0].user_id]);
        const no_of_join_comm=await Pool.query("Select count(*) from user_joined_communities where user_id=$1",[user_id.rows[0].user_id]);
        const no_of_created_comm=await Pool.query("Select count(*) from communities where creator_id=$1",[user_id.rows[0].user_id]);
        res.status(200).json({
            user:user_id.rows[0],
            no_of_posts:no_of_posts.rows[0].count,
            no_of_join_comm:no_of_join_comm.rows[0].count,
            no_of_created_comm:no_of_created_comm.rows[0].count
        })
    } catch (error) {
        res.status(500).json({
            err:error.message,
            message:"Something Went Wrong!"
        });
    }
}

module.exports={createPost,updatePost,add_tags_to_post,
                remove_tags_to_post,add_addons,remove_addons,
                deletePost,getPost,likePost,commentPost,deleteComment,
                // temp_posts,
                getPosts,chkToken,userInfo,getComments,notuserInfo
                };