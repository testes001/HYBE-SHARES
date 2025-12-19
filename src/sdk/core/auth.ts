/**
 * Authentication Integration with Secure Session Cookies
 *
 * This file provides utilities for managing authentication using secure,
 * httpOnly session cookies instead of localStorage to prevent XSS attacks.
 *
 * Usage in React components:
 * 1. Use the useCreaoAuth() hook to access auth state
 * 2. Call login() with user credentials
 * 3. Call logout() to end the session
 * 4. API calls automatically include session credentials
 */

import { create } from "zustand";

interface AuthMessage {
	type: "CREAO_AUTH_TOKEN";
	token: string;
	origin: string;
}

type AuthStatus =
	| "authenticated"
	| "unauthenticated"
	| "invalid_token"
	| "loading";

interface AuthState {
	token: string | null;
	status: AuthStatus;
	parentOrigin: string | null;
	userId: string | null;
}

interface AuthStore extends AuthState {
	// Internal state
	initializationPromise: Promise<void> | null;
	validationPromise: Promise<boolean> | null;

	// Actions
	login: (userId: string, additionalData?: Record<string, unknown>) => Promise<boolean>;
	logout: () => Promise<void>;
	setStatus: (status: AuthStatus) => void;
	setState: (state: Partial<AuthState>) => void;
	clearAuth: () => Promise<void>;
	refreshAuth: () => Promise<boolean>;
	initialize: () => Promise<void>;
	validateSession: () => Promise<boolean>;
	refreshSession: () => Promise<boolean>;
}

// Configuration for API endpoints
const API_BASE_URL = import.meta.env.VITE_API_BASE_PATH || "";

/**
 * Zustand store for authentication state management
 */
const useAuthStore = create<AuthStore>(
	(set, get): AuthStore => ({
		// Initial state
		token: null,
		status: "loading",
		parentOrigin: null,
		userId: null,
		initializationPromise: null,
		validationPromise: null,

		// Set status
		setStatus: (status: AuthStatus) => {
			set({ status });
		},

		// Set partial state
		setState: (newState: Partial<AuthState>) => {
			set(newState);
		},

		// Validate session by checking with server
		validateSession: async (): Promise<boolean> => {
			console.log("Validating session...");

			if (!API_BASE_URL) {
				console.warn(
					"API_BASE_URL is not set - skipping session validation. This is only acceptable in development."
				);
				return true;
			}

			try {
				const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
					method: "GET",
					credentials: "include", // Include cookies with request
				});

				console.log("Session validation response:", response.status);
				return response.ok;
			} catch (error) {
				console.warn("Session validation failed:", error);
				return false;
			}
		},

		// Login with user credentials
		login: async (userId: string, additionalData?: Record<string, unknown>): Promise<boolean> => {
			console.log("Logging in user:", userId);

			if (!API_BASE_URL) {
				console.warn("API_BASE_URL is not set - cannot login");
				return false;
			}

			try {
				const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
					method: "POST",
					credentials: "include", // Include and set cookies
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						user_id: userId,
						...additionalData,
					}),
				});

				if (!response.ok) {
					console.error("Login failed:", response.status);
					set({
						status: "invalid_token",
						userId: null,
						token: null,
					});
					return false;
				}

				const data = await response.json();

				set({
					status: "authenticated",
					userId: data.userId,
					token: null, // No longer using token
				});

				console.log("Login successful");
				return true;
			} catch (error) {
				console.error("Login error:", error);
				set({
					status: "unauthenticated",
					userId: null,
					token: null,
				});
				return false;
			}
		},

		// Logout - destroys server session
		logout: async (): Promise<void> => {
			console.log("Logging out...");

			if (API_BASE_URL) {
				try {
					await fetch(`${API_BASE_URL}/api/auth/logout`, {
						method: "POST",
						credentials: "include",
					});
				} catch (error) {
					console.warn("Error during logout API call:", error);
				}
			}

			set({
				token: null,
				status: "unauthenticated",
				parentOrigin: null,
				userId: null,
			});

			console.log("Logout complete");
		},

		// Clear authentication
		clearAuth: async (): Promise<void> => {
			set({
				token: null,
				status: "unauthenticated",
				parentOrigin: null,
				userId: null,
			});
		},

		// Refresh authentication state by re-validating the current session
		refreshAuth: async (): Promise<boolean> => {
			const { validateSession } = get();

			const isValid = await validateSession();
			if (!isValid) {
				set({ status: "invalid_token" });
				return false;
			}

			set({ status: "authenticated" });
			return true;
		},

		// Refresh session timeout
		refreshSession: async (): Promise<boolean> => {
			if (!API_BASE_URL) {
				return false;
			}

			try {
				const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
					method: "POST",
					credentials: "include",
				});

				if (!response.ok) {
					console.warn("Session refresh failed:", response.status);
					return false;
				}

				console.log("Session refreshed");
				return true;
			} catch (error) {
				console.error("Session refresh error:", error);
				return false;
			}
		},

		// Initialize the authentication system
		initialize: async (): Promise<void> => {
			console.log("Auth initialization started");
			try {
				// Check if there's an active session
				await initializeFromServer(get, set);

				// Initialize from URL (legacy support)
				await initializeFromUrl(get);

				// Setup message listener
				setupMessageListener(get);

				// If still loading after initialization, set to unauthenticated
				const currentStatus = get().status;
				if (currentStatus === "loading") {
					console.log(
						"Auth initialization complete - setting to unauthenticated"
					);
					set({ status: "unauthenticated" });
				} else {
					console.log("Auth initialization complete - status:", currentStatus);
				}
			} catch (error) {
				console.error("Auth initialization failed:", error);
				set({ status: "unauthenticated" });
			}
		},
	})
);

