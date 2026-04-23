import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // ? user is { id, email, username }
      token: null,
      isAuthenticated: false,

      // Call this after a successful login API request
      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true
      }),

      // Call this when the user clicks logout or token expires
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false
      }),

      // Optional: Update specific user fields later (e.g., profile update)
      updateUser: (userData) => set((state) => ({
        user: { ...userData }
      })),
    }),
    {
      name: 'auth-storage', // store details under this in localStorage
    }
  )
);

export default useAuthStore;