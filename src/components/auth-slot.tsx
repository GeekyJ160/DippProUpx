import { Link } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-11 w-20 animate-pulse rounded-md bg-elevated" />;
  }
  if (user) return <UserButton />;
  return (
    <Link
      to="/login"
      className="inline-flex h-11 items-center rounded-md border border-border bg-elevated px-4 text-sm font-medium"
    >
      Sign in
    </Link>
  );
}
