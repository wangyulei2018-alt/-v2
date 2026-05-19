import React, { useState } from 'react';
import { Download, ChevronRight, ChevronLeft, CheckCircle2, Clock, AlertCircle, Search, Filter, BarChart3, TrendingUp, AlertTriangle, ArrowUp, ArrowUpRight, ArrowDownRight, Calendar, ChevronDown, FileText, HelpCircle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  Line, ComposedChart, Cell, LabelList
} from 'recharts';

type DashboardStage = 'plan' | 'tracking' | 'midterm' | 'final' | 'assessment';
type MidtermView = 'overview' | 'alerts' | 'detail';
type DeptType = '经营单元' | '能力中心' | '职能后台';

const deptGroups: Record<DeptType, string[]> = {
  '经营单元': ['商用出行', 'EBIKE', 'SPS', '零极', '亚太地区部', '美洲地区部'],
  '能力中心': ['供应链', '服务', '质量', '信息化', '设计', '财务', '人力行政'],
  '职能后台': ['公共事务', '证券事务', '投资', '安全', '基建']
};

const panoramaBuList = ['电动价值链', '短交通价值链', '商用出行', 'SPS', 'EBIKE', '零极'];

const midtermOverviewData: Record<string, Record<string, { name: string, status: string, current: string, target: string }[]>> = {
  '电动价值链': {
    financial: [
      { name: '销量/万台', status: 'green', current: '150.5', target: '200' },
      { name: '营收/亿', status: 'green', current: '520.2', target: '600' },
      { name: 'EBIT/亿', status: 'green', current: '85.4', target: '100' },
      { name: '毛利率/%', status: 'green', current: '22.5%', target: '25%' },
      { name: '费用率/%', status: 'green', current: '10.4%', target: '12%' }
    ],
    operational: [
      { name: '品效', status: 'green', current: '15亿', target: '18亿' },
      { name: '料效', status: 'yellow', current: '85万', target: '100万' },
      { name: '存货周转天', status: 'green', current: '4.5天', target: '4天' }
    ],
    customer: [
      { name: '0MIS', status: 'green', current: '0.5%', target: '0.4%' },
      { name: '12MIS', status: 'green', current: '2.1%', target: '2.0%' },
      { name: '产品用户满意度', status: 'green', current: '4.8', target: '4.9' }
    ],
    org: [
      { name: '人效', status: 'green', current: '120万/人', target: '130万/人' },
      { name: '尖度', status: 'yellow', current: '0.8', target: '1.0' },
      { name: '厚度', status: 'green', current: '0.9', target: '1.0' },
      { name: '密度', status: 'green', current: '0.7', target: '0.8' },
      { name: '流程', status: 'green', current: '95%', target: '100%' }
    ]
  },
  '短交通价值链': {
    financial: [
      { name: '销量/万台', status: 'green', current: '85.2', target: '100' },
      { name: '营收/亿', status: 'green', current: '280.4', target: '350' },
      { name: 'EBIT/亿', status: 'green', current: '42.5', target: '50' },
      { name: '毛利率/%', status: 'green', current: '24.2%', target: '26%' },
      { name: '费用率/%', status: 'green', current: '11.2%', target: '13%' }
    ],
    operational: [
      { name: '品效', status: 'green', current: '12亿', target: '15亿' },
      { name: '料效', status: 'green', current: '92万', target: '100万' }
    ],
    customer: [
      { name: '0MIS', status: 'green', current: '0.6%', target: '0.5%' },
      { name: '产品满意度', status: 'green', current: '4.7', target: '4.8' }
    ],
    org: [
      { name: '人效', status: 'green', current: '110万/人', target: '120万/人' },
      { name: '尖度', status: 'green', current: '0.9', target: '1.0' },
      { name: '厚度', status: 'green', current: '0.85', target: '1.0' }
    ]
  },
  '商用出行': {
    financial: [
      { name: '销量/万台', status: 'green', current: '12.5', target: '15' },
      { name: '营收/亿', status: 'green', current: '45.2', target: '60' },
      { name: 'EBIT/亿', status: 'green', current: '8.4', target: '12' },
      { name: '毛利率/%', status: 'green', current: '28.5%', target: '30%' },
      { name: '费用率/%', status: 'green', current: '12.4%', target: '15%' }
    ],
    operational: [
      { name: '品效', status: 'green', current: '12亿', target: '15亿' },
      { name: '料效', status: 'yellow', current: '75万', target: '100万' },
      { name: '存货周转天', status: 'green', current: '4天', target: '3.5天' }
    ],
    customer: [
      { name: '0MIS', status: 'green', current: '0.4%', target: '0.3%' },
      { name: '12MIS', status: 'green', current: '1.8%', target: '1.5%' },
      { name: '产品用户满意度', status: 'green', current: '4.9', target: '5.0' },
      { name: '销区综合满意度', status: 'green', current: '4.8', target: '4.9' }
    ],
    org: [
      { name: '人效', status: 'yellow', current: '95万/人', target: '110万/人' },
      { name: '尖度', status: 'yellow', current: '0.75', target: '0.9' },
      { name: '厚度', status: 'yellow', current: '0.8', target: '1.0' },
      { name: '密度', status: 'yellow', current: '0.65', target: '0.8' },
      { name: '流程', status: 'green', current: '90%', target: '95%' }
    ]
  },
  'SPS': {
    financial: [
      { name: '销量/万台', status: 'green', current: '5.4', target: '6' },
      { name: '营收/亿', status: 'green', current: '38.2', target: '40' },
      { name: 'EBIT/亿', status: 'green', current: '7.2', target: '8' },
      { name: '毛利率/%', status: 'green', current: '24.2%', target: '25%' },
      { name: '费用率/%', status: 'green', current: '11.5%', target: '13%' }
    ],
    operational: [
      { name: '存货周转天', status: 'yellow', current: '6天', target: '5天' },
      { name: '交付及时率', status: 'green', current: '98%', target: '95%' }
    ],
    customer: [
      { name: '0MIS', status: 'yellow', current: '0.8%', target: '0.5%' },
      { name: '3MIS', status: 'yellow', current: '1.5%', target: '1.2%' },
      { name: '12MIS', status: 'yellow', current: '2.9%', target: '2.5%' },
      { name: '产品满意度', status: 'yellow', current: '4.6', target: '4.8' },
      { name: '服务满意度', status: 'yellow', current: '4.0', target: '4.2' }
    ],
    org: [
      { name: '人效', status: 'green', current: '105万/人', target: '100万/人' },
      { name: '尖度', status: 'green', current: '1.1', target: '1.0' }
    ]
  },
  'EBIKE': {
    financial: [
      { name: '销量/万台', status: 'yellow', current: '8.2', target: '10' },
      { name: '营收/亿', status: 'red', current: '32.5', target: '50' },
      { name: 'EBIT/亿', status: 'green', current: '4.2', target: '6' },
      { name: '毛利率/%', status: 'yellow', current: '25.4%', target: '28%' },
      { name: '费用率/%', status: 'green', current: '14.2%', target: '16%' }
    ],
    operational: [
      { name: '品效', status: 'yellow', current: '8亿', target: '12亿' },
      { name: '料效', status: 'yellow', current: '65万', target: '80万' },
      { name: '供效', status: 'yellow', current: '150W', target: '200W' },
      { name: '存货周转', status: 'yellow', current: '12天', target: '8天' }
    ],
    customer: [
      { name: '0MIS', status: 'yellow', current: '1.2%', target: '0.8%' },
      { name: '3MIS', status: 'green', current: '2.1%', target: '2.5%' },
      { name: '12MIS', status: 'yellow', current: '4.5%', target: '3.5%' },
      { name: '产品满意度', status: 'green', current: '4.2', target: '4.0' },
      { name: '服务满意度', status: 'yellow', current: '3.8', target: '4.2' }
    ],
    org: [
      { name: '人效', status: 'red', current: '80万/人', target: '100万/人' },
      { name: '尖度', status: 'red', current: '0.6', target: '0.8' },
      { name: '厚度', status: 'red', current: '0.5', target: '0.8' },
      { name: '密度', status: 'red', current: '0.4', target: '0.7' },
      { name: '培养', status: 'red', current: '20%', target: '50%' },
      { name: '机制流程', status: 'red', current: '60%', target: '90%' }
    ]
  },
  '零极': {
    financial: [
      { name: '销量/万台', status: 'green', current: '/', target: '/' },
      { name: '营收/亿', status: 'yellow', current: '22.4', target: '30' },
      { name: 'EBIT/亿', status: 'green', current: '3.5', target: '5' },
      { name: '毛利率/%', status: 'green', current: '18.5%', target: '20%' },
      { name: '费用率/%', status: 'green', current: '15.2%', target: '18%' }
    ],
    operational: [
      { name: '研发周期', status: 'green', current: '180天', target: '200天' },
      { name: '专利申请数', status: 'green', current: '45', target: '40' }
    ],
    customer: [
      { name: '营收加权满意度CSP', status: 'green', current: '4.5', target: '4.6' }
    ],
    org: [
      { name: '尖度', status: 'green', current: '1.2', target: '1.0' },
      { name: '人才保留', status: 'green', current: '95%', target: '90%' },
      { name: '密度', status: 'green', current: '0.9', target: '0.8' }
    ]
  },
  '亚太地区部': {
    financial: [
      { name: '销量/万台', status: 'green', current: '4.2', target: '5' },
      { name: '营收/亿', status: 'green', current: '18.5', target: '20' },
      { name: 'EBIT/亿', status: 'green', current: '2.4', target: '3' },
      { name: '毛利率/%', status: 'green', current: '16.5%', target: '18%' },
      { name: '费用率/%', status: 'green', current: '10.2%', target: '12%' }
    ],
    operational: [
      { name: '运营周期', status: 'green', current: '45天', target: '50天' },
      { name: '库存周转', status: 'green', current: '30天', target: '35天' }
    ],
    customer: [
      { name: '用户满意度', status: 'green', current: '4.6', target: '4.5' },
      { name: '渠道覆盖率', status: 'green', current: '85%', target: '80%' }
    ],
    org: [
      { name: '尖度', status: 'green', current: '0.95', target: '0.9' },
      { name: '人才保留', status: 'green', current: '92%', target: '90%' }
    ]
  },
  '美洲地区部': {
    financial: [
      { name: '销量/万台', status: 'green', current: '2.1', target: '3' },
      { name: '营收/亿', status: 'yellow', current: '8.4', target: '10' },
      { name: 'EBIT/亿', status: 'green', current: '1.2', target: '1.5' },
      { name: '毛利率/%', status: 'green', current: '14.2%', target: '15%' },
      { name: '费用率/%', status: 'green', current: '12.5%', target: '14%' }
    ],
    operational: [
      { name: '物流准时率', status: 'green', current: '95%', target: '92%' },
      { name: '清关周期', status: 'yellow', current: '5天', target: '3天' }
    ],
    customer: [
      { name: '3MIS', status: 'yellow', current: '1.2%', target: '1.0%' },
      { name: '客户满意度', status: 'green', current: '4.7', target: '4.5' }
    ],
    org: [
      { name: '尖度', status: 'green', current: '0.85', target: '0.8' },
      { name: '架构/机制流程', status: 'green', current: '85%', target: '80%' }
    ]
  },
  // 能力中心
  '供应链': { 
    financial: [
      { name: '成本节约/亿', status: 'green', current: '1.2', target: '1.5' },
      { name: '采购总额/亿', status: 'green', current: '45.2', target: '50' }
    ], 
    operational: [{ name: '供效', status: 'green', current: '92%', target: '95%' }], 
    customer: [{ name: '供应商满意度', status: 'green', current: '4.8', target: '4.5' }], 
    org: [{ name: '人效', status: 'green', current: '110万/人', target: '100万/人' }] 
  },
  '服务': { 
    financial: [
      { name: '服务收入/亿', status: 'yellow', current: '0.8', target: '1.2' },
      { name: '保修支出/亿', status: 'green', current: '0.4', target: '0.5' }
    ], 
    operational: [{ name: '服务响应', status: 'yellow', current: '2.5h', target: '2h' }], 
    customer: [{ name: '用户净推荐值', status: 'green', current: '75%', target: '70%' }], 
    org: [{ name: '服务人员密度', status: 'green', current: '0.85', target: '0.8' }] 
  },
  '质量': { 
    financial: [
      { name: '质量损失/亿', status: 'green', current: '0.15', target: '0.2' }
    ], 
    operational: [{ name: '质量达标', status: 'green', current: '99.5%', target: '99%' }], 
    customer: [{ name: '0MIS', status: 'green', current: '0.45%', target: '0.5%' }], 
    org: [{ name: '质量专家占比', status: 'green', current: '15%', target: '12%' }] 
  },
  '信息化': { 
    financial: [
      { name: 'IT投入/亿', status: 'green', current: '0.45', target: '0.6' }
    ], 
    operational: [{ name: '系统可用性', status: 'green', current: '99.99%', target: '99.9%' }], 
    customer: [{ name: '内部用户满意度', status: 'green', current: '4.7', target: '4.5' }], 
    org: [{ name: '数字化人才密度', status: 'green', current: '0.25', target: '0.2' }] 
  },
  '设计': { 
    financial: [
      { name: '设计费用/亿', status: 'yellow', current: '0.25', target: '0.3' }
    ], 
    operational: [{ name: '设计产出', status: 'yellow', current: '12个/月', target: '15个/月' }], 
    customer: [{ name: '设计获奖数', status: 'green', current: '3', target: '2' }], 
    org: [{ name: '设计师厚度', status: 'green', current: '0.8', target: '0.8' }] 
  },
  '财务': { 
    financial: [
      { name: '融资成本/%', status: 'green', current: '4.2%', target: '4.5%' },
      { name: '资金周转率', status: 'green', current: '12.5', target: '12' }
    ], 
    operational: [{ name: '预算执行', status: 'red', current: '105%', target: '100%' }], 
    customer: [{ name: '审计合规性', status: 'green', current: '100%', target: '100%' }], 
    org: [{ name: '财务BP密度', status: 'green', current: '0.15', target: '0.12' }] 
  },
  '人力行政': { 
    financial: [
      { name: '管理费用/亿', status: 'green', current: '0.85', target: '1.0' }
    ], 
    operational: [{ name: '招聘达成', status: 'green', current: '95%', target: '90%' }], 
    customer: [{ name: '员工敬业度', status: 'green', current: '4.5', target: '4.2' }], 
    org: [{ name: '人才厚度', status: 'green', current: '0.9', target: '0.8' }] 
  },
  // 职能后台
  '公共事务': { 
    financial: [{ name: '公关预算/亿', status: 'green', current: '0.12', target: '0.15' }], 
    operational: [{ name: '媒体覆盖', status: 'green', current: '500+', target: '400' }], 
    customer: [{ name: '公关事件', status: 'green', current: '0', target: '0' }], 
    org: [{ name: '团队密度', status: 'green', current: '0.8', target: '0.8' }] 
  },
  '证券事务': { 
    financial: [{ name: '信披费用/万', status: 'green', current: '45', target: '50' }], 
    operational: [{ name: '信披及时率', status: 'green', current: '100%', target: '100%' }], 
    customer: [{ name: '合规披露', status: 'green', current: '100%', target: '100%' }], 
    org: [{ name: '专业资格率', status: 'green', current: '100%', target: '100%' }] 
  },
  '投资': { 
    financial: [{ name: '投资额/亿', status: 'yellow', current: '4.5', target: '5.0' }], 
    operational: [{ name: '项目过会率', status: 'green', current: '85%', target: '80%' }], 
    customer: [{ name: '投资回报', status: 'yellow', current: '12%', target: '15%' }], 
    org: [{ name: '投资经理厚度', status: 'green', current: '0.7', target: '0.7' }] 
  },
  '安全': { 
    financial: [{ name: '安全投入/万', status: 'green', current: '120', target: '150' }], 
    operational: [{ name: '安全检查次数', status: 'green', current: '24', target: '20' }], 
    customer: [{ name: '安全事故', status: 'green', current: '0', target: '0' }], 
    org: [{ name: '安全员覆盖率', status: 'green', current: '100%', target: '100%' }] 
  },
  '基建': { 
    financial: [{ name: '工程预算/亿', status: 'red', current: '2.5', target: '2.0' }], 
    operational: [{ name: '工程质量', status: 'green', current: '100%', target: '100%' }], 
    customer: [{ name: '工程进度', status: 'red', current: '85%', target: '100%' }], 
    org: [{ name: '项目经理厚度', status: 'green', current: '0.8', target: '0.8' }] 
  }
};

