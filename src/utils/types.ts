
export type User = {
  id?: number;
  username: string;
  email?: string;
  password: string;
}

export type AuthContextValue = {
  user: User | null;
  signup: (username: string,email: string, password: string) => Promise<void>;
  login: (name: string, password: string) => Promise<void>;
  logout: () => void;
}