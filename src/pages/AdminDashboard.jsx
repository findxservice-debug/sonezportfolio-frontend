import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { api } from '../services/api';
import TechIcon from '../components/TechIcon';
import { 
  BarChart3, 
  Settings, 
  FolderKanban, 
  Cpu, 
  Palette, 
  ShoppingBag, 
  Star, 
  MessageSquare, 
  LogOut, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Save, 
  Eye, 
  TrendingUp, 
  Users, 
  Clock, 
  Send,
  RefreshCw,
  Lock,
  Unlock
} from 'lucide-react';

const PRICED_CATEGORIES = ['Desktop Robots', 'Clothing'];

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const { setCurrentPage, content, refreshContent } = useSite();

  const [editingProductId, setEditingProductId] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, content, projects, tech, creative, store, reviews, messages
  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Content form state
  const [siteForm, setSiteForm] = useState({});
  const [savingContent, setSavingContent] = useState(false);
  const [contentStatus, setContentStatus] = useState('');

  // Data lists
  const [projects, setProjects] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [creativeWorks, setCreativeWorks] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [chatConversations, setChatConversations] = useState([]);
  const [selectedChatSession, setSelectedChatSession] = useState(null);
  const [chatThread, setChatThread] = useState([]);
  const [chatReplyInput, setChatReplyInput] = useState('');

  // Modals state
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddTech, setShowAddTech] = useState(false);
  const [showAddCreative, setShowAddCreative] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [replyingContactId, setReplyingContactId] = useState(null);
  const [contactReplyText, setContactReplyText] = useState('');

  // New item draft states
  const [newProject, setNewProject] = useState({ title: '', description: '', category: 'Personal', technologies: 'React, Node.js', image_url: '', demo_url: '', github_url: '', is_featured: 1 });
  const [newTech, setNewTech] = useState({ name: '', category: 'Frontend', proficiency: 90, icon_key: 'react', sort_order: 1 });
  const [newCreative, setNewCreative] = useState({ title: '', category: 'UI/UX Design', image_url: '', link_url: '', description: '' });
  const [newProduct, setNewProduct] = useState({ title: '', description: '', price: '', currency: 'USD', category: 'Website Templates', features: '', images: '', image_url: '', demo_url: '', is_active: 1 });
  const [newReview, setNewReview] = useState({ client_name: '', client_role: '', client_company: '', avatar_url: '', rating: 5, review_text: '', is_approved: 1 });

  // Initialize siteForm with content
  useEffect(() => {
    if (content) {
      setSiteForm({ ...content });
    }
  }, [content]);

  // Load analytics & relevant data
  const loadDashboardData = async () => {
    try {
      setLoadingMetrics(true);
      const [statsRes, projRes, techRes, creatRes, prodRes, revRes, contRes, chatRes] = await Promise.all([
        api.getAnalyticsStats().catch(() => null),
        api.getProjects().catch(() => null),
        api.getTechnologies().catch(() => null),
        api.getCreativeWorks().catch(() => null),
        api.getStoreProducts('All', '', true).catch(() => null),
        api.getAllReviews().catch(() => null),
        api.getContactMessages().catch(() => null),
        api.getAdminChatConversations().catch(() => null)
      ]);

      if (statsRes?.metrics) setMetrics(statsRes.metrics);
      if (projRes?.projects) setProjects(projRes.projects);
      if (techRes?.technologies) setTechnologies(techRes.technologies);
      if (creatRes?.works) setCreativeWorks(creatRes.works);
      if (prodRes?.products) setProducts(prodRes.products);
      if (revRes?.reviews) setReviews(revRes.reviews);
      if (contRes?.messages) setContactMessages(contRes.messages);
      if (chatRes?.conversations) setChatConversations(chatRes.conversations);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Poll chat when on messages tab
  useEffect(() => {
    if (activeTab !== 'messages') return;
    const interval = setInterval(async () => {
      const chatRes = await api.getAdminChatConversations().catch(() => null);
      if (chatRes?.conversations) setChatConversations(chatRes.conversations);
      if (selectedChatSession) {
        const threadRes = await api.getAdminChatThread(selectedChatSession).catch(() => null);
        if (threadRes?.messages) setChatThread(threadRes.messages);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeTab, selectedChatSession]);

  const handleSelectChat = async (sessionId) => {
    setSelectedChatSession(sessionId);
    try {
      const res = await api.getAdminChatThread(sessionId);
      if (res.success && res.messages) {
        setChatThread(res.messages);
      }
    } catch (err) {
      console.error('Failed to load thread:', err);
    }
  };

  const handleSendChatReply = async (e) => {
    e.preventDefault();
    if (!chatReplyInput.trim() || !selectedChatSession) return;
    const msg = chatReplyInput.trim();
    setChatReplyInput('');
    try {
      await api.sendAdminChatReply(selectedChatSession, msg);
      const res = await api.getAdminChatThread(selectedChatSession);
      if (res.success && res.messages) setChatThread(res.messages);
    } catch (err) {
      alert('Failed to send reply: ' + err.message);
    }
  };

  const handleSaveContent = async (e) => {
    e.preventDefault();
    setSavingContent(true);
    setContentStatus('');
    try {
      const res = await api.updateContent(siteForm);
      if (res.success) {
        setContentStatus('Website content updated successfully!');
        await refreshContent();
      }
    } catch (err) {
      setContentStatus('Error: ' + err.message);
    } finally {
      setSavingContent(false);
    }
  };

  // Add Item Handlers
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        features: newProduct.features.split(',').map(s => s.trim()).filter(Boolean),
        images: newProduct.images.split('\n').map(s => s.trim()).filter(Boolean),
        price: PRICED_CATEGORIES.includes(newProduct.category) ? Number(newProduct.price) || 0 : 0
      };
      if (editingProductId) {
        await api.updateStoreProduct(editingProductId, payload);
      } else {
        await api.createStoreProduct(payload);
      }
      setShowAddProduct(false);
      setEditingProductId(null);
      loadDashboardData();
    } catch (err) { alert(err.message); }
  };

  const openEditProduct = (p) => {
    setEditingProductId(p.id);
    setNewProduct({
      title: p.title, description: p.description,
      price: p.price || '', currency: p.currency || 'USD',
      category: p.category,
      features: (p.features || []).join(', '),
      images: (p.images || []).join('\n'),
      image_url: p.image_url, demo_url: p.demo_url || '',
      is_active: p.is_active
    });
    setShowAddProduct(true);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await api.createProject({
        ...newProject,
        technologies: newProject.technologies.split(',').map(s => s.trim()).filter(Boolean)
      });
      setShowAddProject(false);
      loadDashboardData();
    } catch (err) { alert(err.message); }
  };

  const handleAddTech = async (e) => {
    e.preventDefault();
    try {
      await api.createTechnology(newTech);
      setShowAddTech(false);
      loadDashboardData();
    } catch (err) { alert(err.message); }
  };

  const handleAddCreative = async (e) => {
    e.preventDefault();
    try {
      await api.createCreativeWork(newCreative);
      setShowAddCreative(false);
      loadDashboardData();
    } catch (err) { alert(err.message); }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await api.createReview(newReview);
      setShowAddReview(false);
      loadDashboardData();
    } catch (err) { alert(err.message); }
  };

  const handleToggleLock = async (p) => {
    try {
      await api.updateProject(p.id, { is_locked: p.is_locked ? 0 : 1 });
      loadDashboardData();
    } catch (err) { alert(err.message); }
  };

  // Delete Handlers
  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await api.deleteProject(id);
    loadDashboardData();
  };

  const handleDeleteTech = async (id) => {
    if (!confirm('Delete this technology?')) return;
    await api.deleteTechnology(id);
    loadDashboardData();
  };

  const handleDeleteCreative = async (id) => {
    if (!confirm('Delete this creative work item?')) return;
    await api.deleteCreativeWork(id);
    loadDashboardData();
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this store product?')) return;
    await api.deleteStoreProduct(id);
    loadDashboardData();
  };

  const handleDeleteReview = async (id) => {
    if (!confirm('Delete this review?')) return;
    await api.deleteReview(id);
    loadDashboardData();
  };

  const handleReplyContact = async (id) => {
    if (!contactReplyText.trim()) return;
    await api.replyContactMessage(id, contactReplyText);
    setReplyingContactId(null);
    setContactReplyText('');
    loadDashboardData();
  };

  const unreadMessagesCount = (metrics?.contact?.unread || 0) + (metrics?.chat?.unreadMessages || 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-black">
      {/* Top Admin Navbar */}
      <nav aria-label="Admin top navigation" className="bg-black text-white px-6 sm:px-10 py-4 flex items-center justify-between sticky top-0 z-40 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage('portfolio')}
            className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Live Site</span>
          </button>
          <span className="h-4 w-px bg-gray-800" />
          <div className="flex items-center gap-2">
            <span className="font-futuristic text-xl font-black text-white">SONEZ</span>
            <span className="text-[10px] px-2 py-0.5 bg-sonez-blue text-white rounded font-mono uppercase">
              ADMIN CMS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 hidden sm:inline-block">
            Signed in as <strong className="text-white">{admin?.username || 'Admin'}</strong>
          </span>
          <button
            onClick={() => {
              logout();
              setCurrentPage('portfolio');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-semibold rounded-lg text-gray-300 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <aside aria-label="Admin sidebar navigation" className="w-full md:w-64 bg-white border-r border-gray-200 p-4 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto">
          {[
            { id: 'analytics', label: 'Analytics Overview', icon: BarChart3, badge: null },
            { id: 'content', label: 'Website Content', icon: Settings, badge: null },
            { id: 'projects', label: 'Projects', icon: FolderKanban, badge: projects.length },
            { id: 'tech', label: 'Technologies', icon: Cpu, badge: technologies.length },
            { id: 'creative', label: 'Creative Works', icon: Palette, badge: creativeWorks.length },
            { id: 'store', label: 'Store Products', icon: ShoppingBag, badge: products.length },
            { id: 'reviews', label: 'Client Reviews', icon: Star, badge: reviews.length },
            { id: 'messages', label: 'Live Chat & Inquiries', icon: MessageSquare, badge: unreadMessagesCount > 0 ? unreadMessagesCount : null, badgeColor: 'bg-rose-500' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-black text-white shadow-sm font-bold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== null && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    tab.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700')
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-[calc(100vh-65px)]">
          {/* TAB 1: REAL ANALYTICS OVERVIEW */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold-display text-2xl font-bold text-black">
                    Live Analytics & Performance
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Authentic database telemetry tracking visitors, sections, and inquiries.
                  </p>
                </div>
                <button
                  onClick={loadDashboardData}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-semibold rounded-lg shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {/* 4 Stat Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Total Visitors
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-futuristic text-3xl font-black text-black">
                      {metrics?.totalVisitors || 0}
                    </span>
                    <span className="text-xs font-medium text-emerald-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5" /> Live
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-2 block">
                    Recorded across all sessions
                  </span>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Unique Visitors
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-futuristic text-3xl font-black text-sonez-blue">
                      {metrics?.uniqueVisitors || 0}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-2 block">
                    Unique device fingerprint hashes
                  </span>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Active Online Now
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-futuristic text-3xl font-black text-emerald-600">
                      {metrics?.activeVisitors || 1}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <span className="text-[11px] text-gray-400 mt-2 block">
                    Active within the last 30 minutes
                  </span>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Unread Inquiries & Chats
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-futuristic text-3xl font-black text-rose-600">
                      {unreadMessagesCount}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-2 block">
                    {metrics?.contact?.unread || 0} contact • {metrics?.chat?.unreadMessages || 0} chats
                  </span>
                </div>
              </div>

              {/* Most Visited Sections & Daily Trend */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Most Visited Sections */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold-display text-base font-bold text-black mb-4">
                    Most Visited Sections Breakdown
                  </h3>
                  <div className="space-y-3">
                    {metrics?.sectionBreakdown?.length > 0 ? (
                      metrics.sectionBreakdown.map((s, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                            <span>{s.section_name}</span>
                            <span className="font-mono text-black font-bold">{s.views} views</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-black rounded-full"
                              style={{ width: `${Math.min(100, (s.views / (metrics.totalVisitors || 1)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 py-4">No section view events logged yet.</p>
                    )}
                  </div>
                </div>

                {/* Daily Activity Summary */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold-display text-base font-bold text-black mb-4">
                    Daily Visitor Log (Last 7 Days)
                  </h3>
                  <div className="space-y-2">
                    {metrics?.dailyTrends?.length > 0 ? (
                      metrics.dailyTrends.map((d, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
                          <span className="font-mono text-gray-600">{d.date}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500">{d.total_views} views</span>
                            <span className="font-bold font-mono text-sonez-blue">{d.unique_visitors} unique</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 py-4">No visitor trends recorded yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEBSITE CONTENT EDITOR */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold-display text-2xl font-bold text-black">
                    Website Content & Personal Profile
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Edit your bio, titles, services, and contact info live on your portfolio.
                  </p>
                </div>
              </div>

              {contentStatus && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{contentStatus}</span>
                </div>
              )}

              <form onSubmit={handleSaveContent} className="space-y-6">
                {/* Hero Section Content */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <h3 className="font-bold-display text-base font-bold text-black">
                    Hero Section (Home)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Greeting</label>
                      <input
                        type="text"
                        value={siteForm.hero_greeting || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, hero_greeting: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Display Name</label>
                      <input
                        type="text"
                        value={siteForm.hero_name || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, hero_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Subtitle / Disciplines</label>
                    <input
                      type="text"
                      value={siteForm.hero_subtitle || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, hero_subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* About Me Content */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <h3 className="font-bold-display text-base font-bold text-black">
                    About Me & Bio
                  </h3>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Who is SONEZ? Introduction</label>
                    <textarea
                      rows={3}
                      value={siteForm.about_who_text || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, about_who_text: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">My Journey</label>
                      <textarea
                        rows={2}
                        value={siteForm.about_journey_text || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, about_journey_text: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Learning Approach</label>
                      <textarea
                        rows={2}
                        value={siteForm.about_approach_text || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, about_approach_text: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact & WhatsApp */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <h3 className="font-bold-display text-base font-bold text-black">
                    Contact & Channels
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={siteForm.contact_email || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, contact_email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={siteForm.contact_phone || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, contact_phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">WhatsApp Number (Digits only)</label>
                      <input
                        type="text"
                        value={siteForm.whatsapp_number || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, whatsapp_number: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingContent}
                    className="flex items-center gap-2 px-8 py-3 bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingContent ? 'Saving Changes...' : 'Save Website Content'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold-display text-2xl font-bold text-black">Manage Projects</h2>
                  <p className="text-xs text-gray-500 mt-1">Add, update, or remove portfolio showcase projects.</p>
                </div>
                <button
                  onClick={() => setShowAddProject(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-full shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Projects Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-mono">
                      <tr>
                        <th className="p-4">Project</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Technologies</th>
                        <th className="p-4">Featured</th>
                        <th className="p-4">Lock</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {projects.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50">
                          <td className="p-4 flex items-center gap-3">
                            <img src={p.image_url} alt="" className="w-12 h-8 rounded-lg object-cover bg-gray-100 shrink-0" />
                            <div>
                              <span className="font-bold text-black block">{p.title}</span>
                              <span className="text-gray-500 line-clamp-1 max-w-xs">{p.description}</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono">{p.category}</td>
                          <td className="p-4">
                            <span className="line-clamp-1 max-w-[200px]">
                              {Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies}
                            </span>
                          </td>
                          <td className="p-4">
                            {p.is_featured ? <span className="text-emerald-600 font-bold">Yes</span> : 'No'}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleLock(p)}
                              title={p.is_locked ? 'Click to unlock' : 'Click to lock'}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                                p.is_locked
                                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                            >
                              {p.is_locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                              {p.is_locked ? 'Locked' : 'Open'}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TECHNOLOGIES */}
          {activeTab === 'tech' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold-display text-2xl font-bold text-black">Manage Technologies</h2>
                  <p className="text-xs text-gray-500 mt-1">Adjust proficiency levels, categories, and genuine logos.</p>
                </div>
                <button
                  onClick={() => setShowAddTech(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-full shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Tech</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {technologies.map((t) => (
                  <div key={t.id} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TechIcon iconKey={t.icon_key} className="w-8 h-8" />
                      <div>
                        <span className="font-bold text-black block text-sm">{t.name}</span>
                        <span className="text-[10px] font-mono text-gray-400 uppercase">{t.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sonez-blue text-xs">{t.proficiency}%</span>
                      <button
                        onClick={() => handleDeleteTech(t.id)}
                        className="p-1 text-gray-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CREATIVE WORKS */}
          {activeTab === 'creative' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold-display text-2xl font-bold text-black">Things My Team Created (Gallery)</h2>
                  <p className="text-xs text-gray-500 mt-1">Manage UI/UX concepts, graphic branding, and motion reels.</p>
                </div>
                <button
                  onClick={() => setShowAddCreative(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-full shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Creative Work</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {creativeWorks.map((w) => (
                  <div key={w.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="aspect-video w-full bg-gray-100 overflow-hidden">
                      <img src={w.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-mono font-bold uppercase text-sonez-blue block">{w.category}</span>
                      <h4 className="font-bold text-sm text-black mt-1">{w.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{w.description}</p>
                    </div>
                    <div className="p-4 pt-0 flex justify-end">
                      <button
                        onClick={() => handleDeleteCreative(w.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: STORE PRODUCTS */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold-display text-2xl font-bold text-black">SONEZ Store Management</h2>
                  <p className="text-xs text-gray-500 mt-1">Manage digital templates, source code, UI kits, and services.</p>
                </div>
                <button
                  onClick={() => { setEditingProductId(null); setNewProduct({ title: '', description: '', price: '', currency: 'USD', category: 'Website Templates', features: '', images: '', image_url: '', demo_url: '', is_active: 1 }); setShowAddProduct(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-full shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="aspect-video w-full bg-gray-100 relative">
                        <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase">{p.category}</span>
                        <h4 className="font-bold text-base text-black mt-1">{p.title}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{p.description}</p>
                      </div>
                    </div>
                    <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                      <span className={`text-[11px] font-bold ${p.is_active ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {p.is_active ? 'In Stock' : 'Inactive'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEditProduct(p)} className="px-2.5 py-1 text-[11px] font-bold text-sonez-blue hover:bg-blue-50 rounded-lg">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-gray-400 hover:text-rose-600 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold-display text-2xl font-bold text-black">Client Testimonials</h2>
                  <p className="text-xs text-gray-500 mt-1">Manage marquee carousel reviews and approvals.</p>
                </div>
                <button
                  onClick={() => setShowAddReview(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-full shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Review</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((r) => (
                  <div key={r.id} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img src={r.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-xs text-black block">{r.client_name}</span>
                            <span className="text-[10px] text-gray-500">{r.client_role} • {r.client_company}</span>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-amber-500">★ {r.rating}.0</span>
                      </div>
                      <p className="text-xs text-gray-700 italic">"{r.review_text}"</p>
                    </div>
                    <div className="pt-3 border-t border-gray-100 mt-3 flex justify-end">
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="p-1 text-gray-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: MESSAGES & LIVE CHAT DESK */}
          {activeTab === 'messages' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-bold-display text-2xl font-bold text-black">
                  Communications & Live Chat Desk
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Respond to contact form submissions and live visitor chats (SONEZ Reply) in real time.
                </p>
              </div>

              {/* Sub-section 1: SONEZ Live Chat Threads */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h3 className="font-bold-display text-base font-bold text-black">
                      SONEZ Direct Live Chat Console
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    {chatConversations.length} Active Sessions
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[450px]">
                  {/* Left: Sessions list */}
                  <div className="lg:col-span-5 border border-gray-200 rounded-xl overflow-y-auto divide-y divide-gray-100">
                    {chatConversations.length === 0 ? (
                      <p className="p-6 text-xs text-gray-400 text-center">No visitor chat sessions yet.</p>
                    ) : (
                      chatConversations.map((c) => {
                        const isSelected = selectedChatSession === c.session_id;
                        return (
                          <div
                            key={c.session_id}
                            onClick={() => handleSelectChat(c.session_id)}
                            className={`p-3.5 cursor-pointer transition-colors ${
                              isSelected ? 'bg-sonez-blue/10 border-l-4 border-sonez-blue' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-black truncate">
                                {c.visitor_name || 'Visitor'}
                              </span>
                              {c.unread_count > 0 && (
                                <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                                  {c.unread_count} new
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 truncate mt-1">
                              {c.last_message || 'Session started'}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Right: Conversation Thread & Reply Bar */}
                  <div className="lg:col-span-7 border border-gray-200 rounded-xl flex flex-col justify-between overflow-hidden bg-gray-50/50">
                    {selectedChatSession ? (
                      <>
                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3">
                          {chatThread.map((m) => {
                            const isVisitor = m.sender === 'visitor';
                            const isSonez = m.sender === 'sonez';
                            return (
                              <div
                                key={m.id}
                                className={`flex flex-col ${isVisitor ? 'items-start' : 'items-end'}`}
                              >
                                <span className="text-[10px] text-gray-400 mb-0.5 px-1">
                                  {isVisitor ? 'Visitor' : 'You (Sadeepa)'}
                                </span>
                                <div
                                  className={`p-3 rounded-2xl text-xs max-w-[80%] ${
                                    isVisitor
                                      ? 'bg-white text-black border border-gray-200'
                                      : 'bg-black text-white'
                                  }`}
                                >
                                  {m.message}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Reply Form */}
                        <form onSubmit={handleSendChatReply} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                          <input
                            type="text"
                            placeholder="Type real-time reply to visitor..."
                            value={chatReplyInput}
                            onChange={(e) => setChatReplyInput(e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-black"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Reply</span>
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-gray-400 p-6 text-center">
                        Select a visitor conversation on the left to view messages and reply.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sub-section 2: Contact Form Submissions */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
                <h3 className="font-bold-display text-base font-bold text-black border-b border-gray-100 pb-3">
                  Contact Form & Store Orders Submissions ({contactMessages.length})
                </h3>

                <div className="space-y-4">
                  {contactMessages.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4">No contact messages received yet.</p>
                  ) : (
                    contactMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          msg.is_read ? 'bg-gray-50/60 border-gray-200' : 'bg-blue-50/40 border-blue-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-black">{msg.name}</span>
                            <span className="text-xs text-gray-500">&lt;{msg.email}&gt;</span>
                            {msg.replied === 1 && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                                Replied
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400 font-mono">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="font-bold text-xs text-gray-900 mt-2">
                          Subject: {msg.subject}
                        </div>

                        <p className="text-xs text-gray-700 mt-1 whitespace-pre-line leading-relaxed bg-white p-3 rounded-xl border border-gray-100">
                          {msg.message}
                        </p>

                        {/* Reply section */}
                        {replyingContactId === msg.id ? (
                          <div className="mt-3 space-y-2">
                            <textarea
                              rows={2}
                              placeholder="Write reply notes or email response..."
                              value={contactReplyText}
                              onChange={(e) => setContactReplyText(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs outline-none"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => setReplyingContactId(null)}
                                className="px-3 py-1 text-xs text-gray-500 hover:text-black"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleReplyContact(msg.id)}
                                className="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-lg"
                              >
                                Save Reply
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 flex items-center justify-between text-xs">
                            {msg.reply_text ? (
                              <span className="text-[11px] text-emerald-700 italic">
                                Your Reply: "{msg.reply_text}"
                              </span>
                            ) : <span />}

                            <button
                              onClick={() => {
                                setReplyingContactId(msg.id);
                                setContactReplyText(msg.reply_text || '');
                              }}
                              className="font-bold text-sonez-blue hover:underline"
                            >
                              {msg.replied ? 'Edit Reply' : 'Record Reply'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold-display text-lg font-bold text-black">Add New Project</h3>
              <button onClick={() => setShowAddProject(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddProject} className="space-y-3 text-xs">
              <input type="text" placeholder="Title" required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <textarea placeholder="Description" required rows={2} value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <div className="grid grid-cols-2 gap-2">
                <select value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="p-2.5 bg-gray-50 border rounded-xl">
                  <option value="Personal">Personal</option>
                  <option value="Freelance">Freelance</option>
                  <option value="School">School</option>
                </select>
                <input type="text" placeholder="Techs (comma separated)" value={newProject.technologies} onChange={e => setNewProject({...newProject, technologies: e.target.value})} className="p-2.5 bg-gray-50 border rounded-xl" />
              </div>
              <input type="url" placeholder="Image URL (Unsplash or direct)" required value={newProject.image_url} onChange={e => setNewProject({...newProject, image_url: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <input type="url" placeholder="Live Demo URL" value={newProject.demo_url} onChange={e => setNewProject({...newProject, demo_url: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <input type="url" placeholder="GitHub URL" value={newProject.github_url} onChange={e => setNewProject({...newProject, github_url: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <button type="submit" className="w-full py-2.5 bg-black text-white font-bold rounded-xl mt-2">Save Project</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Tech Modal */}
      {showAddTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold-display text-lg font-bold text-black">Add Technology</h3>
              <button onClick={() => setShowAddTech(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddTech} className="space-y-3 text-xs">
              <input type="text" placeholder="Tech Name (e.g. Next.js)" required value={newTech.name} onChange={e => setNewTech({...newTech, name: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <select value={newTech.category} onChange={e => setNewTech({...newTech, category: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl">
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Tools">Tools</option>
              </select>
              <div>
                <label className="block mb-1 font-bold">Proficiency: {newTech.proficiency}%</label>
                <input type="range" min="10" max="100" value={newTech.proficiency} onChange={e => setNewTech({...newTech, proficiency: Number(e.target.value)})} className="w-full" />
              </div>
              <input type="text" placeholder="Icon Key (e.g. react, nodejs, python)" required value={newTech.icon_key} onChange={e => setNewTech({...newTech, icon_key: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <button type="submit" className="w-full py-2.5 bg-black text-white font-bold rounded-xl mt-2">Save Technology</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Creative Modal */}
      {showAddCreative && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold-display text-lg font-bold text-black">Add Creative Work</h3>
              <button onClick={() => setShowAddCreative(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddCreative} className="space-y-3 text-xs">
              <input type="text" placeholder="Title" required value={newCreative.title} onChange={e => setNewCreative({...newCreative, title: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <select value={newCreative.category} onChange={e => setNewCreative({...newCreative, category: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl">
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Video Editing">Video Editing</option>
                <option value="Web Design">Web Design</option>
              </select>
              <input type="url" placeholder="Image URL" required value={newCreative.image_url} onChange={e => setNewCreative({...newCreative, image_url: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <input type="url" placeholder="External Link (Behance / Figma)" value={newCreative.link_url} onChange={e => setNewCreative({...newCreative, link_url: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <button type="submit" className="w-full py-2.5 bg-black text-white font-bold rounded-xl mt-2">Save Creative Asset</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold-display text-lg font-bold text-black">Add Store Product</h3>
              <button onClick={() => { setShowAddProduct(false); setEditingProductId(null); }}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
              <input type="text" placeholder="Product Title" required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <textarea placeholder="Description" required rows={2} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />

              <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl">
                <option value="Website Templates">Website Templates</option>
                <option value="UI Kits">UI Kits</option>
                <option value="Source Code">Source Code</option>
                <option value="Desktop Robots">Desktop Robots</option>
                <option value="Clothing">Clothing</option>
                <option value="Development Services">Development Services</option>
              </select>

              {PRICED_CATEGORIES.includes(newProduct.category) && (
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" min="0" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="col-span-2 p-2.5 bg-gray-50 border rounded-xl" />
                  <select value={newProduct.currency} onChange={e => setNewProduct({...newProduct, currency: e.target.value})} className="p-2.5 bg-gray-50 border rounded-xl">
                    <option value="USD">USD</option>
                    <option value="LKR">LKR</option>
                  </select>
                </div>
              )}

              <input type="text" placeholder="Features (comma separated)" value={newProduct.features} onChange={e => setNewProduct({...newProduct, features: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <input type="url" placeholder="Main Image URL" required value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <textarea placeholder={"More image URLs (one per line)"} rows={3} value={newProduct.images} onChange={e => setNewProduct({...newProduct, images: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <button type="submit" className="w-full py-2.5 bg-black text-white font-bold rounded-xl mt-2">
                {editingProductId ? 'Save Changes' : 'Publish Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showAddReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold-display text-lg font-bold text-black">Add Testimonial</h3>
              <button onClick={() => setShowAddReview(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddReview} className="space-y-3 text-xs">
              <input type="text" placeholder="Client Name" required value={newReview.client_name} onChange={e => setNewReview({...newReview, client_name: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <input type="text" placeholder="Client Role (e.g. Founder)" value={newReview.client_role} onChange={e => setNewReview({...newReview, client_role: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <input type="text" placeholder="Company Name" value={newReview.client_company} onChange={e => setNewReview({...newReview, client_company: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <textarea placeholder="Review quote..." required rows={3} value={newReview.review_text} onChange={e => setNewReview({...newReview, review_text: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-xl" />
              <button type="submit" className="w-full py-2.5 bg-black text-white font-bold rounded-xl mt-2">Save Testimonial</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
