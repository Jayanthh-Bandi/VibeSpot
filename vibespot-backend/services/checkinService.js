import supabase from "../config/supabase.js";

const getActiveCheckIns = async (userId) => {
    const { data, error } = await supabase
        .from("checkins")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("checkin_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data ?? [];
};

export const checkInService = async (user, body) => {

    const { placeName, lat, lng } = body;

    // Validation
    if (!placeName || lat === undefined || lng === undefined) {
        throw new Error("Place name, latitude and longitude are required.");
    }

    // Check for existing active check-in
    const existingCheckIns = await getActiveCheckIns(user.id);

    if (existingCheckIns.length > 0) {
        throw new Error("You already have an active check-in.");
    }

    // Insert new check-in
    const { data, error } = await supabase
        .from("checkins")
        .insert({
            user_id: user.id,
            place_name: placeName,
            lat,
            lng,
            checkin_at: new Date(),
            is_active: true
        })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return {
        message: "Checked in successfully.",
        checkIn: data
    };

};
export const checkOutService = async (user) => {

    // Fetch all active rows so legacy duplicate rows do not break checkout.
    const activeCheckIns = await getActiveCheckIns(user.id);

    if (activeCheckIns.length === 0) {
        return {
            message: "You were already checked out.",
            checkOut: null
        };
    }

    // Update the record
    const { data, error } = await supabase
        .from("checkins")
        .update({
            is_active: false,
            checkout_at: new Date()
        })
        .eq("user_id", user.id)
        .eq("is_active", true)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    if (!data || data.length === 0) {
        throw new Error("Unable to complete checkout. Please try again.");
    }

    return {
        message: "Checked out successfully.",
        checkOut: data?.[0] ?? null
    };
};

export const getMyCheckInService = async (user) => {

    const activeCheckIns = await getActiveCheckIns(user.id);
    const data = activeCheckIns[0] ?? null;

    if (!data) {
        return {
            message: "You are not currently checked in.",
            checkIn: null
        };
    }

    return {
        message: "Current check-in found.",
        checkIn: data
    };

};

export const getNearbyUsersService = async (user) => {

    // Step 1: Find current user's active check-in
    const activeCheckIns = await getActiveCheckIns(user.id);
    const myCheckIn = activeCheckIns[0] ?? null;

    if (!myCheckIn) {
        throw new Error("You are not currently checked in.");
    }

    // Step 2: Find everyone else at the same place
    const { data, error } = await supabase
        .from("checkins")
        .select(`
            id,
            place_name,
            users (
                id,
                username,
                avatar_emoji
            )
        `)
        .eq("place_name", myCheckIn.place_name)
        .eq("is_active", true)
        .neq("user_id", user.id);

    if (error) {
        throw new Error(error.message);
    }

    return {
        message: "Nearby users fetched successfully.",
        users: data
    };

};