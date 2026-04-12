import { NextResponse } from "next/server";

const SESSION_COOKIE = "ptp_user_id";

export async function POST(request: Request) {
  const url = new URL("/login", request.url);
  const response = NextResponse.redirect(url);
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
