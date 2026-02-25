import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link to="/" className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Strocter" className="h-8 w-auto" />
            <span className="text-white font-medium text-lg tracking-wide">
                Strocter
            </span>
        </Link>
    );
}
