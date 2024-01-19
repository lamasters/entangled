import { getTabs } from "./tabs.js";
import { Account, Client, Databases } from "appwrite";

export class Session {
  constructor() {
    this.client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("650a139471b25458406f");
    this.account = new Account(this.client);
    this.database = new Databases(this.client);
  }
}

export function createSession(session, hooks) {
  async function submitLogin() {
    try {
      hooks.loading.set(true);
      let res = await session.account.createEmailSession(
        hooks.email.value,
        hooks.password.value,
      );
      hooks.uid.set(res.$id);
      hooks.loggedIn.set(true);
      hooks.existingSession.set(true);
      await getTabs(session, hooks);
    } catch (e) {
      console.error(e);
    } finally {
      hooks.loading.set(false);
    }
  }

  return (
    <>
      <div>
        <label className="login-item">Email:</label>
        <input onChange={e => hooks.email.set(e.target.value)} type="email" />
        <label className="login-item">Password:</label>
        <input
          onChange={e => hooks.password.set(e.target.value)}
          type="password"
        />
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

export async function getSession(session, hooks) {
  try {
    hooks.loading.set(true);
    let res = await session.account.get();
    hooks.uid.set(res.$id);
    hooks.loggedIn.set(true);
    hooks.existingSession.set(true);
    await getTabs(session, hooks);
  } catch (e) {
    hooks.uid.set(null);
    hooks.loggedIn.set(false);
    hooks.existingSession.set(false);
    console.error(e);
  } finally {
    hooks.loading.set(false);
  }
}
