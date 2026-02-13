export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string; // human-friendly
  time?: string;
  location?: string;
  attendance?: string;
  type: "GBM" | "Social" | "Athletic" | "Casual Coding" | string;
  rsvped?: boolean;
  clubId?: string;
};

export const mockEvents: EventItem[] = [
  {
    id: "event-1",
    title: "GBM #1",
    description:
      "General body meeting covering upcoming plans, introductions, and social activities.",
    date: "2026-12-08",
    time: "2:00 PM",
    location: "NZH 0112",
    attendance: "200–250",
    type: "GBM",
    rsvped: true,
    clubId: "club-2",
  },
  {
    id: "event-2",
    title: "Social Night",
    description: "Casual social gathering with games and food.",
    date: "2026-12-15",
    time: "6:00 PM",
    location: "Student Union",
    attendance: "100+",
    type: "Social",
    rsvped: false,
    clubId: "club-1",
  },
  {
    id: "event-3",
    title: "Casual Coding #1",
    description: "Low-pressure coding session for members.",
    date: "2026-12-20",
    time: "5:00 PM",
    location: "CSE E222",
    attendance: "50–75",
    type: "Casual Coding",
    rsvped: true,
    clubId: "club-3",
  },
];
