import api from "./api";

export const getSettings = async () => {
    const { data } = await api.get("/settings");
    return data;
};

export const updateSettings = async (settings) => {
    const { data } = await api.put("/settings", settings);
    return data;
};

export const resetSettings = async () => {
    const { data } = await api.post("/settings/reset");
    return data;
};
