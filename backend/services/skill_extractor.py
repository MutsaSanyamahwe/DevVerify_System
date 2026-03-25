from sklearn.feature_extraction.text import TfidfVectorizer
from utils.skills_map import KNOWN_SKILLS, normalize_skill
from utils.education_map import DEGREE_PATTERNS, CERTIFICATION_PATTERNS, normalize_education
import re


def extract_cv_education(cv_text: str) -> dict:
    text = cv_text.lower()



    degrees = set()
    certifications = set()

    #degrees
    for pattern in DEGREE_PATTERNS:
        matches = re.findall(pattern,text)
        for match in matches:
            degrees.add(normalize_education(match))
   
    #Cetifications
    for pattern in CERTIFICATION_PATTERNS:
        matches = re.findall(pattern, text)
        for match in matches:
            certifications.add(normalize_education(match))

    return {
        "degrees": list(degrees),
        "certifications": list(certifications)
    }
    

def extract_github_skills(github_data: list[dict]) -> list[str]:
    skills = set()
    readme_texts = []

    for repo in github_data:
        # Languages
        for lang in repo.get("languages", []):
            skills.add(normalize_skill(lang.lower()))

        # Topics
        for topic in repo.get("topics", []):
            skills.add(normalize_skill(topic.lower()))

        # Collect readmes for TF-IDF
        readme = repo.get("readme")
        if readme:
            readme_texts.append(readme)

    # TF-IDF extraction from all readmes
    if readme_texts:
        tfidf_skills = _extract_with_tfidf(readme_texts)
        skills.update(tfidf_skills)

    return list(skills)



def _extract_with_tfidf(texts: list[str]) -> list[str]:
    if not texts:
        return []
    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=50,
        ngram_range=(1,2)
    )

    vectorizer.fit_transform(texts)
    terms = vectorizer.get_feature_names_out().tolist()

    return [
        normalize_skill(t) for t in terms
        if t.lower() in KNOWN_SKILLS
    ]