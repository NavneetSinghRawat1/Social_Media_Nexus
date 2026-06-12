import { useEffect, useState, useRef, useCallback } from "react";
import { fetchProfilePosts } from "../api_temp/feedApi";
import PostCard from "../components/PostCard";
// import {useContext} from 'react';
// import { UserDataContext } from "../components/contaxt/userContaxt";
export default function Profilepost() {
    // {console.log("Rendering HomeFeed");}
    // const{userInfo,setUserInfo,isLoggedIn,setIsLoggedIn} = useContext(UserDataContext);
    // console.log("User Data in HomeFeed:", userData);
    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(false);

    const [hasMore, setHasMore] = useState(true);

    const [cursor, setCursor] = useState(null);

    const observer = useRef();

    const loadPosts = async () => {

        if (loading || !hasMore) return;

        setLoading(true);

        try {
            // console.log("Fetch Feed Posts");
            // const data = await fetchProfilePosts({
            //     cursorScore: cursor?.cursorScore,
            //     cursorPostId: cursor?.cursorPostId,
            // });
            const data = await fetchProfilePosts({
                cursorCreatedAt: cursor?.cursorCreatedAt,
                cursorPostId: cursor?.cursorPostId,
            });
            setPosts(prev => {

                const oldIds = new Set(
                    prev.map(p => p.post_id)
                );

                const newPosts = data.posts.filter(
                    p => !oldIds.has(p.post_id)
                );
                return [...prev, ...newPosts];
            });
            // console.log(posts);
            // console.log("Fetched:", data);
            // if(data &&data.token){
            //     setIsLoggedIn(true);
            //     setUserInfo({ username: data.user.username, picture: data.user.profile_photo });
            // }
            setCursor(data.nextCursor);

            setHasMore(data.hasMore);

        } catch (err) {
            console.error(err.message);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const secondLastPostRef = useCallback(node => {

        if (loading) return;

        if (observer.current)
            observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {

            if (
                entries[0].isIntersecting &&
                hasMore
            ) {
                loadPosts();
            }
        });

        if (node)
            observer.current.observe(node);

    }, [loading, hasMore, cursor]);

    return (
        <div className="feed-container">

            {
                posts.map((post, index) => {

                    if (index === posts.length - 2) {
                        return (
                            <div
                                ref={secondLastPostRef}
                                key={post.post_id}
                                // className="mb-4"
                            >
                                <PostCard post={post} isowner={true}/>
                            </div>
                        );
                    }

                    return (
                        <PostCard
                            key={post.post_id}
                            post={post}
                            isowner={true}
                        />
                    );
                })
            }

            {
                loading &&
                <h2>Loading...</h2>
            }

        </div>
    );
}
