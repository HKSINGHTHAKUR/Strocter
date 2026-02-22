import { useSubscription } from "../../context/SubscriptionContext";

export default function SubscriptionStatusBadge() {
    const { plan, isPremium, isTrial, trialDaysLeft } = useSubscription();

    if (isPremium) {
        return (
            <span className="px-2.5 py-1 rounded-lg bg-[#ec5b13]/15 border border-[#ec5b13]/25 text-[#ec5b13] text-[10px] font-bold uppercase tracking-wider">
                Premium
            </span>
        );
    }

    if (isTrial) {
        return (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                Trial · {trialDaysLeft}d left
            </span>
        );
    }

    return (
        <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08] text-text-muted text-[10px] font-bold uppercase tracking-wider">
            Free
        </span>
    );
}
