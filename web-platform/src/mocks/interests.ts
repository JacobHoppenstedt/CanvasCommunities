export type Interest = {
  id: string;
  label: string;
  category: string;
  selected?: boolean;
};

export const mockInterests: Interest[] = [
  // Academics / Majors
  { id: "cs", label: "Computer Science", category: "Academics", selected: true },
  { id: "datasci", label: "Data Science", category: "Academics", selected: true },
  { id: "swe", label: "Software Engineering", category: "Academics", selected: true },
  { id: "aiml", label: "AI / Machine Learning", category: "Academics", selected: true },
  { id: "ux", label: "UX Design", category: "Academics", selected: false },
  { id: "pm", label: "Product Management", category: "Academics", selected: false },
  { id: "cyber", label: "Cybersecurity", category: "Academics", selected: false },
  { id: "business", label: "Business", category: "Academics", selected: false },
  { id: "finance", label: "Finance", category: "Academics", selected: false },
  { id: "accounting", label: "Accounting", category: "Academics", selected: false },
  { id: "econ", label: "Economics", category: "Academics", selected: false },
  { id: "marketing", label: "Marketing", category: "Academics", selected: false },
  { id: "psych", label: "Psychology", category: "Academics", selected: true },
  { id: "bio", label: "Biology", category: "Academics", selected: false },
  { id: "chem", label: "Chemistry", category: "Academics", selected: false },
  { id: "physics", label: "Physics", category: "Academics", selected: false },
  { id: "mecheng", label: "Mechanical Engineering", category: "Academics", selected: true },
  { id: "ee", label: "Electrical Engineering", category: "Academics", selected: false },
  { id: "ce", label: "Civil Engineering", category: "Academics", selected: false },
  { id: "indeng", label: "Industrial Engineering", category: "Academics", selected: false },
  { id: "robotics", label: "Robotics Engineering", category: "Academics", selected: true },
  { id: "premed", label: "Pre-Med", category: "Academics", selected: true },
  { id: "prelaw", label: "Pre-Law", category: "Academics", selected: false },
  { id: "entre", label: "Entrepreneurship", category: "Academics", selected: true },

  // Interests & Hobbies
  { id: "photo", label: "Photography", category: "Interests & Hobbies", selected: false },
  { id: "music", label: "Music", category: "Interests & Hobbies", selected: true },
  { id: "gaming", label: "Gaming", category: "Interests & Hobbies", selected: false },
  { id: "cooking", label: "Cooking", category: "Interests & Hobbies", selected: false },
  { id: "soccer", label: "Soccer", category: "Interests & Hobbies", selected: false },
  { id: "basketball", label: "Basketball", category: "Interests & Hobbies", selected: false },
  { id: "running", label: "Running", category: "Interests & Hobbies", selected: false },
  { id: "hiking", label: "Hiking", category: "Interests & Hobbies", selected: false },
];
