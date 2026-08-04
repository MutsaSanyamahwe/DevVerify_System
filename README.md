# DevVerify

**Live Demo:** [DevVerify](https://devverify-system-1.onrender.com/)

## The Problem

Every developer platform runs into the same wall on day one: the profile form.

A new user shows up, and before they can do anything useful — get matched, get hired, get discovered — they have to sit down and *describe themselves*. What they studied. What they're certified in. What they can actually build. And because this is typed by hand, it's slow, it's inconsistent, and it's rarely accurate. People forget things. People round up. People copy-paste the same three buzzwords everyone else uses because they don't know how else to describe what they do.

The result is a platform full of profiles that are hard to trust, because nothing behind them is verifiable — and hard to use, because the onboarding step that produces them is friction the user has to push through before they see any value.

DevVerify exists to remove that step entirely. Instead of asking someone to describe their skills, it looks at the evidence they already have — a CV and a GitHub account — and builds the profile from that.

## The Idea

A person's CV already says what they studied and what they're certified in. Their GitHub already shows what they've actually built, in what languages, and how. Between those two sources, most of a developer profile already exists — it just hasn't been assembled yet.

DevVerify is the thing that assembles it. Feed it a CV and a GitHub username, and it hands back a structured profile: degrees, certifications, categorized skills, and real project signal, all pulled from source rather than self-reported.

## How It Works

The flow is the same no matter who's asking:

1. **Something sends DevVerify a CV and a GitHub username.** That "something" might be a person on DevVerify's own site, or it might be another platform calling DevVerify's API during its own signup flow.
2. **The CV gets read.** DevVerify parses the PDF or DOCX and pattern-matches the text against known degree and certification formats to pull out qualifications.
3. **GitHub gets read.** DevVerify pulls the user's most recently updated repositories — their languages, topics, and README content — straight from the GitHub API.
4. **Skills get extracted, not guessed.** Languages and topics are normalized against a canonical skill map, and a TF-IDF pass over the README text catches additional skills mentioned in project descriptions but not captured in metadata alone.
5. **One structured profile comes back.** Education from the CV, skills and project data from GitHub, combined into a single response — ready to render as a portfolio, or to pre-fill someone else's signup form.

That's it. There's no separate "logic path" depending on who's asking — the same backend, the same extraction pipeline, produces the result either way.

## Two Ways to Use It

**As a product.** DevVerify has its own site: land on it, upload a CV, enter a GitHub username, and watch a portfolio get built — qualifications, skill tags grouped by category, and project data, presented with a bit of polish (animated stat counters, a clean results view). No other platform required.

**As infrastructure.** Under the product is a single API endpoint, `/analyze`, that any platform can call. [DevMatch](https://github.com/MutsaSanyamahwe/DevMatch) uses exactly this during its own onboarding — a new user connects their CV and GitHub, and by the time they see DevMatch's profile form, most of it is already filled in. DevVerify never knows or cares that it's DevMatch asking instead of its own frontend; the backend has no platform-specific branching at all.

That second use case is really the point. DevVerify isn't just a tool for making one nice-looking portfolio page — it's the verification layer other developer platforms can build onboarding on top of, so *they* don't have to solve "how do we get an accurate profile out of a new user" themselves.

## The API

### `POST /analyze`

**Request:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `cv_file` | file | CV as `.pdf`, `.doc`, or `.docx` |
| `github_username` | string | GitHub username to analyze |

**Response:**

```json
{
  "cv_info": {
    "degrees": ["bachelor of computer science"],
    "certifications": ["aws certified developer"]
  },
  "github_data": [
    {
      "name": "repo-name",
      "url": "https://github.com/user/repo-name",
      "description": "...",
      "languages": ["Python", "JavaScript"],
      "topics": ["machine-learning"],
      "readme_texts": "..."
    }
  ],
  "github_skills": ["python", "machine-learning", "react"]
}
```

Only the 10 most recently updated repositories are analyzed per request, to keep API call volume and response time reasonable.

## Where It Sits in the Ecosystem

- **DevVerify** — generates the verified profile, either through its own frontend or on behalf of another platform's onboarding.
- **[DevMatch](https://devmatch-1-hj4i.onrender.com/)** — calls DevVerify's `/analyze` endpoint at signup to pre-fill new user profiles, then skips DevVerify's frontend entirely.
- **RepoRecommender** — a separate service, linked from DevMatch's Explore page, that clusters repositories with K-Means to surface similar projects. It doesn't call DevVerify and isn't called by it — a neighbor in the ecosystem, not a dependency.

## Tech Stack

**Frontend**
- React 19 + Vite, React Router (landing / upload / results)
- Tailwind CSS, Framer Motion
- react-dropzone (CV upload), react-chartjs-2 + Chart.js (visualization), react-countup (result stats)

**Backend**
- FastAPI (Python)
- `pdfplumber` + `python-docx` for CV parsing
- GitHub REST API via async `httpx`
- scikit-learn `TfidfVectorizer` + a canonical skill-alias map for normalization
- Regex-based degree/certification extraction
- Docker (Python 3.12-slim)

## Getting Started

### Prerequisites
- Python 3.12+
- A GitHub personal access token (for higher API rate limits)

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

Run it:

```bash
uvicorn main:app --reload --port 8000
```

API available at `http://localhost:8000`, with `/analyze` as the working endpoint.

### Backend via Docker

```bash
cd backend
docker build -t devverify .
docker run -p 8000:8000 --env-file .env devverify
```

### Frontend

```bash
cd frontend/cv-matcher-frontend
npm install
npm run dev
```

By default the frontend points at the deployed backend (`https://devverify-system.onrender.com`). Update `src/api/analyze.js` to point at `http://localhost:8000` to run fully local.

## Project Structure

```
DevVerify_System/
├── backend/
│   ├── api/
│   │   └── routes.py            # POST /analyze
│   ├── services/
│   │   ├── cv_parser.py         # PDF/DOCX text extraction
│   │   ├── github_service.py    # GitHub API calls (repos, languages, READMEs)
│   │   └── skill_extractor.py   # CV education extraction + GitHub skill extraction (TF-IDF)
│   ├── utils/
│   │   ├── education_map.py     # Degree/certification regex patterns
│   │   └── skills_map.py        # Canonical skill names + aliases
│   ├── models/
│   │   └── schema.py
│   ├── main.py                  # FastAPI app entrypoint
│   ├── requirements.txt
│   └── Dockerfile
└── frontend/
    └── cv-matcher-frontend/
        ├── src/
        │   ├── api/
        │   │   └── analyze.js   # Calls the backend /analyze endpoint
        │   ├── pages/
        │   │   ├── LandingPage.jsx
        │   │   ├── UploadingPage.jsx
        │   │   └── ResultsPage.jsx
        │   ├── components/
        │   └── App.jsx
        └── package.json
```

## Environment Variables

| Variable | Description |
|---|---|
| `GITHUB_TOKEN` | GitHub personal access token used to authenticate requests to the GitHub API and raise rate limits |

## Author

**Mutsa Sanyamahwe**
Software Engineer

GitHub: [github.com/MutsaSanyamahwe](https://github.com/MutsaSanyamahwe)
LinkedIn: [linkedin.com/in/mutsa-sanyamahwe-77289529a](https://www.linkedin.com/in/mutsa-sanyamahwe-77289529a)
