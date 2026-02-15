import { useState } from 'react';
import {
  ArrowLeft,
  Settings,
  Building2,
  Users,
  Wallet,
  Shield,
  Edit,
  Check,
  X,
  Plus,
  MoreVertical,
  Trash2,
  Crown,
  Eye,
  DollarSign,
  Clock,
  Globe,
  Calendar,
  Mail,
  Key,
  Star,
  AlertCircle,
  CheckCircle2,
  Activity,
  Lock,
  Smartphone,
  UserPlus,
  Copy,
  ExternalLink,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsPageProps {
  isDark: boolean;
  walletAddress: string;
  onBack: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  role: 'Admin' | 'Finance' | 'Viewer';
  status: 'Active' | 'Pending' | 'Inactive';
  joinedDate: string;
  avatar?: string;
}

interface ConnectedWallet {
  id: string;
  address: string;
  label: string;
  isDefault: boolean;
  balance: string;
  token: string;
  lastUsed: string;
}

export default function SettingsPage({ isDark, walletAddress, onBack }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'organization' | 'team' | 'wallets' | 'permissions' | 'security'>('organization');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [editingOrgName, setEditingOrgName] = useState(false);
  const [orgName, setOrgName] = useState('Freelance Studio Co.');
  const [tempOrgName, setTempOrgName] = useState(orgName);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Finance' | 'Viewer'>('Viewer');
  const [inviteWallet, setInviteWallet] = useState('');

  // Add wallet form state
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [newWalletLabel, setNewWalletLabel] = useState('');

  // Styles
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-500';

  const glassCard = isDark
    ? 'bg-gradient-to-br from-[#1a1a24]/90 to-[#16161f]/90 backdrop-blur-2xl border border-white/10'
    : 'bg-white/90 backdrop-blur-2xl border border-gray-200/50';

  const inputStyles = isDark
    ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
    : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400';

  // Mock Data
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@freelancestudio.co',
      walletAddress: '0x742d...9e3a',
      role: 'Admin',
      status: 'Active',
      joinedDate: 'Jan 15, 2026'
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      email: 'marcus@freelancestudio.co',
      walletAddress: '0x8f4c...2b1d',
      role: 'Finance',
      status: 'Active',
      joinedDate: 'Jan 20, 2026'
    },
    {
      id: '3',
      name: 'Priya Sharma',
      email: 'priya@freelancestudio.co',
      walletAddress: '0x3a7e...5c8f',
      role: 'Viewer',
      status: 'Active',
      joinedDate: 'Feb 01, 2026'
    },
    {
      id: '4',
      name: 'Alex Kim',
      email: 'alex@freelancestudio.co',
      walletAddress: 'Pending',
      role: 'Finance',
      status: 'Pending',
      joinedDate: 'Feb 10, 2026'
    }
  ];

  const connectedWallets: ConnectedWallet[] = [
    {
      id: '1',
      address: walletAddress,
      label: 'Primary Treasury',
      isDefault: true,
      balance: '24,850.00',
      token: 'USDC',
      lastUsed: '2 hours ago'
    },
    {
      id: '2',
      address: '0x8f4c2b1d9e3a7c5f6b8d2e4a1c9f7b3d5e8a6c2b',
      label: 'Operations Wallet',
      isDefault: false,
      balance: '8,420.50',
      token: 'USDC',
      lastUsed: '1 day ago'
    },
    {
      id: '3',
      address: '0x3a7e5c8f2b4d6e1a9c7f3b5d8e2a4c6f1b9d7e3a',
      label: 'Client Payments',
      isDefault: false,
      balance: '15,230.75',
      token: 'USDT',
      lastUsed: '3 days ago'
    }
  ];

  const permissions = [
    { feature: 'Create Invoice', admin: true, finance: true, viewer: false },
    { feature: 'Withdraw Funds', admin: true, finance: true, viewer: false },
    { feature: 'View Reports', admin: true, finance: true, viewer: true },
    { feature: 'Manage Members', admin: true, finance: false, viewer: false },
    { feature: 'Edit Settings', admin: true, finance: false, viewer: false },
    { feature: 'API Access', admin: true, finance: true, viewer: false }
  ];

  const tabs = [
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'wallets', label: 'Wallets', icon: Wallet },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock }
  ] as const;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return isDark
          ? 'bg-[#FF1CF7]/10 text-[#FF1CF7] border-[#FF1CF7]/20'
          : 'bg-pink-50 text-pink-600 border-pink-200';
      case 'Finance':
        return isDark
          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
          : 'bg-cyan-50 text-cyan-600 border-cyan-200';
      case 'Viewer':
        return isDark
          ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
          : 'bg-gray-100 text-gray-600 border-gray-300';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return isDark
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Pending':
        return isDark
          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
          : 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'Inactive':
        return isDark
          ? 'bg-red-500/10 text-red-400 border-red-500/20'
          : 'bg-red-50 text-red-600 border-red-200';
      default:
        return '';
    }
  };

  const handleSaveOrgName = () => {
    setOrgName(tempOrgName);
    setEditingOrgName(false);
  };

  const handleCancelOrgName = () => {
    setTempOrgName(orgName);
    setEditingOrgName(false);
  };

  const handleInviteMember = () => {
    // Handle invite logic
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteRole('Viewer');
    setInviteWallet('');
  };

  const handleAddWallet = () => {
    // Handle add wallet logic
    setShowAddWalletModal(false);
    setNewWalletAddress('');
    setNewWalletLabel('');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0d0818]' : 'bg-gray-50'}`}>
      <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
        {/* Header */}
        <div className="mb-8">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className={`flex items-center gap-2 ${textSecondary} hover:${textPrimary} transition-colors mb-6 font-semibold`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </motion.button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2 tracking-tight`}>
                Settings
              </h1>
              <p className={`text-base ${textSecondary}`}>
                Manage your organization, team, and security settings
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-5 py-3 rounded-xl ${glassCard} flex items-center gap-2`}>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className={`text-sm font-semibold ${textSecondary}`}>
                  All Systems Operational
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${glassCard} rounded-2xl p-2 shadow-xl mb-8`}
        >
          <div className="flex items-center gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] text-white shadow-lg shadow-[#FF1CF7]/30'
                    : isDark
                    ? 'text-gray-400 hover:bg-white/5'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Organization Settings */}
        {activeTab === 'organization' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Overview Card */}
            <div className={`${glassCard} rounded-2xl p-8 shadow-xl`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>
                    Organization Settings
                  </h2>
                  <p className={`text-sm ${textMuted}`}>
                    Organization-level settings apply to all team members
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="space-y-6">
                {/* Organization Name */}
                <div>
                  <label className={`block text-sm font-bold ${textSecondary} mb-2`}>
                    Organization Name
                  </label>
                  <div className="flex items-center gap-3">
                    {editingOrgName ? (
                      <>
                        <input
                          type="text"
                          value={tempOrgName}
                          onChange={(e) => setTempOrgName(e.target.value)}
                          className={`flex-1 px-4 py-3 rounded-xl ${inputStyles} focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all font-semibold`}
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSaveOrgName}
                          className="p-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all"
                        >
                          <Check className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancelOrgName}
                          className={`p-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <div className={`flex-1 px-4 py-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} font-bold ${textPrimary}`}>
                          {orgName}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditingOrgName(true)}
                          className={`p-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-all ${textPrimary}`}
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>

                {/* Organization ID */}
                <div>
                  <label className={`block text-sm font-bold ${textSecondary} mb-2`}>
                    Organization ID
                  </label>
                  <div className="flex items-center gap-3">
                    <div className={`flex-1 px-4 py-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} font-mono text-sm ${textPrimary}`}>
                      ORG-FL-2026-8492
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-all ${textPrimary}`}
                    >
                      <Copy className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Primary Wallet Address */}
                <div>
                  <label className={`block text-sm font-bold ${textSecondary} mb-2`}>
                    Primary Wallet Address
                  </label>
                  <div className="flex items-center gap-3">
                    <div className={`flex-1 px-4 py-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} font-mono text-sm ${textPrimary}`}>
                      {walletAddress}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-all ${textPrimary}`}
                    >
                      <Copy className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Row: Platform Fee & Timezone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-bold ${textSecondary} mb-2`}>
                      Default Platform Fee (%)
                    </label>
                    <div className="relative">
                      <DollarSign className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted}`} />
                      <input
                        type="text"
                        value="2.5"
                        readOnly
                        className={`w-full pl-12 pr-4 py-3 rounded-xl ${inputStyles} font-semibold`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-bold ${textSecondary} mb-2`}>
                      Timezone
                    </label>
                    <div className="relative">
                      <Globe className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted}`} />
                      <input
                        type="text"
                        value="Asia/Singapore (UTC+8)"
                        readOnly
                        className={`w-full pl-12 pr-4 py-3 rounded-xl ${inputStyles} font-semibold`}
                      />
                    </div>
                  </div>
                </div>

                {/* Created Date */}
                <div>
                  <label className={`block text-sm font-bold ${textSecondary} mb-2`}>
                    Created Date
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted}`} />
                    <input
                      type="text"
                      value="January 15, 2026"
                      readOnly
                      className={`w-full pl-12 pr-4 py-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} ${textPrimary} font-semibold cursor-not-allowed`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Members', value: '4', icon: Users, gradient: 'from-[#FF1CF7] to-[#B967FF]' },
                { label: 'Active Wallets', value: '3', icon: Wallet, gradient: 'from-cyan-400 to-blue-400' },
                { label: 'Total Volume', value: '$284K', icon: TrendingUp, gradient: 'from-emerald-400 to-cyan-400' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`${glassCard} rounded-2xl p-6 shadow-xl`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className={`text-sm font-semibold ${textMuted} mb-2`}>
                    {stat.label}
                  </h3>
                  <p className={`text-3xl font-bold ${textPrimary}`}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Team Members */}
        {activeTab === 'team' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${glassCard} rounded-2xl shadow-2xl overflow-hidden`}
          >
            <div className="p-8 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>
                    Team Members
                  </h2>
                  <p className={`text-sm ${textMuted}`}>
                    Manage access and permissions for your team
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowInviteModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite Member
                </motion.button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDark ? 'bg-white/5' : 'bg-gray-50/80'} border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <tr>
                    <th className={`text-left py-5 px-8 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                      Name
                    </th>
                    <th className={`text-left py-5 px-8 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                      Email
                    </th>
                    <th className={`text-left py-5 px-8 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                      Wallet Address
                    </th>
                    <th className={`text-left py-5 px-8 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                      Role
                    </th>
                    <th className={`text-left py-5 px-8 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                      Status
                    </th>
                    <th className={`text-left py-5 px-8 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                      Joined
                    </th>
                    <th className={`text-left py-5 px-8 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member, index) => (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'} hover:${isDark ? 'bg-white/5' : 'bg-gray-50'} transition-colors`}
                    >
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] flex items-center justify-center font-bold text-white">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className={`font-bold ${textPrimary}`}>
                            {member.name}
                          </span>
                        </div>
                      </td>
                      <td className={`py-5 px-8 text-sm ${textSecondary}`}>
                        {member.email}
                      </td>
                      <td className={`py-5 px-8 font-mono text-sm ${textSecondary}`}>
                        {member.walletAddress}
                      </td>
                      <td className="py-5 px-8">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${getRoleBadgeColor(member.role)}`}>
                          {member.role === 'Admin' && <Crown className="w-3.5 h-3.5" />}
                          {member.role === 'Finance' && <DollarSign className="w-3.5 h-3.5" />}
                          {member.role === 'Viewer' && <Eye className="w-3.5 h-3.5" />}
                          {member.role}
                        </span>
                      </td>
                      <td className="py-5 px-8">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className={`py-5 px-8 text-sm ${textSecondary}`}>
                        {member.joinedDate}
                      </td>
                      <td className="py-5 px-8">
                        <div className="relative">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setActiveActionMenu(activeActionMenu === member.id ? null : member.id)}
                            className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
                          >
                            <MoreVertical className={`w-5 h-5 ${textSecondary}`} />
                          </motion.button>

                          <AnimatePresence>
                            {activeActionMenu === member.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className={`absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden shadow-2xl ${glassCard} z-50`}
                              >
                                <button className={`w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-3 ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-50'} transition-colors`}>
                                  <Edit className="w-4 h-4" />
                                  Edit Role
                                </button>
                                <button className={`w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-3 ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-50'} transition-colors`}>
                                  <Mail className="w-4 h-4" />
                                  Resend Invite
                                </button>
                                <button className={`w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-colors border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                                  <Trash2 className="w-4 h-4" />
                                  Remove
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Wallets */}
        {activeTab === 'wallets' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${glassCard} rounded-2xl shadow-2xl overflow-hidden`}
          >
            <div className="p-8 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>
                    Connected Wallets
                  </h2>
                  <p className={`text-sm ${textMuted}`}>
                    Manage organization wallets and payment destinations
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddWalletModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Wallet
                </motion.button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDark ? 'bg-white/5' : 'bg-gray-50/80'} border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <tr>
                    <th className={`text-left py-5 px-8 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                      Wallet Address
                    </th>
                    <th className={`text-left py-5 px-8 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                      Label
                    </th>
                    <th className={`text-left py-5 px-8 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                      Balance
                    </th>
                    <th className={`text-left py-5 px-8 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                      Last Used
                    </th>
                    <th className={`text-left py-5 px-8 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {connectedWallets.map((wallet, index) => (
                    <motion.tr
                      key={wallet.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'} hover:${isDark ? 'bg-white/5' : 'bg-gray-50'} transition-colors`}
                    >
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-3">
                          <span className={`font-mono text-sm ${textPrimary}`}>
                            {wallet.address}
                          </span>
                          <button className={`p-1 rounded ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${textPrimary}`}>
                            {wallet.label}
                          </span>
                          {wallet.isDefault && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] text-white">
                              <Star className="w-3 h-3" />
                              Default
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <div>
                          <p className={`font-bold ${textPrimary}`}>
                            ${wallet.balance}
                          </p>
                          <p className={`text-xs ${textMuted}`}>
                            {wallet.token}
                          </p>
                        </div>
                      </td>
                      <td className={`py-5 px-8 text-sm ${textSecondary}`}>
                        {wallet.lastUsed}
                      </td>
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
                          >
                            <ExternalLink className={`w-4 h-4 ${textSecondary}`} />
                          </motion.button>
                          {!wallet.isDefault && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
                            >
                              <Star className={`w-4 h-4 ${textSecondary}`} />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Permissions */}
        {activeTab === 'permissions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${glassCard} rounded-2xl shadow-2xl overflow-hidden`}
          >
            <div className="p-8 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>
                    Permissions Matrix
                  </h2>
                  <p className={`text-sm ${textMuted}`}>
                    Role-based access control for platform features
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className={`text-left py-4 px-6 text-sm font-bold ${textPrimary}`}>
                        Feature
                      </th>
                      <th className={`text-center py-4 px-6 text-sm font-bold ${textPrimary}`}>
                        <div className="flex flex-col items-center gap-2">
                          <Crown className="w-5 h-5 text-[#FF1CF7]" />
                          Admin
                        </div>
                      </th>
                      <th className={`text-center py-4 px-6 text-sm font-bold ${textPrimary}`}>
                        <div className="flex flex-col items-center gap-2">
                          <DollarSign className="w-5 h-5 text-cyan-400" />
                          Finance
                        </div>
                      </th>
                      <th className={`text-center py-4 px-6 text-sm font-bold ${textPrimary}`}>
                        <div className="flex flex-col items-center gap-2">
                          <Eye className="w-5 h-5 text-gray-400" />
                          Viewer
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((permission, index) => (
                      <motion.tr
                        key={permission.feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}
                      >
                        <td className={`py-5 px-6 font-semibold ${textPrimary}`}>
                          {permission.feature}
                        </td>
                        <td className="py-5 px-6 text-center">
                          {permission.admin ? (
                            <div className="flex justify-center">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                                <X className="w-5 h-5 text-red-400" />
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-5 px-6 text-center">
                          {permission.finance ? (
                            <div className="flex justify-center">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                                <X className="w-5 h-5 text-red-400" />
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-5 px-6 text-center">
                          {permission.viewer ? (
                            <div className="flex justify-center">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                                <X className="w-5 h-5 text-red-400" />
                              </div>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'} border ${isDark ? 'border-cyan-500/20' : 'border-cyan-200'}`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'} mt-0.5`} />
                  <div>
                    <p className={`text-sm font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'} mb-1`}>
                      Permission Guidelines
                    </p>
                    <p className={`text-xs ${isDark ? 'text-cyan-400/80' : 'text-cyan-600/80'}`}>
                      Admin role has full access. Finance can manage invoices and withdrawals. Viewer has read-only access to reports and analytics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Security Overview */}
            <div className={`${glassCard} rounded-2xl p-8 shadow-xl`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>
                    Security & Access
                  </h2>
                  <p className={`text-sm ${textMuted}`}>
                    Manage security settings and access controls
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                {/* 2FA */}
                <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-bold ${textPrimary} mb-1`}>
                          Two-Factor Authentication
                        </h3>
                        <p className={`text-sm ${textMuted}`}>
                          Add an extra layer of security to your account
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-lg text-xs font-bold ${isDark ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-yellow-50 text-yellow-600 border border-yellow-200'}`}>
                      Coming Soon
                    </span>
                  </div>
                </div>

                {/* Multi-sig */}
                <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center">
                        <Key className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-bold ${textPrimary} mb-1`}>
                          Multi-Signature Withdrawals
                        </h3>
                        <p className={`text-sm ${textMuted}`}>
                          Require multiple approvals for large transactions
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-lg text-xs font-bold ${isDark ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' : 'bg-gray-100 text-gray-600 border border-gray-300'}`}>
                      Roadmap
                    </span>
                  </div>
                </div>

                {/* Activity Logs */}
                <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-bold ${textPrimary} mb-1`}>
                          Activity Logs
                        </h3>
                        <p className={`text-sm ${textMuted}`}>
                          View all account activities and changes
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl font-bold text-sm ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} transition-all`}
                    >
                      View Logs
                    </motion.button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-bold ${textPrimary} mb-1`}>
                          Active Sessions
                        </h3>
                        <p className={`text-sm ${textMuted}`}>
                          1 active session • Last activity: 5 minutes ago
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl font-bold text-sm text-red-400 hover:bg-red-500/10 transition-all border border-red-500/20"
                    >
                      Revoke All
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Best Practices */}
            <div className={`${glassCard} rounded-2xl p-8 shadow-xl`}>
              <h3 className={`text-xl font-bold ${textPrimary} mb-6`}>
                Security Best Practices
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Shield, text: 'Use strong, unique passwords', color: 'from-emerald-400 to-cyan-400' },
                  { icon: Lock, text: 'Enable 2FA when available', color: 'from-[#FF1CF7] to-[#B967FF]' },
                  { icon: Eye, text: 'Review activity logs regularly', color: 'from-cyan-400 to-blue-400' },
                  { icon: AlertCircle, text: 'Never share wallet keys', color: 'from-yellow-400 to-orange-400' }
                ].map((practice, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${practice.color} flex items-center justify-center`}>
                      <practice.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-sm font-semibold ${textSecondary}`}>
                      {practice.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Invite Member Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className={`${glassCard} rounded-3xl p-8 shadow-2xl max-w-md w-full`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-2xl font-bold ${textPrimary}`}>
                    Invite Team Member
                  </h3>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-all`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-bold ${textSecondary} mb-2`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="member@example.com"
                      className={`w-full px-4 py-3 rounded-xl ${inputStyles} focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-bold ${textSecondary} mb-2`}>
                      Role *
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                      className={`w-full px-4 py-3 rounded-xl ${inputStyles} focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all font-semibold`}
                    >
                      <option value="Viewer">Viewer</option>
                      <option value="Finance">Finance</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-bold ${textSecondary} mb-2`}>
                      Wallet Address (Optional)
                    </label>
                    <input
                      type="text"
                      value={inviteWallet}
                      onChange={(e) => setInviteWallet(e.target.value)}
                      placeholder="0x..."
                      className={`w-full px-4 py-3 rounded-xl ${inputStyles} focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all font-mono`}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleInviteMember}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all"
                    >
                      Send Invitation
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowInviteModal(false)}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Wallet Modal */}
      <AnimatePresence>
        {showAddWalletModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddWalletModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className={`${glassCard} rounded-3xl p-8 shadow-2xl max-w-md w-full`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-2xl font-bold ${textPrimary}`}>
                    Add Wallet
                  </h3>
                  <button
                    onClick={() => setShowAddWalletModal(false)}
                    className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-all`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-bold ${textSecondary} mb-2`}>
                      Wallet Address *
                    </label>
                    <input
                      type="text"
                      value={newWalletAddress}
                      onChange={(e) => setNewWalletAddress(e.target.value)}
                      placeholder="0x..."
                      className={`w-full px-4 py-3 rounded-xl ${inputStyles} focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all font-mono`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-bold ${textSecondary} mb-2`}>
                      Label *
                    </label>
                    <input
                      type="text"
                      value={newWalletLabel}
                      onChange={(e) => setNewWalletLabel(e.target.value)}
                      placeholder="e.g., Treasury Wallet"
                      className={`w-full px-4 py-3 rounded-xl ${inputStyles} focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all font-semibold`}
                    />
                  </div>

                  <div className={`p-4 rounded-xl ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'} border ${isDark ? 'border-cyan-500/20' : 'border-cyan-200'}`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'} mt-0.5`} />
                      <p className={`text-xs ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        Make sure you have access to this wallet. You'll need to verify ownership before it can be used for withdrawals.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddWallet}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all"
                    >
                      Add Wallet
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddWalletModal(false)}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
