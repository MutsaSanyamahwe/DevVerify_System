import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";

const stats = [
    { end: 120, suffix: "+", label: "Skills analyzed" },
    { end: 85, suffix: "%", label: "Accuracy" },
    { end: 60, suffix: "+", label: "Verified skills" },
    { end: 15, suffix: "s", label: "Analysis time" },
];

const steps = [
    { number: "01", title: "Upload your CV", desc: "Drop your PDF or Word doc. Skills, experience, and qualifications extracted automatically." },
    { number: "02", title: "Enter GitHub username", desc: "We fetch your public repos, languages, topics, and README content for deep analysis." },
    { number: "03", title: "AI cross-references", desc: "Your CV claims are matched against real GitHub projects using NLP and semantic scoring." },
    { number: "04", title: "Get your profile", desc: "See verified skills, gaps, and hidden strengths — all backed by your actual work." },
];

export default function LandingPage() {
    const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.3 });

    return (
        <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

        .font-display { font-family: 'Instrument Serif', serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .anim-1 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.05s both; }
        .anim-2 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.18s both; }
        .anim-3 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.3s  both; }
        .anim-4 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.42s both; }
        .anim-5 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.54s both; }
        .anim-img { animation: fadeIn 1s cubic-bezier(.22,1,.36,1) 0.2s both; }

        .shimmer-text {
          background: linear-gradient(90deg, #e4e4e7 0%, #fff 35%, #71717a 55%, #e4e4e7 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .glow-line {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #3f3f46 30%, #52525b 50%, #3f3f46 70%, transparent 100%);
        }

        .step-card { transition: border-color 0.2s ease, transform 0.2s ease; }
        .step-card:hover { border-color: #52525b; transform: translateY(-3px); }

        .hero-glow {
          position: absolute;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%);
          top: -60px; right: -60px;
          pointer-events: none;
          border-radius: 50%;
        }

        .tag-pill {
          font-size: 11px;
          padding: 3px 11px;
          border-radius: 999px;
          border: 0.5px solid #3f3f46;
          color: #71717a;
          background: #18181b;
          white-space: nowrap;
        }

        .stat-card-enter {
          opacity: 0;
          transform: translateY(20px);
        }
        .stat-card-visible {
          animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) both;
        }
      `}</style>

            {/* NAV */}
            <nav className="font-body fixed top-0 left-0 w-full z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900">
                <div className="max-w-6xl mx-auto flex justify-between items-center px-8 py-4">
                    <span className="text-sm font-semibold tracking-wide text-zinc-100">DevVerify</span>
                    <div className="flex items-center gap-8">
                        <a href="#stats" className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors duration-150">Stats</a>
                        <a href="#how-it-works" className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors duration-150">How it works</a>
                        <Link to="/upload">
                            <button className="text-xs font-medium px-4 py-1.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 transition-colors">
                                Get started
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section id="hero" className="font-body min-h-screen max-w-6xl mx-auto px-8 pt-36 pb-24">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-16 pt-24">

                    {/* Copy */}
                    <div className="flex-1 flex flex-col gap-6 max-w-xl">
                        <div className="anim-1 flex items-center gap-2.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-medium tracking-widest text-zinc-500 uppercase">AI-Powered Developer Profiling</span>
                        </div>

                        <h1 className="anim-2 font-display text-5xl lg:text-6xl font-normal leading-[1.08] text-zinc-100">
                            Know your skills.<br />
                            <em className="shimmer-text not-italic">Prove them.</em>
                        </h1>

                        <p className="anim-3 text-sm text-zinc-400 leading-relaxed max-w-md">
                            Upload your CV, enter your GitHub username, and get an instant AI-verified developer skill profile. See what you truly know — backed by your real work, not just what's written on paper.
                        </p>

                        <div className="anim-4 flex items-center gap-4">
                            <Link to="/upload">
                                <button className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white text-zinc-950 hover:bg-zinc-100 transition-all duration-150">
                                    Analyze my profile
                                    <svg className="transition-transform duration-150 group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </button>
                            </Link>
                            <a href="#how-it-works" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors duration-150">
                                See how it works →
                            </a>
                        </div>

                        <div className="anim-5 flex flex-wrap gap-2 pt-1">
                            {["Python", "React", "FastAPI", "NLP", "scikit-learn", "Docker"].map(s => (
                                <span key={s} className="tag-pill">{s}</span>
                            ))}
                        </div>
                    </div>

                    {/* Image */}
                    <div className="anim-img flex-1 relative flex justify-center lg:justify-end">
                        <div className="hero-glow" />
                        <img
                            src="/images/LandingPage1.png"
                            alt="DevVerify profile analysis"
                            className="relative z-10 w-full max-w-md lg:max-w-lg object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>
            </section>

            <div className="glow-line" />

            {/* STATS */}
            <section id="stats" ref={statsRef} className="font-body max-w-6xl mx-auto px-8 py-20">
                <p className="text-xs font-medium tracking-widest text-zinc-600 uppercase mb-10">By the numbers</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map(({ end, suffix, label }, i) => (
                        <div
                            key={label}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-1"
                            style={statsInView ? { animation: `fadeUp 0.6s cubic-bezier(.22,1,.36,1) ${i * 0.1}s both` } : { opacity: 0 }}
                        >
                            <div className="text-4xl font-semibold text-zinc-100 tracking-tight tabular-nums">
                                {statsInView ? <CountUp end={end} duration={2.2} /> : 0}{suffix}
                            </div>
                            <div className="text-xs text-zinc-500 mt-1">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="glow-line" />

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="font-body max-w-6xl mx-auto px-8 py-20">
                <div className="flex flex-col gap-10">
                    <div>
                        <p className="text-xs font-medium tracking-widest text-zinc-600 uppercase mb-3">How it works</p>
                        <h2 className="font-display text-4xl font-normal text-zinc-100 leading-tight">
                            Four steps to clarity.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {steps.map((step) => (
                            <div key={step.number} className="step-card bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
                                <span className="text-xs font-mono text-zinc-700 tracking-widest">{step.number}</span>
                                <h3 className="text-sm font-semibold text-zinc-100">{step.title}</h3>
                                <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="glow-line" />

            {/* BOTTOM CTA */}
            <section className="font-body max-w-6xl mx-auto px-8 py-28 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="flex flex-col gap-3">
                    <h2 className="font-display text-4xl lg:text-5xl font-normal text-zinc-100 leading-tight">
                        Signal, not noise.
                    </h2>
                    <p className="text-sm text-zinc-500 max-w-md leading-relaxed">
                        Clear insights with no fluff. Understand exactly where your skills stand — backed by your real work.
                    </p>
                </div>
                <Link to="/upload">
                    <button className="group shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-white text-zinc-950 hover:bg-zinc-100 transition-all duration-150">
                        Get started free
                        <svg className="transition-transform duration-150 group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </Link>
            </section>

            {/* FOOTER */}
            <footer className="font-body border-t border-zinc-900">
                <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-600">DevVerify</span>
                    <span className="text-xs text-zinc-700">AI-powered developer skill analysis</span>
                </div>
            </footer>

        </div>
    );
}