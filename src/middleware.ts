import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();

  // Check if Turnstile is enabled
  const isTurnstileEnabled = process.env.NEXT_PUBLIC_TURNSTILE_ENABLED === "true";
  if (!isTurnstileEnabled) {
    return NextResponse.next();
  }

  // Skip Turnstile check for non-production environments
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  // Validate Turnstile token
  const token = req.cookies.get("cf-turnstile-response");
  if (!token) {
    url.pathname = "/error";
    return NextResponse.redirect(url);
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: secretKey, response: token }),
  });

  const data = await response.json();
  if (!data.success) {
    url.pathname = "/error";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};