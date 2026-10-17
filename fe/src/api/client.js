const API_BASE_URL = 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const json = await res.json();
    return json;
  } catch (err) {
    console.warn(`[API] Failed to call ${url}:`, err.message);
    return null;
  }
}

export const api = {
  auth: {
    login: async (username, password) => {
      return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
    }
  },

  places: {
    getAll: async () => {
      const res = await request('/places');
      return res?.success ? res.data : null;
    },
    create: async (placeData) => {
      const res = await request('/places', {
        method: 'POST',
        body: JSON.stringify(placeData)
      });
      return res?.success ? res.data : null;
    },
    update: async (id, updates) => {
      const res = await request(`/places/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return res?.success ? res.data : null;
    },
    delete: async (id) => {
      const res = await request(`/places/${id}`, {
        method: 'DELETE'
      });
      return res?.success;
    },
    changeStatus: async (id, statusData) => {
      const res = await request(`/places/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(statusData)
      });
      return res?.success ? res.data : null;
    },
    vote: async (id) => {
      const res = await request(`/places/${id}/vote`, {
        method: 'POST'
      });
      return res?.success ? res.data : null;
    }
  },

  plans: {
    getAll: async () => {
      const res = await request('/plans');
      return res?.success ? res.data : null;
    },
    assign: async (placeId, dayName) => {
      const res = await request('/plans/assign', {
        method: 'POST',
        body: JSON.stringify({ placeId, dayName })
      });
      return res?.success ? res.data : null;
    },
    remove: async (placeId, dayName) => {
      const res = await request('/plans/remove', {
        method: 'POST',
        body: JSON.stringify({ placeId, dayName })
      });
      return res?.success ? res.data : null;
    }
  },

  upload: {
    image: async (file, folderId = '') => {
      const formData = new FormData();
      formData.append('file', file);
      if (folderId) formData.append('folderId', folderId);

      try {
        const res = await fetch(`${API_BASE_URL}/upload/image`, {
          method: 'POST',
          body: formData
        });
        const json = await res.json();
        return json?.success ? json.data : null;
      } catch (e) {
        console.error("Upload error:", e);
        return null;
      }
    }
  }
};