/**
 * Initialize authentication from server session
 */
async function initializeFromServer(
	get: () => AuthStore,
	set: (state: Partial<AuthStore>) => void,
): Promise<void> {
	console.log("Checking for active server session...");

	const API_BASE_URL = import.meta.env.VITE_API_BASE_PATH || "";
	if (!API_BASE_URL) {
		console.log("No API_BASE_URL set - skipping server session check");
		set({ status: "unauthenticated" });
		return;
	}

	try {
		const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
			method: "GET",
			credentials: "include", // Include session cookies
		});

		if (response.ok) {
			const data = await response.json();
			console.log("Found active session for user:", data.userId);
			set({
				userId: data.userId,
				status: "authenticated",
				token: null,
			});
		} else {
			console.log("No active session found");
			set({ status: "unauthenticated" });
		}
	} catch (error) {
		console.warn("Error checking for server session:", error);
		set({ status: "unauthenticated" });
	}
}

/**
 * Initialize authentication from URL parameters (legacy support)
 */
async function initializeFromUrl(get: () => AuthStore): Promise<void> {
	const urlParams = new URLSearchParams(window.location.search);
	const authToken = urlParams.get("auth_token");

	if (authToken) {
		console.log("Found auth_token in URL, logging in...");
		const { login } = get();
		await login("url_auth_user");
		cleanupUrl();
	}
}

/**
 * Setup listener for postMessage from parent window (legacy support)
 */
function setupMessageListener(get: () => AuthStore): void {
	window.addEventListener("message", async (event: MessageEvent) => {
		try {
			const data = event.data as AuthMessage;

			if (data?.type === "CREAO_AUTH_TOKEN" && data.token) {
				const { login } = get();
				await login("message_auth_user");
			}
		} catch (error) {
			console.warn("Error processing auth message:", error);
		}
	});
}

/**
 * Clean up URL parameters
 */
function cleanupUrl(): void {
	const url = new URL(window.location.href);
	url.searchParams.delete("auth_token");
	window.history.replaceState({}, document.title, url.toString());
}

// Initialize on module load
const initPromise = (async () => {
	const { initialize } = useAuthStore.getState();
	await initialize();
})();

/**
 * Ensure initialization is complete
 */
async function ensureInitialized(): Promise<void> {
	await initPromise;
}

/**
 * React hook for using authentication state
 * @returns Authentication state and helper methods
 */
export function useCreaoAuth() {
	const token = useAuthStore((state) => state.token);
	const status = useAuthStore((state) => state.status);
	const userId = useAuthStore((state) => state.userId);
	const parentOrigin = useAuthStore((state) => state.parentOrigin);
	const login = useAuthStore((state) => state.login);
	const logout = useAuthStore((state) => state.logout);
	const refreshSession = useAuthStore((state) => state.refreshSession);

	return {
		token,
		status,
		userId,
		parentOrigin,
		isAuthenticated: status === "authenticated" && !!userId,
		isLoading: status === "loading",
		hasInvalidToken: status === "invalid_token",
		hasNoToken: status === "unauthenticated",
		login,
		logout,
		refreshSession,
	};
}

