"use client";

import { useSignInWithGithub } from "@convex-dev/auth/methods/github/react";
import { useSignInWithGoogle } from "@convex-dev/auth/methods/google/react";
import { useOauth } from "@convex-dev/auth/methods/oauth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

type Provider = "github" | "google";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.39-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.28a12 12 0 0 0 0 10.8l4.01-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.28 6.6l4.01 3.11C6.23 6.88 8.88 4.77 12 4.77Z"
      />
    </svg>
  );
}

/**
 * "Continue with GitHub / Google" buttons. Starting a flow redirects to the
 * provider; the provider sends the user back to this page, where the auth
 * provider redeems the code automatically. Failures from that return trip
 * surface as `flowError`.
 */
export default function OauthButtons() {
  const github = useSignInWithGithub(api.auth);
  const google = useSignInWithGoogle(api.auth);
  const { flowError } = useOauth();
  const [pending, setPending] = useState<Provider | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();

  // After the provider redirects back here and the code is redeemed, the
  // user is signed in; move them on to the app.
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const start = async (provider: Provider) => {
    setStartError(null);
    setPending(provider);
    const result = await (provider === "github" ? github : google).signIn();
    if (result.status === "redirect") {
      // The browser is navigating to the provider; keep the button disabled.
      return;
    }
    setPending(null);
    switch (result.userError.error) {
      case "OTHER_ERROR":
        console.error(`${provider} sign-in failed:`, result.userError.cause);
        setStartError("Couldn't start sign-in. Please try again.");
        break;
      default:
        result.userError.error satisfies never;
    }
  };

  const flowErrorMessage = (() => {
    if (flowError === null) return null;
    switch (flowError.error) {
      case "ACCESS_DENIED":
        return "Sign-in was cancelled.";
      case "EXPIRED":
        return "That sign-in link expired. Please try again.";
      case "INVALID_FLOW":
        return "That sign-in couldn't be completed. Please try again.";
      case "OTHER_ERROR":
        console.error("OAuth sign-in failed:", flowError.cause);
        return "Something went wrong. Please try again.";
      default:
        flowError satisfies never;
        return "Something went wrong. Please try again.";
    }
  })();

  const error = startError ?? flowErrorMessage;

  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={pending !== null}
        onClick={() => start("github")}
      >
        <GithubIcon />
        {pending === "github" ? "Redirecting…" : "Continue with GitHub"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={pending !== null}
        onClick={() => start("google")}
      >
        <GoogleIcon />
        {pending === "google" ? "Redirecting…" : "Continue with Google"}
      </Button>
      {error ? (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
