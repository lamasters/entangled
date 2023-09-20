import './App.css';

import { useEffect, useState } from 'react';
import { Account, Client, Databases, ID, Permission, Role } from 'appwrite';

class Hook {
  constructor(value, set) {
    this.value = value;
    this.set = set;
  }
}

class Session {
  constructor() {
    this.client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject('650a139471b25458406f');
    this.account = new Account(this.client);
    this.database = new Databases(this.client);
  }
}

function tabItem(tab, session, hooks) {
  return (
    <div className="tab">
      <div onClick={() => { deleteTab(tab, session, hooks) }}>{tab.url}</div>
    </div>
  );
}

function Login(session, hooks) {
  async function submitLogin() {
    try {
      let res = await session.account.createEmailSession(hooks.email.value, hooks.password.value);
      hooks.uid.set(res.$id);
      hooks.loggedIn.set(true);
      hooks.existingSession.set(true);
      await getTabs(res.$id, hooks);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <label>Email:</label>
      <input onChange={(e) => hooks.email.set(e.target.value)} type="text" />
      <label>Password:</label>
      <input onChange={(e) => hooks.password.set(e.target.value)} type="password" />
      <button onClick={submitLogin}>Login</button>
    </div>
  );
}

async function getSession(session, hooks) {
  try {
    let res = await session.account.get();
    hooks.uid.set(res.$id);
    hooks.loggedIn.set(true);
    hooks.existingSession.set(true);
    await getTabs(res.$id, session, hooks);
  } catch (e) {
    hooks.uid.set(null);
    hooks.loggedIn.set(false);
    hooks.existingSession.set(false);
    console.error(e);
  }
}

async function getTabs(uid, session, hooks) {
  try {
    console.log(uid);
    let tabs = await session.database.listDocuments(
      "650a25486a53f6902000",
      "650a2552869d0ff7adf9"
    );
    console.log(tabs.documents)
    hooks.tabs.set(tabs.documents);
  } catch (e) {
    console.error(e);
  }
}

async function deleteTab(tab, session, hooks) {
  try {
    await session.database.deleteDocument(
      "650a25486a53f6902000",
      "650a2552869d0ff7adf9",
      tab.$id
    );
    await getTabs(hooks.uid.value, session, hooks);
    window.open(tab.url, "_blank", "noopener,noreferrer");
  } catch (e) {
    console.error(e);
  }
}

async function addTab(session, hooks) {
  try {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await session.database.createDocument(
      "650a25486a53f6902000",
      "650a2552869d0ff7adf9",
      ID.unique(),
      { url: tab.url },
      [
        Permission.read(Role.user(hooks.uid.value)),
        Permission.write(Role.user(hooks.uid.value)),
        Permission.update(Role.user(hooks.uid.value)),
        Permission.delete(Role.user(hooks.uid.value)),
      ]
    );
    await getTabs(hooks.uid.value, session, hooks);
  } catch (e) {
    console.error(e);
  }

}

function App() {
  const session = new Session();
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tabs, setTabs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [existingSession, setExistingSession] = useState(true);
  const hooks = {
    uid: new Hook(uid, setUid),
    email: new Hook(email, setEmail),
    password: new Hook(password, setPassword),
    tabs: new Hook(tabs, setTabs),
    loggedIn: new Hook(loggedIn, setLoggedIn),
    existingSession: new Hook(existingSession, setExistingSession)
  }

  useEffect(() => {
    getSession(session, hooks);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {loggedIn ? <div id="save-button" onClick={() => { addTab(session, hooks) }}>Save Tab</div> : null}
        {(!loggedIn && !existingSession) ? Login(session, hooks) : null}
        <div id="tab-list">
          {loggedIn ? tabs.map((tab) => tabItem(tab, session, hooks)) : null}
        </div>
      </header>
    </div>
  );
}

export default App;
