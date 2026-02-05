import { useEffect, useState } from "react";
import { PostResponse } from "../utils/types";
import {
  createPost,
  deletePost,
  getPostById,
  listPosts,
} from "../utils/PostApi";

import CreatePostForm from "../components/posts/CreatePostForm";
import PostList from "../components/posts/PostList";
import PostDetail from "../components/posts/PostDetails";
import { useAuth } from "../hooks/useAuth";

import "../styles/post.css";

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
      setError("Failed to load post detail");
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
      setError("Failed to load post detail");
      setSelectedPost(null);
    }
  };

  const refreshPostCounts = async (postId: number) => {
    try {
      const full = await getPostById(postId);

      setSelectedPost((prev) =>
        prev && prev.id === postId ? full : prev
      );

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, commentCount: full.commentCount }
            : p
        )
      );
    } catch {
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await deletePost(id);

      setPosts((prev) => {
        const next = prev.filter((p) => p.id !== id);

        setSelectedPostId((current) => {
          if (current !== id) return current;

          const nextId = next.length ? next[0].id : null;

          if (nextId) {
            getPostById(nextId)
              .then(setSelectedPost)
              .catch(() => setSelectedPost(null));
          } else {
            setSelectedPost(null);
          }

          return nextId;
        });

        return next;
      });
    } catch (e: any) {
      if (e?.response?.status === 403) {
        setError("You can only delete your own posts!");
      } else {
        setError("Failed to delete post");
      }
    }
  };

  return (
    <div className="post-page">
      <h1 className="post-title">Post Service</h1>

      <CreatePostForm onCreate={handleCreate} />

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="post-grid">
        <PostList
          posts={posts}
          selectedPostId={selectedPostId}
          onSelect={handleSelect}
          onDelete={handleDelete}
          currentUsername={currentUsername}
          onComment={handleCommentFromFeed}
        />

        <PostDetail
          post={selectedPost}
          focusComment={focusComment}
          onFocused={() => setFocusComment(false)}
          onCommentCreated={refreshPostCounts}
        />
      </div>
    </div>
  );
}
