
import { supabaseServerClient } from "../utils/supabase/serverClient";
import type { UserData, UserProfile, UserProfileFlat } from "../../src/types/index";

export class UserModel {
  private supabase = supabaseServerClient();

  async findByEmail(email: string): Promise<UserData | null> {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !data) {
        console.error("Error in finding user by email:", error);
        return null;
      }
      return data as UserData;
    } catch (error) {
      console.error("Error finding user by email:", error);
      return null;
    }
  }

  async create(userData: { email: string }): Promise<UserData | null> {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .insert({ email: userData.email })
        .select()
        .single();

      if (error || !data) {
        console.error("Error in creating user:", error);
        return null;
      }
      return data as UserData;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error || !data) {
        console.error("Error in fetching user profile:", error);
        return null;
      }
      return data as UserProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }

  /** Merge JSON and upsert by user_id */
  async createOrUpdateProfile(userId: string, profileData: Record<string, unknown>): Promise<UserProfile | null> {
  try {
    const existing = await this.getProfile(userId);
    const merged = { ...(existing?.profile_data ?? {}), ...profileData };

    const { data, error } = await this.supabase
      .from("user_profiles")
      .upsert([{ user_id: userId, profile_data: merged, updated_at: new Date().toISOString() }], { onConflict: "user_id" })
      .select()
      .single();

    if (error || !data) {
      console.error("Error upserting user profile:", error);
      return null;
    }
    return data as UserProfile;
  } catch (error) {
    console.error("Error creating or updating user profile:", error);
    return null;
  }
}


  /** Returns profiles joined with users(email, created_at) */
  
  async getAllProfiles(): Promise<UserProfileFlat[] | null> {
    try {
      const { data, error } = await this.supabase
        .from("user_profiles")
        .select("* , users:users(email)")
        .order("created_at", { ascending: false });

      if (error || !data) {
        console.error("Error in fetching all user profiles:", error);
        return null;
      }
      type Row = UserProfile & { users?: { email: string | null } | null };

      // flatten email onto the row
      const flattened: UserProfileFlat[] = (data as Row[]).map((r) => ({
        id: r.id,
        user_id: r.user_id,
        profile_data: r.profile_data,
        created_at: r.created_at,
        updated_at: r.updated_at,
        email: r.users?.email ?? "", // flatten here
      }));

      return flattened;
    } catch (error) {
      console.error("Error fetching all user profiles:", error);
      return null;
    }
  }
}
