import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 120000
});

export async function uploadVideo(file, onProgress) {
  const form = new FormData();
  form.append("video", file);
  const { data } = await api.post("/api/v1/detect", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: e => onProgress?.(Math.round((e.loaded * 100) / (e.total || 1)))
  });
  return data;
}

export async function getJob(jobId) {
  const { data } = await api.get(`/api/v1/jobs/${jobId}`);
  return data;
}

export default api;