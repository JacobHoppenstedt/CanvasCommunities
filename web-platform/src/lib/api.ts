// web-platform/src/lib/api.ts
type User = {
  id: number;
  username: string;
  interests: { id: number; name: string }[];
  memberships: { id: number; communityId: number }[];
};

type Community = {
  id: number;
  name: string;
  tags: { id: number; name: string }[];
  members: { id: number; userId: number }[];
};

async function request<T>(url: string, options: RequestInit): Promise<T> {
  console.log("[api] request >", url, { method: options.method, body: options?.body ? JSON.parse(String(options.body)) : undefined });

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data: any;
  try {
    data = await res.json();
  } catch (e) {
    console.warn("[api] non-json response", url, e);
    throw new Error("API returned non-JSON response");
  }

  if (!res.ok) {
    console.error("[api] request failed <", url, res.status, data);
    throw new Error(data.error || "API request failed");
  }

  console.log("[api] response <", url, data);
  return data;
}

export const api = {
  user: {
    getAll: (): Promise<User[]> => request("/api/user/all", { method: "GET" }),
    create: (username: string, password: string): Promise<User> =>
      request("/api/user/create", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }),
    addInterest: (userId: number, tagName: string): Promise<User> =>
      request("/api/user/add-interest", {
        method: "PATCH",
        body: JSON.stringify({ userId, tagName }),
      }),
    joinCommunity: (userId: number, communityId: number): Promise<any> =>
      request("/api/user/join-community", {
        method: "POST",
        body: JSON.stringify({ userId, communityId }),
      }),
    getCommunities: (userId: number): Promise<Community[]> =>
      request(`/api/user/communities?userId=${userId}`, { method: "GET" }),
  },
  community: {
    create: (name: string): Promise<Community> =>
      request("/api/community/create", {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    addTag: (communityId: number, tagName: string): Promise<Community> =>
      request("/api/community/add-tag", {
        method: "PATCH",
        body: JSON.stringify({ communityId, tagName }),
      }),
    getRecommended: (userId: number): Promise<Community[]> =>
      request(`/api/community/recommend?userId=${userId}`, { method: "GET" }),
  },
};