import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Edit3, 
  Key, 
  RefreshCw, 
  LogOut, 
  Copy, 
  Check, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Percent, 
  Bell, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  X, 
  Eye, 
  EyeOff, 
  ChevronRight,
  Database,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function ProfileView() {
  const { user, updateProfile, refreshProfile, changePassword, logout } = useAuth();
  const { sales, expenses, inventory, healthScore } = useData();

  // Refresh & Toast states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Edit Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    businessName: user?.businessName || '',
    phone: user?.phone || '',
    city: user?.city || '',
    state: user?.state || '',
    businessType: user?.businessType || 'Retail Store',
    sector: user?.sector || 'FMCG & Grocery',
    gstin: user?.gstin || '',
    annualTurnover: user?.annualTurnover || '₹10L - ₹50L',
    monthlyRevenue: user?.monthlyRevenue || '',
    monthlyExpenses: user?.monthlyExpenses || '',
    currency: user?.currency || 'INR (₹)',
    taxRate: user?.taxRate ?? 18,
    emailNotifications: user?.emailNotifications ?? true,
    aiSuggestionsEnabled: user?.aiSuggestionsEnabled ?? true,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Password Form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handle Backend Refresh
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshProfile();
      showToast('Profile data synced live from backend!');
    } catch (err) {
      showToast('Could not refresh profile. Please check connection.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Open Edit Modal with fresh user values
  const handleOpenEditModal = () => {
    setProfileForm({
      name: user?.name || '',
      businessName: user?.businessName || '',
      phone: user?.phone || '',
      city: user?.city || '',
      state: user?.state || '',
      businessType: user?.businessType || 'Retail Store',
      sector: user?.sector || 'FMCG & Grocery',
      gstin: user?.gstin || '',
      annualTurnover: user?.annualTurnover || '₹10L - ₹50L',
      monthlyRevenue: user?.monthlyRevenue || '',
      monthlyExpenses: user?.monthlyExpenses || '',
      currency: user?.currency || 'INR (₹)',
      taxRate: user?.taxRate ?? 18,
      emailNotifications: user?.emailNotifications ?? true,
      aiSuggestionsEnabled: user?.aiSuggestionsEnabled ?? true,
    });
    setEditError('');
    setIsEditModalOpen(true);
  };

  // Submit Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      await updateProfile(profileForm);
      setIsEditModalOpen(false);
      showToast('Profile updated successfully!');
    } catch (err) {
      setEditError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  // Submit Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError('');

    if (passwordForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters long');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }

    setPwLoading(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password changed successfully!');
    } catch (err) {
      setPwError(err.response?.data?.message || err.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  // Metrics from Live Data
  const liveRevenue = sales.reduce((acc, s) => acc + Number(s.amount || 0), 0);
  const liveExpenses = expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const liveOrders = sales.length;
  const netMargin = liveRevenue > 0 ? (((liveRevenue - liveExpenses) / liveRevenue) * 100).toFixed(1) : '0.0';

  const initialLetter = (user?.name || user?.businessName || 'M').charAt(0).toUpperCase();

  const memberSinceFormatted = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', day: 'numeric' })
    : 'Active Member';

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#202B3C] text-white px-3.5 py-2 rounded-md shadow-lg border border-[#E7E3DC] text-xs font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER PROFILE HERO BANNER */}
      <div className="bg-white rounded-lg border border-[#E7E3DC] p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Avatar and Identity Info */}
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[#202B3C] text-white flex items-center justify-center text-xl sm:text-2xl font-semibold shrink-0">
              {initialLetter}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-semibold text-[#202B3C] tracking-tight">
                  {user?.businessName || user?.name || 'Registered MSME'}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7]">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                  Verified Account
                </span>
              </div>

              <p className="text-xs text-[#737D8B] flex flex-wrap items-center gap-1.5">
                <span>Proprietor: <strong className="text-[#202B3C]">{user?.name || 'Authorized User'}</strong></span>
                <span>•</span>
                <span>{user?.email}</span>
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-[#737D8B]">
                <span className="px-2 py-0.5 rounded border border-[#E7E3DC] bg-[#FAF9F6]">
                  {user?.sector || 'FMCG & Grocery'}
                </span>
                <span className="px-2 py-0.5 rounded border border-[#E7E3DC] bg-[#FAF9F6]">
                  {user?.businessType || 'Retail Store'}
                </span>
                {(user?.city || user?.state) && (
                  <span className="px-2 py-0.5 rounded border border-[#E7E3DC] bg-[#FAF9F6]">
                    {[user.city, user.state].filter(Boolean).join(', ')}
                  </span>
                )}
                <span className="text-[11px] text-[#9AA2AD]">
                  Joined {memberSinceFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded border border-[#E7E3DC] bg-white text-xs font-medium text-[#202B3C] hover:bg-[#FAF9F6] transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#737D8B] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
            </button>

            <button
              onClick={handleOpenEditModal}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded bg-[#202B3C] text-white text-xs font-medium hover:bg-[#151D2A] transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>

            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded border border-[#E7E3DC] bg-white text-xs font-medium text-[#202B3C] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-[#737D8B]" />
              <span>Password</span>
            </button>
          </div>
        </div>

        {/* Real-time Business Metrics Strip */}
        <div className="mt-5 pt-5 border-t border-[#E7E3DC] grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#FAF9F6] rounded-md p-3 border border-[#E7E3DC]">
            <span className="text-[10px] uppercase font-medium tracking-wider text-[#737D8B] block">
              Recorded Sales
            </span>
            <span className="text-base font-semibold text-[#202B3C] tabular-nums mt-0.5 block">
              ₹{liveRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#737D8B]">{liveOrders} transactions</span>
          </div>

          <div className="bg-[#FAF9F6] rounded-md p-3 border border-[#E7E3DC]">
            <span className="text-[10px] uppercase font-medium tracking-wider text-[#737D8B] block">
              Catalog Items
            </span>
            <span className="text-base font-semibold text-[#202B3C] tabular-nums mt-0.5 block">
              {inventory.length} SKUs
            </span>
            <span className="text-[10px] text-[#737D8B]">Active inventory</span>
          </div>

          <div className="bg-[#FAF9F6] rounded-md p-3 border border-[#E7E3DC]">
            <span className="text-[10px] uppercase font-medium tracking-wider text-[#737D8B] block">
              Net Profit Margin
            </span>
            <span className="text-base font-semibold text-emerald-700 tabular-nums mt-0.5 block">
              {netMargin}%
            </span>
            <span className="text-[10px] text-[#737D8B]">₹{(liveRevenue - liveExpenses).toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-[#FAF9F6] rounded-md p-3 border border-[#E7E3DC]">
            <span className="text-[10px] uppercase font-medium tracking-wider text-[#737D8B] block">
              Health Rating
            </span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-base font-semibold text-[#202B3C] tabular-nums">
                {healthScore ?? 84}/100
              </span>
              <span className="text-[10px] font-medium text-emerald-700">Healthy</span>
            </div>
            <span className="text-[10px] text-[#737D8B]">{user?.annualTurnover || '₹10L - ₹50L'}</span>
          </div>
        </div>
      </div>

      {/* DETAILED INFORMATION CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* CARD 1: Business Identity & Legal Information */}
        <div className="bg-white rounded-lg border border-[#E7E3DC] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#E7E3DC]">
            <h2 className="text-sm font-semibold text-[#202B3C]">
              Enterprise Legal Information
            </h2>
            <button
              onClick={handleOpenEditModal}
              className="text-xs text-[#202B3C] hover:underline font-medium cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#8C8275] font-medium block mb-1">Registered Business Name</span>
              <span className="font-semibold text-[#1C2A39] text-sm block">
                {user?.businessName || 'Not specified'}
              </span>
            </div>

            <div>
              <span className="text-[#8C8275] font-medium block mb-1">Business Operating Type</span>
              <span className="font-semibold text-[#1C2A39] text-sm block">
                {user?.businessType || 'Retail Store'}
              </span>
            </div>

            <div>
              <span className="text-[#8C8275] font-medium block mb-1">Industry Sector</span>
              <span className="font-semibold text-[#1C2A39] text-sm block">
                {user?.sector || 'FMCG & Grocery'}
              </span>
            </div>

            <div>
              <span className="text-[#8C8275] font-medium block mb-1">Annual Turnover Tier</span>
              <span className="font-semibold text-[#1C2A39] text-sm block">
                {user?.annualTurnover || '₹10L - ₹50L'}
              </span>
            </div>

            <div className="sm:col-span-2 p-3 rounded-lg bg-[#FBF9F6] border border-[#E8E3D9] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#786E60] block">
                  Goods & Services Tax ID (GSTIN)
                </span>
                <span className="font-mono text-xs font-bold text-[#1C2A39] tracking-wider">
                  {user?.gstin ? user.gstin : 'Not Registered / Unspecified'}
                </span>
              </div>
              {user?.gstin ? (
                <button
                  onClick={() => copyToClipboard(user.gstin, 'GSTIN')}
                  className="px-2.5 py-1 text-[11px] font-medium rounded border border-[#CBD5E1] bg-white text-[#1C2A39] hover:bg-[#F5F3EE] flex items-center space-x-1 cursor-pointer"
                >
                  {copiedField === 'GSTIN' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#786E60]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleOpenEditModal}
                  className="text-xs text-[#274258] hover:underline font-medium cursor-pointer"
                >
                  Add GSTIN
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CARD 2: Contact & Operating Location */}
        <div className="bg-white rounded-xl border border-[#E8E3D9] p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-[#F5F3EE] text-[#274258]">
                <User className="w-4 h-4" />
              </div>
              <h2 className="font-serif-heading text-lg font-bold text-[#1C2A39]">
                Owner & Contact Info
              </h2>
            </div>
            <button
              onClick={handleOpenEditModal}
              className="text-xs text-[#274258] hover:underline font-medium cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#8C8275] font-medium block mb-1">Owner / Primary Contact</span>
              <span className="font-semibold text-[#1C2A39] text-sm block">
                {user?.name || 'Authorized User'}
              </span>
            </div>

            <div>
              <span className="text-[#8C8275] font-medium block mb-1">Primary Email Address</span>
              <div className="flex items-center space-x-1.5">
                <span className="font-semibold text-[#1C2A39] text-xs truncate max-w-[180px]">
                  {user?.email}
                </span>
                <span title="Email is verified" className="text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div>
              <span className="text-[#8C8275] font-medium block mb-1">Mobile / WhatsApp</span>
              <span className="font-semibold text-[#1C2A39] text-sm block">
                {user?.phone || 'Not provided'}
              </span>
            </div>

            <div>
              <span className="text-[#8C8275] font-medium block mb-1">City of Operation</span>
              <span className="font-semibold text-[#1C2A39] text-sm block">
                {user?.city || 'Not provided'}
              </span>
            </div>

            <div>
              <span className="text-[#8C8275] font-medium block mb-1">State / Province</span>
              <span className="font-semibold text-[#1C2A39] text-sm block">
                {user?.state || 'Not provided'}
              </span>
            </div>

            <div>
              <span className="text-[#8C8275] font-medium block mb-1">Country</span>
              <span className="font-semibold text-[#1C2A39] text-sm block">
                India (IN)
              </span>
            </div>
          </div>
        </div>

        {/* CARD 3: Financial Baseline & Operating Preferences */}
        <div className="bg-white rounded-xl border border-[#E8E3D9] p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-[#F5F3EE] text-[#274258]">
                <DollarSign className="w-4 h-4" />
              </div>
              <h2 className="font-serif-heading text-lg font-bold text-[#1C2A39]">
                Financial Targets & Defaults
              </h2>
            </div>
            <button
              onClick={handleOpenEditModal}
              className="text-xs text-[#274258] hover:underline font-medium cursor-pointer"
            >
              Configure
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#8C8275] font-medium block mb-1">Target Monthly Revenue</span>
              <span className="font-semibold text-[#1C2A39] text-sm block">
                {user?.monthlyRevenue ? `₹${Number(user.monthlyRevenue).toLocaleString('en-IN')}` : '₹3,50,000 (Default)'}
              </span>
            </div>

            <div>
              <span className="text-[#8C8275] font-medium block mb-1">Target Monthly Expenses</span>
              <span className="font-semibold text-[#1C2A39] text-sm block">
                {user?.monthlyExpenses ? `₹${Number(user.monthlyExpenses).toLocaleString('en-IN')}` : '₹1,20,000 (Default)'}
              </span>
            </div>

            <div>
              <span className="text-[#8C8275] font-medium block mb-1">Operating Currency</span>
              <span className="font-semibold text-[#1C2A39] text-sm block">
                {user?.currency || 'INR (₹)'}
              </span>
            </div>

            <div>
              <span className="text-[#8C8275] font-medium block mb-1">Default GST / Tax Rate</span>
              <span className="font-semibold text-[#1C2A39] text-sm block">
                {user?.taxRate ?? 18}% Standard GST
              </span>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-[#F0ECE1] flex items-center justify-between text-xs">
              <span className="text-[#786E60]">Data Storage Engine:</span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                MongoDB Atlas Cloud
              </span>
            </div>
          </div>
        </div>

        {/* CARD 4: Security, AI & Account Actions */}
        <div className="bg-white rounded-xl border border-[#E8E3D9] p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-[#F5F3EE] text-[#274258]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="font-serif-heading text-lg font-bold text-[#1C2A39]">
                Security & Advisor Features
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Protected
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#FBF9F6] border border-[#E8E3D9]">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-[#274258]" />
                <div>
                  <span className="font-semibold text-[#1C2A39] block">AI Business Co-Pilot</span>
                  <span className="text-[11px] text-[#786E60]">Automated profit margins & inventory recommendations</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700">
                {user?.aiSuggestionsEnabled !== false ? 'Active' : 'Disabled'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#FBF9F6] border border-[#E8E3D9]">
              <div className="flex items-center space-x-2.5">
                <Bell className="w-4 h-4 text-[#274258]" />
                <div>
                  <span className="font-semibold text-[#1C2A39] block">Email Summary Digests</span>
                  <span className="text-[11px] text-[#786E60]">Weekly financial reports sent to {user?.email}</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700">
                {user?.emailNotifications !== false ? 'Active' : 'Disabled'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="flex items-center space-x-1.5 text-xs text-[#274258] hover:text-[#1C3142] font-semibold cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Change Account Password</span>
              </button>

              <button
                onClick={logout}
                className="flex items-center space-x-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E8E3D9] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3D9] bg-[#FBF9F6]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#274258] text-white flex items-center justify-center font-bold text-sm">
                  {initialLetter}
                </div>
                <div>
                  <h3 className="font-serif-heading text-lg font-bold text-[#1C2A39]">
                    Edit User Profile & Business Details
                  </h3>
                  <p className="text-[11px] text-[#786E60]">Update your enterprise profile stored in MongoDB</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#786E60] hover:text-[#1C2A39] p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleProfileSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
              {editError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-[#1C2A39]">Proprietor / Full Name *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#274258]"
                    placeholder="e.g. Ramesh Patel"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1C2A39]">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.businessName}
                    onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#274258]"
                    placeholder="e.g. Patel Textiles Pvt Ltd"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1C2A39]">Contact Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#274258]"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1C2A39]">GSTIN (Goods & Services Tax)</label>
                  <input
                    type="text"
                    value={profileForm.gstin}
                    onChange={(e) => setProfileForm({ ...profileForm, gstin: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#274258] uppercase font-mono"
                    placeholder="e.g. 24AAAAA0000A1Z5"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1C2A39]">Business Operating Type</label>
                  <select
                    value={profileForm.businessType}
                    onChange={(e) => setProfileForm({ ...profileForm, businessType: e.target.value })}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#274258] bg-white cursor-pointer"
                  >
                    <option value="Retail Store">Retail Store</option>
                    <option value="Wholesale & Distribution">Wholesale & Distribution</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Services & Consultancy">Services & Consultancy</option>
                    <option value="E-Commerce & Online">E-Commerce & Online</option>
                    <option value="Other">Other Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1C2A39]">Industry Sector</label>
                  <select
                    value={profileForm.sector}
                    onChange={(e) => setProfileForm({ ...profileForm, sector: e.target.value })}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#274258] bg-white cursor-pointer"
                  >
                    <option value="FMCG & Grocery">FMCG & Grocery</option>
                    <option value="Textiles & Apparel">Textiles & Apparel</option>
                    <option value="Electronics & Hardware">Electronics & Hardware</option>
                    <option value="Agro & Food Processing">Agro & Food Processing</option>
                    <option value="Handicrafts & Artisans">Handicrafts & Artisans</option>
                    <option value="Pharmaceuticals & Health">Pharmaceuticals & Health</option>
                    <option value="Logistics & Transport">Logistics & Transport</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1C2A39]">Operating City</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#274258]"
                    placeholder="e.g. Surat"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1C2A39]">Operating State</label>
                  <input
                    type="text"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#274258]"
                    placeholder="e.g. Gujarat"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1C2A39]">Annual Turnover Bracket</label>
                  <select
                    value={profileForm.annualTurnover}
                    onChange={(e) => setProfileForm({ ...profileForm, annualTurnover: e.target.value })}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#274258] bg-white cursor-pointer"
                  >
                    <option value="Below ₹10L">Below ₹10L</option>
                    <option value="₹10L - ₹50L">₹10L - ₹50L</option>
                    <option value="₹50L - ₹1.5Cr">₹50L - ₹1.5Cr</option>
                    <option value="₹1.5Cr - ₹5Cr">₹1.5Cr - ₹5Cr</option>
                    <option value="Above ₹5Cr">Above ₹5Cr</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1C2A39]">Standard GST Rate (%)</label>
                  <input
                    type="number"
                    value={profileForm.taxRate}
                    onChange={(e) => setProfileForm({ ...profileForm, taxRate: e.target.value })}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#274258]"
                    placeholder="18"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1C2A39]">Target Monthly Revenue (₹)</label>
                  <input
                    type="number"
                    value={profileForm.monthlyRevenue}
                    onChange={(e) => setProfileForm({ ...profileForm, monthlyRevenue: e.target.value })}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#274258]"
                    placeholder="350000"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1C2A39]">Target Monthly Expenses (₹)</label>
                  <input
                    type="number"
                    value={profileForm.monthlyExpenses}
                    onChange={(e) => setProfileForm({ ...profileForm, monthlyExpenses: e.target.value })}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#274258]"
                    placeholder="120000"
                  />
                </div>
              </div>

              {/* Preferences Toggles */}
              <div className="pt-3 border-t border-[#E8E3D9] space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileForm.aiSuggestionsEnabled}
                    onChange={(e) => setProfileForm({ ...profileForm, aiSuggestionsEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-[#274258] focus:ring-[#274258] border-[#CBD5E1]"
                  />
                  <div>
                    <span className="font-semibold text-[#1C2A39] block">Enable AI Growth Suggestions</span>
                    <span className="text-[11px] text-[#786E60]">Receive proactive AI tips based on live sales & inventory</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileForm.emailNotifications}
                    onChange={(e) => setProfileForm({ ...profileForm, emailNotifications: e.target.checked })}
                    className="w-4 h-4 rounded text-[#274258] focus:ring-[#274258] border-[#CBD5E1]"
                  />
                  <div>
                    <span className="font-semibold text-[#1C2A39] block">Enable Email Performance Digests</span>
                    <span className="text-[11px] text-[#786E60]">Get periodic automated reports delivered to {user?.email}</span>
                  </div>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#E8E3D9] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-xs font-medium text-[#4A453E] hover:bg-[#F5F3EE] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2 bg-[#274258] text-white rounded-lg text-xs font-semibold hover:bg-[#1C3142] shadow-2xs transition-colors cursor-pointer disabled:opacity-50 flex items-center space-x-2"
                >
                  {editLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editLoading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#E8E3D9] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3D9] bg-[#FBF9F6]">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-[#274258] text-white">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-heading text-lg font-bold text-[#1C2A39]">Change Password</h3>
                  <p className="text-[11px] text-[#786E60]">Update your account security credentials</p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-[#786E60] hover:text-[#1C2A39] p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4 text-xs">
              {pwError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pwError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1 text-[#1C2A39]">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 pr-9 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#274258]"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#786E60] hover:text-[#1C2A39]"
                  >
                    {showCurrentPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#1C2A39]">New Password (minimum 8 characters)</label>
                <div className="relative">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 pr-9 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#274258]"
                    placeholder="Enter at least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#786E60] hover:text-[#1C2A39]"
                  >
                    {showNewPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#1C2A39]">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#274258]"
                  placeholder="Re-type new password"
                />
              </div>

              <div className="pt-3 border-t border-[#E8E3D9] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-xs font-medium text-[#4A453E] hover:bg-[#F5F3EE] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="px-5 py-2 bg-[#274258] text-white rounded-lg text-xs font-semibold hover:bg-[#1C3142] shadow-2xs transition-colors cursor-pointer disabled:opacity-50 flex items-center space-x-2"
                >
                  {pwLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{pwLoading ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
