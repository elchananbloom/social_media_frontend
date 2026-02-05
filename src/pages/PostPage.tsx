import { useEffect, useState } from "react";
import { PostResponse } from "../utils/types";
import { createPost, deletePost, getPostById, listPosts } from "../utils/PostApi";
import { useAuth } from "../hooks/useAuth";
import { getLikesForPost, likePost, unlikePost } from "../api/likesApi";

import CreatePostForm from "../components/posts/CreatePostForm";
import PostList from "../components/posts/PostList";
import PostDetail from "../components/posts/PostDetails";

export default function PostPage() {
  const { user } = useAuth();
  const currentUsername = user?.username ?? null;

  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // likesMap stores likes info separately from PostResponse
  const [likesMap, setLikesMap] = useState<{
    [postId: number]: { count: number; likedByCurrentUser: boolean };
  }>({});

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await listPosts({ limit: 50 });
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

      if (data.length && selectedPostId == null) {
        const firstId = data[0].id;
        setSelectedPostId(firstId);
        setSelectedPost(await getPostById(firstId));
      }
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
  }, []);

  const handleCreate = async (content: string, imageUrl?: string) => {
    await createPost({ content, imageUrl });
    await loadPosts();
  };

  const handleSelect = async (id: number) => {
    try {
      setSelectedPostId(id);
      setSelectedPost(await getPostById(id));
    } catch (err) {
      console.error(err);
      setSelectedPost(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (selectedPostId === id) setSelectedPostId(null);
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
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: 16 }}>
      <h1>Posts</h1>
      <CreatePostForm onCreate={handleCreate} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <PostList
          posts={posts}
          selectedPostId={selectedPostId}
          onSelect={handleSelect}
          onDelete={handleDelete}
          currentUsername={currentUsername}
          likesMap={likesMap}
          onToggleLike={toggleLike}
        />

        <PostDetail post={selectedPost} likesMap={likesMap} onToggleLike={toggleLike} />
      </div>
    </div>
  );
}
