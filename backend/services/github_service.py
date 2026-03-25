import httpx
import base64
from dotenv import load_dotenv
import os

load_dotenv()

BASE_URL = "https://api.github.com"
HEADERS = {
    "Accept": "application/vnd.github+json",
    "Authorization": f"Bearer {os.getenv('GITHUB_TOKEN')}"
}

# public API
async def fetch_user_github_data(username: str) -> list[dict]:
    #Fetching all relevant Github data for a user
    async with httpx.AsyncClient(headers=HEADERS,timeout=20) as client:
        repos = await _fetch_repos(client, username)
        repo_details = await _assemble_repo_details(client, repos)

        #overall_skills = _aggregate_skills(repo_details)

        return repo_details
    
#helper function all repo fetching
async def _fetch_repos(client: httpx.AsyncClient, username: str) -> list[dict]:
    #fetching all repos for a given user
    url = f"{BASE_URL}/users/{username}/repos?per_page=50&sort=updated"
    res = await client.get(url)
    res.raise_for_status()
    return res.json()

#helper function to fetch repo details
#repos was already fetched in the above helper function this function is just to assemble the .json returned
async def _assemble_repo_details(client: httpx.AsyncClient, repos:list[dict]) -> list[dict]:
    #For each repo, fetch name, URL description, languages, topics, and readme
    repo_details = []

    for repo in repos[:10]:
        languages = await _fetch_repo_languages(client, repo)
        readme_text = await _fetch_repo_readme(client, repo)
        repo_details.append({
            "name": repo["name"],
            "url": repo["html_url"],
            "description": repo.get("description"),
            "languages": languages,
            "topics": repo.get("topics", []),
            "readme_texts": readme_text
        })
    return repo_details


#helper Function to fetch specific repo languages
async def _fetch_repo_languages(client:httpx.AsyncClient, repo:dict) -> list[str]:
    """Fetch README content for a repo."""
    res = await client.get(repo["languages_url"])
    if res.status_code == 200:
        return list(res.json().keys())
    return []

#helper function to fetch specific repo readme's
async def _fetch_repo_readme(client:httpx.AsyncClient, repo:dict) -> str:
    """Fectching README content"""

    url = f"{BASE_URL}/repos/{repo['full_name']}/readme"
    res = await client.get(url)
    if res.status_code == 200:
        content = res.json().get("content", "")
        try:
            return base64.b64decode(content).decode("utf-8", errors="ignore")
        except Exception:
            return ""
    return ""

#helper function to extract only languages and topics
def _aggregate_skills(repo_details: list[dict]) -> list[str]:
    """Aggregate unique skills (languages + topics) across all repos"""
    skills = set()
    for repo in repo_details:
        skills.update(repo.get("languages", []))
        skills.update(repo.get("topics", []))
    return list(skills)
