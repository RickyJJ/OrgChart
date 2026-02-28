import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Scroll, Award, Briefcase, Star, Search, Filter } from 'lucide-react';

const mockCurveData = [
    { year: '贞观元年', rep: 50 },
    { year: '贞观二年', rep: 55 },
    { year: '贞观三年', rep: 45 },
    { year: '贞观四年', rep: 60 },
    { year: '贞观五年', rep: 70 },
    { year: '贞观六年', rep: 65 },
    { year: '贞观七年', rep: 85 },
];

const mockPieData = [
    { name: '六部尚书', value: 40 },
    { name: '地方州牧', value: 30 },
    { name: '御史台', value: 20 },
    { name: '内阁辅臣', value: 10 },
];
const COLORS = ['#C93A3E', '#B08D57', '#4F7768', '#5E6C7D'];

const mockHistory = [
    { date: '贞观七年', title: '吏部尚书', rank: '正三品', evaluation: '上上 - 擢拔' },
    { date: '贞观五年', title: '江南道御史', rank: '正五品', evaluation: '上下 - 留任' },
    { date: '贞观三年', title: '长安县令', rank: '正六品', evaluation: '中上 - 罚俸' },
];

// Reusable card component applying the glassmorphism dark theme
const DashboardCard = ({ children, className = '' }) => (
    <div className={`bg-[#151E2B]/80 backdrop-blur-md border border-[#2A3441] rounded-xl p-5 shadow-xl transition-all duration-300 hover:bg-white/[0.03] ${className}`}>
        {children}
    </div>
);

function SimulationDashboard() {
    return (
        <div className="w-full h-full bg-[#0B111A] rounded-xl p-8 overflow-y-auto" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-[#E5E0D8] font-serif tracking-widest text-3xl font-bold m-0 mb-1">入仕模拟数据中心</h2>
                    <p className="text-[#8B9BB4] text-sm tracking-wide m-0">纵横捭阖，青云直上 —— 历代仕途数据透视</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-[#151E2B] border border-[#2A3441] text-[#E5E0D8] px-4 py-2 rounded flex items-center gap-2 hover:bg-[#2A3441] transition-colors cursor-pointer">
                        <Filter size={16} /> <span className="text-sm">朝代过滤</span>
                    </button>
                    <button className="bg-[#C93A3E] border border-transparent text-white px-5 py-2 rounded shadow-[0_0_15px_rgba(201,58,62,0.3)] hover:brightness-110 transition-all cursor-pointer font-medium tracking-widest text-sm">
                        开始新模拟
                    </button>
                </div>
            </div>

            {/* Grid Layout (Bento Box) */}
            <div className="grid grid-cols-12 gap-6">

                {/* KPI Row */}
                <DashboardCard className="col-span-12 md:col-span-3 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2 opacity-80">
                        <Scroll size={18} className="text-[#B08D57]" />
                        <span className="text-[#8B9BB4] text-sm tracking-widest">累计应试</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <div className="text-4xl font-serif text-[#E5E0D8]">12</div>
                        <div className="text-[#8B9BB4] text-sm mb-1">次</div>
                    </div>
                </DashboardCard>

                <DashboardCard className="col-span-12 md:col-span-3 flex flex-col justify-center border-l-2 !border-l-[#C93A3E]">
                    <div className="flex items-center gap-3 mb-2 opacity-80">
                        <Award size={18} className="text-[#C93A3E]" />
                        <span className="text-[#8B9BB4] text-sm tracking-widest">最高品阶</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <div className="text-3xl font-serif text-[#E5E0D8] tracking-widest">正二品</div>
                    </div>
                </DashboardCard>

                <DashboardCard className="col-span-12 md:col-span-3 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2 opacity-80">
                        <Briefcase size={18} className="text-[#4F7768]" />
                        <span className="text-[#8B9BB4] text-sm tracking-widest">历任实职</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <div className="text-4xl font-serif text-[#E5E0D8]">8</div>
                        <div className="text-[#8B9BB4] text-sm mb-1">个</div>
                    </div>
                </DashboardCard>

                <DashboardCard className="col-span-12 md:col-span-3 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2 opacity-80">
                        <Star size={18} className="text-[#B08D57]" />
                        <span className="text-[#8B9BB4] text-sm tracking-widest">解锁成就</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <div className="text-4xl font-serif text-[#E5E0D8]">15</div>
                        <div className="text-[#8B9BB4] text-sm mb-1">项</div>
                    </div>
                </DashboardCard>

                {/* Main Charts Row */}
                <DashboardCard className="col-span-12 md:col-span-8 flex flex-col h-[350px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[#E5E0D8] font-serif tracking-widest text-lg m-0">廉政治绩演变 (清流度)</h3>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRep" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C93A3E" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#C93A3E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
                                <XAxis dataKey="year" stroke="#8B9BB4" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#8B9BB4" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(21, 30, 43, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#E5E0D8' }}
                                    itemStyle={{ color: '#E5E0D8' }}
                                />
                                <Area type="monotone" dataKey="rep" stroke="#C93A3E" strokeWidth={2} fillOpacity={1} fill="url(#colorRep)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </DashboardCard>

                <DashboardCard className="col-span-12 md:col-span-4 flex flex-col h-[350px]">
                    <h3 className="text-[#E5E0D8] font-serif tracking-widest text-lg mb-2 m-0">履职机构分布</h3>
                    <div className="flex-1 w-full min-h-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mockPieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {mockPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(21, 30, 43, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#E5E0D8' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                            <span className="text-[#8B9BB4] text-xs">总计分布</span>
                            <span className="text-[#E5E0D8] font-serif text-2xl mt-1">100%</span>
                        </div>
                    </div>
                </DashboardCard>

                {/* Data Table */}
                <DashboardCard className="col-span-12 min-h-[300px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[#E5E0D8] font-serif tracking-widest text-lg m-0">最新履历纪要</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B9BB4]" size={14} />
                            <input type="text" placeholder="搜索官职..." className="bg-[#0B111A] border border-[#2A3441] rounded-full py-1.5 pl-9 pr-4 text-sm text-[#E5E0D8] placeholder-[#8B9BB4] focus:outline-none focus:border-[#C93A3E] transition-colors" />
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[#8B9BB4] text-xs uppercase tracking-widest">
                                    <th className="font-normal pb-3 pl-2">入仕年份</th>
                                    <th className="font-normal pb-3">职衔</th>
                                    <th className="font-normal pb-3">品阶</th>
                                    <th className="font-normal pb-3 text-right pr-2">吏部考评</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockHistory.map((row, i) => (
                                    <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                        <td className="py-4 pl-2 text-sm text-[#8B9BB4] group-hover:text-[#E5E0D8] transition-colors">{row.date}</td>
                                        <td className="py-4 text-[#E5E0D8] font-serif tracking-widest text-base group-hover:text-[#B08D57] transition-colors">{row.title}</td>
                                        <td className="py-4">
                                            <span className="inline-block px-2 py-1 bg-[#2A3441]/50 text-[#E5E0D8] text-xs rounded border border-[#2A3441]">{row.rank}</span>
                                        </td>
                                        <td className="py-4 text-right pr-2 text-sm text-[#4F7768] font-medium">{row.evaluation}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>

            </div>
        </div>
    );
}

export default SimulationDashboard;
