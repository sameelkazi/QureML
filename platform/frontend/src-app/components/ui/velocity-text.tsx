'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

export interface VelocityTextProps {
  className?: string;
  text?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  subCoordinates?: string;
}

export const VelocityText: React.FC<VelocityTextProps> = ({
  className,
  text = "HYBRID QUANTUM MACHINE LEARNING · ZERO-MISS ONCOLOGICAL TRIAGE · 6-QUBIT VARIATIONAL QUANTUM CIRCUITS · 100% SENSITIVITY AT TAU=0.10 · IBM BRISBANE HERON VERIFIED R=0.9926 · FAIR CAPACITY-MATCHED CLASSICAL PARITY · 2,865 MULTI-CONDITION PATIENT COHORTS · ACCELERATING CLINICAL ONCOLOGY · PRESS ON!",
  titlePrefix = "Early Cancer Detection is not a guessing game. It's time to ",
  titleHighlight = "SHIFT.",
  subCoordinates = "19° 07' 19\" N, 72° 50' 11\" E · SPIT MUMBAI"
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  const skewVelocity = useTransform(smoothVelocity, [-1, 1], ["45deg", "-45deg"]);

  const translateX = useTransform(scrollYProgress, [0, 1], [0, -3200]);
  const smoothTranslateX = useSpring(translateX, {
    mass: 3,
    stiffness: 400,
    damping: 50
  });

  return (
    <section 
      ref={containerRef} 
      className={cx(
        "relative h-[350vh] w-full bg-[#07090e] text-[#f8fafc]",
        "transition-colors duration-300",
        className
      )}
    >
      <div className="sticky top-0 left-0 right-0 w-full flex h-screen flex-col justify-between overflow-hidden px-6 py-8">
        <Header coordinates={subCoordinates} />
        <Title prefix={titlePrefix} highlight={titleHighlight} />
        <motion.p
          style={{
            skewX: skewVelocity,
            x: smoothTranslateX
          }}
          className={cx(
            "origin-bottom-left whitespace-nowrap text-6xl font-black uppercase leading-[0.85] md:text-8xl md:leading-[0.85] lg:text-9xl",
            "text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-300 to-emerald-400"
          )}
        >
          {text}
        </motion.p>
        <ScrollIndicators />
      </div>
    </section>
  );
};

export const Component = VelocityText;

const Header = ({ coordinates }: { coordinates: string }) => (
  <div className="relative mb-1 flex w-full justify-between items-center px-4">
    <p className="hidden text-xs md:block text-slate-400 font-mono tracking-wider">
      {coordinates}
    </p>
    <Logo />
    <Nav />
  </div>
);

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 grid place-items-center text-sky-400 font-black text-xs">
      QM
    </div>
    <span className="font-bold text-sm tracking-wider text-slate-200">QureML</span>
  </div>
);

const Nav = () => (
  <nav className="flex gap-4 text-xs font-semibold uppercase tracking-wider">
    <a href="#pipeline" className="text-slate-400 hover:text-sky-400 transition-colors">Pipeline</a>
    <a href="#compare" className="text-slate-400 hover:text-sky-400 transition-colors">Circuits</a>
    <a href="#benchmarks" className="text-slate-400 hover:text-sky-400 transition-colors">Ablation</a>
    <a href="dashboard.html" className="text-sky-400 hover:text-sky-300 transition-colors">Live OS ↗</a>
  </nav>
);

const Title = ({ prefix, highlight }: { prefix: string; highlight: string }) => (
  <div className="flex items-center justify-center px-4 gap-4 my-auto">
    <div className="h-16 w-16 md:h-20 md:w-20 bg-slate-900 border border-slate-700/60 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 grid place-items-center">
      <img
        src="assets/logo.webp"
        alt="QureML"
        className="h-12 w-12 object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=160&q=80";
        }}
      />
    </div>
    <h1 className="text-2xl font-bold sm:text-4xl md:text-6xl text-slate-100 max-w-4xl">
      <span className="text-slate-400 font-normal">
        {prefix}
      </span>
      <span className="inline-block -skew-x-[16deg] font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-rose-400">
        {highlight}
      </span>
    </h1>
  </div>
);

const ScrollIndicators = () => (
  <>
    <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 text-xs font-mono tracking-widest text-slate-500 lg:flex flex-col items-center gap-2">
      <span style={{ writingMode: "vertical-lr" }}>SCROLL</span>
      <ScrollIcon />
    </div>
    <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 text-xs font-mono tracking-widest text-slate-500 lg:flex flex-col items-center gap-2">
      <span style={{ writingMode: "vertical-lr" }}>SCROLL</span>
      <ScrollIcon />
    </div>
  </>
);

const ScrollIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mx-auto text-sky-400 animate-bounce"
  >
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
);

export default VelocityText;
