import { APPWRITE_CONFIG } from "./constants.js";
import { getTabs } from "./tabs.js";
import { Account, Client, Databases } from "appwrite";

export class Session {
  constructor() {
    this.client = new Client()
      .setEndpoint(APPWRITE_CONFIG.ENDPOINT)
      .setProject(APPWRITE_CONFIG.PROJECT_ID);
    this.account = new Account(this.client);
    this.database = new Databases(this.client);
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
) {
  async function submitLogin() {
    try {
      setLoading(true);
      let res = await session.account.createEmailSession(email, password);
      user.set(res.$id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Entangled</h1>
      <h2>Sync you tabs between any browsers</h2>
      <div>
        <label className="login-item">Email:</label>
        <input onChange={e => setEmail(e.target.value)} type="email" />
        <label className="login-item">Password:</label>
        <input onChange={e => setPassword(e.target.value)} type="password" />
      </div>
      <div id="login-button" onClick={submitLogin}>
        Login
      </div>
      <a
        href="https://entangled-tabs.vercel.app"
        target="_blank"
        rel="noreferrer"
        id="signup"
      >
        Need an account?
      </a>
    </>
  );
}

export async function getSession(session, user, setTabs, setLoading) {
  try {
    setLoading(true);
    let res = await session.account.get();
    if (!res.$id) {
      user.set(null);
    } else {
      user.set(res.$id);
      await getTabs(session, setTabs);
    }
  } catch (e) {
    user.set(null);
    console.error(e);
  } finally {
    setLoading(false);
  }
}
