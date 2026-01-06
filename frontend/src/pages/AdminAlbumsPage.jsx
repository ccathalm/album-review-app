import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api, getToken } from "../api";

export default function AdminAlbumsPage() {
  const { t } = useTranslation();

  const [me, setMe] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [err, setErr] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [genre, setGenre] = useState("");

  async function load() {
    setErr("");

    if (!getToken()) {
      setErr(t("common.loginRequired"));
      return;
    }

    const meRes = await api("/auth/me");
    setMe(meRes.user);

    if (meRes.user.role !== "admin") {
      setErr(t("common.forbiddenAdminOnly"));
      return;
    }

    const albumsRes = await api(`/albums?page=1&pageSize=50&search=`);
    setAlbums(albumsRes.albums);
  }

  useEffect(() => {
    load().catch((e) => setErr(String(e.message)));
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setArtist("");
    setReleaseYear("");
    setGenre("");
  }

  function startEdit(a) {
    setEditingId(a.id);
    setTitle(a.title ?? "");
    setArtist(a.artist ?? "");
    setReleaseYear(a.release_year ?? "");
    setGenre(a.genre ?? "");
  }

  async function createAlbum(e) {
    e.preventDefault();
    setErr("");

    try {
      const body = {
        title: title.trim(),
        artist: artist.trim(),
        release_year: releaseYear === "" ? undefined : Number(releaseYear),
        genre: genre.trim() === "" ? undefined : genre.trim()
      };

      await api("/albums", { method: "POST", body });
      resetForm();
      await load();
    } catch (e2) {
      setErr(String(e2.message));
    }
  }

  async function saveEdit(e) {
    e.preventDefault();
    setErr("");

    try {
      const body = {
        title: title.trim(),
        artist: artist.trim(),
        release_year: releaseYear === "" ? undefined : Number(releaseYear),
        genre: genre.trim() === "" ? undefined : genre.trim()
      };

      await api(`/albums/${editingId}`, { method: "PUT", body });
      resetForm();
      await load();
    } catch (e2) {
      setErr(String(e2.message));
    }
  }

  async function deleteAlbum(id) {
    setErr("");

    if (!confirm(t("admin.deleteConfirm"))) return;

    try {
      await api(`/albums/${id}`, { method: "DELETE" });
      await load();
    } catch (e2) {
      setErr(String(e2.message));
    }
  }

  const isAdmin = me?.role === "admin";

  return (
    <div>
      <h2>{t("admin.title")}</h2>

      {err && (
        <div style={{ margin: "12px 0", color: "crimson" }}>
          {err}
        </div>
      )}

      {!getToken() && <div>{t("common.loginRequired")}</div>}

      {isAdmin && (
        <>
          <h3>{editingId ? t("admin.editAlbum") : t("admin.createAlbum")}</h3>

          <form
            onSubmit={editingId ? saveEdit : createAlbum}
            style={{ display: "grid", gap: 8, maxWidth: 520 }}
          >
            <label>
              Title *
              <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>

            <label>
              Artist *
              <input value={artist} onChange={(e) => setArtist(e.target.value)} required />
            </label>

            <label>
              Release year
              <input
                type="number"
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                placeholder="e.g. 2007"
              />
            </label>

            <label>
              Genre
              <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="e.g. Electronic" />
            </label>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">
                {editingId ? t("common.save") : t("common.submit")}
              </button>

              {editingId && (
                <button type="button" onClick={resetForm}>
                  {t("common.cancel")}
                </button>
              )}
            </div>
          </form>

          <h3 style={{ marginTop: 24 }}>{t("admin.albumCatalog")}</h3>
          <ul>
            {albums.map((a) => (
              <li key={a.id} style={{ marginBottom: 10 }}>
                <div>
                  <b>{a.title}</b> — {a.artist} ({a.release_year ?? "?"}) — {a.genre ?? "-"}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <button type="button" onClick={() => startEdit(a)}>
                    {t("common.edit")}
                  </button>
                  <button type="button" onClick={() => deleteAlbum(a.id)}>
                    {t("common.delete")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
