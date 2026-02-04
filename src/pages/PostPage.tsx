import { useEffect, useState } from "react";
import { PostResponse } from "../utils/types";
import { createPost, deletePost, listPosts } from "../utils/PostApi";

import CreatePostForm from "../components/posts/CreatePostForm";
import PostList from "../components/posts/PostList";
import PostDetail from "../components/posts/PostDetails";
import { useAuth } from "../hooks/useAuth";

export default function PostPage() {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  
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
      if (data.length && selectedPostId == null) setSelectedPostId(data[0].id);
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

  
  const handleSelect = (id: number) => {
    setSelectedPostId(id);
    setFocusComment(false);
  };

  
  const handleCommentFromFeed = (id: number) => {
    setSelectedPostId(id);
    setFocusComment(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await deletePost(id);

      setPosts((prev) => {
        const next = prev.filter((p) => p.id !== id);

        setSelectedPostId((currentSelected) => {
          if (currentSelected !== id) return currentSelected;
          return next.length ? next[0].id : null;
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

  const selectedPost = posts.find((p) => p.id === selectedPostId) || null;

  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: 16 }}>
      <h1>Post Service</h1>

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
          onComment={handleCommentFromFeed}  
        />

        <PostDetail 
        post={selectedPost} 
        focusComment={focusComment} 
        onFocused={() => setFocusComment(false)}/> 
      </div>
    </div>
  );
}
