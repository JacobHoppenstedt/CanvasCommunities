// web-platform/src/app/(onboard)/personalize/page.tsx
"use client";

import PersonalizePage from "@/app/(app)/personalize/page";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function OnboardPersonalize() {
  const { completeOnboarding } = useAuth();
  const router = useRouter();

  async function finish() {
    console.log("[OnboardWrapper] finish() called - awaiting completeOnboarding()");
    try {
      await completeOnboarding();
      console.log("[OnboardWrapper] completeOnboarding resolved - navigating to /discovery");
      router.push("/discovery");
    } catch (err) {
      console.error("[OnboardWrapper] completeOnboarding error", err);
    }
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