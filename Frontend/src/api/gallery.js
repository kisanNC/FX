import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create a new album
export const createAlbum = (albumData) => {
  return axios.post(`${API_BASE_URL}/albums`, albumData);
};

// Get all albums
export const getAllAlbums = () => {
  return axios.get(`${API_BASE_URL}/albums`);
};

// Get a single album by ID
export const getAlbumById = (id) => {
  return axios.get(`${API_BASE_URL}/albums/${id}`);
};

// Delete an album
export const deleteAlbum = (id) => {
  return axios.delete(`${API_BASE_URL}/albums/${id}`);
};

// Update album info (name, preview image, etc.)
export const updateAlbum = (id, formData) => {
  return axios.post(`${API_BASE_URL}/albums/${id}?_method=PUT`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Upload an image to an album
export const uploadImageToAlbum = (id, formData) => {
  return axios.post(`${API_BASE_URL}/albums/${id}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
//  Get only images in a specific album
export const getImagesInAlbum = (albumId) => {
  return axios.get(`${API_BASE_URL}/albums/${albumId}/image`);
};

// Update a single image in an album
export const updateAlbumImage = (imageId, formData) => {
  return axios.put(`${API_BASE_URL}/albums/images/${imageId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Delete a single image in an album
export const deleteAlbumImage = (imageId) => {
  return axios.delete(`${API_BASE_URL}/albums/images/${imageId}`);
};
// Get all images from all albums
export const getAllAlbumImages = () => {
  return axios.get(`${API_BASE_URL}/albums/images`);
};
