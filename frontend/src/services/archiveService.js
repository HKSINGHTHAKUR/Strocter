import api from "./api";

export const getArchiveOverview = async () => {
    const { data } = await api.get("/archive/overview");
    return data;
};

export const getArchiveReports = async () => {
    const { data } = await api.get("/archive/reports");
    return data;
};

export const getReportPreview = async (reportId) => {
    const { data } = await api.get(`/archive/${reportId}/preview`);
    return data;
};
