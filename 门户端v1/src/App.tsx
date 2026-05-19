/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, BookOpen, GitMerge, Briefcase, Users, Bell, 
  ChevronDown, PanelLeftClose, PanelLeftOpen, Monitor, Check, Library
} from 'lucide-react';

import { Metric, ReviewerInfo, ViewMode } from './components/MetricCard';
import { BusinessHeader } from './components/BusinessHeader';
import { ProcessStageBar } from './components/ProcessStageBar';
import { ActionBar } from './components/ActionBar';
import { PlanStageContent } from './components/PlanStageContent';
import { MidTermStageContent } from './components/MidTermStageContent';
import { AssessmentStageContent } from './components/AssessmentStageContent';
import { DefaultStageContent } from './components/DefaultStageContent';
import { MenuItem } from './components/MenuItem';
import { AssessmentFooter } from './components/AssessmentFooter';
import { ReviewerModal } from './components/ReviewerModal';
import { StakeholderPerformance } from './components/StakeholderPerformance';
import { ProcessCenter } from './components/ProcessCenter';
import { ExecutivePerformance } from './components/ExecutivePerformance';
import { ExecutiveDetailHeader } from './components/ExecutiveDetailHeader';
import { DepartmentDashboard } from './components/DepartmentDashboard';
import { ApprovalProgressDrawer } from './components/ApprovalProgressDrawer';
import { PlanChangeModal } from './components/PlanChangeModal';
import { OrgPerformanceStartPage } from './components/OrgPerformanceStartPage';
import { ShareModal } from './components/ShareModal';


const initialFinancialMetrics: Metric[] = [
  {
    id: 'f1',
    name: '营收达成（亿）',
    type: '定量',
    zeroGoal: '40',
    threeGoal: '48',
    fiveGoal: '60',
    weight: 18,
    reviewer: '张三',
    reviewerWeight: 100,
    reviewers: [{ id: 'r1', name: '张三', weight: 100, avatar: 'https://i.pravatar.cc/150?img=1' }],
    lastYear: '42',
    yoyGrowth: '42.9%',
    provider: '李四',
    providers: [{ id: 'p1', name: '李四', avatar: 'https://i.pravatar.cc/150?img=2' }],
    formula: '',
    midTermResult: '18.5',
    midTermProgress: 37,
    midTermStatus: 'red',
    midTermReason: '',
    annualResult: '125.4',
    providerScore: 4.5,
    selfScore: 4.5,
    stakeholderScores: [
      { id: 's1', name: '查理', weight: 30, score: 4.5 },
      { id: 's2', name: '戴维', weight: 70, score: 4.2 }
    ],
    executiveScore: 4.3,
    standingCommitteeScore: 0
  },
  {
    id: 'f2',
    name: '毛利率（%）',
    type: '定量',
    zeroGoal: '22',
    threeGoal: '26',
    fiveGoal: '30',
    weight: 17,
    reviewer: '张三',
    reviewerWeight: 100,
    reviewers: [{ id: 'r1', name: '张三', weight: 100, avatar: 'https://i.pravatar.cc/150?img=1' }],
    lastYear: '24.5',
    yoyGrowth: '22.4%',
    provider: '李四',
    providers: [{ id: 'p1', name: '李四', avatar: 'https://i.pravatar.cc/150?img=2' }],
    formula: '',
    midTermResult: '0.73',
    midTermProgress: 92,
    midTermStatus: 'blue',
    midTermReason: '',
    annualResult: '28.2%',
    providerScore: 4.75,
    selfScore: 4.75,
    stakeholderScores: [
      { id: 's3', name: '爱丽丝', weight: 50, score: 4.8 },
      { id: 's4', name: '鲍勃', weight: 50, score: 4.4 }
    ],
    executiveScore: 4.6,
    standingCommitteeScore: 0
  }
];

