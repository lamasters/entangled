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
  const [id, setId] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");

  const user = useMemo(() => {
    return new Hook(id, setId);
  }, [id]);

  useEffect(() => {
    getSession(session, user, setTabs, setLoading);
  }, [session, user]);

  return (
    <div className="App">
      {id && !loading ? (
        <>
          <h2>My Tabs</h2>
          <form
            id="add-tab"
            onSubmit={e => {
              e.preventDefault();
              addTab(session, user, url, setTabs);
              setUrl("");
            }}
          >
            <label>Add a site:</label>
            <input
              type="text"
              onChange={e => setUrl(e.target.value)}
              value={url}
            ></input>
            <button id="submit-button" type="submit">
              Save
            </button>
          </form>
          <div
            id="clipboard-tab"
            onClick={async () => {
              try {
                const copiedUrl = await navigator.clipboard.readText();
                addTab(session, user, copiedUrl, setTabs);
              } catch (error) {
                console.log("Failed to read clipboard");
              }
            }}
          >
            Save From Clipboard
          </div>
          <div id="tab-list">
            {tabs.map(tab => tabItem(tab, session, setTabs))}
          </div>
        </>
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
          )
        : null}
      <a
        href="https://chromewebstore.google.com/detail/entangled/bpladjoppoackkpoegnmfbbccemijcec"
        target="_blank"
        rel="noreferrer"
        id="extension-link"
      >
        Get the browser extension
      </a>
      {loading ? <Loader /> : null}
    </div>
  );
}

export default App;
