export interface College {
  id: string;
  name: string;
  shortName: string;
  location: string;
  state: string;
  type: "Government" | "Deemed" | "Private";
  rating: number;
  fees: number;
  established: number;
  ranking: number;
  placementRate: number;
  avgPackage: number;
  highestPackage: number;
  overview: string;
  color: string;
  streams: string[];
  courses: string[];
  tags: string[];
}

export interface Review {
  id: string;
  collegeId: string;
  userId: string;
  rating: number;
  text: string;
  user: { name: string };
  createdAt: string;
}

export interface Answer {
  id: string;
  userId: string;
  text: string;
  upvotes: number;
  user: { name: string };
  createdAt: string;
}

export interface Question {
  id: string;
  collegeId: string | null;
  userId: string;
  question: string;
  upvotes: number;
  user: { name: string };
  createdAt: string;
  answers: Answer[];
}

export interface SearchFilters {
  q?: string;
  type?: string;
  stream?: string;
  state?: string;
  sort?: "ranking" | "rating" | "fees_low" | "fees_high" | "package";
  page?: number;
  limit?: number;
}
