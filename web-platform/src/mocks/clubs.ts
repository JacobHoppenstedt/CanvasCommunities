export type Club = {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
  tags: string[];
  joined?: boolean;
};

export const mockClubs: Club[] = [
  {
    id: "club-1",
    name: "Gator Grilling Club",
    description:
      "A community for students who enjoy cooking, grilling, and hosting social food events on campus.",
    avatarUrl: "/avatars/gator-grilling.png",
    tags: ["Social", "Food"],
    joined: false,
  },
  {
    id: "club-2",
    name: "ColorStack",
    description:
      "Supporting Black & Latinx CS students with workshops and networking.",
    avatarUrl: "/avatars/colorstack.png",
    tags: ["Tech", "Community"],
    joined: true,
  },
  {
    id: "club-3",
    name: "ACM",
    description:
      "Association for Computing Machinery: talks, hack nights, career events.",
    avatarUrl: "/avatars/acm.png",
    tags: ["Academic", "Computer Science"],
    joined: false,
  },
  {
    id: "club-4",
    name: "Surf Club",
    description: "Beach trips, surf sessions, and coastal social events.",
    avatarUrl: "/avatars/surf.png",
    tags: ["Athletic", "Outdoor"],
    joined: true,
  },
];
