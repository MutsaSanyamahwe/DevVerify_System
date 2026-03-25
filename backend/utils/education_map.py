import re

#Degrees
DEGREE_PATTERNS = [
    r"(bachelor(?:'s)? of [a-z\s]+)",
    r"(master(?:'s)? of [a-z\s]+)",
    r"(bsc [a-z\s]+)",
    r"(msc [a-z\s]+)",
    r"(phd in [a-z\s]+)",
    r"(btech [a-z\s]+)",
    r"(beng [a-z\s]+)"
]

#certificates
CERTIFICATION_PATTERNS = [
    # AWS
    r"(aws\s+certified\s+[a-z\s]+?)(?=\s|:|$)",

    # Microsoft
    r"(microsoft\s+certified\s+[a-z\s]+?)(?=\s|:|$)",

    # Google
    r"(google\s+(?:professional|associate)\s+[a-z\s]+?)(?=\s|:|$)",

    # Azure (common cert names)
    r"(azure\s+(?:administrator|developer|fundamentals|architect)[a-z\s]*)(?=\s|:|$)",

    # IBM
    r"(ibm\s+[a-z\s]+?\s+(?:professional\s+)?(?:certificate|certification))(?=\s|:|$)",

    # Coursera
    r"(coursera\s+[a-z\s]+?)(?=\s|:|$)",

    # Udemy
    r"(udemy\s+[a-z\s]+?)(?=\s|:|$)",

    # edX
    r"(edx\s+[a-z\s]+?)(?=\s|:|$)",

    # Generic certificates
    r"(certificate\s+in\s+[a-z\s]+?)(?=\s|:|$)",
    r"(certification\s+in\s+[a-z\s]+?)(?=\s|:|$)"
]

def normalize_education(text: str) -> str:
    return text.lower().strip()