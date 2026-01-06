import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api, setToken } from "../api";

export default function RegisterPage() {
  const { t } = useTranslation();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState("");

  async function register(e) {
    e.preventDefault();
    setMsg("");

    try {
      const res = await api("/auth/register", {
        method: "POST",
        body: {
          display_name: displayName,
          email,
          password
        }
      });

      setToken(res.token);
      setMsg(t("auth.registered"));
    } catch (err) {
      setMsg(String(err.message));
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>{t("auth.register")}</h2>

      <form onSubmit={register} style={{ display: "grid", gap: 10 }}>
        <label>
          {t("auth.displayName")}
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            minLength={2}
          />
        </label>

        <label>
          {t("auth.email")}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />
        </label>

        <label>
          {t("auth.password")}
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            minLength={8}
          />
        </label>

        <button className="btn-primary" type="submit">
          {t("auth.register")}
        </button>

        {msg && <div>{msg}</div>}
      </form>
    </div>
  );
}
