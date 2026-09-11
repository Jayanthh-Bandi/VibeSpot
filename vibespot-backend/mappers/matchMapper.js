export const mapMatch = (match, matchedUser) => {

    return {

        matchId: match.id,

        chatRoomId: match.chat_room_id, 

        expiresAt: match.expires_at,

        matchedUser: {

            id: matchedUser.id,

            username: matchedUser.username,

            avatarEmoji: matchedUser.avatar_emoji

        }

    };

};