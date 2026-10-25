import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { 
  User, CheckCircle, Phone, Mail, MapPin, Lock, ShieldCheck,
  Building2, Image as ImageIcon, Upload, X, Palette, Store, Sparkles, Share2, AlertCircle
} from 'lucide-react';
import { dbService } from '../lib/dbService';
import { CircularProgress } from './LoadingSkeleton';
import { uploadFileToStorage } from '../lib/storageService';
import { authService } from '../lib/authService';

interface ProfileSettingsProps {
  adminEmail: string;
}

type SettingsTab = 'identity' | 'contact' | 'social' | 'branding' | 'security';

export default function ProfileSettings({ adminEmail }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('identity');

  // Store Details state
  const [storeName, setStoreName] = useState('FAИTIИE BD');
  const [companyName, setCompanyName] = useState('FAИTIИE BD');
  const [storeTagline, setStoreTagline] = useState('Skincare Solutions');
  const [topAnnouncementText, setTopAnnouncementText] = useState('WELCOME TO FAИTIИE BD');
  const [phone, setPhone] = useState('01303142147');
  const [email, setEmail] = useState('fantinebd@gmail.com');
  const [street, setStreet] = useState('Banasree,Dhaka');
  const [industry, setIndustry] = useState('Cosmetics & Skincare');

  // Social Media Links state
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com');
  const [youtubeUrl, setYoutubeUrl] = useState('https://youtube.com');
  const [twitterUrl, setTwitterUrl] = useState('https://twitter.com');
  const [tiktokUrl, setTiktokUrl] = useState('https://tiktok.com');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com');
  const [whatsappNumber, setWhatsappNumber] = useState('01303142147');

  // Store Identity & Branding state
  const [storeLogo, setStoreLogo] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0f766e');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Additional settings
  const [bearingRollLocation, setBearingRollLocation] = useState('Seoul');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [info, ecomSettings] = await Promise.all([
          dbService.getInstituteInfo(),
          dbService.getEcomSettings()
        ]);

        if (info) {
          if (info.name) setCompanyName(info.name);
          if (info.phone) setPhone(info.phone);
          if (info.email) setEmail(info.email);
          if (info.address) setStreet(info.address);
          if (info.industry) setIndustry(info.industry);
          if (info.bearingRollLocation) setBearingRollLocation(info.bearingRollLocation);
          if (info.description) setStoreTagline(info.description);
          if (info.logo) setStoreLogo(info.logo);
        }

        if (ecomSettings) {
          if (ecomSettings.storeName) setStoreName(ecomSettings.storeName);
          if (ecomSettings.companyName) setCompanyName(ecomSettings.companyName);
          if (ecomSettings.storeLogo) setStoreLogo(ecomSettings.storeLogo);
          if (ecomSettings.storeTagline) setStoreTagline(ecomSettings.storeTagline);
          if (ecomSettings.topAnnouncementText) setTopAnnouncementText(ecomSettings.topAnnouncementText);
          if (ecomSettings.contactEmail) setEmail(ecomSettings.contactEmail);
          if (ecomSettings.contactPhone) setPhone(ecomSettings.contactPhone);
          if (ecomSettings.storeAddress) setStreet(ecomSettings.storeAddress);
          if (ecomSettings.primaryColor) setPrimaryColor(ecomSettings.primaryColor);
          if (ecomSettings.maintenanceMode !== undefined) setMaintenanceMode(ecomSettings.maintenanceMode);
          if (ecomSettings.socialLinks) {
            if (ecomSettings.socialLinks.facebook !== undefined) setFacebookUrl(ecomSettings.socialLinks.facebook);
            if (ecomSettings.socialLinks.instagram !== undefined) setInstagramUrl(ecomSettings.socialLinks.instagram);
            if (ecomSettings.socialLinks.youtube !== undefined) setYoutubeUrl(ecomSettings.socialLinks.youtube);
            if (ecomSettings.socialLinks.twitter !== undefined) setTwitterUrl(ecomSettings.socialLinks.twitter);
            if (ecomSettings.socialLinks.tiktok !== undefined) setTiktokUrl(ecomSettings.socialLinks.tiktok);
            if (ecomSettings.socialLinks.linkedin !== undefined) setLinkedinUrl(ecomSettings.socialLinks.linkedin);
            if (ecomSettings.socialLinks.whatsapp !== undefined) setWhatsappNumber(ecomSettings.socialLinks.whatsapp);
          }
        }

        const currentUser = authService.getUser();
        if (currentUser) {
          setDisplayName(currentUser.email || '');
        }

      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingLogo(true);
      setErrorMsg('');
      const downloadUrl = await uploadFileToStorage(file, 'store_assets/logo');
      setStoreLogo(downloadUrl);
      setSuccessMsg('Logo uploaded successfully! Click "Save Changes" to apply.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Error uploading logo:', err);
      setErrorMsg('Logo upload failed: ' + (err.message || 'Please check file format.'));
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSaveSettings = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const oldInst = await dbService.getInstituteInfo() || {} as any;
      await dbService.saveInstituteInfo({
        ...oldInst,
        name: companyName || storeName,
        logo: storeLogo,
        description: storeTagline,
        phone,
        email,
        address: street,
        street,
        industry,
        bearingRollLocation
      });

      const oldEcom = await dbService.getEcomSettings() || {} as any;
      await dbService.saveEcomSettings({
        ...oldEcom,
        storeName,
        companyName,
        storeLogo,
        storeTagline,
        topAnnouncementText,
        contactEmail: email,
        contactPhone: phone,
        storeAddress: street,
        footerDescription: storeTagline,
        primaryColor,
        maintenanceMode,
        socialLinks: {
          facebook: facebookUrl,
          instagram: instagramUrl,
          youtube: youtubeUrl,
          twitter: twitterUrl,
          tiktok: tiktokUrl,
          linkedin: linkedinUrl,
          whatsapp: whatsappNumber
        }
      });

      // Dynamically update favicon based on store logo
      if (storeLogo) {
        let link = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = storeLogo;
      }

      setIsSaving(false);
      setSuccessMsg('Store settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Error saving profile settings:', err);
      setErrorMsg(err.message || 'Failed to save settings.');
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation password do not match.');
      return;
    }

    setIsChangingPass(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}`
        },
        body: JSON.stringify({ currentPassword: currentPassword || '', newPassword })
      });

      if (!res.ok) {
        let msg = 'Failed to change password';
        try {
          const data = await res.json();
          msg = data.message || msg;
        } catch {
          // fallback
        }
        throw new Error(msg);
      }

      setSuccessMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg('Password change failed: ' + (err.message || 'Please try again.'));
    } finally {
      setIsChangingPass(false);
    }
  };

  if (isLoading) {
    return (
      <CircularProgress label="Loading profile settings..." size="md" />
    );
  }

  const TABS = [
    { id: 'identity' as const, label: 'Store Identity', icon: Store, desc: 'Store name, company name & address' },
    { id: 'contact' as const, label: 'Contact & Notice', icon: Phone, desc: 'Phone, email & announcement' },
    { id: 'social' as const, label: 'Social Media', icon: Share2, desc: 'Social channels and WhatsApp' },
    { id: 'branding' as const, label: 'Store Logo', icon: ImageIcon, desc: 'Store logo & visual asset' },
    { id: 'security' as const, label: 'System & Security', icon: ShieldCheck, desc: 'Maintenance mode & password' },
  ];

  return (
    <div className="w-full space-y-6 font-sans">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Admin Profile & Store Settings</h2>
          <p className="text-slate-500 text-xs mt-1">Manage your store branding, footer info, contact details and admin credentials</p>
        </div>

        <button 
          type="button"
          onClick={() => handleSaveSettings()}
          disabled={isSaving}
          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
        >
          {isSaving ? 'Updating...' : 'Save Changes'}
        </button>
      </div>

      {/* Status Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
          <X className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Card Wrapper for Tabs & Settings */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 sm:px-6 pt-3 overflow-x-auto scrollbar-none bg-slate-50/50">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-teal-600 text-teal-700 bg-white rounded-t-xl shadow-2xs'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Settings Form */}
        <form onSubmit={handleSaveSettings} noValidate className="p-5 sm:p-7 space-y-6">

        {/* ============================================================
            TAB 1: STORE & FOOTER IDENTITY
            ============================================================ */}
        {activeTab === 'identity' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-base font-bold text-slate-900">Store & Footer Identity</h3>
              <p className="text-slate-500 text-xs mt-0.5">Primary store name, registered company entity, tagline, and address.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Store Name *</label>
                <div className="relative rounded-xl border border-slate-200 focus-within:border-teal-600 focus-within:ring-1 focus-within:ring-teal-600 bg-white transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Store className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-slate-900 focus:outline-none font-semibold"
                    placeholder="e.g. F A И T I И E"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Company Legal Name *</label>
                <div className="relative rounded-xl border border-slate-200 focus-within:border-teal-600 focus-within:ring-1 focus-within:ring-teal-600 bg-white transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Building2 className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-slate-900 focus:outline-none font-semibold"
                    placeholder="e.g. Brandini Co., Ltd."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Footer & Store Tagline</label>
              <div className="relative rounded-xl border border-slate-200 focus-within:border-teal-600 focus-within:ring-1 focus-within:ring-teal-600 bg-white transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 pt-3 pointer-events-none">
                  <Sparkles className="h-4.5 w-4.5 text-slate-400" />
                </div>
                <textarea
                  value={storeTagline}
                  onChange={(e) => setStoreTagline(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-slate-900 focus:outline-none min-h-[85px] resize-y"
                  placeholder="e.g. Brandini Co., Ltd. • Seoul, Republic of Korea. Clinical Hanbang Skincare & Botanical Whitening Solutions."
                />
              </div>
              <p className="text-[11px] text-slate-400">Displayed in website footer descriptions, social cards, and about previews.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Industry / Category</label>
                <div className="relative rounded-xl border border-slate-200 focus-within:border-teal-600 focus-within:ring-1 focus-within:ring-teal-600 bg-white transition-all">
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-transparent text-sm text-slate-900 focus:outline-none"
                    placeholder="e.g. Cosmetics & Skincare"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Origin / City</label>
                <div className="relative rounded-xl border border-slate-200 focus-within:border-teal-600 focus-within:ring-1 focus-within:ring-teal-600 bg-white transition-all">
                  <input
                    type="text"
                    value={bearingRollLocation}
                    onChange={(e) => setBearingRollLocation(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-transparent text-sm text-slate-900 focus:outline-none"
                    placeholder="e.g. Seoul, South Korea"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Registered Office Address</label>
              <div className="relative rounded-xl border border-slate-200 focus-within:border-teal-600 focus-within:ring-1 focus-within:ring-teal-600 bg-white transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="h-4.5 w-4.5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-slate-900 focus:outline-none"
                  placeholder="e.g. Banasree, Dhaka, Bangladesh"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: CONTACT DETAILS & TOP ANNOUNCEMENT
            ============================================================ */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-base font-bold text-slate-900">Contact Details & Notice</h3>
              <p className="text-slate-500 text-xs mt-0.5">Customer service phone, inquiry email, and the top marquee notice.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Customer Care Phone</label>
                <div className="relative rounded-xl border border-slate-200 focus-within:border-teal-600 focus-within:ring-1 focus-within:ring-teal-600 bg-white transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-slate-900 focus:outline-none font-mono"
                    placeholder="e.g. 01303142147"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Contact / Support Email</label>
                <div className="relative rounded-xl border border-slate-200 focus-within:border-teal-600 focus-within:ring-1 focus-within:ring-teal-600 bg-white transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-slate-900 focus:outline-none font-mono"
                    placeholder="e.g. fantinebd@gmail.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Top Bar Announcement Text</label>
              <div className="relative rounded-xl border border-slate-200 focus-within:border-teal-600 focus-within:ring-1 focus-within:ring-teal-600 bg-white transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Sparkles className="h-4.5 w-4.5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={topAnnouncementText}
                  onChange={(e) => setTopAnnouncementText(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-slate-900 focus:outline-none font-semibold uppercase tracking-wider"
                  placeholder="e.g. WELCOME TO FAИTIИE BD"
                />
              </div>
              <p className="text-[11px] text-slate-400">Appears at the very top header banner on all storefront pages.</p>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 3: SOCIAL MEDIA LINKS
            ============================================================ */}
        {activeTab === 'social' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-base font-bold text-slate-900">Social Media Channels</h3>
              <p className="text-slate-500 text-xs mt-0.5">These links will be embedded into the header announcement and footer social icons.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Instagram Profile URL</label>
                <input
                  type="text"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/fantine"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">YouTube Channel URL</label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/@fantine"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Twitter / X Profile URL</label>
                <input
                  type="text"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://twitter.com/fantine"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">TikTok Profile URL</label>
                <input
                  type="text"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://tiktok.com/@fantine"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Facebook Page URL</label>
                <input
                  type="text"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/fantine"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">WhatsApp Contact / Link</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="01303142147 or https://wa.me/8801303142147"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 4: STORE LOGO
            ============================================================ */}
        {activeTab === 'branding' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-base font-bold text-slate-900">Store Logo</h3>
              <p className="text-slate-500 text-xs mt-0.5">Upload your store logo or specify an image asset path.</p>
            </div>

            {/* Logo Section */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Store Logo</label>
              <div className="flex flex-wrap items-center gap-6">
                {storeLogo ? (
                  <div className="relative group">
                    <img 
                      src={storeLogo} 
                      alt="Store Logo" 
                      className="h-16 w-auto max-w-[14rem] object-contain bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setStoreLogo('')}
                      className="absolute -top-2 -right-2 p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Logo"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="h-14 w-36 bg-slate-100 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-[10px] text-slate-400 font-bold">
                    No Logo Uploaded
                  </div>
                )}

                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors border border-slate-200">
                  <Upload className="h-3.5 w-3.5 text-slate-600" />
                  <span>{isUploadingLogo ? 'Uploading...' : 'Upload Logo File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={isUploadingLogo}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-1.5 max-w-xl pt-2">
                <label className="text-[11px] font-semibold text-slate-500">Or Direct Logo Image URL / Path:</label>
                <input
                  type="text"
                  value={storeLogo}
                  onChange={(e) => setStoreLogo(e.target.value)}
                  placeholder="/logo_transparent.webp or https://example.com/logo.png"
                  className="block w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 5: SYSTEM & SECURITY
            ============================================================ */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-base font-bold text-slate-900">System Status & Security</h3>
              <p className="text-slate-500 text-xs mt-0.5">Maintenance mode switch and administrator password management.</p>
            </div>

            {/* Maintenance Mode */}
            <div className="flex items-center justify-between p-4 bg-slate-50/80 border border-slate-200 rounded-2xl">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Maintenance Mode
                </h4>
                <p className="text-[11px] text-slate-500">
                  When enabled, visitors will see a maintenance screen instead of the store catalog.
                </p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="maintenance_toggle"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="sr-only peer"
                />
                <label htmlFor="maintenance_toggle" className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600 cursor-pointer" />
              </div>
            </div>

            {/* Change Admin Password Section */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-teal-600" />
                  Change Administrator Password
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Signed in as: <span className="font-mono font-semibold text-slate-800">{adminEmail || displayName || 'Admin'}</span></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={isChangingPass || !newPassword}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all disabled:opacity-40 cursor-pointer"
                >
                  {isChangingPass ? 'Changing...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Action Button */}
        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button 
            type="submit"
            disabled={isSaving}
            className="px-8 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isSaving ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  </div>
);
}
