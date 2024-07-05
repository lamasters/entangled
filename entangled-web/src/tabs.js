import { APPWRITE_CONFIG } from "./constants";
import { ID, Permission, Role } from "appwrite";

export function tabItem(tab, session, setTabs) {
  let url = tab.url.replace("https://", "").replace("http://", "");
  let title = tab.title ? tab.title : url;
  if (title.length > 37) title = title.substring(0, 37) + "...";
  return (
    <div className="tab">
      <div
        className="tab-button"
        onClick={() => {
          deleteTab(tab, session, setTabs, false);
        }}
      >
        X
      </div>
      <div
        className="tab-button"
        onClick={() => {
          deleteTab(tab, session, setTabs, true);
        }}
      >
        {title}
      </div>
    </div>
  );
}

export async function getTabs(session, setTabs) {
  try {
    let tabs = await session.database.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.BUCKET_ID,
    );
    setTabs(tabs.documents);
  } catch (e) {
    console.error(e);
  }
}

export async function deleteTab(tab, session, setTabs, openTab) {
  try {
    await session.database.deleteDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.BUCKET_ID,
      tab.$id,
    );
    await getTabs(session, setTabs);
    if (openTab)
      setTimeout(() => {
        window.open(tab.url, "_blank", "noopener,noreferrer");
      }, 1);
  } catch (e) {
    console.error(e);
  }
}

export async function addTab(session, user, url, setTabs) {
  console.log("Adding tab: ", url);
  try {
    if (!url.startsWith("http")) url = "https://" + url;
    let title = url;
    if (url.length > 37) title = title.substring(0, 37) + "...";
    await session.database.createDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.BUCKET_ID,
      ID.unique(),
      { url: url, title: title },
      [
        Permission.read(Role.user(user.value)),
        Permission.write(Role.user(user.value)),
        Permission.update(Role.user(user.value)),
        Permission.delete(Role.user(user.value)),
      ],
    );
    await getTabs(session, setTabs);
  } catch (e) {
    console.error(e);
  }
}
