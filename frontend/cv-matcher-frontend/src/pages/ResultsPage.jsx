import { useLocation, Link } from "react-router-dom"

const LANG_COLORS = {
    Python: "#3b82f6",
    JavaScript: "#f59e0b",
    TypeScript: "#3b82f6",
    "Jupyter Notebook": "#f97316",
    CSS: "#a855f7",
    SCSS: "#a855f7",
    HTML: "#ef4444",
    Dockerfile: "#06b6d4",
    Go: "#06b6d4",
    Rust: "#ef4444",
    Java: "#f59e0b",
    "C++": "#3b82f6",
    C: "#6b7280",
    Ruby: "#ef4444",
    Swift: "#f97316",
    Kotlin: "#a855f7",
    Shell: "#22c55e",
    Vue: "#22c55e",
    Dart: "#06b6d4",
}

// Broad keyword buckets for auto-categorising any skill tag
const CATEGORY_KEYWORDS = {
    "AI / ML": [
        "machine-learning", "deep-learning", "neural-network", "nlp",
        "natural-language-processing", "computer-vision", "tensorflow", "pytorch",
        "keras", "scikit-learn", "sklearn", "xgboost", "lightgbm", "huggingface",
        "transformers", "bert", "gpt", "llm", "reinforcement-learning",
        "classification", "regression", "clustering", "k-means", "k-means-clustering",
        "recommendation-system", "matching-system", "fit-score", "opencv",
        "data-science", "ml", "ai", "pandas", "numpy", "scipy", "matplotlib",
        "seaborn", "plotly", "jupyter", "jupyter notebook",
    ],
    "Languages & Frameworks": [
        "python", "javascript", "typescript", "java", "go", "rust", "c", "c++",
        "ruby", "swift", "kotlin", "dart", "php", "scala", "r",
        "react", "vue", "angular", "svelte", "nextjs", "nuxt", "remix",
        "express", "fastapi", "flask", "django", "rails", "spring", "laravel",
        "nestjs", "hono", "astro", "gatsby", "tailwind", "tailwind-css",
        "bootstrap", "sass", "scss", "css", "html", "vite", "webpack",
        "react-native", "expo", "flutter",
    ],
    "Databases & Data": [
        "sql", "mysql", "postgresql", "postgres", "sqlite", "mongodb", "redis",
        "firebase", "supabase", "dynamodb", "cassandra", "elasticsearch",
        "prisma", "drizzle", "sequelize", "typeorm", "graphql", "rest", "restful",
        "api", "websocket", "grpc",
    ],
    "Cloud & DevOps": [
        "docker", "kubernetes", "k8s", "aws", "gcp", "azure", "vercel", "netlify",
        "render", "heroku", "digitalocean", "terraform", "ansible", "ci-cd",
        "github-actions", "jenkins", "linux", "nginx", "traefik",
        "serverless", "lambda", "cloudflare", "dockerfile",
    ],
}

function categoriseSkills(skills) {
    const result = {}
    const used = new Set()

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        const matched = skills.filter(s => {
            const lower = s.toLowerCase().replace(/\s+/g, "-")
            return keywords.some(k => lower === k || lower.includes(k) || k.includes(lower))
        })
        if (matched.length > 0) {
            result[category] = matched
            matched.forEach(s => used.add(s))
        }
    }

    const other = skills.filter(s => !used.has(s))
    if (other.length > 0) result["Tools & Other"] = other

    return result
}

const CATEGORY_STYLES = {
    "AI / ML": { label: "text-teal-500", tag: "bg-teal-900/60 text-teal-300 border border-teal-700/40" },
    "Languages & Frameworks": { label: "text-blue-500", tag: "bg-blue-900/60 text-blue-300 border border-blue-700/40" },
    "Databases & Data": { label: "text-violet-400", tag: "bg-violet-900/60 text-violet-300 border border-violet-700/40" },
    "Cloud & DevOps": { label: "text-amber-500", tag: "bg-amber-900/60 text-amber-300 border border-amber-700/40" },
    "Tools & Other": { label: "text-zinc-500", tag: "bg-zinc-800 text-zinc-400 border border-zinc-700/40" },
}

function SkillTag({ skill, category }) {
    const style = CATEGORY_STYLES[category] || CATEGORY_STYLES["Tools & Other"]
    return (
        <span className={`text-xs px-3 py-1 rounded-full font-medium tracking-wide ${style.tag}`}>
            {skill}
        </span>
    )
}

