import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getSubscriptionStatus } from "../services/subscriptionService";

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
    const [subscription, setSubscription] = useState({
        plan: "free",
        status: "active",
        isPremium: false,
        isTrial: false,
        trialDaysLeft: 0,
        trialExpired: true,
        loading: true,
    });

    const refresh = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setSubscription((s) => ({ ...s, loading: false }));
                return;
            }

            const data = await getSubscriptionStatus();
            setSubscription({
                ...data,
                loading: false,
            });
        } catch {
            setSubscription((s) => ({ ...s, loading: false }));
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <SubscriptionContext.Provider value={{ ...subscription, refresh }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const ctx = useContext(SubscriptionContext);
    if (!ctx) throw new Error("useSubscription must be inside SubscriptionProvider");
    return ctx;
}
