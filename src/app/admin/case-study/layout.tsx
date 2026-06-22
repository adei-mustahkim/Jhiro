import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/admin/admin-layout";

export default async function CaseStudyAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
    redirect("/portal/dashboard");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
