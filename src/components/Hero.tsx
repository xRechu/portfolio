"use client";

import { useLanguage } from "@/components/LanguageProvider";
import TextType from "@/components/TextType";
import Waves from "@/components/Waves";

export default function Hero() {
    const { language } = useLanguage();

    const copy =
        language === "pl"
            ? {
                titleStatic: "Tworze dla Ciebie",
                titleDynamic: [
                    "szybkie strony internetowe",
                    "sklepy e-commerce",
                    "automatyzacje procesow",
                    "wdrozenia AI",
                ],
                primaryCta: "Darmowa konsultacja",
                secondaryCta: "Zobacz realizacje",
            }
            : {
                titleStatic: "I build for you",
                titleDynamic: [
                    "fast business websites",
                    "e-commerce stores",
                    "process automations",
                    "AI implementations",
                ],
                primaryCta: "Free consultation",
                secondaryCta: "View projects",
            };

    return (
        <section id="start" className="hero">
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
                    <span className="hero-title-line hero-title-line-static">{copy.titleStatic}</span>
                    <TextType
                        as="span"
                        className="hero-title-line hero-title-line-dynamic"
                        text={copy.titleDynamic}
                        typingSpeed={60}
                        deletingSpeed={35}
                        pauseDuration={1800}
                        showCursor
                        cursorCharacter="|"
                        cursorClassName="hero-title-cursor"
                    />
                </h1>

                <div className="hero-buttons">
                    <a href="#kontakt" className="hero-btn hero-btn-primary">
                        {copy.primaryCta}
                    </a>
                    <a href="#realizacje" className="hero-btn hero-btn-secondary">
                        {copy.secondaryCta}
                    </a>
                </div>
            </div>
        </section>
    );
}
