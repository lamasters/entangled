import { ID, Permission, Role } from 'appwrite';

export function tabItem(tab, session, hooks) {
    return (
        <div className="tab">
            <div onClick={() => { deleteTab(tab, session, hooks) }}>{tab.url}</div>
        </div>
    );
}

export async function getTabs(uid, session, hooks) {
    try {
        let tabs = await session.database.listDocuments(
            "650a25486a53f6902000",
            "650a2552869d0ff7adf9"
        );
        hooks.tabs.set(tabs.documents);
    } catch (e) {
        console.error(e);
    }
}

export async function deleteTab(tab, session, hooks) {
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

export async function addTab(session, hooks) {
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