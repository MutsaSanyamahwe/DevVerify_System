#Canonical skill name -> and list of aliases

SKILL_ALIASES = {
    # Frontend
    "react": ["reactjs", "react.js", "react js"],
    "react native": ["reactnative", "react-native", "rn"],
    "nextjs": ["next.js", "next js"],
    "angular": ["angular.js", "angularjs"],
    "vue": ["vue.js", "vuejs"],

    # Backend
    "nodejs": ["node.js", "node js", "node"],
    "springboot": ["spring boot"],
    "rails": ["ruby on rails"],
    "fastapi": ["fast api"],
    "typescript": ["ts"],
    "javascript": ["js"],

    # Databases
    "postgresql": ["postgres", "psql"],
    "mongodb": ["mongo"],

    # Web / Styling
    "html": ["hypertext markup language"],
    "css": ["cascading style sheets"],
    "tailwindcss": ["tailwind", "tailwind css"],

    # APIs
    "rest": ["rest api", "restful api", "restfulapis", "rest apis"],

    # Data & ML
    "machine learning": ["ml"],
    "natural language processing": ["nlp"],
    "extract transform load": ["etl", "data pipeline", "data pipelines"],
    "exploratory data analysis": ["eda", "exploratory analysis"]
}

ALIAS_LOOKUP = {
    alias: canonical
    for canonical, aliases in SKILL_ALIASES.items()
    for alias in aliases
}

KNOWN_SKILLS = list(SKILL_ALIASES.keys()) + [
    # Languages
    "python", "java", "c++", "c#", "ruby", "go", "rust", "swift", "php", "r", "perl", "bash", "shell", "julia",

    # Backend / Frameworks
    "django", "flask", "express", "spring", "laravel", "symfony", "fastify", "nestjs",

    # Databases
    "mysql", "sqlite", "redis", "firebase", "mssql", "cassandra", "neo4j", "oracle", "dynamodb", "cockroachdb",

    # Frontend / Styling
    "sass", "scss", "less", "bootstrap", "material-ui", "chakra-ui",

    # DevOps / Cloud
    "docker", "kubernetes", "ci/cd", "terraform", "ansible", "jenkins", "gitlab-ci", "circleci", "helm", "aws", "gcp", "azure",

    # ML / Data
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "matplotlib", "seaborn", "plotly", "keras", "opencv", "xgboost", "lightgbm", "catboost", "sqlalchemy", "beautifulsoup", "scrapy", "data visualization", "web-scraping",

    # Misc
    "git", "linux", "bash", "unix", "windows", "macos", "graphql", "rest"
]

def normalize_skill(skill: str) -> str:
    cleaned = skill.lower().strip()
    return ALIAS_LOOKUP.get(cleaned, cleaned)

