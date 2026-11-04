const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const USER_KEY = "remarket_session";
const TOKEN_KEY = "remarket_token";

export class AuthError extends Error {
  constructor(message, code, status) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.status = status;
  }
}

function storageWithToken() {
  if (sessionStorage.getItem(TOKEN_KEY)) return sessionStorage;
  if (localStorage.getItem(TOKEN_KEY)) return localStorage;
  return null;
}

function saveSession({ token, user }, remember) {
  const target = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;
  other.removeItem(TOKEN_KEY);
  other.removeItem(USER_KEY);
  target.setItem(TOKEN_KEY, token);
  target.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new AuthError(
      "The server is unavailable. Check that the API and MongoDB are running.",
      "NETWORK_ERROR",
      0,
    );
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    throw new AuthError(
      data?.message || "Authentication failed. Please try again.",
      data?.code || "AUTH_ERROR",
      response.status,
    );
  }
  return data;
}

export function getSession() {
  const storage = storageWithToken();
  if (!storage) return null;
  try {
    return JSON.parse(storage.getItem(USER_KEY));
  } catch {
    clearSession();
    return null;
  }
}

export async function restoreSession() {
  const storage = storageWithToken();
  if (!storage) return null;
  try {
    const data = await request("/auth/me", {
      headers: { Authorization: `Bearer ${storage.getItem(TOKEN_KEY)}` },
    });
    storage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  } catch {
    clearSession();
    return null;
  }
}

export async function signup({ name, email, password }) {
  const data = await request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  saveSession(data, true);
  return data.user;
}

export async function login({ email, password, remember }) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, remember }),
  });
  saveSession(data, remember);
  return data.user;
}

export function logout() {
  const storage = storageWithToken();
  const token = storage?.getItem(TOKEN_KEY);
  clearSession();
  if (token) {
    request("/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
}
