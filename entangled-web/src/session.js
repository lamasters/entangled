import { SUPABASE_CONFIG } from "./constants.js";
import { createClient } from "@supabase/supabase-js";
import { getTabs } from "./tabs.js";

export class Session {
  constructor() {
    this.client = createClient(
      SUPABASE_CONFIG.ENDPOINT,
      SUPABASE_CONFIG.PUBLIC_API_KEY,
    );
  }
}

export function createSession(
  session,
  user,
  email,
  setEmail,
  password,
  setPassword,
  setLoading,
  setError,
) {
  async function submitLogin() {
    try {
      setLoading(true);
      let { data, error } = await session.client.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        setError(error.message);
      }
      user.set(data.user.id);
      await getTabs(session, user);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Entangled</h1>
      <h2>Sync your tabs between any browsers</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          setError("");
          submitLogin();
        }}
      >
        <div>
          <label className="login-item">Email:</label>
          <input onChange={e => setEmail(e.target.value)} type="email" />
          <label className="login-item">Password:</label>
          <input onChange={e => setPassword(e.target.value)} type="password" />
        </div>
        <button id="login-button" type="submit">
          Login
        </button>
      </form>
    </>
  );
}

export async function getSession(session, user, setTabs, setLoading) {
  try {
    setLoading(true);
    let { data } = await session.client.auth.getSession();
    if (!data.session.user.id) {
      user.set(null);
    } else {
      user.set(data.session.user.id);
      await getTabs(session, setTabs);
    }
  } catch (e) {
    user.set(null);
    console.error(e);
  } finally {
    setLoading(false);
  }
}