const initialCustomerMetrics: Metric[] = [
  {
    id: 'c1',
    name: '市占率（%）',
    type: '定量',
    zeroGoal: '18',
    threeGoal: '22',
    fiveGoal: '28',
    weight: 12,
    reviewer: '王五',
    reviewerWeight: 100,
    reviewers: [{ id: 'r2', name: '王五', weight: 100, avatar: 'https://i.pravatar.cc/150?img=3' }],
    lastYear: '20',
    yoyGrowth: '40.0%',
    provider: '赵六',
    providers: [{ id: 'p2', name: '赵六', avatar: 'https://i.pravatar.cc/150?img=4' }],
    formula: '',
    midTermResult: '9.2',
    midTermProgress: 33,
    midTermStatus: 'yellow',
    midTermReason: '',
    annualResult: '24.5%',
    providerScore: 3.5,
    selfScore: 3.5,
    stakeholderScores: [
      { id: 's5', name: '查理', weight: 40, score: 4.0 },
      { id: 's6', name: '伊芙', weight: 60, score: 3.5 }
    ],
    executiveScore: 3.9,
    standingCommitteeScore: 0
  },
  {
    id: 'c2',
    name: '客诉率（%）',
    type: '定量',
    zeroGoal: '1.2',
    threeGoal: '0.8',
    fiveGoal: '0.4',
    weight: 10,
    reviewer: '王五',
    reviewerWeight: 100,
    reviewers: [{ id: 'r2', name: '王五', weight: 100, avatar: 'https://i.pravatar.cc/150?img=3' }],
    lastYear: '1.0',
    yoyGrowth: '-60.0%',
    provider: '赵六',
    providers: [{ id: 'p2', name: '赵六', avatar: 'https://i.pravatar.cc/150?img=4' }],
    formula: '',
    midTermResult: '1.8%',
    midTermProgress: 90,
    midTermStatus: 'blue',
    midTermReason: '',
    annualResult: '0.65%',
    providerScore: 4.25,
    selfScore: 4.25,
    stakeholderScores: [
      { id: 's7', name: '弗兰克', weight: 100, score: 4.2 }
    ],
    executiveScore: 4.1,
    standingCommitteeScore: 0
  }
];

const initialOperationalMetrics: Metric[] = [
  {
    id: 'o1',
    name: '交付及时率（%）',
    type: '定量',
    zeroGoal: '85',
    threeGoal: '92',
    fiveGoal: '98',
    weight: 10,
    reviewer: '孙七',
    reviewerWeight: 100,
    reviewers: [{ id: 'r3', name: '孙七', weight: 100, avatar: 'https://i.pravatar.cc/150?img=5' }],
    lastYear: '88',
    yoyGrowth: '11.4%',
    provider: '周八',
    providers: [{ id: 'p3', name: '周八', avatar: 'https://i.pravatar.cc/150?img=6' }],
    formula: '',
    midTermResult: '98%',
    midTermProgress: 100,
    midTermStatus: 'green',
    midTermReason: '',
    annualResult: '96.5%',
    providerScore: 4.5,
    selfScore: 4.5,
    stakeholderScores: [
      { id: 's8', name: '格蕾丝', weight: 50, score: 4.9 },
      { id: 's9', name: '汉克', weight: 50, score: 4.7 }
    ],
    executiveScore: 4.8,
    standingCommitteeScore: 0
  },
  {
    id: 'o2',
    name: '库存周转（天）',
    type: '定量',
    zeroGoal: '60',
    threeGoal: '45',
    fiveGoal: '30',
    weight: 8,
    reviewer: '孙七',
    reviewerWeight: 100,
    reviewers: [{ id: 'r3', name: '孙七', weight: 100, avatar: 'https://i.pravatar.cc/150?img=5' }],
    lastYear: '55',
    yoyGrowth: '-45.5%',
    provider: '周八',
    providers: [{ id: 'p3', name: '周八', avatar: 'https://i.pravatar.cc/150?img=6' }],
    formula: '',
    annualResult: '35天',
    providerScore: 4.0,
    selfScore: 4.0,
    stakeholderScores: [
      { id: 's10', name: '艾薇', weight: 100, score: 4.3 }
    ],
    executiveScore: 4.2,
    standingCommitteeScore: 0
  }
];

