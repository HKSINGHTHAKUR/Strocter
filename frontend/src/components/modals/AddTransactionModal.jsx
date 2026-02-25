import React, { useState } from "react";
import { addTransaction } from "../../services/transactionsService";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function AddTransactionModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        amount: "",
        type: "expense",
        category: "Food & Dining",
        note: "",
        emotion: "Neutral"
    });

    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState("");

    if (!isOpen) return null;

    const categories = [
        "Food & Dining", "Housing", "Transportation", "Entertainment",
        "Shopping", "Utilities", "Healthcare", "Salary", "Investment"
    ];

    const emotions = ["Logical/Routine", "Impulsive", "Stress/Anxiety", "Celebratory", "Neutral"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
            await addTransaction({
                ...formData,
                amount: parseFloat(formData.amount)
            });
            setStatus("success");
            setTimeout(() => {
                setStatus("idle");
                setFormData({ amount: "", type: "expense", category: "Food & Dining", note: "", emotion: "Neutral" });
                onSuccess();
            }, 1000);
        } catch (error) {
            setStatus("error");
            setErrorMessage(error.response?.data?.message || "Failed to add transaction");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#0B0F14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <h2 className="text-lg font-semibold text-white">Add Transaction</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">

                    {/* Amount & Type row */}
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-1.5">
                            <label className="text-sm font-medium text-gray-400">Amount (₹)</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                min="1"
                                placeholder="0.00"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-orange/50 focus:border-accent-orange"
                            />
                        </div>
                        <div className="w-1/3 space-y-1.5">
                            <label className="text-sm font-medium text-gray-400">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-400">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-400">Behavioral Emotion (Optional)</label>
                        <select
                            name="emotion"
                            value={formData.emotion}
                            onChange={handleChange}
                            className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
                        >
                            {emotions.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-400">Note (Optional)</label>
                        <input
                            type="text"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            placeholder="What was this for?"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
                        />
                    </div>

                    {status === "error" && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                            <AlertCircle size={16} />
                            <span>{errorMessage}</span>
                        </div>
                    )}
                    {status === "success" && (
                        <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-400/10 p-3 rounded-lg">
                            <CheckCircle2 size={16} />
                            <span>Transaction added successfully!</span>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={status === "loading" || status === "success"}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-accent-orange hover:bg-orange-500 disabled:opacity-50 disabled:bg-accent-orange transition-colors min-w-[140px]"
                        >
                            {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : "Add Transaction"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
