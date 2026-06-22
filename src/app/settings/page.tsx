import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SettingsPanel } from "@/components/admin/settings-panel";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
    redirect("/portal/dashboard");
  }

  return (
    <SettingsPanel
      user={{
        name: session.user.name ?? "",
        email: session.user.email,
        role: session.user.role,
      }}
    />
  );
}
