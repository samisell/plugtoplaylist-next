import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "ptp_admin_id";

export async function POST(request: Request) {
  const url = new URL("/admin/login", request.url);
  const response = NextResponse.redirect(url);
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
