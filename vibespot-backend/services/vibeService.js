import supabase from "../config/supabase.js";
import { v4 as uuidv4 } from "uuid";
import AppError from "../utils/AppError.js";
import { getSocketByUserId } from "./socketRegistry.js";

const getActiveCheckIn = async (userId) => {
    const { data, error } = await supabase
        .from("checkins")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("checkin_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        throw new AppError(error.message, 500);
    }

    return data;
};

const findVibe = async (senderId, receiverId) => {
    const { data, error } = await supabase
        .from("vibes")
        .select("*")
        .eq("sender_id", senderId)
        .eq("receiver_id", receiverId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        throw new AppError(error.message, 500);
    }

    return data;
};

const findMatch = async (userId, otherUserId) => {
    const { data, error } = await supabase
        .from("matches")
        .select("id, chat_room_id")
        .or(
            `and(user1_id.eq.${userId},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${userId})`
        )
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        throw new AppError(error.message, 500);
    }

    return data;
};

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
    const senderCheckIn = await getActiveCheckIn(sender.id);

    if (!senderCheckIn) {
        throw new AppError("You are not checked in.",400);
    }

    // Step 5 - Receiver active check-in
    const receiverCheckIn = await getActiveCheckIn(receiverId);

    if (!receiverCheckIn) {
        throw new AppError("Receiver is not checked in.",400);
    }

    // Step 6 - Same place validation
    if (senderCheckIn.place_name !== receiverCheckIn.place_name) {
        throw new AppError("You can only send vibes to users at the same place.",409);
    }

    // We will continue from here in the next step.
    // Step 7 - Check duplicate pending vibe
    const duplicateVibe = await findVibe(sender.id, receiverId);

    if (duplicateVibe) {
        const existingMatch = await findMatch(sender.id, receiverId);

        if (existingMatch) {
            return {
                matched: true,
                message: "You are already matched with this user.",
                chatRoomId: existingMatch.chat_room_id
            };
        }

        throw new AppError(
            "You have already sent a vibe to this user. Wait for their response.",
            409
        );
    }

    // Step 8 - Check reverse vibe
    const reverseVibe = await findVibe(receiverId, sender.id);

    if (reverseVibe) {
        const existingMatch = await findMatch(sender.id, receiverId);

        if (existingMatch) {
            return {
                matched: true,
                message: "You are already matched with this user.",
                chatRoomId: existingMatch.chat_room_id
            };
        }

        // Fetch sender profile data before creating match payloads
        const { data: senderProfile, error: senderProfileError } = await supabase
            .from("users")
            .select("username, avatar_emoji")
            .eq("id", sender.id)
            .single();

        if (senderProfileError) {
            throw new AppError("Unable to fetch sender profile.", 500);
        }

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
            const matchAfterConflict = await findMatch(sender.id, receiverId);

            if (matchAfterConflict) {
                return {
                    matched: true,
                    message: "You are already matched with this user.",
                    chatRoomId: matchAfterConflict.chat_room_id
                };
            }

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
        username: senderProfile.username,
        avatar_emoji: senderProfile.avatar_emoji,
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
        // Fetch sender profile for incoming vibe payload
        const { data: senderProfile } = await supabase
            .from("users")
            .select("username, avatar_emoji")
            .eq("id", sender.id)
            .single();

        receiverSocket.emit("incoming_vibe", {
    id: vibe.id,
    emoji: vibe.emoji,
    created_at: vibe.created_at,

    sender: {
        id: sender.id,
        username: senderProfile?.username || "Unknown",
        avatar_emoji: senderProfile?.avatar_emoji || "👤"
    }
});

        console.log(`Realtime vibe sent to ${receiver.email}`);

    }


    return {
        matched: false,
        message: "Vibe sent successfully."
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

export const removeVibeService = async (senderId, receiverId) => {
    const { error } = await supabase
        .from("vibes")
        .delete()
        .eq("sender_id", senderId)
        .eq("receiver_id", receiverId);

    if (error) {
        throw new AppError(error.message, 500);
    }

    return {
        message: "Vibe removed."
    };
};