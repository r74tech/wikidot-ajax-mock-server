// src/data/store.ts
import type {
	AppStore,
	Category,
	File,
	Forum,
	Page,
	Session,
	Site,
	User,
} from "../types";
import {
	initialCategories,
	initialFiles,
	initialForums,
	initialPages,
	initialSessions,
	initialSites,
	initialUsers,
} from "./initial-state";

// Create a simple in-memory store
class Store implements AppStore {
	users: User[] = [...initialUsers];
	pages: Page[] = [...initialPages];
	sites: Site[] = [...initialSites];
	categories: Category[] = [...initialCategories];
	forums: Forum[] = [...initialForums];
	files: File[] = [...initialFiles];
	sessions: Session[] = [...initialSessions];

	// User methods
	getUser(id: number): User | undefined {
		return this.users.find((u) => u.id === id);
	}

	getUserByName(name: string): User | undefined {
		return this.users.find((u) => u.name.toLowerCase() === name.toLowerCase());
	}

	getUserByEmail(email: string): User | undefined {
		return this.users.find(
			(u) => u.email.toLowerCase() === email.toLowerCase(),
		);
	}

	addUser(userData: Omit<User, "id">): User {
		const id = Math.max(...this.users.map((u) => u.id), 0) + 1;
		const user = { ...userData, id };
		this.users.push(user);
		return user;
	}

	updateUser(id: number, updates: Partial<User>): User | undefined {
		const index = this.users.findIndex((u) => u.id === id);
		if (index !== -1) {
			this.users[index] = { ...this.users[index], ...updates };
			return this.users[index];
		}
		return undefined;
	}

	// Page methods
	getPage(id: number): Page | undefined {
		return this.pages.find((p) => p.id === id);
	}

	getPageByUnixName(unixName: string): Page | undefined {
		return this.pages.find((p) => p.unixName === unixName);
	}

	addPage(pageData: Omit<Page, "id">): Page {
		const id = Math.max(...this.pages.map((p) => p.id), 0) + 1;
		const page = { ...pageData, id };
		this.pages.push(page);
		return page;
	}

	updatePage(id: number, updates: Partial<Page>): Page | undefined {
		const index = this.pages.findIndex((p) => p.id === id);
		if (index !== -1) {
			this.pages[index] = { ...this.pages[index], ...updates };
			return this.pages[index];
		}
		return undefined;
	}

	deletePage(id: number): boolean {
		const initialLength = this.pages.length;
		this.pages = this.pages.filter((p) => p.id !== id);
		return this.pages.length !== initialLength;
	}

	// Site methods
	getSite(id: number): Site | undefined {
		return this.sites.find((s) => s.id === id);
	}

	getSiteByUnixName(unixName: string): Site | undefined {
		return this.sites.find((s) => s.unixName === unixName);
	}

	// Session methods
	createSession(userId: number): Session {
		const token =
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15);
		const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours from now
		const session: Session = {
			userId,
			token,
			createdAt: Date.now(),
			expiresAt,
		};
		this.sessions.push(session);
		return session;
	}

	getSessionByToken(token: string): Session | undefined {
		return this.sessions.find(
			(s) => s.token === token && s.expiresAt > Date.now(),
		);
	}

	deleteSession(token: string): boolean {
		const initialLength = this.sessions.length;
		this.sessions = this.sessions.filter((s) => s.token !== token);
		return this.sessions.length !== initialLength;
	}

	// Add more methods as needed
}

export const store = new Store();
