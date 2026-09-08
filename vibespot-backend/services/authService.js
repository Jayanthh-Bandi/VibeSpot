import validator from "validator";
import supabase from "../config/supabase.js";
import { env } from "../config/env.js";

export const registerUserService = async ({
    email,
    password,
    username,
    avatarEmoji
}) => {

    // Validation
    if (!email || !password || !username || !avatarEmoji) {
        throw new Error("All fields are required.");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Invalid email address.");
    }

    if (password.length < 8) {
        throw new Error("Password must contain at least 8 characters.");
    }

    // Check username uniqueness
    const { data: existingUser } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .maybeSingle();

    if (existingUser) {
        throw new Error("Username already exists.");
    }

    // Create authentication user
    const { data: authData, error: authError } =
        await supabase.auth.signUp({
            email,
            password
        });

    if (authError) {
        throw new Error(authError.message);
    }

    // Insert profile
    const { error: profileError } =
        await supabase
            .from("users")
            .insert({
                id: authData.user.id,
                email,
                username,
                avatar_emoji: avatarEmoji
            });

    if (profileError) {
        throw new Error(profileError.message);
    }

    return {
        message: "User registered successfully.",
        user: {
            id: authData.user.id,
            email,
            username,
            avatarEmoji
        }
    };
};

export const loginUserService = async ({ email, password }) => {

    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        throw new Error(error.message);
    }

    const profile = await getCurrentUserService(data.user);

    return {
        message: "Login successful.",
        session: data.session,
        user: profile
    };
};
export const getCurrentUserService = async (user) => {
    const { data, error } = await supabase
        .from("users")
        .select("id, username, email, avatar_emoji")
        .eq("id", user.id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return {
        id: data.id,
        username: data.username,
        email: data.email,
        avatarEmoji: data.avatar_emoji
    };
};

export const updateUserProfileService = async (user, {
        username,
        avatarEmoji,
        password
    }) => {
        const updates = {};

        if (username !== undefined) {
            if (!username.trim()) {
                throw new Error("Username cannot be empty.");
            }

            const { data: existingUser, error: usernameError } = await supabase
                .from("users")
                .select("id")
                .eq("username", username.trim())
                .neq("id", user.id)
                .maybeSingle();

            if (usernameError) {
                throw new Error(usernameError.message);
            }

            if (existingUser) {
                throw new Error("Username already exists.");
            }

            updates.username = username.trim();
        }

        if (avatarEmoji !== undefined) {
            updates.avatar_emoji = avatarEmoji;
        }

        if (Object.keys(updates).length > 0) {
            const { error } = await supabase
                .from("users")
                .update(updates)
                .eq("id", user.id);

            if (error) {
                throw new Error(error.message);
            }
        }

        if (password !== undefined) {
            if (password.length < 8) {
                throw new Error("Password must contain at least 8 characters.");
            }

            const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
                method: "PUT",
                headers: {
                    apikey: env.SUPABASE_ANON_KEY,
                    Authorization: "Bearer " + user.accessToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password })
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.msg || result.message || "Unable to update password.");
            }
        }

        return getCurrentUserService(user);
    };