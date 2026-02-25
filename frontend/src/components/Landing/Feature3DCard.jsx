import { useState, useRef, useEffect, createContext, useContext } from "react";

const MouseEnterContext = createContext([false, () => { }]);

export const CardContainer = ({
    children,
    className = "",
    containerClassName = "",
}) => {
    const containerRef = useRef(null);
    const [isMouseEntered, setIsMouseEntered] = useState(false);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;

        // Exact 6 degree limits specified in requirements
        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate bounded rotation maps (-6 to +6 degrees)
        const rotateY = ((mouseX - width / 2) / (width / 2)) * 6;
        const rotateX = ((mouseY - height / 2) / (height / 2)) * -6;

        containerRef.current.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    };

    const handleMouseEnter = () => {
        setIsMouseEntered(true);
        if (!containerRef.current) return;
        // Fast tracking 0.1s transition exclusively when entering the card
        containerRef.current.style.transition = "transform 0.1s ease-out";
    };

    const handleMouseLeave = () => {
        setIsMouseEntered(false);
        if (!containerRef.current) return;
        // Smooth 0.5s transition to bounce back to neutral
        containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
        containerRef.current.style.transition = "transform 0.5s ease-out";
    };

    return (
        <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
            <div
                className={`flex items-center justify-center ${containerClassName}`}
                style={{
                    perspective: "1200px",
                }}
            >
                <div
                    ref={containerRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className={`relative flex items-center justify-center transition-all duration-200 ease-out will-change-transform ${className}`}
                    style={{
                        transformStyle: "preserve-3d",
                    }}
                >
                    {children}
                </div>
            </div>
        </MouseEnterContext.Provider>
    );
};

export const CardBody = ({ children, className = "" }) => {
    return (
        <div
            className={`
                relative h-full w-full transform-style-3d bg-[#0f1115]/80 backdrop-blur-xl
                border border-white/5 rounded-2xl p-8 transition-all duration-500 group
                hover:shadow-[0_0_60px_rgba(255,120,0,0.15)]
                after:absolute after:inset-0 after:rounded-2xl after:opacity-0 group-hover:after:opacity-100
                after:bg-gradient-to-br after:from-orange-500/10 after:to-purple-500/10 after:blur-xl after:-z-10
                after:transition-all after:duration-500
                ${className}
            `}
            style={{
                transformStyle: "preserve-3d",
            }}
        >
            {children}
        </div>
    );
};

export const CardItem = ({
    as: Tag = "div",
    children,
    className = "",
    translateX = 0,
    translateY = 0,
    translateZ = 0,
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0,
    ...rest
}) => {
    const ref = useRef(null);
    const [isMouseEntered] = useContext(MouseEnterContext);

    useEffect(() => {
        if (!ref.current) return;

        if (isMouseEntered) {
            // Apply the hover depth translations
            ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
        } else {
            // Reset to flat layout
            ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
        }
    }, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ]);

    return (
        <Tag
            ref={ref}
            className={`transition-all duration-500 ease-out will-change-transform ${className}`}
            {...rest}
        >
            {children}
        </Tag>
    );
};
