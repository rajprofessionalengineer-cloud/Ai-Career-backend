import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import type { AppContextType, User } from "../types";
import { server } from "../main";

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuth(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data);
      setIsAuth(true);
    } catch (error: any) {
      console.error("Fetch user failed:", error?.response?.data || error.message);

      // If token is invalid, clear it
      localStorage.removeItem("token");
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuth(false);
    toast.success("Logged Out");
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AppContext.Provider
      value={{
        isAuth,
        loading,
        setIsAuth,
        setLoading,
        setUser,
        user,
        LogoutUser: logoutUser,
      }}
    >
      {children}
      <Toaster />
    </AppContext.Provider>
  );
};

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppData must be used within AppProvider");
  }

  return context;
};