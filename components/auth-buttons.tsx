"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function AuthButtons() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const username = useQuery(
    api.users.currentUsername,
    isAuthenticated ? {} : "skip",
  );

  // Avoid flashing the wrong buttons while the auth state is resolving.
  if (isLoading) {
    return <div className="h-9" aria-hidden />;
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        {username ? (
          <span className="text-sm font-medium text-muted-foreground">
            {username}
          </span>
        ) : null}
        <Button
          variant="outline"
          disabled={signingOut}
          onClick={async () => {
            setSigningOut(true);
            try {
              await signOut();
              router.push("/signin");
            } finally {
              setSigningOut(false);
            }
          }}
        >
          {signingOut ? "Signing out…" : "Sign out"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/signin" className={buttonVariants({ variant: "ghost" })}>
        Sign in
      </Link>
      <Link href="/signup" className={buttonVariants()}>
        Sign up
      </Link>
    </div>
  );
}
