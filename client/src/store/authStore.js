import { create } from 'zustand';

const useAuthStore = create(function(set) {
  return {
    user:  null,
    token: localStorage.getItem('crp_token') || null,

    setAuth: function(user, token) {
      localStorage.setItem('crp_token', token);
      set({ user: user, token: token });
    },

    setUser: function(user) {
      set({ user: user });
    },

    logout: function() {
      localStorage.removeItem('crp_token');
      set({ user: null, token: null });
    },
  };
});

export default useAuthStore;
