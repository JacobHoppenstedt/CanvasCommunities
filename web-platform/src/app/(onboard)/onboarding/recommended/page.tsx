"use client";

import RecommendedPage from "@/app/(app)/recommended/page";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function OnboardRecommended() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();

  return (
    <div className="space-y-6">
      <RecommendedPage />
      <div className="flex justify-end">
        <Button
          onClick={() => {
            completeOnboarding();
            router.push("/discovery");
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