export const DepartmentDashboard: React.FC = () => {
  const [stage, setStage] = useState<DashboardStage>('plan');
  const [midtermView, setMidtermView] = useState<MidtermView>('overview');
  const [targetType, setTargetType] = useState<'3pt' | '5pt'>('3pt');
  const [midtermDeptType, setMidtermDeptType] = useState<DeptType>('经营单元');
  const [trackingBuPage, setTrackingBuPage] = useState(0);
  const [liveBuPage, setLiveBuPage] = useState(0);
  const [alertsPage, setAlertsPage] = useState(0);
  const [activeBu, setActiveBu] = useState('EBIKE事业部');
  const [showAllIndicators, setShowAllIndicators] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showScoreHelp, setShowScoreHelp] = useState(false);
  
  // Modal state for indicator details
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDeptInfo, setSelectedDeptInfo] = useState<{ name: string, light: string } | null>(null);

  const buList = ['商用出行事业部', 'EBIKE事业部', 'SPS事业部', '零极创新事业部', '亚太地区部', '美洲地区部', '供应链', '服务', '质量', '信息化', '设计', '财务', '人力行政', '公共事务', '证券事务', '投资', '安全', '基建'];

  // --- Mock Data for Light Distribution (Department Based) ---
  const allDepts = [...deptGroups['经营单元'], ...deptGroups['能力中心'], ...deptGroups['职能后台']];
  
  const generateMockLightData = (depts: string[]) => {
    const data = depts.map(dept => {
      const hash = dept.length;
      const green = 10 + (hash % 15);
      const blue = 5 + (hash % 10);
      const yellow = 2 + (hash % 8);
      const red = 1 + (hash % 5);
      const total = green + blue + yellow + red;
      
      return {
        name: dept,
        绿灯: Number(((green / total) * 100).toFixed(1)),
        蓝灯: Number(((blue / total) * 100).toFixed(1)),
        黄灯: Number(((yellow / total) * 100).toFixed(1)),
        红灯: Number(((red / total) * 100).toFixed(1)),
        绿灯Count: green,
        蓝灯Count: blue,
        黄灯Count: yellow,
        红灯Count: red,
        totalCount: total,
        counts: { 绿灯: green, 蓝灯: blue, 黄灯: yellow, 红灯: red }
      };
    });

    // Sort by "worst first": Red % desc, then Yellow % desc, then Blue % desc, then Green % desc
    return data.sort((a, b) => {
      if (b.红灯 !== a.红灯) return b.红灯 - a.红灯;
      if (b.黄灯 !== a.黄灯) return b.黄灯 - a.黄灯;
      if (b.蓝灯 !== a.蓝灯) return b.蓝灯 - a.蓝灯;
      return b.绿灯 - a.绿灯;
    });
  };

  const departmentLightData = {
    '全部部门': generateMockLightData(allDepts),
    '经营单元': generateMockLightData(deptGroups['经营单元']),
    '能力中心': generateMockLightData(deptGroups['能力中心']),
    '职能后台': generateMockLightData(deptGroups['职能后台'])
  };

  const [lightFilter, setLightFilter] = useState('全部部门');

  const handleBarClick = (data: any, dataKey: string) => {
    if (data && data.name) {
      setSelectedDeptInfo({ name: data.name, light: dataKey });
      setModalOpen(true);
    }
  };

  const IndicatorModal = () => {
    if (!modalOpen || !selectedDeptInfo) return null;

    const { name, light } = selectedDeptInfo;
    
    // Generate mock data for the modal based on department and color
    const generateIndicators = () => {
      const categories = ['财务指标', '客户指标', '运营指标', '组织发展'];
      const metrics = {
        '绿灯': ['销量达成率', '营收增长', '品效', '核心人才保留'],
        '蓝灯': ['毛利率', '3MIS', '存货周转', '机制流程'],
        '黄灯': ['EBIT', '产品满意度', '交付及时率', '培养计划'],
        '红灯': ['客诉率', '0MIS', '成本控制', '项目经理厚度']
      };

      return Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        category: categories[i % categories.length],
        name: `${metrics[light as keyof typeof metrics][i % 4]}-${i + 1}`,
        target: light === '红灯' ? '98%' : '90%',
        actual: light === '红灯' ? '45%' : '92%',
        progress: light === '红灯' ? '46%' : '100%',
        status: light.replace('灯', ''),
        reason: light === '红灯' ? '资源配置不足，市场竞争加剧导致指标异常。' : '-'
      }));
    };

    const indicators = generateIndicators();
    const lightColors: Record<string, string> = {
      '红灯': 'bg-red-500',
      '黄灯': 'bg-amber-400',
      '蓝灯': 'bg-blue-500',
      '绿灯': 'bg-emerald-500'
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${lightColors[light]}`}></div>
              <h3 className="text-lg font-bold text-slate-800">
                {name} - {light}指标详情
              </h3>
            </div>
            <button 
              onClick={() => setModalOpen(false)}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <ChevronDown className="rotate-180" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200">
                  <th className="py-3 px-4 text-left text-[12px] font-bold text-slate-600">指标分类</th>
                  <th className="py-3 px-4 text-left text-[12px] font-bold text-slate-600">指标名称</th>
                  <th className="py-3 px-4 text-left text-[12px] font-bold text-slate-600">3分目标</th>
                  <th className="py-3 px-4 text-left text-[12px] font-bold text-slate-600">完成情况</th>
                  <th className="py-3 px-4 text-left text-[12px] font-bold text-slate-600">完成进度</th>
                  <th className="py-3 px-4 text-center text-[12px] font-bold text-slate-600">红黄蓝绿灯</th>
                  <th className="py-3 px-4 text-left text-[12px] font-bold text-slate-600">原因说明</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {indicators.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-[12px] text-slate-500 font-medium">{item.category}</td>
                    <td className="py-3 px-4 text-[12px] text-slate-800 font-black">{item.name}</td>
                    <td className="py-3 px-4 text-[12px] text-slate-600">{item.target}</td>
                    <td className="py-3 px-4 text-[12px] text-slate-600">{item.actual}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${lightColors[light]}`} 
                            style={{ width: item.progress }}
                          ></div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">{item.progress}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 flex justify-center">
                      <div className={`w-3 h-3 rounded-full ${lightColors[light]} shadow-sm`}></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-[200px] truncate text-[11px] text-slate-400" title={item.reason}>
                        {item.reason}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button 
              onClick={() => setModalOpen(false)}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold text-[13px] hover:bg-slate-700 transition-colors shadow-md active:scale-95"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- Mock Data ---

  // 1. Tracking Stage (Group Level Metrics)
  const trackingTopMetrics = [
    { id: 1, name: '营收/亿', dept: '财务', target: 150, current: 45, unit: '亿', progress: 30, status: 'normal' },
    { id: 2, name: 'EBIT', dept: '财务', target: 20, current: 5, unit: '亿', progress: 25, status: 'normal' },
    { id: 3, name: '供效', dept: '供应链', target: 95, current: 80, unit: '%', progress: 84, status: 'warning' },
    { id: 4, name: '品效', dept: '总办', target: 90, current: 85, unit: '%', progress: 94, status: 'normal' },
  ];

  const trackingGaugeMetrics = [
    { id: 5, name: '在保服务成本率', dept: '服务', targetStr: '< 5%', currentStr: '4.5%', value: 4.5, max: 10, status: 'green', empty: false },
    { id: 6, name: '抱怨率', dept: '质量', targetStr: '< 2%', currentStr: '1.8%', value: 1.8, max: 5, status: 'green', empty: false },
    { id: 7, name: '3mis/12mis', dept: '质量', targetStr: '< 3%', currentStr: '2.5%', value: 2.5, max: 6, status: 'green', empty: false },
    { id: 8, name: '存货周转天数', dept: '财务', targetStr: '30天', currentStr: '35天', value: 35, max: 60, status: 'red', empty: false },
    { id: 9, name: '料效', dept: '研发管理', targetStr: '95%', currentStr: '--', value: 0, max: 100, status: 'gray', empty: true },
    { id: 10, name: '人效', dept: '人力', targetStr: '120万', currentStr: '--', value: 0, max: 200, status: 'gray', empty: true },
  ];

  // 2. Plan Stage (Panorama)
  const planData = {
    '商用出行事业部': {
      financial: [{ name: '营收达成（亿）', target: '60' }, { name: '毛利率（%）', target: '30' }],
      operational: [{ name: '交付及时率（%）', target: '98' }, { name: '库存周转（天）', target: '30' }],
      customer: [{ name: '市占率（%）', target: '28' }, { name: '客诉率（%）', target: '0.4' }],
      org: [{ name: '人效（万/人）', target: '120' }, { name: '关键人才保留', target: '核心人才流失率<5%' }]
    },
    'EBIKE事业部': {
      financial: [{ name: '营收达成（亿）', target: '50' }, { name: '毛利率（%）', target: '28' }],
      operational: [{ name: '交付及时率（%）', target: '95' }, { name: '库存周转（天）', target: '35' }],
      customer: [{ name: '市占率（%）', target: '25' }, { name: '客诉率（%）', target: '0.5' }],
      org: [{ name: '人效（万/人）', target: '110' }, { name: '关键人才保留', target: '核心人才流失率<5%' }]
    },
    'SPS事业部': {
      financial: [{ name: '营收达成（亿）', target: '40' }, { name: '毛利率（%）', target: '25' }],
      operational: [{ name: '交付及时率（%）', target: '90' }, { name: '库存周转（天）', target: '40' }],
      customer: [{ name: '市占率（%）', target: '20' }, { name: '客诉率（%）', target: '0.8' }],
      org: [{ name: '人效（万/人）', target: '100' }, { name: '关键人才保留', target: '核心人才流失率<8%' }]
    },
    '零极创新事业部': {
      financial: [{ name: '营收达成（亿）', target: '30' }, { name: '毛利率（%）', target: '20' }],
      operational: [{ name: '交付及时率（%）', target: '85' }, { name: '库存周转（天）', target: '45' }],
      customer: [{ name: '市占率（%）', target: '15' }, { name: '客诉率（%）', target: '1.0' }],
      org: [{ name: '人效（万/人）', target: '90' }, { name: '关键人才保留', target: '核心人才流失率<10%' }]
    },
    '亚太地区部': {
      financial: [{ name: '营收达成（亿）', target: '20' }, { name: '毛利率（%）', target: '18' }],
      operational: [{ name: '交付及时率（%）', target: '80' }, { name: '库存周转（天）', target: '50' }],
      customer: [{ name: '市占率（%）', target: '10' }, { name: '客诉率（%）', target: '1.2' }],
      org: [{ name: '人效（万/人）', target: '80' }, { name: '关键人才保留', target: '核心人才流失率<12%' }]
    },
    '美洲地区部': {
      financial: [{ name: '营收达成（亿）', target: '10' }, { name: '毛利率（%）', target: '15' }],
      operational: [{ name: '交付及时率（%）', target: '75' }, { name: '库存周转（天）', target: '55' }],
      customer: [{ name: '市占率（%）', target: '5' }, { name: '客诉率（%）', target: '1.5' }],
      org: [{ name: '人效（万/人）', target: '70' }, { name: '关键人才保留', target: '核心人才流失率<15%' }]
    }
  };

  // 3. Midterm Stage (Alerts)
  const redAlerts = [
    { id: 1, category: '财务指标', dept: 'EBIKE事业部', metric: '营收达成（亿）', target: '50', actual: '18.5', progress: 37, reason: '-' },
    { id: 2, category: '客户指标', dept: '欧洲地区部', metric: '客诉率（%）', target: '1.2', actual: '2.5', progress: 48, reason: '维修周期(TAT)仍然过长；各维修中心(RCs)技师短缺；新认证客服专员(CCC)仍在培训中。' },
    { id: 3, category: '客户指标', dept: '商用出行事业部', metric: '市占率（%）', target: '28', actual: '9.2', progress: 33, reason: '1、收入进度缓慢，当前锁单完成4100万，Doordash第一批订单出现质量问题；2、新业务资源和团队搭建未完成。' },
    { id: 4, category: '运营指标', dept: '欧洲地区部', metric: '库存周转（天）', target: '45', actual: '65', progress: 0, reason: '高成本原因：业务量增加；维修人员短缺；历史CBM索赔结算。' },
    { id: 5, category: '组织发展', dept: 'EBIKE事业部', metric: '关键人才保留', target: '核心人才流失率<5%', actual: '8%', progress: 30, reason: '1.海外团队第一负责人缺失；2.机电负责人方向调整；3.GTM负责人不确定；4.欧洲招聘暂未启动。' },
  ];

  // 4. Assessment Stage
  const assessmentData = [
    { 
      id: 1, dept: '商用出行事业部', head: '张三', committee: '李四', 
      selfScore: 4.5, selfGrade: 'A', finalScore: 4.2, finalGrade: 'B+', 
      committeeReviewGrade: 'A', lastYearGrade: 'B+', 
      personSelfScore: 4.4, personSelfGrade: 'A', superiorScore: 4.3, superiorGrade: 'A', 
      personCommitteeGrade: 'A', personFinalGrade: 'A', personLastYearGrade: 'B+'
    },
    { 
      id: 2, dept: 'EBIKE事业部', head: '王五', committee: '赵六', 
      selfScore: 3.8, selfGrade: 'B+', finalScore: 3.9, finalGrade: 'B+', 
      committeeReviewGrade: 'B+', lastYearGrade: 'B',
      personSelfScore: 4.0, personSelfGrade: 'B+', superiorScore: 3.9, superiorGrade: 'B+', 
      personCommitteeGrade: 'B+', personFinalGrade: 'B+', personLastYearGrade: 'B'
    },
    { 
      id: 3, dept: 'SPS事业部', head: '孙七', committee: '周八', 
      selfScore: 4.2, selfGrade: 'A', finalScore: 4.4, finalGrade: 'A', 
      committeeReviewGrade: 'A', lastYearGrade: 'A-',
      personSelfScore: 4.2, personSelfGrade: 'A', superiorScore: 4.1, superiorGrade: 'A', 
      personCommitteeGrade: 'A', personFinalGrade: 'A', personLastYearGrade: 'A'
    },
    { 
      id: 4, dept: '零极创新事业部', head: '吴九', committee: '郑十', 
      selfScore: 2.5, selfGrade: 'C', finalScore: 2.8, finalGrade: 'C', 
      committeeReviewGrade: 'C', lastYearGrade: 'C',
      personSelfScore: 3.2, personSelfGrade: 'B', superiorScore: 3.0, superiorGrade: 'B', 
      personCommitteeGrade: 'C', personFinalGrade: 'C', personLastYearGrade: 'C'
    },
    { 
      id: 5, dept: '财务中心', head: '钱十一', committee: '李四', 
      selfScore: 4.8, selfGrade: 'S', finalScore: 4.7, finalGrade: 'S', 
      committeeReviewGrade: 'S', lastYearGrade: 'S',
      personSelfScore: 4.7, personSelfGrade: 'S', superiorScore: 4.8, superiorGrade: 'S', 
      personCommitteeGrade: 'S', personFinalGrade: 'S', personLastYearGrade: 'S'
    },
    { 
      id: 6, dept: '供应链中心', head: '周十二', committee: '赵六', 
      selfScore: 4.0, selfGrade: 'A', finalScore: 4.1, finalGrade: 'A', 
      committeeReviewGrade: 'A', lastYearGrade: 'B+',
      personSelfScore: 3.9, personSelfGrade: 'B+', superiorScore: 4.0, superiorGrade: 'A', 
      personCommitteeGrade: 'A', personFinalGrade: 'A', personLastYearGrade: 'B+'
    },
    { 
      id: 7, dept: '人力中心', head: '吴十三', committee: '周八', 
      selfScore: 3.1, selfGrade: 'B', finalScore: 3.2, finalGrade: 'B', 
      committeeReviewGrade: 'B', lastYearGrade: 'B',
      personSelfScore: 3.5, personSelfGrade: 'B+', superiorScore: 3.3, superiorGrade: 'B', 
      personCommitteeGrade: 'B', personFinalGrade: 'B', personLastYearGrade: 'B'
    },
    { 
      id: 8, dept: '质量中心', head: '郑十四', committee: '郑十', 
      selfScore: 1.5, selfGrade: 'D', finalScore: 1.8, finalGrade: 'D', 
      committeeReviewGrade: 'D', lastYearGrade: 'C-',
      personSelfScore: 2.1, personSelfGrade: 'C', superiorScore: 2.3, superiorGrade: 'C', 
      personCommitteeGrade: 'D', personFinalGrade: 'D', personLastYearGrade: 'C'
    },
  ];

  const personGrades = ['S', 'A', 'B+', 'B', 'C', 'D'];
  const personGradeStats = personGrades.map(grade => {
    const count = assessmentData.filter(d => d.personFinalGrade === grade).length;
    const percentage = assessmentData.length > 0 ? (count / assessmentData.length * 100).toFixed(1) : '0.0';
    return { grade, count, percentage };
  });


  const HalfGauge: React.FC<{ metric: typeof trackingGaugeMetrics[0] }> = ({ metric }) => {
    const radius = 40;
    const circumference = Math.PI * radius;
    const percent = metric.empty ? 0 : Math.min(Math.max(metric.value / metric.max, 0), 1);
    const strokeDashoffset = circumference - percent * circumference;
    
    const colorClass = metric.empty ? 'text-slate-200' : 
                       metric.status === 'green' ? 'text-emerald-500' : 
                       metric.status === 'red' ? 'text-red-500' : 'text-amber-500';

    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
        <div className="text-[11px] font-bold text-slate-700 mb-2">{metric.name}</div>
        
        <div className="relative w-24 h-12 overflow-hidden mb-1">
          <svg className="w-24 h-24 transform -rotate-180" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" strokeDasharray={`${circumference} ${circumference}`} />
            {!metric.empty && (
              <circle 
                cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={`${circumference} ${circumference}`} 
                strokeDashoffset={strokeDashoffset} 
                className={`${colorClass} transition-all duration-1000 ease-out`} 
                strokeLinecap="round" 
              />
            )}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-0.5">
            <span className={`text-lg font-bold leading-none ${metric.empty ? 'text-slate-300' : 'text-slate-800'}`}>
              {metric.currentStr}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-1 mt-1">
          <div className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
            目标: <span className="font-bold text-slate-700">{metric.targetStr}</span>
          </div>
          {metric.empty && (
            <div className="text-[10px] text-blue-500 flex items-center gap-1 mt-0.5 bg-blue-50 px-2 py-0.5 rounded-full">
              <Clock size={10} /> 数据采集中
            </div>
          )}
        </div>
      </div>
    );
  };
  const PanoramaMatrix = ({ type }: { type: 'plan' | 'tracking' }) => {
    const financialRows = [
      { id: 'sales', label: '销量', highlight: true },
      { id: 'revenue', label: '营收', highlight: true },
      { id: 'ebit', label: 'EBIT', highlight: true },
      { id: 'margin', label: '毛利率' },
      { id: 'expense', label: '费用率' },
    ];

    const customerRows = [
      { id: '0mis', label: '0MIS' },
      { id: '3mis', label: '3MIS' },
      { id: '12mis', label: '12MIS' },
      { id: 'cust_sat', label: '产品用户满意度' },
      { id: 'sales_sat', label: '销区综合满意度' },
      { id: 'sat', label: '产品满意度' },
      { id: 'srv_sat', label: '服务满意度' },
      { id: 'progress', label: '工程进度' },
    ];

    const operationalRows = [
      { id: 'prod_eff', label: '品效' },
      { id: 'mat_eff', label: '料效' },
      { id: 'inv_turn', label: '存货周转天' },
      { id: 'deliv_rate', label: '交付及时率' },
      { id: 'supply_eff', label: '供效' },
      { id: 'eng_qual', label: '工程质量' },
    ];

    const orgRows = [
      { id: 'person_eff', label: '人效' },
      { id: 'peak', label: '尖度' },
      { id: 'depth', label: '厚度' },
      { id: 'density', label: '密度' },
      { id: 'process', label: '流程' },
      { id: 'training', label: '培养' },
      { id: 'mech_proc', label: '机制流程' },
      { id: 'pm_depth', label: '项目经理厚度' },
    ];

    const getMetricData = (buName: string, category: string, rowLabel: string) => {
      const buData = midtermOverviewData[buName as keyof typeof midtermOverviewData];
      if (!buData) return null;
      const metrics = buData[category as keyof typeof buData] || [];
      
      let baseMetric = metrics.find(m => m.name.toLowerCase().includes(rowLabel.toLowerCase()) || rowLabel.toLowerCase().includes(m.name.toLowerCase().split('/')[0]));
      
      if (baseMetric && targetType === '5pt') {
        const val = parseFloat(baseMetric.target.replace(/[^\d.]/g, ''));
        if (!isNaN(val)) {
          const suffix = baseMetric.target.includes('%') ? '%' : (baseMetric.target.includes('万') ? '万台' : (baseMetric.target.includes('亿') ? '亿' : ''));
          return { ...baseMetric, target: `${(val * 1.2).toFixed(1)}${suffix}` };
        }
      }
      
      return baseMetric;
    };

    const calculateProgress = (current: string, target: string) => {
      if (!current || !target || current === '/' || target === '/') return 0;
      const cur = parseFloat(current.replace(/[^\d.]/g, ''));
      const tar = parseFloat(target.replace(/[^\d.]/g, ''));
      if (isNaN(cur) || isNaN(tar) || tar === 0) return 0;
      return Math.min(100, Math.round((cur / tar) * 100));
    };

    const StatusDot = ({ status }: { status?: string }) => {
      if (!status) return null;
      const colors = {
        green: 'bg-emerald-500',
        yellow: 'bg-amber-400',
        red: 'bg-red-500',
        blue: 'bg-blue-500'
      };
      const colorClass = colors[status as keyof typeof colors] || colors.blue;
      
      return (
        <div className={`w-2 h-2 rounded-full shrink-0 ${colorClass}`}></div>
      );
    };

    const renderSectionRows = (title: string, color: string, rows: { id: string, label: string, highlight?: boolean }[], category: string) => {
      const bgColors: Record<string, string> = {
        orange: 'bg-orange-50 border-orange-100 text-orange-700 font-black',
        blue: 'bg-blue-50 border-blue-100 text-blue-700 font-black',
        emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700 font-black',
        indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700 font-black'
      };
      const colorTheme = bgColors[color] || bgColors.blue;

      return (
        <div className="flex border-b border-slate-100 last:border-b-0">
          <div className={`sticky left-0 z-20 ${colorTheme} border-r shrink-0 w-20 flex flex-col items-center justify-center px-1 text-center text-[10px] uppercase leading-tight select-none`}>
            {title.split('').map((char, i) => <span key={i}>{char}</span>)}
          </div>
          
          <div className="flex-1 flex flex-col min-w-0">
            {rows.map((row) => {
              // Ensure we check all BUs if this row should even be visible (some might be empty for all)
              const hasDataAcrossBUs = panoramaBuList.some(bu => getMetricData(bu, category, row.label));
              if (!hasDataAcrossBUs) return null;

              return (
                <div key={row.id} className="flex border-b border-slate-100 last:border-b-0 group hover:bg-slate-50/50 transition-colors">
                  <div className="sticky left-20 z-20 bg-white border-r border-slate-200 shrink-0 w-32 flex min-h-[32px] items-center justify-center px-2 text-[10px] font-bold text-slate-500 text-center leading-tight">
                    <span className={row.highlight ? 'text-red-600' : ''}>{row.label}</span>
                  </div>
                  <div className="flex flex-1 min-w-0">
                    {panoramaBuList.map(bu => {
                      const metric = getMetricData(bu, category, row.label);
                      const progress = metric ? calculateProgress(metric.current, metric.target) : 0;
                      return (
                        <div key={bu} className={`flex-1 min-w-[120px] border-r border-slate-100 flex flex-col items-center justify-center px-2 py-1 ${row.highlight ? 'bg-orange-50/20' : ''}`}>
                          {!metric ? (
                            <span className="text-slate-300 text-[10px]">/</span>
                          ) : (
                            <div className="flex flex-col items-center w-full">
                              {type === 'plan' ? (
                                <span className={`text-[10px] font-bold ${row.highlight ? 'text-slate-900' : 'text-slate-700'}`}>
                                  {metric.target}
                                </span>
                              ) : (
                                <div className="flex flex-col w-full px-1">
                                  <div className="flex items-center justify-between w-full mb-0.5">
                                    <div className="flex items-baseline gap-0.5">
                                      <span className={`text-[10px] font-bold ${row.highlight ? 'text-slate-900' : 'text-slate-700'}`}>
                                        {metric.current || '/'}
                                      </span>
                                      <span className="text-[8px] text-slate-400">/ {metric.target}</span>
                                    </div>
                                    <StatusDot status={metric.status} />
                                  </div>
                                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden relative">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-1000 ${
                                        metric.status === 'red' ? 'bg-red-500' : 
                                        metric.status === 'yellow' ? 'bg-amber-400' : 'bg-emerald-500'
                                      }`}
                                      style={{ width: `${progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm overflow-x-auto scrollbar-hide">
        <div className="min-w-full flex flex-col">
          {/* Header Row */}
          <div className="flex border-b border-slate-200 bg-slate-100 sticky top-0 z-30">
            <div className="sticky left-0 z-40 bg-slate-100 border-r border-slate-200 shrink-0 w-52 h-8 flex items-center justify-start px-4 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
              指标分类 / 细分项目
            </div>
            <div className="flex flex-1 min-w-0">
              {panoramaBuList.map(bu => (
                <div key={bu} className="flex-1 min-w-[120px] border-r border-slate-200/50 h-8 flex items-center justify-center px-2 bg-slate-50">
                  <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">{bu}</span>
                </div>
              ))}
            </div>
          </div>

          {renderSectionRows('财务指标', 'orange', financialRows, 'financial')}
          {renderSectionRows('客户指标', 'blue', customerRows, 'customer')}
          {renderSectionRows('运营指标', 'emerald', operationalRows, 'operational')}
          {renderSectionRows('组织发展', 'indigo', orgRows, 'org')}
        </div>
      </div>
    );
  };

  const PanoramaCard = ({ buName, type }: { buName: string, type: 'plan' | 'tracking', key?: string | number }) => {
    const data = midtermOverviewData[buName as keyof typeof midtermOverviewData] || { financial: [], operational: [], customer: [], org: [] };
    
    const renderIndicatorSection = (title: string, indicators: any[]) => {
      const displayIndicators = showAllIndicators ? indicators : indicators.slice(0, 2);
      const hasMore = indicators.length > 2 && !showAllIndicators;
      
      return (
        <div className="mt-1.5">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">[{title}]</span>
          </div>
          {indicators.length === 0 ? (
            <div className="text-center py-0.5 text-slate-300 text-[10px]">/</div>
          ) : (
            <div className="space-y-0.5">
              {displayIndicators.map((ind, idx) => (
                <div key={idx} className="group relative">
                  <div className="flex items-start justify-between gap-1 text-[10px] leading-tight">
                    <span className="text-slate-600 truncate flex-1" title={ind.name}>{ind.name}</span>
                    <span className="text-slate-400 shrink-0 font-medium">
                      {type === 'plan' ? ind.target : `${ind.current}/${ind.target}`}
                    </span>
                  </div>
                  {type === 'tracking' && ind.status && (
                    <div className="h-[2px] w-full bg-slate-100 rounded-full mt-0.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          ind.status === 'green' ? 'bg-emerald-500' : 
                          ind.status === 'yellow' ? 'bg-amber-400' : 
                          ind.status === 'red' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: ind.status === 'green' ? '90%' : ind.status === 'yellow' ? '60%' : ind.status === 'red' ? '30%' : '100%' }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
              {hasMore && (
                <div className="text-[9px] text-blue-500 font-bold cursor-help inline-block hover:underline" title={indicators.slice(2).map(i => i.name).join('\n')}>
                  +{indicators.length - 2}
                </div>
              )}
            </div>
          )}
        </div>
      );
    };

    const financials = data.financial || [];
    const revenue = financials.find((f: any) => f.name.includes('营收')) || financials[0];
    const ebit = financials.find((f: any) => f.name.includes('EBIT')) || financials[1];

    return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
        {/* Financial Header */}
        <div className="bg-slate-50 p-2 border-b border-slate-100">
          <div className="text-[11px] font-bold text-slate-800 mb-1 truncate">{buName}</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase">营收</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[13px] font-black text-slate-800">{revenue?.target || '/'}</span>
                <span className="text-[8px] text-slate-400 font-bold">亿</span>
              </div>
              {type === 'tracking' && revenue && (
                <div className="h-1 w-full bg-slate-200 rounded-full mt-0.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${revenue.status === 'green' ? 'bg-emerald-500' : revenue.status === 'yellow' ? 'bg-amber-400' : 'bg-red-500'}`} 
                    style={{ width: revenue.status === 'green' ? '90%' : revenue.status === 'yellow' ? '70%' : '40%' }}
                  ></div>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase">EBIT</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[13px] font-black text-slate-800">{ebit?.target || '/'}</span>
                <span className="text-[8px] text-slate-400 font-bold">亿</span>
              </div>
              {type === 'tracking' && ebit && (
                <div className="h-1 w-full bg-slate-200 rounded-full mt-0.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${ebit.status === 'green' ? 'bg-emerald-500' : ebit.status === 'yellow' ? 'bg-amber-400' : 'bg-red-500'}`} 
                    style={{ width: ebit.status === 'green' ? '95%' : ebit.status === 'yellow' ? '65%' : '35%' }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Indicators Body */}
        <div className="p-2 flex-1 flex flex-col justify-between">
          {renderIndicatorSection('运营', data.operational || [])}
          {renderIndicatorSection('客户', data.customer || [])}
          {renderIndicatorSection('组织', data.org || [])}
        </div>
      </div>
    );
  };

  const CustomLightTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
          <p className="text-[12px] font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">{label}</p>
          <div className="space-y-1.5">
            {payload.slice().reverse().map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-[11px] text-slate-600">{entry.name}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[12px] font-bold text-slate-900">{data.counts[entry.dataKey as keyof typeof data.counts]}</span>
                  <span className="text-[10px] text-slate-400">({entry.value}%)</span>
                </div>
              </div>
            ))}
            <div className="pt-1.5 mt-1.5 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500">指标总数</span>
              <span className="text-[12px] font-bold text-slate-800">{data.totalCount}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f7f9]">
      <IndicatorModal />
      {/* Header & Tabs */}
      <div className="bg-white border-b border-slate-200 px-8 pt-4 flex-shrink-0 z-20 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-end justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              {[
                { id: 'plan', label: '组织绩效计划全景图' },
                { id: 'midterm', label: '组织绩效中期回顾看板' },
                { id: 'assessment', label: '组织绩效考核看板' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStage(tab.id as DashboardStage)}
                  className={`px-6 py-4 text-[14px] font-bold transition-all border-b-[3px] -mb-[1px] ${
                    stage === tab.id
                      ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <button 
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <Download size={14} className="text-slate-400" />
                导出数据
              </button>
              
              {isExportOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsExportOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-1.5 w-32 bg-white border border-slate-200 rounded-lg shadow-xl z-40 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1">
                    <button className="w-full px-4 py-2 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                       <FileText size={14} className="text-red-400" />
                       导出 PDF
                    </button>
                    <button className="w-full px-4 py-2 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 border-t border-slate-50">
                       <TrendingUp size={14} className="text-emerald-400" />
                       导出 Excel
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm">
              <Calendar size={14} className="text-blue-400" />
              <span className="text-[11px] font-medium text-slate-600">当前考核周期</span>
              <span className="text-[11px] font-bold text-blue-600 ml-1">2025年度</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto">
          
          {/* ==========================================
              STAGE 1: PLAN (目标制定 - 全景图)
             ========================================== */}
          {stage === 'plan' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Title Area */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-[16px] font-bold text-slate-800">组织计划全景图</h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button 
                      onClick={() => setTargetType('3pt')}
                      className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                        targetType === '3pt' 
                        ? 'bg-white text-slate-800 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      3分目标
                    </button>
                    <button 
                      onClick={() => setTargetType('5pt')}
                      className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                        targetType === '5pt' 
                        ? 'bg-white text-slate-800 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      5分目标
                    </button>
                  </div>
                  <span className="text-[11px] text-red-500 font-medium bg-red-50 px-2 py-1 rounded border border-red-100">注：销量、毛利和经营费用率为预算指标，非财务指标</span>
                </div>
              </div>

              {/* Group Banner - Redesigned for clarity */}
              <div className="flex items-center gap-10 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 pr-8 border-r border-slate-200">
                  <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                  <span className="text-[14px] font-bold text-slate-800">集团公司</span>
                </div>
                <div className="flex items-center gap-12">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold text-slate-500">营收</span>
                    <span className="text-3xl font-black text-slate-900">150<span className="text-sm font-bold text-slate-400 ml-1">亿</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold text-slate-500">EBIT</span>
                    <span className="text-3xl font-black text-slate-900">20<span className="text-sm font-bold text-slate-400 ml-1">亿</span></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <PanoramaMatrix type="plan" />
              </div>
            </div>
          )}

          {/* ==========================================
              STAGE 2: TRACKING (过程追踪 - 集团大盘)
             ========================================== */}
          {stage === 'tracking' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-bold text-slate-800">集团重点指标大盘</h2>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  数据实时采集中
                </span>
              </div>

              {/* Top 4 Absolute Metrics */}
              <div className="grid grid-cols-4 gap-4">
                {trackingTopMetrics.map(metric => (
                  <div key={metric.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-[14px] font-bold text-slate-700">{metric.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">责任部门: {metric.dept}</div>
                      </div>
                      <div className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2 py-0.5 rounded border border-blue-100">
                        目标: {metric.target}{metric.unit}
                      </div>
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-3xl font-black text-slate-800 leading-none">{metric.current}</span>
                      <span className="text-[11px] font-bold text-slate-500 mb-1">{metric.unit}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${metric.status === 'warning' ? 'bg-amber-400' : 'bg-blue-500'}`} 
                        style={{ width: `${metric.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-[11px] font-bold">
                      <span className="text-slate-400">当前进度</span>
                      <span className={metric.status === 'warning' ? 'text-amber-600' : 'text-blue-600'}>{metric.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom 6 Ratio/Efficiency Metrics */}
              <div className="grid grid-cols-6 gap-4">
                {trackingGaugeMetrics.map(metric => (
                  <HalfGauge key={metric.id} metric={metric} />
                ))}
              </div>

              {/* Live Panorama Table */}
              <div className="pt-8 mt-8 border-t border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[16px] font-bold text-slate-800">实时组织计划全景图</h2>
                  </div>
                  <span className="text-[11px] text-red-500 font-medium bg-red-50 px-2 py-1 rounded border border-red-100">注：销量、毛利和经营费用率为预算指标，非财务指标</span>
                </div>

                <div className="flex flex-col gap-4">
                  <PanoramaMatrix type="tracking" />
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              STAGE 3: MIDTERM (中期回顾 - 3个子视图)
             ========================================== */}
          {stage === 'midterm' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              
              {/* Midterm Sub-navigation */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg shadow-sm border border-slate-200 w-fit">
                <button 
                  onClick={() => setMidtermView('overview')}
                  className={`px-5 py-2 rounded-md text-[11px] font-bold transition-all ${midtermView === 'overview' ? 'bg-[#f0f4f8] text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  中期回顾总览
                </button>
                <button 
                  onClick={() => setMidtermView('alerts')}
                  className={`px-5 py-2 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 ${midtermView === 'alerts' ? 'bg-red-50 text-red-700' : 'text-slate-500 hover:text-red-600'}`}
                >
                  <AlertCircle size={14} /> 红灯指标汇总
                </button>
                <button 
                  onClick={() => setMidtermView('detail')}
                  className={`px-5 py-2 rounded-md text-[11px] font-bold transition-all ${midtermView === 'detail' ? 'bg-[#f0f4f8] text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  部门详细回顾
                </button>
              </div>

              {/* Midterm: Overview */}
              {midtermView === 'overview' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5">
                      {(['经营单元', '能力中心', '职能后台'] as DeptType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => setMidtermDeptType(type)}
                          className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                            midtermDeptType === type ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4 text-[11px] font-medium">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-600"></div>严重不符预期</div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-400"></div>部分不符预期</div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-500"></div>符合预期</div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-500"></div>超预期</div>
                      </div>
                      <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
                        <button disabled className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 text-slate-500">
                          <ChevronLeft size={14} />
                        </button>
                        <span className="text-[11px] text-slate-500 font-medium">1/1</span>
                        <button disabled className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 text-slate-500">
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto p-2">
                    <table className="w-full border-collapse table-fixed min-w-full">
                      <colgroup>
                        <col className="w-20" />
                        {deptGroups[midtermDeptType].map(bu => <col key={bu} />)}
                      </colgroup>
                      <thead>
                        <tr>
                          <th className="py-1.5 px-1 border border-slate-200 bg-[#f8fafc] text-left px-3 font-bold text-slate-700 text-[11px]">指标分类</th>
                          {deptGroups[midtermDeptType].map(bu => (
                            <th key={bu} className="py-2 px-1 border border-slate-200 bg-slate-50 text-center font-bold text-blue-800 text-[11px]">{bu}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'financial', name: '财务指标', bg: 'bg-orange-100/50', text: 'text-orange-800' },
                          { id: 'operational', name: '运营指标', bg: 'bg-slate-50', text: 'text-slate-700' },
                          { id: 'customer', name: '客户指标', bg: 'bg-slate-50', text: 'text-slate-700' },
                          { id: 'org', name: '组织发展', bg: 'bg-slate-50', text: 'text-slate-700' }
                        ].map((cat) => (
                          <tr key={cat.id}>
                            <td className={`${cat.bg} ${cat.text} font-bold text-left border border-slate-200 text-[11px] py-2 px-3 leading-tight`}>
                              {cat.name.substring(0, 2)}<br/>{cat.name.substring(2)}
                            </td>
                            {deptGroups[midtermDeptType].map(bu => (
                              <td key={`${cat.id}-${bu}`} className="border border-slate-200 p-1.5 align-top bg-white">
                                <div className="flex flex-col gap-1.5">
                                  {(midtermOverviewData[bu]?.[cat.id] || []).map((metric: any, mIdx: number) => (
                                    <div key={mIdx} className="flex flex-col gap-0.5">
                                      <div className="text-[10px] font-bold text-slate-700 text-center leading-tight">{metric.name}</div>
                                      <div className="flex items-center h-5 rounded-full overflow-hidden border border-slate-200/50 shadow-sm bg-white gap-[1px]">
                                        <div className={`flex-1 h-full flex items-center justify-center text-[9px] font-bold px-1 truncate ${
                                          metric.status === 'red' ? 'bg-red-600 text-white' :
                                          metric.status === 'yellow' ? 'bg-amber-400 text-amber-950' :
                                          metric.status === 'green' ? 'bg-emerald-500 text-white' :
                                          metric.status === 'blue' ? 'bg-blue-500 text-white' :
                                          'bg-slate-200 text-slate-700'
                                        }`}>
                                          {metric.current}
                                        </div>
                                        <div className="flex-1 h-full bg-slate-200 flex items-center justify-center text-[9px] font-medium text-slate-600 px-1 truncate">
                                          {metric.target}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Midterm: Red Light Alerts */}
              {midtermView === 'alerts' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-500" />
                      <h2 className="text-[15px] font-bold text-slate-800">红灯指标汇总</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setAlertsPage(p => Math.max(0, p - 1))} disabled={alertsPage === 0} className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 text-slate-500">
                        <ChevronLeft size={14} />
                      </button>
                      <span className="text-[11px] text-slate-500 font-medium">{alertsPage + 1}/{Math.ceil(redAlerts.length / 10) || 1}</span>
                      <button onClick={() => setAlertsPage(p => Math.min(Math.ceil(redAlerts.length / 10) - 1, p + 1))} disabled={alertsPage >= Math.ceil(redAlerts.length / 10) - 1} className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 text-slate-500">
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto p-3">
                    <table className="w-full border-collapse min-w-full text-left">
                      <thead>
                        <tr>
                          <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-left">指标分类</th>
                          <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap">部门</th>
                          <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap">具体指标</th>
                          <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap">3分目标</th>
                          <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap">完成情况</th>
                          <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap">完成进度</th>
                          <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-center">红黄蓝绿灯</th>
                          <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap">原因说明</th>
                        </tr>
                      </thead>
                      <tbody>
                        {redAlerts.slice(alertsPage * 10, (alertsPage + 1) * 10).map((alert, index, arr) => {
                          // Calculate rowSpan for category
                          let rowSpan = 0;
                          if (index === 0 || alert.category !== arr[index - 1].category) {
                            rowSpan = 1;
                            for (let i = index + 1; i < arr.length; i++) {
                              if (arr[i].category === alert.category) rowSpan++;
                              else break;
                            }
                          }

                          return (
                            <tr key={alert.id} className="hover:bg-slate-50 transition-colors bg-white">
                              {rowSpan > 0 && (
                                <td rowSpan={rowSpan} className="py-2 px-3 border border-slate-200 text-[11px] font-bold text-slate-700 whitespace-nowrap bg-slate-50 align-middle text-left">
                                  {alert.category}
                                </td>
                              )}
                              <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-600 whitespace-nowrap">{alert.dept}</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] font-bold text-slate-800 whitespace-nowrap">{alert.metric}</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-500 whitespace-nowrap">{alert.target}</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-500 whitespace-nowrap">{alert.actual}</td>
                              <td className="py-2 px-3 border border-slate-200 whitespace-nowrap">
                                <div className="flex items-center gap-2 w-32">
                                  <div className="flex-1 h-2.5 bg-red-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500" style={{ width: `${alert.progress}%` }}></div>
                                  </div>
                                  <span className="text-[11px] font-bold text-red-600 w-8">{alert.progress}%</span>
                                </div>
                              </td>
                              <td className="py-2 px-3 border border-slate-200 whitespace-nowrap text-center">
                                <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm mx-auto"></div>
                              </td>
                              <td className="py-2 px-3 border border-slate-200 h-1">
                                <div className="bg-slate-100 rounded p-2 text-[11px] text-slate-600 leading-relaxed h-full flex items-center min-w-[200px]">
                                  {alert.reason}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Light Distribution Chart Section */}
              {midtermView === 'alerts' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={16} className="text-blue-600" />
                      <h2 className="text-[15px] font-bold text-slate-800">红黄蓝绿灯占比分布 - {lightFilter}</h2>
                    </div>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5">
                      {['全部部门', '经营单元', '能力中心', '职能后台'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setLightFilter(type)}
                          className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                            lightFilter === type ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="h-[320px] w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                      <div style={{ minWidth: lightFilter === '全部部门' ? '1000px' : '100%', height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={departmentLightData[lightFilter as keyof typeof departmentLightData]}
                            margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
                            barGap={2}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                              interval={0}
                              angle={-30}
                              textAnchor="end"
                              height={60}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#94a3b8', fontSize: 10 }}
                              tickFormatter={(val) => `${val}%`}
                              domain={[0, 100]}
                            />
                            <Tooltip 
                              content={<CustomLightTooltip />}
                              cursor={{ fill: '#f8fafc' }}
                              trigger="click"
                            />
                            <Legend 
                              verticalAlign="top" 
                              align="right"
                              height={24} 
                              iconType="circle"
                              iconSize={8}
                              wrapperStyle={{ paddingBottom: '10px', fontSize: '10px', fontWeight: 600 }}
                            />
                            
                            <Bar 
                              dataKey="红灯" 
                              name="严重不符预期" 
                              fill="#ef4444" 
                              stackId="a" 
                              barSize={24}
                              className="cursor-pointer"
                              onClick={(data) => handleBarClick(data, "红灯")}
                            >
                              <LabelList dataKey="红灯Count" position="center" fill="#fff" fontSize={9} fontWeight="bold" />
                            </Bar>
                            <Bar 
                              dataKey="黄灯" 
                              name="部分不符预期" 
                              fill="#fbbf24" 
                              stackId="a" 
                              barSize={24}
                              className="cursor-pointer"
                              onClick={(data) => handleBarClick(data, "黄灯")}
                            >
                              <LabelList dataKey="黄灯Count" position="center" fill="#fff" fontSize={9} fontWeight="bold" />
                            </Bar>
                            <Bar 
                              dataKey="蓝灯" 
                              name="符合预期" 
                              fill="#3b82f6" 
                              stackId="a" 
                              barSize={24}
                              className="cursor-pointer"
                              onClick={(data) => handleBarClick(data, "蓝灯")}
                            >
                              <LabelList dataKey="蓝灯Count" position="center" fill="#fff" fontSize={9} fontWeight="bold" />
                            </Bar>
                            <Bar 
                              dataKey="绿灯" 
                              name="超预期" 
                              fill="#10b981" 
                              stackId="a" 
                              barSize={24}
                              className="cursor-pointer"
                              onClick={(data) => handleBarClick(data, "绿灯")}
                            >
                              <LabelList dataKey="绿灯Count" position="center" fill="#fff" fontSize={9} fontWeight="bold" />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Midterm: Department Detail */}
              {midtermView === 'detail' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50/50 border-b border-slate-200 px-2 py-0.5 relative flex items-center">
                    <button 
                      onClick={() => {
                        const el = document.getElementById('dept-tabs-scroll');
                        if (el) el.scrollBy({ left: -200, behavior: 'smooth' });
                      }}
                      className="absolute left-0 z-10 p-1.5 bg-gradient-to-r from-slate-50 to-transparent text-slate-400 hover:text-slate-600"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    
                    <div 
                      id="dept-tabs-scroll"
                      className="flex-1 overflow-x-auto scrollbar-hide flex items-center gap-1 px-8 py-2"
                    >
                      {buList.map(bu => (
                        <button
                          key={bu}
                          onClick={() => setActiveBu(bu)}
                          className={`shrink-0 px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                            activeBu === bu 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200 ring-2 ring-blue-100' 
                            : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700'
                          }`}
                        >
                          {bu}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={() => {
                        const el = document.getElementById('dept-tabs-scroll');
                        if (el) el.scrollBy({ left: 200, behavior: 'smooth' });
                      }}
                      className="absolute right-0 z-10 p-1.5 bg-gradient-to-l from-slate-50 to-transparent text-slate-400 hover:text-slate-600"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="overflow-x-auto p-3">
                    {/* Detail Table for Active BU */}
                    <table className="w-full border-collapse min-w-full text-left">
                      <thead>
                        <tr>
                          <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-left">指标分类</th>
                          <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap">指标名称</th>
                          <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap">3分目标</th>
                          <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap">上半年结果</th>
                          <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap">完成进度</th>
                          <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-center">红黄蓝绿灯</th>
                          <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap">差距说明</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Mocking detailed rows for EBIKE as an example */}
                        {activeBu === 'EBIKE事业部' ? (
                          <>
                            <tr className="hover:bg-slate-50 transition-colors bg-white">
                              <td className="py-2 px-3 border border-slate-200 text-[11px] font-bold text-slate-700 whitespace-nowrap bg-slate-50 align-middle text-left" rowSpan={2}>财务指标</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] font-bold text-slate-800 whitespace-nowrap">营收/亿</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-500 whitespace-nowrap">8.0</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-800 font-bold whitespace-nowrap">2.96</td>
                              <td className="py-2 px-3 border border-slate-200 whitespace-nowrap">
                                <div className="flex items-center gap-2 w-32">
                                  <div className="flex-1 h-2.5 bg-red-100 rounded-full overflow-hidden"><div className="h-full bg-red-500 w-[37%]"></div></div>
                                  <span className="text-[11px] font-bold text-red-600 w-8">37%</span>
                                </div>
                              </td>
                              <td className="py-2 px-3 border border-slate-200 whitespace-nowrap text-center">
                                <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm mx-auto"></div>
                              </td>
                              <td className="py-2 px-3 border border-slate-200 h-1">
                                <div className="bg-slate-100 rounded p-2 text-[11px] text-slate-600 leading-relaxed h-full flex items-center min-w-[200px]">
                                  受产品结构及锂电配比影响，客单价降低，营收达成存在风险。
                                </div>
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors bg-white">
                              <td className="py-2 px-3 border border-slate-200 text-[11px] font-bold text-slate-800 whitespace-nowrap">EBIT/亿</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-500 whitespace-nowrap">0.8</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-800 font-bold whitespace-nowrap">0.73</td>
                              <td className="py-2 px-3 border border-slate-200 whitespace-nowrap">
                                <div className="flex items-center gap-2 w-32">
                                  <div className="flex-1 h-2.5 bg-blue-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[92%]"></div></div>
                                  <span className="text-[11px] font-bold text-blue-600 w-8">92%</span>
                                </div>
                              </td>
                              <td className="py-2 px-3 border border-slate-200 whitespace-nowrap text-center">
                                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm mx-auto"></div>
                              </td>
                              <td className="py-2 px-3 border border-slate-200 h-1">
                                <div className="bg-slate-100 rounded p-2 text-[11px] text-slate-600 leading-relaxed h-full flex items-center min-w-[200px]">
                                  部分费用执行率低，年度考核需扣除异常影响。
                                </div>
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors bg-white">
                              <td className="py-2 px-3 border border-slate-200 text-[11px] font-bold text-slate-700 whitespace-nowrap bg-slate-50 align-middle text-left" rowSpan={2}>客户指标</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] font-bold text-slate-800 whitespace-nowrap">12MIS</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-500 whitespace-nowrap">2%</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-800 font-bold whitespace-nowrap">1.8%</td>
                              <td className="py-2 px-3 border border-slate-200 whitespace-nowrap">
                                <div className="flex items-center gap-2 w-32">
                                  <div className="flex-1 h-2.5 bg-blue-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[90%]"></div></div>
                                  <span className="text-[11px] font-bold text-blue-600 w-8">90%</span>
                                </div>
                              </td>
                              <td className="py-2 px-3 border border-slate-200 whitespace-nowrap text-center">
                                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm mx-auto"></div>
                              </td>
                              <td className="py-2 px-3 border border-slate-200 h-1">
                                <div className="bg-slate-100 rounded p-2 text-[11px] text-slate-600 leading-relaxed h-full flex items-center min-w-[200px]">
                                  预测下半年趋势在控制范围内。
                                </div>
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors bg-white">
                              <td className="py-2 px-3 border border-slate-200 text-[11px] font-bold text-slate-800 whitespace-nowrap">产品用户满意度</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-500 whitespace-nowrap">4.5</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-800 font-bold whitespace-nowrap">4.25</td>
                              <td className="py-2 px-3 border border-slate-200 whitespace-nowrap">
                                <div className="flex items-center gap-2 w-32">
                                  <div className="flex-1 h-2.5 bg-amber-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400 w-[85%]"></div></div>
                                  <span className="text-[11px] font-bold text-amber-600 w-8">85%</span>
                                </div>
                              </td>
                              <td className="py-2 px-3 border border-slate-200 whitespace-nowrap text-center">
                                <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm mx-auto"></div>
                              </td>
                              <td className="py-2 px-3 border border-slate-200 h-1">
                                <div className="bg-slate-100 rounded p-2 text-[11px] text-slate-600 leading-relaxed h-full flex items-center min-w-[200px]">
                                  上半年客户抱怨率上升了11%，下半年整体抱怨率需改善40%以上。
                                </div>
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors bg-white">
                              <td className="py-2 px-3 border border-slate-200 text-[11px] font-bold text-slate-700 whitespace-nowrap bg-slate-50 align-middle text-left">组织发展</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] font-bold text-slate-800 whitespace-nowrap">组织建设&人才发展</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-500 whitespace-nowrap">100%</td>
                              <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-800 font-bold whitespace-nowrap">30%</td>
                              <td className="py-2 px-3 border border-slate-200 whitespace-nowrap">
                                <div className="flex items-center gap-2 w-32">
                                  <div className="flex-1 h-2.5 bg-red-100 rounded-full overflow-hidden"><div className="h-full bg-red-500 w-[30%]"></div></div>
                                  <span className="text-[11px] font-bold text-red-600 w-8">30%</span>
                                </div>
                              </td>
                              <td className="py-2 px-3 border border-slate-200 whitespace-nowrap text-center">
                                <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm mx-auto"></div>
                              </td>
                              <td className="py-2 px-3 border border-slate-200 h-1">
                                <div className="bg-slate-100 rounded p-2 text-[11px] text-slate-600 leading-relaxed h-full flex items-center min-w-[200px]">
                                  海外团队第一负责人缺失，缺少对海外整体规划；欧洲招聘暂未启动。
                                </div>
                              </td>
                            </tr>
                          </>
                        ) : (
                          <tr>
                            <td colSpan={7} className="py-16 text-center text-slate-400 text-[11px] border border-slate-200">
                              请选择其他部门查看详情 (当前仅 EBIKE事业部 有演示数据)
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
        {stage === 'assessment' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
            <div className="bg-white p-6 border-b border-slate-200 flex-shrink-0">
              <div className="grid grid-cols-6 gap-6 w-full">
                {personGradeStats.map(stat => {
                  const themes = {
                    'S': { color: 'text-purple-600', bg: 'bg-purple-50/30', border: 'border-purple-100', dot: 'bg-purple-500' },
                    'A': { color: 'text-emerald-600', bg: 'bg-emerald-50/30', border: 'border-emerald-100', dot: 'bg-emerald-500' },
                    'B+': { color: 'text-blue-600', bg: 'bg-blue-50/30', border: 'border-blue-100', dot: 'bg-blue-500' },
                    'B': { color: 'text-sky-600', bg: 'bg-sky-50/30', border: 'border-sky-100', dot: 'bg-sky-500' },
                    'C': { color: 'text-amber-600', bg: 'bg-amber-50/30', border: 'border-amber-100', dot: 'bg-amber-500' },
                    'D': { color: 'text-red-600', bg: 'bg-red-50/30', border: 'border-red-100', dot: 'bg-red-500' },
                  };
                  const theme = themes[stat.grade as keyof typeof themes] || themes['B'];
                  
                  return (
                    <div key={stat.grade} className="group relative overflow-hidden bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] transition-all duration-300">
                      {/* Subtle Layering */}
                      <div className={`absolute top-0 right-0 w-24 h-24 ${theme.bg} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500 opacity-60`}></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <div className={`w-1.5 h-1.5 rounded-full ${theme.dot}`}></div>
                          <span className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.1em]">{stat.grade}级考核结果</span>
                        </div>
                        
                        <div className="flex items-end justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-slate-800 tracking-tight">{stat.count}</span>
                            <span className="text-[11px] font-bold text-slate-300">人</span>
                          </div>
                          
                          <div className="flex flex-col items-end">
                            <div className={`text-[13px] font-black ${theme.color}`}>{stat.percentage}%</div>
                            <div className="text-[9px] font-bold text-slate-300 uppercase">占比</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Interactive Bottom Bar */}
                      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-slate-50 overflow-hidden">
                        <div 
                          className={`h-full ${theme.dot} transition-all duration-1000 ease-out`}
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-3">
              <table className="w-full border-collapse min-w-full text-left">
                <thead>
                  <tr>
                    <th colSpan={11} className="py-2 px-3 border border-slate-200 bg-blue-50 text-blue-700 font-bold text-[12px] text-center italic">2025年度-一级部门组织绩效考核结果</th>
                    <th colSpan={8} className="py-2 px-3 border border-slate-200 bg-emerald-50 text-emerald-700 font-bold text-[12px] text-center italic">2025年度-执委个人绩效考核结果</th>
                  </tr>
                  <tr>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-center w-12">序号</th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap">一级部门名称</th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap">一级部门负责人</th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap">分管常委/执委</th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-right">一级部门自评分</th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-center">自评等级</th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        数据提供人初评
                        <div className="relative">
                          <HelpCircle 
                            size={12} 
                            className="text-slate-400 cursor-pointer hover:text-blue-500 transition-colors" 
                            onClick={() => setShowScoreHelp(!showScoreHelp)}
                          />
                          {showScoreHelp && (
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 p-3 bg-slate-800 text-white text-[11px] rounded-xl shadow-2xl z-[100] animate-in fade-in zoom-in-95 pointer-events-none font-normal normal-case text-left leading-relaxed">
                              <div className="font-bold mb-1 text-blue-300">评分说明：</div>
                              定量指标由系统根据完成目标自动计算；定性指标由数据提供人根据实际完成情况手工录入。
                              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-slate-800"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-center">考核等级</th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-center">常委会评议等级</th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-center">24年等级</th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-center">组织绩效考核表单</th>
                    
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-right">一级部门自评分</th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-center">自评等级</th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        数据提供人初评
                        <div className="relative">
                          <HelpCircle 
                            size={12} 
                            className="text-slate-400 cursor-pointer hover:text-blue-500 transition-colors" 
                            onClick={() => setShowScoreHelp(!showScoreHelp)}
                          />
                          {showScoreHelp && (
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 p-3 bg-slate-800 text-white text-[11px] rounded-xl shadow-2xl z-[100] animate-in fade-in zoom-in-95 pointer-events-none font-normal normal-case text-left leading-relaxed">
                              <div className="font-bold mb-1 text-blue-300">评分说明：</div>
                              定量指标由系统根据完成目标自动计算；定性指标由数据提供人根据实际完成情况手工录入。
                              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-slate-800"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-center">上级等级</th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-center">常委会评议等级</th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-center">最终等级</th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-center">24年等级</th>
                    <th className="py-2 px-3 border border-slate-200 bg-[#f8fafc] text-slate-700 font-bold text-[11px] whitespace-nowrap text-center">个人绩效表单</th>
                  </tr>
                </thead>
                <tbody>
                  {assessmentData.map((row, index) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors bg-white">
                      <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-500 text-center">{index + 1}</td>
                      <td className="py-2 px-3 border border-slate-200 text-[11px] font-medium text-slate-800">{row.dept}</td>
                      <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-600">{row.head}</td>
                      <td className="py-2 px-3 border border-slate-200 text-[11px] text-slate-600">{row.committee}</td>
                      <td className="py-2 px-3 border border-slate-200 text-[11px] font-medium text-slate-700 text-right">{row.selfScore.toFixed(1)}</td>
                      <td className="py-2 px-3 border border-slate-200 text-center">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.selfGrade === 'S' ? 'bg-purple-100 text-purple-700' :
                          row.selfGrade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                          row.selfGrade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                          row.selfGrade === 'C' ? 'bg-amber-100 text-amber-700' :
                          row.selfGrade === 'D' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {row.selfGrade}
                        </span>
                      </td>
                      <td className="py-2 px-3 border border-slate-200 text-[11px] font-bold text-slate-800 text-right">{row.finalScore.toFixed(1)}</td>
                      <td className="py-2 px-3 border border-slate-200 text-center">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.finalGrade === 'S' ? 'bg-purple-100 text-purple-700' :
                          row.finalGrade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                          row.finalGrade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                          row.finalGrade === 'C' ? 'bg-amber-100 text-amber-700' :
                          row.finalGrade === 'D' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {row.finalGrade}
                        </span>
                      </td>
                      <td className="py-2 px-3 border border-slate-200 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {row.committeeReviewGrade}
                        </span>
                      </td>
                      <td className="py-2 px-3 border border-slate-200 text-center text-[11px] text-slate-500">{row.lastYearGrade}</td>
                      <td className="py-2 px-3 border border-slate-200 text-center">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <FileText size={16} />
                        </button>
                      </td>

                      {/* Group 2 */}
                      <td className="py-2 px-3 border border-slate-200 text-[11px] font-medium text-slate-700 text-right">{row.personSelfScore.toFixed(1)}</td>
                      <td className="py-2 px-3 border border-slate-200 text-center">
                         <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold ${
                           row.personSelfGrade === 'S' ? 'bg-purple-100 text-purple-700' :
                           row.personSelfGrade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                           row.personSelfGrade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                           row.personSelfGrade === 'C' ? 'bg-amber-100 text-amber-700' :
                           row.personSelfGrade === 'D' ? 'bg-red-100 text-red-700' :
                           'bg-slate-100 text-slate-700'
                         }`}>
                          {row.personSelfGrade}
                        </span>
                      </td>
                      <td className="py-2 px-3 border border-slate-200 text-[11px] font-medium text-slate-700 text-right">{row.superiorScore.toFixed(1)}</td>
                      <td className="py-2 px-3 border border-slate-200 text-center">
                         <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold ${
                           row.superiorGrade === 'S' ? 'bg-purple-100 text-purple-700' :
                           row.superiorGrade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                           row.superiorGrade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                           row.superiorGrade === 'C' ? 'bg-amber-100 text-amber-700' :
                           row.superiorGrade === 'D' ? 'bg-red-100 text-red-700' :
                           'bg-slate-100 text-slate-700'
                         }`}>
                          {row.superiorGrade}
                        </span>
                      </td>
                      <td className="py-2 px-3 border border-slate-200 text-center">
                         <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold ${
                           row.personCommitteeGrade === 'S' ? 'bg-purple-100 text-purple-700' :
                           row.personCommitteeGrade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                           row.personCommitteeGrade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                           row.personCommitteeGrade === 'C' ? 'bg-amber-100 text-amber-700' :
                           row.personCommitteeGrade === 'D' ? 'bg-red-100 text-red-700' :
                           'bg-slate-100 text-slate-700'
                         }`}>
                          {row.personCommitteeGrade}
                        </span>
                      </td>
                      <td className="py-2 px-3 border border-slate-200 text-center">
                         <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold ${
                           row.personFinalGrade === 'S' ? 'bg-purple-600 text-white shadow-sm' :
                           row.personFinalGrade.startsWith('A') ? 'bg-emerald-600 text-white shadow-sm' :
                           row.personFinalGrade.startsWith('B') ? 'bg-blue-600 text-white shadow-sm' :
                           row.personFinalGrade === 'C' ? 'bg-amber-500 text-white shadow-sm' :
                           row.personFinalGrade === 'D' ? 'bg-red-600 text-white shadow-sm' :
                           'bg-slate-500 text-white shadow-sm'
                         }`}>
                          {row.personFinalGrade}
                        </span>
                      </td>
                      <td className="py-2 px-3 border border-slate-200 text-center text-[11px] text-slate-500">{row.personLastYearGrade}</td>
                      <td className="py-2 px-3 border border-slate-200 text-center">
                        <button className="text-emerald-600 hover:text-emerald-800 transition-colors">
                          <FileText size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
