// app/super/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SuperPage() {
  const session = await getServerSession(authOptions as any);
  if (!session) redirect("/login");

  const role = (session.user as any).role;
  if (role !== "SUPERUSER") redirect("/unauthorized");

  return (
    <main>
      <h1 className="text-2xl font-bold">Superuser Console</h1>
      <p>Superuser: {session.user?.email}</p>
    </main>
  );
}
