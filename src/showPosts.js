import { useContext } from "react";
import { userContext } from "./App"
export function showPosts() {
    const { posts, setPosts } = useContext(userContext);
    function getPosts() {
        fetch(`http://localhost:4000/posts`, {
            method: "GET",
        })
            .then((data) => data.json())
            .then((data) => setPosts(data))
    }
    return (
        <>
            {posts.map((post) => <>
                <div>
                    <span>{post.userPic}</span>
                    <span>{post.userName}</span>
                </div>
                <div>{post.description}</div>
                <div>{post.image}</div>
                <div>
                    {post.likes} {post.dislikes}
                </div>
                <div>
                    {post.comments.map((comment)=><>
                    <div>{comment.description}</div>
                    <div>
                        {comment.likes} {comment.dislikes}
                    </div>
                    </>)}
                </div>
            </>)}
        </>
    )
}