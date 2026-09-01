import validator from "validator";
import supabase from "../config/supabase.js";

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

    return {
        message: "Login successful.",
        session: data.session,
        user: data.user
    };
};
export const getCurrentUserService = async (user) => {

    const { data, error } = await supabase
        .from("users")
        .select(`
            id,
            username,
            email,
            avatar_emoji
        `)
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