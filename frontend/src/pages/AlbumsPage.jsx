import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api";

export default function AlbumsPage() {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ albums: [], total: 0, pageSize: 10 });

  async function load() {
    const res = await api(
      `/albums?page=${page}&pageSize=10&search=${encodeURIComponent(search)}`
    );
    setData(res);
  }

  useEffect(() => {
    load();
  }, [page]);

  return (
    <div>
      <h2>{t("nav.albums")}</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          load();
        }}
        style={{ display: "flex", gap: 8 }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("common.search")}
        />
        <button type="submit">{t("common.search")}</button>
      </form>

      <ul>
        {data.albums.map((a) => (
          <li key={a.id}>
            <Link to={`/albums/${a.id}`}>{a.title}</Link> — {a.artist} (
            {a.release_year ?? "?"})
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          {t("common.prev")}
        </button>

        <span>
          {t("common.page", { page }) || `Page ${page}`}
        </span>

        <button
          disabled={page * data.pageSize >= data.total}
          onClick={() => setPage((p) => p + 1)}
        >
          {t("common.next")}
        </button>

        <span>
          {t("common.total")}: {data.total}
        </span>
      </div>
    </div>
  );
}
