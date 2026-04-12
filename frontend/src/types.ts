export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
};

export type UserContextType = {
  user: string | null;
  setUser: (user: string | null) => void;
};
