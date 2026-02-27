"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export default function CreateCommunityPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    tags: [],
    email: "",
    logo: null as File | null,
  });

  const handleSubmit = async () => {
    // TODO: Replace with real API call
    console.log("Create community:", form);

    router.push("/discovery");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">
            Create a Community
          </h1>
          <p className="text-sm text-muted-foreground">
            Set up your club’s profile and presence.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label>Community Name</Label>
            <Input
              placeholder="e.g. Robotics Club"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Short Description</Label>
            <Textarea
              placeholder="Brief description of your club..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Category / Tags</Label>
            <Input placeholder="Select tags (API-driven later)" />
          </div>

          {/* Additional Info */}
          <div className="space-y-4 pt-4 border-t">
            <h2 className="text-sm font-medium text-muted-foreground">
              Additional Info (Optional)
            </h2>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Upload Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-md border flex items-center justify-center bg-muted">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <Button variant="outline">
                  Choose File
                </Button>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Primary Contact Email</Label>
              <Input
                type="email"
                placeholder="contact@club.edu"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Community
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}