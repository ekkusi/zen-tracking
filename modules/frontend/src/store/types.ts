import { User } from "@ekeukko/zen-tracking-backend/lib/types/user";

export type ActionTypes = {
  updateUser: (user: User | null) => void;
};

export type GlobalState = {
  currentUser: User | null;
};
