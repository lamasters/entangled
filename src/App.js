import "./App.css";
import { Loader } from "./components/Loader.js";
import { createSession, getSession, Session } from "./session.js";
import { addTab, tabItem } from "./tabs.js";
import { useEffect, useMemo, useState } from "react";
class Hook {
  constructor(value, set) {
    this.value = value;
    this.set = set;
  }
}

function App() {
  const session = useMemo(() => {
    return new Session();
  }, []);
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tabs, setTabs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [existingSession, setExistingSession] = useState(true);

  const hooks = useMemo(() => {
    return {
      uid: new Hook(uid, setUid),
      email: new Hook(email, setEmail),
      password: new Hook(password, setPassword),
      tabs: new Hook(tabs, setTabs),
      loggedIn: new Hook(loggedIn, setLoggedIn),
      existingSession: new Hook(existingSession, setExistingSession),
    };
  }, [
    uid,
    setUid,
    email,
    setEmail,
    password,
    setPassword,
    tabs,
    setTabs,
    loggedIn,
    setLoggedIn,
    existingSession,
    setExistingSession,
  ]);

  useEffect(() => {
    getSession(session, hooks);
  }, [session, hooks]);

  return (
    <div className="App">
      <header className="App-header">
        {loggedIn ? (
          <div
            id="save-button"
            onClick={() => {
              addTab(session, hooks);
            }}
          >
            Save Tab
          </div>
        ) : null}
        {loggedIn ? (
          <div id="tab-list">
            {tabs.map((tab) => tabItem(tab, session, hooks))}
          </div>
        ) : (
          <Loader />
        )}
        {!loggedIn && !existingSession ? createSession(session, hooks) : null}
      </header>
    </div>
  );
}

export default App;
