import { useState } from "react";
import "./CreatePostForm.css";

export default function CreatePostForm({
  onCreate,
}: {
  onCreate: (content: string, imageUrl?: string) => Promise<void> | void;
}) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!content.trim()) return;
    try {
      setSubmitting(true);
      await onCreate(content.trim(), imageUrl.trim() || undefined);
      setContent("");
      setImageUrl("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <textarea
        placeholder="What is happening?!"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="create-post-textarea"
      />

      <div className="create-post-divider"></div>

      <div className="create-post-footer">
        <input
          placeholder="Optional image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="create-post-input"
        />
        <button onClick={submit} disabled={submitting} className="post-submit-button">
          {submitting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
