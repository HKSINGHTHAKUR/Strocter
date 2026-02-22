import api from "./api";

export const getDashboardMetrics = async () => {
    const response = await api.get("/insights/dashboard");
    return response.data;
};

export const getWealthFlow = async () => {
    const response = await api.get("/analytics/wealth-flow");
    return response.data;
};

export const getIntelligenceFeed = async () => {
    const response = await api.get("/transactions/intelligence-feed");
    return response.data;
};
