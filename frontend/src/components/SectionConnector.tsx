import React, { useEffect, useRef, useState } from 'react';

const SectionConnector: React.FC = () => {
    const [animated, setAnimated] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setAnimated(true); },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const pins = Array.from({ length: 18 });

    return (
        <div
            ref={ref}
            className="relative w-full bg-[#050814] flex flex-col items-center justify-center py-0 overflow-hidden"
            style={{ height: '72px' }}
        >
            {/* Vertical drop line from top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-linear-to-b from-transparent to-cyan-400/60" />

            {/* Main PCB connector row */}
            <div className="relative flex items-center w-full max-w-5xl px-8">

                {/* Left wire */}
                <div
                    className="flex-1 h-px relative overflow-hidden"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(34,211,238,0.15) 20%, rgba(34,211,238,0.5))' }}
                >
                    {/* Travelling pulse */}
                    <div
                        className="absolute top-0 h-px w-24 bg-linear-to-r from-transparent via-cyan-400 to-transparent"
                        style={{
                            animation: animated ? 'travelRight 2.5s ease-in-out infinite' : 'none',
                            left: '-96px',
                        }}
                    />
                </div>

                {/* PCB Pin Strip */}
                <div className="flex items-center gap-0.75 px-1">
                    {pins.map((_, i) => {
                        const isTall = i % 3 === 1;
                        const isActive = i % 4 === 0 || i % 7 === 0;
                        return (
                            <div
                                key={i}
                                className="relative flex flex-col items-center"
                                style={{
                                    opacity: animated ? 1 : 0,
                                    transition: `opacity 0.4s ease ${i * 0.04}s`,
                                }}
                            >
                                {/* Top leg */}
                                <div
                                    className="w-px"
                                    style={{
                                        height: isTall ? '14px' : '8px',
                                        background: isActive ? 'rgba(34,211,238,0.9)' : 'rgba(34,211,238,0.3)',
                                    }}
                                />
                                {/* Pin body */}
                                <div
                                    style={{
                                        width: '6px',
                                        height: isTall ? '10px' : '7px',
                                        background: isActive
                                            ? 'rgba(34,211,238,0.25)'
                                            : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${isActive ? 'rgba(34,211,238,0.7)' : 'rgba(255,255,255,0.15)'}`,
                                        borderRadius: '1px',
                                        boxShadow: isActive ? '0 0 6px rgba(34,211,238,0.4)' : 'none',
                                    }}
                                />
                                {/* Bottom leg */}
                                <div
                                    className="w-px"
                                    style={{
                                        height: isTall ? '14px' : '8px',
                                        background: isActive ? 'rgba(34,211,238,0.9)' : 'rgba(34,211,238,0.3)',
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Right wire */}
                <div
                    className="flex-1 h-px relative overflow-hidden"
                    style={{ background: 'linear-gradient(to left, transparent, rgba(34,211,238,0.15) 20%, rgba(34,211,238,0.5))' }}
                >
                    {/* Travelling pulse */}
                    <div
                        className="absolute top-0 h-px w-24 bg-linear-to-r from-transparent via-purple-400 to-transparent"
                        style={{
                            animation: animated ? 'travelLeft 2.5s ease-in-out 1.25s infinite' : 'none',
                            right: '-96px',
                        }}
                    />
                </div>
            </div>

            {/* Vertical drop line to bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-4 bg-linear-to-t from-transparent to-cyan-400/60" />

            <style>{`
                @keyframes travelRight {
                    0%   { left: -96px; opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 1; }
                    100% { left: 100%; opacity: 0; }
                }
                @keyframes travelLeft {
                    0%   { right: -96px; opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 1; }
                    100% { right: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default SectionConnector;