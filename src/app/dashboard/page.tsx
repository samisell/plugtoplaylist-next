import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import DashboardClient from "./DashboardClient";

const SESSION_COOKIE = "ptp_user_id";

export default async function UserDashboardPage() {
  const cookieStore = cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    redirect("/login");
  }

  const submissions = await db.submission.findMany({
    where: { userId: user.id },
    include: { plan: true, payment: true },
    orderBy: { createdAt: "desc" },
  });

  const userData = {
    ...user,
    display_name: user.name,
    metadata: {
      referral_code: user.referralCode,
      referralCode: user.referralCode,
    },
  };

  const mappedSubmissions = submissions.map((s) => ({
    ...s,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
    track_title: s.title,
    artist_name: s.artist,
    cover_art_url: s.coverImage,
    payment: s.payment ? [{ ...s.payment, created_at: s.payment.createdAt }] : [],
  }));

  return <DashboardClient user={userData} submissions={mappedSubmissions} />;
}
