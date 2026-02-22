import api from "./api";

export const getSubscriptionStatus = async () => {
    const { data } = await api.get("/subscription/status");
    return data;
};

export const createIntroOrder = async () => {
    const { data } = await api.post("/subscription/create-intro");
    return data;
};

export const confirmPayment = async (paymentData) => {
    const { data } = await api.post("/subscription/confirm-payment", paymentData);
    return data;
};

export const cancelSubscription = async () => {
    const { data } = await api.post("/subscription/cancel");
    return data;
};
