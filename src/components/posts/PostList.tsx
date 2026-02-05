import PostCard from "./PostCard";
import { PostResponse } from "../../utils/types";

type PostListProps = {
  posts: PostResponse[];
  selectedPostId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  currentUsername: string | null;
  likesMap: { [postId: number]: { count: number; likedByCurrentUser: boolean } };
  onToggleLike: (postId: number) => void;
};

export default function PostList({
  posts,
  selectedPostId,
  onSelect,
  onDelete,
  currentUsername,
  likesMap,
  onToggleLike,
}: Readonly<PostListProps>) {
  return (
    <div>
      {posts.map((p) => {
        const canDelete = currentUsername && p.authorUsername === currentUsername;
        const likes = likesMap[p.id]?.count ?? 0;
        const likedByCurrentUser = likesMap[p.id]?.likedByCurrentUser ?? false;

        return (
          <PostCard
            key={p.id}
            post={p}
            selected={p.id === selectedPostId}
            onSelect={() => onSelect(p.id)}
            onDelete={canDelete ? () => onDelete(p.id) : undefined}
            likes={likes}
            likedByCurrentUser={likedByCurrentUser}
            onToggleLike={() => onToggleLike(p.id)}
          />
        );
      })}
      {!posts.length && <p>No posts yet.</p>}
    </div>
  );
}
