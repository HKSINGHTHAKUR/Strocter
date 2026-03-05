import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const CHATBASE_SCRIPT_ID = "jg5SgcOjClGe4hjq0QAdd";
const CHATBASE_SCRIPT_SRC = "https://www.chatbase.co/embed.min.js";

const ChatbotWidget = () => {
    const { user } = useAuth();
    const identifiedRef = useRef(false);

    useEffect(() => {
        // 1. Bootstrap chatbase queue (same as their snippet)
        if (!window.chatbase || window.chatbase("getState") !== "initialized") {
            window.chatbase = (...args) => {
                if (!window.chatbase.q) window.chatbase.q = [];
                window.chatbase.q.push(args);
            };
            window.chatbase = new Proxy(window.chatbase, {
                get(target, prop) {
                    if (prop === "q") return target.q;
                    return (...args) => target(prop, ...args);
                },
            });
        }

        // 2. Inject the script tag (only once)
        if (!document.getElementById(CHATBASE_SCRIPT_ID)) {
            const script = document.createElement("script");
            script.src = CHATBASE_SCRIPT_SRC;
            script.id = CHATBASE_SCRIPT_ID;
            script.domain = "www.chatbase.co";
            document.body.appendChild(script);
        }
    }, []);

    // 3. Once user is available, fetch the identity token and call identify
    useEffect(() => {
        if (!user || identifiedRef.current) return;

        const identifyUser = async () => {
            try {
                const { data } = await api.get("/chatbot/token");
                if (data.token && window.chatbase) {
                    window.chatbase("identify", { token: data.token });
                    identifiedRef.current = true;
                }
            } catch (err) {
                console.error("Chatbot identify failed:", err);
            }
        };

        identifyUser();
    }, [user]);

    return null; // Chatbase renders its own bubble UI
};

export default ChatbotWidget;
