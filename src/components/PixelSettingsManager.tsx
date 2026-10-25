import React, { useState, useEffect } from 'react';
import { EcomSettings } from '../types';
import { dbService } from '../lib/dbService';
import { CircularProgress } from './LoadingSkeleton';
import { Check, Code, Save, Eye, ShieldCheck, RefreshCw } from 'lucide-react';

export default function PixelSettingsManager() {
  const [settings, setSettings] = useState<EcomSettings>({
    gtmId: '',
    deliveryChargeInsideDhaka: 60,
    deliveryChargeOutsideDhaka: 120,
    bkashNumber: '',
    nagadNumber: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await dbService.getEcomSettings();
        if (data) {
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to load pixel settings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await dbService.saveEcomSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('There was a problem saving pixel settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <CircularProgress label="Loading GTM Settings..." size="md" />
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 font-sans w-full">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Code className="h-5 w-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Google Tag Manager & Pixel
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure Google Tag Manager (GTM), Google Analytics 4, and conversion ad tracking
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </span>
            ) : saveSuccess ? (
              <>
                <Check className="h-4 w-4 mr-1.5 text-emerald-300" />
                Saved successfully!
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1.5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Google Tag Manager & Web Analytics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">GTM Container Configuration</h3>
              <p className="text-[11px] text-slate-500">Google Analytics 4, Meta Pixel, and Google Ads Server-side & Client-side Tracking</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                GTM Container ID *
              </label>
              <input
                type="text"
                placeholder="e.g. GTM-XXXXXXX"
                value={settings.gtmId || ''}
                onChange={(e) => setSettings({ ...settings, gtmId: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none font-mono text-slate-900 font-semibold"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                All tracking tags (Meta Pixel, Google Analytics 4, TikTok Pixel, Google Ads) configured inside your GTM container will automatically load on all pages.
              </p>
            </div>

            <div className="p-4 bg-teal-50/60 border border-teal-100 rounded-xl space-y-2 text-teal-950">
              <div className="flex items-center space-x-2 font-bold text-xs">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <span>Automatic E-Commerce DataLayer Events Fired:</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px] text-teal-900 font-medium">
                <li className="bg-white/80 p-2 rounded-lg border border-teal-200/50">
                  <span className="font-mono font-bold text-teal-700">view_item</span>
                  <div className="text-[10px] text-slate-600 mt-0.5">Fires on product view & detail modal</div>
                </li>
                <li className="bg-white/80 p-2 rounded-lg border border-teal-200/50">
                  <span className="font-mono font-bold text-teal-700">begin_checkout</span>
                  <div className="text-[10px] text-slate-600 mt-0.5">Fires when visiting checkout drawer or page</div>
                </li>
                <li className="bg-white/80 p-2 rounded-lg border border-teal-200/50">
                  <span className="font-mono font-bold text-teal-700">purchase</span>
                  <div className="text-[10px] text-slate-600 mt-0.5">Fires with full item & total values on success</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
