import { getTabs } from './tabs.js';
import { Account, Client, Databases } from 'appwrite';

export class Session {
    constructor() {
        this.client = new Client()
            .setEndpoint("https://cloud.appwrite.io/v1")
            .setProject('650a139471b25458406f');
        this.account = new Account(this.client);
        this.database = new Databases(this.client);
    }
}

export function createSession(session, hooks) {
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

export async function getSession(session, hooks) {
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