"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSignup(e?: React.FormEvent) {
    e?.preventDefault();
    // Mock create account
    const id = `u_${Date.now()}`;
    login({ id, name: name || "Student" });
    router.push("/recommended"); // onboarding will handle redirect to onboard pages if not completed
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Create account</h2>
          <p className="text-sm text-muted-foreground">
            Create an account to save your preferences.
          </p>

          <form onSubmit={handleSignup} className="space-y-3">
            <div>
              <label className="text-sm block mb-1">Full name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <label className="text-sm block mb-1">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="flex justify-between items-center mt-4">
              <Button type="submit">Create account</Button>
              <Button variant="link" onClick={() => router.push("/login")}>
                Already have an account?
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
