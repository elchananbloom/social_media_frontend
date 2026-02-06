import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PostResponse } from "../utils/types";
import { getPostById } from "../utils/PostApi";
import { useAuth } from "../hooks/useAuth";
import { getLikesForPost, likePost, unlikePost } from "../api/likesApi";
import PostDetail from "../components/posts/PostDetails";

export default function PostDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const currentUsername = user?.username ?? null;

    const [post, setPost] = useState<PostResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [likesInfo, setLikesInfo] = useState<{ count: number; likedByCurrentUser: boolean }>({
        count: 0,
        likedByCurrentUser: false,
    });

    useEffect(() => {
        if (!id) return;

        const loadPost = async () => {
            try {
                setLoading(true);
                const postData = await getPostById(parseInt(id));
                setPost(postData);

                const likes = await getLikesForPost(postData.id);
                setLikesInfo({
                    count: likes.length,
                    likedByCurrentUser: currentUsername
                        ? likes.some((l) => l.username === currentUsername)
                        : false,
                });

            } catch (err) {
                console.error(err);
                setError("Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [id, currentUsername]);

    const toggleLike = async (postId: number) => {
        if (!user) return;
        try {
            if (likesInfo.likedByCurrentUser) {
                await unlikePost(postId, user.username);
            } else {
                await likePost(postId, user.username);
            }
            setLikesInfo((prev) => ({
                count: prev.likedByCurrentUser ? prev.count - 1 : prev.count + 1,
                likedByCurrentUser: !prev.likedByCurrentUser,
            }));
        } catch (err) {
            console.error("Failed to toggle like", err);
        }
    };

    if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
    if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;
    if (!post) return <div style={{ padding: 20 }}>Post not found</div>;

    const likesMap = { [post.id]: likesInfo };

    return (
        <div style={{ maxWidth: 600, margin: "24px auto", padding: 16 }}>
            <button
                onClick={() => navigate(-1)}
                style={{ marginBottom: 16, background: "none", border: "none", cursor: "pointer", fontSize: 16 }}
            >
                ← Back
            </button>
            <PostDetail post={post} likesMap={likesMap} onToggleLike={toggleLike} />
        </div>
    );
}
