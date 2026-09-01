import {
    registerUserService,
    loginUserService,
    getCurrentUserService
} from "../services/authService.js";
import { successResponse,errorResponse } from "../utils/apiResponse.js";
export const registerUser = async (req, res) => {

     console.log("🔥 loginUser controller executed");

    try {

        const result = await registerUserService(req.body);

        return res.status(201).json({
            success: true,
            ...result
        });

    }
    catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

export const loginUser = async (req, res) => {

    try {

        const result = await loginUserService(req.body);

        return res
        .status(200)
        .json(
            successResponse(
                result.message,
                {
                    token: result.session.access_token,
                    refreshToken: result.session.refresh_token,
                    expiresIn: result.session.expires_in,
                    user: {
                        id: result.user.id,
                        email: result.user.email
                    }
                }
            )
        );

    } catch (error) {

        return res
        .status(400)
        .json(
            errorResponse(
                error.message
            )
        );

    }

};

export const getCurrentUser = async (req, res) => {

    try {

        const user = await getCurrentUserService(req.user);

        return res.status(200).json({

            success: true,

            user

        });

    }

    catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

export const logoutUser = async (req, res) => {
    res.json({ message: "Logout coming soon." });
};

