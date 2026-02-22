import api from "./api";

export const getTransactionMetrics = async () => {
    const response = await api.get("/transactions/metrics");
    return response.data;
};

export const getTransactionHistory = async (page = 1, limit = 10) => {
    const response = await api.get(`/transactions/history?page=${page}&limit=${limit}`);
    return response.data;
};
