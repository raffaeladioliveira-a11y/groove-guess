const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '01110010';
const STORAGE_KEY = 'admin:isAuthenticated';

export function isAdminAuthenticated(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function loginAdmin(username: string, password: string): boolean {
  const isValid = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  try {
    if (isValid) {
      localStorage.setItem(STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
  return isValid;
}

export function logoutAdmin(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