const initialOrgMetrics: Metric[] = [
  {
    id: 'or1',
    name: '人效（万/人）',
    type: '定量',
    zeroGoal: '80',
    threeGoal: '100',
    fiveGoal: '120',
    weight: 8,
    reviewer: '吴九',
    reviewerWeight: 100,
    reviewers: [{ id: 'r4', name: '吴九', weight: 100, avatar: 'https://i.pravatar.cc/150?img=7' }],
    lastYear: '85',
    yoyGrowth: '41.2%',
    provider: '郑十',
    providers: [{ id: 'p4', name: '郑十', avatar: 'https://i.pravatar.cc/150?img=8' }],
    formula: '',
    annualResult: '112万/人',
    providerScore: 4.25,
    selfScore: 4.25,
    stakeholderScores: [
      { id: 's11', name: '杰克', weight: 100, score: 4.1 }
    ],
    executiveScore: 4.0,
    standingCommitteeScore: 0
  },
  {
    id: 'or2',
    name: '关键人才保留',
    type: '定性',
    zeroGoal: '核心人才流失率>20%',
    threeGoal: '核心人才流失率10%-15%',
    fiveGoal: '核心人才流失率<5%',
    weight: 7,
    reviewer: '吴九',
    reviewerWeight: 100,
    reviewers: [{ id: 'r4', name: '吴九', weight: 100, avatar: 'https://i.pravatar.cc/150?img=7' }],
    lastYear: '12%',
    yoyGrowth: '—',
    provider: '郑十',
    providers: [{ id: 'p4', name: '郑十', avatar: 'https://i.pravatar.cc/150?img=8' }],
    formula: '',
    annualResult: '核心人才流失率4.2%',
    providerScore: 4.75,
    selfScore: 4.75,
    stakeholderScores: [
      { id: 's12', name: '凯特', weight: 100, score: 4.6 }
    ],
    executiveScore: 4.5,
    standingCommitteeScore: 0
  }
];

