export type Interest = {
  id: string;
  label: string;
  category: string;
  selected?: boolean;
};

export const mockInterests: Interest[] = [
  { id: "cs", label: "Computer Science", category: "Academic & Career", selected: true },
  { id: "anthro", label: "Anthropology", category: "Academic & Career", selected: false },
  { id: "robotics", label: "Robotics Engineering", category: "Academic & Career", selected: true },
  { id: "cooking", label: "Cooking", category: "Interests", selected: false },
  { id: "surfing", label: "Surfing", category: "Interests", selected: true },
  { id: "soccer", label: "Soccer", category: "Interests", selected: false },
];
