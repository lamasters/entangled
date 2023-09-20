import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from 'react';
import { Account, Client, Databases, Query } from 'appwrite';

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
    <div>
      <a onClick={() => { deleteTab(tab, session, hooks) }} href={tab.url} target="_blank" rel="noreferrer">{tab.url}</a>
    </div>
  );
}

function Login(session, hooks) {
  async function submitLogin() {
    try {
      let res = await session.account.createEmailSession(hooks.email.value, hooks.email.password);
      hooks.uid.set(res.$id);
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
    await getTabs(res.$id, session, hooks);
  } catch (e) {
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
  const hooks = {
    uid: new Hook(uid, setUid),
    email: new Hook(email, setEmail),
    password: new Hook(password, setPassword),
    tabs: new Hook(tabs, setTabs)
  }

  useEffect(() => {
    getSession(session, hooks);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {uid === null ? "NOT LOGGED IN" : "LOGGED IN"}
        {uid === null ? Login(session, hooks) : null}
        {uid !== null ? tabs.map((tab) => tabItem(tab, session, hooks)) : null}
      </header>
    </div>
  );
}

export default App;
