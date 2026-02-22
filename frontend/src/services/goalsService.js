import api from "./api";

export const getGoalsOverview = async () => {
    const { data } = await api.get("/goals/overview");
    return data;
};

export const getGoalsTrajectory = async () => {
    const { data } = await api.get("/goals/trajectory");
    return data;
};

export const getAIMemo = async () => {
    const { data } = await api.get("/goals/ai-memo");
    return data;
};

export const createGoal = async (goalData) => {
    const { data } = await api.post("/goals", goalData);
    return data;
};

export const getMilestones = async () => {
    const { data } = await api.get("/goals/milestones");
    return data;
};

export const getImpactSummary = async () => {
    const { data } = await api.get("/goals/impact-summary");
    return data;
};
