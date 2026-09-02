// Lets code outside the React tree (e.g. the axios response interceptor in
// api/client.ts) trigger client-side navigation instead of a hard
// `window.location.href` reload. A hard reload wipes the entire SPA
// history stack and any in-memory state, which is what was making the
// browser Back button behave inconsistently after a 401 (expired token)
// fired mid-flow. App.tsx registers the real `navigate` function on mount.
let navigateRef: ((path: string, opts?: { replace?: boolean }) => void) | null = null;

export function setAppNavigator(
  fn: (path: string, opts?: { replace?: boolean }) => void
) {
  navigateRef = fn;
}

export function redirectToLogin() {
  if (navigateRef) {
    navigateRef('/login', { replace: true });
  } else {
    // Fallback for the rare case this fires before the router has mounted.
    window.location.href = '/login';
  }
}