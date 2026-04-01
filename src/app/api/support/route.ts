import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { subject, message, priority, userName, userEmail } = body;

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    const senderEmail = userEmail || user?.email || "Unknown";
    const senderName  = userName  || user?.user_metadata?.full_name || senderEmail;

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL!;
    const siteName   = process.env.SITE_NAME || "PlugToPlaylist";

    await sendEmail({
      to: adminEmail,
      subject: `[${siteName}] Support Ticket – ${priority?.toUpperCase()} – ${subject}`,
      text: `New support ticket from ${senderName} (${senderEmail})\n\nPriority: ${priority}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px">
          <h2 style="color:#F59E0B">New Support Ticket</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px;color:#666">From</td><td style="padding:6px"><strong>${senderName}</strong> &lt;${senderEmail}&gt;</td></tr>
            <tr><td style="padding:6px;color:#666">Priority</td><td style="padding:6px"><strong>${priority}</strong></td></tr>
            <tr><td style="padding:6px;color:#666">Subject</td><td style="padding:6px">${subject}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#f9f9f9;border-left:4px solid #F59E0B">
            <pre style="white-space:pre-wrap;font-family:sans-serif">${message}</pre>
          </div>
        </div>
      `,
    });

    // Send confirmation email to user
    await sendEmail({
      to: senderEmail,
      subject: `[${siteName}] We received your support request`,
      text: `Hi ${senderName},\n\nThank you for reaching out! We've received your support ticket and will get back to you within 2 hours.\n\nYour subject: ${subject}\n\nBest,\nThe ${siteName} Support Team`,
      html: `
        <div style="font-family:sans-serif;max-width:600px">
          <h2 style="color:#F59E0B">We received your message!</h2>
          <p>Hi <strong>${senderName}</strong>,</p>
          <p>Thank you for reaching out. We've received your support request and our team will respond within <strong>2 hours</strong>.</p>
          <div style="margin:16px 0;padding:16px;background:#f9f9f9;border-radius:8px">
            <p style="margin:0;color:#666;font-size:14px">Your subject: <strong>${subject}</strong></p>
          </div>
          <p>Best regards,<br>The ${siteName} Support Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Support ticket sent successfully" });
  } catch (error: any) {
    console.error("Support ticket error:", error);
    return NextResponse.json({ error: error.message || "Failed to send ticket" }, { status: 500 });
  }
}
