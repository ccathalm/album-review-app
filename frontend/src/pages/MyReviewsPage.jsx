import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api, getToken } from "../api";

export default function MyReviewsPage() {
  const { t } = useTranslation();

  const [me, setMe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");

    if (!getToken()) {
      setErr(t("common.loginRequired"));
      return;
    }

    const meRes = await api("/auth/me");
    setMe(meRes.user);

    const revRes = await api(`/reviews?userId=${meRes.user.id}`);
    setReviews(revRes.reviews);
  }

  useEffect(() => {
    load().catch((e) => setErr(String(e.message)));
  }, []);

  if (err) return <div>{t("nav.myReviews")}: {err}</div>;
  if (!me) return <div>{t("common.loading")}</div>;

  return (
    <div>
      <h2>{t("nav.myReviews")}</h2>
      <ul>
        {reviews.map((r) => (
          <li key={r.id}>
            <b>{r.title}</b> — {r.score}/10 — {r.review_text ?? ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
