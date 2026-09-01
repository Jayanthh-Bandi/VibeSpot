import {
    handleSendMessage,
    joinMatchService
} from "../services/socketService.js";

import {
    registerSocket,
    removeSocket
} from "../services/socketRegistry.js";

export const registerSocketEvents = (io, socket) => {

    console.log(`Socket Connected: ${socket.id}`);

    registerSocket(socket);

    console.log(`${socket.user.email} registered.`);

    socket.on("join_match", async ({ matchId }) => {

        try {

            const result = await joinMatchService(socket, matchId);

            socket.emit("match_joined", {

                success: true,

                matchId: result.matchId

            });

        } catch (error) {

            socket.emit("chat_error", {

                message: error.message

            });

        }

    });

    socket.on("typing_start", () => {

        if (!socket.chatRoomId) return;

        socket.to(socket.chatRoomId).emit("user_typing", {

            email: socket.user.email

        });

    });

    socket.on("typing_stop", () => {

        if (!socket.chatRoomId) return;

        socket.to(socket.chatRoomId).emit("user_stopped_typing");

    });

    socket.on("send_message", async ({ message }) => {

        try {

            const response = await handleSendMessage(socket, {

                message

            });

            io.to(socket.chatRoomId).emit(

                "receive_message",

                response

            );

        }

        catch (error) {

            socket.emit("chat_error", {

                message: error.message

            });

        }

    });

    socket.on("disconnect", () => {

        removeSocket(socket);

        console.log(`Socket Disconnected: ${socket.id}`);

    });

};