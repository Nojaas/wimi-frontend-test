import { ApiError, loginUser } from "@/lib/api";
import type { LoginFormData } from "@/lib/validations/loginSchema";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useAuth() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginFormData) => loginUser(credentials),
    onSuccess: ({ user, token }) => {
      login(user, token);
      toast.success("Login successful!");
      navigate("/dashboard");
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.status === 401
          ? "Invalid email or password"
          : error.status === 0
          ? "Network error. Check your connection and API server."
          : "An error occurred. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return {
    user,
    login: loginMutation.mutate,
    logout: handleLogout,
    isLoggingIn: loginMutation.isPending,
  };
}