function ProjectCard({ project }) {
    const JUNK = new Set(["m", "github", "render", "full-stack", "fullstack"])
    const mainLangs = (project.languages || []).slice(0, 5)
    const topTopics = (project.topics || []).filter(t => !JUNK.has(t)).slice(0, 5)

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-600 transition-colors duration-200 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-zinc-100 leading-snug">{project.name}</h3>
                    {project.description && (
                        <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">{project.description}</p>
                    )}
                </div>
                {project.url && (
                    <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-zinc-600 hover:text-zinc-300 transition-colors"
                        aria-label="Open repository"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </a>
                )}
            </div>

            {topTopics.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {topTopics.map(t => (
                        <span key={t} className="text-[11px] bg-zinc-800 text-zinc-400 border border-zinc-700/50 px-2.5 py-0.5 rounded-full">
                            {t}
                        </span>
                    ))}
                </div>
            )}

            {mainLangs.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-zinc-800">
                    {mainLangs.map(lang => (
                        <div key={lang} className="flex items-center gap-1.5">
                            <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ background: LANG_COLORS[lang] || "#6b7280" }}
                            />
                            <span className="text-[11px] text-zinc-500">{lang}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function ResultsPage() {
    const { state } = useLocation()

    if (!state) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 text-sm">
                No profile data found.
            </div>
        )
    }

    const { cv_info, github_data, github_skills } = state

    const degrees = cv_info?.degrees || []
    const certifications = [...new Set(cv_info?.certifications || [])]
    const projects = github_data || []

    const JUNK = new Set(["m", "github", "render", "full-stack", "fullstack"])
    const cleanSkills = [...new Set((github_skills || []).filter(s => !JUNK.has(s.toLowerCase())))]
    const categorised = categoriseSkills(cleanSkills)

    return (
        <div className="min-h-screen bg-zinc-950 text-white">

            {/* Nav */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
                <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
                    <Link to="/upload" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                        </svg>
                        back
                    </Link>
                    <span className="text-sm font-semibold text-zinc-100 tracking-wide">DevVerify</span>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-6 pt-24 pb-16 space-y-10">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase mb-2">Profile Analysis</p>
                        <h1 className="text-2xl font-semibold text-zinc-100">Your Developer Profile</h1>
                        <p className="text-sm text-zinc-500 mt-1">Based on your CV and GitHub activity</p>
                    </div>
                    <Link to="/upload">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-all">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                            </svg>
                            New analysis
                        </button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { num: projects.length, label: "Projects" },
                        { num: cleanSkills.length, label: "Skills detected" },
                        { num: degrees.length + certifications.length, label: "Qualifications" },
                    ].map(({ num, label }) => (
                        <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                            <div className="text-2xl font-semibold text-zinc-100">{num}</div>
                            <div className="text-xs text-zinc-500 mt-1">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Education & Certifications */}
                {(degrees.length > 0 || certifications.length > 0) && (
                    <section>
                        <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase mb-4">Education & Certifications</p>
                        <div className="space-y-2">
                            {degrees.map((d, i) => (
                                <div key={i} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                                    <div className="w-7 h-7 rounded-lg bg-blue-900/50 border border-blue-800/40 flex items-center justify-center shrink-0">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 6 3 6 3s6-1 6-3v-5" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-zinc-200 capitalize">{d}</span>
                                </div>
                            ))}
                            {certifications.map((c, i) => (
                                <div key={i} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                                    <div className="w-7 h-7 rounded-lg bg-teal-900/50 border border-teal-800/40 flex items-center justify-center shrink-0">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-zinc-200 capitalize">{c}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills — dynamic categories */}
                {cleanSkills.length > 0 && (
                    <section>
                        <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase mb-4">Skills</p>
                        <div className="space-y-5">
                            {Object.entries(categorised).map(([category, skills]) => {
                                const style = CATEGORY_STYLES[category] || CATEGORY_STYLES["Tools & Other"]
                                return (
                                    <div key={category}>
                                        <p className={`text-[11px] font-medium mb-2 ${style.label}`}>{category}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map(s => <SkillTag key={s} skill={s} category={category} />)}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <section>
                        <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase mb-4">Projects</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {projects.map(p => <ProjectCard key={p.name} project={p} />)}
                        </div>
                    </section>
                )}

            </div>
        </div>
    )
}