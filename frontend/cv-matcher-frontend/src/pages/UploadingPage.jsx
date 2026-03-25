import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useDebounce } from "use-debounce";
import { analyzeProfile } from "../api/analyze";

export default function UploadingPage() {
    const [file, setFile] = useState(null);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const [debouncedUsername] = useDebounce(username, 3000);
    const [isValid, setIsValid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const canSubmit = file && isValid === true;

    useEffect(() => {
        if (!debouncedUsername.trim()) {
            setIsValid(null);
            return;
        }
        fetch(`https://api.github.com/users/${debouncedUsername}`)
            .then(res => setIsValid(res.ok))
            .catch(() => setIsValid(false));
    }, [debouncedUsername]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        },
        maxFiles: 1,
        onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
    });

    async function handleSubmit() {
        setLoading(true);
        setError(null);
        try {
            const result = await analyzeProfile(file, username);
            navigate("/results", { state: result });
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">

            {/* Nav */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
                <div className="max-w-3xl mx-auto flex justify-between items-center px-6 py-4">
                    <Link to="/" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                        </svg>
                        back
                    </Link>
                    <span className="text-sm font-semibold text-zinc-100 tracking-wide">DevVerify</span>
                </div>
            </nav>

            {/* Main */}
            <div className="max-w-3xl mx-auto px-6 pt-28 pb-16 space-y-10">

                {/* Header */}
                <div>
                    <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase mb-2">Portfolio Review</p>
                    <h1 className="text-2xl font-semibold text-zinc-100">Analyze your profile</h1>
                    <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                        Upload your CV and enter your GitHub username for an AI-powered portfolio review.
                    </p>
                </div>

                {/* CV Upload */}
                <section>
                    <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase mb-4">CV / Resume</p>

                    <div
                        {...getRootProps()}
                        className={`
              border border-dashed rounded-2xl p-10 text-center cursor-pointer
              flex flex-col items-center gap-3 transition-all duration-200
              ${isDragActive
                                ? "border-blue-600 bg-blue-900/10"
                                : "border-zinc-800 hover:border-zinc-600 bg-zinc-900"
                            }
            `}
                    >
                        <input {...getInputProps()} />

                        <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-zinc-200">
                                {isDragActive ? "Drop it here" : "Drop your file here"}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">PDF or Word — up to 5MB</p>
                        </div>

                        <span className="text-xs px-4 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors">
                            Browse files
                        </span>
                    </div>

                    {file && (
                        <div className="mt-3 flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                            <div className="w-7 h-7 rounded-lg bg-teal-900/50 border border-teal-800/40 flex items-center justify-center shrink-0">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <span className="text-sm text-zinc-200 flex-1 truncate font-mono">{file.name}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                className="text-zinc-600 hover:text-zinc-400 transition-colors text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </section>

                {/* GitHub Username */}
                <section>
                    <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase mb-4">GitHub username</p>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 space-y-3">
                        <div className="relative flex items-center">
                            <span className="absolute left-3 text-sm text-zinc-600 font-mono pointer-events-none select-none">
                                github.com/
                            </span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="your-username"
                                className={`
                  w-full bg-zinc-800 border rounded-xl pl-28 pr-4 py-2.5 text-sm text-white font-mono
                  focus:outline-none focus:ring-2 transition-all
                  ${isValid === true ? "border-teal-700 focus:ring-teal-600/30" : ""}
                  ${isValid === false ? "border-red-800  focus:ring-red-700/30" : ""}
                  ${isValid === null ? "border-zinc-700 focus:ring-zinc-600/30" : ""}
                `}
                            />
                        </div>

                        {isValid === true && (
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                <p className="text-xs text-teal-400">GitHub user found</p>
                            </div>
                        )}
                        {isValid === false && (
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                <p className="text-xs text-red-400">Username not found</p>
                            </div>
                        )}
                        {isValid === null && (
                            <p className="text-xs text-zinc-500">Public repos will be analyzed for activity and quality.</p>
                        )}
                    </div>
                </section>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-red-900/60 rounded-xl">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                {/* Submit */}
                <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-zinc-600">Analysis takes ~15 seconds</p>
                    <button
                        disabled={!canSubmit || loading}
                        onClick={handleSubmit}
                        className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${canSubmit && !loading
                                ? "bg-zinc-100 hover:bg-white text-zinc-950 cursor-pointer"
                                : "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed"
                            }
            `}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                Analyze profile
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}