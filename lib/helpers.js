import { supabase } from "./database";

export const isStrongPassword = (password) => {
    // At least 1 uppercase, 1 number, 1 special character, min 8 characters
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
};

/**
 * Get or create a conversation between two users
 * @param {string} userId1 - Current user ID
 * @param {string} userId2 - Other user ID
 * @returns {string|null} conversation_id
 */
export async function getOrCreateConversation(userId1, userId2) {
    try {
        // 1. Get all conversations for userId1
        const { data: user1Convos, error: user1Error } = await supabase
            .from("conversation_members")
            .select("conversation_id")
            .eq("user_id", userId1);

        if (user1Error) throw user1Error;

        if (!user1Convos || user1Convos.length === 0) {
            // No existing conversations, skip to creation
            return await createConversation(userId1, userId2);
        }

        // 2. For each conversation, check if userId2 is also a member and total members = 2
        for (const convo of user1Convos) {
            const { data: members, error: membersError } = await supabase
                .from("conversation_members")
                .select("user_id")
                .eq("conversation_id", convo.conversation_id);

            if (membersError) throw membersError;

            const memberIds = members.map((m) => m.user_id);

            if (memberIds.includes(userId2) && memberIds.length === 2) {
                // Found a conversation with exactly these two users                
                return convo.conversation_id;
            }
        }

        // 3. No existing conversation found, create new
        return await createConversation(userId1, userId2);
    } catch (err) {
        console.error("Error getting/creating conversation:", err);
        return null;
    }
}

// Helper function to create a new conversation
async function createConversation(userId1, userId2) {
    const { data: newConvo, error: insertError } = await supabase
        .from("conversations")
        .insert([{ created_at: new Date() }])
        .select()
        .single();

    if (insertError) throw insertError;

    const conversationId = newConvo.id;

    const { error: memberError } = await supabase
        .from("conversation_members")
        .insert([
            { conversation_id: conversationId, user_id: userId1 },
            { conversation_id: conversationId, user_id: userId2 },
        ]);

    if (memberError) throw memberError;

    return conversationId;
}