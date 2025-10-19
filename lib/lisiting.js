import { supabase } from "@/lib/database";

export async function createListing({
    type,
    title,
    description,
    price,
    unit,
    iconBase64,
    imageBase64ArrayJson,
}) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not logged in");

    const { data, error } = await supabase.from("listings").insert([
        {
            user_id: user.id,
            type,
            title,
            description,
            price,
            unit,
            icon_base64: iconBase64,
            images_base64: imageBase64ArrayJson,
        },
    ]);

    if (error) {
        console.error("Error inserting listing:", error);
        throw error;
    }

    return data;
}
