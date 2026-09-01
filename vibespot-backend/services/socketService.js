import supabase from "../config/supabase.js";
import AppError from "../utils/AppError.js";
import { saveMessageService } from "./messageService.js";

export const joinMatchService = async (socket, matchId) => {

    const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("chat_room_id", matchId)
        .single();

    if (error || !data) {
        throw new AppError("Match not found.", 404);
    }

    const isParticipant =
        data.user1_id === socket.user.id ||
        data.user2_id === socket.user.id;

    if (!isParticipant) {
        throw new AppError("You are not authorized to join this match.", 403);
    }

    // socket.matchId = matchId;

    // socket.join(matchId);

    // return {
    //     matchId
    // };

    socket.matchId = data.id; // Database primary key

    socket.chatRoomId = data.chat_room_id; // Socket room

    socket.join(data.chat_room_id);

return {
    matchId: data.chat_room_id
};

};

export const handleSendMessage = async (socket, data) => {

    if (!socket.matchId) {
        throw new AppError("Join a match first.", 400);
    }

    const savedMessage = await saveMessageService({

        matchId: socket.matchId,

        senderId: socket.user.id,

        content: data.message

    });

    return {

        id: savedMessage.id,

        matchId: savedMessage.match_id,

        senderId: savedMessage.sender_id,

        content: savedMessage.content,

        sentAt: savedMessage.sent_at

    };

};

export const getTypingPayload = (socket) => {

    if (!socket.matchId) {
        throw new AppError("Join a match first.", 400);
    }

    return {

        matchId: socket.matchId,

        userId: socket.user.id,

        email: socket.user.email

    };

};