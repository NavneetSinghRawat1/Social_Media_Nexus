// import api from './api';
import axios from "axios";
import api from "../api";
export const postService = {
  // POST Request (User Login)
  get_post: () => {
    // console.log("Fetching posts from backend...");
    return api.get('/home');
  },
  chk_token:()=>{
    return api.get('/chk_token');
  },
  user_info: ()=>{
    return api.get('/user_info');
  },
  not_user_info: (notUser)=>{
    return api.get(`/not_user_info/${notUser}`);
  },
  user_update: (userData) => {
    return api.put('/update/User', userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  create_post: (postData) => {
    return api.post('/create/post', postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  create_community: (communityData)=>{
    return api.post('/create/community', communityData);
  },
  like_post:(userdata)=>{
    return api.put('/like/post',userdata);
  },
  getCommunityMessages : async (communityId) => {

      const response = await api.get(
          `/community/${communityId}/messages`
      );

      return response.data;
  },
  sendCommunityMessage : async (
      communityId,
      message
  ) => {

      const response = await api.post(
          `/community/${communityId}/message`,
          { message }
      );

      return response.data;
  },
  get_comments : async (post_id) => {
  const res = await api.get(
    `/posts/${post_id}/comments`
  );

  return res.data;
},

add_comment: async (formData) => {
  const res = await api.post(
    `/posts/comment`,
    formData
  );
  // console.log("res --> ",res);
  // console.log("res.data --> ",res.data);
  return res.data;
},

getMessages:async(communityId)=>{

    const res = await api.get(
        `/${communityId}/messages`
    );
    // console.log("res of get --> ",res);
    return res;
  },
isJoined:async(communityId)=>{
    // console.log("i am here mr.");
    const res = await api.get(
        `${communityId}/is-joined`,
        // {
          //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // }
          );
          
    // console.log("res of isjoined --> ",res);
    return res;
},
sendMessage:async(communityId, message)=>{

    const res = await api.post(
        `/${communityId}/message`,
        { message },
        // {
        //     headers: {
        //         Authorization: `Bearer ${token}`
        //     }
        // }
    );

    return res.data;
},

joinCommunity:async(communityname)=>{

        const res = await api.put(
          `join/communities/${communityname}`,
            // `/${communityname}/join`,
            // {},
            // {
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // }
        );

        return res.data;
    },
leaveCommunity:async(communityname)=>{

        const res = await api.put(
          `/leave/communities/${communityname}`,
            // `/${communityId}/leave`,
            // {
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // }
        );

        return res.data;
    },




};

// export const fetchFeedPosts = async ({
//         cursorScore,
//         cursorPostId,
//         limit = 15,
//     }) => {

//         const response = await axios.get(
//             "http://localhost:3000/api/feed",
//             {
//                 params: {
//                     limit,
//                     cursorScore,
//                     cursorPostId,
//                 },

//                 withCredentials: true,
//             }
//         );

//         return response.data;
// };