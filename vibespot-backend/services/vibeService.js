import supabase from "../config/supabase.js";
import { v4 as uuidv4 } from "uuid";
import AppError from "../utils/appError.js";
import { getSocketByUserId } from "./socketRegistry.js";

export const sendVibeService = async (sender, body) => {

    const { receiverId, emoji } = body;

    // Step 1 - Validate request
    if (!receiverId || !emoji) {
        throw new Error("Receiver ID and emoji are required.");
    }

    // Step 2 - Prevent self-vibe
    if (sender.id === receiverId) {
        throw new AppError("You cannot send a vibe to yourself.",400);
    }

    // Step 3 - Verify receiver exists
    const { data: receiver, error: receiverError } = await supabase
        .from("users")
        .select("*")
        .eq("id", receiverId)
        .maybeSingle();

    if (receiverError) {
        throw new AppError(
            "Receiver not found.",
            404
        );
    }

    if (!receiver) {
        throw new AppError("Receiver not found.",404);
    }

    // Step 4 - Sender active check-in
    const { data: senderCheckIn } = await supabase
        .from("checkins")
        .select("*")
        .eq("user_id", sender.id)
        .eq("is_active", true)
        .maybeSingle();

    if (!senderCheckIn) {
        throw new AppError("You are not checked in.",400);
    }

    // Step 5 - Receiver active check-in
    const { data: receiverCheckIn } = await supabase
        .from("checkins")
        .select("*")
        .eq("user_id", receiverId)
        .eq("is_active", true)
        .maybeSingle();

    if (!receiverCheckIn) {
        throw new AppError("Receiver is not checked in.",400);
    }

    // Step 6 - Same place validation
    if (senderCheckIn.place_name !== receiverCheckIn.place_name) {
        throw new AppError("You can only send vibes to users at the same place.",409);
    }

    // We will continue from here in the next step.
    // Step 7 - Check duplicate pending vibe
    const { data: duplicateVibe } = await supabase
        .from("vibes")
        .select("*")
        .eq("sender_id", sender.id)
        .eq("receiver_id", receiverId)
        .maybeSingle();

    if (duplicateVibe) {
        throw new AppError("You have already sent a vibe to this user.",409);
    }

    // Step 8 - Check reverse vibe
    const { data: reverseVibe } = await supabase
        .from("vibes")
        .select("*")
        .eq("sender_id", receiverId)
        .eq("receiver_id", sender.id) // Use your current column name if it's still "receiver_id"
        .maybeSingle();

    if (reverseVibe) {

        const chatRoomId = uuidv4();
        const senderSocket = getSocketByUserId(sender.id);

        const receiverSocket = getSocketByUserId(receiverId);

        // Create Match
        const { error: matchError } = await supabase
            .from("matches")
            .insert({
                user1_id: sender.id,
                user2_id: receiverId,
                chat_room_id: chatRoomId,
                expires_at: new Date(Date.now() + 10 * 60 * 1000)
            });





        if (matchError) {
            throw new Error(matchError.message);
        }

        // Delete reverse vibe
        await supabase
            .from("vibes")
            .delete()
            .eq("id", reverseVibe.id);



    const matchPayloadForSender = {
    matchId: chatRoomId,
    otherUser: {
        id: receiver.id,
        username: receiver.username,
        avatar_emoji: receiver.avatar_emoji,
    },
};

const matchPayloadForReceiver = {
    matchId: chatRoomId,
    otherUser: {
        id: sender.id,
        username: sender.username,
        avatar_emoji: sender.avatar_emoji,
    },
};


console.log("=== MATCH CREATED ===");

console.log("Sender ID:", sender.id);
console.log("Receiver ID:", receiverId);

console.log("Sender socket exists:", !!senderSocket);
console.log("Receiver socket exists:", !!receiverSocket);

if (senderSocket) {
    senderSocket.emit("match_created", matchPayloadForSender);
}

if (receiverSocket) {
    receiverSocket.emit("match_created", matchPayloadForReceiver);
}

        return {
            matched: true,
            message: "🎉 It's a Match!",
            chatRoomId
        };
    }

        // Step 9 - Insert pending vibe
    const { data: vibe, error: vibeError } = await supabase
        .from("vibes")
        .insert({
            sender_id: sender.id,
            receiver_id: receiverId,
            emoji
        })
        .select()
        .single();

    if (vibeError) {
        throw new Error(vibeError.message);
    }

    const receiverSocket = getSocketByUserId(receiverId);

    if (receiverSocket) {

        receiverSocket.emit("incoming_vibe", {
    id: vibe.id,
    emoji: vibe.emoji,
    created_at: vibe.created_at,

    sender: {
        id: sender.id,
        username: sender.username,
        avatar_emoji: sender.avatar_emoji
    }
});

        console.log(`Realtime vibe sent to ${receiver.email}`);

    }


    return {
        matched: false,
        message: "Vibe sent successfully."
    };

    return {
        message: "All validations passed. Ready to send vibe."
    };
};

export const getPendingVibesService = async (userId) => {

    const { data, error } = await supabase
        .from("vibes")
        .select(`
            id,
            emoji,
            created_at,
            sender:users!vibes_sender_id_fkey (
                id,
                username,
                avatar_emoji
            )
        `)
        .eq("receiver_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return {
        count: data.length,
        pendingVibes: data
    };

};