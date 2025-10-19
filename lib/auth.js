import { supabase } from "./database";

/**
 * Returns the current logged-in user, or null if not logged in
 */
export const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        console.error("Error fetching user:", error);
        return null;
    }

    return data.user || null;
};