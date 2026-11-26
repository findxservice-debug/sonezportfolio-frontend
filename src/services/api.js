const API_BASE = (import.meta.env.VITE_API_URL || 'https://sonezportfolio-backend.onrender.com') + '/api';

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = localStorage.getItem('sonez_admin_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({ success: false, message: 'Invalid response from server' }));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Content & Settings
  getContent: () => request('/content'),
  updateContent: (settings) => request('/content', { method: 'PUT', body: JSON.stringify(settings) }),

  // Technologies
  getTechnologies: () => request('/technologies'),
  createTechnology: (tech) => request('/technologies', { method: 'POST', body: JSON.stringify(tech) }),
  updateTechnology: (id, tech) => request(`/technologies/${id}`, { method: 'PUT', body: JSON.stringify(tech) }),
  deleteTechnology: (id) => request(`/technologies/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: (category) => request(`/projects${category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''}`),
  createProject: (project) => request('/projects', { method: 'POST', body: JSON.stringify(project) }),
  updateProject: (id, project) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(project) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),

  // Creative Works (Things I Have Created)
  getCreativeWorks: () => request('/creative'),
  createCreativeWork: (work) => request('/creative', { method: 'POST', body: JSON.stringify(work) }),
  updateCreativeWork: (id, work) => request(`/creative/${id}`, { method: 'PUT', body: JSON.stringify(work) }),
  deleteCreativeWork: (id) => request(`/creative/${id}`, { method: 'DELETE' }),

  // Store Products & Inquiries
  getStoreProducts: (category, search, includeInactive = false) => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (includeInactive) params.append('includeInactive', 'true');
    const query = params.toString();
    return request(`/store/products${query ? `?${query}` : ''}`);
  },
  getStoreProduct: (id) => request(`/store/products/${id}`),
  createStoreProduct: (product) => request('/store/products', { method: 'POST', body: JSON.stringify(product) }),
  updateStoreProduct: (id, product) => request(`/store/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
  deleteStoreProduct: (id) => request(`/store/products/${id}`, { method: 'DELETE' }),
  submitStoreInquiry: (inquiryData) => request('/store/inquiry', { method: 'POST', body: JSON.stringify(inquiryData) }),

  // Client Reviews
  getReviews: () => request('/reviews'),
  getAllReviews: () => request('/reviews/all'),
  createReview: (review) => request('/reviews', { method: 'POST', body: JSON.stringify(review) }),
  updateReview: (id, review) => request(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(review) }),
  deleteReview: (id) => request(`/reviews/${id}`, { method: 'DELETE' }),

  // Contact Messages
  submitContact: (contactData) => request('/contact', { method: 'POST', body: JSON.stringify(contactData) }),
  getContactMessages: () => request('/contact'),
  markContactRead: (id) => request(`/contact/${id}/read`, { method: 'PUT' }),
  replyContactMessage: (id, replyText) => request(`/contact/${id}/reply`, { method: 'POST', body: JSON.stringify({ replyText }) }),
  deleteContactMessage: (id) => request(`/contact/${id}`, { method: 'DELETE' }),

  // Chatbot & Visitor Messaging
  initChatSession: (data) => request('/chat/session', { method: 'POST', body: JSON.stringify(data) }),
  sendChatMessage: (data) => request('/chat/message', { method: 'POST', body: JSON.stringify(data) }),
  getChatMessages: (sessionId) => request(`/chat/messages/${sessionId}`),
  getAdminChatConversations: () => request('/chat/admin/conversations'),
  getAdminChatThread: (sessionId) => request(`/chat/admin/conversation/${sessionId}`),
  sendAdminChatReply: (sessionId, message) => request('/chat/admin/reply', { method: 'POST', body: JSON.stringify({ sessionId, message }) }),

  // Analytics
  trackVisit: (visitorId, pagePath, sectionName) => request('/analytics/track', { method: 'POST', body: JSON.stringify({ visitorId, pagePath, sectionName }) }),
  getAnalyticsStats: () => request('/analytics/stats'),

  // Admin Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  verifySession: () => request('/auth/me'),
  changePassword: (currentPassword, newPassword) => request('/auth/change-password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) })
};
