import api from "./api";

export const getImpulseOverview = async () => {
    const { data } = await api.get("/impulse/overview");
    return data;
};

export const getImpulseTimeline = async (range = "24h") => {
    const { data } = await api.get(`/impulse/timeline?range=${range}`);
    return data;
};

export const runImpulseSimulation = async (frictionValue) => {
    const { data } = await api.post("/impulse/simulate", { frictionValue });
    return data;
};
