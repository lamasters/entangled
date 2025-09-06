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
      <a
        className="tab-button"
        onClick={() => {
          deleteTab(tab, session, setTabs, true);
        }}
        href={tab.url}
        target="_blank"
        rel="noreferrer"
      >
        {title}
      </a>
    </div>
  );
}

export async function getTabs(session, setTabs) {
  try {
    let tabs = await session.client
      .from("tabs")
      .select("*")
      .order("created_at", { ascending: false });
    setTabs(tabs.data);
  } catch (e) {
    console.error(e);
  }
}

export async function deleteTab(tab, session, setTabs) {
  try {
    await session.client.from("tabs").delete().eq("id", tab.id);
    await getTabs(session, setTabs);
  } catch (e) {
    console.error(e);
  }
}

export async function addTab(session, user, url, setTabs) {
  try {
    if (!url.startsWith("http")) url = "https://" + url;
    let title = url;
    if (url.length > 37) title = title.substring(0, 37) + "...";
    await session.client.from("tabs").insert({ url: url, title: title });
    await getTabs(session, setTabs);
  } catch (e) {
    console.error(e);
  }
}