export default function App() {
  const [financialMetrics, setFinancialMetrics] = useState<Metric[]>(initialFinancialMetrics);
  const [customerMetrics, setCustomerMetrics] = useState<Metric[]>(initialCustomerMetrics);
  const [operationalMetrics, setOperationalMetrics] = useState<Metric[]>(initialOperationalMetrics);
  const [orgMetrics, setOrgMetrics] = useState<Metric[]>(initialOrgMetrics);
  const [capacityMetrics, setCapacityMetrics] = useState<Metric[]>([]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isBatchReviewerModalOpen, setIsBatchReviewerModalOpen] = useState(false);
  const [activeDept, setActiveDept] = useState('财务中心');
  const [activeStep, setActiveStep] = useState(0);
  const [activeView, setActiveView] = useState<ViewMode>('department');
  const [currentUserRole, setCurrentUserRole] = useState('一级部门负责人');
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isDeptTypeMenuOpen, setIsDeptTypeMenuOpen] = useState(false);
  const [departmentType, setDepartmentType] = useState('经营单元');
  const [addedDimensions, setAddedDimensions] = useState<string[]>([]);
  const [isExecutiveDetail, setIsExecutiveDetail] = useState(false);
  const [selectedDeptInfo, setSelectedDeptInfo] = useState<{id: string, deptName: string, deptHead: {name: string, avatar: string}, status: string} | null>(null);
  const [showFullForm, setShowFullForm] = useState(false);
  const [isPlanSubmitted, setIsPlanSubmitted] = useState(false);
  const [isPlanApproved, setIsPlanApproved] = useState(false);
  const [isPlanChanging, setIsPlanChanging] = useState(false);
  const [planChangeReason, setPlanChangeReason] = useState<string | null>(null);
  const [isApprovalDrawerOpen, setIsApprovalDrawerOpen] = useState(false);
  const [isPlanChangeModalOpen, setIsPlanChangeModalOpen] = useState(false);
  const [hasStartedOrgPerformance, setHasStartedOrgPerformance] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const departments = ['商用出行事业部', 'EBIKE事业部', 'SPS事业部', '零极创新事业部', '财务中心', '供应链中心', '人力中心', '质量中心'];
  const steps = ['组织绩效计划制定', '组织绩效中期回顾', '组织绩效考核'];

  const handleShare = (users: string[]) => {
    setIsShareModalOpen(false);
    // In a real app, this would call an API
    console.log('Sharing with users:', users);
    alert('表单已成功分享给 ' + users.length + ' 位成员');
  };

  const mockExecutiveTasks = [
    {
      id: '1',
      deptName: '商用出行事业部',
      deptHead: { name: '李四', avatar: 'https://i.pravatar.cc/150?img=4' },
      hrbp: { name: '王五', avatar: 'https://i.pravatar.cc/150?img=10' },
      status: '待审批',
      arrivalTime: '2024-07-28',
      stayDuration: '27天'
    },
    {
      id: '2',
      deptName: 'EBIKE事业部',
      deptHead: { name: '王五', avatar: 'https://i.pravatar.cc/150?img=5' },
      hrbp: { name: '赵六', avatar: 'https://i.pravatar.cc/150?img=11' },
      status: '待审批',
      arrivalTime: '2024-07-28',
      stayDuration: '25天'
    },
    {
      id: '3',
      deptName: 'SPS事业部',
      deptHead: { name: '张伟', avatar: 'https://i.pravatar.cc/150?img=6' },
      hrbp: { name: '孙七', avatar: 'https://i.pravatar.cc/150?img=12' },
      status: '待审批',
      arrivalTime: '2024-07-28',
      stayDuration: '20天'
    },
    {
      id: '4',
      deptName: '零极创新事业部',
      deptHead: { name: '刘备', avatar: 'https://i.pravatar.cc/150?img=7' },
      hrbp: { name: '关羽', avatar: 'https://i.pravatar.cc/150?img=13' },
      status: '待审批',
      arrivalTime: '2024-07-28',
      stayDuration: '15天'
    },
    {
      id: '5',
      deptName: '财务中心',
      deptHead: { name: '曹操', avatar: 'https://i.pravatar.cc/150?img=8' },
      hrbp: { name: '郭嘉', avatar: 'https://i.pravatar.cc/150?img=14' },
      status: '待审批',
      arrivalTime: '2024-07-28',
      stayDuration: '10天'
    },
    {
      id: '6',
      deptName: '供应链中心',
      deptHead: { name: '孙权', avatar: 'https://i.pravatar.cc/150?img=9' },
      hrbp: { name: '周瑜', avatar: 'https://i.pravatar.cc/150?img=15' },
      status: '待审批',
      arrivalTime: '2024-07-28',
      stayDuration: '8天'
    },
    {
      id: '7',
      deptName: '人力中心',
      deptHead: { name: '刘邦', avatar: 'https://i.pravatar.cc/150?img=10' },
      hrbp: { name: '张良', avatar: 'https://i.pravatar.cc/150?img=16' },
      status: '待审批',
      arrivalTime: '2024-07-28',
      stayDuration: '5天'
    },
    {
      id: '8',
      deptName: '质量中心',
      deptHead: { name: '朱元璋', avatar: 'https://i.pravatar.cc/150?img=11' },
      hrbp: { name: '刘伯温', avatar: 'https://i.pravatar.cc/150?img=17' },
      status: '待审批',
      arrivalTime: '2024-07-28',
      stayDuration: '3天'
    }
  ];

  const totalWeight = [
    ...financialMetrics,
    ...customerMetrics,
    ...operationalMetrics,
    ...orgMetrics
  ].reduce((sum, m) => sum + m.weight, 0);

  const totalMetricsCount = financialMetrics.length + customerMetrics.length + operationalMetrics.length + orgMetrics.length;

  const midTermStats = [
    ...financialMetrics,
    ...customerMetrics,
    ...operationalMetrics,
    ...orgMetrics
  ].reduce((acc, m) => {
    if (m.midTermStatus === 'red') acc.red++;
    else if (m.midTermStatus === 'yellow') acc.yellow++;
    else if (m.midTermStatus === 'blue') acc.blue++;
    else if (m.midTermStatus === 'green') acc.green++;
    return acc;
  }, { red: 0, yellow: 0, blue: 0, green: 0 });

  const renderContent = (fullWidth: boolean = false, viewModeOverride?: ViewMode, showFullFormOverride?: boolean) => {
    const currentViewMode = viewModeOverride || activeView;
    const isExecutive = currentViewMode === 'executive';
    const isStakeholder = currentViewMode === 'stakeholder';
    const isDetailView = !!viewModeOverride;
    
    // Filter metrics for stakeholder
    const filterForStakeholder = (metrics: Metric[]) => {
      if (isStakeholder && (activeStep === 0 || activeStep === 2)) {
        return metrics.filter(m => m.reviewers?.some(r => r.name === '张三'));
      }
      return metrics;
    };

    const displayFinancial = filterForStakeholder(financialMetrics);
    const displayCustomer = filterForStakeholder(customerMetrics);
    const displayOperational = filterForStakeholder(operationalMetrics);
    const displayOrg = filterForStakeholder(orgMetrics);
    const displayCapacity = filterForStakeholder(capacityMetrics);

    switch (activeStep) {
      case 0:
        return (
          <PlanStageContent 
            financialMetrics={displayFinancial}
            setFinancialMetrics={setFinancialMetrics}
            customerMetrics={displayCustomer}
            setCustomerMetrics={setCustomerMetrics}
            operationalMetrics={displayOperational}
            setOperationalMetrics={setOperationalMetrics}
            orgMetrics={displayOrg}
            setOrgMetrics={setOrgMetrics}
            capacityMetrics={displayCapacity}
            setCapacityMetrics={setCapacityMetrics}
            isSidebarCollapsed={isSidebarCollapsed}
            readOnly={isExecutive || isStakeholder || ((isPlanSubmitted || isPlanApproved) && !isPlanChanging)}
            fullWidth={fullWidth}
            viewMode={currentViewMode}
            showFullForm={showFullFormOverride ?? showFullForm}
            isDetailView={isDetailView}
            currentUserRole={currentUserRole}
            planChangeReason={planChangeReason}
            departmentType={departmentType}
            addedDimensions={addedDimensions}
          />
        );
      case 1:
        return (
          <MidTermStageContent 
            financialMetrics={displayFinancial}
            setFinancialMetrics={setFinancialMetrics}
            customerMetrics={displayCustomer}
            setCustomerMetrics={setCustomerMetrics}
            operationalMetrics={displayOperational}
            setOperationalMetrics={setOperationalMetrics}
            orgMetrics={displayOrg}
            setOrgMetrics={setOrgMetrics}
            isSidebarCollapsed={isSidebarCollapsed}
            readOnly={isExecutive || isStakeholder}
            fullWidth={fullWidth}
            viewMode={currentViewMode}
            showFullForm={showFullFormOverride ?? showFullForm}
            isDetailView={isDetailView}
            currentUserRole={currentUserRole}
          />
        );
      case 2:
        return (
          <AssessmentStageContent 
            financialMetrics={displayFinancial}
            setFinancialMetrics={setFinancialMetrics}
            customerMetrics={displayCustomer}
            setCustomerMetrics={setCustomerMetrics}
            operationalMetrics={displayOperational}
            setOperationalMetrics={setOperationalMetrics}
            orgMetrics={displayOrg}
            setOrgMetrics={setOrgMetrics}
            isSidebarCollapsed={isSidebarCollapsed}
            activeStep={activeStep}
            readOnly={isExecutive}
            fullWidth={fullWidth}
            viewMode={currentViewMode}
            showFullForm={showFullFormOverride ?? showFullForm}
            isDetailView={isDetailView}
            deptHeadName={selectedDeptInfo?.deptHead.name}
            currentUserRole={currentUserRole}
          />
        );
      default:
        return (
          <DefaultStageContent 
            financialMetrics={financialMetrics}
            setFinancialMetrics={setFinancialMetrics}
            customerMetrics={customerMetrics}
            setCustomerMetrics={setCustomerMetrics}
            operationalMetrics={operationalMetrics}
            setOperationalMetrics={setOperationalMetrics}
            orgMetrics={orgMetrics}
            setOrgMetrics={setOrgMetrics}
            isSidebarCollapsed={isSidebarCollapsed}
            activeStep={activeStep}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f3f4f6] text-sm text-slate-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 flex flex-col flex-shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <div className="flex items-center overflow-hidden">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
              <span className="transform -skew-x-12">S</span>
            </div>
            {!isSidebarCollapsed && (
              <div className="whitespace-nowrap">
                <div className="font-bold text-base leading-tight">Segway-Ninebot</div>
                <div className="text-xs text-slate-500">九号公司</div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 flex-shrink-0"
            title={isSidebarCollapsed ? "展开菜单" : "收起菜单"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-2">
            <MenuItem icon={<User size={18} />} label="员工自助" isCollapsed={isSidebarCollapsed} />
            <MenuItem icon={<BookOpen size={18} />} label="应知应会" isCollapsed={isSidebarCollapsed} />
            <MenuItem 
              icon={<GitMerge size={18} />} 
              label="流程中心" 
              isCollapsed={isSidebarCollapsed} 
              active={activeView === 'process'}
              onClick={() => setActiveView('process')}
            />
            <MenuItem icon={<Briefcase size={18} />} label="个人绩效" isCollapsed={isSidebarCollapsed} />
            
            <div className="mt-1">
              <div 
                className={`flex items-center px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
                title={isSidebarCollapsed ? "组织绩效" : undefined}
              >
                <div className={`flex items-center ${isSidebarCollapsed ? '' : 'gap-3'}`}>
                  <Users size={18} className="text-slate-500" />
                  {!isSidebarCollapsed && <span className="whitespace-nowrap">组织绩效</span>}
                </div>
                {!isSidebarCollapsed && <ChevronDown size={16} className="text-slate-400" />}
              </div>
              {!isSidebarCollapsed && (
                <div className="ml-9 mt-1 space-y-1">
                  <div 
                    onClick={() => setActiveView('department')}
                    className={`px-4 py-2 rounded-lg cursor-pointer text-[13px] relative whitespace-nowrap transition-all ${
                      activeView === 'department' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {activeView === 'department' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-600 rounded-r-full"></div>}
                    组织绩效填写
                  </div>
                  <div 
                    onClick={() => {
                      setActiveView('executive');
                      setCurrentUserRole('分管常委');
                    }}
                    className={`px-4 py-2 rounded-lg cursor-pointer text-[13px] relative whitespace-nowrap transition-all ${
                      activeView === 'executive' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {activeView === 'executive' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-600 rounded-r-full"></div>}
                    组织绩效审批
                  </div>
                  <div 
                    onClick={() => setActiveView('dashboard')}
                    className={`px-4 py-2 rounded-lg cursor-pointer text-[13px] relative whitespace-nowrap transition-all ${
                      activeView === 'dashboard' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {activeView === 'dashboard' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-600 rounded-r-full"></div>}
                    组织绩效看板
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Row 1: Platform Header (User Info) */}
        <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-end px-6 flex-shrink-0 z-30">
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer p-1.5 hover:bg-slate-50 rounded-full transition-colors">
              <Bell size={18} className="text-slate-500" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
            </div>
            <div className="w-px h-4 bg-slate-200"></div>
            <div className="flex items-center gap-2 cursor-pointer group hover:bg-slate-50 p-1 rounded-lg transition-colors">
              <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-7 h-7 rounded-full border border-slate-200" />
              <div className="text-xs font-bold text-slate-700">张三</div>
              <ChevronDown size={12} className="text-slate-400 group-hover:text-slate-600" />
            </div>
          </div>
        </header>

        {activeView === 'department' ? (
          !hasStartedOrgPerformance ? (
            <OrgPerformanceStartPage onStart={() => setHasStartedOrgPerformance(true)} />
          ) : (
            <>
              {/* Row 2: Unified Business Header */}
              <BusinessHeader 
                departments={departments} 
                activeDept={activeDept} 
                setActiveDept={setActiveDept} 
                activeStep={activeStep}
                totalWeight={totalWeight}
                totalMetricsCount={totalMetricsCount}
                isPlanSubmitted={isPlanSubmitted}
                isPlanApproved={isPlanApproved}
                isPlanChanging={isPlanChanging}
                viewMode="department"
              />

              <ProcessStageBar 
                steps={steps}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                viewMode="department"
              />

              {/* Gap between Header and Toolbar */}
              <div className="h-4 flex-shrink-0"></div>

              {/* Fixed Toolbar */}
              <ActionBar 
                activeStep={activeStep} 
                isSidebarCollapsed={isSidebarCollapsed} 
                totalMetricsCount={totalMetricsCount} 
                totalWeight={totalWeight}
                onBatchSetReviewer={() => setIsBatchReviewerModalOpen(true)}
                viewMode="department"
                midTermStats={midTermStats}
                isPlanSubmitted={isPlanSubmitted}
                setIsPlanSubmitted={setIsPlanSubmitted}
                isPlanApproved={isPlanApproved}
                isPlanChanging={isPlanChanging}
                onCancelChange={() => setIsPlanChanging(false)}
                onSubmitChange={() => setIsPlanChangeModalOpen(true)}
                onOpenApprovalDrawer={() => setIsApprovalDrawerOpen(true)}
                onPlanChangeClick={() => setIsPlanChanging(true)}
                departmentType={departmentType}
                addedDimensions={addedDimensions}
                onAddDimension={(dim) => {
                  if (!addedDimensions.includes(dim)) {
                    setAddedDimensions([...addedDimensions, dim]);
                  }
                }}
                onShareOpen={() => setIsShareModalOpen(true)}
              />

              {/* Scrollable Content */}
              {renderContent()}

              {/* Floating Department Type Selector */}
              {activeStep === 0 && (
                <div className="fixed bottom-20 right-6 z-[60]">
                  <div className="relative">
                    {isDeptTypeMenuOpen && (
                      <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">切换部门类型</div>
                        {['经营单元', '职能部门/能力中心'].map((type) => (
                          <div 
                            key={type}
                            onClick={() => {
                              setDepartmentType(type);
                              setIsDeptTypeMenuOpen(false);
                            }}
                            className={`px-4 py-2.5 text-[13px] cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${
                              departmentType === type ? 'text-blue-600 font-medium bg-blue-50/50' : 'text-slate-600'
                            }`}
                          >
                            {type}
                            {departmentType === type && <Check size={14} />}
                          </div>
                        ))}
                      </div>
                    )}
                    <button 
                      onClick={() => setIsDeptTypeMenuOpen(!isDeptTypeMenuOpen)}
                      className="w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center group active:scale-95"
                      title="切换部门类型"
                    >
                      <Library size={24} className={isDeptTypeMenuOpen ? 'rotate-12' : ''} />
                      <div className="absolute right-full mr-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        部门类型: {departmentType}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Floating Role Selector */}
              <div className={`fixed ${(activeStep === 2 && activeView === 'department') ? 'bottom-28' : 'bottom-6'} right-6 z-[60]`}>
                <div className="relative">
                  {isRoleMenuOpen && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">切换当前角色</div>
                      {(activeView === 'executive' ? ['相关方', '能力中心负责人', '分管执委', '分管常委'] : ['数据提供人', '主BP', '一级部门负责人']).map((role) => (
                        <div 
                          key={role}
                          onClick={() => {
                            setCurrentUserRole(role);
                            setIsRoleMenuOpen(false);
                          }}
                          className={`px-4 py-2.5 text-[13px] cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${
                            currentUserRole === role ? 'text-blue-600 font-medium bg-blue-50/50' : 'text-slate-600'
                          }`}
                        >
                          {role}
                          {currentUserRole === role && <Check size={14} />}
                        </div>
                      ))}
                    </div>
                  )}
                  <button 
                    onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                    className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center group active:scale-95"
                    title="切换角色"
                  >
                    <User size={24} className={isRoleMenuOpen ? 'rotate-12' : ''} />
                    <div className="absolute right-full mr-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      当前角色: {currentUserRole}
                    </div>
                  </button>
                </div>
              </div>

              {/* Sticky Footer for Assessment Stages */}
              {activeStep === 2 && currentUserRole !== '数据提供人' && currentUserRole !== '主BP' && (
                <AssessmentFooter 
                  isSidebarCollapsed={isSidebarCollapsed} 
                  metrics={[...financialMetrics, ...customerMetrics, ...operationalMetrics, ...orgMetrics]}
                  showCommitteeFields={false}
                  hideLabelPrefix={true}
                />
              )}
            </>
          )
        ) : activeView === 'dashboard' ? (
          <DepartmentDashboard />
        ) : activeView === 'executive' || activeView === 'stakeholder' ? (
          <>
            {/* Row 2: Unified Business Header (No Tabs) */}
            {activeView === 'executive' && (
              <BusinessHeader 
                departments={departments} 
                activeDept={activeDept} 
                setActiveDept={setActiveDept} 
                activeStep={activeStep}
                totalWeight={totalWeight}
                totalMetricsCount={totalMetricsCount}
                isPlanSubmitted={isPlanSubmitted}
                isPlanApproved={isPlanApproved}
                isPlanChanging={isPlanChanging}
                showTabs={false}
                viewMode="executive"
              />
            )}

            <ProcessStageBar 
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              viewMode={activeView === 'executive' ? 'executive' : 'stakeholder'}
            />

            {activeView === 'executive' ? (
              <>
                <ExecutivePerformance 
                  tasks={mockExecutiveTasks}
                  activeStep={activeStep}
                  onGoToApproval={(task) => {
                    setSelectedDeptInfo({
                      id: task.id,
                      deptName: task.deptName,
                      deptHead: task.deptHead,
                      status: task.status
                    });
                    if (currentUserRole === '分管常委' && activeStep === 0) {
                      setShowFullForm(true);
                    } else {
                      setShowFullForm(false);
                    }
                    setIsExecutiveDetail(true);
                  }} 
                />
                {/* Floating Role Selector for Approval View */}
                <div className="fixed bottom-6 right-6 z-[60]">
                  <div className="relative">
                    {isRoleMenuOpen && (
                      <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">切换当前角色</div>
                        {['相关方', '能力中心负责人', '分管执委', '分管常委'].map((role) => (
                          <div 
                            key={role}
                            onClick={() => {
                              setCurrentUserRole(role);
                              setIsRoleMenuOpen(false);
                            }}
                            className={`px-4 py-2.5 text-[13px] cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${
                              currentUserRole === role ? 'text-blue-600 font-medium bg-blue-50/50' : 'text-slate-600'
                            }`}
                          >
                            {role}
                            {currentUserRole === role && <Check size={14} />}
                          </div>
                        ))}
                      </div>
                    )}
                    <button 
                      onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                      className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center group active:scale-95"
                      title="切换角色"
                    >
                      <User size={24} className={isRoleMenuOpen ? 'rotate-12' : ''} />
                      <div className="absolute right-full mr-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        当前角色: {currentUserRole}
                      </div>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <StakeholderPerformance 
                onGoToApproval={(task) => {
                  setSelectedDeptInfo({
                    id: task.id,
                    deptName: task.deptName,
                    deptHead: task.deptHead,
                    status: task.status
                  });
                  // Map stage to step
                  if (task.stage === '组织绩效计划制定') setActiveStep(0);
                  else if (task.stage === '组织绩效考核') setActiveStep(2);
                  
                  setIsExecutiveDetail(true);
                }}
              />
            )}

            {/* Full Screen Modal for Detail View (Executive or Stakeholder) */}
            {isExecutiveDetail && selectedDeptInfo && (
              <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                <ExecutiveDetailHeader 
                  currentDept={selectedDeptInfo}
                  allDepts={activeView === 'executive' ? mockExecutiveTasks : []} // Simplified for stakeholder
                  showActions={activeStep === 0}
                  isAssessment={activeStep === 2}
                  activeStep={activeStep}
                  showFullForm={showFullForm}
                  onToggleFullForm={() => setShowFullForm(!showFullForm)}
                  currentUserRole={currentUserRole}
                  onSwitchDept={(dept) => {
                    setSelectedDeptInfo({
                      id: dept.id,
                      deptName: dept.deptName,
                      deptHead: dept.deptHead,
                      status: dept.status
                    });
                  }}
                  onClose={() => {
                    setIsExecutiveDetail(false);
                    setSelectedDeptInfo(null);
                    setShowFullForm(false); // Reset when closing
                  }}
                />
                
                <div className="flex-1 overflow-y-auto bg-[#f8fafc] pb-14">
                  {renderContent(true, (activeView === 'executive' && currentUserRole === '相关方' && (activeStep === 0 || activeStep === 2)) ? 'stakeholder' : activeView, showFullForm)}
                </div>

                {activeStep === 2 && activeView !== 'stakeholder' && currentUserRole !== '相关方' && (
                  <AssessmentFooter 
                    isSidebarCollapsed={isSidebarCollapsed} 
                    fullWidth={true} 
                    customLabel="分管常委/执委评价等级"
                    metrics={[...financialMetrics, ...customerMetrics, ...operationalMetrics, ...orgMetrics]}
                    deptHeadName={selectedDeptInfo?.deptHead.name}
                  />
                )}
              </div>
            )}
          </>
        ) : (
          <ProcessCenter />
        )}

        {/* Batch Reviewer Selection Modal */}
        <ReviewerModal 
          isOpen={isBatchReviewerModalOpen}
          onClose={() => setIsBatchReviewerModalOpen(false)}
          onConfirm={(selected) => {
            const updateMetrics = (metrics: Metric[]) => metrics.map(m => ({
              ...m,
              reviewers: selected,
              reviewer: selected.length > 0 ? selected[0].name : m.reviewer,
              reviewerWeight: selected.length > 0 ? selected[0].weight : m.reviewerWeight
            }));
            
            setFinancialMetrics(updateMetrics(financialMetrics));
            setCustomerMetrics(updateMetrics(customerMetrics));
            setOperationalMetrics(updateMetrics(operationalMetrics));
            setOrgMetrics(updateMetrics(orgMetrics));
            
            setIsBatchReviewerModalOpen(false);
          }}
        />
        
        <ApprovalProgressDrawer 
          isOpen={isApprovalDrawerOpen}
          onClose={() => setIsApprovalDrawerOpen(false)}
          onApprove={() => {
            setIsPlanApproved(true);
            setIsPlanSubmitted(false);
          }}
        />

        <PlanChangeModal 
          isOpen={isPlanChangeModalOpen}
          onClose={() => setIsPlanChangeModalOpen(false)}
          onSubmit={(reason) => {
            setPlanChangeReason(reason);
            setIsPlanChangeModalOpen(false);
            setIsPlanChanging(false);
            setIsPlanApproved(false);
            setIsPlanSubmitted(true);
          }}
        />
      </main>
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onConfirm={handleShare}
      />
    </div>
  );
}
