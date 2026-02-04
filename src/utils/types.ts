
export type User = {
  id?: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export type AuthContextValue = {
  user: User | null;
  signup: (username: string, password: string, firstName: string, lastName: string) => Promise<void>;
  login: (name: string, password: string) => Promise<void>;
  logout: () => void;
}

export type Profile = {
  id: number;
  username: string;
    aboutMe?: string;
    displayName?: string;
    profilePictureUrl?: string;
    location?: string;
    birthdate?: string;
    gender?: string;
    secondaryImageUrl?: string;
    phoneNumber?: string;
}