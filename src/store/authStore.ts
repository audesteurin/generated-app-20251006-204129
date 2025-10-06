import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@shared/types';
import { MOCK_USER } from '@shared/mock-data';
interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (password: string) => boolean;
  logout: () => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: (password: string) => {
        // Mock login logic
        if (password === 'password') {
          set({ isLoggedIn: true, user: MOCK_USER });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isLoggedIn: false, user: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);