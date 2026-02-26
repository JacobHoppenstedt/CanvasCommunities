"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");

  function handleLogin() {
    login({ id: "1", name });
    router.push("/onboarding/personalize");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Sign in</h2>
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button className="w-full" onClick={handleLogin}>
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
