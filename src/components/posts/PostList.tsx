import { PostResponse } from "../../utils/types";
import PostCard from "./PostCard";

type PostListProps = {
  posts: PostResponse[];
  selectedPostId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => Promise<void> | void;
  currentUsername: string | null;
  onComment: (id: number) => void;
  onToggleLike: (id: number) => void;
};

export default function PostList({
  posts,
  selectedPostId,
  onSelect,
  onDelete,
  currentUsername,
  onComment,
  onToggleLike,
}: Readonly<PostListProps>) {
  return (
    <div>
      <h3>Feed</h3>

      {posts.map((p) => {
        const canDelete = !!currentUsername && p.authorUsername === currentUsername;

        return (
          <PostCard
            key={p.id}
            post={p}
            selected={p.id === selectedPostId}
            onSelect={() => onSelect(p.id)}
            onDelete={canDelete ? () => onDelete(p.id) : undefined}
            onComment={() => onComment(p.id)}
            likes={p.likesCount}
            likedByCurrentUser={p.isLikedByCurrentUser}
            onToggleLike={() => onToggleLike(p.id)} 
          />
        );
      })}

      {!posts.length && <p>No posts yet.</p>}
    </div>
  );
}
