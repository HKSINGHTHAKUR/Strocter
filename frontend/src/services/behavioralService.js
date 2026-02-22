import api from "./api";

export const getBehavioralSummary = async () => {
    const { data } = await api.get("/analytics/behavioral-summary");
    return data;
};

export const getHeatmap = async () => {
    const { data } = await api.get("/analytics/heatmap");
    return data;
};

export const getCognitive = async () => {
    const { data } = await api.get("/analytics/cognitive");
    return data;
};

export const getSentiment = async () => {
    const { data } = await api.get("/analytics/sentiment");
    return data;
};

export const getCategoryBreakdown = async () => {
    const { data } = await api.get("/analytics/category-breakdown");
    return data;
};
