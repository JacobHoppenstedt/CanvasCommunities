"use client";

import PersonalizePage from "@/app/(app)/personalize/page";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function OnboardPersonalize() {
  const { completeOnboarding } = useAuth();
  const router = useRouter();

  function finish() {
    completeOnboarding();
    router.push("/onboarding/recommended");
  }

  return (
    <div className="space-y-6">
      <PersonalizePage />
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button onClick={finish}>Finish</Button>
      </div>
    </div>
  );
}
