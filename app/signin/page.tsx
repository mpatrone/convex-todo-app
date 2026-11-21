"use client";

import { useSignInWithUsernamePassword } from "@convex-dev/auth/methods/username-password/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OauthButtons from "@/components/oauth-buttons";

export default function LogIn() {
  const { signIn, pending } = useSignInWithUsernamePassword(api.auth);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex grow items-center justify-center py-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Log in</CardTitle>
          <CardDescription>Enter your username and password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="signin-form"
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              const result = await signIn({ username, password });
              if (result.status === "complete") {
                router.push("/");
                return;
              }
              setError(() => {
                switch (result.userError.error) {
                  case "USER_NOT_FOUND":
                    return "No account exists with that username.";
                  case "INVALID_CREDENTIALS":
                    return "Incorrect username or password.";
                  case "PASSWORD_TOO_SHORT":
                    return `Password must be at least ${result.userError.minimumLength} characters.`;
                  case "PASSWORD_TOO_LONG":
                    return `Password must be at most ${result.userError.maximumLength} characters.`;
                  case "PASSWORD_HAS_SURROUNDING_WHITESPACE":
                    return "Password can't start or end with whitespace.";
                  case "RATE_LIMITED":
                    return `Too many attempts. Try again in ${Math.ceil(result.userError.retryAfterMs / 1000)} seconds.`;
                  case "OTHER_ERROR":
                    // The mutation threw unexpectedly; the original error is
                    // available on `cause` if you want to log or inspect it.
                    console.error("Sign-in failed:", result.userError.cause);
                    return "Something went wrong. Please try again.";
                  default:
                    result.userError satisfies never;
                    console.error("Sign-in failed:", result.userError);
                    return "Something went wrong. Please try again.";
                }
              });
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                // Using a static id to help password managers behave correctly
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                disabled={pending}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                // Using a static id to help password managers behave correctly
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={pending}
              />
            </div>
            {error ? (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            ) : null}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            form="signin-form"
            className="w-full"
            disabled={pending}
          >
            {pending ? "Logging in…" : "Log in"}
          </Button>
          <div className="flex w-full items-center gap-3 text-xs uppercase text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>
          <OauthButtons />
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
