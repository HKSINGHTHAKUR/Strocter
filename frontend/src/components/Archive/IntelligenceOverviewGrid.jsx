import OverviewCard from "./OverviewCard";

export default function IntelligenceOverviewGrid({ overview }) {
    return (
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-4">
                Immediate Intelligence Overview
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {overview.map((card, index) => (
                    <OverviewCard key={card.id} {...card} index={index} />
                ))}
            </div>
        </div>
    );
}
