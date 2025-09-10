// src/api/apiClient.js
import axios from "axios";

const API_BASE = process.env.REACT_NATIVE_API_URL || "http://10.0.2.2:4000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

export async function registerCitizen({ fanHash, phone, idPhotoFormData }) {
  const form = new FormData();
  form.append("fanHash", fanHash);
  form.append("phone", phone);
  if (idPhotoFormData) form.append("idPhoto", idPhotoFormData);

  const res = await api.post("/api/auth/register-citizen", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function submitComplaint({ token, fanHash, description, location, tags = [], photos = [] }) {
  const form = new FormData();
  form.append("fanHash", fanHash);
  form.append("description", description);
  form.append("tags", JSON.stringify(tags));
  if (location) form.append("location", JSON.stringify(location));

  photos.forEach((p) => form.append("photos", p));

  const res = await api.post("/api/complaints", form, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function getMyComplaints({ token }) {
  const res = await api.get("/api/complaints/my", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
