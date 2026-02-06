import { PostResponse } from "../../utils/types";
import CommentsPanel from "./CommentsPanel";
import UserAvatar from "../UserAvatar";
import "./PostDetails.css";

type PostDetailProps = {
  post: PostResponse | null;
  likesMap: { [postId: number]: { count: number; likedByCurrentUser: boolean } };
  onToggleLike: (postId: number) => void;
};

export default function PostDetail({ post, likesMap, onToggleLike }: PostDetailProps) {
  if (!post) return <div className="empty-detail">Select a post to see details</div>;

  const likes = likesMap[post.id]?.count ?? 0;
  const likedByCurrentUser = likesMap[post.id]?.likedByCurrentUser ?? false;

  return (
    <div className="post-details-container">
      <div className="post-details-header">
        <div className="post-details-user">
          <UserAvatar username={post.authorUsername} profilePictureUrl={post.authorProfilePictureUrl} size="medium" />
          <div className="post-user-info">
            <div className="post-username">@{post.authorUsername}</div>
            <div className="post-date">
              {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="post-details-content">
        {post.content}
      </div>

      <div className="post-details-stats">
        <button
          onClick={() => onToggleLike(post.id)}
          className="post-action-button"
        >
          {likedByCurrentUser ? "❤️" : "🤍"} {likes}
        </button>
        <span className="post-stat-separator">·</span>
        <span className="post-comment-count">
          💬 {post.commentCount ?? 0} Comments
        </span>
      </div>

      <CommentsPanel postId={post.id} />
    </div>
  );
}
