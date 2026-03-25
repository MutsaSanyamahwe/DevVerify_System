from fastapi import APIRouter, UploadFile, File, Form
from services.cv_parser import extract_text
from services.github_service import fetch_user_github_data
from services.skill_extractor import extract_github_skills, extract_cv_education

router = APIRouter()

@router.post("/analyze")
async def analyze(
    cv_file: UploadFile = File(...),
    github_username: str = Form(...)
):
    
    file_bytes = await cv_file.read()
    cv_text = extract_text(file_bytes, cv_file.filename)
    github_data = await fetch_user_github_data(github_username)

    cv_info = extract_cv_education(cv_text)
    #cv_skills = extract_cv_skills(cv_text)
    github_skills = extract_github_skills(github_data)

    return {
        #"cv_skills": cv_skills,
        "cv_info": cv_info,
        "github_data": github_data,
        "github_skills": github_skills,
    }

