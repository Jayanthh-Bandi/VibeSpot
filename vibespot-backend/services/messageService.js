import supabase from "../config/supabase.js";
import AppError from "../utils/AppError.js";

export const saveMessageService = async ({
    matchId,
    senderId,
    content
}) => {
    if (typeof content !== "string" || !content.trim()) {
        throw new AppError("Message cannot be empty.", 400);
    }

    if (content.trim().length > 1000) {
        throw new AppError("Message must be 1000 characters or less.", 400);
    }

    const { data, error } = await supabase
        .from("messages")
        .insert({
            match_id: matchId,
            sender_id: senderId,
            content
        })
        .select()
        .single();

    if (error) {
        throw new AppError(error.message, 500);
    }

    return data;
};

// export const getMessagesService = async (matchId) => {

//     const { data, error } = await supabase
//         .from("messages")
//         .select("*")
//         .eq("match_id", matchId)
//         .order("sent_at", { ascending: true });

//     if (error) {
//         throw new AppError(error.message, 500);
//     }

//     return data;
// };


export const getMessagesService = async (chatRoomId, userId) => {

    console.log("Chat Room ID:", chatRoomId);

    const { data: match, error: matchError } = await supabase
        .from("matches")
        .select("*")
        .eq("chat_room_id", chatRoomId)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .single();

    console.log("Match:", match);
    console.log("Match Error:", matchError);

    if (matchError || !match) {
        throw new AppError("Match not found.", 404);
    }

    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", match.id)
        .order("sent_at", { ascending: true });

    console.log("Messages:", data);
    console.log("Messages Error:", error);

    if (error) {
        throw new AppError(error.message, 500);
    }

    return data;
};