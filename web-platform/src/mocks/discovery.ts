export type DiscoveryClub = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  nextMeeting: {
    title: string;
    datetime: string;
    location: string;
  };
  logoSrc: string;
  bannerSrc?: string;
};

export const discoveryClubs: DiscoveryClub[] = [
  {
    id: "gator-grilling",
    name: "Gator Grilling Club",
    description:
      "Fire up the grill with fellow Gators, learn new recipes, and host campus cookouts all semester long.",
    tags: ["Food", "Social", "Community"],
    nextMeeting: {
      title: "GBM #1",
      datetime: "Thu · 7:00 PM",
      location: "Reitz Union Patio",
    },
    logoSrc: "/avatars/gator-grilling.png",
    bannerSrc: "/gator-hero.png",
  },
  {
    id: "colorstack",
    name: "ColorStack @ UF",
    description:
      "Supporting Black and Latinx CS students with study sessions, interview prep, and networking events.",
    tags: ["Computer Science", "Community", "Career"],
    nextMeeting: {
      title: "Tech Talk Night",
      datetime: "Mon · 6:30 PM",
      location: "CSE E121",
    },
    logoSrc: "/avatars/colorstack.png",
    bannerSrc: "/gator-hero.png",
  },
  {
    id: "acm",
    name: "UF ACM",
    description:
      "Talks, coding nights, and career panels for students interested in software engineering and research.",
    tags: ["Computer Science", "Academic", "Engineering"],
    nextMeeting: {
      title: "Hack Night",
      datetime: "Wed · 7:00 PM",
      location: "CSE Atrium",
    },
    logoSrc: "/avatars/acm.png",
    bannerSrc: "/gator-hero.png",
  },
  {
    id: "surf",
    name: "Gator Surf Club",
    description:
      "Weekend surf trips, sunrise beach meetups, and coastal cleanups with fellow Gators.",
    tags: ["Surfing", "Outdoor", "Social"],
    nextMeeting: {
      title: "Beach Caravan",
      datetime: "Sat · 6:00 AM",
      location: "O-Dome Parking Lot",
    },
    logoSrc: "/avatars/surf.png",
    bannerSrc: "/gator-hero.png",
  },
  {
    id: "intramural-soccer",
    name: "Intramural Soccer League",
    description:
      "Join or form a team for friendly but competitive intramural soccer under the lights.",
    tags: ["Soccer", "Athletics", "Team"],
    nextMeeting: {
      title: "Team Draft Night",
      datetime: "Tue · 8:00 PM",
      location: "Southwest Rec Fields",
    },
    logoSrc: "/avatars/soccer.png",
    bannerSrc: "/gator-hero.png",
  },
  {
    id: "pre-dent",
    name: "Pre-Dental Society",
    description:
      "Shadowing opportunities, DAT prep, and mentorship for students pursuing dentistry.",
    tags: ["Dentistry", "Pre-Health", "Academic"],
    nextMeeting: {
      title: "DAT Tips Panel",
      datetime: "Thu · 5:30 PM",
      location: "HPNP G-101",
    },
    logoSrc: "/avatars/predental.png",
    bannerSrc: "/gator-hero.png",
  },
  {
    id: "animals",
    name: "Wildlife & Animal Care Club",
    description:
      "Volunteer at shelters, learn animal care basics, and help with conservation efforts.",
    tags: ["Animals", "Volunteering", "Community"],
    nextMeeting: {
      title: "Shelter Visit",
      datetime: "Sun · 10:00 AM",
      location: "Alachua County Humane Society",
    },
    logoSrc: "/avatars/animals.png",
    bannerSrc: "/gator-hero.png",
  },
  {
    id: "engineers-without-borders",
    name: "Engineers Without Borders",
    description:
      "Design and build sustainable engineering solutions for communities around the world.",
    tags: ["Engineering", "Community", "Volunteering"],
    nextMeeting: {
      title: "Project Kickoff",
      datetime: "Tue · 7:30 PM",
      location: "Weil 270",
    },
    logoSrc: "/avatars/ewb.png",
    bannerSrc: "/gator-hero.png",
  },
  {
    id: "community-service",
    name: "Gators Give Back",
    description:
      "Weekly service projects around Gainesville focused on food insecurity, housing, and education.",
    tags: ["Community", "Volunteering", "Service"],
    nextMeeting: {
      title: "Service Saturday",
      datetime: "Sat · 9:00 AM",
      location: "Plaza of the Americas",
    },
    logoSrc: "/avatars/service.png",
    bannerSrc: "/gator-hero.png",
  },
  {
    id: "tennis-club",
    name: "UF Tennis Club",
    description:
      "Casual hitting sessions and ladder matches for all skill levels at the campus courts.",
    tags: ["Tennis", "Athletics", "Social"],
    nextMeeting: {
      title: "Open Court Night",
      datetime: "Fri · 6:00 PM",
      location: "Southwest Courts",
    },
    logoSrc: "/avatars/tennis.png",
    bannerSrc: "/gator-hero.png",
  },
  {
    id: "volleyball",
    name: "Campus Volleyball Crew",
    description:
      "Sand and indoor volleyball games after class with a welcoming, social vibe.",
    tags: ["Volleyball", "Athletics", "Social"],
    nextMeeting: {
      title: "Sand Courts Meetup",
      datetime: "Wed · 5:00 PM",
      location: "UVS Sand Courts",
    },
    logoSrc: "/avatars/volleyball.png",
    bannerSrc: "/gator-hero.png",
  },
  {
    id: "community-cooks",
    name: "Community Cooks",
    description:
      "Cook and serve meals for local shelters while learning large-batch recipes.",
    tags: ["Food", "Community", "Service"],
    nextMeeting: {
      title: "Meal Prep Night",
      datetime: "Thu · 6:00 PM",
      location: "Field & Fork Kitchen",
    },
    logoSrc: "/avatars/community-cooks.png",
    bannerSrc: "/gator-hero.png",
  },
];