/**
 * Initialize authentication integration for built pages
 * Call this when your built application starts
 */
export async function initializeAuthIntegration(): Promise<void> {
	await ensureInitialized();
	console.log("Auth integration initialized");
}

/**
 * Get the current user ID
 */
export function getUserId(): string | null {
	return useAuthStore.getState().userId;
}

/**
 * Get the current user ID (async - ensures initialization)
 */
export async function getUserIdAsync(): Promise<string | null> {
	await ensureInitialized();
	return useAuthStore.getState().userId;
}

/**
 * Check if user is authenticated (async - validates session)
 */
export async function isAuthenticated(): Promise<boolean> {
	await ensureInitialized();

	const { userId, status, validateSession } = useAuthStore.getState();

	// If we already know we're not authenticated, return false
	if (!userId) {
		return false;
	}

	// If we think we're authenticated, return true
	if (status === "authenticated") {
		return true;
	}

	// If we have a userId but haven't validated the session, validate now
	if (userId) {
		const isValid = await validateSession();

		if (isValid) {
			useAuthStore.setState({ status: "authenticated" });
			return true;
		}
		// Clear invalid session
		await useAuthStore.getState().clearAuth();
		return false;
	}

	// Default case - if we get here, return false
	return false;
}

/**
 * Check if user is authenticated (sync - returns current state without validation)
 */
export function isAuthenticatedSync(): boolean {
	const { status, userId } = useAuthStore.getState();
	return status === "authenticated" && !!userId;
}

/**
 * Get the current auth status
 */
export function getAuthStatus(): AuthStatus {
	return useAuthStore.getState().status;
}

/**
 * Get the current auth status (async - ensures initialization)
 */
export async function getAuthStatusAsync(): Promise<AuthStatus> {
	await ensureInitialized();
	return useAuthStore.getState().status;
}

/**
 * Check if token is invalid
 */
export function hasInvalidToken(): boolean {
	return useAuthStore.getState().status === "invalid_token";
}

/**
 * Check if token is invalid (async - ensures initialization)
 */
export async function hasInvalidTokenAsync(): Promise<boolean> {
	await ensureInitialized();
	return useAuthStore.getState().status === "invalid_token";
}

/**
 * Check if no token is provided
 */
export function hasNoToken(): boolean {
	return useAuthStore.getState().status === "unauthenticated";
}

/**
 * Check if no token is provided (async - ensures initialization)
 */
export async function hasNoTokenAsync(): Promise<boolean> {
	await ensureInitialized();
	return useAuthStore.getState().status === "unauthenticated";
}

/**
 * Check if auth is still loading
 */
export function isAuthenticating(): boolean {
	return useAuthStore.getState().status === "loading";
}

/**
 * Get the current auth state
 */
export function getAuthState(): AuthState {
	const { token, status, parentOrigin, userId } = useAuthStore.getState();
	return { token, status, parentOrigin, userId };
}

/**
 * Add a listener for auth state changes
 */
export function addAuthStateListener(
	listener: (state: AuthState) => void,
): () => void {
	// Immediately notify with current state
	const currentState = getAuthState();
	listener(currentState);

	// Subscribe to store changes
	const unsubscribe = useAuthStore.subscribe((state) => {
		const { token, status, parentOrigin, userId } = state;
		listener({ token, status, parentOrigin, userId });
	});

	// Return cleanup function
	return unsubscribe;
}

/**
 * Perform login
 */
export async function login(userId: string, additionalData?: Record<string, unknown>): Promise<boolean> {
	return useAuthStore.getState().login(userId, additionalData);
}

/**
 * Perform logout
 */
export async function logout(): Promise<void> {
	return useAuthStore.getState().logout();
}

/**
 * Clear authentication
 */
export async function clearAuth(): Promise<void> {
	return useAuthStore.getState().clearAuth();
}

/**
 * Refresh authentication state by re-validating the current session
 */
export async function refreshAuth(): Promise<boolean> {
	return useAuthStore.getState().refreshAuth();
}

/**
 * Refresh session timeout
 */
export async function refreshSession(): Promise<boolean> {
	return useAuthStore.getState().refreshSession();
}
