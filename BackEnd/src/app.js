const express=require("express");
const cookieParser = require('cookie-parser');
const authRoutes=require("./routes/auth.routes")
const cors=require("cors")
const feedRoutes = require('./controllers/feed');
const feed_trending_Routes = require('./controllers/feed_trending');
const feed_global_Routes = require('./controllers/feed_global');
const community_table_Routes = require('./controllers/communities_table');
const join_community_table_Routes = require('./controllers/join_community_table_Routes');
const profile_post = require('./controllers/profile_post');


const app=express();

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Your exact React app URL (Do NOT use '*')
  credentials: true                // Allows the backend to receive the cookie
}));
app.use("/u",authRoutes);

app.use("/api/feed", feedRoutes);
app.use("/api/feed/trending", feed_trending_Routes);
app.use("/api/feed/global", feed_global_Routes);
app.use("/api/communities", community_table_Routes);
app.use("/api/joinedcommunities", join_community_table_Routes);
app.use("/api/profile/post",profile_post);
// http://localhost:3000/api/feed/trending
module.exports=app;