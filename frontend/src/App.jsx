import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  X, 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Camera, 
  ChevronRight, 
  Play, 
  UserCheck, 
  Globe, 
  Info, 
  Moon, 
  Sun, 
  Bookmark, 
  Calendar as CalendarIcon, 
  Settings, 
  Edit3, 
  CheckCircle2, 
  Lock, 
  Mail, 
  User, 
  LogOut, 
  ArrowRight, 
  Shield,
  Search,
  Ticket,
  Share2,
  Check,
  Flame,
  Sparkles
} from 'lucide-react';
import AdminPortal from './admin';
import axiosInstance from './api/axiosInstance';

const getApiError = (error, fallback) => error.response?.data?.error || fallback;

const INITIAL_POSTS = [
  {
    id: 'post-1',
    committee: 'Circuit Society',
    tagline: 'Technical',
    avatar: 'CS',
    time: '2 hours ago',
    badge: 'Recruiting',
    badgeColor: 'bg-[#FDE8E1] text-[#C87D55] dark:bg-[#3D251E] dark:text-[#FFB74D]',
    caption: 'Build night #41. Four teams, one working quadcopter, zero fire alarms. Recruitment desk opens Monday outside the central canteen!',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000',
    likes: 142,
    isLiked: false,
    comments: [
      { id: 101, user: 'Dev R.', text: 'Is the workshop open for 1st years?', time: '1h ago' },
      { id: 102, user: 'Circuit Society', text: 'Yes! All years welcome.', time: '45m ago' }
    ]
  },
  {
    id: 'post-2',
    committee: 'Aperture',
    tagline: 'Media',
    avatar: 'AP',
    time: '5 hours ago',
    badge: 'Featured Video',
    badgeColor: 'bg-[#E1F3E6] text-[#2D6A4F] dark:bg-[#1C3A27] dark:text-[#81C784]',
    caption: 'Golden hour at the main quad. Teaser reel for our upcoming monsoon photowalk.',
    mediaType: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-campus-41539-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
    likes: 89,
    isLiked: false,
    comments: [
      { id: 201, user: 'Ananya S.', text: 'The grading on this is crazy good!', time: '3h ago' }
    ]
  }
];

const INITIAL_COMMITTEES = [
  { 
    id: 'cs', 
    rank: 1, 
    name: 'Circuit Society', 
    category: 'Technical', 
    desc: 'Robotics, drones and embedded hardware systems.', 
    fullDetails: 'Circuit Society is the official hardware and robotics wing on campus. We host weekly build sessions, competitive hackathons, and drone-racing championships.',
    rating: 4.8, 
    reviewsCount: 24, 
    members: 148, 
    isRecruiting: true, 
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    website: 'https://example.com/circuitsociety',
    lead: 'Vikramaditya S. (President)',
    departments: ['Robotics', 'Embedded Systems', 'Drones & UAV', 'Sponsorship & Outreach']
  },
  { 
    id: 'mq', 
    rank: 2, 
    name: 'Masquerade', 
    category: 'Cultural', 
    desc: 'The campus theatre collective for stage and street play.', 
    fullDetails: 'Masquerade brings dramatics and theatrical arts to life.',
    rating: 4.6, 
    reviewsCount: 18, 
    members: 92, 
    isRecruiting: true, 
    image: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&q=80&w=600',
    website: 'https://example.com/masquerade',
    lead: 'Rhea Kapoor (Creative Director)',
    departments: ['Nukkad Natak', 'Stage Play', 'Scriptwriting', 'Set & Props Design']
  },
  { 
    id: 'ap', 
    rank: 3, 
    name: 'Aperture', 
    category: 'Media', 
    desc: 'Visual storytelling, photography, cinematics & films.', 
    fullDetails: 'Aperture documents the heartbeat of campus life.',
    rating: 4.4, 
    reviewsCount: 12, 
    members: 64, 
    isRecruiting: false, 
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
    website: 'https://example.com/aperture',
    lead: 'Karan Joshi (Head of Media)',
    departments: ['Still Photography', 'Cinematography', 'Post-Production', 'Event Coverage']
  }
];

