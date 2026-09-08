import {
    sendVibeService,
    getPendingVibesService,
    removeVibeService
} from "../services/vibeService.js";

export const sendVibe = async (req, res) => {

    try {

        const result = await sendVibeService(req.user, req.body);

        return res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

export const removeVibe = async (req, res) => {
    try {
        const result = await removeVibeService(req.user.id, req.params.receiverId);
        return res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getPendingVibes = async (req, res, next) => {

    try {

        const result = await getPendingVibesService(req.user.id);

        return res.status(200).json({

            success: true,

            count: result.count,

            pendingVibes: result.pendingVibes

        });

    } catch (error) {

        next(error);

    }

};