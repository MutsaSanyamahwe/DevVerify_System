# DevVerify

**Live Demo** [DevVerify](https://devverify-system-1.onrender.com/)

DevVerify is an automated developer portfolio generator. Give it a CV and a GitHub username, and it builds a structured profile — degrees, certifications, categorized skills, and project signal — pulled directly from those two sources instead of typed in by hand.

It works two ways:

1. **As a standalone website** — upload a CV, enter a GitHub username, and DevVerify generates a developer portfolio (qualifications, categorized skill tags, GitHub-derived project data) through its own landing → upload → results flow.
2. **As an onboarding engine for other platforms** — the same backend exposes a single `/analyze` endpoint that any platform can call to pre-fill a user profile. [DevMatch](https://github.com/MutsaSanyamahwe/DevMatch) uses it exactly this way during signup.

The frontend and the integration use case hit the same FastAPI backend — there's no separate logic for "standalone" vs "embedded" use.

---

## Problem Statement

Manual profile creation on developer platforms tends to produce:

- Incomplete or inaccurate skill representation
- Inflated or unverifiable credentials
- High onboarding friction — users have to type out everything themselves
- Profiles that are hard to trust because nothing backs them up

DevVerify exists to replace that manual step with evidence pulled directly from a CV and a GitHub account.

---

## What DevVerify Does

Given a CV file and a GitHub username, DevVerify:

- **Parses the CV** (PDF or DOCX) and extracts degrees and certifications using pattern matching against known degree/certification formats
- **Fetches GitHub data** — a user's repositories, each repo's languages, topics, and README content (via the GitHub REST API)
- **Extracts skills** from that GitHub data by normalizing languages/topics against a canonical skill-alias map, then supplements that with TF-IDF keyword extraction over repo READMEs to catch additional skills mentioned in project descriptions
- **Returns one structured JSON response** combining CV-derived education data with GitHub-derived skills and repo details

This is the layer DevMatch calls during onboarding so a new user's profile is mostly pre-filled before they see a form — and the same flow is also what powers DevVerify's own portfolio site.

---

## Frontend: Portfolio Generation

The frontend (`frontend/cv-matcher-frontend`) is a standalone React app with its own three-step flow:

- **Landing page** — entry point explaining the product
- **Upload page** — drag-and-drop CV upload (`react-dropzone`) plus a GitHub username field
- **Results page** — the generated portfolio: qualification count, degrees and certifications, skills grouped into categories with tags, and animated stat counters (`react-countup`) summarizing the extracted data

It calls the same `/analyze` endpoint described below, so the standalone site and any third-party integration (like DevMatch) are backed by identical extraction logic.

---

## API

DevVerify exposes a single endpoint.

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

Only a user's 10 most recently updated repositories are analyzed per request, to keep GitHub API call volume and response time reasonable.

---

## How It Fits Into the Ecosystem

DevVerify works on its own and as infrastructure for other platforms:

- **As a product** — its own frontend lets anyone generate a developer portfolio directly, no other platform required.
- **As infrastructure for [DevMatch](https://github.com/MutsaSanyamahwe/DevMatch)** — DevMatch calls DevVerify's `/analyze` endpoint during onboarding and uses the response to pre-fill a new user's profile, skipping DevVerify's own frontend entirely.
- **RepoRecommender** — a separate service that clusters repositories with K-Means to recommend similar projects. Linked from DevMatch's Explore page; not called by DevVerify.

The backend has no platform-specific logic baked in — it doesn't know or care whether the caller is its own frontend or another system's onboarding flow.

---

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router (landing / upload / results flow)
- Tailwind CSS
- Framer Motion (animation)
- react-dropzone (CV upload)
- react-chartjs-2 + Chart.js (skill/data visualization)
- react-countup (animated result stats)

**Backend**
- FastAPI (Python)
- `pdfplumber` (PDF parsing), `python-docx` (DOCX parsing)
- GitHub REST API via `httpx` (async)
- scikit-learn `TfidfVectorizer` + canonical skill-alias map for skill normalization
- Regex pattern matching for degree/certification extraction
- Docker (Python 3.12-slim base)

---

## Getting Started

### Prerequisites

- Python 3.12+
- A GitHub personal access token (for higher API rate limits when fetching repo data)

### Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

Run the server:

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`, with the analyze endpoint at `http://localhost:8000/analyze`.

### Docker (Backend)

```bash
cd backend
docker build -t devverify .
docker run -p 8000:8000 --env-file .env devverify
```

### Frontend Setup

```bash
cd frontend/cv-matcher-frontend
npm install
npm run dev
```

By default the frontend calls the deployed backend (`https://devverify-system.onrender.com`) — update `src/api/analyze.js` to point at `http://localhost:8000` if you want to run fully locally against your own backend.

---

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

---

## Environment Variables

| Variable | Description |
|---|---|
| `GITHUB_TOKEN` | GitHub personal access token used to authenticate requests to the GitHub API and raise rate limits |

---

## Author

**Mutsa Sanyamahwe**
Software Engineer

GitHub: [github.com/MutsaSanyamahwe](https://github.com/MutsaSanyamahwe)
LinkedIn: [linkedin.com/in/mutsa-sanyamahwe-77289529a](https://www.linkedin.com/in/mutsa-sanyamahwe-77289529a)
