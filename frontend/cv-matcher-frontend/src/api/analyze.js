const API_URL = "http://localhost:8000";

export async function analyzeProfile(file, githubUsername) {
  const formData = new FormData();
  formData.append("cv_file", file);
  formData.append("github_username", githubUsername);

  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Analysis failed");
  }

  return response.json();
}
