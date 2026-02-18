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
    if (!user) {
      router.push("/login");
      return;
    }

    if (!onboarded && !pathname.startsWith("/onboarding")) {
      router.push("/onboarding/recommended");
    }
  }, [user, onboarded, pathname]);

  return <Layout>{children}</Layout>;
}
