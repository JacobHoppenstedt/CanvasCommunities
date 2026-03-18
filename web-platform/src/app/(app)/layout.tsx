// web-platform/src/app/(app)/layout.tsx  (or src/app/layout.tsx — put it where your current AppLayout is)
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Layout from "@/components/Layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, onboarded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("[AppLayout] auth state", { user, onboarded, pathname });

    // If not logged in → go to login
    if (!user) {
      console.log("[AppLayout] no user -> redirect to /login");
      router.push("/login");
      return;
    }

    // If user hasn't completed onboarding -> redirect to onboarding personalize
    if (!onboarded && !pathname.startsWith("/onboarding")) {
      console.log("[AppLayout] user not onboarded -> redirect to /onboarding/personalize");
      router.push("/onboarding/personalize");
      return;
    }

  }, [user, onboarded, pathname, router]);

  return <Layout>{children}</Layout>;
}