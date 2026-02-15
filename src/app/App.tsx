import { ArrowRight, CheckCircle2, Clock, CreditCard, DollarSign, Eye, Github, Globe, Link2, Lock, Shield, TrendingUp, Users, Wallet, Zap, Twitter, Send, Moon, Sun, Sparkles, ChevronDown, LogOut, LayoutDashboard, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'motion/react';
import { useModeAnimation } from 'react-theme-switch-animation';
import { useActiveAccount, useConnectModal, useDisconnect, AutoConnect, useIsAutoConnecting } from 'thirdweb/react';
import { thirdwebClient, etherlinkShadownet } from '../client';
import svgPaths from '../imports/svg-1rf4lkm0ba';
import Dashboard from './components/Dashboard';
import CheckoutPage from './components/CheckoutPage';

function LooperBg({ isDark }: { isDark: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isDark ? 0.4 : 0.6, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2295.766px] h-[2037.845px] pointer-events-none scale-75 lg:scale-100 transition-all duration-1000 ${isDark ? 'opacity-40' : 'opacity-60 saturate-150 brightness-110'}`}
    >
      <svg 
        className="block size-full" 
        fill="none" 
        preserveAspectRatio="none" 
        viewBox="0 0 2295.77 2037.85"
      >
        <g>
          <path d={svgPaths.p161a3400} opacity="0" stroke="url(#paint0_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p18534700} opacity="0.0144928" stroke="url(#paint1_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.pd4fde80} opacity="0.0289855" stroke="url(#paint2_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p19160880} opacity="0.0434783" stroke="url(#paint3_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p240c4c00} opacity="0.057971" stroke="url(#paint4_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p31123ef0} opacity="0.0724638" stroke="url(#paint5_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p39eede00} opacity="0.0869565" stroke="url(#paint6_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p15758e80} opacity="0.101449" stroke="url(#paint7_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p32905b00} opacity="0.115942" stroke="url(#paint8_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p29f7ce80} opacity="0.130435" stroke="url(#paint9_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p2881440} opacity="0.144928" stroke="url(#paint10_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p163e4fc0} opacity="0.15942" stroke="url(#paint11_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.pe7ebe80} opacity="0.173913" stroke="url(#paint12_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p2bed900} opacity="0.188406" stroke="url(#paint13_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p342c4500} opacity="0.202899" stroke="url(#paint14_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p20376bc0} opacity="0.217391" stroke="url(#paint15_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.pc1e83c0} opacity="0.231884" stroke="url(#paint16_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p33cbdf80} opacity="0.246377" stroke="url(#paint17_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.pcf0800} opacity="0.26087" stroke="url(#paint18_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p13201c00} opacity="0.275362" stroke="url(#paint19_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p337bc600} opacity="0.289855" stroke="url(#paint20_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p2081a800} opacity="0.304348" stroke="url(#paint21_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p13abfd00} opacity="0.318841" stroke="url(#paint22_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p17402d80} opacity="0.333333" stroke="url(#paint23_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p39bc4c00} opacity="0.347826" stroke="url(#paint24_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p27876900} opacity="0.362319" stroke="url(#paint25_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p3ed8d200} opacity="0.376812" stroke="url(#paint26_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p39e33200} opacity="0.391304" stroke="url(#paint27_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p38246c80} opacity="0.405797" stroke="url(#paint28_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p2c59b700} opacity="0.42029" stroke="url(#paint29_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.pd2c9b80} opacity="0.434783" stroke="url(#paint30_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p764a880} opacity="0.449275" stroke="url(#paint31_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p1edfa480} opacity="0.463768" stroke="url(#paint32_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p341e9c0} opacity="0.478261" stroke="url(#paint33_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p3fc2f280} opacity="0.492754" stroke="url(#paint34_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p132008f0} opacity="0.507246" stroke="url(#paint35_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p2f151980} opacity="0.521739" stroke="url(#paint36_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p237b9200} opacity="0.536232" stroke="url(#paint37_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p27bf7400} opacity="0.550725" stroke="url(#paint38_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p9a18880} opacity="0.565217" stroke="url(#paint39_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p14cd780} opacity="0.57971" stroke="url(#paint40_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p36ab500} opacity="0.594203" stroke="url(#paint41_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p1129a200} opacity="0.608696" stroke="url(#paint42_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p27a06cc0} opacity="0.623188" stroke="url(#paint43_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p16690f00} opacity="0.637681" stroke="url(#paint44_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p3573d900} opacity="0.652174" stroke="url(#paint45_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p3d4052a0} opacity="0.666667" stroke="url(#paint46_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p17dfdc00} opacity="0.681159" stroke="url(#paint47_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p34a77000} opacity="0.695652" stroke="url(#paint48_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p29802280} opacity="0.710145" stroke="url(#paint49_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p3a0111f2} opacity="0.724638" stroke="url(#paint50_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p2ee414c0} opacity="0.73913" stroke="url(#paint51_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p26885280} opacity="0.753623" stroke="url(#paint52_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p14943d00} opacity="0.768116" stroke="url(#paint53_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p377f70f0} opacity="0.782609" stroke="url(#paint54_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p3c66e380} opacity="0.797101" stroke="url(#paint55_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p3004c280} opacity="0.811594" stroke="url(#paint56_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p21d24700} opacity="0.826087" stroke="url(#paint57_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p2a0ca100} opacity="0.84058" stroke="url(#paint58_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p37973280} opacity="0.855072" stroke="url(#paint59_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p13acf800} opacity="0.869565" stroke="url(#paint60_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.pc26b80} opacity="0.884058" stroke="url(#paint61_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p1d709480} opacity="0.898551" stroke="url(#paint62_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p79361e0} opacity="0.913043" stroke="url(#paint63_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p327a20f0} opacity="0.927536" stroke="url(#paint64_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p206e5980} opacity="0.942029" stroke="url(#paint65_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p3043ea80} opacity="0.956522" stroke="url(#paint66_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p13a95880} opacity="0.971014" stroke="url(#paint67_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.pa792300} opacity="0.985507" stroke="url(#paint68_linear_1_141)" strokeWidth="4" />
          <path d={svgPaths.p2ca59000} stroke="url(#paint69_linear_1_141)" strokeWidth="4" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_141" x1="1965.81" x2="1039.89" y1="1728.06" y2="463.22">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_141" x1="1914.98" x2="1062.42" y1="1748.96" y2="416.152">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_1_141" x1="1863.98" x2="1093.65" y1="1767.47" y2="370.68">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_1_141" x1="1812.93" x2="1133.64" y1="1783.61" y2="328.475">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint4_linear_1_141" x1="1761.9" x2="1182.1" y1="1797.39" y2="291.319">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint5_linear_1_141" x1="1710.98" x2="1238.3" y1="1808.85" y2="261.014">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint6_linear_1_141" x1="1660.27" x2="1301.02" y1="1818.01" y2="239.252">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint7_linear_1_141" x1="1609.85" x2="1368.63" y1="1824.91" y2="227.465">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint8_linear_1_141" x1="1559.8" x2="1439.11" y1="1829.6" y2="226.698">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint9_linear_1_141" x1="1510.21" x2="1510.21" y1="1832.12" y2="237.486">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint10_linear_1_141" x1="1461.14" x2="1579.56" y1="1832.54" y2="259.796">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint11_linear_1_141" x1="1412.69" x2="1644.92" y1="1830.91" y2="293.015">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint12_linear_1_141" x1="1364.95" x2="1704.82" y1="1827.37" y2="337.159">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint13_linear_1_141" x1="1318.03" x2="1757.67" y1="1822.01" y2="391.665">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint14_linear_1_141" x1="1272.01" x2="1802.07" y1="1814.97" y2="455.767">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint15_linear_1_141" x1="1227.01" x2="1837.52" y1="1806.36" y2="528.629">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint16_linear_1_141" x1="1183.14" x2="1863.56" y1="1796.31" y2="609.273">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint17_linear_1_141" x1="1140.5" x2="1879.81" y1="1784.94" y2="697.623">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint18_linear_1_141" x1="1099.18" x2="1885.84" y1="1772.38" y2="792.458">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint19_linear_1_141" x1="1059.28" x2="1881.21" y1="1758.75" y2="893.463">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint20_linear_1_141" x1="1020.87" x2="1865.55" y1="1744.16" y2="1000.17">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint21_linear_1_141" x1="984.04" x2="1838.5" y1="1728.74" y2="1112.14">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint22_linear_1_141" x1="948.868" x2="1799.85" y1="1712.6" y2="1228.97">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint23_linear_1_141" x1="915.43" x2="1749.41" y1="1695.87" y2="1350.28">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint24_linear_1_141" x1="883.796" x2="1687.08" y1="1678.66" y2="1475.72">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint25_linear_1_141" x1="854.02" x2="1612.81" y1="1661.09" y2="1604.97">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint26_linear_1_141" x1="826.149" x2="1526.65" y1="1643.25" y2="1737.77">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint27_linear_1_141" x1="800.218" x2="1428.69" y1="1625.26" y2="1873.83">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint28_linear_1_141" x1="776.264" x2="1319.16" y1="1607.21" y2="2012.83">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint29_linear_1_141" x1="754.314" x2="1198.36" y1="1589.22" y2="2154.44">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint30_linear_1_141" x1="734.391" x2="1066.59" y1="1571.37" y2="2298.29">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint31_linear_1_141" x1="716.508" x2="924.167" y1="1553.75" y2="2444.01">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint32_linear_1_141" x1="700.674" x2="771.497" y1="1536.43" y2="2591.22">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint33_linear_1_141" x1="686.888" x2="609.052" y1="1519.51" y2="2739.52">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint34_linear_1_141" x1="675.146" x2="437.345" y1="1503.05" y2="2888.46">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint35_linear_1_141" x1="665.437" x2="257.01" y1="1487.12" y2="3037.5">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint36_linear_1_141" x1="657.746" x2="68.7948" y1="1471.78" y2="3186.03">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint37_linear_1_141" x1="652.055" x2="-126.968" y1="1457.08" y2="3333.46">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint38_linear_1_141" x1="648.345" x2="-329.018" y1="1443.06" y2="3479.08">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint39_linear_1_141" x1="646.591" x2="-537.19" y1="1429.76" y2="3622.25">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint40_linear_1_141" x1="646.767" x2="-750.312" y1="1417.22" y2="3762.29">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint41_linear_1_141" x1="648.845" x2="-968.212" y1="1405.47" y2="3898.59">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint42_linear_1_141" x1="652.794" x2="-1190.63" y1="1394.54" y2="4030.59">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint43_linear_1_141" x1="658.576" x2="-1417.4" y1="1384.44" y2="4157.74">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint44_linear_1_141" x1="666.154" x2="-1648.27" y1="1375.2" y2="4279.54">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint45_linear_1_141" x1="675.486" x2="-1882.99" y1="1366.82" y2="4395.54">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint46_linear_1_141" x1="686.525" x2="-2121.33" y1="1359.32" y2="4505.33">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint47_linear_1_141" x1="699.221" x2="-2363.07" y1="1352.71" y2="4608.57">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint48_linear_1_141" x1="713.519" x2="-2607.96" y1="1347.01" y2="4704.95">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint49_linear_1_141" x1="729.36" x2="-2855.78" y1="1342.23" y2="4794.21">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint50_linear_1_141" x1="746.683" x2="-3106.32" y1="1338.37" y2="4876.12">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint51_linear_1_141" x1="765.423" x2="-3359.35" y1="1335.45" y2="4950.47">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint52_linear_1_141" x1="785.513" x2="-3614.66" y1="1333.46" y2="5017.07">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint53_linear_1_141" x1="806.884" x2="-3872.08" y1="1332.4" y2="5075.77">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint54_linear_1_141" x1="829.465" x2="-4131.42" y1="1332.27" y2="5126.42">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint55_linear_1_141" x1="853.186" x2="-4392.49" y1="1333.07" y2="5168.91">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint56_linear_1_141" x1="877.974" x2="-4655.1" y1="1334.8" y2="5203.14">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint57_linear_1_141" x1="903.757" x2="-4919.11" y1="1337.46" y2="5229.02">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint58_linear_1_141" x1="930.463" x2="-5184.34" y1="1341.04" y2="5246.48">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint59_linear_1_141" x1="958.019" x2="-5450.66" y1="1345.53" y2="5255.45">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint60_linear_1_141" x1="986.352" x2="-5717.95" y1="1350.93" y2="5255.89">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint61_linear_1_141" x1="1015.38" x2="-5986.06" y1="1357.23" y2="5247.75">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint62_linear_1_141" x1="1045.04" x2="-6254.85" y1="1364.43" y2="5231.04">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint63_linear_1_141" x1="1075.26" x2="-6524.2" y1="1372.51" y2="5205.75">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint64_linear_1_141" x1="1105.97" x2="-6793.97" y1="1381.46" y2="5171.9">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint65_linear_1_141" x1="1137.09" x2="-7064.03" y1="1391.28" y2="5129.51">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint66_linear_1_141" x1="1168.55" x2="-7334.27" y1="1401.95" y2="5078.64">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint67_linear_1_141" x1="1200.27" x2="-7604.55" y1="1413.47" y2="5019.31">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint68_linear_1_141" x1="1232.18" x2="-7874.77" y1="1425.82" y2="4951.58">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint69_linear_1_141" x1="1264.22" x2="-8144.8" y1="1438.99" y2="4875.5">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// Scroll Progress Indicator
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF1CF7] via-[#B967FF] to-[#00F0FF] origin-left z-[100]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

// Floating Particles Component
function FloatingParticles({ isDark }: { isDark: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${
            isDark ? 'bg-white/20' : 'bg-slate-900/10'
          }`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
}

// Magnetic Button Component
function MagneticButton({ children, className, ...props }: any) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// How It Works Step Component
function HowItWorksStep({ item, index, isDark }: { item: any; index: number; isDark: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div 
      key={index} 
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="relative">
          <motion.div 
            className={`w-28 h-28 bg-gradient-to-br ${item.gradient} rounded-3xl flex items-center justify-center shadow-2xl ${
              isDark 
                ? `shadow-[#${item.color}]/30` 
                : `shadow-[#${item.color}]/20`
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={isInView ? { y: [0, -10, 0] } : {}}
            transition={{ 
              y: { duration: 2, repeat: Infinity, delay: index * 0.3 }
            }}
          >
            <item.icon className="w-14 h-14 text-white" />
          </motion.div>
          <motion.div 
            className={`absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center border-4 ${
              isDark ? 'border-black' : 'border-white'
            }`}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.5 + index * 0.2, type: "spring" }}
            whileHover={{ scale: 1.2, rotate: 360 }}
          >
            <span className="text-white font-bold text-xl">{item.num}</span>
          </motion.div>
        </div>
        <motion.h3 
          className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 + index * 0.2 }}
        >
          {item.title}
        </motion.h3>
        <motion.p 
          className={`leading-relaxed ${
            isDark ? 'text-white/50' : 'text-slate-600'
          }`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 + index * 0.2 }}
        >
          {item.desc}
        </motion.p>
      </div>
      
      {/* Connecting Line */}
      {index < 2 && (
        <motion.div 
          className="hidden md:block absolute top-14 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#FF1CF7] via-[#B967FF] to-[#00F0FF]"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
          style={{ originX: 0 }}
        />
      )}
    </motion.div>
  );
}

