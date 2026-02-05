import { useEffect, useState } from "react";
import { PostResponse } from "../utils/types";
import { createPost, deletePost, getPostById, listPosts } from "../utils/PostApi";

import CreatePostForm from "../components/posts/CreatePostForm";
import PostList from "../components/posts/PostList";
import PostDetail from "../components/posts/PostDetails";
import { useAuth } from "../hooks/useAuth";
import { likePost, unlikePost } from "../api/likesApi";

export default function PostPage() {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);

  const [focusComment, setFocusComment] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const currentUsername = user?.username ?? null;



  const loadPosts = async () => {
    try {
      setError(null);
      setLoading(true);

      const data = await listPosts({ limit: 50 });
      setPosts(data);

      if (data.length && selectedPostId == null) {
        const firstId = data[0].id;
        setSelectedPostId(firstId);

        const full = await getPostById(firstId);
        setSelectedPost(full);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load posts");
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
      setError(null);
      setSelectedPostId(id);
      setFocusComment(false);

      const full = await getPostById(id);
      setSelectedPost(full);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load post detail");
      setSelectedPost(null);
    }
  };

  const handleCommentFromFeed = async (id: number) => {
    try {
      setError(null);
      setSelectedPostId(id);
      setFocusComment(true);

      const full = await getPostById(id);
      setSelectedPost(full);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load post detail");
      setSelectedPost(null);
    }
  };

  const toggleLike = async (postId: number) => {
    if (!user) return;

    // optimistic UI update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLikedByCurrentUser: !p.isLikedByCurrentUser,
              likesCount: p.isLikedByCurrentUser
                ? p.likesCount - 1
                : p.likesCount + 1,
            }
          : p
      )
    );

    // keep detail panel in sync
    setSelectedPost((prev) =>
      prev && prev.id === postId
        ? {
            ...prev,
            isLikedByCurrentUser: !prev.isLikedByCurrentUser,
            likesCount: prev.isLikedByCurrentUser
              ? prev.likesCount - 1
              : prev.likesCount + 1,
          }
        : prev
    );

    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      post.isLikedByCurrentUser
        ? await unlikePost(postId, user.username)
        : await likePost(postId, user.username);
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };



  // ✅ NEW: refresh one post (detail + feed) after comment is added
  const refreshPostCounts = async (postId: number) => {
    try {
      const full = await getPostById(postId);

      // update detail panel if it's the same post
      setSelectedPost((prev) => (prev && prev.id === postId ? full : prev));

      // update feed list so PostCard shows updated count
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, commentCount: full.commentCount } : p
        )
      );
    } catch (e) {
      // keep UI working even if refresh fails
      console.warn("Failed to refresh post counts", e);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await deletePost(id);

      setPosts((prev) => {
        const next = prev.filter((p) => p.id !== id);

        setSelectedPostId((currentSelected) => {
          if (currentSelected !== id) return currentSelected;

          const nextId = next.length ? next[0].id : null;

          if (nextId == null) {
            setSelectedPost(null);
          } else {
            getPostById(nextId)
              .then((full) => setSelectedPost(full))
              .catch(() => setSelectedPost(null));
          }

          return nextId;
        });

        return next;
      });
    } catch (e: any) {
      if (e?.response?.status === 403) {
        setError("You can only delete your own posts!");
      } else {
        setError(e?.response?.data?.message || "Failed to delete");
      }
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: 16 }}>
      <h1>Post Service</h1>

      <CreatePostForm onCreate={handleCreate} />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 16,
        }}
      >
        <PostList
          posts={posts}
          selectedPostId={selectedPostId}
          onSelect={handleSelect}
          onDelete={handleDelete}
          currentUsername={currentUsername}
          onComment={handleCommentFromFeed}
          onToggleLike={toggleLike}
        />

        <PostDetail
          post={selectedPost}
          focusComment={focusComment}
          onFocused={() => setFocusComment(false)}
          onCommentCreated={refreshPostCounts} 
          onToggleLike={toggleLike}
        />
      </div>
    </div>
  );
}
