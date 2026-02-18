"use client";

import RecommendedPage from "@/app/(app)/recommended/page";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function OnboardRecommended() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <RecommendedPage />
      <div className="flex justify-end">
        <Button onClick={() => router.push("/recommended")}>Next</Button>
      </div>
    </div>
  );
}
