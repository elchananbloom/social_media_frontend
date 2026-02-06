import { useEffect, useState } from "react";
import { PostResponse } from "../utils/types";
import { createPost, deletePost, getPostById, listPosts } from "../utils/PostApi";
import { useAuth } from "../hooks/useAuth";
import { getLikesForPost, likePost, unlikePost } from "../api/likesApi";
import { getFollowing } from "../api/followApi";

import CreatePostForm from "../components/posts/CreatePostForm";
import PostList from "../components/posts/PostList";
import "../components/posts/PostList.css";

export default function PostPage() {
  const { user } = useAuth();
  const currentUsername = user?.username ?? null;

  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<"for-you" | "following">("for-you");

  // likesMap stores likes info separately from PostResponse
  const [likesMap, setLikesMap] = useState<{
    [postId: number]: { count: number; likedByCurrentUser: boolean };
  }>({});

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: PostResponse[] = [];

      if (feedType === "following" && currentUsername) {
        const following = await getFollowing(currentUsername);
        const usernames = [currentUsername, ...following];
        data = await listPosts({ authorUsernames: usernames, limit: 50 });
      } else {
        data = await listPosts({ limit: 50 });
      }

      setPosts(data);

      // Fetch likes for each post
      const likesData = await Promise.all(
        data.map(async (p) => {
          const likes = await getLikesForPost(p.id);
          return {
            postId: p.id,
            count: likes.length,
            likedByCurrentUser: currentUsername
              ? likes.some((l) => l.username === currentUsername)
              : false,
          };
        })
      );

      const newLikesMap: typeof likesMap = {};
      likesData.forEach((l) => {
        newLikesMap[l.postId] = { count: l.count, likedByCurrentUser: l.likedByCurrentUser };
      });
      setLikesMap(newLikesMap);

    } catch (err) {
      console.error(err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedType]);

  const handleCreate = async (content: string, imageUrl?: string) => {
    await createPost({ content, imageUrl });
    await loadPosts();
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async (postId: number) => {
    if (!user) return;
    const current = likesMap[postId];
    try {
      if (current.likedByCurrentUser) {
        await unlikePost(postId, user.username);
      } else {
        await likePost(postId, user.username);
      }
      setLikesMap((prev) => ({
        ...prev,
        [postId]: {
          count: current.likedByCurrentUser ? current.count - 1 : current.count + 1,
          likedByCurrentUser: !current.likedByCurrentUser,
        },
      }));
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", borderLeft: "1px solid var(--border-color)", borderRight: "1px solid var(--border-color)", minHeight: "100vh" }}>
      <div className="feed-tabs">
        <div
          className={`feed-tab ${feedType === "for-you" ? "active" : ""}`}
          onClick={() => setFeedType("for-you")}
        >
          For you
        </div>
        <div
          className={`feed-tab ${feedType === "following" ? "active" : ""}`}
          onClick={() => setFeedType("following")}
        >
          Following
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <CreatePostForm onCreate={handleCreate} />
      </div>

      {loading && <p style={{ padding: 16 }}>Loading...</p>}
      {error && <p style={{ color: "red", padding: 16 }}>{error}</p>}

      <div style={{ padding: "0 16px" }}>
        <PostList
          posts={posts}
          selectedPostId={null}
          onSelect={(id) => { }}
          onDelete={handleDelete}
          currentUsername={currentUsername}
          likesMap={likesMap}
          onToggleLike={toggleLike}
        />
      </div>
    </div>
  );
}
