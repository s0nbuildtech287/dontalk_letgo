// API Client for LetGoo
// Supports Hybrid Architecture: Spring Boot Backend (Local/Dedicated) & Google Sheets API (Vercel Serverless)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const SHEET_API_URL = import.meta.env.VITE_SHEET_API_URL || 'https://script.google.com/macros/s/AKfycbwjaHMZjNh8qphif39_tHnIXRJnfurzhHTMON3sqiKgkvKq_RRZnU8scgqvGw0dQnVa/exec';

// Cloudinary client config (Used for direct uploads when backend is unavailable)
const CLOUDINARY_CLOUD_NAME = 'wfrhz0tt';
const CLOUDINARY_API_KEY = '689521348186836';
const CLOUDINARY_API_SECRET = 'xc0i-feB99Dlp-zHgxDAnG4HZCU';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout for local backend
    const res = await fetch(url, { ...options, headers, signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {
    // Local backend is offline or unreachable (e.g. deployed on Vercel)
    return null;
  }
}

async function sheetRequest(payload = null) {
  if (!SHEET_API_URL) return null;

  try {
    if (!payload) {
      // GET all data
      const res = await fetch(SHEET_API_URL, { method: 'GET' });
      if (!res.ok) return null;
      return await res.json();
    } else {
      // POST operation
      const res = await fetch(SHEET_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) return null;
      return await res.json();
    }
  } catch (err) {
    console.warn('[Google Sheets] API call error:', err.message);
    return null;
  }
}

export const api = {
  auth: {
    login: async (username, password) => {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      return res;
    }
  },

  places: {
    getAll: async () => {
      // 1. Try local backend first
      const res = await request('/places');
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }

      // 2. Fallback to Google Sheets
      const sheetRes = await sheetRequest();
      if (sheetRes?.success && Array.isArray(sheetRes?.data?.places) && sheetRes.data.places.length > 0) {
        return sheetRes.data.places;
      }

      return null;
    },

    create: async (placeData) => {
      // Sync to local backend if running
      request('/places', {
        method: 'POST',
        body: JSON.stringify(placeData)
      });

      // Sync to Google Sheet
      sheetRequest({ action: 'create_place', place: placeData });

      return placeData;
    },

    update: async (id, updates) => {
      request(`/places/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      sheetRequest({ action: 'update_place', id, updates });
      return updates;
    },

    delete: async (id) => {
      request(`/places/${id}`, {
        method: 'DELETE'
      });

      sheetRequest({ action: 'delete_place', id });
      return true;
    },

    changeStatus: async (id, statusData) => {
      request(`/places/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(statusData)
      });

      sheetRequest({ action: 'change_status', id, ...statusData });
      return true;
    },

    vote: async (id) => {
      request(`/places/${id}/vote`, {
        method: 'POST'
      });

      sheetRequest({ action: 'vote_place', id });
      return true;
    }
  },

  plans: {
    getAll: async () => {
      const res = await request('/plans');
      if (res?.success && res.data) {
        return res.data;
      }

      const sheetRes = await sheetRequest();
      if (sheetRes?.success && sheetRes.data?.weekPlans) {
        return sheetRes.data.weekPlans;
      }

      return null;
    },

    assign: async (placeId, dayName, options = {}) => {
      request('/plans/assign', {
        method: 'POST',
        body: JSON.stringify({ placeId, dayName })
      });

      sheetRequest({ action: 'assign_plan', placeId, dayName, ...options });
      return true;
    },

    remove: async (placeId, dayName) => {
      request('/plans/remove', {
        method: 'POST',
        body: JSON.stringify({ placeId, dayName })
      });

      sheetRequest({ action: 'remove_plan', placeId, dayName });
      return true;
    }
  },

  upload: {
    image: async (file, folderId = '') => {
      // 1. Try local Spring Boot backend upload
      try {
        const formData = new FormData();
        formData.append('file', file);
        if (folderId) formData.append('folderId', folderId);

        const res = await fetch(`${API_BASE_URL}/upload/image`, {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.success && json.data) {
            return json.data;
          }
        }
      } catch (e) {
        // Backend offline, proceed to direct Cloudinary
      }

      // 2. Direct Cloudinary upload (Works on Vercel without any backend!)
      try {
        const timestamp = String(Math.floor(Date.now() / 1000));
        const strToSign = `timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(strToSign);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const cFormData = new FormData();
        cFormData.append('file', file);
        cFormData.append('api_key', CLOUDINARY_API_KEY);
        cFormData.append('timestamp', timestamp);
        cFormData.append('signature', signature);

        const cRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: cFormData
        });

        if (cRes.ok) {
          const cJson = await cRes.json();
          return {
            directUrl: cJson.secure_url || cJson.url,
            fileId: cJson.public_id,
            source: 'cloudinary'
          };
        }
      } catch (err) {
        console.error('[Cloudinary Direct] Upload error:', err);
      }

      return null;
    }
  }
};
