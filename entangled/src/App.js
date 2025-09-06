import "./App.css";

import { Session, createSession, getSession } from "./session.js";
import { addTab, tabItem } from "./tabs.js";
import { useEffect, useMemo, useState } from "react";

import { Loader } from "./components/Loader.js";

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
  const [id, setId] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useMemo(() => {
    return new Hook(id, setId);
  }, [id]);

  useEffect(() => {
    getSession(session, user, setTabs, setLoading);
  }, [session, user]);

  return (
    <div className="App">
      <header className="App-header">
        {id && !loading ? (
          <div
            id="save-button"
            onClick={() => {
              addTab(session, user, setTabs);
            }}
          >
            Save Tab
          </div>
        ) : null}
        {id && !loading ? (
          <div id="tab-list">
            {tabs.map(tab => tabItem(tab, session, setTabs))}
          </div>
        ) : null}
        {!id && !loading
          ? createSession(
              session,
              user,
              email,
              setEmail,
              password,
              setPassword,
              setLoading,
              setError,
            )
          : null}
        {error && !loading && <div id="error">{error}</div>}
        {loading ? <Loader /> : null}
        {!loading && (
          <a
            href="https://entangled-tabs.vercel.app"
            target="_blank"
            rel="noreferrer"
            id="signup"
          >
            Need an account?
          </a>
        )}
      </header>
    </div>
  );
}

export default App;
