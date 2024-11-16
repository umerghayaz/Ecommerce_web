import { create } from "zustand";
// import axios from "../lib/axios";
import { toast } from "react-hot-toast";
// import axiosInstance from "../lib/axios";
import axios from "axios";
export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    console.log("inside aftre loading");
    if (password !== confirmPassword) {
      set({ loading: false });
      console.log("after aftre loading");

      return toast.error("Passwords do not match");
    }

    try {
      console.log("name,email,passwword", name, email, password);
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });
      set({ user: res.data, loading: false });
    } catch (error) {
      console.log("errror", error);
      console.log("message", error.response.data.message);

      set({ loading: false });
      toast.error(error.message || "An error occurred");
    }
  },
  login: async (email, password) => {
    console.log(email, password);
    set({ loading: true });

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      set({ user: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  logout: async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
          const token = localStorage.getItem("token");
          let config = {
            headers: { Authorization: `Bearer ${token}` },
          };
      const response = await axios.get(
        "http://localhost:5000/api/auth/profile",
        config
      );
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      console.log(error.message);
      set({ checkingAuth: false, user: null });
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/refresh-token"
      );
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

// TODO: Implement the axios interceptors for refreshing access token

// axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
