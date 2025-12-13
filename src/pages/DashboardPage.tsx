import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function DashboardPage() {
  const { logout, user } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-4 text-muted-foreground">
            Dashboard content will be implemented here
          </p>
          {user && (
            <p className="mt-2 text-sm text-muted-foreground">
              Logged in as: {user.name} ({user.email})
            </p>
          )}
        </div>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
