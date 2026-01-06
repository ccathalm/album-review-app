import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, getToken } from "../api";
import { z } from "zod";
import { useTranslation } from "react-i18next";

const reviewSchema = z.object({
  score: z.coerce.number().int().min(1).max(10),
  review_text: z.string().max(2000).optional()
});

export default function AlbumDetailPage() {
  const { t } = useTranslation();

  const { id } = useParams();
  const [data, setData] = useState(null);

  // create review
  const [score, setScore] = useState(8);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState("");

  // current user + edit review
  const [me, setMe] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editScore, setEditScore] = useState(8);
  const [editText, setEditText] = useState("");

  async function load() {
    const res = await api(`/albums/${id}`);
    setData(res);

    if (getToken()) {
      try {
        const meRes = await api("/auth/me");
        setMe(meRes.user);
      } catch {
        setMe(null);
      }
    } else {
      setMe(null);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function deleteReview(reviewId) {
    setError("");
    try {
      await api(`/reviews/${reviewId}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(String(err.message));
    }
  }

  function startEdit(r) {
    setEditingReviewId(r.id);
    setEditScore(r.score);
    setEditText(r.review_text ?? "");
  }

  function cancelEdit() {
    setEditingReviewId(null);
    setEditScore(8);
    setEditText("");
  }

  async function saveEdit(reviewId) {
    setError("");
    try {
      await api(`/reviews/${reviewId}`, {
        method: "PUT",
        body: { score: Number(editScore), review_text: editText }
      });
      cancelEdit();
      await load();
    } catch (err) {
      setError(String(err.message));
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    setError("");

    const parsed = reviewSchema.safeParse({ score, review_text: reviewText });
    if (!parsed.success) {
      setError("Validation failed");
      return;
    }

    if (!getToken()) {
      setError(t("common.loginRequired"));
      return;
    }

    try {
      await api("/reviews", {
        method: "POST",
        body: { album_id: Number(id), ...parsed.data }
      });
      setReviewText("");
      await load();
    } catch (err) {
      setError(String(err.message));
    }
  }

  if (!data) return <div>{t("common.loading")}</div>;

  return (
    <div>
      <h2>{data.album.title}</h2>

      <p>
        {data.album.artist} — {data.album.release_year ?? "?"} — {data.album.genre ?? "-"}
      </p>

      <p>
        Avg score:{" "}
        {data.stats.avgScore ? Number(data.stats.avgScore).toFixed(1) : "N/A"} (
        {data.stats.reviewCount} reviews)
      </p>

      <h3>{t("album.addReview")}</h3>

      <form onSubmit={submitReview} style={{ display: "grid", gap: 8, maxWidth: 500 }}>
        <label>
          {t("album.score")} (1–10)
          <input
            type="number"
            min="1"
            max="10"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
        </label>

        <label>
          {t("album.reviewText")}
          <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
        </label>

        <button type="submit">{t("common.submit")}</button>

        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>

      <h3>{t("album.reviews")}</h3>

      <ul>
        {data.reviews.map((r) => {
          const isOwner = me && r.user_id === me.id;
          const isEditing = editingReviewId === r.id;

          return (
            <li key={r.id} style={{ marginBottom: 12 }}>
              <div>
                <b>{r.display_name}</b>: {r.score}/10 — {r.review_text ?? ""}
              </div>

              {isOwner && !isEditing && (
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <button type="button" onClick={() => startEdit(r)}>
                    {t("common.edit")}
                  </button>
                  <button type="button" onClick={() => deleteReview(r.id)}>
                    {t("common.delete")}
                  </button>
                </div>
              )}

              {isOwner && isEditing && (
                <div style={{ display: "grid", gap: 8, marginTop: 8, maxWidth: 450 }}>
                  <label>
                    {t("album.score")} (1–10)
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editScore}
                      onChange={(e) => setEditScore(e.target.value)}
                    />
                  </label>

                  <label>
                    {t("album.reviewText")}
                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
                  </label>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={() => saveEdit(r.id)}>
                      {t("common.save")}
                    </button>
                    <button type="button" onClick={cancelEdit}>
                      {t("common.cancel")}
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
