const API_URL = "http://localhost:8000/api"; // or your backend URL

export const getServices = async () => {
  const res = await fetch(`${API_URL}/services`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return await res.json();
};

export const createService = async (formData) => {
  const res = await fetch(`${API_URL}/services`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to create service");
  return await res.json();
};

export const updateService = async (id, formData) => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: "POST", // use POST with `_method: PUT` if Laravel expects PUT
    headers: { Accept: "application/json" },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update service");
  return await res.json();
};

export const deleteService = async (id) => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete service");
  return await res.json();
};