const INITIAL_EVENTS = [
  { id: 'evt-1', day: 3, dateStr: '3 NOV', title: 'Build Night: Line Followers', committee: 'Circuit Society', time: '18:00', venue: 'Hardware Lab C', going: 64, tag: 'Workshop', tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  { id: 'evt-2', day: 6, dateStr: '6 NOV', title: 'Open Mic — Acoustic Monologues', committee: 'Masquerade', time: '19:30', venue: 'Central Amphitheatre', going: 210, tag: 'Cultural', tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  { id: 'evt-3', day: 9, dateStr: '9 NOV', title: 'Film Walk: Historic Quarter', committee: 'Aperture', time: '06:30', venue: 'North Gate', going: 41, tag: 'Social', tagColor: 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300' },
  { id: 'evt-4', day: 12, dateStr: '12 NOV', title: 'Hack the Campus — 36h Sprint', committee: 'Circuit Society', time: '09:00', venue: 'Innovation Hall', going: 480, tag: 'Tech', tagColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' }
];

const INITIAL_LOST_FOUND = [
  { id: 'lf-1', type: 'Found', title: 'Black Sony Wireless Earphones', desc: 'Left on row 4 seat after the keynote session.', location: 'Innovation Hall, Row 4', time: 'Today', event: 'Hackathon', contact: 'Security Desk' },
  { id: 'lf-2', type: 'Lost', title: 'Steel Water Bottle with Compass Keyring', desc: 'Dented near base with brass compass keychain.', location: 'Amphitheatre Steps', time: 'Yesterday', event: 'Open Mic', contact: 'Reeva K. (CS 2nd Year)' }
];

export default function App() {
  const [viewMode, setViewMode] = useState('auth'); // 'user' | 'admin' | 'auth'
  const [authRole, setAuthRole] = useState('student'); // 'student' | 'admin'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState({ name: 'Aaditya Joshi', email: 'student@peerly.edu', loggedIn: false, role: 'STUDENT' });

  // Auth Form State
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

  // Navigation
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'committees' | 'calendar' | 'lostfound' | 'rankings' | 'profile'
  const [profileSubTab, setProfileSubTab] = useState('saved');

  // App Data
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [committees, setCommittees] = useState(INITIAL_COMMITTEES);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [lostFoundList, setLostFoundList] = useState(INITIAL_LOST_FOUND);

  // User Local Storage Interactions
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('peerly_bookmarks') || '[]'); } catch { return []; }
  });
  const [rsvpdEventIds, setRsvpdEventIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('peerly_rsvps') || '[]'); } catch { return ['evt-1']; }
  });
  const [joinedSocieties, setJoinedSocieties] = useState(() => {
    try { return JSON.parse(localStorage.getItem('peerly_societies') || '["Circuit Society"]'); } catch { return ['Circuit Society']; }
  });

  // Dynamic UI States
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);
  const [calendarCategoryFilter, setCalendarCategoryFilter] = useState('All');
  const [selectedCommitteeDetails, setSelectedCommitteeDetails] = useState(null);
  const [activeModalMedia, setActiveModalMedia] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Profile State
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(() => localStorage.getItem('peerly_bio') || 'Tech enthusiast, drone tinkerer, and 3rd-year CS undergrad at Peerly.');

  // Filters & Submissions
  const [committeeFilter, setCommitteeFilter] = useState('All');
  const [lostFoundFilter, setLostFoundFilter] = useState('Everything');
  const [lostSearchTerm, setLostSearchTerm] = useState('');
  const [lostForm, setLostForm] = useState({ type: 'Lost', title: '', desc: '', location: '', contact: '' });
  
  const [anonymousReviews, setAnonymousReviews] = useState([
    { id: 'rev-1', committee: 'Circuit Society', comment: 'Incredible hands-on learning. Built my first drone here with senior guidance.', score: 5, time: '2 days ago' },
    { id: 'rev-2', committee: 'Masquerade', comment: 'Great stage environment! Rehearsals get intense before fest season, but super rewarding.', score: 4.5, time: '3 days ago' }
  ]);
  const [reviewInput, setReviewInput] = useState({ committee: 'cs', score: '5', comment: '' });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    // Check & restore authenticated session on page refresh
    const checkAuthSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axiosInstance.get('/auth/me');
          if (res.data.success && res.data.user) {
            const acc = res.data.user;
            setUser({
              name: acc.name || 'Campus Student',
              email: acc.email,
              loggedIn: true,
              role: acc.role || 'STUDENT'
            });
            setViewMode(acc.role === 'ADMIN' ? 'admin' : 'user');
          }
        } catch {
          localStorage.removeItem('token');
        }
      }
    };

    const loadCommittees = async () => {
      try {
        const response = await axiosInstance.get('/committees');
        const loadedCommittees = response.data.data || [];
        if (loadedCommittees.length) {
          setCommittees(loadedCommittees.map((committee, index) => ({
            ...committee,
            id: committee._id || committee.id,
            rank: index + 1,
            desc: committee.description || 'Campus committee.',
            fullDetails: committee.description || 'Campus committee.',
            rating: committee.rating || 4.5,
            reviewsCount: committee.reviews_count || 0,
            members: committee.members || 50,
            isRecruiting: committee.is_recruiting,
            image: committee.logo_url || INITIAL_COMMITTEES[0].image,
            website: committee.website || '#',
            lead: committee.lead || 'Committee Executive',
            departments: committee.departments || ['General']
          })));
          setReviewInput((current) => ({ ...current, committee: loadedCommittees[0]._id || loadedCommittees[0].id }));
        }
      } catch (error) {
        console.warn('Unable to load committees from API, using fallback data:', error.message);
      }
    };

    const loadEvents = async () => {
      try {
        const response = await axiosInstance.get('/events');
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
          setEvents(response.data.data);
        }
      } catch (error) {
        console.warn('Unable to load events from API, using fallback data:', error.message);
      }
    };

    const loadLostFound = async () => {
      try {
        const response = await axiosInstance.get('/lost-found?page=1&limit=20');
        const items = response.data.data || [];
        if (items.length) {
          setLostFoundList(items.map((item) => ({
            id: item._id || item.id,
            type: item.type === 'LOST' || item.type === 'Lost' ? 'Lost' : 'Found',
            title: item.title,
            desc: item.desc || item.description || 'No description provided.',
            location: item.location || 'Campus venue',
            time: item.time || 'Recently',
            event: 'General Campus',
            contact: item.contact || 'Campus user'
          })));
        }
      } catch (error) {
        console.warn('Unable to load lost and found notices from API, using fallback data:', error.message);
      }
    };

    const loadFeed = async () => {
      try {
        const response = await axiosInstance.get('/feed/posts?page=1&limit=10');
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
          setPosts(response.data.data);
        }
      } catch (error) {
        console.warn('Campus feed from API unavailable, using fallback data:', error.message);
      }
    };

    checkAuthSession();
    loadCommittees();
    loadEvents();
    loadLostFound();
    loadFeed();
  }, []);

  useEffect(() => {
    const loadSelectedCommitteeReviews = async () => {
      if (!reviewInput.committee) return;
      try {
        const response = await axiosInstance.get(`/reviews/committee/${reviewInput.committee}`);
        const committee = committees.find((item) => item.id === reviewInput.committee || item._id === reviewInput.committee);
        if (response.data.data?.length) {
          setAnonymousReviews(response.data.data.map((review) => ({
            id: review.id || review._id,
            committee: committee?.name || 'Committee',
            comment: review.comment,
            score: review.ratings?.score || 5,
            time: review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recently'
          })));
        }
      } catch (error) {
        console.warn('Saved reviews unavailable:', error.message);
      }
    };

    loadSelectedCommitteeReviews();
  }, [reviewInput.committee, committees]);

  // Post Actions (Likes, Bookmarks, Comments, Sharing)
  const toggleLike = async (postId) => {
    try {
      const response = await axiosInstance.post(`/feed/posts/${postId}/like`);
      if (response.data.success) {
        setPosts(prev => prev.map(p => (p.id === postId || p._id === postId) 
          ? { ...p, isLiked: response.data.isLiked, likes: response.data.likes } 
          : p
        ));
        showToast(response.data.isLiked ? '❤️ Liked post!' : 'Unliked post');
        return;
      }
    } catch {
      // Local fallback
    }
    setPosts(prev => prev.map(p => {
      if (p.id === postId || p._id === postId) {
        const willLike = !p.isLiked;
        showToast(willLike ? '❤️ Liked post!' : 'Unliked post');
        return { ...p, isLiked: willLike, likes: willLike ? p.likes + 1 : p.likes - 1 };
      }
      return p;
    }));
  };

  const toggleBookmark = (postId) => {
    const pid = String(postId);
    setBookmarkedPostIds(prev => {
      const isBookmarked = prev.includes(pid);
      const updated = isBookmarked ? prev.filter(id => id !== pid) : [...prev, pid];
      localStorage.setItem('peerly_bookmarks', JSON.stringify(updated));
      showToast(isBookmarked ? '🔖 Removed from bookmarks' : '🔖 Saved to your bookmarks!');
      return updated;
    });
  };

  const toggleRsvp = (eventId) => {
    const eid = String(eventId);
    const isRsvpd = rsvpdEventIds.includes(eid);
    const updated = isRsvpd ? rsvpdEventIds.filter(id => id !== eid) : [...rsvpdEventIds, eid];
    setRsvpdEventIds(updated);
    localStorage.setItem('peerly_rsvps', JSON.stringify(updated));
    setEvents(prev => prev.map(e => (String(e.id) === eid || String(e._id) === eid) 
      ? { ...e, going: (e.going || 0) + (isRsvpd ? -1 : 1) }
      : e
    ));
    showToast(isRsvpd ? 'RSVP Cancelled' : '🎟️ Spot reserved! Saved to My RSVPs');
  };

  const toggleJoinSociety = (societyName) => {
    setJoinedSocieties(prev => {
      const hasJoined = prev.includes(societyName);
      const updated = hasJoined ? prev.filter(s => s !== societyName) : [...prev, societyName];
      localStorage.setItem('peerly_societies', JSON.stringify(updated));
      showToast(hasJoined ? `Left ${societyName}` : `🎉 Joined ${societyName}! Added to Profile`);
      return updated;
    });
  };

  const handleShare = (title) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(`🔗 Link for "${title}" copied to clipboard!`);
    } else {
      showToast(`🔗 Link copied to clipboard!`);
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    try {
      const response = await axiosInstance.post(`/feed/posts/${postId}/comments`, { comment: text });
      setPosts((current) => current.map((post) => (post.id === postId || post._id === postId)
        ? { ...post, comments: [...post.comments, response.data.data] }
        : post));
      setCommentInputs((current) => ({ ...current, [postId]: '' }));
      showToast('💬 Comment posted!');
    } catch {
      // Local fallback
      const newComment = { id: Date.now(), user: user.name || 'Campus Student', text, time: 'Just now' };
      setPosts((current) => current.map((post) => (post.id === postId || post._id === postId)
        ? { ...post, comments: [...post.comments, newComment] }
        : post));
      setCommentInputs((current) => ({ ...current, [postId]: '' }));
      showToast('💬 Comment posted!');
    }
  };

  const handleAddLostFound = async (e) => {
    e.preventDefault();
    if (!lostForm.title || !lostForm.location) return;
    try {
      const response = await axiosInstance.post('/lost-found', {
        title: lostForm.title,
        description: lostForm.desc,
        category: 'General',
        location: lostForm.location,
        type: lostForm.type.toUpperCase(),
        date_lost: new Date().toISOString(),
        contact: lostForm.contact || user.name
      });
      const item = response.data.data;
      setLostFoundList((current) => [{
        id: item._id || item.id,
        type: lostForm.type,
        title: item.title,
        desc: item.description || 'No description provided.',
        location: item.location || lostForm.location,
        time: 'Just now',
        event: 'General Campus',
        contact: item.contact || user.name
      }, ...current]);
      setLostForm({ type: 'Lost', title: '', desc: '', location: '', contact: '' });
      showToast('📢 Notice posted to campus board!');
    } catch {
      setLostFoundList((current) => [{
        id: Date.now(),
        type: lostForm.type,
        title: lostForm.title,
        desc: lostForm.desc || 'No description provided.',
        location: lostForm.location,
        time: 'Just now',
        event: 'General Campus',
        contact: lostForm.contact || user.name
      }, ...current]);
      setLostForm({ type: 'Lost', title: '', desc: '', location: '', contact: '' });
      showToast('📢 Notice posted to campus board!');
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewInput.comment) return;
    try {
      const selectedCommittee = committees.find((committee) => committee.id === reviewInput.committee || committee._id === reviewInput.committee);
      const response = await axiosInstance.post('/reviews', {
        committee_id: reviewInput.committee,
        ratings: { score: Number(reviewInput.score) },
        review_text: reviewInput.comment
      });
      setAnonymousReviews((current) => [{
        id: response.data.data?._id || response.data.data?.id || Date.now(),
        committee: selectedCommittee?.name || 'Campus Society',
        comment: reviewInput.comment,
        score: Number(reviewInput.score),
        time: 'Just now'
      }, ...current]);
      setReviewInput({ committee: committees[0]?._id || committees[0]?.id || 'cs', score: '5', comment: '' });
      showToast('⭐ Anonymous review posted successfully!');
    } catch {
      const selectedCommittee = committees.find((committee) => committee.id === reviewInput.committee || committee._id === reviewInput.committee);
      setAnonymousReviews((current) => [{
        id: Date.now(),
        committee: selectedCommittee?.name || 'Campus Society',
        comment: reviewInput.comment,
        score: Number(reviewInput.score),
        time: 'Just now'
      }, ...current]);
      setReviewInput({ committee: committees[0]?._id || committees[0]?.id || 'cs', score: '5', comment: '' });
      showToast('⭐ Anonymous review posted successfully!');
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login';
      const response = await axiosInstance.post(endpoint, {
        ...authForm,
        role: authRole === 'admin' ? 'ADMIN' : 'STUDENT'
      });
      const account = response.data.user;
      localStorage.setItem('token', response.data.token);
      setUser({
        name: account.name || authForm.email.split('@')[0],
        email: account.email || authForm.email,
        loggedIn: true,
        role: account.role || (authRole === 'admin' ? 'ADMIN' : 'STUDENT')
      });
      setViewMode(authRole === 'admin' ? 'admin' : 'user');
      showToast(`Welcome back, ${account.name || 'Student'}!`);
    } catch (error) {
      window.alert(getApiError(error, 'Authentication failed. Check your details and try again.'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({ name: '', email: '', loggedIn: false, role: 'STUDENT' });
    setViewMode('auth');
    showToast('Signed out successfully.');
  };

  const handleSaveBio = () => {
    localStorage.setItem('peerly_bio', bioText);
    setIsEditingBio(false);
    showToast('Bio updated!');
  };

  // Filtered Lost & Found items
  const filteredLostFound = useMemo(() => {
    return lostFoundList.filter(item => {
      const matchesType = lostFoundFilter === 'Everything' || item.type === lostFoundFilter;
      const matchesSearch = !lostSearchTerm.trim() || 
        item.title.toLowerCase().includes(lostSearchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(lostSearchTerm.toLowerCase()) ||
        item.desc.toLowerCase().includes(lostSearchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [lostFoundList, lostFoundFilter, lostSearchTerm]);

  // Filtered Calendar Events
  const filteredCalendarEvents = useMemo(() => {
    return events.filter(evt => {
      const matchesDay = !selectedCalendarDay || evt.day === selectedCalendarDay;
      const matchesCategory = calendarCategoryFilter === 'All' || evt.tag === calendarCategoryFilter;
      return matchesDay && matchesCategory;
    });
  }, [events, selectedCalendarDay, calendarCategoryFilter]);

  // Bookmarked and RSVP'd items for Profile
  const bookmarkedPosts = useMemo(() => {
    return posts.filter(p => bookmarkedPostIds.includes(String(p.id)) || bookmarkedPostIds.includes(String(p._id)));
  }, [posts, bookmarkedPostIds]);

  const rsvpdEventsList = useMemo(() => {
    return events.filter(e => rsvpdEventIds.includes(String(e.id)) || rsvpdEventIds.includes(String(e._id)));
  }, [events, rsvpdEventIds]);

  if (viewMode === 'admin') {
    return (
      <AdminPortal 
        onBackToApp={() => setViewMode('user')}
        onAddNewCommittee={(newComm) => setCommittees(prev => [...prev, newComm])}
        onAddPostToFeed={(newPost) => setPosts(prev => [newPost, ...prev])}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    );
  }

  // SIGN IN / AUTH VIEW
  if (viewMode === 'auth') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212] text-[#E0E0E0]' : 'bg-[#FBF9F4] text-[#2D2825]'}`}>
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'bg-[#2A2A2A] text-amber-400 hover:bg-[#333]' : 'bg-[#F3ECE0] text-[#1A1615] hover:bg-[#EAE1D3]'}`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-md p-8 rounded-3xl border shadow-lg ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}
        >
          <div className="text-center mb-6">
            <span className="font-serif text-4xl font-bold tracking-tight block text-[#C87D55]">Peerly</span>
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>
              Campus Society & Event Discovery Portal
            </p>
          </div>

          {/* Role Selection Switch */}
          <div className={`grid grid-cols-2 p-1 rounded-xl mb-6 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-[#F3ECE0]'}`}>
            <button
              type="button"
              onClick={() => { setAuthRole('student'); setAuthMode('login'); }}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                authRole === 'student' 
                  ? isDarkMode ? 'bg-[#1E1E1E] text-white shadow-sm' : 'bg-white text-[#1A1615] shadow-sm' 
                  : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-[#6E645E] hover:text-[#1A1615]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthRole('admin'); setAuthMode('login'); }}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                authRole === 'admin' 
                  ? isDarkMode ? 'bg-amber-600 text-white shadow-sm' : 'bg-[#1A1615] text-white shadow-sm' 
                  : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-[#6E645E] hover:text-[#1A1615]'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#C87D55]" />
              <span>Admin</span>
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authRole === 'student' && authMode === 'register' && (
              <div>
                <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#4A423D]'}`}>Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Aaditya Joshi" 
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white focus:border-amber-500' : 'bg-[#FBF9F4] border-[#EAE1D3] text-[#2D2825] focus:border-[#C87D55]'}`}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#4A423D]'}`}>
                {authRole === 'admin' ? 'Admin Email' : 'Campus Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input 
                  type="email" 
                  placeholder={authRole === 'admin' ? 'admin@peerly.edu' : 'student@peerly.edu'} 
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white focus:border-amber-500' : 'bg-[#FBF9F4] border-[#EAE1D3] text-[#2D2825] focus:border-[#C87D55]'}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#4A423D]'}`}>Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white focus:border-amber-500' : 'bg-[#FBF9F4] border-[#EAE1D3] text-[#2D2825] focus:border-[#C87D55]'}`}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${isDarkMode ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-[#1A1615] text-white hover:bg-[#332D2A]'}`}
            >
              <span>{authRole === 'admin' ? 'Sign In as Admin' : (authMode === 'login' ? 'Sign In as Student' : 'Create Account')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            {authRole === 'student' && (
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className={`text-xs font-semibold hover:underline block w-full ${isDarkMode ? 'text-amber-400' : 'text-[#C87D55]'}`}
              >
                {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            )}

            <div className="block">
              <button 
                onClick={() => { setUser({ name: 'Guest Student', email: 'guest@peerly.edu', loggedIn: true, role: 'STUDENT' }); setViewMode('user'); }}
                className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-[#8C827A] hover:text-[#1A1615]'}`}
              >
                Continue as Guest &rarr;
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${isDarkMode ? 'bg-[#121212] text-[#E0E0E0]' : 'bg-[#FBF9F4] text-[#2D2825]'}`}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1A1615] text-white dark:bg-white dark:text-[#1A1615] px-4 py-2.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C87D55]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar Header (Desktop & Mobile) */}
      <header className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 ${isDarkMode ? 'bg-[#1E1E1E]/90 border-[#2C2C2C]' : 'bg-[#FBF9F4]/90 border-[#EAE1D3]'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span 
              onClick={() => setActiveTab('feed')}
              className={`font-serif text-2xl font-bold tracking-tight cursor-pointer ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}
            >
              Peerly
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isDarkMode ? 'bg-[#2C2C2C] text-gray-300' : 'bg-[#EAE1D3] text-[#1A1615]'}`}>
              Campus
            </span>
            {user.role === 'ADMIN' && (
              <button
                onClick={() => setViewMode('admin')}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#C87D55] text-white hover:bg-[#B36B45]"
              >
                <Shield className="w-3 h-3" /> Admin Dashboard
              </button>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { id: 'feed', label: 'Feed' },
              { id: 'committees', label: 'Clubs & Societies' },
              { id: 'calendar', label: 'Events Calendar' },
              { id: 'lostfound', label: 'Lost & Found' },
              { id: 'rankings', label: 'Rankings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? isDarkMode ? 'bg-amber-600 text-white shadow-sm' : 'bg-[#1A1615] text-white shadow-sm'
                    : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]' : 'text-[#6E645E] hover:text-[#1A1615] hover:bg-[#F3ECE0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'bg-[#2A2A2A] text-amber-400 hover:bg-[#333]' : 'bg-[#F3ECE0] text-[#1A1615] hover:bg-[#EAE1D3]'}`}
              title="Toggle Light/Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Profile access */}
            {user.loggedIn ? (
              <div 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 cursor-pointer p-1 rounded-xl transition-all ${
                  activeTab === 'profile' 
                    ? isDarkMode ? 'bg-[#2A2A2A] ring-2 ring-amber-500' : 'bg-[#F3ECE0] ring-2 ring-[#C87D55]' 
                    : isDarkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F3ECE0]'
                }`}
                title="Go to Profile"
              >
                <div className={`text-right text-xs leading-tight hidden sm:block pl-2`}>
                  <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{user.name}</div>
                  <div className={isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}>{user.role === 'ADMIN' ? 'Admin' : "Batch of '27"}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#C87D55] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-[#EAE1D3] dark:ring-[#333]">
                  {user.name ? user.name.split(' ').map(n=>n[0]).join('').slice(0, 2) : 'U'}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setViewMode('auth')}
                className="px-3.5 py-1.5 rounded-xl bg-[#C87D55] text-white text-xs font-bold hover:bg-[#B36B45] transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container - Has extra pb-28 so mobile bottom bar never overlaps */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12">

        {/* 1. FEED TAB */}
        {activeTab === 'feed' && (
          <div className="space-y-8">
            {/* Campus Reels Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>
                  🔥 Featured Campus Reels
                </p>
                <span className="text-[11px] font-semibold text-[#C87D55] cursor-pointer hover:underline" onClick={() => setActiveTab('committees')}>
                  Explore Societies &rarr;
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {posts.map((post) => (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={post.id || post._id} 
                    onClick={() => setActiveModalMedia(post)}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-md group"
                  >
                    <img 
                      src={post.mediaType === 'video' ? (post.posterUrl || post.mediaUrl) : post.mediaUrl} 
                      alt="Reel" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                      {post.mediaType === 'video' ? <Play className="w-3.5 h-3.5 fill-white" /> : <Camera className="w-3.5 h-3.5" />}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="font-bold text-xs sm:text-sm leading-tight truncate">{post.committee}</p>
                      <p className="text-[11px] opacity-85 mt-0.5 flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-white" /> {post.likes}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Posts Stream */}
              <div className="lg:col-span-2 space-y-6">
                {posts.map((post) => {
                  const pid = String(post.id || post._id);
                  const isSaved = bookmarkedPostIds.includes(pid);
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={pid} 
                      className={`rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}
                    >
                      <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${isDarkMode ? 'border-[#2C2C2C]' : 'border-[#F5EFE6]'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs ${isDarkMode ? 'bg-[#2A2A2A] text-gray-300' : 'bg-[#EAE1D3] text-[#6E645E]'}`}>
                            {post.avatar || (post.committee || 'CH').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className={`font-bold text-xs sm:text-sm ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{post.committee}</h3>
                            <p className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{post.tagline} • {post.time}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full ${post.badgeColor || 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
                          {post.badge || 'Announcement'}
                        </span>
                      </div>

                      <div className="relative bg-black group cursor-pointer" onClick={() => setActiveModalMedia(post)}>
                        {post.mediaType === 'video' ? (
                          <div className="relative">
                            <video src={post.mediaUrl} className="w-full max-h-[420px] object-cover" autoPlay loop muted playsInline />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="bg-white/90 text-[#1A1615] px-3.5 py-1.5 rounded-full text-xs font-bold shadow">Tap to expand</span>
                            </div>
                          </div>
                        ) : (
                          <img src={post.mediaUrl} alt="Post" className="w-full max-h-[420px] object-cover group-hover:opacity-95 transition-opacity" />
                        )}
                      </div>

                      <div className="p-4 sm:p-5 space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <motion.button 
                              whileTap={{ scale: 0.85 }}
                              onClick={() => toggleLike(post.id || post._id)}
                              className="flex items-center gap-1.5 text-xs font-semibold"
                            >
                              <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-rose-500 text-rose-500' : isDarkMode ? 'text-gray-400' : 'text-[#6E645E]'}`} />
                              <span className={post.isLiked ? 'text-rose-500' : isDarkMode ? 'text-gray-400' : 'text-[#6E645E]'}>{post.likes}</span>
                            </motion.button>

                            <div className={`flex items-center gap-1.5 text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-[#6E645E]'}`}>
                              <MessageCircle className="w-5 h-5" />
                              <span>{post.comments ? post.comments.length : 0}</span>
                            </div>

                            <button 
                              onClick={() => handleShare(post.caption)}
                              className={`flex items-center gap-1 text-xs font-semibold transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-[#6E645E] hover:text-[#1A1615]'}`}
                              title="Share post"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => toggleBookmark(post.id || post._id)}
                            className="flex items-center gap-1 text-xs font-semibold"
                            title={isSaved ? "Remove Bookmark" : "Save Bookmark"}
                          >
                            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-[#C87D55] text-[#C87D55]' : isDarkMode ? 'text-gray-400' : 'text-[#6E645E]'}`} />
                          </motion.button>
                        </div>

                        <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-[#4A423D]'}`}>{post.caption}</p>

                        {/* Comments */}
                        <div className={`pt-3 border-t space-y-2.5 ${isDarkMode ? 'border-[#2C2C2C]' : 'border-[#F5EFE6]'}`}>
                          <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                            {(post.comments || []).map((c) => (
                              <div key={c.id || c._id} className={`text-xs p-2 rounded-xl border flex justify-between items-start ${isDarkMode ? 'bg-[#2A2A2A] border-[#333]' : 'bg-[#FBF9F4] border-[#EAE1D3]/60'}`}>
                                <div>
                                  <span className={`font-bold mr-1.5 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{c.user}</span>
                                  <span className={isDarkMode ? 'text-gray-300' : 'text-[#4A423D]'}>{c.text}</span>
                                </div>
                                <span className={`text-[10px] shrink-0 ml-2 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{c.time}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <input 
                              type="text" 
                              placeholder="Write a comment..."
                              value={commentInputs[post.id || post._id] || ''}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [post.id || post._id]: e.target.value })}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id || post._id)}
                              className={`flex-1 rounded-xl px-3 py-2 text-xs focus:outline-none border ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white focus:border-amber-500' : 'bg-[#FBF9F4] border-[#EAE1D3] text-[#2D2825] focus:border-[#C87D55]'}`}
                            />
                            <button 
                              onClick={() => handleAddComment(post.id || post._id)}
                              className="p-2 bg-[#C87D55] text-white rounded-xl hover:bg-[#B36B45] transition-colors"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Sidebar with Upcoming Events with Live RSVPs */}
              <div className="space-y-6">
                <div className={`rounded-2xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold tracking-wider uppercase block ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>
                      📅 Upcoming Events
                    </span>
                    <button 
                      onClick={() => setActiveTab('calendar')} 
                      className="text-[11px] font-bold text-[#C87D55] hover:underline"
                    >
                      Full Calendar &rarr;
                    </button>
                  </div>
                  <div className="space-y-3.5">
                    {events.slice(0, 3).map((evt) => {
                      const eid = String(evt.id || evt._id);
                      const isGoing = rsvpdEventIds.includes(eid);
                      return (
                        <div key={eid} className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${isDarkMode ? 'bg-[#2A2A2A]/50 border-[#333]' : 'bg-[#FBF9F4] border-[#EAE1D3]/70'}`}>
                          <div className="flex gap-2.5 items-center">
                            <div className={`rounded-lg p-2 text-center min-w-[42px] ${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-[#F3ECE0]'}`}>
                              <div className={`text-sm font-bold leading-none ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{evt.day}</div>
                              <div className={`text-[9px] font-bold uppercase mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>NOV</div>
                            </div>
                            <div>
                              <h4 className={`text-xs font-bold leading-snug line-clamp-1 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{evt.title}</h4>
                              <p className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{evt.committee} • {evt.time}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleRsvp(eid)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-colors flex items-center gap-1 ${
                              isGoing 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' 
                                : 'bg-[#C87D55] text-white hover:bg-[#B36B45]'
                            }`}
                          >
                            {isGoing ? <Check className="w-3 h-3" /> : <Ticket className="w-3 h-3" />}
                            {isGoing ? 'Going' : 'RSVP'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Join Societies Card */}
                <div className={`rounded-2xl p-5 border shadow-sm ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                  <span className={`text-xs font-bold tracking-wider uppercase mb-3 block ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>
                    🏛️ Top Campus Clubs
                  </span>
                  <div className="space-y-3">
                    {committees.slice(0, 3).map(comm => (
                      <div key={comm.id || comm._id} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <img src={comm.image || comm.logo_url} alt={comm.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                          <span className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{comm.name}</span>
                        </div>
                        <button
                          onClick={() => toggleJoinSociety(comm.name)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 ${
                            joinedSocieties.includes(comm.name)
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-[#F3ECE0] dark:bg-[#2A2A2A] text-[#1A1615] dark:text-white'
                          }`}
                        >
                          {joinedSocieties.includes(comm.name) ? 'Joined ✓' : '+ Join'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. COMMITTEES TAB */}
        {activeTab === 'committees' && (
          <div className="space-y-6">
            <div>
              <span className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>EXPLORE CAMPUS CLUBS</span>
              <h1 className={`font-serif text-2xl sm:text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Discover Student Societies</h1>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>
                Connect with official campus chapters, view recruitment status, and join active teams.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {['All', 'Technical', 'Cultural', 'Media'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCommitteeFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    committeeFilter === cat
                      ? isDarkMode ? 'bg-amber-600 text-white' : 'bg-[#2D2825] text-white'
                      : isDarkMode ? 'bg-[#1E1E1E] border border-[#2C2C2C] text-gray-300' : 'bg-white border border-[#EAE1D3] text-[#6E645E]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {committees.filter(c => committeeFilter === 'All' || c.category === committeeFilter).map((item) => {
                const isMember = joinedSocieties.includes(item.name);
                return (
                  <div 
                    key={item.id || item._id} 
                    className={`rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all flex flex-col justify-between group ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden cursor-pointer" onClick={() => setSelectedCommitteeDetails(item)}>
                        <img src={item.image || item.logo_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur px-2.5 py-1 rounded-md text-xs font-bold text-[#1A1615] dark:text-white">
                          #{item.rank} Ranked
                        </span>
                        {item.isRecruiting && (
                          <span className="absolute top-3 right-3 bg-[#E1F3E6] text-[#2D6A4F] dark:bg-[#1C3A27] dark:text-[#81C784] px-2.5 py-1 rounded-md text-xs font-bold">
                            Recruiting Now
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 
                          onClick={() => setSelectedCommitteeDetails(item)}
                          className={`font-serif text-xl font-bold flex items-center justify-between cursor-pointer ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}
                        >
                          {item.name}
                          <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`} />
                        </h3>
                        <p className={`text-xs mt-1.5 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{item.desc}</p>
                      </div>
                    </div>
                    <div className={`px-5 py-3 border-t flex items-center justify-between text-xs ${isDarkMode ? 'bg-[#2A2A2A] border-[#333]' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}>
                      <span className={`flex items-center gap-1 font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>
                        <Star className="w-3.5 h-3.5 fill-[#C87D55] text-[#C87D55]" /> {item.rating}
                      </span>
                      <button
                        onClick={() => toggleJoinSociety(item.name)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          isMember 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                            : 'bg-[#C87D55] text-white hover:bg-[#B36B45]'
                        }`}
                      >
                        {isMember ? 'Joined ✓' : '+ Join Society'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
              <div>
                <span className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>CAMPUS SCHEDULE</span>
                <h1 className={`font-serif text-2xl sm:text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>November 2026 Events</h1>
              </div>
              <div className="flex items-center gap-2">
                {selectedCalendarDay && (
                  <button onClick={() => setSelectedCalendarDay(null)} className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${isDarkMode ? 'bg-[#2A2A2A] text-white' : 'bg-[#EAE1D3] text-[#1A1615]'}`}>
                    Show All Dates
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter for Events */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Workshop', 'Cultural', 'Tech', 'Social'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCalendarCategoryFilter(cat)}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    calendarCategoryFilter === cat
                      ? isDarkMode ? 'bg-amber-600 text-white' : 'bg-[#1A1615] text-white'
                      : isDarkMode ? 'bg-[#2A2A2A] text-gray-300' : 'bg-white border border-[#EAE1D3] text-[#6E645E]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Interactive Calendar Grid */}
              <div className={`lg:col-span-5 p-5 sm:p-6 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                <div className={`grid grid-cols-7 gap-2 text-center text-xs font-bold mb-3 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs sm:text-sm">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const dayNum = i + 1;
                    const hasEvent = events.some(e => e.day === dayNum);
                    const isSelected = selectedCalendarDay === dayNum;
                    return (
                      <button 
                        key={dayNum} 
                        onClick={() => setSelectedCalendarDay(isSelected ? null : dayNum)}
                        className={`py-2 rounded-xl flex flex-col items-center justify-center relative transition-all ${
                          isSelected 
                            ? isDarkMode ? 'bg-amber-600 text-white font-bold scale-105' : 'bg-[#1A1615] text-white font-bold scale-105' 
                            : isDarkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F3ECE0]'
                        }`}
                      >
                        <span>{dayNum}</span>
                        {hasEvent && <span className="w-1.5 h-1.5 rounded-full mt-0.5 bg-[#C87D55]" />}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t text-[11px] flex items-center justify-between text-gray-500">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#C87D55]" /> Has Event</span>
                  <span>Tap a date to filter</span>
                </div>
              </div>

              {/* Events List */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className={`font-bold text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>
                  {selectedCalendarDay ? `Events on Nov ${selectedCalendarDay}, 2026` : 'All Upcoming Events'} ({filteredCalendarEvents.length})
                </h3>

                {filteredCalendarEvents.length === 0 && (
                  <div className={`p-8 rounded-2xl border text-center ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C] text-gray-400' : 'bg-white border-[#EAE1D3] text-[#8C827A]'}`}>
                    No events scheduled for this filter. Try selecting another date!
                  </div>
                )}

                {filteredCalendarEvents.map((evt) => {
                  const eid = String(evt.id || evt._id);
                  const isGoing = rsvpdEventIds.includes(eid);
                  return (
                    <div key={eid} className={`rounded-2xl p-4 sm:p-5 border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                      <div className="flex gap-3.5 items-start sm:items-center">
                        <div className={`rounded-xl p-3 text-center min-w-[54px] shrink-0 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-[#F3ECE0]'}`}>
                          <div className={`text-lg font-bold leading-none ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{evt.day}</div>
                          <div className={`text-[10px] font-bold uppercase mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>NOV</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{evt.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${evt.tagColor || 'bg-amber-100 text-amber-800'}`}>{evt.tag}</span>
                          </div>
                          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{evt.committee}</p>
                          <div className={`flex flex-wrap items-center gap-3 text-xs mt-1.5 ${isDarkMode ? 'text-gray-300' : 'text-[#6E645E]'}`}>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#C87D55]" /> {evt.time}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#C87D55]" /> {evt.venue}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3 text-[#C87D55]" /> {evt.going || 12} students going</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => toggleRsvp(eid)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isGoing 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shadow-sm' 
                              : 'bg-[#C87D55] text-white hover:bg-[#B36B45]'
                          }`}
                        >
                          {isGoing ? <Check className="w-3.5 h-3.5" /> : <Ticket className="w-3.5 h-3.5" />}
                          {isGoing ? 'Going (RSVP’d)' : 'Reserve Spot'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. LOST & FOUND TAB */}
        {activeTab === 'lostfound' && (
          <div className="space-y-6">
            <div>
              <span className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>CAMPUS NOTICE BOARD</span>
              <h1 className={`font-serif text-2xl sm:text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Lost & Found</h1>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>
                Report items misplaced on campus or help peers find lost belongings.
              </p>
            </div>

            {/* Search Bar & Filter Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search by title, hall, or keywords..."
                  value={lostSearchTerm}
                  onChange={(e) => setLostSearchTerm(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C] text-white' : 'bg-white border-[#EAE1D3] text-[#1A1615]'}`}
                />
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                {['Everything', 'Lost', 'Found'].map(f => (
                  <button
                    key={f}
                    onClick={() => setLostFoundFilter(f)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      lostFoundFilter === f 
                        ? isDarkMode ? 'bg-amber-600 text-white' : 'bg-[#1A1615] text-white' 
                        : isDarkMode ? 'bg-[#2A2A2A] text-gray-300' : 'bg-white border border-[#EAE1D3] text-[#6E645E]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3.5">
                {filteredLostFound.length === 0 && (
                  <div className={`p-8 rounded-2xl border text-center ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C] text-gray-400' : 'bg-white border-[#EAE1D3] text-[#8C827A]'}`}>
                    No notices match your search. Submit one using the form on the right!
                  </div>
                )}

                {filteredLostFound.map((item) => (
                  <div key={item.id || item._id} className={`rounded-2xl p-4 sm:p-5 border shadow-sm space-y-2.5 ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                    <div className="flex justify-between items-start">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${item.type === 'Found' ? 'bg-[#E1F3E6] text-[#2D6A4F] dark:bg-[#1C3A27] dark:text-[#81C784]' : 'bg-[#FDE8E1] text-[#C87D55] dark:bg-[#3D251E] dark:text-[#FFB74D]'}`}>
                        {item.type} Item
                      </span>
                      <span className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{item.time}</span>
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{item.title}</h3>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-[#6E645E]'}`}>{item.desc}</p>
                    </div>
                    <div className={`text-xs border-t pt-2 flex flex-wrap justify-between gap-2 ${isDarkMode ? 'border-[#2C2C2C] text-gray-400' : 'border-[#EAE1D3] text-[#8C827A]'}`}>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#C87D55]" /> {item.location}</span>
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Contact: {item.contact}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form to Post */}
              <div className={`rounded-2xl p-5 sm:p-6 border shadow-sm h-fit ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                <h3 className={`font-bold text-sm mb-3 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Report Lost or Found Item</h3>
                <form onSubmit={handleAddLostFound} className="space-y-3 text-xs">
                  <select value={lostForm.type} onChange={e => setLostForm({ ...lostForm, type: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}>
                    <option value="Lost">I Lost Something</option>
                    <option value="Found">I Found Something</option>
                  </select>
                  <input type="text" placeholder="Item Name (e.g. Blue Hydroflask)" value={lostForm.title} onChange={e => setLostForm({ ...lostForm, title: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} required />
                  <input type="text" placeholder="Location (e.g. Central Library 2nd Floor)" value={lostForm.location} onChange={e => setLostForm({ ...lostForm, location: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} required />
                  <input type="text" placeholder="Contact Info / Room #" value={lostForm.contact} onChange={e => setLostForm({ ...lostForm, contact: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} />
                  <textarea placeholder="Description & distinguishing details..." value={lostForm.desc} onChange={e => setLostForm({ ...lostForm, desc: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} rows={3} />
                  <button type="submit" className="w-full bg-[#C87D55] text-white py-2.5 rounded-xl font-bold hover:bg-[#B36B45] transition-colors">Submit Notice</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 5. RANKINGS & REVIEWS TAB */}
        {activeTab === 'rankings' && (
          <div className="space-y-6">
            <div>
              <span className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>PEER FEEDBACK</span>
              <h1 className={`font-serif text-2xl sm:text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Anonymous Society Reviews</h1>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>
                Read genuine ratings by students to decide which clubs to join. Identity is hashed for privacy.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-3.5">
                {anonymousReviews.map((rev) => (
                  <div key={rev.id} className={`p-4 sm:p-5 rounded-2xl border shadow-sm space-y-2 ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-bold text-xs sm:text-sm ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{rev.committee}</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-[#C87D55]">
                        <Star className="w-3.5 h-3.5 fill-[#C87D55]" /> {rev.score} / 5
                      </span>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-[#6E645E]'}`}>{rev.comment}</p>
                    <span className={`text-[10px] block text-right ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{rev.time}</span>
                  </div>
                ))}
              </div>

              <div className={`lg:col-span-5 p-5 sm:p-6 rounded-2xl border shadow-sm h-fit ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                <h3 className={`font-bold text-sm mb-3 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Submit Anonymous Review</h3>
                <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                  <div>
                    <label className="block mb-1 font-semibold opacity-80">Choose Society</label>
                    <select value={reviewInput.committee} onChange={e => setReviewInput({ ...reviewInput, committee: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}>
                      {committees.map(c => <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold opacity-80">Star Rating</label>
                    <select value={reviewInput.score} onChange={e => setReviewInput({ ...reviewInput, score: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}>
                      <option value="5">⭐⭐⭐⭐⭐ (5 - Outstanding)</option>
                      <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                      <option value="3">⭐⭐⭐ (3 - Average)</option>
                      <option value="2">⭐⭐ (2 - Below Expectations)</option>
                      <option value="1">⭐ (1 - Needs Improvement)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold opacity-80">Honest Feedback</label>
                    <textarea placeholder="Workload, learning, community culture..." value={reviewInput.comment} onChange={e => setReviewInput({ ...reviewInput, comment: e.target.value })} className={`w-full p-2.5 border rounded-xl ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`} rows={3} required />
                  </div>
                  <button type="submit" className={`w-full py-2.5 rounded-xl font-bold transition-colors ${isDarkMode ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-[#1A1615] text-white'}`}>
                    Post Anonymous Feedback
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 6. PROFILE VIEW */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className={`rounded-2xl border p-5 sm:p-6 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C87D55] text-white text-xl sm:text-2xl font-bold flex items-center justify-center ring-4 ring-[#EAE1D3] dark:ring-[#333]">
                    {user.name ? user.name.split(' ').map(n=>n[0]).join('').slice(0, 2) : 'AJ'}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className={`font-serif text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{user.name}</h1>
                      <span className="bg-[#E1F3E6] text-[#2D6A4F] dark:bg-[#1C3A27] dark:text-[#81C784] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {user.role === 'ADMIN' ? 'Campus Admin' : 'Verified Student'}
                      </span>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{user.email} • Class of '27</p>
                    
                    <div className="pt-1.5">
                      {isEditingBio ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={bioText} 
                            onChange={(e) => setBioText(e.target.value)}
                            className={`text-xs p-2 border rounded-xl w-full max-w-md ${isDarkMode ? 'bg-[#2A2A2A] border-[#333] text-white' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}
                          />
                          <button 
                            onClick={handleSaveBio} 
                            className="text-xs bg-[#C87D55] text-white px-3 py-1.5 rounded-xl font-bold shrink-0"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <p className={`text-xs flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-[#4A423D]'}`}>
                          {bioText}
                          <button onClick={() => setIsEditingBio(true)} className={`p-1 rounded ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-[#8C827A] hover:text-[#1A1615]'}`}>
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full md:w-auto">
                  <div className={`grid grid-cols-3 gap-3 w-full p-3 rounded-xl border ${isDarkMode ? 'bg-[#2A2A2A] border-[#333]' : 'bg-[#FBF9F4] border-[#EAE1D3]'}`}>
                    <div className="text-center">
                      <span className={`block font-bold text-base sm:text-lg ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{joinedSocieties.length}</span>
                      <span className={`text-[9px] uppercase font-semibold ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>Clubs</span>
                    </div>
                    <div className="text-center border-x px-2 border-inherit">
                      <span className={`block font-bold text-base sm:text-lg ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{bookmarkedPostIds.length}</span>
                      <span className={`text-[9px] uppercase font-semibold ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>Saved</span>
                    </div>
                    <div className="text-center">
                      <span className={`block font-bold text-base sm:text-lg ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{rsvpdEventIds.length}</span>
                      <span className={`text-[9px] uppercase font-semibold ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>RSVPs</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-3.5 py-2 rounded-xl transition-colors shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>

              <div className={`mt-5 pt-3.5 border-t flex flex-wrap items-center gap-2 text-xs ${isDarkMode ? 'border-[#2C2C2C]' : 'border-[#EAE1D3]'}`}>
                <span className={`font-bold ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>Active Memberships:</span>
                {joinedSocieties.map((m, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${isDarkMode ? 'bg-[#2A2A2A] text-amber-400' : 'bg-[#F3ECE0] text-[#1A1615]'}`}>
                    <CheckCircle2 className="w-3 h-3 text-[#C87D55]" /> {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className={`flex border-b gap-6 text-sm font-bold ${isDarkMode ? 'border-[#333]' : 'border-[#EAE1D3]'}`}>
                <button 
                  onClick={() => setProfileSubTab('saved')}
                  className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                    profileSubTab === 'saved' 
                      ? 'border-[#C87D55] text-[#C87D55]' 
                      : isDarkMode ? 'border-transparent text-gray-400 hover:text-white' : 'border-transparent text-[#8C827A] hover:text-[#1A1615]'
                  }`}
                >
                  <Bookmark className="w-4 h-4" /> Bookmarks ({bookmarkedPosts.length})
                </button>

                <button 
                  onClick={() => setProfileSubTab('events')}
                  className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                    profileSubTab === 'events' 
                      ? 'border-[#C87D55] text-[#C87D55]' 
                      : isDarkMode ? 'border-transparent text-gray-400 hover:text-white' : 'border-transparent text-[#8C827A] hover:text-[#1A1615]'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" /> My RSVPs ({rsvpdEventsList.length})
                </button>
              </div>

              {/* Subtab: Real Bookmarked Posts */}
              {profileSubTab === 'saved' && (
                <div>
                  {bookmarkedPosts.length === 0 ? (
                    <div className={`p-8 rounded-2xl border text-center ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C] text-gray-400' : 'bg-white border-[#EAE1D3] text-[#8C827A]'}`}>
                      <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-semibold">No saved bookmarks yet</p>
                      <p className="text-xs mt-1">Tap the bookmark icon on any post in the campus feed to keep it here!</p>
                      <button onClick={() => setActiveTab('feed')} className="mt-3 px-4 py-1.5 rounded-xl bg-[#C87D55] text-white text-xs font-bold">
                        Browse Feed
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bookmarkedPosts.map((post) => (
                        <div key={post.id || post._id} className={`rounded-2xl overflow-hidden border shadow-sm flex flex-col justify-between ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                          <div>
                            <img src={post.mediaUrl} alt={post.committee} className="w-full h-36 object-cover" />
                            <div className="p-4 space-y-1.5">
                              <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{post.committee}</span>
                              <p className={`text-xs line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-[#6E645E]'}`}>{post.caption}</p>
                            </div>
                          </div>
                          <div className={`px-4 py-2.5 border-t text-xs flex justify-between items-center ${isDarkMode ? 'border-[#2C2C2C] bg-[#2A2A2A]' : 'border-[#EAE1D3] bg-[#FBF9F4]'}`}>
                            <span className="text-[10px] opacity-70">{post.likes} Likes</span>
                            <button onClick={() => toggleBookmark(post.id || post._id)} className="text-rose-500 font-bold hover:underline">
                              Remove Bookmark
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Subtab: Real RSVP'd Events */}
              {profileSubTab === 'events' && (
                <div className="space-y-3">
                  {rsvpdEventsList.length === 0 ? (
                    <div className={`p-8 rounded-2xl border text-center ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C] text-gray-400' : 'bg-white border-[#EAE1D3] text-[#8C827A]'}`}>
                      <Ticket className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-semibold">No active event RSVPs</p>
                      <p className="text-xs mt-1">Explore upcoming hackathons, build nights, and workshops in the calendar.</p>
                      <button onClick={() => setActiveTab('calendar')} className="mt-3 px-4 py-1.5 rounded-xl bg-[#C87D55] text-white text-xs font-bold">
                        View Campus Calendar
                      </button>
                    </div>
                  ) : (
                    rsvpdEventsList.map((evt) => (
                      <div key={evt.id || evt._id} className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between gap-3 ${isDarkMode ? 'bg-[#1E1E1E] border-[#2C2C2C]' : 'bg-white border-[#EAE1D3]'}`}>
                        <div className="flex items-center gap-3.5">
                          <div className={`p-2.5 rounded-xl text-center min-w-[50px] ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-[#F3ECE0]'}`}>
                            <span className={`text-base font-bold block ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{evt.day}</span>
                            <span className="text-[9px] font-bold uppercase opacity-75">NOV</span>
                          </div>
                          <div>
                            <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{evt.title}</h4>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{evt.committee} • {evt.time} at {evt.venue}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleRsvp(evt.id || evt._id)}
                          className="text-xs font-bold text-rose-500 hover:underline px-2 py-1"
                        >
                          Cancel RSVP
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (Fixed on screen for phone users) */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t transition-colors duration-300 ${
        isDarkMode ? 'bg-[#1E1E1E]/95 border-[#2C2C2C]' : 'bg-white/95 border-[#EAE1D3]'
      } px-2 py-1.5 shadow-lg`}>
        <div className="grid grid-cols-5 items-center text-center">
          {[
            { id: 'feed', label: 'Feed', icon: Flame },
            { id: 'committees', label: 'Clubs', icon: Users },
            { id: 'calendar', label: 'Events', icon: CalendarIcon },
            { id: 'lostfound', label: 'Notices', icon: Search },
            { id: 'rankings', label: 'Reviews', icon: Star },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center justify-center py-1 transition-all ${
                  isActive 
                    ? 'text-[#C87D55] font-bold scale-105' 
                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-[#8C827A] hover:text-[#1A1615]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
                {isActive && <span className="w-1 h-1 rounded-full bg-[#C87D55] mt-0.5" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Committee Details Modal */}
      <AnimatePresence>
        {selectedCommitteeDetails && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className={`relative max-w-xl w-full rounded-2xl overflow-hidden p-6 space-y-4 max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-[#1E1E1E] text-[#E0E0E0]' : 'bg-white text-[#2D2825]'}`}>
              <button onClick={() => setSelectedCommitteeDetails(null)} className={`absolute top-4 right-4 p-1.5 rounded-full ${isDarkMode ? 'bg-[#2A2A2A] text-white' : 'bg-[#F3ECE0] text-[#1A1615]'}`}>
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isDarkMode ? 'bg-[#2A2A2A] text-gray-300' : 'bg-[#EAE1D3] text-[#1A1615]'}`}>
                  {selectedCommitteeDetails.category}
                </span>
                <h2 className={`font-serif text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{selectedCommitteeDetails.name}</h2>
                <p className={`text-xs mt-2 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-[#6E645E]'}`}>{selectedCommitteeDetails.fullDetails}</p>
              </div>

              <div className={`space-y-3 text-xs border-t pt-4 ${isDarkMode ? 'border-[#2C2C2C]' : 'border-[#EAE1D3]'}`}>
                <div className={`flex items-center gap-2 font-semibold ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>
                  <UserCheck className="w-4 h-4 text-[#C87D55]" />
                  <span>Lead: <span className={`font-normal ${isDarkMode ? 'text-gray-400' : 'text-[#6E645E]'}`}>{selectedCommitteeDetails.lead}</span></span>
                </div>

                <div>
                  <span className={`font-semibold block mb-1.5 ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>Active Wings & Departments:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedCommitteeDetails.departments || ['General']).map((dept, i) => (
                      <span key={i} className={`px-2.5 py-1 rounded-lg text-[11px] ${isDarkMode ? 'bg-[#2A2A2A] text-white' : 'bg-[#F3ECE0] text-[#1A1615]'}`}>
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => toggleJoinSociety(selectedCommitteeDetails.name)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    joinedSocieties.includes(selectedCommitteeDetails.name)
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-[#C87D55] text-white hover:bg-[#B36B45]'
                  }`}
                >
                  {joinedSocieties.includes(selectedCommitteeDetails.name) ? 'Joined (Member) ✓' : '+ Join Society'}
                </button>

                <a 
                  href={selectedCommitteeDetails.website || '#'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`p-2.5 rounded-xl border flex items-center justify-center ${isDarkMode ? 'border-[#333] hover:bg-[#2A2A2A]' : 'border-[#EAE1D3] hover:bg-[#F3ECE0]'}`}
                  title="Visit Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reel & Post Lightbox Modal */}
      <AnimatePresence>
        {activeModalMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className={`relative max-w-4xl w-full rounded-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] ${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
              <button 
                onClick={() => setActiveModalMedia(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="md:w-3/5 bg-black flex items-center justify-center min-h-[280px]">
                {activeModalMedia.mediaType === 'video' ? (
                  <video src={activeModalMedia.mediaUrl} controls autoPlay className="max-h-[75vh] w-full object-contain" />
                ) : (
                  <img src={activeModalMedia.mediaUrl} alt="Media modal" className="max-h-[75vh] w-full object-contain" />
                )}
              </div>

              <div className={`md:w-2/5 p-6 flex flex-col justify-between ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#FBF9F4]'}`}>
                <div>
                  <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{activeModalMedia.committee}</h4>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{activeModalMedia.time}</p>
                  <p className={`text-sm my-4 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-[#4A423D]'}`}>{activeModalMedia.caption}</p>
                </div>

                <div className={`pt-4 border-t flex items-center justify-between ${isDarkMode ? 'border-[#2C2C2C]' : 'border-[#EAE1D3]'}`}>
                  <div className="flex items-center gap-2">
                    <Heart className={`w-5 h-5 ${activeModalMedia.isLiked ? 'fill-rose-500 text-rose-500' : isDarkMode ? 'text-gray-400' : 'text-[#6E645E]'}`} />
                    <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#1A1615]'}`}>{activeModalMedia.likes} Likes</span>
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C827A]'}`}>{activeModalMedia.comments ? activeModalMedia.comments.length : 0} Comments</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
