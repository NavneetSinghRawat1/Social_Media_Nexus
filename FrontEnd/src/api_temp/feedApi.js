import axios from "axios";

export const fetchFeedPosts = async ({
        cursorScore,
        cursorPostId,
        limit = 15,
    }) => {

        const response = await axios.get(
            "http://localhost:3000/api/feed",
            {
                params: {
                    limit,
                    cursorScore,
                    cursorPostId,
                },

                withCredentials: true,
            }
        );
        // console.log("API Response:", response);
        return response.data;
};
// export const fetchProfilePosts = async ({
//         cursorScore,
//         cursorPostId,
//         limit = 15,
//     }) => {

//         const response = await axios.get(
//             "http://localhost:3000/api/profile/post",
//             {
//                 params: {
//                     limit,
//                     cursorScore,
//                     cursorPostId,
//                 },

//                 withCredentials: true,
//             }
//         );
//         // console.log("API Response:", response);
//         return response.data;
// };


export const fetchProfilePosts = async ({
    cursorCreatedAt,
    cursorPostId,
    limit = 15,
}) => {

    const response = await axios.get(
        "http://localhost:3000/api/profile/post",
        {
            params: {
                limit,
                cursorCreatedAt,
                cursorPostId,
            },

            withCredentials: true,
        }
    );

    return response.data;
};

export const fetchFeedPosts_trending = async ({
        cursorScore,
        cursorPostId,
        limit = 15,
    }) => {

        const response = await axios.get(
            "http://localhost:3000/api/feed/trending",
            {
                params: {
                    limit,
                    cursorScore,
                    cursorPostId,
                },

                withCredentials: true,
            }
        );
        // console.log("API Response:", response);
        return response.data;
};

export const fetchFeedPosts_global = async ({
    // cursorCreatedAt = null,
    cursorFeedId = null,
    limit = 15,
}) => {

    const response = await axios.get(
        "http://localhost:3000/api/feed/global",
        {
            params: {
                limit,
                // cursorCreatedAt,
                cursorFeedId,
            },

            withCredentials: true,
        }
    );

    console.log("API Response:", response.data);

    return response.data;
};