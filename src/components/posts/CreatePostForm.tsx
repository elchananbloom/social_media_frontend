import { useState } from "react";

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
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10 }}>
      <textarea
        placeholder="What is on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        style={{ width: "100%", padding: 10 }}
      />
      <input
        placeholder="Optional imageUrl"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={{ width: "100%", marginTop: 8, padding: 10 }}
      />
      <button onClick={submit} disabled={submitting} style={{ marginTop: 8 }}>
        {submitting ? "Posting..." : "Post"}
      </button>
    </div>
  );
}
