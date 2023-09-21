import './App.css';
import { createSession, getSession, Session } from './session.js';
import { addTab, tabItem } from './tabs.js';
import { useEffect, useState } from 'react';
class Hook {
  constructor(value, set) {
    this.value = value;
    this.set = set;
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
        {loggedIn ? <div id="tab-list">{tabs.map((tab) => tabItem(tab, session, hooks))}</div> : null}
        {(!loggedIn && !existingSession) ? createSession(session, hooks) : null}
      </header>
    </div>
  );
}

export default App;
