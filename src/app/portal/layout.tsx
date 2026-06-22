import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import PortalLayout from "@/components/portal/portal-layout";

export const dynamic = "force-dynamic";

export default async function PortalLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Portal is for clients only
  if (session.user.role === "SUPER_ADMIN" || session.user.role === "PROJECT_MANAGER") {
    redirect("/dashboard");
  }

  return <PortalLayout>{children}</PortalLayout>;
}
