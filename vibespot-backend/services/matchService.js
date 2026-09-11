import supabase from "../config/supabase.js";

export const getMatchesService = async (user) => {

    const { data, error } = await supabase
        .from("matches")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .gt("expires_at", new Date().toISOString());

    if (error) {
        throw error;
    }

    return {
        message: "Matches fetched successfully.",
        data
    };

};