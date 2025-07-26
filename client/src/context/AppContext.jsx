import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true; 

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(
          error.response?.data?.message || "Failed to check authentication state"
        );
      }
      setIsLoggedin(false);
      setUserData(null);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        withCredentials: true,
      });
      if (data.success) {
        setUserData({
          name: data.name,
          isAccountVerified: data.isAccountVerified,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error(error.response?.data?.message || "Failed to load user data");
    }
  };

  useEffect(() => {
      getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};
