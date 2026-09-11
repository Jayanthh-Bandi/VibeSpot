import {
    registerUserService,
    loginUserService,
    getCurrentUserService
} from "../services/authService.js";
import { updateUserProfileService } from "../services/authService.js";
import { successResponse,errorResponse } from "../utils/apiResponse.js";
import supabase from "../config/supabase.js";
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
                        email: result.user.email,
                        username: result.user.username,
                        avatarEmoji: result.user.avatarEmoji
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

export const updateUserProfile = async (req, res) => {
    try {
        const user = await updateUserProfileService(req.user, req.body);
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        const { data, error } = await supabase.auth.signOut();

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
