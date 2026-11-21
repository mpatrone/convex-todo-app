import { components, internal } from "./_generated/api";
import { env } from "./_generated/server";
import { setupConvexAuth } from "@convex-dev/auth/server";
import { setupGithub } from "@convex-dev/auth/methods/github/server";
import { setupGoogle } from "@convex-dev/auth/methods/google/server";
import { setupUsernamePassword } from "@convex-dev/auth/methods/username-password/server";

// The core owns sessions and JWT minting. Each sign-in method is wired to it
// with its own setup function, and only hands back its functions once the app
// attaches the callbacks that create its user rows. Each sign-in method
// exposes the functions its client hooks call, like
// `signUpWithUsernamePassword` / `signInWithUsernamePassword` for the password
// one.
// Under SSR those calls get proxied to Convex via the SSR host. The sign-in
// functions exposed here are wired up to be proxied in src/lib/serverAuth.ts.
const auth = setupConvexAuth({ component: components.auth });
export const { signOut, refreshSession, isAuthenticated } = auth;

// `onSignIn` is optional, and runs on every sign-in including the first. This
// app uses it to stamp the user's last sign-in.
export const { signUpWithUsernamePassword, signInWithUsernamePassword } =
  setupUsernamePassword(auth, {
    component: components.authPassword,
    usernameComponent: components.authUsername,
  }).attachUserCallbacks({
    createUser: internal.users.createUser,
    // onSignIn: internal.users.onSignIn,
  });

// OAuth: the redirect comes back to the Next.js app, so its origin(s) must be
// allowed. Set OAUTH_REDIRECT_ORIGINS (comma-separated) on other deployments.
const allowedRedirectOrigins = env.OAUTH_REDIRECT_ORIGINS?.split(",") ?? [
  "http://localhost:3000",
];

export const { startSignInWithGithub, completeSignInWithGithub } = setupGithub(
  auth,
  {
    component: components.authGithub,
    allowedRedirectOrigins,
  },
).attachUserCallbacks({
  createUser: internal.users.createUser,
});

export const { startSignInWithGoogle, completeSignInWithGoogle } = setupGoogle(
  auth,
  {
    component: components.authGoogle,
    allowedRedirectOrigins,
  },
).attachUserCallbacks({
  createUser: internal.users.createUser,
});
