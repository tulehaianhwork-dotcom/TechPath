'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Lock,
  Bell,
  Palette,
  Save,
  CheckCircle,
  AlertCircle,
  Camera,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type Tab = 'profile' | 'security' | 'notifications' | 'appearance';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-8 py-5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0 w-72">{children}</div>
    </div>
  );
}

function Alert({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-lg border p-3 text-sm mb-4',
        type === 'success'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-red-50 border-red-200 text-red-700'
      )}
    >
      {type === 'success' ? (
        <CheckCircle className="h-4 w-4 flex-shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
      )}
      {message}
    </div>
  );
}

function ProfileTab() {
  const { profile, updateProfile, user } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const { error } = await updateProfile({ full_name: fullName, bio, avatar_url: avatarUrl });
    setStatus(
      error
        ? { type: 'error', message: error }
        : { type: 'success', message: 'Profile updated successfully.' }
    );
    setLoading(false);
  };

  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <form onSubmit={handleSave}>
      {status && <Alert type={status.type} message={status.message} />}

      {/* Avatar */}
      <div className="flex items-center gap-5 py-5 border-b border-slate-100">
        <div className="relative">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="h-16 w-16 rounded-xl object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl gradient-brand text-white text-lg font-bold">
              {initials}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
            <Camera className="h-3 w-3" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">{displayName}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        <SettingRow label="Display Name" description="This is how you appear across TechPath.">
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </SettingRow>

        <SettingRow label="Avatar URL" description="Link to a profile image (HTTPS only).">
          <Input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
          />
        </SettingRow>

        <SettingRow label="Bio" description="A short description about yourself.">
          <Input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Senior engineer passionate about learning..."
          />
        </SettingRow>

        <SettingRow label="Email" description="Your sign-in email address.">
          <Input value={user?.email ?? ''} disabled className="bg-slate-50 text-slate-500" />
        </SettingRow>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading} className="gap-2">
          <Save className="h-4 w-4" />
          {loading ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}

function SecurityTab() {
  const { user, resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setLoading(true);
    setStatus(null);
    const { error } = await resetPassword(user.email);
    setStatus(
      error
        ? { type: 'error', message: error }
        : { type: 'success', message: 'Password reset email sent! Check your inbox.' }
    );
    setLoading(false);
  };

  return (
    <div className="space-y-0 divide-y divide-slate-100">
      {status && <Alert type={status.type} message={status.message} />}

      <SettingRow
        label="Password"
        description="We'll send you a secure link to reset your password."
      >
        <Button
          type="button"
          variant="outline"
          onClick={handlePasswordReset}
          disabled={loading}
          className="w-full gap-2"
        >
          <Lock className="h-4 w-4" />
          {loading ? 'Sending...' : 'Send reset link'}
        </Button>
      </SettingRow>

      <SettingRow label="Active Sessions" description="You are currently signed in on this device.">
        <div className="rounded-lg border border-slate-200 px-3 py-2.5">
          <p className="text-xs font-medium text-slate-900">Current browser</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Active now</p>
        </div>
      </SettingRow>

      <SettingRow label="Two-factor authentication" description="Add an extra layer of security (coming soon).">
        <Button variant="outline" disabled className="w-full opacity-60">
          Enable 2FA
        </Button>
      </SettingRow>
    </div>
  );
}

function NotificationsTab() {
  const notifications = [
    { id: 'streak', label: 'Streak reminders', description: 'Get reminded if your streak is at risk', enabled: true },
    { id: 'badges', label: 'Badge unlocks', description: 'Be notified when you earn a new badge', enabled: true },
    { id: 'leaderboard', label: 'Leaderboard updates', description: 'Weekly ranking notifications', enabled: false },
    { id: 'newcontent', label: 'New content', description: 'When new lessons or courses are added', enabled: true },
  ];

  return (
    <div className="space-y-0 divide-y divide-slate-100">
      <p className="text-xs text-slate-400 pb-4">
        Notification preferences are coming soon. These settings are placeholders.
      </p>
      {notifications.map((notif) => (
        <div key={notif.id} className="flex items-center justify-between py-5">
          <div>
            <p className="text-sm font-medium text-slate-900">{notif.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{notif.description}</p>
          </div>
          <div
            className={cn(
              'relative inline-flex h-5 w-9 items-center rounded-full transition-colors opacity-60 cursor-not-allowed',
              notif.enabled ? 'bg-accent' : 'bg-slate-200'
            )}
          >
            <span
              className={cn(
                'inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transform transition-transform',
                notif.enabled ? 'translate-x-4' : 'translate-x-0.5'
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function AppearanceTab() {
  const themes = [
    { id: 'light', label: 'Light', description: 'Clean and minimal' },
    { id: 'dark', label: 'Dark', description: 'Coming soon', disabled: true },
    { id: 'system', label: 'System', description: 'Coming soon', disabled: true },
  ];

  return (
    <div className="space-y-0 divide-y divide-slate-100">
      <SettingRow label="Theme" description="Choose your preferred color scheme.">
        <div className="space-y-2">
          {themes.map((theme) => (
            <label
              key={theme.id}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3 cursor-pointer',
                theme.id === 'light' ? 'border-accent bg-accent/5' : 'border-slate-200',
                theme.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <input
                type="radio"
                name="theme"
                value={theme.id}
                defaultChecked={theme.id === 'light'}
                disabled={theme.disabled}
                className="text-accent"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">{theme.label}</p>
                <p className="text-xs text-slate-500">{theme.description}</p>
              </div>
            </label>
          ))}
        </div>
      </SettingRow>

      <SettingRow label="Language" description="Interface language (more coming soon).">
        <div className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 bg-slate-50">
          English (US)
        </div>
      </SettingRow>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const tabContent: Record<Tab, React.ReactNode> = {
    profile: <ProfileTab />,
    security: <SecurityTab />,
    notifications: <NotificationsTab />,
    appearance: <AppearanceTab />,
  };

  return (
    <div className="max-w-3xl">
      <div className="animate-fade-in mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Tab list */}
        <nav className="w-44 flex-shrink-0">
          <div className="space-y-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-left transition-colors',
                  activeTab === tab.id
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <tab.icon className={cn('h-4 w-4', activeTab === tab.id ? 'text-accent' : 'text-slate-400')} />
                {tab.label}
              </button>
            ))}
          </div>

          <Separator className="my-4" />

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </nav>

        {/* Tab content */}
        <div className="flex-1 min-w-0 rounded-xl bg-white border border-slate-200 p-6 card-shadow">
          <h2 className="text-base font-semibold text-slate-900 mb-1">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          <p className="text-xs text-slate-500 mb-5 pb-4 border-b border-slate-100">
            {activeTab === 'profile' && 'Update your personal information and public profile.'}
            {activeTab === 'security' && 'Manage your password and account security.'}
            {activeTab === 'notifications' && 'Control what notifications you receive.'}
            {activeTab === 'appearance' && 'Customize how TechPath looks for you.'}
          </p>
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
}
