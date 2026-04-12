export const supabase: any = null;

export function createServerClient() {
  throw new Error("Supabase client has been removed. Use Prisma DB helpers instead.");
}

export function createAdminClient() {
  throw new Error("Supabase admin client has been removed. Use Prisma DB helpers instead.");
}
