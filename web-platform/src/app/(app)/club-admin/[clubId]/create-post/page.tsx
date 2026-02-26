"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function CreatePostPage() {
  const router = useRouter();
  const [type, setType] = useState("announcement");

  const [form, setForm] = useState({
    title: "",
    content: "",
    notifyFollowers: false,
    recommend: false,
  });

  const handleSubmit = async () => {
    console.log("Post:", { type, ...form });
    router.back();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">
            Create a Post
          </h1>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs
            defaultValue="announcement"
            onValueChange={(v) => setType(v)}
          >
            <TabsList>
              <TabsTrigger value="announcement">
                Announcement
              </TabsTrigger>
              <TabsTrigger value="event">
                Event
              </TabsTrigger>
            </TabsList>

            <TabsContent value="announcement" />
            <TabsContent value="event" />
          </Tabs>

          {/* Title */}
          <div className="space-y-2">
            <Label>Post Title</Label>
            <Input
              placeholder="Enter title..."
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Post Content</Label>
            <Textarea
              placeholder="Write your post..."
              value={form.content}
              onChange={(e) =>
                setForm({ ...form, content: e.target.value })
              }
            />
          </div>

          {type === "event" && (
            <div className="space-y-4 border-t pt-4">
              <h2 className="text-sm font-medium">
                Event Details
              </h2>

              <Input type="date" />
              <Input type="time" />
              <Input placeholder="Location" />
            </div>
          )}

          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={form.notifyFollowers}
                onCheckedChange={(v) =>
                  setForm({
                    ...form,
                    notifyFollowers: Boolean(v),
                  })
                }
              />
              <Label>Notify Followers</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={form.recommend}
                onCheckedChange={(v) =>
                  setForm({
                    ...form,
                    recommend: Boolean(v),
                  })
                }
              />
              <Label>Recommend to Interested Users</Label>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>

          <div className="flex gap-2">
            <Button variant="outline">
              Preview
            </Button>
            <Button variant="outline">
              Save Draft
            </Button>
            <Button onClick={handleSubmit}>
              Post
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}