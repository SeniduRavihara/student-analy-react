export const INITIAL_DATA_CONTEXT = {
  currentUserData: null,
  setCurrentUserData: () => {},
};

export const INITIAL_AUTH_CONTEXT = {
  currentUser: null,
  setCurrentUser: () => {},
};

export const EXAM_YEARS = [
  { year: "2025", label: "2025 A/L" },
  { year: "2026", label: "2026 A/L" },
  { year: "2027", label: "2027 A/L" },
];

// If you want to add new class catogary, add it to following array
export const CLASSES = ["THEORY", "REVISION"] ;
export type ClassesType = "THEORY" | "REVISION";

export const CLASSES_TO_YEARS = {
  "2025": ["THEORY", "REVISION", "PAPER"],
  "2026": ["THEORY", "PAPER"],
  "2027": ["THEORY", "PAPER"],
};

// Extract the valid years from EXAM_YEARS
