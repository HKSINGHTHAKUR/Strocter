import api from "./api";

export const getWealthOverview = async () => {
    const { data } = await api.get("/wealth/overview");
    return data;
};

export const getWealthTrend = async (range = "1Y") => {
    const { data } = await api.get(`/wealth/trend?range=${range}`);
    return data;
};

export const getWealthRadar = async () => {
    const { data } = await api.get("/wealth/radar");
    return data;
};

export const getWealthAllocation = async () => {
    const { data } = await api.get("/wealth/allocation");
    return data;
};

export const getWealthOutlook = async () => {
    const { data } = await api.get("/wealth/outlook");
    return data;
};
