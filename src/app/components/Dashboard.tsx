import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useModeAnimation } from 'react-theme-switch-animation';
import { 
  LayoutDashboard, 
  FileText, 
  FilePlus, 
  Wallet, 
  Settings, 
  Code, 
  TrendingUp,
  TrendingDown,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronDown,
  MoreHorizontal,
  Grid,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  DollarSign,
  Send,
  Link as LinkIcon,
  BarChart3,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  Building2,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Calendar,
  Check,
  Droplet,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import svgPaths from '../../imports/svg-1rf4lkm0ba';
import CreateInvoice from './CreateInvoice';
import WithdrawPage from './WithdrawPage';
import InvoicesPage from './InvoicesPage';
import SettingsPage from './SettingsPage';
import ApiPortalPage from './ApiPortalPage';
import AnalyticsPage from './AnalyticsPage';
import ActivityPage from './ActivityPage';
import FaucetPage from './FaucetPage';
import InvoiceDetailModal from './InvoiceDetailModal';

interface DashboardProps {
  isDark: boolean;
  toggleTheme: () => void;
  walletAddress: string;
  onDisconnect: () => void;
}

// Looper Background from landing page - blurred version
function LooperBg({ isDark }: { isDark: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isDark ? 0.15 : 0.25, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2295.766px] h-[2037.845px] pointer-events-none scale-50 lg:scale-75 transition-all duration-1000 blur-xl ${isDark ? 'opacity-15' : 'opacity-25'}`}
    >
      <svg 
        className="block size-full" 
        fill="none" 
        preserveAspectRatio="none" 
        viewBox="0 0 2295.77 2037.85"
      >
        <g>
          <path d={svgPaths.p161a3400} opacity="0" stroke="url(#dashpaint0)" strokeWidth="4" />
          <path d={svgPaths.p18534700} opacity="0.0144928" stroke="url(#dashpaint1)" strokeWidth="4" />
          <path d={svgPaths.pd4fde80} opacity="0.0289855" stroke="url(#dashpaint2)" strokeWidth="4" />
          <path d={svgPaths.p19160880} opacity="0.0434783" stroke="url(#dashpaint3)" strokeWidth="4" />
          <path d={svgPaths.p240c4c00} opacity="0.057971" stroke="url(#dashpaint4)" strokeWidth="4" />
          <path d={svgPaths.p31123ef0} opacity="0.0724638" stroke="url(#dashpaint5)" strokeWidth="4" />
          <path d={svgPaths.p39eede00} opacity="0.0869565" stroke="url(#dashpaint6)" strokeWidth="4" />
          <path d={svgPaths.p15758e80} opacity="0.101449" stroke="url(#dashpaint7)" strokeWidth="4" />
          <path d={svgPaths.p32905b00} opacity="0.115942" stroke="url(#dashpaint8)" strokeWidth="4" />
          <path d={svgPaths.p29f7ce80} opacity="0.130435" stroke="url(#dashpaint9)" strokeWidth="4" />
          <path d={svgPaths.p2881440} opacity="0.144928" stroke="url(#dashpaint10)" strokeWidth="4" />
          <path d={svgPaths.p163e4fc0} opacity="0.15942" stroke="url(#dashpaint11)" strokeWidth="4" />
          <path d={svgPaths.pe7ebe80} opacity="0.173913" stroke="url(#dashpaint12)" strokeWidth="4" />
          <path d={svgPaths.p2bed900} opacity="0.188406" stroke="url(#dashpaint13)" strokeWidth="4" />
          <path d={svgPaths.p342c4500} opacity="0.202899" stroke="url(#dashpaint14)" strokeWidth="4" />
          <path d={svgPaths.p20376bc0} opacity="0.217391" stroke="url(#dashpaint15)" strokeWidth="4" />
          <path d={svgPaths.pc1e83c0} opacity="0.231884" stroke="url(#dashpaint16)" strokeWidth="4" />
          <path d={svgPaths.p33cbdf80} opacity="0.246377" stroke="url(#dashpaint17)" strokeWidth="4" />
          <path d={svgPaths.pcf0800} opacity="0.26087" stroke="url(#dashpaint18)" strokeWidth="4" />
          <path d={svgPaths.p13201c00} opacity="0.275362" stroke="url(#dashpaint19)" strokeWidth="4" />
          <path d={svgPaths.p337bc600} opacity="0.289855" stroke="url(#dashpaint20)" strokeWidth="4" />
          <path d={svgPaths.p2081a800} opacity="0.304348" stroke="url(#dashpaint21)" strokeWidth="4" />
          <path d={svgPaths.p13abfd00} opacity="0.318841" stroke="url(#dashpaint22)" strokeWidth="4" />
          <path d={svgPaths.p17402d80} opacity="0.333333" stroke="url(#dashpaint23)" strokeWidth="4" />
          <path d={svgPaths.p39bc4c00} opacity="0.347826" stroke="url(#dashpaint24)" strokeWidth="4" />
          <path d={svgPaths.p27876900} opacity="0.362319" stroke="url(#dashpaint25)" strokeWidth="4" />
          <path d={svgPaths.p3ed8d200} opacity="0.376812" stroke="url(#dashpaint26)" strokeWidth="4" />
          <path d={svgPaths.p39e33200} opacity="0.391304" stroke="url(#dashpaint27)" strokeWidth="4" />
          <path d={svgPaths.p38246c80} opacity="0.405797" stroke="url(#dashpaint28)" strokeWidth="4" />
          <path d={svgPaths.p2c59b700} opacity="0.42029" stroke="url(#dashpaint29)" strokeWidth="4" />
          <path d={svgPaths.pd2c9b80} opacity="0.434783" stroke="url(#dashpaint30)" strokeWidth="4" />
          <path d={svgPaths.p764a880} opacity="0.449275" stroke="url(#dashpaint31)" strokeWidth="4" />
          <path d={svgPaths.p1edfa480} opacity="0.463768" stroke="url(#dashpaint32)" strokeWidth="4" />
          <path d={svgPaths.p341e9c0} opacity="0.478261" stroke="url(#dashpaint33)" strokeWidth="4" />
          <path d={svgPaths.p3fc2f280} opacity="0.492754" stroke="url(#dashpaint34)" strokeWidth="4" />
          <path d={svgPaths.p132008f0} opacity="0.507246" stroke="url(#dashpaint35)" strokeWidth="4" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint0" x1="1965.81" x2="1039.89" y1="1728.06" y2="463.22">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint1" x1="1914.98" x2="1062.42" y1="1748.96" y2="416.152">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint2" x1="1863.98" x2="1093.65" y1="1767.47" y2="370.68">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint3" x1="1812.93" x2="1133.64" y1="1783.61" y2="328.475">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint4" x1="1761.9" x2="1182.1" y1="1797.39" y2="291.319">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint5" x1="1710.98" x2="1238.3" y1="1808.85" y2="261.014">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint6" x1="1660.27" x2="1301.02" y1="1818.01" y2="239.252">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint7" x1="1609.85" x2="1368.63" y1="1824.91" y2="227.465">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint8" x1="1559.8" x2="1439.11" y1="1829.6" y2="226.698">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint9" x1="1510.21" x2="1510.21" y1="1832.12" y2="237.486">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint10" x1="1461.14" x2="1579.56" y1="1832.54" y2="259.796">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint11" x1="1412.69" x2="1644.92" y1="1830.91" y2="293.015">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint12" x1="1364.95" x2="1704.82" y1="1827.37" y2="337.159">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint13" x1="1318.03" x2="1757.67" y1="1822.01" y2="391.665">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint14" x1="1272.01" x2="1802.07" y1="1814.97" y2="455.767">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint15" x1="1227.01" x2="1837.52" y1="1806.36" y2="528.629">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint16" x1="1183.14" x2="1863.56" y1="1796.31" y2="609.273">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint17" x1="1140.5" x2="1879.81" y1="1784.94" y2="697.623">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint18" x1="1099.18" x2="1885.84" y1="1772.38" y2="792.458">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint19" x1="1059.28" x2="1881.21" y1="1758.75" y2="893.463">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint20" x1="1020.87" x2="1865.55" y1="1744.16" y2="1000.17">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint21" x1="984.04" x2="1838.5" y1="1728.74" y2="1112.14">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint22" x1="948.868" x2="1799.85" y1="1712.6" y2="1228.97">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint23" x1="915.43" x2="1749.41" y1="1695.87" y2="1350.28">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint24" x1="883.796" x2="1687.08" y1="1678.66" y2="1475.72">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint25" x1="854.02" x2="1612.81" y1="1661.09" y2="1604.97">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint26" x1="826.149" x2="1526.65" y1="1643.25" y2="1737.77">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint27" x1="800.218" x2="1428.69" y1="1625.26" y2="1873.83">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint28" x1="776.264" x2="1319.16" y1="1607.21" y2="2012.83">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint29" x1="754.314" x2="1198.36" y1="1589.22" y2="2154.44">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint30" x1="734.391" x2="1066.59" y1="1571.37" y2="2298.29">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint31" x1="716.508" x2="924.167" y1="1553.75" y2="2444.01">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint32" x1="700.674" x2="771.497" y1="1536.43" y2="2591.22">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint33" x1="686.888" x2="609.052" y1="1519.51" y2="2739.52">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint34" x1="675.146" x2="437.345" y1="1503.05" y2="2888.46">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="dashpaint35" x1="665.437" x2="257.01" y1="1487.12" y2="3037.5">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// Extraordinary Chart Component
function ExtraordinaryChart({ isDark }: { isDark: boolean }) {
  const generateData = () => {
    const data = [];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    
    for (let i = 0; i < 100; i++) {
      data.push({
        name: labels[Math.floor(i / 10)],
        displayLabel: i % 10 === 0 ? labels[Math.floor(i / 10)] : '',
        USDC: 3000 + Math.sin(i * 0.1) * 500 + Math.cos(i * 0.05) * 300 + i * 15,
        Revenue: 3200 + Math.sin(i * 0.08) * 400 + Math.cos(i * 0.06) * 250 + i * 12,
        Pending: 2900 + Math.sin(i * 0.12) * 600 + Math.cos(i * 0.04) * 350 + i * 18,
      });
    }
    return data;
  };

  const data = generateData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`backdrop-blur-2xl rounded-2xl shadow-2xl p-4 border ${
            isDark 
              ? 'bg-[#1a1a24]/98 border-[#FF1CF7]/30' 
              : 'bg-white/98 border-gray-200'
          }`}
          style={{ boxShadow: isDark ? '0 20px 50px rgba(255, 28, 247, 0.15)' : '0 20px 50px rgba(0,0,0,0.1)' }}
        >
          <div className="space-y-2.5">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-2.5 h-2.5 rounded-full shadow-lg" 
                    style={{ 
                      backgroundColor: entry.color,
                      boxShadow: `0 0 12px ${entry.color}80`
                    }}
                  />
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {entry.name}
                  </span>
                </div>
                <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ${entry.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const gridColor = isDark ? '#2a2654' : '#e5e7eb';
  const textColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <div className="relative w-full min-h-[420px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-[#FF1CF7] shadow-lg" style={{ boxShadow: '0 0 12px #FF1CF780' }} />
            <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>USDC Balance</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-[#00F0FF] shadow-lg" style={{ boxShadow: '0 0 12px #00F0FF80' }} />
            <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-[#B967FF] shadow-lg" style={{ boxShadow: '0 0 12px #B967FF80' }} />
            <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pending Funds</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
          >
            <RefreshCw className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
          >
            <Download className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </motion.button>
        </div>
      </div>

      <div className="w-full h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorUSDC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF1CF7" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#FF1CF7" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B967FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#B967FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.2} />
            
            <XAxis 
              dataKey="displayLabel" 
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12, fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: gridColor, strokeWidth: 1 }}
              height={40}
              interval={0}
            />
            
            <YAxis 
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 11, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              domain={[2000, 6500]}
              ticks={[2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500]}
              width={50}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FF1CF7', strokeWidth: 2, strokeDasharray: '5 5' }} />
            
            <Area 
              type="monotone" 
              dataKey="USDC" 
              stroke="#FF1CF7" 
              strokeWidth={3}
              fill="url(#colorUSDC)"
              dot={false}
              activeDot={{ r: 7, fill: '#FF1CF7', stroke: '#fff', strokeWidth: 3 }}
            />
            
            <Area 
              type="monotone" 
              dataKey="Revenue" 
              stroke="#00F0FF" 
              strokeWidth={2.5}
              fill="url(#colorRevenue)"
              dot={false}
              activeDot={{ r: 6, fill: '#00F0FF', stroke: '#fff', strokeWidth: 2.5 }}
            />
            
            <Area 
              type="monotone" 
              dataKey="Pending" 
              stroke="#B967FF" 
              strokeWidth={2.5}
              fill="url(#colorPending)"
              dot={false}
              activeDot={{ r: 6, fill: '#B967FF', stroke: '#fff', strokeWidth: 2.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const DASHBOARD_SECTIONS = ['dashboard', 'invoices', 'create', 'withdraw', 'faucet', 'activity', 'settings', 'api', 'analytics'] as const;

export default function Dashboard({ isDark, toggleTheme, walletAddress, onDisconnect }: DashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathSegment = location.pathname.replace(/^\/dashboard\/?/, '') || 'dashboard';
  const activeMenu = DASHBOARD_SECTIONS.includes(pathSegment as any) ? pathSegment : 'dashboard';

  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile menu open/close
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop collapse to icons only
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  
  // Use the theme animation hook
  const { ref: themeButtonRef, toggleSwitchTheme } = useModeAnimation({
    duration: 600,
    animationType: 'circle' as any,
    isDarkMode: isDark,
    onDarkModeChange: () => {
      toggleTheme();
    }
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close user dropdown if clicking outside
      if (showUserDropdown && !target.closest('[data-user-dropdown]')) {
        setShowUserDropdown(false);
      }
      
      // Close org dropdown if clicking outside
      if (showOrgDropdown && !target.closest('[data-org-dropdown]')) {
        setShowOrgDropdown(false);
      }
      
      // Close notifications if clicking outside
      if (showNotifications && !target.closest('[data-notifications]')) {
        setShowNotifications(false);
      }
      
      // Close filters if clicking outside
      if (showFilters && !target.closest('[data-filters]')) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown, showOrgDropdown, showNotifications, showFilters]);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Professional glass morphism styles
  const glassCard = isDark 
    ? 'bg-gradient-to-br from-[#1a1a24]/90 to-[#16161f]/90 backdrop-blur-2xl border border-white/10' 
    : 'bg-white/90 backdrop-blur-2xl border border-gray-200/50';
  
  const glassNav = isDark 
    ? 'bg-[#0a0a0f]/95 backdrop-blur-2xl border-white/5' 
    : 'bg-white/95 backdrop-blur-2xl border-gray-200/50';

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-500';

  const walletCards = [
    {
      name: 'Total Balance',
      subtitle: 'USDC Available',
      balance: '$12,450.00',
      change: '+12.5%',
      changeAmount: '+$1,380',
      period: 'this week',
      isPositive: true,
      icon: Wallet,
      gradient: 'from-[#FF1CF7]/20 to-transparent',
      iconBg: 'from-[#FF1CF7] to-[#B967FF]',
      iconColor: 'text-[#FF1CF7]'
    },
    {
      name: 'Pending Settlement',
      subtitle: 'Awaiting Transfer',
      balance: '$3,280.50',
      change: '+5.2%',
      changeAmount: '+$162',
      period: 'from 4 invoices',
      isPositive: true,
      icon: Clock,
      gradient: 'from-cyan-400/20 to-transparent',
      iconBg: 'from-cyan-400 to-blue-400',
      iconColor: 'text-cyan-400'
    },
    {
      name: 'Monthly Revenue',
      subtitle: 'Last 30 Days',
      balance: '$48,920.00',
      change: '+18.7%',
      changeAmount: '+$7,240',
      period: 'vs last month',
      isPositive: true,
      icon: TrendingUp,
      gradient: 'from-purple-400/20 to-transparent',
      iconBg: 'from-purple-400 to-pink-400',
      iconColor: 'text-purple-400'
    },
    {
      name: 'Platform Fees',
      subtitle: 'Revenue Share',
      balance: '$1,247.80',
      change: '+22.3%',
      changeAmount: '+$228',
      period: 'from 89 txns',
      isPositive: true,
      icon: DollarSign,
      gradient: 'from-emerald-400/20 to-transparent',
      iconBg: 'from-emerald-400 to-cyan-400',
      iconColor: 'text-emerald-400'
    }
  ];

  const quickActions = [
    {
      title: 'New Invoice',
      description: 'Create payment request',
      icon: FilePlus,
      gradient: 'from-[#FF1CF7] to-[#B967FF]',
      action: () => navigate('/dashboard/create')
    },
    {
      title: 'Withdraw',
      description: 'Transfer to wallet',
      icon: Send,
      gradient: 'from-[#00F0FF] to-[#0099FF]',
      action: () => navigate('/dashboard/withdraw')
    },
    {
      title: 'Payment Link',
      description: 'Share with clients',
      icon: LinkIcon,
      gradient: 'from-[#B967FF] to-[#FF1CF7]',
      action: () => {}
    },
    {
      title: 'Analytics',
      description: 'View detailed reports',
      icon: BarChart3,
      gradient: 'from-emerald-400 to-cyan-400',
      action: () => navigate('/dashboard/analytics')
    }
  ];

  const invoices = [
    {
      id: 'INV-001',
      client: 'Acme Corporation',
      amount: '$2,500.00',
      token: 'USDC',
      split: '90%',
      status: 'paid',
      date: '02/08/2026',
      txHash: '0x7a8f...3d2e'
    },
    {
      id: 'INV-002',
      client: 'TechStart Inc',
      amount: '$1,800.00',
      token: 'USDC',
      split: '95%',
      status: 'paid',
      date: '02/10/2026',
      txHash: '0x4b2c...8f1a'
    },
    {
      id: 'INV-003',
      client: 'Design Studio Pro',
      amount: '$3,200.00',
      token: 'USDC',
      split: '88%',
      status: 'pending',
      date: '02/11/2026',
      txHash: 'Pending...'
    },
    {
      id: 'INV-004',
      client: 'Marketing Agency',
      amount: '$950.00',
      token: 'USDC',
      split: '92%',
      status: 'overdue',
      date: '02/05/2026',
      txHash: 'Not paid'
    }
  ];

  const activities = [
    { 
      type: 'Payment Received',
      description: 'INV-001 • Acme Corporation',
      amount: '+$2,500.00',
      time: '2 minutes ago',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10'
    },
    { 
      type: 'Withdrawal Success',
      description: 'Transferred to 0x742d...4f3a',
      amount: '-$5,000.00',
      time: '15 minutes ago',
      icon: Send,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    { 
      type: 'Revenue Split',
      description: 'Distributed to 3 partners',
      amount: '$120.50',
      time: '1 hour ago',
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    { 
      type: 'Invoice Created',
      description: 'INV-003 • Design Studio Pro',
      amount: '$3,200.00',
      time: '2 hours ago',
      icon: FileText,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10'
    },
    { 
      type: 'Gas Fee Optimized',
      description: 'Saved 42% on transaction',
      amount: '-$2.80',
      time: '3 hours ago',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    }
  ];

  const notifications = [
    {
      id: 1,
      type: 'payment',
      title: 'Payment Received',
      message: 'You received $2,500.00 from Acme Corporation',
      time: '2 minutes ago',
      read: false,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10'
    },
    {
      id: 2,
      type: 'invoice',
      title: 'Invoice Pending',
      message: 'Design Studio Pro invoice is awaiting payment',
      time: '1 hour ago',
      read: false,
      icon: Clock,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Invoice Overdue',
      message: 'Marketing Agency invoice is 7 days overdue',
      time: '3 hours ago',
      read: false,
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    },
    {
      id: 4,
      type: 'success',
      title: 'Withdrawal Complete',
      message: '$5,000.00 transferred to your wallet successfully',
      time: '5 hours ago',
      read: true,
      icon: CheckCircle2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      id: 5,
      type: 'info',
      title: 'Revenue Split Complete',
      message: 'Revenue distributed to 3 partners',
      time: '1 day ago',
      read: true,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'create', label: 'Create Invoice', icon: FilePlus },
    { id: 'withdraw', label: 'Withdraw', icon: Wallet },
    { id: 'faucet', label: 'Faucet', icon: Droplet },
    { id: 'activity', label: 'Activity', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'api', label: 'API', icon: Code },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/20',
        icon: CheckCircle2,
        glow: 'shadow-emerald-500/20'
      },
      pending: {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-500/20',
        icon: AlertCircle,
        glow: 'shadow-yellow-500/20'
      },
      overdue: {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/20',
        icon: XCircle,
        glow: 'shadow-red-500/20'
      }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${config.bg} ${config.text} ${config.border} ${config.glow} shadow-lg`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-bold capitalize tracking-wide">{status}</span>
      </div>
    );
  };

  const goToDashboard = () => navigate('/dashboard');

  // Show Create Invoice page when activeMenu is 'create'
  if (activeMenu === 'create') {
    return <CreateInvoice isDark={isDark} walletAddress={walletAddress} onBack={goToDashboard} />;
  }

  // Show Withdraw page when activeMenu is 'withdraw'
  if (activeMenu === 'withdraw') {
    return <WithdrawPage isDark={isDark} walletAddress={walletAddress} onBack={goToDashboard} />;
  }

  // Show Faucet page when activeMenu is 'faucet'
  if (activeMenu === 'faucet') {
    return <FaucetPage isDark={isDark} walletAddress={walletAddress} onBack={goToDashboard} />;
  }

  // Show Invoices page when activeMenu is 'invoices'
  if (activeMenu === 'invoices') {
    return <InvoicesPage isDark={isDark} onBack={goToDashboard} onCreate={() => navigate('/dashboard/create')} />;
  }

  // Show Settings page when activeMenu is 'settings'
  if (activeMenu === 'settings') {
    return <SettingsPage isDark={isDark} walletAddress={walletAddress} onBack={goToDashboard} />;
  }

  // Show Activity page when activeMenu is 'activity'
  if (activeMenu === 'activity') {
    return <ActivityPage isDark={isDark} onBack={goToDashboard} />;
  }

  // Show Analytics page when activeMenu is 'analytics'
  if (activeMenu === 'analytics') {
    return <AnalyticsPage isDark={isDark} onBack={goToDashboard} />;
  }

  // Show API Portal page when activeMenu is 'api'
  if (activeMenu === 'api') {
    return (
      <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-[#0d0818]' : 'bg-gray-50'}`}>
        <LooperBg isDark={isDark} />
        
        <nav className={`relative z-10 backdrop-blur-2xl ${isDark ? 'bg-[#0a0a0f]/60 border-b border-white/5' : 'bg-white/70 border-b border-gray-200/50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 md:h-20">
              <motion.div 
                className="flex items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={goToDashboard}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] rounded-xl flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  API Portal
                </span>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToDashboard}
                className={`px-4 py-2 rounded-xl ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} transition-colors font-semibold`}
              >
                Back to Dashboard
              </motion.button>
            </div>
          </div>
        </nav>

        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ApiPortalPage isDark={isDark} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-[#0d0818]' : 'bg-gray-50'}`}>
      <LooperBg isDark={isDark} />

      {/* Exceptional Top Navigation */}
      <nav className={`sticky top-0 z-50 border-b ${glassNav}`}>
        <div className="flex items-center justify-between h-16 md:h-20 px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3 md:gap-6 lg:gap-8">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden p-2 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}
            >
              {sidebarOpen ? (
                <X className={`w-5 h-5 ${textPrimary}`} />
              ) : (
                <Menu className={`w-5 h-5 ${textPrimary}`} />
              )}
            </button>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF1CF7]/30">
                <span className="text-white font-bold text-base md:text-lg">S</span>
              </div>
              <div className="hidden sm:block">
                <h1 className={`font-bold text-base md:text-lg ${textPrimary}`}>StableLink</h1>
                <p className={`text-xs ${textMuted}`}>Payment Platform</p>
              </div>
            </div>
            
            {/* Elegant Network Indicator - Hidden on mobile */}
            <div className={`hidden lg:flex items-center gap-3 px-4 py-2.5 rounded-xl ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'} border border-emerald-500/20 shadow-lg shadow-emerald-500/10`}>
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="text-xs font-bold text-emerald-400">LIVE</span>
              <span className={`text-xs ${textSecondary}`}>•</span>
              <span className={`text-xs font-semibold ${textSecondary}`}>Etherlink Mainnet</span>
            </div>
          </div>

          {/* Center - Organization Dropdown - Hidden on mobile */}
          <div className="relative hidden md:block" data-org-dropdown>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-all shadow-lg`}
            >
              <Building2 className={`w-4 h-4 ${textSecondary}`} />
              <span className={`text-sm font-semibold ${textPrimary}`}>My Organization</span>
              <ChevronDown className={`w-4 h-4 ${textSecondary}`} />
            </motion.button>

            <AnimatePresence>
              {showOrgDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className={`absolute top-full mt-3 left-0 w-72 rounded-2xl ${glassCard} overflow-hidden shadow-2xl`}
                >
                  <div className="p-3">
                    <div className={`px-4 py-3 rounded-xl ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} cursor-pointer transition-colors`}>
                      <p className={`text-sm font-semibold ${textPrimary} mb-1`}>My Organization</p>
                      <p className={`text-xs ${textSecondary}`}>Primary workspace</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme Toggle */}
            <motion.button
              ref={themeButtonRef as any}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSwitchTheme}
              className={`p-2 md:p-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-all shadow-lg`}
            >
              {isDark ? (
                <Sun className={`w-4 h-4 md:w-5 md:h-5 ${textSecondary}`} />
              ) : (
                <Moon className={`w-4 h-4 md:w-5 md:h-5 ${textSecondary}`} />
              )}
            </motion.button>

            {/* Notification Bell */}
            <div className="relative" data-notifications>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 md:p-3 rounded-xl bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all"
              >
                <Bell className="w-4 h-4 md:w-5 md:h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-400/50">
                  <span className="text-[9px] md:text-[10px] font-bold text-white">{notifications.filter(n => !n.read).length}</span>
                </div>
              </motion.button>

              {/* Notification Panel */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    ref={notificationRef}
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className={`absolute right-0 mt-3 w-96 max-w-[calc(100vw-2rem)] rounded-2xl ${isDark ? 'bg-[#1a1a24]/98 backdrop-blur-2xl border border-white/10' : 'bg-white/98 backdrop-blur-2xl border border-gray-200/50'} overflow-hidden shadow-2xl z-50`}
                  >
                    {/* Header */}
                    <div className={`px-5 py-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-lg font-bold ${textPrimary}`}>Notifications</h3>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isDark ? 'bg-[#FF1CF7]/10 text-[#FF1CF7]' : 'bg-[#FF1CF7]/10 text-[#FF1CF7]'}`}>
                          {notifications.filter(n => !n.read).length} new
                        </span>
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className={`w-12 h-12 ${textMuted} mx-auto mb-3`} />
                          <p className={`text-sm ${textSecondary}`}>No notifications</p>
                        </div>
                      ) : (
                        <div className="p-2">
                          {notifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`p-4 rounded-xl mb-2 cursor-pointer transition-all ${
                                !notification.read 
                                  ? `${isDark ? 'bg-[#FF1CF7]/10 hover:bg-[#FF1CF7]/15' : 'bg-[#FF1CF7]/10 hover:bg-[#FF1CF7]/15'}` 
                                  : `${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.bgColor}`}>
                                  <notification.icon className={`w-5 h-5 ${notification.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className={`text-sm font-bold ${textPrimary}`}>{notification.title}</p>
                                    {!notification.read && (
                                      <div className="w-2 h-2 rounded-full bg-[#FF1CF7] flex-shrink-0 mt-1" />
                                    )}
                                  </div>
                                  <p className={`text-xs ${textSecondary} mb-2`}>{notification.message}</p>
                                  <p className={`text-xs ${textMuted}`}>{notification.time}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className={`px-4 py-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                      <button className={`w-full text-center text-sm font-bold text-[#FF1CF7] hover:underline`}>
                        Mark all as read
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wallet Address Badge - Hidden on small mobile */}
            <div className={`hidden sm:block px-3 md:px-4 py-2 md:py-2.5 rounded-xl ${glassCard} shadow-lg`}>
              <span className={`text-xs md:text-sm font-mono font-semibold ${textPrimary}`}>{truncateAddress(walletAddress)}</span>
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" data-user-dropdown>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className={`flex items-center gap-2 p-1.5 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-all shadow-lg`}
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] flex items-center justify-center shadow-lg shadow-[#FF1CF7]/30">
                  <span className="text-white text-sm font-bold">U</span>
                </div>
                <ChevronDown className={`w-4 h-4 ${textSecondary}`} />
              </motion.button>

              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className={`absolute right-0 mt-3 w-56 rounded-2xl ${glassCard} overflow-hidden shadow-2xl`}
                  >
                    <button
                      onClick={onDisconnect}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-400 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} transition-colors`}
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect Wallet
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 top-16 md:top-20"
            />
          )}
        </AnimatePresence>

        {/* Stunning Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 md:top-20 left-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] z-40 ${isDark ? 'bg-[#0a0a0f]/98 lg:bg-[#0a0a0f]/60' : 'bg-white/98 lg:bg-white/60'} backdrop-blur-2xl border-r ${isDark ? 'border-white/5' : 'border-gray-200/50'} transition-all duration-300 shadow-2xl lg:shadow-none ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } ${
            sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
          } w-72`}
        >
          {/* Elegant Toggle Button - Only visible on lg+ screens */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex absolute -right-4 top-8 z-50 w-8 h-8 rounded-full bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] items-center justify-center shadow-xl shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 hover:scale-110 transition-all duration-200"
          >
            <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${
              sidebarCollapsed ? '-rotate-90' : 'rotate-90'
            }`} />
          </button>

          <div className="p-4 space-y-2 overflow-y-auto h-full">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  navigate(item.id === 'dashboard' ? '/dashboard' : `/dashboard/${item.id}`);
                  // Close sidebar on mobile when menu item is clicked
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm transition-all relative group ${
                  sidebarCollapsed ? 'lg:justify-center' : ''
                } ${
                  activeMenu === item.id
                    ? `bg-gradient-to-r from-[#FF1CF7]/15 to-[#B967FF]/15 ${isDark ? 'text-white' : 'text-gray-900'} shadow-lg shadow-[#FF1CF7]/20 border border-[#FF1CF7]/30 font-bold`
                    : `${textSecondary} ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} font-semibold`
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <item.icon className={`w-5 h-5 transition-all ${
                    activeMenu === item.id ? 'text-[#FF1CF7]' : ''
                  }`} />
                  {activeMenu === item.id && (
                    <motion.div
                      layoutId="activeMenuGlow"
                      className="absolute inset-0 bg-[#FF1CF7]/30 rounded-lg blur-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>

                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 flex-1 overflow-hidden"
                    >
                      <span className="font-semibold whitespace-nowrap">{item.label}</span>
                      {item.badge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] text-white text-xs font-bold whitespace-nowrap shadow-lg">
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {sidebarCollapsed && (
                  <div className={`hidden lg:block absolute left-full ml-4 px-4 py-2.5 ${glassCard} rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-2xl`}>
                    <span className={`text-sm font-semibold ${textPrimary}`}>{item.label}</span>
                    {item.badge && (
                      <span className="ml-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] text-white text-xs font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </aside>

        {/* Extraordinary Main Content */}
        <main className="flex-1 overflow-auto h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] relative w-full">
          <div className="p-4 sm:p-6 lg:p-8 xl:p-12 max-w-[1920px] mx-auto space-y-6 lg:space-y-8">
            {/* Elegant Header with Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold ${textPrimary} mb-2 tracking-tight`}>Dashboard</h2>
                <p className={`text-sm md:text-base ${textSecondary}`}>
                  Welcome back! Here's your financial overview
                </p>
              </div>
              
              <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial" data-filters>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`w-full flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-all shadow-lg font-semibold justify-center ${showFilters ? 'ring-2 ring-[#FF1CF7]/50' : ''}`}
                  >
                    <Filter className={`w-4 h-4 ${textSecondary}`} />
                    <span className={`text-sm ${textPrimary}`}>Filters</span>
                  </motion.button>

                  {/* Filter Dropdown */}
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        ref={filterRef}
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className={`absolute left-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl ${glassCard} overflow-hidden shadow-2xl z-50`}
                      >
                        <div className={`px-5 py-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                          <h3 className={`text-lg font-bold ${textPrimary}`}>Filters</h3>
                        </div>

                        <div className="p-4 space-y-4">
                          {/* Date Range */}
                          <div>
                            <label className={`text-sm font-bold ${textPrimary} mb-2 block`}>Date Range</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${isDark ? 'bg-[#FF1CF7]/10 text-[#FF1CF7] border border-[#FF1CF7]/30' : 'bg-[#FF1CF7]/10 text-[#FF1CF7] border border-[#FF1CF7]/30'}`}>
                                Last 7 days
                              </button>
                              <button className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                                Last 30 days
                              </button>
                              <button className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                                Last 3 months
                              </button>
                              <button className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                                All time
                              </button>
                            </div>
                          </div>

                          {/* Status */}
                          <div>
                            <label className={`text-sm font-bold ${textPrimary} mb-2 block`}>Status</label>
                            <div className="space-y-2">
                              {['All', 'Paid', 'Pending', 'Overdue'].map((status) => (
                                <label key={status} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${status === 'All' ? 'border-[#FF1CF7] bg-[#FF1CF7]' : `${isDark ? 'border-white/20' : 'border-gray-300'}`}`}>
                                    {status === 'All' && <Check className="w-3.5 h-3.5 text-white" />}
                                  </div>
                                  <span className={`text-sm font-semibold ${textPrimary}`}>{status}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Amount Range */}
                          <div>
                            <label className={`text-sm font-bold ${textPrimary} mb-2 block`}>Amount Range</label>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="number"
                                placeholder="Min"
                                className={`px-3 py-2 rounded-xl text-sm font-semibold ${isDark ? 'bg-white/5 text-white placeholder:text-white/30 border border-white/10' : 'bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50`}
                              />
                              <input
                                type="number"
                                placeholder="Max"
                                className={`px-3 py-2 rounded-xl text-sm font-semibold ${isDark ? 'bg-white/5 text-white placeholder:text-white/30 border border-white/10' : 'bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Footer Actions */}
                        <div className={`px-4 py-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-center gap-2`}>
                          <button
                            onClick={() => setShowFilters(false)}
                            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => setShowFilters(false)}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] text-white text-sm font-bold hover:shadow-lg hover:shadow-[#FF1CF7]/50 transition-all"
                          >
                            Apply
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all font-bold text-white flex-1 sm:flex-initial justify-center"
                  onClick={() => navigate('/dashboard/create')}
                >
                  <FilePlus className="w-4 h-4" />
                  <span className="text-sm">Create Invoice</span>
                </motion.button>
              </div>
            </div>

            {/* Premium Wallet Cards - Full Width 4 Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
              {walletCards.map((card, index) => (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${glassCard} rounded-2xl p-4 md:p-6 shadow-xl relative overflow-hidden`}
                >
                  {/* Gradient Background Blur Effect */}
                  <div className={`absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br ${card.gradient} rounded-full blur-3xl`} />
                  
                  <div className="relative">
                    {/* Icon and Trend */}
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center shadow-lg`}>
                        <card.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      {card.isPositive ? (
                        <div className="flex items-center gap-1 text-emerald-400">
                          <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="text-xs md:text-sm font-bold">{card.change}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-400">
                          <TrendingDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="text-xs md:text-sm font-bold">{card.change}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Title */}
                    <h3 className={`text-xs md:text-sm font-semibold ${textMuted} mb-2`}>
                      {card.name}
                    </h3>
                    
                    {/* Balance - Large */}
                    <p className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-2`}>
                      {card.balance}
                    </p>
                    
                    {/* Trend Label */}
                    <p className={`text-[10px] md:text-xs ${textMuted}`}>
                      {card.period}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Premium Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className={`text-lg md:text-xl font-bold ${textPrimary} mb-4 md:mb-5`}>Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    onClick={action.action}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative p-5 md:p-6 rounded-2xl overflow-hidden ${glassCard} transition-all text-left group shadow-lg hover:shadow-2xl`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <div className="relative z-10">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 md:mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <action.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <h4 className={`text-sm md:text-base font-bold ${textPrimary} mb-1.5`}>{action.title}</h4>
                      <p className={`text-xs md:text-sm ${textSecondary}`}>{action.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Main Content Grid - Chart & Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
              {/* Extraordinary Revenue Chart - Spans 2 columns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`xl:col-span-2 p-5 md:p-8 rounded-3xl ${glassCard} shadow-2xl`}
              >
                <div className="mb-5 md:mb-6">
                  <h3 className={`${textPrimary} font-bold text-xl md:text-2xl mb-2`}>Revenue Analytics</h3>
                  <p className={`${textSecondary} text-xs md:text-sm`}>Real-time multi-currency tracking</p>
                </div>
                <ExtraordinaryChart isDark={isDark} />
              </motion.div>

              {/* Premium Activity Feed */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className={`rounded-3xl ${glassCard} p-5 md:p-6 shadow-2xl`}
              >
                <div className="flex items-center justify-between mb-5 md:mb-6">
                  <h3 className={`${textPrimary} font-bold text-base md:text-lg`}>Recent Activity</h3>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/dashboard/activity')}
                    className="text-[#FF1CF7] text-xs font-bold hover:underline"
                  >
                    View All
                  </motion.button>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {activities.map((activity, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className={`flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-2xl ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}
                    >
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.bgColor} shadow-lg`}>
                        <activity.icon className={`w-5 h-5 md:w-6 md:h-6 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`${textPrimary} text-xs md:text-sm font-bold mb-1`}>{activity.type}</p>
                        <p className={`${textSecondary} text-[10px] md:text-xs mb-2 truncate`}>{activity.description}</p>
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-bold ${activity.amount.startsWith('+') ? 'text-emerald-400' : activity.amount.startsWith('-') ? 'text-blue-400' : 'text-purple-400'}`}>
                            {activity.amount}
                          </p>
                          <p className={`text-[10px] ${textMuted}`}>{activity.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Premium Invoices Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`rounded-3xl ${glassCard} p-5 md:p-8 shadow-2xl`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 md:mb-6 gap-4">
                <div>
                  <h3 className={`${textPrimary} font-bold text-xl md:text-2xl mb-2`}>Recent Invoices</h3>
                  <p className={`${textSecondary} text-xs md:text-sm`}>Track and manage your payments</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard/invoices')}
                  className="flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all font-bold text-white text-sm w-full sm:w-auto justify-center"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="overflow-x-auto -mx-5 md:mx-0">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                      <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Invoice</th>
                      <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Client</th>
                      <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Amount</th>
                      <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Token</th>
                      <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Split</th>
                      <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Status</th>
                      <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Date</th>
                      <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice, index) => (
                      <motion.tr 
                        key={invoice.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.05 }}
                        className={`border-b ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}
                      >
                        <td className={`py-4 md:py-5 px-4 md:px-6 text-xs md:text-sm font-bold font-mono ${textPrimary}`}>{invoice.id}</td>
                        <td className={`py-4 md:py-5 px-4 md:px-6 text-xs md:text-sm font-semibold ${textPrimary}`}>{invoice.client}</td>
                        <td className={`py-4 md:py-5 px-4 md:px-6 text-xs md:text-sm font-bold ${textPrimary}`}>{invoice.amount}</td>
                        <td className="py-4 md:py-5 px-4 md:px-6">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold ${isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-600 border border-cyan-200'} shadow-lg`}>
                            {invoice.token}
                          </span>
                        </td>
                        <td className={`py-5 px-6 text-sm font-bold ${textSecondary}`}>{invoice.split}</td>
                        <td className="py-5 px-6">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className={`py-5 px-6 text-sm ${textSecondary} font-medium`}>{invoice.date}</td>
                        <td className="py-5 px-6">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedInvoice(invoice)}
                            className={`p-2.5 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-all shadow-lg`}
                          >
                            <Eye className={`w-4 h-4 ${textSecondary}`} />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          isDark={isDark}
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
