import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api, setToken } from "../api";

export default function LoginPage() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("User123!");
  const [msg, setMsg] = useState("");

  async function login(e) {
    e.preventDefault();
    setMsg("");

    try {
      const res = await api("/auth/login", {
        method: "POST",
        body: { email, password }
      });
      setToken(res.token);
      setMsg(t("auth.loggedIn"));
    } catch (err) {
      setMsg(String(err.message));
    }
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <h2>{t("auth.login")}</h2>

      <form onSubmit={login} style={{ display: "grid", gap: 8 }}>
        <label>
          {t("auth.email")}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          {t("auth.password")}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit">{t("auth.login")}</button>

        {msg && <div>{msg}</div>}
      </form>
    </div>
  );
}
