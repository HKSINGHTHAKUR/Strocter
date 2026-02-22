import { useEffect, useState, useCallback, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import SettingsHeader from "../../components/Settings/SettingsHeader";
import AIModelControls from "../../components/Settings/AIModelControls";
import RiskGovernancePanel from "../../components/Settings/RiskGovernancePanel";
import SecurityPanel from "../../components/Settings/SecurityPanel";
import NotificationProtocols from "../../components/Settings/NotificationProtocols";
import {
    getSettings,
    updateSettings,
    resetSettings,
} from "../../services/settingsService";

export default function Settings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const originalRef = useRef(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e) => {
        setMouse({
            x: (e.clientX / window.innerWidth - 0.5) * 2,
            y: (e.clientY / window.innerHeight - 0.5) * 2,
        });
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    /* ── Load ── */
    const fetchAll = useCallback(async () => {
        try {
            const data = await getSettings();
            setSettings(data);
            originalRef.current = JSON.stringify(data);
            setHasChanges(false);
        } catch (err) {
            console.error("Load settings error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    /* ── Detect dirty state ── */
    useEffect(() => {
        if (!settings || !originalRef.current) return;
        setHasChanges(JSON.stringify(settings) !== originalRef.current);
    }, [settings]);

    /* ── Save ── */
    const handleSave = async () => {
        setSaving(true);
        try {
            const data = await updateSettings({
                aiControls: settings.aiControls,
                riskGovernance: settings.riskGovernance,
                security: settings.security,
                notifications: settings.notifications,
            });
            setSettings(data);
            originalRef.current = JSON.stringify(data);
            setHasChanges(false);
        } catch (err) {
            console.error("Save error:", err);
        } finally {
            setSaving(false);
        }
    };

    /* ── Reset ── */
    const handleReset = async () => {
        setSaving(true);
        try {
            const data = await resetSettings();
            setSettings(data);
            originalRef.current = JSON.stringify(data);
            setHasChanges(false);
        } catch (err) {
            console.error("Reset error:", err);
        } finally {
            setSaving(false);
        }
    };

    /* ── Section updaters ── */
    const updateSection = (section) => (val) => setSettings((s) => ({ ...s, [section]: val }));

    return (
        <div className="min-h-screen">
            <div className="atmo-bg">
                <div className="atmo-glow-purple" style={{ transform: `translate(${mouse.x * 30}px, ${mouse.y * 20}px)` }} />
                <div className="atmo-glow-orange" style={{ transform: `translate(${mouse.x * -20}px, ${mouse.y * -15}px)` }} />
                <div className="atmo-beam" />
            </div>
            <div className="noise-overlay" />

            <Sidebar />
            <TopNav />

            <main className="ml-[72px] pt-[64px] relative z-10">
                <div className="max-w-[1400px] mx-auto px-10 py-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <div className="w-8 h-8 rounded-full border-2 border-[#ec5b13] border-t-transparent animate-spin" />
                        </div>
                    ) : (
                        <>
                            <SettingsHeader
                                onSave={handleSave}
                                onReset={handleReset}
                                saving={saving}
                                hasChanges={hasChanges}
                            />

                            <div className="space-y-10">
                                <AIModelControls
                                    aiControls={settings?.aiControls}
                                    onChange={updateSection("aiControls")}
                                />

                                <RiskGovernancePanel
                                    riskGovernance={settings?.riskGovernance}
                                    onChange={updateSection("riskGovernance")}
                                />

                                <SecurityPanel
                                    security={settings?.security}
                                    onChange={updateSection("security")}
                                />

                                <NotificationProtocols
                                    notifications={settings?.notifications}
                                    onChange={updateSection("notifications")}
                                />
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
