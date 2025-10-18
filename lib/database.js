import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Auth helpers
export const signUp = async (email, password, full_name) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name },
        },
    });
    return { data, error };
};

export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

export const getUser = () => supabase.auth.getUser();
