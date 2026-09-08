import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import { getMessagesService } from "../services/messageService.js";
import { mapMessages } from "../mappers/messageMapper.js";

export const getMessages = asyncHandler(async (req, res) => {

    const messages = await getMessagesService(req.params.matchId, req.user.id);

    return res.status(200).json(

        successResponse(

            "Messages fetched successfully.",

            mapMessages(messages)

        )

    );

});