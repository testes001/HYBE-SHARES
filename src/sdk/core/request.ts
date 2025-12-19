import { getUserIdAsync } from "./auth";
import { reportToParentWindow } from "./internal/creao-shell";

const API_BASE_PATH = import.meta.env.VITE_MCP_API_BASE_PATH;

/**
 * a simple wrapper for `fetch` with authentication and error handling
 *
 * Automatically includes session cookies (credentials: 'include')
 * for secure server-side session management.
 */
export async function platformRequest(
	url: string | URL | Request,
	options: RequestInit = {},
): Promise<Response> {
	const userId = await getUserIdAsync();
	const method = options.method || "GET";

	const headers = new Headers(options.headers);

	if (typeof url === 'object' && url && 'headers' in url) {
		url.headers?.forEach?.((value, key) => {
			headers.set(key, value);
		});
	}
	if (!headers.has("Content-Type") && method !== "GET") {
		headers.set("Content-Type", "application/json");
	}

	let realUrl: URL | string | Request;

	if (typeof url === "string") {
		if (API_BASE_PATH) {
			realUrl = new URL(url, API_BASE_PATH);
		} else {
			// If no API_BASE_PATH is set and url is relative, construct a proper error
			if (!url.startsWith('http://') && !url.startsWith('https://')) {
				throw new Error(`Cannot make request to relative URL "${url}" without VITE_MCP_API_BASE_PATH environment variable set`);
			}
			realUrl = url;
		}
	} else {
		realUrl = url;
	}

	const response = await fetch(realUrl, {
		...options,
		headers,
		credentials: 'include', // Include cookies with all requests for session management
	});

	reportToParentWindow({
		type: "platform-request",
		timestamp: new Date().toISOString(),
		url: response.url,
		method,
		status: response.status,
		responseHeaders: Object.fromEntries(response.headers.entries()),
	})

	return response;
}

/**
 * simpler wrapper for `platformRequest` with common methods
 *
 * eg: `platformApi.get("/api/users").then(r=>r.json())`
 */
export const platformApi = {
	get: async (url: string, options?: RequestInit) => {
		return platformRequest(url, { ...options, method: "GET" });
	},

	post: async (url: string, data?: unknown, options?: RequestInit) => {
		return platformRequest(url, {
			...options,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
			body: data ? JSON.stringify(data) : undefined,
		});
	},

	put: async (url: string, data?: unknown, options?: RequestInit) => {
		return platformRequest(url, {
			...options,
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
			body: data ? JSON.stringify(data) : undefined,
		});
	},

	delete: async (url: string, options?: RequestInit) => {
		return platformRequest(url, { ...options, method: "DELETE" });
	},
};
