const express=require("express")
const multer=require("multer")
const authController=require("../controllers/auth.controllers")
const communitiesController=require("../controllers/communities.controller")
const postsController=require("../controllers/post.controllers")
const authMiddleware=require("../middleware/auth.middleware")
const getFeedController=require("../controllers/feed")
const communityMessage=require("../controllers/communityMessageRoutes")
require('dotenv').config();
const router=express.Router()
const storage = multer.memoryStorage();
const upload=multer({storage:multer.memoryStorage()})

const ALLOWED_ADDONS_ON_POST=process.env.ALLOWED_ADDONS_ON_POST

router.post("/signup",authController.registerUser)
router.post("/login",authController.loginUser)
router.post("/logoutUser",authController.logoutUser)
router.put("/update/User",authMiddleware.auth_user,upload.single("profile_photo"),authController.updateUser)
// router.post("/temp",authController.temp)


router.post("/create/community",authMiddleware.auth_user,upload.single("comm_pic"),communitiesController.createCommunities)
router.put("/update/communities/:communityName",authMiddleware.auth_user,upload.single("comm_pic"),communitiesController.updateCommunities)
router.put("/update/communities/:communityName/add_tag/:addtag",authMiddleware.auth_user,communitiesController.addtag)
router.put("/update/communities/:communityName/remove_tag/:removetag",authMiddleware.auth_user,communitiesController.removetag)
router.put("/join/communities/:communityName",authMiddleware.auth_user,communitiesController.joinCommunities)
router.put("/leave/communities/:communityName",authMiddleware.auth_user,communitiesController.leaveCommunities)
// router.post("/temp/communities",authMiddleware.auth_user,communitiesController.temp_comm)
router.get("community/:community_id/messages",authMiddleware.auth_user,communitiesController.getMessages);
router.post("community/:community_id/messages",authMiddleware.auth_user,communitiesController.postMessage);

router.post("/create/post",authMiddleware.auth_user,upload.array("addons",ALLOWED_ADDONS_ON_POST),postsController.createPost)
router.put("/update/post/:post_id",authMiddleware.auth_user,postsController.updatePost)
router.put("/update/post/add_tag/:post_id",authMiddleware.auth_user,postsController.add_tags_to_post)
router.put("/update/post/remove_tag/:post_id",authMiddleware.auth_user,postsController.remove_tags_to_post)
router.put("/update/post/add_addons/:post_id",authMiddleware.auth_user,upload.array("addons",ALLOWED_ADDONS_ON_POST),postsController.add_addons)
router.put("/update/post/remove_addons/:post_id",authMiddleware.auth_user,upload.array("addons",ALLOWED_ADDONS_ON_POST),postsController.remove_addons)
router.delete("/delete/post/:post_id",authMiddleware.auth_user,postsController.deletePost)
// router.post("/temp/post",authMiddleware.auth_user,postsController.temp_posts)

// router.get("/get/post/:post_id",authMiddleware.auth_user,postsController.getPost)

router.put("/like/post",authMiddleware.auth_user,postsController.likePost)

router.get("/posts/:post_id/comments",authMiddleware.auth_user,postsController.getComments)
// getComments
router.post("/posts/comment",authMiddleware.auth_user,postsController.commentPost)
router.delete("/delete/comment/:comment_id",authMiddleware.auth_user,postsController.deleteComment)

router.get("/home",postsController.getPosts)
router.get("/chk_token",postsController.chkToken)
router.get("/user_info",postsController.userInfo)
router.get("/not_user_info/:not_user",postsController.notuserInfo)


router.get("/:communityId/messages",communityMessage.get_communityMessage)
router.post("/:communityId/message",authMiddleware.auth_user,communityMessage.send_communityMessage);
router.get("/:communityId/is-joined",authMiddleware.auth_user,communityMessage.chk_joined_status);
// router.get("/api/feed",authMiddleware.auth_user,getFeedController.getFeed)
// router.get("/home",postsController.randomPosts)

module.exports=router;