// Shown when user is on /dashboard/* but wallet not connected. Keeps URL so reload stays on same path.
function DashboardConnectGate({
  isDark,
  onConnect,
  onBackToHome,
}: {
  isDark: boolean;
  onConnect: () => void;
  onBackToHome: () => void;
}) {
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0d0818]' : 'bg-gray-50'} flex flex-col items-center justify-center p-8`}>
      <div className={`max-w-md w-full rounded-2xl p-8 text-center border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} shadow-xl`}>
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#FF1CF7]/20 to-[#B967FF]/20 flex items-center justify-center border border-[#FF1CF7]/30">
          <Wallet className="w-8 h-8 text-[#FF1CF7]" />
        </div>
        <h1 className={`text-2xl font-bold ${textPrimary} mb-2`}>Connect your wallet</h1>
        <p className={`text-sm ${textSecondary} mb-8`}>
          Connect your wallet to access the dashboard and manage invoices.
        </p>
        <button
          onClick={onConnect}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all mb-3"
        >
          Connect Wallet
        </button>
        <button
          onClick={onBackToHome}
          className={`w-full py-3 px-6 rounded-xl font-semibold border ${isDark ? 'border-white/20 text-gray-300 hover:bg-white/5' : 'border-gray-300 text-gray-600 hover:bg-gray-50'} transition-all`}
        >
          Back to home
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLaunchAppModal, setShowLaunchAppModal] = useState(false);
  const [walletRehydrated, setWalletRehydrated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const account = useActiveAccount();
  const { connect } = useConnectModal();
  const { disconnect } = useDisconnect();
  const isAutoConnecting = useIsAutoConnecting();

  const isWalletConnected = !!account?.address;
  const walletAddress = account?.address ?? '';

  const isCheckout = location.pathname === '/checkout';
  const isDashboard = location.pathname.startsWith('/dashboard');
  const showLanding = !isCheckout && !isDashboard;

  // Wait for auto-connect to finish (or a max delay) before showing connect gate, so persisted wallet can restore
  useEffect(() => {
    if (!isAutoConnecting) {
      setWalletRehydrated(true);
      return;
    }
    const t = setTimeout(() => setWalletRehydrated(true), 2500);
    return () => clearTimeout(t);
  }, [isAutoConnecting]);

  // Use the theme animation hook
  const { ref: themeButtonRef, toggleSwitchTheme } = useModeAnimation({
    duration: 600,
    animationType: 'circle' as any,
    isDarkMode: isDark,
    onDarkModeChange: (isDarkMode) => {
      setIsDark(isDarkMode);
    }
  });

  const toggleTheme = async () => {
    await toggleSwitchTheme();
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const handleConnectWallet = () => {
    connect({ client: thirdwebClient, chain: etherlinkShadownet });
  };

  const handleDisconnect = () => {
    disconnect();
    setShowDropdown(false);
    navigate('/');
  };

  const handleGoToDashboard = () => {
    setShowDropdown(false);
    navigate('/dashboard');
  };

  // When user connects from Launch App modal, go to dashboard
  useEffect(() => {
    if (showLaunchAppModal && isWalletConnected) {
      setShowLaunchAppModal(false);
      navigate('/dashboard');
    }
  }, [showLaunchAppModal, isWalletConnected, navigate]);

  const handleLaunchAppClick = () => {
    if (isWalletConnected) {
      navigate('/dashboard');
    } else {
      setShowLaunchAppModal(true);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <AutoConnect client={thirdwebClient} chain={etherlinkShadownet} />
      <Routes>
        <Route path="/checkout" element={
          <CheckoutPage isDark={isDark} toggleTheme={toggleTheme} />
        } />
        <Route path="/dashboard/*" element={
          isWalletConnected ? (
            <Dashboard
              isDark={isDark}
              toggleTheme={toggleTheme}
              walletAddress={walletAddress}
            />
          ) : !walletRehydrated ? (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0d0818]' : 'bg-gray-50'}`}>
              <div className="flex flex-col items-center gap-4">
                <Loader2 className={`w-10 h-10 animate-spin ${isDark ? 'text-[#FF1CF7]' : 'text-[#B967FF]'}`} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Checking wallet…</p>
              </div>
            </div>
          ) : (
            <DashboardConnectGate
              isDark={isDark}
              onConnect={handleConnectWallet}
              onBackToHome={() => navigate('/', { replace: true })}
            />
          )
        } />
        <Route path="*" element={
    <div className={`min-h-screen overflow-hidden transition-colors duration-700 ${
      isDark 
        ? 'bg-black text-white' 
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-900'
    }`}>
      <ScrollProgress />
      <FloatingParticles isDark={isDark} />

      {/* Launch App: Connect wallet modal */}
      {showLaunchAppModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowLaunchAppModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`max-w-md w-full rounded-2xl p-8 text-center border shadow-2xl ${
              isDark ? 'bg-[#1a1a24] border-white/10' : 'bg-white border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#FF1CF7]/20 to-[#B967FF]/20 flex items-center justify-center border border-[#FF1CF7]/30">
              <Wallet className="w-8 h-8 text-[#FF1CF7]" />
            </div>
            <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Connect your wallet</h2>
            <p className={`text-sm mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Connect your wallet to launch the app and access your dashboard.
            </p>
            <button
              onClick={handleConnectWallet}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all mb-3"
            >
              Connect Wallet
            </button>
            <button
              onClick={() => setShowLaunchAppModal(false)}
              className={`w-full py-3 px-6 rounded-xl font-semibold border transition-all ${
                isDark ? 'border-white/20 text-gray-300 hover:bg-white/5' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`relative z-50 backdrop-blur-2xl transition-all duration-700 ${
          isDark 
            ? 'border-b border-white/10 bg-black/50' 
            : 'border-b border-slate-200/60 bg-white/70 shadow-sm shadow-slate-200/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <motion.div 
              className="flex items-center gap-2 sm:gap-3 group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={() => navigate('/')}
            >
              <img src="/favicon.svg" alt="StableLink" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-contain flex-shrink-0" />
              <span className={`text-lg sm:text-xl md:text-2xl font-bold tracking-tight transition-all duration-300 ${
                isDark 
                  ? 'bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'
              }`}>
                StableLink
              </span>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-10">
              {['Features', 'How it works'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className={`relative group text-[15px] font-medium transition-colors duration-300 ${
                    isDark ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <motion.span
                    className="absolute -bottom-6 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF1CF7] to-[#00F0FF]"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
              <motion.button
                ref={themeButtonRef as any}
                onClick={toggleTheme}
                className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-500 group ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20' 
                    : 'bg-slate-200/50 hover:bg-slate-300/50'
                }`}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                )}
              </motion.button>
              
              {!isWalletConnected ? (
                <MagneticButton 
                  onClick={handleConnectWallet}
                  className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 bg-gradient-to-br from-[#497cff] via-[#2563eb] to-[#001664] text-white rounded-lg sm:rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 text-xs sm:text-sm md:text-[15px] font-semibold flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                >
                  <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Connect Wallet
                </MagneticButton>
              ) : (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-[15px] font-medium whitespace-nowrap ${
                      isDark 
                        ? 'bg-white/10 hover:bg-white/20 text-white' 
                        : 'bg-slate-200/50 hover:bg-slate-300/50 text-slate-900'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {truncateAddress(walletAddress)}
                    <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                  </motion.button>
                  
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border overflow-hidden ${
                        isDark 
                          ? 'bg-slate-900/95 backdrop-blur-xl border-white/10' 
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <button
                        onClick={handleGoToDashboard}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                          isDark 
                            ? 'hover:bg-white/10 text-white' 
                            : 'hover:bg-slate-50 text-slate-900'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="text-[15px] font-medium">Dashboard</span>
                      </button>
                      <button
                        onClick={handleDisconnect}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                          isDark 
                            ? 'hover:bg-red-500/10 text-red-400' 
                            : 'hover:bg-red-50 text-red-600'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-[15px] font-medium">Disconnect</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[calc(100vh-5rem)] flex items-center">
        <LooperBg isDark={isDark} />
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="text-center space-y-6 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF1CF7]/10 via-[#B967FF]/10 to-[#00F0FF]/10 border border-[#FF1CF7]/20 backdrop-blur-xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-[#FF1CF7]" />
              </motion.div>
              <span className={`text-sm font-medium ${
                isDark ? 'text-white/80' : 'text-slate-700'
              }`}>
                Powered by Etherlink • Built for Asia
              </span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span 
                className="inline-block bg-gradient-to-r from-[#FF1CF7] via-[#B967FF] to-[#00F0FF] bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Get paid globally
              </motion.span>
              <br />
              <motion.span 
                className={`inline-block mt-1 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                in stablecoins.
              </motion.span>
              <br />
              <motion.span 
                className={`inline-block mt-1 ${
                  isDark ? 'text-white/90' : 'text-slate-800'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <span className="relative inline-block">
                  Fast.
                  <motion.span 
                    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#FF1CF7] to-transparent rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  />
                </span>
                {' '}
                <span className="relative inline-block">
                  Low-fee.
                  <motion.span 
                    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#B967FF] to-transparent rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                  />
                </span>
              </motion.span>
              <br />
              <motion.span 
                className={`inline-block mt-1 ${
                  isDark ? 'text-white/90' : 'text-slate-800'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <span className="relative inline-block">
                  Non-custodial.
                  <motion.span 
                    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#00F0FF] to-transparent rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                  />
                </span>
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${
                isDark ? 'text-white/60' : 'text-slate-600'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              Etherlink-native payment infrastructure for Asia-based freelancers and small agencies.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <MagneticButton
                onClick={handleLaunchAppClick}
                className="group relative px-10 py-4 bg-gradient-to-br from-[#497cff] via-[#2563eb] to-[#001664] text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 overflow-hidden"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-[#FF1CF7]/0 via-[#FF1CF7]/20 to-[#00F0FF]/0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <div className="relative flex items-center justify-center gap-3 text-lg font-semibold">
                  Launch App
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </MagneticButton>
              
              <MagneticButton
                onClick={() => window.open('https://www.youtube.com/watch?v=ACzGn3tIS8c', '_blank', 'noopener,noreferrer')}
                className={`group relative px-10 py-4 rounded-xl transition-all duration-500 overflow-hidden ${
                  isDark 
                    ? 'bg-gradient-to-br from-[#d1d3e2] via-[#a89dc9] to-[#75629d] text-black hover:shadow-2xl hover:shadow-purple-500/30' 
                    : 'bg-white border-2 border-slate-200 text-slate-900 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50'
                }`}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-[#FF1CF7]/0 via-[#B967FF]/10 to-[#00F0FF]/0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <div className="relative flex items-center justify-center gap-3 text-lg font-semibold">
                  <Eye className="w-5 h-5" />
                  View Demo
                </div>
              </MagneticButton>
            </motion.div>

            <motion.div 
              className={`flex items-center justify-center gap-8 pt-4 text-sm ${
                isDark ? 'text-white/40' : 'text-slate-500'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              {['No credit card', 'Open source', 'Audited smart contracts'].map((text, i) => (
                <motion.div 
                  key={text}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 + i * 0.1 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                  </motion.div>
                  <span>{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`relative py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-700 ${
          isDark 
            ? 'border-y border-white/10 bg-white/[0.02]' 
            : 'border-y border-slate-200 bg-slate-50/50'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-10">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-sm font-semibold tracking-widest uppercase ${
                isDark ? 'text-white/50' : 'text-slate-500'
              }`}
            >
              Built on Etherlink • Powered by the Tezos ecosystem
            </motion.p>
            <div className="flex items-center gap-16 flex-wrap justify-center">
              {['Etherlink', 'Tezos', 'USDC'].map((brand, i) => {
                const colors = ['#FF1CF7', '#00F0FF', '#B967FF'];
                return (
                  <motion.div
                    key={brand}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className={`group px-12 py-6 rounded-2xl transition-all duration-500 cursor-pointer ${
                      isDark 
                        ? `bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[${colors[i]}]/50 hover:bg-white/10` 
                        : `bg-white border border-slate-200 hover:border-[${colors[i]}]/50 hover:shadow-lg hover:shadow-[${colors[i]}]/10`
                    }`}
                  >
                    <span className={`font-bold text-xl tracking-wide ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {brand}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Problem Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="inline-block bg-gradient-to-r from-[#FF1CF7] via-[#B967FF] to-[#00F0FF] bg-clip-text text-transparent">
                Cross-border payments
              </span>
              <br />
              <span className={`inline-block mt-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                are broken for freelancers
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: '3–7 day settlement delays', desc: 'Traditional banking systems take days to process international payments.', color: 'FF1CF7' },
              { icon: DollarSign, title: 'High FX and remittance fees', desc: 'Banks charge 3-7% in hidden fees and unfavorable exchange rates.', color: 'FF1CF7' },
              { icon: Eye, title: 'Poor payment transparency', desc: 'Unclear payment status and unpredictable settlement times.', color: '00F0FF' },
              { icon: CreditCard, title: 'Complex crypto experience', desc: 'Existing crypto solutions are too technical for mainstream users.', color: '00F0FF' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`group relative backdrop-blur-xl p-8 rounded-2xl transition-all duration-500 cursor-pointer ${
                  isDark 
                    ? `bg-white/[0.03] border border-white/10 hover:border-[#${item.color}]/50 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-[#${item.color}]/20` 
                    : `bg-white border border-slate-200 hover:border-[#${item.color}]/50 hover:shadow-2xl hover:shadow-[#${item.color}]/10`
                }`}
              >
                <motion.div 
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    isDark 
                      ? `bg-gradient-to-br from-[#${item.color}]/20 to-[#${item.color}]/5` 
                      : `bg-gradient-to-br from-[#${item.color}]/10 to-[#${item.color}]/5`
                  }`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className={`w-8 h-8 text-[#${item.color}]`} />
                </motion.div>
                <h3 className={`text-xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {item.title}
                </h3>
                <p className={`leading-relaxed ${
                  isDark ? 'text-white/50' : 'text-slate-600'
                }`}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className={`relative py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-700 ${
        isDark ? 'bg-white/[0.02]' : 'bg-slate-50/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="inline-block bg-gradient-to-r from-[#FF1CF7] via-[#B967FF] to-[#00F0FF] bg-clip-text text-transparent">
                  A simpler way
                </span>
                <br />
                <span className={`inline-block mt-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  to get paid globally
                </span>
              </h2>
              <motion.p 
                className={`text-xl leading-relaxed ${
                  isDark ? 'text-white/60' : 'text-slate-600'
                }`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                StableLink enables freelancers and agencies to create professional stablecoin invoices in seconds. 
                Clients pay instantly with USDC, and you maintain full control of your funds.
              </motion.p>
              <motion.p 
                className={`text-xl leading-relaxed ${
                  isDark ? 'text-white/60' : 'text-slate-600'
                }`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                No more waiting days for bank transfers. Get paid the way the internet intended.
              </motion.p>
            </motion.div>

            <div className="space-y-5">
              {[
                { icon: Wallet, title: 'Stablecoin invoices (USDC)', desc: 'Create invoices denominated in USDC, eliminating currency volatility.', gradient: 'from-[#FF1CF7] to-[#B967FF]', border: 'FF1CF7' },
                { icon: Zap, title: 'Instant settlement', desc: 'Payments settle in seconds, not days—powered by Etherlink.', gradient: 'from-[#00F0FF] to-[#0099CC]', border: '00F0FF' },
                { icon: Lock, title: 'Non-custodial funds', desc: 'You control your keys. We never hold your money.', gradient: 'from-[#B967FF] to-[#8B5CF6]', border: 'B967FF' },
                { icon: Shield, title: 'Built on Etherlink', desc: 'Leveraging Etherlink\'s fast, low-cost infrastructure.', gradient: 'from-[#FF1CF7] to-[#FF1CF7]/70', border: 'FF1CF7' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, x: 10 }}
                  className={`group backdrop-blur-xl p-7 rounded-2xl transition-all duration-500 cursor-pointer ${
                    isDark 
                      ? `bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-[#${item.border}]/50 hover:shadow-2xl hover:shadow-[#${item.border}]/20` 
                      : `bg-white border border-slate-200 hover:border-[#${item.border}]/50 hover:shadow-2xl hover:shadow-[#${item.border}]/10`
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <motion.div 
                      className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <h4 className={`text-xl font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {item.title}
                      </h4>
                      <p className={isDark ? 'text-white/50' : 'text-slate-600'}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className={isDark ? 'text-white' : 'text-slate-900'}>How it </span>
              <span className="bg-gradient-to-r from-[#FF1CF7] via-[#B967FF] to-[#00F0FF] bg-clip-text text-transparent">
                works
              </span>
            </h2>
            <p className={`text-xl ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Get paid in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: CreditCard, title: 'Create an invoice', desc: 'Enter your client\'s details and payment amount. Generate a professional invoice in seconds.', gradient: 'from-[#FF1CF7] to-[#B967FF]', color: 'FF1CF7', num: '1' },
              { icon: Wallet, title: 'Client pays in USDC', desc: 'Your client pays the invoice using USDC from any compatible wallet.', gradient: 'from-[#B967FF] to-[#00F0FF]', color: 'B967FF', num: '2' },
              { icon: Zap, title: 'Withdraw instantly', desc: 'Access your funds immediately or keep them in USDC. Your choice, your control.', gradient: 'from-[#00F0FF] to-[#0099CC]', color: '00F0FF', num: '3' }
            ].map((item, i) => (
              <HowItWorksStep key={i} item={item} index={i} isDark={isDark} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className={`relative py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-700 ${
        isDark ? 'bg-white/[0.02]' : 'bg-slate-50/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className={isDark ? 'text-white' : 'text-slate-900'}>Built for </span>
              <span className="bg-gradient-to-r from-[#FF1CF7] via-[#B967FF] to-[#00F0FF] bg-clip-text text-transparent">
                modern freelancers
              </span>
            </h2>
            <p className={`text-xl ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Everything you need to get paid globally
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Instant settlement', desc: 'Payments settle in seconds on Etherlink. No more waiting days for your money.', gradient: 'from-[#FF1CF7] to-[#FF1CF7]/50', border: 'FF1CF7' },
              { icon: DollarSign, title: 'Low fees', desc: 'Pay minimal transaction fees—typically under $0.50 per payment.', gradient: 'from-[#00F0FF] to-[#00F0FF]/50', border: '00F0FF' },
              { icon: Lock, title: 'Non-custodial', desc: 'You hold the keys to your funds. We\'re infrastructure, not a bank.', gradient: 'from-[#B967FF] to-[#B967FF]/50', border: 'B967FF' },
              { icon: Globe, title: 'Asia-first focus', desc: 'Designed specifically for Asian freelancers and agencies serving global clients.', gradient: 'from-[#FF1CF7] to-[#B967FF]', border: 'FF1CF7' },
              { icon: TrendingUp, title: 'Programmable splits', desc: 'Automatically split payments between team members or subcontractors.', gradient: 'from-[#00F0FF] to-[#0099CC]', border: '00F0FF' },
              { icon: Users, title: 'Team-friendly', desc: 'Built for solo freelancers and small agencies alike. Scale as you grow.', gradient: 'from-[#B967FF] to-[#8B5CF6]', border: 'B967FF' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className={`group backdrop-blur-xl p-10 rounded-2xl transition-all duration-500 cursor-pointer ${
                  isDark 
                    ? `bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-[#${item.border}]/50 hover:shadow-2xl hover:shadow-[#${item.border}]/20` 
                    : `bg-white border border-slate-200 hover:border-[#${item.border}]/50 hover:shadow-2xl hover:shadow-[#${item.border}]/10`
                }`}
              >
                <motion.div 
                  className={`w-18 h-18 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg p-4`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {item.title}
                </h3>
                <p className={isDark ? 'text-white/60' : 'text-slate-600'}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <motion.section 
        className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            className={`relative backdrop-blur-2xl p-16 rounded-3xl overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10' 
                : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-2xl'
            }`}
            initial={{ scale: 0.9, y: 50 }}
            whileInView={{ scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated Background Gradient */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(255,28,247,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(0,240,255,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 50%, rgba(255,28,247,0.3) 0%, transparent 50%)',
                ],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            
            <div className="relative text-center space-y-8">
              <motion.h2 
                className="text-5xl md:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-[#FF1CF7] via-[#B967FF] to-[#00F0FF] bg-clip-text text-transparent">
                  Ready to get paid
                </span>
                <br />
                <span className={isDark ? 'text-white' : 'text-slate-900'}>
                  the modern way?
                </span>
              </motion.h2>
              
              <motion.p 
                className={`text-xl max-w-2xl mx-auto ${
                  isDark ? 'text-white/60' : 'text-slate-600'
                }`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Join Asian freelancers and agencies who are already receiving stablecoin payments instantly.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <MagneticButton className="group relative px-12 py-5 bg-gradient-to-br from-[#497cff] via-[#2563eb] to-[#001664] text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 overflow-hidden text-lg font-semibold">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-[#FF1CF7]/0 via-white/20 to-[#00F0FF]/0"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="relative flex items-center gap-3">
                    Create Your First Invoice
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </div>
                </MagneticButton>
              </motion.div>

              <motion.p 
                className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                No credit card required • Non-custodial • Open source
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className={`relative py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-700 ${
          isDark 
            ? 'border-t border-white/10 bg-black/50' 
            : 'border-t border-slate-200 bg-slate-50/50'
        }`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <motion.div 
              className="flex items-center justify-center gap-3 group"
              whileHover={{ scale: 1.05 }}
            >
              <img src="/favicon.svg" alt="StableLink" className="w-10 h-10 rounded-xl object-contain flex-shrink-0" />
              <span className={`text-2xl font-bold ${
                isDark 
                  ? 'bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'
              }`}>
                StableLink
              </span>
            </motion.div>
            
            <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-600'}`}>
              Etherlink-native stablecoin payment infrastructure for Asia-based freelancers and agencies
            </p>
            
            <div className="flex items-center justify-center gap-4">
              {[Github, Send, Twitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isDark 
                      ? 'text-white/50 hover:text-white hover:bg-white/10' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            
            {/* Demo Checkout Link */}
            <div className={`pt-4 pb-8 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <motion.button
                onClick={() => navigate('/checkout')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/15 text-white/70 hover:text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                View Demo Checkout Page →
              </motion.button>
            </div>
            
            <div className={`pt-8 text-sm ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
              © 2026 StableLink. All rights reserved.
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
        } />
      </Routes>
    </>
  );
}
