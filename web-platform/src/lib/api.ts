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
    removeInterest: (userId: number, tagName: string): Promise<User> =>
      request("/api/user/remove-interest", {
        method: "PATCH",
        body: JSON.stringify({ userId, tagName }),
      }),
    getInterests: (userId: number): Promise<{ id: number; name: string }[]> =>
      request(`/api/user/interests?userId=${userId}`, { method: "GET" }),
    joinCommunity: (userId: number, communityId: number): Promise<any> =>
      request("/api/user/join-community", {
        method: "PATCH",
        body: JSON.stringify({ userId, communityId }),
      }),
    getCommunities: (userId: number): Promise<any[]> =>
      request(`/api/user/communities?userId=${userId}`, {
        method: "GET",
      }),
  },
  tags: {
    getAll: (): Promise<{ id: number; name: string }[]> =>
      request("/api/tags", { method: "GET" }),
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
    getById: (id: number): Promise<Community> =>
      request(`/api/community/get?id=${id}`, { method: "GET" }),
    createEvent: (event: any) =>
      request("/api/community/event/create", { method: "POST", body: JSON.stringify(event) }),
    createAnnouncement: (announcement: any) =>
      request("/api/community/announcement/create", { method: "POST", body: JSON.stringify(announcement) }),
    uploadImage: (image: any) =>
      request("/api/community/gallery/upload", { method: "POST", body: JSON.stringify(image) }),
  },
  role: {
    create: (name: string, communityId: number) =>
      request("/api/role", { method: "POST", body: JSON.stringify({ name, communityId }) }),
    assign: (userId: number, roleId: number) =>
      request("/api/role", { method: "POST", body: JSON.stringify({ userId, roleId }) }),
    getById: (roleId: number) => request(`/api/role?roleId=${roleId}`, { method: "GET" }),
    getByCommunity: (communityId: number) => request(`/api/role?communityId=${communityId}`, { method: "GET" }),
    getByUser: (userId: number) => request(`/api/role?userId=${userId}`, { method: "GET" }),
    update: (id: number, name: string) => request("/api/role", { method: "PATCH", body: JSON.stringify({ id, name }) }),
    delete: (roleId: number) => request(`/api/role?roleId=${roleId}`, { method: "DELETE" }),
    removeUserRole: (userId: number, roleId: number) =>
      request(`/api/role?roleId=${roleId}&userId=${userId}`, { method: "DELETE" }),
  }
};