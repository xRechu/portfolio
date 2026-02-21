"use client";

import Waves from "@/components/Waves";

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-waves">
                <Waves
                    lineColor="rgba(0, 0, 0, 0.08)"
                    backgroundColor="transparent"
                    waveSpeedX={0.02}
                    waveSpeedY={0.01}
                    waveAmpX={40}
                    waveAmpY={20}
                    friction={0.9}
                    tension={0.01}
                    maxCursorMove={120}
                    xGap={12}
                    yGap={36}
                />
            </div>

            <div className="hero-content">
                <h1 className="hero-title">
                    <span className="hero-title-line">Background lights</span>
                    <span className="hero-title-line">are cool you know.</span>
                </h1>

                <div className="hero-buttons">
                    <a href="#contact" className="hero-btn hero-btn-primary">
                        Get in touch
                    </a>
                    <a href="#work" className="hero-btn hero-btn-secondary">
                        View work
                    </a>
                </div>
            </div>
        </section>
    );
}
