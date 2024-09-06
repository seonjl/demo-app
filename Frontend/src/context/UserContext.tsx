import { meApiClient } from "@/api/useClient";
import { getAccessToken, removeAccessToken } from "@/lib/utils";
import React, { ReactNode, createContext, useEffect } from "react";

interface User {
  email: string;
}

export interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = React.useState<User | null>(null);
  const accessToken = getAccessToken();

  useEffect(() => {
    if (accessToken) {
      meApiClient
        .getMe()
        .then((response) => {
          setUser({ email: response.email! });
        })
        .catch(() => {
          removeAccessToken();
          location.href = "/login";
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
