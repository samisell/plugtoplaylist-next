import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get("ptp_admin_id")?.value;

    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get or create system settings
    let settings = await db.systemSettings.findUnique({
      where: { id: "system" },
    });

    if (!settings) {
      // Create default settings if they don't exist
      settings = await db.systemSettings.create({
        data: {
          id: "system",
        },
      });
    }

    // Return settings without sensitive data exposed
    return NextResponse.json({
      success: true,
      settings: {
        // General Settings
        siteName: settings.siteName,
        siteUrl: settings.siteUrl,
        supportEmail: settings.supportEmail,
        supportPhone: settings.supportPhone,
        maintenanceMode: settings.maintenanceMode,

        // Feature Flags
        guestSubmissionsEnabled: settings.guestSubmissionsEnabled,
        referralSystemEnabled: settings.referralSystemEnabled,
        couponCodesEnabled: settings.couponCodesEnabled,
        aiPlanSuggestionEnabled: settings.aiPlanSuggestionEnabled,

        // Payment Settings
        testModeEnabled: settings.testModeEnabled,
        autoRefundFailedCampaigns: settings.autoRefundFailedCampaigns,
        paystackConnected: !!settings.paystackPublicKey && !!settings.paystackSecretKey,
        flutterwaveConnected: !!settings.flutterwavePublicKey && !!settings.flutterwaveSecretKey,
        paystackPublicKey: settings.paystackPublicKey || "",
        paystackSecretKey: settings.paystackSecretKey ? "••••••••••••" : "",

        // Email Settings
        smtpHost: settings.smtpHost,
        smtpPort: settings.smtpPort,
        smtpUsername: settings.smtpUsername,
        smtpPassword: settings.smtpPassword ? "••••••••••••" : "",
        emailNotificationsEnabled: settings.emailNotificationsEnabled,
        newUserRegistrationEmail: settings.newUserRegistrationEmail,
        newSubmissionEmail: settings.newSubmissionEmail,
        paymentReceivedEmail: settings.paymentReceivedEmail,
        campaignStartedEmail: settings.campaignStartedEmail,
        campaignCompletedEmail: settings.campaignCompletedEmail,
        refundProcessedEmail: settings.refundProcessedEmail,

        // Third-party Integrations
        spotifyApiConnected: settings.spotifyApiConnected,
        youtubeApiConnected: settings.youtubeApiConnected,
        sendgridConnected: settings.sendgridConnected,
        twilioConnected: settings.twilioConnected,
      },
    });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get("ptp_admin_id")?.value;

    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Get existing settings
    let settings = await db.systemSettings.findUnique({
      where: { id: "system" },
    });

    if (!settings) {
      settings = await db.systemSettings.create({
        data: {
          id: "system",
        },
      });
    }

    // Prepare update data - only update fields that are provided
    const updateData: any = {};

    // General Settings
    if (body.siteName !== undefined) updateData.siteName = body.siteName;
    if (body.siteUrl !== undefined) updateData.siteUrl = body.siteUrl;
    if (body.supportEmail !== undefined) updateData.supportEmail = body.supportEmail;
    if (body.supportPhone !== undefined) updateData.supportPhone = body.supportPhone;
    if (body.maintenanceMode !== undefined) updateData.maintenanceMode = body.maintenanceMode;

    // Feature Flags
    if (body.guestSubmissionsEnabled !== undefined) updateData.guestSubmissionsEnabled = body.guestSubmissionsEnabled;
    if (body.referralSystemEnabled !== undefined) updateData.referralSystemEnabled = body.referralSystemEnabled;
    if (body.couponCodesEnabled !== undefined) updateData.couponCodesEnabled = body.couponCodesEnabled;
    if (body.aiPlanSuggestionEnabled !== undefined) updateData.aiPlanSuggestionEnabled = body.aiPlanSuggestionEnabled;

    // Payment Settings
    if (body.testModeEnabled !== undefined) updateData.testModeEnabled = body.testModeEnabled;
    if (body.autoRefundFailedCampaigns !== undefined) updateData.autoRefundFailedCampaigns = body.autoRefundFailedCampaigns;
    if (body.paystackPublicKey !== undefined) updateData.paystackPublicKey = body.paystackPublicKey;
    if (body.paystackSecretKey !== undefined && body.paystackSecretKey !== "••••••••••••") {
      updateData.paystackSecretKey = body.paystackSecretKey;
    }
    if (body.flutterwavePublicKey !== undefined) updateData.flutterwavePublicKey = body.flutterwavePublicKey;
    if (body.flutterwaveSecretKey !== undefined && body.flutterwaveSecretKey !== "••••••••••••") {
      updateData.flutterwaveSecretKey = body.flutterwaveSecretKey;
    }

    // Email Settings
    if (body.smtpHost !== undefined) updateData.smtpHost = body.smtpHost;
    if (body.smtpPort !== undefined) updateData.smtpPort = body.smtpPort;
    if (body.smtpUsername !== undefined) updateData.smtpUsername = body.smtpUsername;
    if (body.smtpPassword !== undefined && body.smtpPassword !== "••••••••••••") {
      updateData.smtpPassword = body.smtpPassword;
    }
    if (body.emailNotificationsEnabled !== undefined) updateData.emailNotificationsEnabled = body.emailNotificationsEnabled;
    if (body.newUserRegistrationEmail !== undefined) updateData.newUserRegistrationEmail = body.newUserRegistrationEmail;
    if (body.newSubmissionEmail !== undefined) updateData.newSubmissionEmail = body.newSubmissionEmail;
    if (body.paymentReceivedEmail !== undefined) updateData.paymentReceivedEmail = body.paymentReceivedEmail;
    if (body.campaignStartedEmail !== undefined) updateData.campaignStartedEmail = body.campaignStartedEmail;
    if (body.campaignCompletedEmail !== undefined) updateData.campaignCompletedEmail = body.campaignCompletedEmail;
    if (body.refundProcessedEmail !== undefined) updateData.refundProcessedEmail = body.refundProcessedEmail;

    // Third-party Integrations
    if (body.spotifyApiConnected !== undefined) updateData.spotifyApiConnected = body.spotifyApiConnected;
    if (body.youtubeApiConnected !== undefined) updateData.youtubeApiConnected = body.youtubeApiConnected;
    if (body.sendgridConnected !== undefined) updateData.sendgridConnected = body.sendgridConnected;
    if (body.twilioConnected !== undefined) updateData.twilioConnected = body.twilioConnected;

    // Update settings
    const updatedSettings = await db.systemSettings.update({
      where: { id: "system" },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: {
        // General Settings
        siteName: updatedSettings.siteName,
        siteUrl: updatedSettings.siteUrl,
        supportEmail: updatedSettings.supportEmail,
        supportPhone: updatedSettings.supportPhone,
        maintenanceMode: updatedSettings.maintenanceMode,

        // Feature Flags
        guestSubmissionsEnabled: updatedSettings.guestSubmissionsEnabled,
        referralSystemEnabled: updatedSettings.referralSystemEnabled,
        couponCodesEnabled: updatedSettings.couponCodesEnabled,
        aiPlanSuggestionEnabled: updatedSettings.aiPlanSuggestionEnabled,

        // Payment Settings
        testModeEnabled: updatedSettings.testModeEnabled,
        autoRefundFailedCampaigns: updatedSettings.autoRefundFailedCampaigns,
        paystackConnected: !!updatedSettings.paystackPublicKey && !!updatedSettings.paystackSecretKey,
        flutterwaveConnected: !!updatedSettings.flutterwavePublicKey && !!updatedSettings.flutterwaveSecretKey,

        // Email Settings
        smtpHost: updatedSettings.smtpHost,
        smtpPort: updatedSettings.smtpPort,
        smtpUsername: updatedSettings.smtpUsername,
        emailNotificationsEnabled: updatedSettings.emailNotificationsEnabled,

        // Third-party Integrations
        spotifyApiConnected: updatedSettings.spotifyApiConnected,
        youtubeApiConnected: updatedSettings.youtubeApiConnected,
        sendgridConnected: updatedSettings.sendgridConnected,
        twilioConnected: updatedSettings.twilioConnected,
      },
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
