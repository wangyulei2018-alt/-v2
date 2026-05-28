import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  Search, 
  Plus, 
  Save, 
  Trash2, 
  User, 
  Users, 
  LayoutGrid, 
  Settings, 
  Bell, 
  Info,
  Shield,
  HelpCircle,
  Menu,
  ChevronRight,
  Monitor,
  FileText,
  Database,
  PieChart,
  Activity,
  ClipboardList,
  Share2,
  CheckCircle2,
  Folder,
  RefreshCw,
  Download,
  Upload,
  Filter,
  MoreHorizontal,
  Edit,
  Edit2,
  Edit3,
  ExternalLink,
  X,
  Calendar,
  Play,
  GitMerge,
  ArrowLeft,
  Clock,
  ChevronLeft,
  Check,
  CheckCircle,
  Lock,
  AlertCircle,
  Eye,
  FileEdit,
  History,
  FileDown,
  FileUp,
  RotateCw,
  FileSpreadsheet,
  FileCheck,
  MessageSquare,
  MessageCircle,
  Mail,
  Image as ImageIcon
} from 'lucide-react';

// --- Types ---

interface GradeRange {
  id: string;
  grade: string;
  min: string;
  max: string;
}

interface Indicator {
  id: string;
  code: string;
  name: string;
  library: string;
  type: '定量' | '定性';
  formula: string;
  definition: string;
  remarks: string;
  target0: string;
  target3: string;
  target5: string;
  dept: string;
  category: string;
  /** 指标分类（列表/表单图1） */
  classification: string;
  /** 数据来源部门（中文，列表展示） */
  dataSourceDept: string;
  /** 数据来源部门（英文） */
  dataSourceDeptEn: string;
  /** 适用范围：组织类型 */
  scopeOrgTypes: string[];
  /** 适用组织 */
  scopeOrgs: string[];
  /** 适用组织阶段 */
  scopeStages: string[];
  /** 适用范围块：指标可选性（单选：必选 / 监控 / 可选） */
  scopeOptionality: string;
  /** 适用范围块：其他说明 */
  scopeOtherNote: string;
  /** 外部调研块：指标可选性 */
  researchOptionality: string[];
  /** 外部调研：其他说明 */
  researchOtherNote: string;
  /** 指标标准外部调研说明 */
  researchStandardText: string;
  /** 外部调研附件展示名 */
  researchAttachmentName: string;
}

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active = false, 
  hasSubmenu = false, 
  isOpen = false,
  onClick 
}: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  hasSubmenu?: boolean,
  isOpen?: boolean,
  onClick?: () => void
}) => (
  <div 
    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
      active ? 'bg-blue-50 text-[#2f54eb] border-r-2 border-[#2f54eb]' : 'text-gray-600 hover:bg-gray-50'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className={active ? 'text-[#2f54eb]' : 'text-gray-400'} />
      <span className="text-[13px] font-medium">{label}</span>
    </div>
    {hasSubmenu && (
      <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    )}
  </div>
);

const SubmenuItem = ({ label, active = false, onClick }: { label: string, active?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`pl-12 py-2 cursor-pointer text-[13px] transition-colors ${
      active ? 'text-[#2f54eb] bg-blue-50' : 'text-gray-500 hover:text-gray-800'
    }`}
  >
    {label}
  </div>
);

/** 指标库列表：下拉多选筛选项 */
const ListFilterMultiSelect = ({
  fieldKey,
  label,
  options,
  value,
  onChange,
  openKey,
  onOpenKey,
  placeholder = '请选择',
}: {
  fieldKey: string;
  label: string;
  options: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
  openKey: string | null;
  onOpenKey: (k: string | null) => void;
  placeholder?: string;
}) => {
  const open = openKey === fieldKey;
  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((x) => x !== opt) : [...value, opt]);
  };
  const summary =
    value.length === 0
      ? placeholder
      : value.length <= 2
        ? value.join('、')
        : `${value.slice(0, 2).join('、')} 等${value.length}项`;
  return (
    <div className="relative min-w-0">
      <span className="block text-[11px] text-gray-500 mb-0.5 truncate">{label}</span>
      <button
        type="button"
        onClick={() => onOpenKey(open ? null : fieldKey)}
        className={`w-full flex items-center justify-between gap-1 min-h-[32px] px-2 py-1 border rounded text-left text-[12px] bg-white transition-colors ${
          open ? 'border-[#1677ff] ring-1 ring-[#1677ff]/20' : 'border-gray-200 hover:border-gray-300'
        } ${value.length ? 'text-gray-900' : 'text-gray-400'}`}
      >
        <span className="truncate flex-1 min-w-0">{summary}</span>
        <ChevronDown size={14} className={`shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[60]" aria-hidden onClick={() => onOpenKey(null)} />
          <div className="absolute left-0 right-0 top-full mt-1 z-[61] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[min(260px,45vh)]">
            <div className="overflow-y-auto p-1.5 space-y-0.5">
              {options.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer select-none text-[12px] text-gray-700"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff] shrink-0"
                    checked={value.includes(opt)}
                    onChange={() => toggle(opt)}
                  />
                  <span className="truncate">{opt}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 p-2 border-t border-gray-100 bg-gray-50/80 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange([]);
                }}
                className="px-2.5 py-1 text-[11px] text-gray-600 hover:bg-white rounded border border-gray-200"
              >
                清空
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenKey(null);
                }}
                className="px-2.5 py-1 text-[11px] bg-[#1677ff] text-white rounded hover:bg-[#0958d9]"
              >
                完成
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

type ListOptionalFilterKey = 'classification' | 'type' | 'scopeOrgType' | 'scopeOrg' | 'scopeStage';

const LIST_OPTIONAL_FILTER_ORDER: ListOptionalFilterKey[] = [
  'classification',
  'type',
  'scopeOrgType',
  'scopeOrg',
  'scopeStage',
];

const LIST_OPTIONAL_FILTER_LABELS: Record<ListOptionalFilterKey, string> = {
  classification: '指标分类',
  type: '指标类型',
  scopeOrgType: '适用组织类型',
  scopeOrg: '适用组织',
  scopeStage: '适用组织阶段',
};

const IndicatorLibraryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部指标分类');
  const [listFilterCodeNameDept, setListFilterCodeNameDept] = useState('');
  const [listFilterClassifications, setListFilterClassifications] = useState<string[]>([]);
  const [listFilterTypes, setListFilterTypes] = useState<string[]>([]);
  const [listFilterScopeOrgTypes, setListFilterScopeOrgTypes] = useState<string[]>([]);
  const [listFilterScopeOrgs, setListFilterScopeOrgs] = useState<string[]>([]);
  const [listFilterScopeStages, setListFilterScopeStages] = useState<string[]>([]);
  const [listFilterOpenKey, setListFilterOpenKey] = useState<string | null>(null);
  const [listOptionalFilterKeys, setListOptionalFilterKeys] = useState<ListOptionalFilterKey[]>([]);
  const [isAddListFilterModalOpen, setIsAddListFilterModalOpen] = useState(false);
  const [addListFilterDraft, setAddListFilterDraft] = useState<ListOptionalFilterKey[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<'create' | 'edit'>('create');
  const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState([
    { name: '财务指标' },
    { name: '客户指标' },
    { name: '运营指标' },
    { name: '组织发展' },
  ]);
  const [isCategoryDeleteConfirmOpen, setIsCategoryDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [selectedIndicatorIds, setSelectedIndicatorIds] = useState<string[]>([]);
  const [deleteMode, setDeleteMode] = useState<'single' | 'batch'>('single');
  
  // -- Multi-language state for category modal --
  const [categoryLanguages, setCategoryLanguages] = useState<{ zh: string; en: string }>({ zh: '', en: '' });
  const [showEnInput, setShowEnInput] = useState(false);
  const [isLangDetailsOpen, setIsLangDetailsOpen] = useState(false);

  const [indicatorClassification, setIndicatorClassification] = useState('财务指标');
  const [scopeOrgTypes, setScopeOrgTypes] = useState<string[]>([]);
  const [scopeOrgs, setScopeOrgs] = useState<string[]>([]);
  const [scopeOrgsDropdownOpen, setScopeOrgsDropdownOpen] = useState(false);
  const [scopeOrgsSearch, setScopeOrgsSearch] = useState('');
  const [scopeStages, setScopeStages] = useState<string[]>([]);
  const [scopeOptionality, setScopeOptionality] = useState<string>('');
  const [scopeOtherNote, setScopeOtherNote] = useState('');
  const [researchStandardText, setResearchStandardText] = useState('');
  const [researchAttachmentName, setResearchAttachmentName] = useState('');
  const [draftIndicatorCode, setDraftIndicatorCode] = useState('MET4074');
  const researchFileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleStrInList = (list: string[], setList: (v: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  };

  const SCOPE_ORG_TYPE_OPTS = ['经营单元', '能力中心', '职能部门'];
  const SCOPE_ORG_OPTS = ['电动车', '中经', '短交通', '机器人', '海外业务', '其他BU'];
  /** 适用组织下拉：BU + 职能部门（演示，可与主数据对接） */
  const SCOPE_ORG_SELECT_OPTS = [
    ...SCOPE_ORG_OPTS,
    '财务部',
    '人力资源部',
    '技术中心',
    '营销中心',
    '供应链中心',
    '总裁办',
    '审计部',
    '法务部',
  ];
  const SCOPE_STAGE_OPTS = ['初创期', '成长期', '成熟期', '转型期', '全阶段'];
  const OPTIONALITY_OPTS = ['必选', '监控', '可选'];

  const scopeOrgSelectListAll = useMemo(() => {
    const extra = scopeOrgs.filter((v) => !SCOPE_ORG_SELECT_OPTS.includes(v));
    return [...extra, ...SCOPE_ORG_SELECT_OPTS.filter((o) => !extra.includes(o))];
  }, [scopeOrgs]);

  const filteredScopeOrgSelectOpts = useMemo(() => {
    const q = scopeOrgsSearch.trim().toLowerCase();
    if (!q) return scopeOrgSelectListAll;
    return scopeOrgSelectListAll.filter((o) => o.toLowerCase().includes(q));
  }, [scopeOrgsSearch, scopeOrgSelectListAll]);

  // -- Multi-language state for indicator drawer --
  const [indicatorTypeInDrawer, setIndicatorTypeInDrawer] = useState<'定量' | '定性'>('定性');
  const [drawerLangField, setDrawerLangField] = useState<string | null>(null);
  const [drawerLanguages, setDrawerLanguages] = useState<Record<string, { zh: string; en: string }>>({
    name: { zh: '', en: '' },
    formula: { zh: '', en: '' },
    definition: { zh: '', en: '' },
    dataSourceDept: { zh: '', en: '' },
    target0: { zh: '', en: '' },
    target3: { zh: '', en: '' },
    target5: { zh: '', en: '' },
  });
  
  const [indicators, setIndicators] = useState<Indicator[]>([
    {
      id: '1',
      code: 'MET20251000',
      name: '代码质量缺陷率-0',
      library: '财务指标',
      type: '定量',
      formula: '(Bug数 / 代码行数) * 1000',
      definition: '衡量交付代码质量',
      remarks: '考核公司整体营收增长情况',
      target0: '< 5%',
      target3: '10%',
      target5: '> 15%',
      dept: '财务部',
      category: '财务指标',
      classification: '财务指标',
      dataSourceDept: '财务部',
      dataSourceDeptEn: '',
      scopeOrgTypes: ['经营单元'],
      scopeOrgs: ['电动车', '短交通'],
      scopeStages: ['成长期', '成熟期'],
      scopeOptionality: '必选',
      scopeOtherNote: '',
      researchOptionality: ['监控'],
      researchOtherNote: '',
      researchStandardText: '',
      researchAttachmentName: '',
    },
    {
      id: '2',
      code: 'MET20251001',
      name: '团队协作评分-1',
      library: '客户指标',
      type: '定性',
      formula: '--',
      definition: '衡量协作价值',
      remarks: '年度客户满意度调研',
      target0: '< 70',
      target3: '85',
      target5: '> 95',
      dept: '技术部',
      category: '客户指标',
      classification: '客户指标',
      dataSourceDept: '技术部',
      dataSourceDeptEn: '',
      scopeOrgTypes: ['职能部门', '能力中心'],
      scopeOrgs: ['中经'],
      scopeStages: ['全阶段'],
      scopeOptionality: '可选',
      scopeOtherNote: '',
      researchOptionality: ['可选'],
      researchOtherNote: '',
      researchStandardText: '',
      researchAttachmentName: '',
    },
    {
      id: '3',
      code: 'MET20251002',
      name: '重大安全事故-2',
      library: '运营指标',
      type: '定性',
      formula: '--',
      definition: '衡量负向违规',
      remarks: '考核公司盈利增长情况',
      target0: '< 3%',
      target3: '8%',
      target5: '> 12%',
      dept: '技术部',
      category: '运营指标',
      classification: '运营指标',
      dataSourceDept: '安全监察部',
      dataSourceDeptEn: '',
      scopeOrgTypes: ['经营单元', '职能部门'],
      scopeOrgs: ['电动车', '机器人'],
      scopeStages: ['成熟期'],
      scopeOptionality: '必选',
      scopeOtherNote: '',
      researchOptionality: ['必选'],
      researchOtherNote: '',
      researchStandardText: '',
      researchAttachmentName: '',
    },
    {
      id: '4',
      code: 'MET20251003',
      name: '代码质量缺陷率-3',
      library: '组织发展',
      type: '定量',
      formula: '(Bug数 / 代码行数) * 1000',
      definition: '衡量交付代码质量',
      remarks: '考核团队交付质量',
      target0: '< 5%',
      target3: '10%',
      target5: '> 15%',
      dept: '财务部',
      category: '组织发展',
      classification: '组织发展',
      dataSourceDept: '研发效能组',
      dataSourceDeptEn: '',
      scopeOrgTypes: ['能力中心'],
      scopeOrgs: ['短交通', '海外业务'],
      scopeStages: ['成长期'],
      scopeOptionality: '监控',
      scopeOtherNote: '',
      researchOptionality: [],
      researchOtherNote: '',
      researchStandardText: '',
      researchAttachmentName: '',
    },
    {
      id: '5',
      code: 'MET20251004',
      name: '团队协作评分-4',
      library: '财务指标',
      type: '定性',
      formula: '--',
      definition: '衡量协作价值',
      remarks: '衡量协作价值',
      target0: '< 70',
      target3: '85',
      target5: '> 95',
      dept: '财务部',
      category: '财务指标',
      classification: '财务指标',
      dataSourceDept: '财务部',
      dataSourceDeptEn: '',
      scopeOrgTypes: [],
      scopeOrgs: [],
      scopeStages: ['转型期'],
      scopeOptionality: '可选',
      scopeOtherNote: '',
      researchOptionality: ['可选', '监控'],
      researchOtherNote: '',
      researchStandardText: '',
      researchAttachmentName: '',
    },
  ]);

  const listFilterClassificationOptions = useMemo(() => {
    const set = new Set<string>(categories.map((c) => c.name));
    indicators.forEach((ind) => set.add(ind.classification));
    return Array.from(set);
  }, [categories, indicators]);
  const listFilterScopeOrgOptions = useMemo(() => {
    const set = new Set<string>(SCOPE_ORG_SELECT_OPTS);
    indicators.forEach((ind) => ind.scopeOrgs.forEach((o) => set.add(o)));
    return Array.from(set);
  }, [indicators]);

  const filteredIndicators = indicators.filter((i) => {
    const categoryMatch = selectedCategory === '全部指标分类' || i.category === selectedCategory;
    const kw = listFilterCodeNameDept.trim().toLowerCase();
    if (kw) {
      const dept = (i.dataSourceDept || '').toLowerCase();
      if (
        !i.code.toLowerCase().includes(kw) &&
        !i.name.toLowerCase().includes(kw) &&
        !dept.includes(kw)
      ) {
        return false;
      }
    }
    if (listOptionalFilterKeys.includes('classification')) {
      if (listFilterClassifications.length && !listFilterClassifications.includes(i.classification)) {
        return false;
      }
    }
    if (listOptionalFilterKeys.includes('type')) {
      if (listFilterTypes.length && !listFilterTypes.includes(i.type)) {
        return false;
      }
    }
    if (listOptionalFilterKeys.includes('scopeOrgType')) {
      if (
        listFilterScopeOrgTypes.length &&
        !i.scopeOrgTypes.some((t) => listFilterScopeOrgTypes.includes(t))
      ) {
        return false;
      }
    }
    if (listOptionalFilterKeys.includes('scopeOrg')) {
      if (listFilterScopeOrgs.length && !i.scopeOrgs.some((o) => listFilterScopeOrgs.includes(o))) {
        return false;
      }
    }
    if (listOptionalFilterKeys.includes('scopeStage')) {
      if (listFilterScopeStages.length && !i.scopeStages.some((s) => listFilterScopeStages.includes(s))) {
        return false;
      }
    }
    return categoryMatch;
  });

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIndicatorIds(filteredIndicators.map(i => i.id));
    } else {
      setSelectedIndicatorIds([]);
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIndicatorIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = () => {
    if (selectedIndicatorIds.length > 0) {
      setDeleteMode('batch');
      setIsDeleteConfirmOpen(true);
    }
  };

  const getCategoryCount = (catName: string) => {
    if (catName === '全部指标分类') return indicators.length;
    return indicators.filter((i) => i.category === catName).length;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      {/* Page Header */}
      <div className="px-6 py-4">
        <h1 className="text-[18px] font-bold text-gray-900">组织绩效指标库</h1>
      </div>

      <div className="flex flex-1 overflow-hidden px-6 pb-6 gap-6">
        {/* Left Category Sidebar */}
        <div className="w-52 bg-white rounded-lg border border-gray-200 flex flex-col shadow-sm shrink-0">
          <div className="p-5 flex items-center justify-between text-gray-900">
            <span className="font-bold text-[16px]">指标分类</span>
            <button 
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#2f54eb] transition-all"
              onClick={() => {
                setCategoryModalMode('create');
                setIsCategoryModalOpen(true);
              }}
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-2">
            <div 
              onClick={() => setSelectedCategory('全部指标分类')}
              className={`flex items-center justify-between px-4 py-2.5 rounded-md cursor-pointer text-[14px] mb-1 transition-all ${selectedCategory === '全部指标分类' ? 'bg-[#e6f4ff] text-[#1677ff]' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <span>全部指标分类</span>
              <span className={`text-[12px] ${selectedCategory === '全部指标分类' ? 'text-blue-400' : 'text-gray-400'}`}>
                {getCategoryCount('全部指标分类')}
              </span>
            </div>
            
            {categories.map(cat => (
              <div 
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                onMouseEnter={() => setHoveredCategory(cat.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-md cursor-pointer text-[14px] mb-1 group transition-all ${selectedCategory === cat.name ? 'bg-[#e6f4ff] text-[#1677ff]' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span className="truncate pr-2">{cat.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  {hoveredCategory === cat.name && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-0.5 hover:text-[#1677ff] transition-colors" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCategoryLanguages({ zh: cat.name, en: '' });
                          setSelectedCategory(cat.name);
                          setCategoryModalMode('edit');
                          setIsCategoryModalOpen(true);
                        }}
                      >
                        <Edit3 size={12} />
                      </button>
                      <button 
                        className="p-0.5 hover:text-red-500 transition-colors" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCategoryToDelete(cat.name);
                          setIsCategoryDeleteConfirmOpen(true);
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                  <span className={`text-[12px] ${selectedCategory === cat.name ? 'text-blue-400' : 'text-gray-400'}`}>
                    {getCategoryCount(cat.name)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* 筛选与操作 */}
          <div className="px-5 py-3 border-b border-gray-100 space-y-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-end gap-2">
                  <div className="shrink-0 w-[min(100%,220px)] sm:w-[240px] md:w-[260px]">
                    <input
                      type="text"
                      value={listFilterCodeNameDept}
                      onChange={(e) => setListFilterCodeNameDept(e.target.value)}
                      placeholder="指标编码 / 指标名称 / 数据来源部门"
                      aria-label="指标编码、指标名称、数据来源部门（模糊匹配任一字段）"
                      className="w-full h-8 border border-gray-200 rounded px-2 text-[12px] outline-none focus:border-[#1677ff] bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAddListFilterDraft([...listOptionalFilterKeys]);
                      setIsAddListFilterModalOpen(true);
                    }}
                    className="h-8 px-3 border border-dashed border-gray-300 rounded text-[12px] text-gray-600 hover:border-[#1677ff] hover:text-[#1677ff] bg-white whitespace-nowrap shrink-0 transition-colors"
                  >
                    添加条件
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setListFilterCodeNameDept('');
                      setListFilterClassifications([]);
                      setListFilterTypes([]);
                      setListFilterScopeOrgTypes([]);
                      setListFilterScopeOrgs([]);
                      setListFilterScopeStages([]);
                      setListOptionalFilterKeys([]);
                      setListFilterOpenKey(null);
                      setIsAddListFilterModalOpen(false);
                    }}
                    className="px-3 h-8 border border-gray-200 rounded text-[12px] text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                  >
                    重置
                  </button>
                </div>
                {listOptionalFilterKeys.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-2 pt-1">
                    {listOptionalFilterKeys.includes('classification') && (
                      <div className="block min-w-0">
                        <ListFilterMultiSelect
                          fieldKey="classification"
                          label="指标分类"
                          options={listFilterClassificationOptions}
                          value={listFilterClassifications}
                          onChange={setListFilterClassifications}
                          openKey={listFilterOpenKey}
                          onOpenKey={setListFilterOpenKey}
                        />
                      </div>
                    )}
                    {listOptionalFilterKeys.includes('type') && (
                      <div className="block min-w-0">
                        <ListFilterMultiSelect
                          fieldKey="type"
                          label="指标类型"
                          options={['定量', '定性']}
                          value={listFilterTypes}
                          onChange={setListFilterTypes}
                          openKey={listFilterOpenKey}
                          onOpenKey={setListFilterOpenKey}
                        />
                      </div>
                    )}
                    {listOptionalFilterKeys.includes('scopeOrgType') && (
                      <div className="block min-w-0">
                        <ListFilterMultiSelect
                          fieldKey="scopeOrgType"
                          label="适用组织类型"
                          options={SCOPE_ORG_TYPE_OPTS}
                          value={listFilterScopeOrgTypes}
                          onChange={setListFilterScopeOrgTypes}
                          openKey={listFilterOpenKey}
                          onOpenKey={setListFilterOpenKey}
                        />
                      </div>
                    )}
                    {listOptionalFilterKeys.includes('scopeOrg') && (
                      <div className="block min-w-0">
                        <ListFilterMultiSelect
                          fieldKey="scopeOrg"
                          label="适用组织"
                          options={listFilterScopeOrgOptions}
                          value={listFilterScopeOrgs}
                          onChange={setListFilterScopeOrgs}
                          openKey={listFilterOpenKey}
                          onOpenKey={setListFilterOpenKey}
                        />
                      </div>
                    )}
                    {listOptionalFilterKeys.includes('scopeStage') && (
                      <div className="block min-w-0">
                        <ListFilterMultiSelect
                          fieldKey="scopeStage"
                          label="适用组织阶段"
                          options={SCOPE_STAGE_OPTS}
                          value={listFilterScopeStages}
                          onChange={setListFilterScopeStages}
                          openKey={listFilterOpenKey}
                          onOpenKey={setListFilterOpenKey}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button 
                onClick={() => {
                  setSelectedIndicator(null);
                  setIndicatorTypeInDrawer('定性');
                  setIndicatorClassification('财务指标');
                  setScopeOrgTypes([]);
                  setScopeOrgs([]);
                  setScopeOrgsDropdownOpen(false);
                  setScopeOrgsSearch('');
                  setScopeStages([]);
                  setScopeOptionality('');
                  setScopeOtherNote('');
                  setResearchStandardText('');
                  setResearchAttachmentName('');
                  setDraftIndicatorCode(`MET${Date.now().toString().slice(-7)}`);
                  setDrawerLangField(null);
                  setDrawerLanguages({
                    name: { zh: '', en: '' },
                    formula: { zh: '', en: '' },
                    definition: { zh: '', en: '' },
                    dataSourceDept: { zh: '', en: '' },
                    target0: { zh: '', en: '' },
                    target3: { zh: '', en: '' },
                    target5: { zh: '', en: '' },
                  });
                  setIsIndicatorModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 bg-[#2f54eb] text-white h-8 px-3 rounded text-[12px] hover:bg-[#1d39c4] transition-all shadow-sm whitespace-nowrap"
              >
                <Plus size={14} />
                <span>新建指标</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 bg-white border border-gray-300 text-gray-600 h-8 px-3 rounded text-[12px] hover:bg-gray-50 hover:border-gray-400 transition-all font-medium whitespace-nowrap">
                <Upload size={14} className="text-gray-400" />
                <span>导入</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 bg-white border border-gray-300 text-gray-600 h-8 px-3 rounded text-[12px] hover:bg-gray-50 hover:border-gray-400 transition-all font-medium whitespace-nowrap">
                <Download size={14} className="text-gray-400" />
                <span>导出</span>
              </button>
              <button 
                onClick={handleBatchDelete}
                disabled={selectedIndicatorIds.length === 0}
                className={`flex items-center justify-center gap-1.5 h-8 px-3 rounded text-[12px] transition-all whitespace-nowrap ${
                  selectedIndicatorIds.length > 0 
                  ? 'bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300' 
                  : 'bg-white border border-gray-200 text-gray-300 cursor-not-allowed opacity-80'
                }`}
              >
                <Trash2 size={14} />
                <span>删除</span>
              </button>
            </div>
            {isAddListFilterModalOpen && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
                <div className="bg-white rounded-xl shadow-xl w-[440px] max-w-[calc(100vw-2rem)] overflow-hidden border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-[16px] font-bold text-gray-900">添加条件</h3>
                    <button
                      type="button"
                      onClick={() => setIsAddListFilterModalOpen(false)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="关闭"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="px-6 py-4 space-y-3">
                    <p className="text-[12px] text-gray-500 leading-relaxed">
                      勾选需要在列表上方展示的筛选字段；未勾选的字段将从筛选区隐藏并清空已选值。
                    </p>
                    <div className="space-y-2.5">
                      {LIST_OPTIONAL_FILTER_ORDER.map((key) => (
                        <label
                          key={key}
                          className="flex items-center gap-2.5 cursor-pointer select-none text-[13px] text-gray-800"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff]"
                            checked={addListFilterDraft.includes(key)}
                            onChange={() => {
                              setAddListFilterDraft((prev) =>
                                prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
                              );
                            }}
                          />
                          <span>{LIST_OPTIONAL_FILTER_LABELS[key]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50/80 flex justify-end gap-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsAddListFilterModalOpen(false)}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next = LIST_OPTIONAL_FILTER_ORDER.filter((k) => addListFilterDraft.includes(k));
                        listOptionalFilterKeys.forEach((k) => {
                          if (!next.includes(k)) {
                            if (k === 'classification') setListFilterClassifications([]);
                            else if (k === 'type') setListFilterTypes([]);
                            else if (k === 'scopeOrgType') setListFilterScopeOrgTypes([]);
                            else if (k === 'scopeOrg') setListFilterScopeOrgs([]);
                            else if (k === 'scopeStage') setListFilterScopeStages([]);
                          }
                        });
                        setListOptionalFilterKeys(next);
                        setListFilterOpenKey(null);
                        setIsAddListFilterModalOpen(false);
                      }}
                      className="px-5 py-2 bg-[#1677ff] text-white rounded-lg text-[13px] font-medium hover:bg-[#0958d9] transition-colors"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-auto border-t border-gray-100">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="text-left text-[14px] text-gray-900 border-b border-gray-100 bg-white">
                  <th className="w-12 py-3 px-4 text-center border-r border-gray-100">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff] cursor-pointer" 
                      checked={filteredIndicators.length > 0 && selectedIndicatorIds.length === filteredIndicators.length}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="py-3 px-4 font-normal border-r border-gray-100 min-w-[120px] whitespace-nowrap">指标编码</th>
                  <th className="py-3 px-4 font-normal border-r border-gray-100 min-w-[120px]">指标分类</th>
                  <th className="py-3 px-4 font-normal border-r border-gray-100 min-w-[200px]">指标名称</th>
                  <th className="py-3 px-4 font-normal border-r border-gray-100 min-w-[100px]">指标类型</th>
                  <th className="py-3 px-4 font-normal border-r border-gray-100 min-w-[220px]">指标定义/设置目的</th>
                  <th className="py-3 px-4 font-normal border-r border-gray-100 min-w-[180px]">计算公式</th>
                  <th className="py-3 px-4 font-normal border-r border-gray-100 min-w-[140px]">数据来源部门</th>
                  <th className="w-[140px] py-3 px-5 font-normal sticky right-0 bg-white z-20 border-l border-gray-100 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)] text-left">操作</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-gray-600">
                {filteredIndicators.map((item) => (
                  <tr key={item.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors group ${selectedIndicatorIds.includes(item.id) ? 'bg-blue-50/30' : ''}`}>
                    <td className="py-3.5 px-4 text-center border-r border-gray-50">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff] cursor-pointer" 
                        checked={selectedIndicatorIds.includes(item.id)}
                        onChange={() => toggleSelectRow(item.id)}
                      />
                    </td>
                    <td
                      className="py-3.5 px-4 border-r border-gray-50 font-mono text-[12px] text-gray-600 whitespace-nowrap max-w-[140px] truncate"
                      title={item.code}
                    >
                      {item.code}
                    </td>
                    <td className="py-3.5 px-4 border-r border-gray-50">{item.classification}</td>
                    <td className="py-3.5 px-4 text-gray-900 border-r border-gray-50">{item.name}</td>
                    <td className="py-3.5 px-4 border-r border-gray-50">
                      <span className="font-medium">{item.type}</span>
                    </td>
                    <td className="py-3.5 px-4 border-r border-gray-50 max-w-[260px] truncate" title={item.definition}>
                      {item.definition}
                    </td>
                    <td className="py-3.5 px-4 border-r border-gray-50 max-w-[200px] truncate" title={item.formula}>
                      {item.formula}
                    </td>
                    <td className="py-3.5 px-4 border-r border-gray-50 max-w-[160px] truncate" title={item.dataSourceDept}>
                      {item.dataSourceDept}
                    </td>
                    <td className="py-3.5 px-5 sticky right-0 bg-white group-hover:bg-gray-50 z-10 border-l border-gray-50 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)] transition-colors">
                      <div className="flex items-center gap-4 whitespace-nowrap">
                        <button 
                          onClick={() => {
                            setSelectedIndicator(item);
                            setIndicatorTypeInDrawer(item.type);
                            setIndicatorClassification(item.classification);
                            setScopeOrgTypes([...item.scopeOrgTypes]);
                            setScopeOrgs([...item.scopeOrgs]);
                            setScopeOrgsDropdownOpen(false);
                            setScopeOrgsSearch('');
                            setScopeStages([...item.scopeStages]);
                            setScopeOptionality(item.scopeOptionality);
                            setScopeOtherNote(item.scopeOtherNote);
                            setResearchStandardText(item.researchStandardText);
                            setResearchAttachmentName(item.researchAttachmentName);
                            setDraftIndicatorCode(item.code);
                            setDrawerLangField(null);
                            setDrawerLanguages({
                              name: { zh: item.name, en: '' },
                              formula: { zh: item.formula, en: '' },
                              definition: { zh: item.definition, en: '' },
                              dataSourceDept: { zh: item.dataSourceDept, en: item.dataSourceDeptEn ?? '' },
                              target0: { zh: item.target0, en: '' },
                              target3: { zh: item.target3, en: '' },
                              target5: { zh: item.target5, en: '' },
                            });
                            setIsIndicatorModalOpen(true);
                          }}
                          className="text-[#1677ff] hover:text-[#4096ff] transition-colors"
                        >
                          编辑
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedIndicator(item);
                            setDeleteMode('single');
                            setIsDeleteConfirmOpen(true);
                          }}
                          className="text-[#ff4d4f] hover:text-[#ff7875] transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-5 text-[13px] text-gray-500 bg-white">
            <div className="flex items-center gap-1 font-medium">
              <span>共 5 条</span>
              <span className="ml-2">第 1 / 1 页</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-1.5 border border-gray-300 rounded text-gray-400 bg-white hover:bg-gray-50 transition-all">上一页</button>
              <button className="px-4 py-1.5 border border-gray-300 rounded text-gray-400 bg-white hover:bg-gray-50 transition-all">下一页</button>
            </div>
            <div className="relative">
              <select className="border border-gray-300 rounded px-2 py-1.5 outline-none appearance-none bg-white cursor-pointer hover:border-gray-400 pr-8">
                <option>10条/页</option>
                <option>20条/页</option>
                <option>50条/页</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Indicator Library Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] w-[580px] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 transition-all">
              <h2 className="text-[26px] font-bold text-gray-900 tracking-tight">
                {categoryModalMode === 'create' ? '新建指标分类' : '编辑指标分类'}
              </h2>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-10 py-12 space-y-1 relative">
              <div className="space-y-4">
                <label className="block text-[16px] font-medium text-gray-700">
                  <span className="text-[#ff4d4f] mr-1 font-bold">*</span>
                  <span className="opacity-80">指标分类</span>
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="请输入"
                    value={categoryLanguages.zh}
                    onChange={(e) => setCategoryLanguages({ ...categoryLanguages, zh: e.target.value })}
                    className="w-full h-12 border border-gray-200 rounded-xl pl-5 pr-20 text-[16px] focus:border-[#2f54eb] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-300 hover:border-gray-400 shadow-sm"
                  />
                  <div 
                    onClick={() => setIsLangDetailsOpen(!isLangDetailsOpen)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-white border border-gray-200 rounded text-[13px] text-gray-500 font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    中文
                  </div>

                  {/* Secondary Lang Details Popup */}
                  <AnimatePresence>
                    {isLangDetailsOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-[110%] z-50 bg-white rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] border border-gray-100 p-5 w-[320px] space-y-4"
                      >
                        <div className="space-y-2">
                          <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">中文名称</label>
                          <input 
                            type="text" 
                            value={categoryLanguages.zh}
                            onChange={(e) => setCategoryLanguages({ ...categoryLanguages, zh: e.target.value })}
                            className="w-full h-10 border border-gray-200 rounded-lg px-4 text-[14px] focus:border-[#2f54eb] outline-none"
                            placeholder="请输入中文"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">英文名称</label>
                          <input 
                            type="text" 
                            value={categoryLanguages.en}
                            onChange={(e) => setCategoryLanguages({ ...categoryLanguages, en: e.target.value })}
                            className="w-full h-10 border border-gray-200 rounded-lg px-4 text-[14px] focus:border-[#2f54eb] outline-none"
                            placeholder="请输入英文"
                          />
                        </div>
                        <div className="pt-2 flex justify-end">
                          <button 
                            onClick={() => setIsLangDetailsOpen(false)}
                            className="text-[13px] font-bold text-[#2f54eb] hover:underline"
                          >
                            完成
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-4 px-10 py-6 bg-white border-t border-gray-50">
              <button 
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setCategoryLanguages({ zh: '', en: '' });
                  setShowEnInput(false);
                  setIsLangDetailsOpen(false);
                }}
                className="px-8 py-3 border border-gray-200 rounded-xl text-[16px] font-bold text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all select-none"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  if (categoryLanguages.zh) {
                    if (categoryModalMode === 'create') {
                      setCategories([...categories, { name: categoryLanguages.zh }]);
                    } else {
                      // Handle edit logic if needed, for now just simple addition
                      setCategories(categories.map(c => c.name === selectedCategory ? { ...c, name: categoryLanguages.zh } : c));
                    }
                    setIsCategoryModalOpen(false);
                    setCategoryLanguages({ zh: '', en: '' });
                    setShowEnInput(false);
                    setIsLangDetailsOpen(false);
                  }
                }}
                className="px-10 py-3 bg-[#2f54eb] text-white rounded-xl text-[16px] font-bold hover:bg-[#1d39c4] transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] select-none"
              >
                确定
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Indicator Form Drawer */}
      <AnimatePresence>
        {isIndicatorModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setScopeOrgsDropdownOpen(false);
                setScopeOrgsSearch('');
                setIsIndicatorModalOpen(false);
              }}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[1px]"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-[880px] bg-white shadow-2xl z-[101] flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                <h2 className="text-[18px] font-bold text-gray-900">
                  {selectedIndicator ? '编辑指标' : '新建指标'}
                </h2>
                <button 
                  onClick={() => {
                    setScopeOrgsDropdownOpen(false);
                    setScopeOrgsSearch('');
                    setIsIndicatorModalOpen(false);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8 custom-scrollbar">
                {/* Part 1: Basic Info */}
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-[#2f54eb] rounded-full" />
                      <h3 className="text-[18px] font-bold text-gray-900">基础信息</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                    <div className="space-y-2">
                      <label className="text-[14px] text-gray-900 font-medium">指标编码</label>
                      <input
                        type="text"
                        value={draftIndicatorCode}
                        readOnly
                        className="w-full h-11 border border-gray-200 bg-gray-50/50 rounded-lg px-4 text-[14px] text-gray-900 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] text-gray-900 font-medium">
                        <span className="text-red-500 mr-1">*</span>指标名称
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={drawerLanguages.name.zh}
                          onChange={(e) =>
                            setDrawerLanguages({
                              ...drawerLanguages,
                              name: { ...drawerLanguages.name, zh: e.target.value },
                            })
                          }
                          placeholder="请输入指标名称"
                          className="w-full h-11 border border-gray-200 rounded-lg px-4 pr-16 text-[14px] focus:border-[#2f54eb] focus:ring-1 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300"
                        />
                        <div
                          onClick={() => setDrawerLangField(drawerLangField === 'name' ? null : 'name')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-white border border-gray-200 rounded text-[13px] text-gray-500 font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          中文
                        </div>
                        <AnimatePresence>
                          {drawerLangField === 'name' && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute right-0 top-[110%] z-50 bg-white rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] border border-gray-100 p-5 w-[320px] space-y-4"
                            >
                              <div className="space-y-2">
                                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">中文名称</label>
                                <input
                                  type="text"
                                  value={drawerLanguages.name.zh}
                                  onChange={(e) =>
                                    setDrawerLanguages({
                                      ...drawerLanguages,
                                      name: { ...drawerLanguages.name, zh: e.target.value },
                                    })
                                  }
                                  className="w-full h-10 border border-gray-200 rounded-lg px-4 text-[14px] focus:border-[#2f54eb] outline-none"
                                  placeholder="请输入中文"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">英文名称</label>
                                <input
                                  type="text"
                                  value={drawerLanguages.name.en}
                                  onChange={(e) =>
                                    setDrawerLanguages({
                                      ...drawerLanguages,
                                      name: { ...drawerLanguages.name, en: e.target.value },
                                    })
                                  }
                                  className="w-full h-10 border border-gray-200 rounded-lg px-4 text-[14px] focus:border-[#2f54eb] outline-none"
                                  placeholder="请输入英文"
                                />
                              </div>
                              <div className="pt-2 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => setDrawerLangField(null)}
                                  className="text-[13px] font-bold text-[#2f54eb] hover:underline"
                                >
                                  完成
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] text-gray-900 font-medium">指标分类</label>
                      <div className="relative">
                        <select
                          value={indicatorClassification}
                          onChange={(e) => setIndicatorClassification(e.target.value)}
                          className="w-full h-11 border border-gray-200 rounded-lg px-4 pr-10 text-[14px] focus:border-[#2f54eb] focus:ring-1 focus:ring-blue-100 outline-none bg-white transition-all appearance-none"
                        >
                          {categories.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] text-gray-900 font-medium">指标类型</label>
                      <div className="relative">
                        <select
                          value={indicatorTypeInDrawer}
                          onChange={(e) => setIndicatorTypeInDrawer(e.target.value as '定量' | '定性')}
                          className="w-full h-11 border border-gray-200 rounded-lg px-4 pr-10 text-[14px] focus:border-[#2f54eb] focus:ring-1 focus:ring-blue-100 outline-none bg-white transition-all appearance-none"
                        >
                          <option value="定性">定性</option>
                          <option value="定量">定量</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[14px] text-gray-900 font-medium">
                        <span className="text-red-500 mr-1">*</span>指标定义/设置目的
                      </label>
                      <div className="relative">
                        <textarea
                          value={drawerLanguages.definition.zh}
                          onChange={(e) =>
                            setDrawerLanguages({
                              ...drawerLanguages,
                              definition: { ...drawerLanguages.definition, zh: e.target.value },
                            })
                          }
                          placeholder="请输入指标定义或设置目的"
                          rows={4}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-16 text-[14px] focus:border-[#2f54eb] focus:ring-1 focus:ring-blue-100 outline-none resize-none transition-all placeholder:text-gray-300"
                        />
                        <div
                          onClick={() => setDrawerLangField(drawerLangField === 'definition' ? null : 'definition')}
                          className="absolute right-3 top-4 px-3 py-1 bg-white border border-gray-200 rounded text-[13px] text-gray-500 font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          中文
                        </div>
                        <AnimatePresence>
                          {drawerLangField === 'definition' && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute right-0 top-[102%] z-50 bg-white rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] border border-gray-100 p-5 w-[320px] space-y-4"
                            >
                              <div className="space-y-2">
                                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">中文</label>
                                <textarea
                                  value={drawerLanguages.definition.zh}
                                  onChange={(e) =>
                                    setDrawerLanguages({
                                      ...drawerLanguages,
                                      definition: { ...drawerLanguages.definition, zh: e.target.value },
                                    })
                                  }
                                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-[14px] focus:border-[#2f54eb] outline-none resize-none"
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">English</label>
                                <textarea
                                  value={drawerLanguages.definition.en}
                                  onChange={(e) =>
                                    setDrawerLanguages({
                                      ...drawerLanguages,
                                      definition: { ...drawerLanguages.definition, en: e.target.value },
                                    })
                                  }
                                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-[14px] focus:border-[#2f54eb] outline-none resize-none"
                                  rows={3}
                                />
                              </div>
                              <div className="pt-2 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => setDrawerLangField(null)}
                                  className="text-[13px] font-bold text-[#2f54eb] hover:underline"
                                >
                                  完成
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[14px] text-gray-900 font-medium">
                        <span className="text-red-500 mr-1">*</span>计算公式
                      </label>
                      <div className="relative">
                        <textarea
                          value={drawerLanguages.formula.zh}
                          onChange={(e) =>
                            setDrawerLanguages({
                              ...drawerLanguages,
                              formula: { ...drawerLanguages.formula, zh: e.target.value },
                            })
                          }
                          placeholder="请输入计算公式"
                          rows={4}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] focus:border-[#2f54eb] focus:ring-1 focus:ring-blue-100 outline-none resize-none transition-all placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[14px] text-gray-900 font-medium">
                        <span className="text-red-500 mr-1">*</span>数据来源部门
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={drawerLanguages.dataSourceDept?.zh ?? ''}
                          onChange={(e) =>
                            setDrawerLanguages({
                              ...drawerLanguages,
                              dataSourceDept: {
                                zh: e.target.value,
                                en: drawerLanguages.dataSourceDept?.en ?? '',
                              },
                            })
                          }
                          placeholder="请输入数据来源部门"
                          className="w-full h-11 border border-gray-200 rounded-lg px-4 pr-16 text-[14px] focus:border-[#2f54eb] focus:ring-1 focus:ring-blue-100 outline-none placeholder:text-gray-300"
                        />
                        <div
                          onClick={() =>
                            setDrawerLangField(drawerLangField === 'dataSourceDept' ? null : 'dataSourceDept')
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-white border border-gray-200 rounded text-[13px] text-gray-500 font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          中文
                        </div>
                        <AnimatePresence>
                          {drawerLangField === 'dataSourceDept' && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute right-0 top-[110%] z-50 bg-white rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] border border-gray-100 p-5 w-[320px] space-y-4"
                            >
                              <div className="space-y-2">
                                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">中文</label>
                                <input
                                  type="text"
                                  value={drawerLanguages.dataSourceDept?.zh ?? ''}
                                  onChange={(e) =>
                                    setDrawerLanguages({
                                      ...drawerLanguages,
                                      dataSourceDept: {
                                        zh: e.target.value,
                                        en: drawerLanguages.dataSourceDept?.en ?? '',
                                      },
                                    })
                                  }
                                  className="w-full h-10 border border-gray-200 rounded-lg px-4 text-[14px] focus:border-[#2f54eb] outline-none"
                                  placeholder="请输入中文"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">English</label>
                                <input
                                  type="text"
                                  value={drawerLanguages.dataSourceDept?.en ?? ''}
                                  onChange={(e) =>
                                    setDrawerLanguages({
                                      ...drawerLanguages,
                                      dataSourceDept: {
                                        zh: drawerLanguages.dataSourceDept?.zh ?? '',
                                        en: e.target.value,
                                      },
                                    })
                                  }
                                  className="w-full h-10 border border-gray-200 rounded-lg px-4 text-[14px] focus:border-[#2f54eb] outline-none"
                                  placeholder="Please enter in English"
                                />
                              </div>
                              <div className="pt-2 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => setDrawerLangField(null)}
                                  className="text-[13px] font-bold text-[#2f54eb] hover:underline"
                                >
                                  完成
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Part 2: 适用范围 / 配置指引 */}
                <section>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1.5 h-6 bg-[#2f54eb] rounded-full" />
                    <h3 className="text-[18px] font-bold text-gray-900">指标适用范围/配置指引</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      <div className="space-y-2 min-w-0">
                        <div className="text-[13px] font-medium text-gray-800">
                          <span className="text-red-500 mr-1">*</span>适用组织类型
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-gray-600">
                          {SCOPE_ORG_TYPE_OPTS.map((opt) => (
                            <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-[#2f54eb] focus:ring-[#2f54eb]"
                                checked={scopeOrgTypes.includes(opt)}
                                onChange={() => toggleStrInList(scopeOrgTypes, setScopeOrgTypes, opt)}
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2 min-w-0 md:col-span-2 xl:col-span-2">
                        <div className="text-[13px] font-medium text-gray-800">
                          <span className="text-red-500 mr-1">*</span>适用组织
                        </div>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setScopeOrgsDropdownOpen((o) => !o)}
                            className={`w-full flex items-center justify-between gap-2 min-h-[38px] px-3 py-2 border rounded-lg text-left text-[13px] transition-colors bg-white ${
                              scopeOrgsDropdownOpen
                                ? 'border-[#2f54eb] ring-1 ring-[#2f54eb]/20'
                                : 'border-gray-200 hover:border-gray-300'
                            } ${scopeOrgs.length ? 'text-gray-900' : 'text-gray-400'}`}
                          >
                            <span className="truncate flex-1 min-w-0">
                              {scopeOrgs.length === 0
                                ? '请选择适用组织'
                                : scopeOrgs.length > 2
                                  ? `${scopeOrgs.slice(0, 2).join('、')} 等 ${scopeOrgs.length} 项`
                                  : scopeOrgs.join('、')}
                            </span>
                            <ChevronDown
                              size={16}
                              className={`shrink-0 text-gray-400 transition-transform ${scopeOrgsDropdownOpen ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {scopeOrgsDropdownOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-[102]"
                                aria-hidden
                                onClick={() => {
                                  setScopeOrgsDropdownOpen(false);
                                  setScopeOrgsSearch('');
                                }}
                              />
                              <div className="absolute left-0 right-0 top-full mt-1 z-[103] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[min(320px,50vh)]">
                                <div className="p-2 border-b border-gray-100 shrink-0">
                                  <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                      type="text"
                                      value={scopeOrgsSearch}
                                      onChange={(e) => setScopeOrgsSearch(e.target.value)}
                                      placeholder="搜索组织或部门"
                                      className="w-full h-9 pl-8 pr-3 border border-gray-200 rounded-md text-[13px] outline-none focus:border-[#2f54eb]"
                                      autoFocus
                                    />
                                  </div>
                                </div>
                                <div className="overflow-y-auto flex-1 p-2 space-y-0.5 min-h-0">
                                  {filteredScopeOrgSelectOpts.length === 0 ? (
                                    <div className="py-6 text-center text-[13px] text-gray-400">无匹配项</div>
                                  ) : (
                                    filteredScopeOrgSelectOpts.map((opt) => (
                                      <label
                                        key={opt}
                                        className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-50 cursor-pointer select-none text-[13px] text-gray-700"
                                      >
                                        <input
                                          type="checkbox"
                                          className="rounded border-gray-300 text-[#2f54eb] focus:ring-[#2f54eb] shrink-0"
                                          checked={scopeOrgs.includes(opt)}
                                          onChange={() => toggleStrInList(scopeOrgs, setScopeOrgs, opt)}
                                        />
                                        <span className="truncate">{opt}</span>
                                      </label>
                                    ))
                                  )}
                                </div>
                                <div className="flex justify-end gap-2 p-2 border-t border-gray-100 shrink-0 bg-gray-50/80">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setScopeOrgs([]);
                                    }}
                                    className="px-3 py-1.5 text-[12px] text-gray-600 hover:bg-white rounded border border-gray-200"
                                  >
                                    清空
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setScopeOrgsDropdownOpen(false);
                                      setScopeOrgsSearch('');
                                    }}
                                    className="px-3 py-1.5 text-[12px] bg-[#2f54eb] text-white rounded hover:bg-[#1d39c4]"
                                  >
                                    完成
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 min-w-0 md:col-span-2 xl:col-span-1">
                        <div className="text-[13px] font-medium text-gray-800">
                          <span className="text-red-500 mr-1">*</span>适用组织阶段
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-gray-600">
                          {SCOPE_STAGE_OPTS.map((opt) => (
                            <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-[#2f54eb] focus:ring-[#2f54eb]"
                                checked={scopeStages.includes(opt)}
                                onChange={() => toggleStrInList(scopeStages, setScopeStages, opt)}
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2 min-w-0 md:col-span-2 xl:col-span-2">
                        <div className="text-[13px] font-medium text-gray-800">
                          <span className="text-red-500 mr-1">*</span>指标可选性
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-gray-600">
                          {OPTIONALITY_OPTS.map((opt) => (
                            <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                              <input
                                type="radio"
                                name="indicator-scope-optionality"
                                className="border-gray-300 text-[#2f54eb] focus:ring-[#2f54eb]"
                                checked={scopeOptionality === opt}
                                onChange={() => setScopeOptionality(opt)}
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-gray-800">其他说明</label>
                      <textarea
                        value={scopeOtherNote}
                        onChange={(e) => setScopeOtherNote(e.target.value)}
                        rows={3}
                        placeholder="适用范围相关的补充说明"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-[#2f54eb] outline-none resize-none bg-white"
                      />
                    </div>
                  </div>
                </section>

                {/* Part 3: 指标标准外部调研 */}
                <section>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1.5 h-6 bg-[#2f54eb] rounded-full" />
                    <h3 className="text-[18px] font-bold text-gray-900">指标标准外部调研</h3>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <div className="text-[14px] font-semibold text-gray-900">指标标准外部调研</div>
                      <textarea
                        value={researchStandardText}
                        onChange={(e) => setResearchStandardText(e.target.value)}
                        rows={4}
                        placeholder="可填写对标说明、外部标准摘要、文档链接等"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] focus:border-[#2f54eb] outline-none resize-none"
                      />
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          ref={researchFileInputRef}
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            setResearchAttachmentName(f ? f.name : '');
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => researchFileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-[13px] hover:bg-gray-50 transition-colors"
                        >
                          <Upload size={14} />
                          上传附件
                        </button>
                        {researchAttachmentName ? (
                          <span className="text-[12px] text-gray-500 truncate max-w-[280px]" title={researchAttachmentName}>
                            已选：{researchAttachmentName}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Drawer Footer */}
              <div className="flex items-center gap-3 px-10 py-6 bg-white border-t border-gray-50">
                <button 
                  type="button"
                  onClick={() => {
                    const nameZh = drawerLanguages.name.zh.trim();
                    const defZh = drawerLanguages.definition.zh.trim();
                    const formulaZh = drawerLanguages.formula.zh.trim();
                    const deptZh = (drawerLanguages.dataSourceDept?.zh ?? '').trim();
                    const deptEn = (drawerLanguages.dataSourceDept?.en ?? '').trim();
                    if (!nameZh) {
                      window.alert('请填写指标名称');
                      return;
                    }
                    if (!defZh) {
                      window.alert('请填写指标定义/设置目的');
                      return;
                    }
                    if (!formulaZh) {
                      window.alert('请填写计算公式');
                      return;
                    }
                    if (!deptZh) {
                      window.alert('请填写数据来源部门');
                      return;
                    }
                    if (scopeOrgTypes.length === 0) {
                      window.alert('请选择适用组织类型');
                      return;
                    }
                    if (scopeOrgs.length === 0) {
                      window.alert('请选择适用组织');
                      return;
                    }
                    if (scopeStages.length === 0) {
                      window.alert('请选择适用组织阶段');
                      return;
                    }
                    if (!scopeOptionality.trim()) {
                      window.alert('请选择指标可选性');
                      return;
                    }
                    const base = {
                      name: nameZh,
                      library: indicatorClassification,
                      category: indicatorClassification,
                      classification: indicatorClassification,
                      type: indicatorTypeInDrawer,
                      formula: formulaZh,
                      definition: defZh,
                      remarks: selectedIndicator?.remarks ?? '',
                      dept: deptZh,
                      dataSourceDept: deptZh,
                      dataSourceDeptEn: deptEn,
                      scopeOrgTypes: [...scopeOrgTypes],
                      scopeOrgs: [...scopeOrgs],
                      scopeStages: [...scopeStages],
                      scopeOptionality,
                      scopeOtherNote,
                      researchOptionality: selectedIndicator ? [...selectedIndicator.researchOptionality] : [],
                      researchOtherNote: selectedIndicator ? selectedIndicator.researchOtherNote : '',
                      researchStandardText,
                      researchAttachmentName,
                      target0: drawerLanguages.target0.zh || '—',
                      target3: drawerLanguages.target3.zh || '—',
                      target5: drawerLanguages.target5.zh || '—',
                    };
                    if (selectedIndicator) {
                      setIndicators((prev) =>
                        prev.map((i) =>
                          i.id === selectedIndicator.id
                            ? { ...i, ...base, code: draftIndicatorCode }
                            : i
                        )
                      );
                    } else {
                      const id = `ind-${Date.now()}`;
                      setIndicators((prev) => [
                        ...prev,
                        {
                          id,
                          code: draftIndicatorCode,
                          ...base,
                        },
                      ]);
                    }
                    setScopeOrgsDropdownOpen(false);
                    setScopeOrgsSearch('');
                    setIsIndicatorModalOpen(false);
                  }}
                  className="px-8 py-2.5 bg-[#2f54eb] text-white rounded text-[14px] font-medium hover:bg-[#1d39c4] transition-all shadow-md shadow-blue-500/10 active:scale-95"
                >
                  确定
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setScopeOrgsDropdownOpen(false);
                    setScopeOrgsSearch('');
                    setIsIndicatorModalOpen(false);
                  }}
                  className="px-8 py-2.5 border border-gray-300 bg-white text-gray-700 rounded text-[14px] font-medium hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isCategoryDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-[420px] overflow-hidden"
            >
              <div className="p-8 pb-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                    <AlertCircle size={28} />
                  </div>
                  <h3 className="text-[18px] font-bold text-gray-900 tracking-tight">确认删除分类</h3>
                </div>
                <p className="text-gray-600 text-[15px] leading-relaxed pl-1">
                  确认删除分类【{categoryToDelete}】吗？删除后数据不可恢复。
                </p>
              </div>
              <div className="px-8 py-5 bg-gray-50/50 flex items-center justify-end gap-3 border-t border-gray-100">
                <button 
                  onClick={() => {
                    setIsCategoryDeleteConfirmOpen(false);
                    setCategoryToDelete(null);
                  }}
                  className="px-6 py-2 border border-gray-200 rounded-lg text-[14px] font-bold text-gray-600 bg-white hover:bg-gray-100 transition-all select-none"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    setCategories(prev => prev.filter(c => c.name !== categoryToDelete));
                    if (selectedCategory === categoryToDelete) {
                      setSelectedCategory('全部指标分类');
                    }
                    setIsCategoryDeleteConfirmOpen(false);
                    setCategoryToDelete(null);
                  }}
                  className="px-8 py-2 bg-red-500 text-white rounded-lg text-[14px] font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] select-none"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-[420px] overflow-hidden"
            >
              <div className="p-8 pb-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                    <AlertCircle size={28} />
                  </div>
                  <h3 className="text-[18px] font-bold text-gray-900 tracking-tight">
                    {deleteMode === 'single' ? '确认删除指标' : '确认批量删除'}
                  </h3>
                </div>
                <p className="text-gray-600 text-[15px] leading-relaxed pl-1">
                  {deleteMode === 'single' 
                    ? `确认删除指标【${selectedIndicator?.name}】吗？删除后不可恢复`
                    : '确认删除选中的指标吗？删除后不可恢复'}
                </p>
              </div>
              <div className="px-8 py-5 bg-gray-50/50 flex items-center justify-end gap-3 border-t border-gray-100">
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-6 py-2 border border-gray-200 rounded-lg text-[14px] font-bold text-gray-600 bg-white hover:bg-gray-100 transition-all select-none"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    if (deleteMode === 'single' && selectedIndicator) {
                      setIndicators(prev => prev.filter(i => i.id !== selectedIndicator.id));
                      setSelectedIndicatorIds(prev => prev.filter(id => id !== selectedIndicator.id));
                    } else {
                      setIndicators(prev => prev.filter(i => !selectedIndicatorIds.includes(i.id)));
                      setSelectedIndicatorIds([]);
                    }
                    setIsDeleteConfirmOpen(false);
                  }}
                  className="px-8 py-2 bg-red-500 text-white rounded-lg text-[14px] font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] select-none"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

const GradeSettingsPage = ({ 
  gradeRanges, 
  addRow, 
  deleteRow, 
  updateRow, 
  roundingRule, 
  setRoundingRule 
}: {
  gradeRanges: GradeRange[],
  addRow: () => void,
  deleteRow: (id: string) => void,
  updateRow: (id: string, field: keyof GradeRange, value: string) => void,
  roundingRule: string,
  setRoundingRule: (rule: string) => void
}) => (
  <div className="flex-1 overflow-y-auto p-6 bg-white">
    {/* Page Title & Actions */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-2 ml-auto">
        <button 
          onClick={addRow}
          className="flex items-center gap-1.5 bg-[#2f54eb] text-white px-4 py-1.5 rounded text-[13px] hover:bg-[#1d39c4] transition-colors"
        >
          <Plus size={16} />
          <span>新增</span>
        </button>
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded text-[13px] hover:bg-gray-50 transition-colors flex items-center gap-1.5">
          <Trash2 size={14} className="text-gray-400" />
          <span>删除</span>
        </button>
      </div>
    </div>

    {/* Table */}
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-[13px] text-gray-600 border-b border-gray-100">
            <th className="w-12 py-3 px-2">
              <input type="checkbox" className="rounded border-gray-300 text-[#2f54eb] focus:ring-[#2f54eb]" />
            </th>
            <th className="py-3 px-4 font-medium text-center">组织绩效等级</th>
            <th className="py-3 px-4 font-medium text-center">最小值 (X≥最小值)</th>
            <th className="py-3 px-4 font-medium text-center">最大值</th>
            <th className="w-20 py-3 px-4 font-medium text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {gradeRanges.map((row) => (
            <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td className="py-3 px-2">
                <input type="checkbox" className="rounded border-gray-300 text-[#2f54eb] focus:ring-[#2f54eb]" />
              </td>
              <td className="py-3 px-4">
                <div className="relative">
                  <select 
                    value={row.grade}
                    onChange={(e) => updateRow(row.id, 'grade', e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-1.5 text-[13px] appearance-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb] outline-none bg-white"
                  >
                    <option value="">请选择</option>
                    <option value="S">S</option>
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
              </td>
              <td className="py-3 px-4">
                <input 
                  type="text" 
                  value={row.min}
                  onChange={(e) => updateRow(row.id, 'min', e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-1.5 text-[13px] focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb] outline-none"
                />
              </td>
              <td className="py-3 px-4">
                <input 
                  type="text" 
                  value={row.max}
                  onChange={(e) => updateRow(row.id, 'max', e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-1.5 text-[13px] focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb] outline-none"
                />
              </td>
              <td className="py-3 px-4 text-center">
                <button 
                  onClick={() => deleteRow(row.id)}
                  className="text-[#2f54eb] text-[13px] hover:text-blue-800 transition-colors"
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Rounding Rules Section */}
    <div className="mt-12">
      <h3 className="text-[13px] font-bold text-gray-800 mb-4">绩效分数取整规则</h3>
      <div className="flex flex-row gap-8">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input 
              type="radio" 
              name="rounding" 
              checked={roundingRule === 'round'}
              onChange={() => setRoundingRule('round')}
              className="appearance-none w-4 h-4 border border-gray-300 rounded-full checked:border-[#2f54eb] transition-all"
            />
            {roundingRule === 'round' && <div className="absolute w-2 h-2 bg-[#2f54eb] rounded-full" />}
          </div>
          <span className="text-[13px] text-gray-700">
            四舍五入保留2位小数 <span className="text-gray-400 ml-1">(例: 3.745 ≈ 3.75)</span>
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input 
              type="radio" 
              name="rounding" 
              checked={roundingRule === 'up'}
              onChange={() => setRoundingRule('up')}
              className="appearance-none w-4 h-4 border border-gray-300 rounded-full checked:border-[#2f54eb] transition-all"
            />
            {roundingRule === 'up' && <div className="absolute w-2 h-2 bg-[#2f54eb] rounded-full" />}
          </div>
          <span className="text-[13px] text-gray-700">
            向上取整保留2位小数 <span className="text-gray-400 ml-1">(例: 3.741 ≈ 3.75)</span>
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input 
              type="radio" 
              name="rounding" 
              checked={roundingRule === 'down'}
              onChange={() => setRoundingRule('down')}
              className="appearance-none w-4 h-4 border border-gray-300 rounded-full checked:border-[#2f54eb] transition-all"
            />
            {roundingRule === 'down' && <div className="absolute w-2 h-2 bg-[#2f54eb] rounded-full" />}
          </div>
          <span className="text-[13px] text-gray-700">
            向下取整保留2位小数 <span className="text-gray-400 ml-1">(例: 3.749 ≈ 3.74)</span>
          </span>
        </label>
      </div>
    </div>
  </div>
);

function pickStageDateOrDefault(value: unknown, fallback: string): string {
  const s = value != null && String(value).trim() !== '' ? String(value).trim() : '';
  return s || fallback;
}

function parseActivityUpdateTime(t: unknown): number {
  if (t == null || String(t).trim() === '') return 0;
  const s = String(t).trim().replace(' ', 'T');
  const n = new Date(s).getTime();
  return Number.isFinite(n) ? n : 0;
}

function formatActivityDateTime(d = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function isoDateToSlash(iso: string): string {
  return iso.trim().replace(/-/g, '/');
}

type ActivityDrawerSubmitPayload = {
  name: string;
  year: string;
  cycleStart: string;
  cycleEnd: string;
  planStageStart: string;
  planStageEnd: string;
  midStageStart: string;
  midStageEnd: string;
  appraisalStageStart: string;
  appraisalStageEnd: string;
};

const ActivityDrawer = ({ 
  isOpen, 
  onClose, 
  activity, 
  mode = 'add',
  deptConfigs = [],
  levelConfigs = [],
  notifyConfigs = [],
  processConfigs = [],
  onSubmit
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  activity?: any; 
  mode?: 'add' | 'edit' | 'copy';
  deptConfigs?: any[];
  levelConfigs?: any[];
  notifyConfigs?: any[];
  processConfigs?: any[];
  onSubmit?: (payload: ActivityDrawerSubmitPayload) => void;
}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [searchTerms, setSearchTerms] = useState({
    dept: '',
    level: '',
    notify: '',
    process: ''
  });

  const isEdit = mode === 'edit';
  const isCopy = mode === 'copy';
  const title = isEdit ? '编辑绩效活动' : isCopy ? '复制绩效活动' : '新建绩效活动';

  const calendarYear = new Date().getFullYear();
  const [assessmentYear, setAssessmentYear] = useState(String(calendarYear));
  const [cycleStart, setCycleStart] = useState(`${calendarYear}-01-01`);
  const [cycleEnd, setCycleEnd] = useState(`${calendarYear}-12-31`);
  const [planStageStart, setPlanStageStart] = useState('');
  const [planStageEnd, setPlanStageEnd] = useState('');
  const [midStageStart, setMidStageStart] = useState('');
  const [midStageEnd, setMidStageEnd] = useState('');
  const [appraisalStageStart, setAppraisalStageStart] = useState('');
  const [appraisalStageEnd, setAppraisalStageEnd] = useState('');
  const [drawerSubmitError, setDrawerSubmitError] = useState<string | null>(null);
  const [activityName, setActivityName] = useState('');

  const applyDefaultStageWindows = (ys: string) => {
    setPlanStageStart(`${ys}-01-01`);
    setPlanStageEnd(`${ys}-01-31`);
    setMidStageStart(`${ys}-07-01`);
    setMidStageEnd(`${ys}-07-31`);
    setAppraisalStageStart(`${ys}-12-01`);
    setAppraisalStageEnd(`${ys}-12-31`);
  };

  const yearSelectOptions = useMemo(() => {
    const nums = Array.from({ length: 11 }, (_, i) => calendarYear - 5 + i);
    const y = parseInt(assessmentYear, 10);
    if (Number.isFinite(y) && !nums.includes(y)) nums.push(y);
    return [...new Set(nums)].sort((a, b) => a - b).map(String);
  }, [calendarYear, assessmentYear]);

  useEffect(() => {
    if (!isOpen) return;
    let y = calendarYear;
    if ((isEdit || isCopy) && activity?.year != null && String(activity.year).trim() !== '') {
      const s = String(activity.year).replace(/年/g, '').trim();
      const n = parseInt(s, 10);
      if (Number.isFinite(n)) y = n;
    }
    const ys = String(y);
    setAssessmentYear(ys);
    setCycleStart(`${ys}-01-01`);
    setCycleEnd(`${ys}-12-31`);
    if ((isEdit || isCopy) && activity) {
      setPlanStageStart(pickStageDateOrDefault(activity.planStageStart, `${ys}-01-01`));
      setPlanStageEnd(pickStageDateOrDefault(activity.planStageEnd, `${ys}-01-31`));
      setMidStageStart(pickStageDateOrDefault(activity.midStageStart, `${ys}-07-01`));
      setMidStageEnd(pickStageDateOrDefault(activity.midStageEnd, `${ys}-07-31`));
      setAppraisalStageStart(pickStageDateOrDefault(activity.appraisalStageStart, `${ys}-12-01`));
      setAppraisalStageEnd(pickStageDateOrDefault(activity.appraisalStageEnd, `${ys}-12-31`));
    } else {
      applyDefaultStageWindows(ys);
    }
    if (isEdit && activity?.name != null) {
      setActivityName(String(activity.name));
    } else if (isCopy && activity?.name != null) {
      setActivityName(`${String(activity.name)}_复制`);
    } else {
      setActivityName('');
    }
    setDrawerSubmitError(null);
  }, [isOpen, isEdit, isCopy, activity?.id, activity?.year, activity?.name, calendarYear]);

  const onAssessmentYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ys = e.target.value;
    setAssessmentYear(ys);
    setCycleStart(`${ys}-01-01`);
    setCycleEnd(`${ys}-12-31`);
    applyDefaultStageWindows(ys);
    setDrawerSubmitError(null);
  };

  const handleActivityDrawerSubmit = () => {
    setDrawerSubmitError(null);
    const name = activityName.trim();
    if (!name) {
      setDrawerSubmitError('请填写活动名称');
      return;
    }
    const cs = cycleStart.trim();
    const ce = cycleEnd.trim();
    if (!cs || !ce) {
      setDrawerSubmitError('请填写周期开始日期与周期结束日期');
      return;
    }
    if (cs > ce) {
      setDrawerSubmitError('周期开始日期不能晚于周期结束日期');
      return;
    }
    const stages: { name: string; s: string; e: string }[] = [
      { name: '组织绩效计划制定', s: planStageStart.trim(), e: planStageEnd.trim() },
      { name: '组织绩效中期回顾', s: midStageStart.trim(), e: midStageEnd.trim() },
      { name: '组织绩效考核', s: appraisalStageStart.trim(), e: appraisalStageEnd.trim() },
    ];
    for (const st of stages) {
      if (!st.s || !st.e) {
        setDrawerSubmitError(`请完整填写「${st.name}」的开始日期与结束日期`);
        return;
      }
      if (st.s > st.e) {
        setDrawerSubmitError(`「${st.name}」开始日期不能晚于结束日期`);
        return;
      }
      if (st.s < cs || st.e > ce) {
        setDrawerSubmitError(
          `「${st.name}」（${st.s} ~ ${st.e}）须完全落在周期范围内（${cs} ~ ${ce}），请调整该阶段或活动周期。`
        );
        return;
      }
    }
    if (mode === 'add' && onSubmit) {
      onSubmit({
        name,
        year: assessmentYear,
        cycleStart: cs,
        cycleEnd: ce,
        planStageStart: planStageStart.trim(),
        planStageEnd: planStageEnd.trim(),
        midStageStart: midStageStart.trim(),
        midStageEnd: midStageEnd.trim(),
        appraisalStageStart: appraisalStageStart.trim(),
        appraisalStageEnd: appraisalStageEnd.trim(),
      });
    }
    onClose();
  };

  // Filter enabled items
  const enabledDeptConfigs = deptConfigs.filter(c => c.status);
  const enabledLevelConfigs = levelConfigs.filter(c => c.status);
  const enabledNotifyConfigs = notifyConfigs.filter(c => c.status);
  const enabledProcessConfigs = processConfigs.filter(c => c.status);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px]"
          />
          
          {/* Drawer Wrapper */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-2xl bg-[#fcfcfc] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shrink-0">
              <h2 className="text-[16px] font-semibold text-gray-900">{title}</h2>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 pb-24">
              {/* Section: 基本信息 */}
              <div className="bg-white rounded-lg border border-gray-100 p-6 space-y-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-4 bg-[#2f54eb] rounded-full" />
                  <span className="text-[15px] font-semibold text-gray-900">基本信息</span>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-gray-500">活动编码</label>
                    <div className="text-[14px] text-gray-900 bg-gray-50 px-3 py-1.5 rounded">
                      {isEdit ? activity.id : isCopy ? 'AUTO-GENERATE' : 'NEW'}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] text-gray-500 font-medium">活动状态</label>
                    <div className="text-[14px] text-gray-700 bg-gray-50 px-3 py-1.5 rounded">
                      {isEdit ? activity.status : '草稿'}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] text-gray-600 font-medium flex items-center gap-1">
                      <span className="text-red-500">*</span>考核类型
                    </label>
                    <div className="relative">
                      <select
                        value="年度"
                        disabled
                        aria-readonly
                        className="w-full border border-gray-200 rounded px-3 py-2 text-[14px] outline-none appearance-none bg-gray-50 text-gray-700 cursor-not-allowed"
                      >
                        <option value="年度">年度</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] text-gray-600 font-medium flex items-center gap-1">
                      <span className="text-red-500">*</span>活动名称
                    </label>
                    <input
                      type="text"
                      value={activityName}
                      onChange={(e) => {
                        setActivityName(e.target.value);
                        setDrawerSubmitError(null);
                      }}
                      placeholder="请填写活动名称"
                      className="w-full border border-gray-200 rounded px-3 py-2 text-[14px] outline-none focus:border-[#2f54eb] focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] text-gray-600 font-medium flex items-center gap-1">
                      <span className="text-red-500">*</span>考核年度
                    </label>
                    <div className="relative">
                      <select
                        value={assessmentYear}
                        onChange={onAssessmentYearChange}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-[14px] outline-none appearance-none bg-white focus:border-[#2f54eb] transition-colors"
                      >
                        {yearSelectOptions.map((y) => (
                          <option key={y} value={y}>
                            {y}年
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] text-gray-600 font-medium flex items-center gap-1">
                      <span className="text-red-500">*</span>周期开始日期
                    </label>
                    <input
                      type="date"
                      value={cycleStart}
                      onChange={(e) => setCycleStart(e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-[14px] outline-none focus:border-[#2f54eb] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] text-gray-600 font-medium flex items-center gap-1">
                      <span className="text-red-500">*</span>周期结束日期
                    </label>
                    <input
                      type="date"
                      value={cycleEnd}
                      onChange={(e) => setCycleEnd(e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-[14px] outline-none focus:border-[#2f54eb] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Section: 阶段窗口期 */}
              <div className="bg-white rounded-lg border border-gray-100 p-6 space-y-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-[#2f54eb] rounded-full" />
                  <span className="text-[15px] font-semibold text-gray-900">阶段窗口期</span>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed -mt-2 mb-4">
                  以下三阶段的开始、结束日期须<strong className="font-medium text-gray-700">全部落在</strong>上方「周期开始日期」与「周期结束日期」范围内（含边界）；提交时将自动校验。
                </p>
                <div className="space-y-5">
                  {(
                    [
                      {
                        label: '组织绩效计划制定',
                        start: planStageStart,
                        end: planStageEnd,
                        setStart: setPlanStageStart,
                        setEnd: setPlanStageEnd,
                      },
                      {
                        label: '组织绩效中期回顾',
                        start: midStageStart,
                        end: midStageEnd,
                        setStart: setMidStageStart,
                        setEnd: setMidStageEnd,
                      },
                      {
                        label: '组织绩效考核',
                        start: appraisalStageStart,
                        end: appraisalStageEnd,
                        setStart: setAppraisalStageStart,
                        setEnd: setAppraisalStageEnd,
                      },
                    ] as const
                  ).map((row) => (
                    <div key={row.label} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <label className="text-[13px] text-gray-600 font-medium flex items-center gap-1 shrink-0 w-36">
                        <span className="text-red-500">*</span>
                        {row.label}
                      </label>
                      <div className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
                        <input
                          type="date"
                          value={row.start}
                          onChange={(e) => {
                            row.setStart(e.target.value);
                            setDrawerSubmitError(null);
                          }}
                          className="flex-1 min-w-[140px] border border-gray-200 rounded px-3 py-2 text-[14px] outline-none focus:border-[#2f54eb] transition-colors"
                        />
                        <span className="text-[13px] text-gray-400 shrink-0">至</span>
                        <input
                          type="date"
                          value={row.end}
                          onChange={(e) => {
                            row.setEnd(e.target.value);
                            setDrawerSubmitError(null);
                          }}
                          className="flex-1 min-w-[140px] border border-gray-200 rounded px-3 py-2 text-[14px] outline-none focus:border-[#2f54eb] transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: 考核规则 */}
              <div className="bg-white rounded-lg border border-gray-100 p-6 space-y-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-4 bg-[#2f54eb] rounded-full" />
                  <span className="text-[15px] font-semibold text-gray-900">考核规则</span>
                </div>

                <div className="space-y-6">
                  {/* 考核维度 */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-gray-600 font-medium flex items-center gap-1">
                      <span className="text-red-500">*</span>考核指标维度规则
                    </label>
                    <div className="relative group">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text"
                          placeholder="搜索并选择考核指标维度规则"
                          value={searchTerms.dept}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, dept: e.target.value }))}
                          className="w-full border border-gray-200 rounded pl-9 pr-10 py-2 text-[14px] outline-none focus:border-[#2f54eb] transition-all bg-white"
                        />
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:rotate-180 transition-transform" />
                      </div>
                      
                      <div
                        className="absolute left-0 right-0 top-[105%] bg-white border border-gray-100 rounded shadow-xl z-50 max-h-48 overflow-y-auto hidden group-focus-within:block border-t-0 -mt-1 py-1"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {enabledDeptConfigs
                          .filter(c => c.name.toLowerCase().includes(searchTerms.dept.toLowerCase()))
                          .map(config => (
                            <div
                              key={config.id}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => setSearchTerms((prev) => ({ ...prev, dept: config.name }))}
                              className="px-4 py-2.5 text-[13px] hover:bg-blue-50 cursor-pointer text-gray-700 hover:text-[#2f54eb] transition-colors flex items-center justify-between"
                            >
                              <span>{config.name}</span>
                              <span className="text-[11px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded italic">{config.deptType}</span>
                            </div>
                          ))}
                        {enabledDeptConfigs.filter(c => c.name.toLowerCase().includes(searchTerms.dept.toLowerCase())).length === 0 && (
                          <div className="px-4 py-8 text-center text-gray-400 text-[12px] italic">未查找到匹配的已启用配置</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 绩效流程规则 */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-gray-600 font-medium flex items-center gap-1">
                      <span className="text-red-500">*</span>绩效流程规则
                    </label>
                    <div className="relative group">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text"
                          placeholder="搜索并选择已启用的绩效流程规则"
                          value={searchTerms.process}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, process: e.target.value }))}
                          className="w-full border border-gray-200 rounded pl-9 pr-10 py-2 text-[14px] outline-none focus:border-[#2f54eb] transition-all bg-white"
                        />
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:rotate-180 transition-transform" />
                      </div>
                      
                      <div
                        className="absolute left-0 right-0 top-[105%] bg-white border border-gray-100 rounded shadow-xl z-50 max-h-48 overflow-y-auto hidden group-focus-within:block border-t-0 -mt-1 py-1"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {enabledProcessConfigs
                          .filter(c => c.name.toLowerCase().includes(searchTerms.process.toLowerCase()))
                          .map(config => (
                            <div
                              key={config.id}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => setSearchTerms((prev) => ({ ...prev, process: config.name }))}
                              className="px-4 py-2.5 text-[13px] hover:bg-blue-50 cursor-pointer text-gray-700 hover:text-[#2f54eb] transition-colors"
                            >
                              {config.name}
                            </div>
                          ))}
                        {enabledProcessConfigs.filter(c => c.name.toLowerCase().includes(searchTerms.process.toLowerCase())).length === 0 && (
                          <div className="px-4 py-8 text-center text-gray-400 text-[12px] italic">未查找到匹配的已启用规则</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 等级分数区间 */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-gray-600 font-medium flex items-center gap-1">
                      <span className="text-red-500">*</span>等级分数区间规则
                    </label>
                    <div className="relative group">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text"
                          placeholder="搜索并选择等级分数区间规则"
                          value={searchTerms.level}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, level: e.target.value }))}
                          className="w-full border border-gray-200 rounded pl-9 pr-10 py-2 text-[14px] outline-none focus:border-[#2f54eb] transition-all bg-white"
                        />
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:rotate-180 transition-transform" />
                      </div>
                      
                      <div
                        className="absolute left-0 right-0 top-[105%] bg-white border border-gray-100 rounded shadow-xl z-50 max-h-48 overflow-y-auto hidden group-focus-within:block border-t-0 -mt-1 py-1"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {enabledLevelConfigs
                          .filter(c => c.name.toLowerCase().includes(searchTerms.level.toLowerCase()))
                          .map(config => (
                            <div
                              key={config.id}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => setSearchTerms((prev) => ({ ...prev, level: config.name }))}
                              className="px-4 py-2.5 text-[13px] hover:bg-blue-50 cursor-pointer text-gray-700 hover:text-[#2f54eb] transition-colors"
                            >
                              {config.name}
                            </div>
                          ))}
                        {enabledLevelConfigs.filter(c => c.name.toLowerCase().includes(searchTerms.level.toLowerCase())).length === 0 && (
                          <div className="px-4 py-8 text-center text-gray-400 text-[12px] italic">未查找到匹配的已启用规则</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 通知规则 */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-gray-600 font-medium flex items-center gap-1">
                      <span className="text-red-500">*</span>通知规则
                    </label>
                    <div className="relative group">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text"
                          placeholder="搜索并选择通知规则"
                          value={searchTerms.notify}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, notify: e.target.value }))}
                          className="w-full border border-gray-200 rounded pl-9 pr-10 py-2 text-[14px] outline-none focus:border-[#2f54eb] transition-all bg-white"
                        />
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:rotate-180 transition-transform" />
                      </div>
                      
                      <div
                        className="absolute left-0 right-0 top-[105%] bg-white border border-gray-100 rounded shadow-xl z-50 max-h-48 overflow-y-auto hidden group-focus-within:block border-t-0 -mt-1 py-1"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {enabledNotifyConfigs
                          .filter(c => c.name.toLowerCase().includes(searchTerms.notify.toLowerCase()))
                          .map(config => (
                            <div
                              key={config.id}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => setSearchTerms((prev) => ({ ...prev, notify: config.name }))}
                              className="px-4 py-2.5 text-[13px] hover:bg-blue-50 cursor-pointer text-gray-700 hover:text-[#2f54eb] transition-colors"
                            >
                              {config.name}
                            </div>
                          ))}
                        {enabledNotifyConfigs.filter(c => c.name.toLowerCase().includes(searchTerms.notify.toLowerCase())).length === 0 && (
                          <div className="px-4 py-8 text-center text-gray-400 text-[12px] italic">未查找到匹配的已启用规则</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="px-8 py-4 bg-white border-t border-gray-100 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-20">
              {drawerSubmitError && (
                <div className="mb-3 text-[13px] text-red-600 leading-snug">{drawerSubmitError}</div>
              )}
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={handleActivityDrawerSubmit}
                  className="px-8 py-2 bg-[#2f54eb] text-white rounded text-[14px] font-medium hover:bg-[#1d39c4] transition-colors shadow-sm cursor-pointer"
                >
                  确定
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setDrawerSubmitError(null);
                    onClose();
                  }}
                  className="px-8 py-2 border border-gray-200 rounded text-[14px] text-gray-600 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  取消
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  content,
  confirmText = "确认删除",
  confirmColor = "bg-red-500 hover:bg-red-600"
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  content: string;
  confirmText?: string;
  confirmColor?: string;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden relative z-10"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 text-amber-500 mb-4">
                <AlertCircle size={24} />
                <h3 className="text-[16px] font-semibold text-gray-900">{title}</h3>
              </div>
              <p className="text-[14px] text-gray-600 leading-relaxed">{content}</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={onConfirm}
                className={`px-4 py-2 ${confirmColor} text-white rounded text-[13px] transition-colors shadow-sm cursor-pointer font-medium`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ColumnFilterDropdown = ({ 
  label, 
  options, 
  selectedValues, 
  onSelect, 
  onClear 
}: { 
  label: string; 
  options: string[]; 
  selectedValues: string[]; 
  onSelect: (value: string) => void; 
  onClear: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block ml-1">
      <Filter 
        size={12} 
        className={`cursor-pointer transition-colors ${selectedValues.length > 0 ? 'text-[#2f54eb]' : 'text-gray-400 hover:text-gray-600'}`} 
        onClick={() => setIsOpen(!isOpen)}
      />
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[10002]" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 min-w-[200px] bg-white border border-gray-100 rounded-lg shadow-xl z-[10003] py-2 animate-in fade-in zoom-in duration-100 origin-top-left">
            <div className="px-3 py-1 mb-1 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <span className="text-[12px] font-bold text-gray-400">筛选 {label}</span>
              {selectedValues.length > 0 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onClear(); }}
                  className="text-[11px] text-[#2f54eb] hover:underline"
                >
                  重置
                </button>
              )}
            </div>
            <div className="max-h-[240px] overflow-y-auto px-1 custom-scrollbar">
              {options.map(opt => (
                <div 
                  key={opt}
                  onClick={() => onSelect(opt)}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer rounded transition-colors group"
                >
                  <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center transition-all ${
                    selectedValues.includes(opt) ? 'bg-[#2f54eb] border-[#2f54eb]' : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {selectedValues.includes(opt) && <Check size={10} className="text-white" />}
                  </div>
                  <span className={`text-[13px] ${selectedValues.includes(opt) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                    {opt === '-' ? '空' : opt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface MonitoringTab {
  id: string;
  name: string;
  isDefault: boolean;
  startDate: string;
  endDate: string;
}

const MONITORING_PHASE_MID_TERM = '组织绩效中期回顾';
const MONITORING_PHASE_APPRAISAL = '组织绩效考核';

/** 根据已填写开始/结束时间的中期回顾轮次，返回整体最早开始与最晚结束；无有效轮次时为 null */
function computeMidTermBoundsFromTabs(tabs: { startDate?: string; endDate?: string }[]): { start: string; end: string } | null {
  const filled = tabs.filter((t) => (t.startDate || '').trim() && (t.endDate || '').trim());
  if (!filled.length) return null;
  const starts = filled.map((t) => (t.startDate || '').trim()).sort();
  const ends = filled.map((t) => (t.endDate || '').trim()).sort();
  return { start: starts[0], end: ends[ends.length - 1] };
}

function formatMidTermStepperDate(tabs: { startDate?: string; endDate?: string }[]): string {
  const b = computeMidTermBoundsFromTabs(tabs);
  if (!b) return '';
  return `${b.start.replace(/-/g, '/')} ~ ${b.end.replace(/-/g, '/')}`;
}

/** 两端闭区间是否交叉（日期均为 YYYY-MM-DD） */
function inclusiveDateRangesOverlap(s1: string, e1: string, s2: string, e2: string): boolean {
  if (!s1 || !e1 || !s2 || !e2) return false;
  return s1 <= e2 && s2 <= e1;
}

/** 中期回顾多轮：与 excludeTabId 以外且已填写起止日的轮次是否存在时间交叉 */
function findOverlappingMidTermRound(
  tabs: MonitoringTab[],
  excludeTabId: string | undefined,
  startDate: string,
  endDate: string
): MonitoringTab | null {
  const s = (startDate || '').trim();
  const e = (endDate || '').trim();
  if (!s || !e) return null;
  for (const t of tabs) {
    if (excludeTabId && t.id === excludeTabId) continue;
    const ts = (t.startDate || '').trim();
    const te = (t.endDate || '').trim();
    if (!ts || !te) continue;
    if (inclusiveDateRangesOverlap(s, e, ts, te)) return t;
  }
  return null;
}

/** 季度 · 组织考核各阶段默认窗口（ISO）。中期回顾「2026-01-31」按 7 月整月记为 2026-07-31；考核「2026-1-31」按跨年记为 2027-01-31。 */
const QUARTER_ORG_ASSESSMENT_STAGE_WINDOWS = {
  plan: { start: '2026-01-01', end: '2026-01-31' },
  midTerm: { start: '2026-07-01', end: '2026-07-31' },
  appraisal: { start: '2026-12-01', end: '2027-01-31' },
} as const;

/** 弹层标题右侧展示的整体周期（季度） */
const QUARTER_ORG_ASSESSMENT_HEADER_CYCLE = '2026/01/01 ~ 2027/01/31';

function isoStageWindowToStepperLabel(w: { start: string; end: string }): string {
  return `${w.start.replace(/-/g, '/')} ~ ${w.end.replace(/-/g, '/')}`;
}

function isoRangeWithinWindow(s: string, e: string, w: { start: string; end: string }): boolean {
  const ts = (s || '').trim();
  const te = (e || '').trim();
  if (!ts || !te || ts > te) return false;
  return ts >= w.start && te <= w.end;
}

function addDaysIso(iso: string, deltaDays: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const t = Date.UTC(y, m - 1, d) + deltaDays * 86400000;
  const x = new Date(t);
  return `${x.getUTCFullYear()}-${String(x.getUTCMonth() + 1).padStart(2, '0')}-${String(x.getUTCDate()).padStart(2, '0')}`;
}

/** 用于「中期回顾归档推送」与「组织主数据」比对的单行结构 */
interface OrgRosterDiffLine {
  code: string;
  path: string;
  level: string;
  orgType: string;
  leader: string;
  exec: string;
  hrbp: string;
  node: string;
  approver: string;
}

interface MidTermVsMasterDiff {
  /** 主数据有、中期归档未包含 — 可新增至本轮 */
  added: OrgRosterDiffLine[];
  /** 中期归档有、主数据已不存在 — 可从本轮移除 */
  removed: OrgRosterDiffLine[];
  /** 编码一致但主数据字段与归档不一致 — 可更新 */
  changed: { line: OrgRosterDiffLine; master: OrgRosterDiffLine; labels: string[] }[];
}

function orgPathDisplayName(path: string): string {
  const parts = path.split('/').filter(Boolean);
  return parts[parts.length - 1] || path;
}

function orgLineDiffLabels(mid: OrgRosterDiffLine, master: OrgRosterDiffLine): string[] {
  const pairs: [keyof OrgRosterDiffLine, string][] = [
    ['leader', '组织负责人'],
    ['exec', '分管执委/分管常委'],
    ['hrbp', '主HRBP'],
    ['orgType', '组织类型'],
    ['level', '组织层级'],
    ['node', '节点'],
    ['approver', '审批人'],
    ['path', '部门路径'],
  ];
  const out: string[] = [];
  for (const [key, label] of pairs) {
    if (mid[key] !== master[key]) {
      out.push(`${label}：${mid[key]} → ${master[key]}`);
    }
  }
  return out;
}

function computeMidTermVsMasterDiff(
  midTerm: OrgRosterDiffLine[],
  master: OrgRosterDiffLine[]
): MidTermVsMasterDiff {
  const midBy = new Map(midTerm.map((r) => [r.code, r]));
  const masterBy = new Map(master.map((r) => [r.code, r]));
  const added: OrgRosterDiffLine[] = [];
  const removed: OrgRosterDiffLine[] = [];
  const changed: MidTermVsMasterDiff['changed'] = [];
  for (const [code, m] of masterBy) {
    if (!midBy.has(code)) added.push(m);
    else {
      const labels = orgLineDiffLabels(midBy.get(code)!, m);
      if (labels.length) changed.push({ line: midBy.get(code)!, master: m, labels });
    }
  }
  for (const [code, m] of midBy) {
    if (!masterBy.has(code)) removed.push(m);
  }
  return { added, removed, changed };
}

/** 模拟：组织绩效中期回顾阶段已归档并推送的组织快照 */
const MOCK_MID_TERM_ARCHIVED_ORGS: OrgRosterDiffLine[] = [
  { code: 'D001', path: '集团总部/信息化中心', level: '一级部门', orgType: '能力中心', leader: '刘信息 (M1001)', exec: '赵执委 (E1001)', hrbp: '李HR (H1001)', node: '能力中心负责人', approver: '孙七 (50001)' },
  { code: 'D002', path: '集团总部/人力行政中心', level: '一级部门', orgType: '职能部门', leader: '张人力 (M1002)', exec: '赵执委 (E1001)', hrbp: '李HR (H1001)', node: '相关方', approver: '吴九 (20002)' },
  { code: 'D003', path: '集团总部/财务管理中心', level: '一级部门', orgType: '经营单元', leader: '陈效能 (M1003)', exec: '赵执委 (E1001)', hrbp: '王HR (H1002)', node: '-', approver: '-' },
  { code: 'D004', path: '集团总部/战略发展部', level: '一级部门', orgType: '职能部门', leader: '卫系统 (M1004)', exec: '赵执委 (E1001)', hrbp: '王HR (H1002)', node: '主BP', approver: '朱九 (20004)' },
  { code: 'D005', path: '集团总部/法务合规部', level: '一级部门', orgType: '能力中心', leader: '何法务 (M1005)', exec: '孙执委 (E1002)', hrbp: '张BP (H1003)', node: '分管执委', approver: '施五 (30005)' },
  { code: 'D006', path: '集团总部/品牌营销部', level: '一级部门', orgType: '职能部门', leader: '曹营销 (M1006)', exec: '孙执委 (E1002)', hrbp: '张BP (H1003)', node: '分管常委', approver: '金一 (40006)' },
  { code: 'D007', path: '集团总部/供应链管理中心', level: '一级部门', orgType: '经营单元', leader: '陶供应 (M1007)', exec: '孙执委 (E1002)', hrbp: '赵BP (H1004)', node: '能力中心负责人', approver: '邹七 (50007)' },
  { code: 'D008', path: '集团总部/审计监察部', level: '一级部门', orgType: '职能部门', leader: '喻审计 (M1008)', exec: '孙执委 (E1002)', hrbp: '赵BP (H1004)', node: '-', approver: '-' },
];

/** 模拟：组织主数据（权威） */
const MOCK_ORG_MASTER_ORGS: OrgRosterDiffLine[] = [
  { code: 'D001', path: '集团总部/信息化中心', level: '一级部门', orgType: '能力中心', leader: '刘信息 (M1001)', exec: '赵执委 (E1001)', hrbp: '李HR (H1001)', node: '能力中心负责人', approver: '孙七 (50001)' },
  { code: 'D002', path: '集团总部/人力行政中心', level: '一级部门', orgType: '职能部门', leader: '张研发 (M1002)', exec: '赵执委 (E1001)', hrbp: '李HR (H1001)', node: '相关方', approver: '吴九 (20002)' },
  { code: 'D003', path: '集团总部/财务管理中心', level: '一级部门', orgType: '经营单元', leader: '陈效能 (M1003)', exec: '赵执委 (E1001)', hrbp: '王HR (H1002)', node: '-', approver: '-' },
  { code: 'D004', path: '集团总部/战略发展部', level: '一级部门', orgType: '职能部门', leader: '卫系统 (M1004)', exec: '赵执委 (E1001)', hrbp: '王HR (H1002)', node: '主BP', approver: '朱九 (20004)' },
  { code: 'D005', path: '集团总部/法务合规部', level: '一级部门', orgType: '能力中心', leader: '何法务 (M1005)', exec: '孙执委 (E1002)', hrbp: '张BP (H1003)', node: '分管执委', approver: '施五 (30005)' },
  { code: 'D006', path: '集团总部/品牌营销部', level: '一级部门', orgType: '职能部门', leader: '曹营销 (M1006)', exec: '孙执委 (E1002)', hrbp: '张BP (H1003)', node: '分管常委', approver: '金一 (40006)' },
  { code: 'D007', path: '集团总部/供应链管理中心', level: '一级部门', orgType: '经营单元', leader: '陶供应 (M1007)', exec: '孙执委 (E1002)', hrbp: '赵BP (H1004)', node: '能力中心负责人', approver: '邹七 (50007)' },
  { code: 'D009', path: '集团总部/产品创新部', level: '一级部门', orgType: '能力中心', leader: '蒋产品 (M1009)', exec: '赵执委 (E1001)', hrbp: '李HR (H1001)', node: '能力中心负责人', approver: '-' },
];

const PRE_ASSESSMENT_ROSTER_DIFF = computeMidTermVsMasterDiff(MOCK_MID_TERM_ARCHIVED_ORGS, MOCK_ORG_MASTER_ORGS);

/** 中期回顾「更新轮次名单」与预考核对齐：上一阶段基线 vs 主数据（演示数据与预考核同源） */
const MID_TERM_ROSTER_UPDATE_DIFF = PRE_ASSESSMENT_ROSTER_DIFF;

/** 组织绩效考核 · 正式考核：与预考核对齐的演示比对数据（中期归档基线 vs 主数据） */
const FORMAL_ASSESSMENT_ROSTER_DIFF = PRE_ASSESSMENT_ROSTER_DIFF;

function applyOrgRosterDiffToAssessmentRows(
  prev: any[],
  diff: MidTermVsMasterDiff,
  applyAdd: boolean,
  applyRemove: boolean,
  applyChange: boolean
): any[] {
  let next = [...prev];
  const removeCodes =
    applyRemove && diff.removed.length > 0 ? new Set(diff.removed.map((r) => r.code)) : null;
  const addLines = applyAdd ? diff.added : [];
  const changeByCode = new Map(
    applyChange ? diff.changed.map((c) => [c.line.code, c.master] as const) : []
  );
  if (removeCodes) {
    next = next.filter((row) => !removeCodes.has(row.code));
  }
  const existingCodes = new Set(next.map((r) => r.code));
  for (const line of addLines) {
    if (!existingCodes.has(line.code)) {
      next.push(orgLineToAssessmentRow(line));
      existingCodes.add(line.code);
    }
  }
  next = next.map((row) => {
    const master = changeByCode.get(row.code);
    if (!master) return row;
    const merged = orgLineToAssessmentRow(master, row.status as '未开始' | '进行中' | '已完成');
    return {
      ...row,
      path: merged.path,
      level: merged.level,
      orgType: merged.orgType,
      leader: merged.leader,
      exec: merged.exec,
      hrbp: merged.hrbp,
      node: merged.node,
      approver: merged.approver,
    };
  });
  return next;
}

function orgLineToAssessmentRow(line: OrgRosterDiffLine, status: '未开始' | '进行中' | '已完成' = '未开始') {
  return {
    id: line.code,
    code: line.code,
    path: line.path,
    level: line.level,
    orgType: line.orgType,
    leader: line.leader,
    exec: line.exec,
    hrbp: line.hrbp,
    node: line.node,
    approver: line.approver,
    status,
    isTimeout: false,
  };
}

const APPRAISAL_GRADE_OPTIONS = ['S', 'A', 'B+', 'B', 'C'] as const;

type AppraisalRoundKey = 'pre' | 'formal';

type AppraisalGradeAdjustment = {
  adjustedGrade: string;
  adjustReason: string;
};

/** 组织绩效考核 · 按轮次演示用自动计算总分/等级（未开始无结果） */
function computeAppraisalAutoScoreGrade(item: { id: string; status: string }): { totalScore: number; calculatedGrade: string } | null {
  if (item.status === '未开始') return null;
  const seed = item.id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const totalScore = Number((3.15 + (seed % 165) / 100).toFixed(2));
  let calculatedGrade = 'B';
  if (totalScore >= 4.75) calculatedGrade = 'S';
  else if (totalScore >= 4.25) calculatedGrade = 'A';
  else if (totalScore >= 3.75) calculatedGrade = 'B+';
  else if (totalScore >= 3.0) calculatedGrade = 'B';
  else calculatedGrade = 'C';
  return { totalScore, calculatedGrade };
}

const OrgAssessmentModal = ({
  isOpen,
  onClose,
  activity,
  onFormalAssessmentArchived,
  onEditActivity,
  onDeleteActivity,
  onInitiatePlanChange,
  onActivityMonitoringSync,
  planChangeSubjectsByActivityId = {},
}: {
  isOpen: boolean;
  onClose: () => void;
  activity: any;
  /** 组织绩效考核 · 正式考核：在「归档并完成」校验通过并完成归档后回调（如将活动标为已完成并关弹层） */
  onFormalAssessmentArchived?: () => void;
  /** 草稿活动：顶部「编辑」打开活动抽屉编辑 */
  onEditActivity?: () => void;
  /** 草稿活动：顶部「删除」走活动删除确认 */
  onDeleteActivity?: () => void;
  /** 中期回顾：将所选考核对象写入「组织绩效计划变更监控」列表（同一对象可多次发起，仅「进行中」不可叠发） */
  onInitiatePlanChange?: (activityId: string, subjects: any[]) => void;
  /** 同步阶段进度与轮次配置至活动列表，供流程监控页展示多轮次 Tab */
  onActivityMonitoringSync?: (
    activityId: string,
    patch: {
      planStageArchivedToMidTerm?: boolean;
      midTermArchivedToAppraisal?: boolean;
      currentMidTermRoundId?: string;
      currentAppraisalRoundId?: string;
      phaseRoundTabs?: Record<string, MonitoringTab[]>;
    }
  ) => void;
  /** 各活动已发起的计划变更行（同一考核对象仅当存在「进行中」申请时不可再发起；上一申请为「已完成」后可再发起） */
  planChangeSubjectsByActivityId?: Record<string, any[]>;
}) => {
  if (!isOpen) return null;

  const syncMonitoringToActivity = (
    patch: Parameters<NonNullable<typeof onActivityMonitoringSync>>[1]
  ) => {
    if (!activity?.id || !onActivityMonitoringSync) return;
    onActivityMonitoringSync(activity.id, patch);
  };

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeletePreAssessmentOpen, setIsDeletePreAssessmentOpen] = useState(false);
  const [isSkipPreAssessmentConfirmOpen, setIsSkipPreAssessmentConfirmOpen] = useState(false);
  /** 预考核经「跳过」确认结束后，在预考核 Tab 下将「更新名单 / 启动组织绩效考核 / 归档并进入下一轮次」置灰 */
  const [preAssessmentPrimaryActionsLocked, setPreAssessmentPrimaryActionsLocked] = useState(false);
  /** null | 'pre' | 'mid' | 'formal' — 与组织主数据比对更新名单 */
  const [rosterUpdateModalKind, setRosterUpdateModalKind] = useState<null | 'pre' | 'mid' | 'formal'>(null);
  const [preRosterApplyAdd, setPreRosterApplyAdd] = useState(true);
  const [preRosterApplyRemove, setPreRosterApplyRemove] = useState(true);
  const [preRosterApplyChange, setPreRosterApplyChange] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'warning', durationMs = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), durationMs);
  };

  /** 与标题展示一致：未传状态时视为「进行中」，顶部活动级编辑/删除关闭 */
  const isActivityInProgress = (activity?.status ?? '进行中') === '进行中';
  /** 已完成活动：详情页头部仅保留「返回」，步骤条可在各阶段间自由切换查看 */
  const isActivityCompleted = activity?.status === '已完成';

  const handleDeleteConfirm = () => {
    setAssessmentData(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setIsDeleteConfirmOpen(false);
    showToast('删除成功', 'success');
  };

  const handleDeletePreAssessmentConfirm = () => {
    setMonitoringTabs2(prev => prev.filter(t => t.id !== 'pre'));
    setActiveMonitoringTab2('formal');
    setPreAssessmentPrimaryActionsLocked(false);
    setIsDeletePreAssessmentOpen(false);
    showToast('已移除组织绩效预考核（本阶段为可选，可随时再次添加）', 'success');
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState(0);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
  /** 已在计划制定阶段「归档并进入下一步」，才允许从步骤条进入组织绩效中期回顾 */
  const [planStageArchivedToMidTerm, setPlanStageArchivedToMidTerm] = useState(false);
  /** 已在中期回顾「归档并进入下一步」后，才允许从步骤条进入组织绩效考核 */
  const [midTermArchivedToAppraisal, setMidTermArchivedToAppraisal] = useState(false);
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [isApprovalChainModalOpen, setIsApprovalChainModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [reviewFrequency, setReviewFrequency] = useState('季度');
  const [reviewStages, setReviewStages] = useState([{ name: '第一轮回顾' }, { name: '第二轮回顾' }]);
  
  const [tempFrequency, setTempFrequency] = useState('季度');
  const [tempStages, setTempStages] = useState([{ name: '第一轮回顾' }, { name: '第二轮回顾' }]);
  const [activeTab, setActiveTab] = useState('考核对象');

  const [monitoringTabs1, setMonitoringTabs1] = useState<MonitoringTab[]>([
    { id: '1', name: '第一轮回顾', isDefault: true, startDate: '', endDate: '' },
    { id: '2', name: '第二轮回顾', isDefault: false, startDate: '', endDate: '' },
  ]);
  const [monitoringTabs2, setMonitoringTabs2] = useState<MonitoringTab[]>([
    { id: 'pre', name: '组织绩效预考核', isDefault: true, startDate: '', endDate: '' },
    { id: 'formal', name: '组织绩效正式考核', isDefault: true, startDate: '', endDate: '' }
  ]);

  useEffect(() => {
    if (!activity?.id) return;
    setPlanStageArchivedToMidTerm(Boolean(activity.planStageArchivedToMidTerm));
    setMidTermArchivedToAppraisal(Boolean(activity.midTermArchivedToAppraisal));
    const midTabs = activity?.config?.phaseRoundTabs?.[MONITORING_PHASE_MID_TERM];
    if (Array.isArray(midTabs) && midTabs.length > 0) {
      setMonitoringTabs1(
        midTabs.map((t: any) => ({
          id: String(t.id),
          name: t.name,
          isDefault: Boolean(t.isDefault),
          startDate: t.startDate || '',
          endDate: t.endDate || '',
        }))
      );
      const activeMid = activity.currentMidTermRoundId;
      if (activeMid) setActiveMonitoringTab1(String(activeMid));
    }
    const appraisalTabs = activity?.config?.phaseRoundTabs?.[MONITORING_PHASE_APPRAISAL];
    if (Array.isArray(appraisalTabs) && appraisalTabs.length > 0) {
      setMonitoringTabs2(
        appraisalTabs.map((t: any) => ({
          id: String(t.id),
          name: t.name,
          isDefault: Boolean(t.isDefault),
          startDate: t.startDate || '',
          endDate: t.endDate || '',
        }))
      );
      const activeAppraisal = activity.currentAppraisalRoundId;
      if (activeAppraisal) setActiveMonitoringTab2(String(activeAppraisal));
    }
    if (activity.midTermArchivedToAppraisal) {
      setCurrentStep(2);
    } else if (activity.planStageArchivedToMidTerm) {
      setCurrentStep(1);
    }
  }, [activity?.id]);

  const [activeMonitoringTab1, setActiveMonitoringTab1] = useState('1');
  const [activeMonitoringTab2, setActiveMonitoringTab2] = useState('pre');

  const lastMidTermRoundId = monitoringTabs1.at(-1)?.id ?? '';
  const isLastMidTermRoundTab = currentStep === 1 && activeMonitoringTab1 === lastMidTermRoundId;
  /** 「更多」菜单：仅多轮且非最后一轮时显示「归档并进入下一轮次」；中期回顾不再展示「跳过此阶段」（含单轮） */
  const showMidTermArchiveNextRoundInMore =
    currentStep === 1 && monitoringTabs1.length > 1 && activeMonitoringTab1 !== lastMidTermRoundId;

  const monitoringTabs = currentStep === 2 ? monitoringTabs2 : monitoringTabs1;
  const setMonitoringTabs = currentStep === 2 ? setMonitoringTabs2 : setMonitoringTabs1;
  const activeMonitoringTab = currentStep === 2 ? activeMonitoringTab2 : activeMonitoringTab1;
  const setActiveMonitoringTab = currentStep === 2 ? setActiveMonitoringTab2 : setActiveMonitoringTab1;
  const isPreAssessmentPrimaryActionsLocked =
    currentStep === 2 && activeMonitoringTab === 'pre' && preAssessmentPrimaryActionsLocked;
  const [isPlanStarted, setIsPlanStarted] = useState(false);
  const [isSubjectsGenerated, setIsSubjectsGenerated] = useState(false);
  const [isRoundModalOpen, setIsRoundModalOpen] = useState(false);
  const [roundModalData, setRoundModalData] = useState<Partial<MonitoringTab>>({});
  const [roundModalMode, setRoundModalMode] = useState<'add' | 'edit'>('add');

  const steps = useMemo(() => {
    const midDateFromTabs = formatMidTermStepperDate(monitoringTabs1);
    const midFallback = isoStageWindowToStepperLabel(QUARTER_ORG_ASSESSMENT_STAGE_WINDOWS.midTerm);
    const midDate = midDateFromTabs || midFallback;
    /** 季度与年度均为三阶段：组织绩效计划制定、组织绩效中期回顾、组织绩效考核（年度不再单独展示「绩效预考核」步骤；预考核仍为组织绩效考核内的可选轮次 Tab） */
    return [
      { title: '组织绩效计划制定', date: isoStageWindowToStepperLabel(QUARTER_ORG_ASSESSMENT_STAGE_WINDOWS.plan) },
      { title: '组织绩效中期回顾', date: midDate },
      { title: '组织绩效考核', date: isoStageWindowToStepperLabel(QUARTER_ORG_ASSESSMENT_STAGE_WINDOWS.appraisal) }
    ];
  }, [monitoringTabs1]);

  const midTermBounds = useMemo(() => computeMidTermBoundsFromTabs(monitoringTabs1), [monitoringTabs1]);

  /** 当前为「组织绩效考核」大阶段（含预考核 / 正式考核各轮次） */
  const isOrgAppraisalStage = steps[currentStep]?.title === '组织绩效考核';

  /** 步骤条：未满足前置归档时不可进入后续阶段（hover 见 title） */
  const getStepNavigationBlockTitle = (stepIndex: number): string | undefined => {
    if (isActivityCompleted) return undefined;
    if (stepIndex <= 0) return undefined;
    if (stepIndex === 1 && !planStageArchivedToMidTerm) {
      return '请先在「组织绩效计划制定」阶段勾选已完成的数据，并点击「归档并进入下一步」后，方可进入「组织绩效中期回顾」。';
    }
    if (stepIndex >= 2 && !midTermArchivedToAppraisal) {
      return '请先在「组织绩效中期回顾」最后一轮勾选已完成的数据，并点击「归档并进入下一步」后，方可进入「组织绩效考核」。';
    }
    return undefined;
  };

  const handleStepNavigationClick = (stepIndex: number) => {
    const tip = getStepNavigationBlockTitle(stepIndex);
    if (tip) {
      showToast(tip, 'warning');
      return;
    }
    setCurrentStep(stepIndex);
  };

  const addPreAssessmentRound = () => {
    const formal = monitoringTabs2.find(t => t.id === 'formal');
    const isQuarter = activity?.type !== '年度';
    const b = isQuarter ? QUARTER_ORG_ASSESSMENT_STAGE_WINDOWS.appraisal : midTermBounds;
    const rangeLabel = isQuarter ? '组织绩效考核阶段' : '组织绩效中期回顾';
    if (!b) {
      showToast(isQuarter ? '无法获取组织绩效考核阶段窗口' : '无法解析组织绩效中期回顾时间', 'error');
      return;
    }
    let startDate = b.start;
    let endDate = b.start;
    if (formal?.startDate) {
      const preEnd = addDaysIso(formal.startDate, -1);
      if (preEnd < b.start) {
        showToast(`${rangeLabel}时间内无法容纳预考核，请将正式考核开始时间后移后再添加`, 'warning');
        return;
      }
      let preStart = addDaysIso(preEnd, -2);
      if (preStart < b.start) preStart = b.start;
      if (preEnd > b.end) {
        showToast(`预考核须落在${rangeLabel}时间内，请先调整正式考核时间`, 'warning');
        return;
      }
      if (preStart > preEnd) {
        showToast(`${rangeLabel}时间内无法容纳预考核，请先缩短或后移正式考核时间`, 'warning');
        return;
      }
      startDate = preStart;
      endDate = preEnd;
    } else {
      endDate = addDaysIso(b.start, 2);
      if (endDate > b.end) endDate = b.end;
    }
    if (formal?.startDate && formal?.endDate && inclusiveDateRangesOverlap(startDate, endDate, formal.startDate, formal.endDate)) {
      showToast('与正式考核时间交叉，请调整后再添加', 'error');
      return;
    }
    setMonitoringTabs2(prev => {
      const rest = prev.filter(t => t.id !== 'pre');
      return [{ id: 'pre', name: '组织绩效预考核', isDefault: true, startDate, endDate }, ...rest];
    });
    setActiveMonitoringTab2('pre');
    setPreAssessmentPrimaryActionsLocked(false);
    showToast('已添加组织绩效预考核', 'success');
  };

  const handleOpenAddModal = () => {
    const roundNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    const roundNameIndex = monitoringTabs.length;
    const roundChar = roundNames[roundNameIndex] || (roundNameIndex + 1).toString();
    const defaultSuffix = currentStep === 2 ? '考核' : '回顾';
    setRoundModalData({
      name: `第${roundChar}轮${defaultSuffix}`,
      startDate: currentStep === 2 ? new Date().toISOString().split('T')[0] : '',
      endDate: currentStep === 2 ? new Date().toISOString().split('T')[0] : ''
    });
    setRoundModalMode('add');
    setIsRoundModalOpen(true);
  };

  const handleOpenEditModal = (tab: MonitoringTab, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    // Ensure the name in modal matches what's displayed or expected for the current stage
    let displayName = tab.name;
    if (currentStep === 2) {
      displayName = displayName.replace('回顾', '考核');
    } else if (currentStep === 1) {
      displayName = displayName.replace('考核', '回顾');
    }

    setRoundModalData({
      ...tab,
      name: displayName
    });
    setRoundModalMode('edit');
    setIsRoundModalOpen(true);
  };

  const validateOrgAssessmentRoundDates = (tabId: string | undefined, startDate: string, endDate: string): boolean => {
    if (currentStep !== 2 || !tabId) return true;
    const s = startDate || '';
    const e = endDate || '';
    if (!s || !e) {
      showToast('请填写轮次开始时间与结束时间', 'error');
      return false;
    }
    if (s > e) {
      showToast('开始时间不能晚于结束时间', 'error');
      return false;
    }
    if (activity?.type !== '年度') {
      const aw = QUARTER_ORG_ASSESSMENT_STAGE_WINDOWS.appraisal;
      if (s < aw.start || e > aw.end) {
        showToast(`轮次时间须在组织绩效考核阶段窗口内（${isoStageWindowToStepperLabel(aw)}）`, 'error');
        return false;
      }
    } else {
      const bounds = midTermBounds;
      if (bounds) {
        if (s < bounds.start || e > bounds.end) {
          showToast(`轮次时间须在组织绩效中期回顾范围内（${bounds.start} ~ ${bounds.end}）`, 'error');
          return false;
        }
      }
    }
    const other = monitoringTabs.find(t => t.id !== tabId && t.startDate && t.endDate);
    if (other && inclusiveDateRangesOverlap(s, e, other.startDate, other.endDate)) {
      showToast('组织绩效预考核与正式考核的时间段不能交叉', 'error');
      return false;
    }
    return true;
  };

  /** 组织绩效中期回顾：保存轮次弹窗时校验起止日与多轮不交叉 */
  const validateMidTermRoundModal = (tabId: string | undefined, startDate: string, endDate: string): boolean => {
    if (currentStep !== 1) return true;
    const s = startDate || '';
    const e = endDate || '';
    if (!s.trim() || !e.trim()) {
      showToast('请填写当前回顾轮次的开始时间与结束时间', 'error');
      return false;
    }
    if (s > e) {
      showToast('开始时间不能晚于结束时间', 'error');
      return false;
    }
    const overlap = findOverlappingMidTermRound(monitoringTabs1, tabId, s, e);
    if (overlap) {
      showToast(`当前轮次时间与「${overlap.name}」存在交叉，请调整。多轮回顾的起止时间不得重叠。`, 'error');
      return false;
    }
    if (activity?.type !== '年度') {
      const mw = QUARTER_ORG_ASSESSMENT_STAGE_WINDOWS.midTerm;
      if (!isoRangeWithinWindow(s, e, mw)) {
        showToast(
          `当前轮次时间须在组织绩效中期回顾阶段窗口内（${isoStageWindowToStepperLabel(mw)}），且不能超出该整体窗口。`,
          'error',
          6500
        );
        return false;
      }
    }
    return true;
  };

  const handleDeleteTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = monitoringTabs.filter(t => t.id !== id);
    if (newTabs.length === 0) return; // Prevent deleting all tabs
    
    setMonitoringTabs(newTabs);
    setSelectedIds([]); // Clear selections when a tab is deleted to avoid sync issues
    
    if (activeMonitoringTab === id) {
      // Find the nearest tab to switch to
      const deletedIndex = monitoringTabs.findIndex(t => t.id === id);
      const nextTab = newTabs[deletedIndex] || newTabs[deletedIndex - 1] || newTabs[0];
      setActiveMonitoringTab(nextTab.id);
    }
  };

  const handleMonitoringTabClick = (id: string) => {
    if (activeMonitoringTab === id) return;
    setActiveMonitoringTab(id);
    setSelectedIds([]); // Clear selections when switching tabs
  };

  const handleSaveRound = () => {
    if (!roundModalData.name) return;

    const s = roundModalData.startDate || '';
    const e = roundModalData.endDate || '';
    if (currentStep === 1) {
      if (!validateMidTermRoundModal(roundModalMode === 'edit' ? roundModalData.id : undefined, s, e)) return;
    } else if (!validateOrgAssessmentRoundDates(roundModalData.id, s, e)) {
      return;
    }

    if (roundModalMode === 'add') {
      const newId = Date.now().toString();
      const nextTabs: MonitoringTab[] = [
        ...monitoringTabs,
        {
          id: newId,
          name: roundModalData.name,
          startDate: roundModalData.startDate || '',
          endDate: roundModalData.endDate || '',
          isDefault: false,
        },
      ];
      setMonitoringTabs(nextTabs);
      setActiveMonitoringTab(newId);
      if (currentStep === 1) {
        syncMonitoringToActivity({
          phaseRoundTabs: { [MONITORING_PHASE_MID_TERM]: nextTabs },
          currentMidTermRoundId: newId,
        });
      } else if (currentStep === 2) {
        syncMonitoringToActivity({
          phaseRoundTabs: { [MONITORING_PHASE_APPRAISAL]: nextTabs },
          currentAppraisalRoundId: newId,
        });
      }
    } else {
      const nextTabs = monitoringTabs.map((t) =>
        t.id === roundModalData.id ? { ...t, ...roundModalData } : t
      );
      setMonitoringTabs(nextTabs);
      if (currentStep === 1) {
        syncMonitoringToActivity({ phaseRoundTabs: { [MONITORING_PHASE_MID_TERM]: nextTabs } });
      } else if (currentStep === 2) {
        syncMonitoringToActivity({ phaseRoundTabs: { [MONITORING_PHASE_APPRAISAL]: nextTabs } });
      }
    }
    setIsRoundModalOpen(false);
  };

  const [assessmentData, setAssessmentData] = useState([
    {
      id: 'D001',
      code: 'D001',
      path: '集团总部/信息化中心',
      level: '一级部门',
      orgType: '能力中心',
      leader: '刘信息 (M1001)',
      exec: '赵执委 (E1001)',
      hrbp: '李HR (H1001)',
      node: '数据提供人',
      approver: '王五(003)、李红(004)',
      status: '进行中',
      isTimeout: false,
      interventionPendingNode: '数据提供人',
    },
    { id: 'D002', code: 'D002', path: '集团总部/人力行政中心', level: '一级部门', orgType: '职能部门', leader: '张人力 (M1002)', exec: '赵执委 (E1001)', hrbp: '李HR (H1001)', node: '相关方', approver: '吴九 (20002)', status: '进行中', isTimeout: true },
    { id: 'D003', code: 'D003', path: '集团总部/财务管理中心', level: '一级部门', orgType: '经营单元', leader: '陈效能 (M1003)', exec: '赵执委 (E1001)', hrbp: '王HR (H1002)', node: '-', approver: '-', status: '未开始', isTimeout: false },
    { id: 'D004', code: 'D004', path: '集团总部/战略发展部', level: '一级部门', orgType: '职能部门', leader: '卫系统 (M1004)', exec: '赵执委 (E1001)', hrbp: '王HR (H1002)', node: '主BP', approver: '朱九 (20004)', status: '已完成', isTimeout: false },
    { id: 'D005', code: 'D005', path: '集团总部/法务合规部', level: '一级部门', orgType: '能力中心', leader: '何法务 (M1005)', exec: '孙执委 (E1002)', hrbp: '张BP (H1003)', node: '分管执委', approver: '施五 (30005)', status: '进行中', isTimeout: false },
    { id: 'D006', code: 'D006', path: '集团总部/品牌营销部', level: '一级部门', orgType: '职能部门', leader: '曹营销 (M1006)', exec: '孙执委 (E1002)', hrbp: '张BP (H1003)', node: '分管常委', approver: '金一 (40006)', status: '未开始', isTimeout: false },
    { id: 'D007', code: 'D007', path: '集团总部/供应链管理中心', level: '一级部门', orgType: '经营单元', leader: '陶供应 (M1007)', exec: '孙执委 (E1002)', hrbp: '赵BP (H1004)', node: '能力中心负责人', approver: '邹七 (50007)', status: '进行中', isTimeout: true },
    { id: 'D008', code: 'D008', path: '集团总部/审计监察部', level: '一级部门', orgType: '职能部门', leader: '喻审计 (M1008)', exec: '孙执委 (E1002)', hrbp: '赵BP (H1004)', node: '-', approver: '-', status: '未开始', isTimeout: false },
  ]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  /** 组织绩效考核 · 预考核/正式考核各轮次下的等级调整（按考核对象 id） */
  const [appraisalGradeAdjustments, setAppraisalGradeAdjustments] = useState<
    Record<AppraisalRoundKey, Record<string, AppraisalGradeAdjustment>>
  >({ pre: {}, formal: {} });
  const [gradeAdjustModal, setGradeAdjustModal] = useState<null | {
    rowId: string;
    originalGrade: string;
    currentGrade: string;
    reason: string;
  }>(null);

  const appraisalRoundKey: AppraisalRoundKey =
    isOrgAppraisalStage && activeMonitoringTab === 'formal' ? 'formal' : 'pre';

  const getAppraisalScoreView = (item: { id: string; status: string }) => {
    const auto = computeAppraisalAutoScoreGrade(item);
    if (!auto) {
      return {
        hasResult: false,
        totalScore: '—',
        calculatedGrade: '—',
        adjustedGrade: '—',
        adjustment: undefined as AppraisalGradeAdjustment | undefined,
      };
    }
    const adjustment = appraisalGradeAdjustments[appraisalRoundKey]?.[item.id];
    const adjustedGrade = adjustment?.adjustedGrade ?? auto.calculatedGrade;
    return {
      hasResult: true,
      totalScore: auto.totalScore.toFixed(2),
      calculatedGrade: auto.calculatedGrade,
      adjustedGrade,
      adjustment,
    };
  };

  const openGradeAdjustModal = (item: { id: string; status: string }) => {
    const view = getAppraisalScoreView(item);
    if (!view.hasResult) return;
    setGradeAdjustModal({
      rowId: item.id,
      originalGrade: view.calculatedGrade,
      currentGrade: view.adjustedGrade,
      reason: view.adjustment?.adjustReason ?? '',
    });
  };

  const confirmGradeAdjustModal = () => {
    if (!gradeAdjustModal) return;
    const reason = gradeAdjustModal.reason.trim();
    if (!reason) {
      showToast('请填写调整原因', 'warning');
      return;
    }
    const currentGrade = gradeAdjustModal.currentGrade.trim();
    if (!currentGrade) {
      showToast('请选择现等级', 'warning');
      return;
    }
    setAppraisalGradeAdjustments((prev) => ({
      ...prev,
      [appraisalRoundKey]: {
        ...(prev[appraisalRoundKey] || {}),
        [gradeAdjustModal.rowId]: { adjustedGrade: currentGrade, adjustReason: reason },
      },
    }));
    setGradeAdjustModal(null);
    showToast('调整等级已保存', 'success');
  };

  useEffect(() => {
    if (assessmentData.some(item => item.status !== '未开始')) {
      setIsPlanStarted(true);
    }
    if (assessmentData.length > 0) {
      setIsSubjectsGenerated(true);
    }
  }, []);

  useEffect(() => {
    if (currentStep !== 2) {
      setPreAssessmentPrimaryActionsLocked(false);
    }
    if (currentStep === 2) setIsMoreMenuOpen(false);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 2) return;
    setRosterUpdateModalKind((k) => {
      if (k === 'pre' && activeMonitoringTab !== 'pre') return null;
      if (k === 'formal' && activeMonitoringTab !== 'formal') return null;
      return k;
    });
  }, [currentStep, activeMonitoringTab]);

  useEffect(() => {
    if (currentStep !== 1) {
      setRosterUpdateModalKind((k) => (k === 'mid' ? null : k));
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 1) {
      setRosterUpdateModalKind((k) => (k === 'mid' ? null : k));
    }
  }, [activeMonitoringTab1, currentStep]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<{
    path: string[];
    orgType: string[];
    level: string[];
    status: string[];
    node: string[];
    approver: string[];
    leader: string[];
    exec: string[];
    hrbp: string[];
  }>({
    path: [],
    orgType: [],
    level: [],
    status: [],
    node: [],
    approver: [],
    leader: [],
    exec: [],
    hrbp: [],
  });

  const filteredData = assessmentData.filter(item => {
    const matchesSearch = item.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.approver.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPath = columnFilters.path.length === 0 || columnFilters.path.includes(item.path);
    const matchesOrgType = columnFilters.orgType.length === 0 || columnFilters.orgType.includes(item.orgType);
    const matchesLevel = columnFilters.level.length === 0 || columnFilters.level.includes(item.level);
    const matchesStatus = columnFilters.status.length === 0 || columnFilters.status.includes(item.status);
    const matchesNode = columnFilters.node.length === 0 || columnFilters.node.includes(item.node);
    const matchesApprover = columnFilters.approver.length === 0 || columnFilters.approver.includes(item.approver);
    const matchesLeader = columnFilters.leader.length === 0 || columnFilters.leader.includes((item as any).leader);
    const matchesExec = columnFilters.exec.length === 0 || columnFilters.exec.includes((item as any).exec);
    const matchesHrbp = columnFilters.hrbp.length === 0 || columnFilters.hrbp.includes((item as any).hrbp);

    return matchesSearch && matchesPath && matchesOrgType && matchesLevel && matchesStatus && matchesNode && matchesApprover && matchesLeader && matchesExec && matchesHrbp;
  });

  const handleToggleColumnFilter = (column: keyof typeof columnFilters, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: prev[column].includes(value) 
        ? prev[column].filter(v => v !== value) 
        : [...prev[column], value]
    }));
  };

  const clearColumnFilter = (column: keyof typeof columnFilters) => {
    setColumnFilters(prev => ({ ...prev, [column]: [] }));
  };

  const getUniqueValues = (column: keyof typeof assessmentData[0]): string[] => {
    const values = assessmentData.map(item => item[column as keyof typeof item] as string);
    return Array.from(new Set(values)).filter((v): v is string => Boolean(v));
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === assessmentData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(assessmentData.map(item => item.id));
    }
  };

  const getSelectedAssessmentRows = () => assessmentData.filter((item) => selectedIds.includes(item.id));

  const toastNeedSelection = () => {
    showToast('请至少选择一条数据', 'warning');
  };

  /** 进行中（含滞留/超时）、已完成不可再次「启动」 */
  const isRowBlockedForRestart = (item: { status: string }) =>
    item.status === '进行中' || item.status === '已完成';

  /** 「归档并进入下一步」等：仅允许勾选已完成的数据 */
  const validateArchiveSelection = (): boolean => {
    if (selectedIds.length === 0) {
      toastNeedSelection();
      return false;
    }
    const selected = getSelectedAssessmentRows();
    if (selected.some((item) => item.status !== '已完成')) {
      showToast('仅「已完成」状态的数据可执行归档并进入下一步', 'warning');
      return false;
    }
    return true;
  };

  const handleStartPlan = () => {
    if (selectedIds.length === 0) {
      toastNeedSelection();
      return;
    }
    if (currentStep === 1) {
      const tab = monitoringTabs1.find((t) => t.id === activeMonitoringTab1);
      if (!tab || !(tab.startDate || '').trim() || !(tab.endDate || '').trim()) {
        showToast(
          [
            '请先维护当前回顾轮次的开始时间与结束时间。',
            '组织绩效中期回顾整体周期可能较长，后续还可能新增多轮回顾；当前轮次的起止仅代表本轮，不等同于整个中期回顾阶段，请为后续轮次预留时间窗口。',
            '若存在多轮回顾，各轮次的起止时间不得交叉。'
          ].join('\n'),
          'error',
          8000
        );
        return;
      }
      if (tab.startDate > tab.endDate) {
        showToast('当前轮次开始时间不能晚于结束时间', 'error');
        return;
      }
      const overlap = findOverlappingMidTermRound(monitoringTabs1, tab.id, tab.startDate, tab.endDate);
      if (overlap) {
        showToast(
          `当前轮次时间与「${overlap.name}」存在交叉，请调整后再启动。\n多轮回顾的起止时间不得重叠。`,
          'error',
          6000
        );
        return;
      }
      if (activity?.type !== '年度') {
        const mw = QUARTER_ORG_ASSESSMENT_STAGE_WINDOWS.midTerm;
        if (!isoRangeWithinWindow(tab.startDate, tab.endDate, mw)) {
          showToast(
            `当前轮次时间须在组织绩效中期回顾阶段窗口内（${isoStageWindowToStepperLabel(mw)}），且不能超出该整体窗口后再启动。`,
            'error',
            6500
          );
          return;
        }
      }
    }
    if (currentStep === 2) {
      const appraisalTabs = monitoringTabs2.filter((t) => t.id === 'pre' || t.id === 'formal');
      for (const tab of appraisalTabs) {
        const s = (tab.startDate || '').trim();
        const e = (tab.endDate || '').trim();
        if (!s || !e) {
          showToast(
            [
              `考核对象已勾选，但「${tab.name}」的开始时间、结束时间尚未填写，无法启动考核。`,
              '请点击该轮次标签右侧的「编辑」图标，在弹窗中补全起止日期后再点击「启动组织绩效考核」。',
            ].join('\n'),
            'warning',
            6500
          );
          return;
        }
        if (s > e) {
          showToast(`「${tab.name}」开始时间不能晚于结束时间`, 'error');
          return;
        }
      }
      const pre = monitoringTabs2.find((t) => t.id === 'pre');
      const formal = monitoringTabs2.find((t) => t.id === 'formal');
      if (
        pre &&
        formal &&
        (pre.startDate || '').trim() &&
        (pre.endDate || '').trim() &&
        (formal.startDate || '').trim() &&
        (formal.endDate || '').trim() &&
        inclusiveDateRangesOverlap(
          pre.startDate.trim(),
          pre.endDate.trim(),
          formal.startDate.trim(),
          formal.endDate.trim()
        )
      ) {
        showToast('组织绩效预考核与组织绩效正式考核的时间段不能交叉，请调整后再启动。', 'error', 5000);
        return;
      }
    }
    const selected = getSelectedAssessmentRows();
    if (selected.some(isRowBlockedForRestart)) {
      showToast('进行中、滞留/超时、已完成状态的数据不能重复启动', 'warning');
      return;
    }
    setAssessmentData(prev => prev.map(item => 
      selectedIds.includes(item.id) ? { ...item, status: '进行中' as any } : item
    ));
    setSelectedIds([]);
    if (currentStep === 0) {
      setIsPlanStarted(true);
      showToast('计划制定已启动', 'success');
    } else {
      showToast('流程已启动', 'success');
    }
  };

  const handleArchive = () => {
    if (currentStep === 2 && activeMonitoringTab === 'formal') {
      if (assessmentData.length === 0) {
        showToast('暂无考核对象', 'warning');
        return;
      }
      if (!assessmentData.every((item) => item.status === '已完成')) {
        showToast(
          '「归档并完成」针对组织绩效正式考核下的全部考核对象：须均为「已完成」后方可归档；当前存在未完成数据，请处理后再试。',
          'warning',
          5500
        );
        return;
      }
      setSelectedIds([]);
      showToast('已归档并完成', 'success');
      onFormalAssessmentArchived?.();
      return;
    }

    if (!validateArchiveSelection()) return;
    setAssessmentData(prev => prev.map(item => 
      selectedIds.includes(item.id) ? { ...item, status: '已完成' as any } : item
    ));
    setSelectedIds([]);
    if (currentStep === 0) {
      setPlanStageArchivedToMidTerm(true);
      setCurrentStep(1);
      syncMonitoringToActivity({
        planStageArchivedToMidTerm: true,
        currentMidTermRoundId: activeMonitoringTab1 || monitoringTabs1[0]?.id,
        phaseRoundTabs: { [MONITORING_PHASE_MID_TERM]: monitoringTabs1 },
      });
      showToast('已进入组织绩效中期回顾', 'success');
    }
  };

  /** 组织绩效中期回顾 · 多轮非末轮：须当前列表全部考核对象为「已完成」方可归档；通过后进入下一轮并将名单初始化为「未开始」 */
  const handleMidTermArchiveAndNextRound = () => {
    if (assessmentData.length === 0) {
      showToast('暂无考核对象', 'warning');
      return;
    }
    if (!assessmentData.every((item) => item.status === '已完成')) {
      showToast('仅所有考核对象的状态为「已完成」时才可以归档并进入下一轮次', 'warning');
      return;
    }
    const idx = monitoringTabs1.findIndex((t) => t.id === activeMonitoringTab1);
    const nextTab = idx >= 0 && idx < monitoringTabs1.length - 1 ? monitoringTabs1[idx + 1] : null;
    if (!nextTab) {
      showToast('当前已是最后一轮回顾', 'warning');
      return;
    }
    setAssessmentData((prev) =>
      prev.map((item) => ({ ...item, status: '未开始' as any }))
    );
    setSelectedIds([]);
    setActiveMonitoringTab1(nextTab.id);
    syncMonitoringToActivity({
      currentMidTermRoundId: nextTab.id,
      phaseRoundTabs: { [MONITORING_PHASE_MID_TERM]: monitoringTabs1 },
    });
    showToast(`已归档并进入${nextTab.name}`, 'success');
  };

  /** 组织绩效考核阶段 · 组织绩效预考核：须当前列表全部考核对象为「已完成」方可归档；通过后进入正式考核并将名单初始化为「未开始」 */
  const handlePreAssessmentArchiveAndNextRound = () => {
    if (assessmentData.length === 0) {
      showToast('暂无考核对象', 'warning');
      return;
    }
    if (!assessmentData.every((item) => item.status === '已完成')) {
      showToast('仅所有考核对象的状态为「已完成」时才可以归档并进入下一轮次', 'warning');
      return;
    }
    if (!monitoringTabs2.some((t) => t.id === 'formal')) {
      showToast('当前未配置组织绩效正式考核轮次', 'warning');
      return;
    }
    setAssessmentData((prev) => prev.map((item) => ({ ...item, status: '未开始' as any })));
    setSelectedIds([]);
    setActiveMonitoringTab2('formal');
    showToast('已归档并进入组织绩效正式考核', 'success');
  };

  /** 组织绩效考核阶段 · 预考核：跳过当前轮次，直接进入正式考核（不要求勾选与「已完成」校验）；由确认弹窗触发 */
  const handleSkipPreAssessmentToFormal = () => {
    if (currentStep !== 2 || activeMonitoringTab !== 'pre') {
      setIsSkipPreAssessmentConfirmOpen(false);
      return;
    }
    if (!monitoringTabs2.some((t) => t.id === 'formal')) {
      setIsSkipPreAssessmentConfirmOpen(false);
      showToast('当前未配置组织绩效正式考核轮次', 'warning');
      return;
    }
    setIsSkipPreAssessmentConfirmOpen(false);
    setSelectedIds([]);
    setPreAssessmentPrimaryActionsLocked(true);
    setActiveMonitoringTab2('formal');
    showToast('已跳过预考核，当前数据已推送至组织绩效正式考核', 'success');
  };

  const openPreRosterUpdateModal = () => {
    const diff = PRE_ASSESSMENT_ROSTER_DIFF;
    if (diff.added.length === 0 && diff.removed.length === 0 && diff.changed.length === 0) {
      showToast('中期归档推送数据与组织主数据一致，无需更新名单', 'success');
      return;
    }
    setPreRosterApplyAdd(true);
    setPreRosterApplyRemove(true);
    setPreRosterApplyChange(true);
    setRosterUpdateModalKind('pre');
  };

  const openMidTermRosterUpdateModal = () => {
    const diff = MID_TERM_ROSTER_UPDATE_DIFF;
    if (diff.added.length === 0 && diff.removed.length === 0 && diff.changed.length === 0) {
      showToast('组织绩效计划制定阶段名单与组织主数据一致，无需更新名单', 'success');
      return;
    }
    setPreRosterApplyAdd(true);
    setPreRosterApplyRemove(true);
    setPreRosterApplyChange(true);
    setRosterUpdateModalKind('mid');
  };

  const handleApplyPreRosterUpdate = () => {
    const diff = PRE_ASSESSMENT_ROSTER_DIFF;
    const willAdd = preRosterApplyAdd && diff.added.length > 0;
    const willRemove = preRosterApplyRemove && diff.removed.length > 0;
    const willChange = preRosterApplyChange && diff.changed.length > 0;
    if (!willAdd && !willRemove && !willChange) {
      showToast('请至少勾选一类需要应用的变更，或点击取消关闭', 'warning');
      return;
    }
    setAssessmentData((prev) =>
      applyOrgRosterDiffToAssessmentRows(prev, diff, preRosterApplyAdd, preRosterApplyRemove, preRosterApplyChange)
    );
    setRosterUpdateModalKind(null);
    showToast('已按确认结果更新组织绩效预考核名单', 'success');
  };

  const handleApplyMidTermRosterUpdate = () => {
    const diff = MID_TERM_ROSTER_UPDATE_DIFF;
    const willAdd = preRosterApplyAdd && diff.added.length > 0;
    const willRemove = preRosterApplyRemove && diff.removed.length > 0;
    const willChange = preRosterApplyChange && diff.changed.length > 0;
    if (!willAdd && !willRemove && !willChange) {
      showToast('请至少勾选一类需要应用的变更，或点击取消关闭', 'warning');
      return;
    }
    setAssessmentData((prev) =>
      applyOrgRosterDiffToAssessmentRows(prev, diff, preRosterApplyAdd, preRosterApplyRemove, preRosterApplyChange)
    );
    setRosterUpdateModalKind(null);
    showToast('已按确认结果更新本回顾轮次组织名单', 'success');
  };

  const openFormalRosterUpdateModal = () => {
    const diff = FORMAL_ASSESSMENT_ROSTER_DIFF;
    if (diff.added.length === 0 && diff.removed.length === 0 && diff.changed.length === 0) {
      showToast('中期归档推送数据与组织主数据一致，无需更新名单', 'success');
      return;
    }
    setPreRosterApplyAdd(true);
    setPreRosterApplyRemove(true);
    setPreRosterApplyChange(true);
    setRosterUpdateModalKind('formal');
  };

  const handleApplyFormalRosterUpdate = () => {
    const diff = FORMAL_ASSESSMENT_ROSTER_DIFF;
    const willAdd = preRosterApplyAdd && diff.added.length > 0;
    const willRemove = preRosterApplyRemove && diff.removed.length > 0;
    const willChange = preRosterApplyChange && diff.changed.length > 0;
    if (!willAdd && !willRemove && !willChange) {
      showToast('请至少勾选一类需要应用的变更，或点击取消关闭', 'warning');
      return;
    }
    setAssessmentData((prev) =>
      applyOrgRosterDiffToAssessmentRows(prev, diff, preRosterApplyAdd, preRosterApplyRemove, preRosterApplyChange)
    );
    setRosterUpdateModalKind(null);
    showToast('已按确认结果更新组织绩效正式考核名单', 'success');
  };

  /** 组织绩效中期回顾最后一轮：归档并进入组织绩效考核；默认落在「组织绩效预考核」轮次（可手动切换至正式考核 Tab） */
  const performMidTermArchiveEnterAppraisal = () => {
    if (!validateArchiveSelection()) return;
    setAssessmentData(prev => prev.map(item =>
      selectedIds.includes(item.id) ? { ...item, status: '已完成' as any } : item
    ));
    setSelectedIds([]);
    const b = midTermBounds;
    const isQuarter = activity?.type !== '年度';
    const aw = QUARTER_ORG_ASSESSMENT_STAGE_WINDOWS.appraisal;
    let nextAppraisalTabs: MonitoringTab[] = monitoringTabs2;
    let nextAppraisalRoundId = 'pre';

    if (isQuarter) {
      let preEnd = addDaysIso(aw.start, 14);
      if (preEnd >= aw.end) preEnd = aw.end;
      const formalStart = addDaysIso(preEnd, 1);
      if (formalStart > aw.end) {
        showToast('组织绩效考核阶段时间过短，无法拆分两轮，已仅保留组织绩效正式考核', 'warning');
        nextAppraisalTabs = [
          { id: 'formal', name: '组织绩效正式考核', isDefault: true, startDate: '', endDate: '' },
        ];
        nextAppraisalRoundId = 'formal';
      } else {
        nextAppraisalTabs = [
          { id: 'pre', name: '组织绩效预考核', isDefault: true, startDate: '', endDate: '' },
          { id: 'formal', name: '组织绩效正式考核', isDefault: true, startDate: '', endDate: '' },
        ];
        nextAppraisalRoundId = 'pre';
      }
    } else if (b) {
      let preEnd = addDaysIso(b.start, 2);
      if (preEnd > b.end) preEnd = b.end;
      const formalStart = addDaysIso(preEnd, 1);
      if (formalStart > b.end) {
        showToast('组织绩效中期回顾时间过短，无法拆分两轮，已仅保留组织绩效正式考核', 'warning');
        nextAppraisalTabs = [
          { id: 'formal', name: '组织绩效正式考核', isDefault: true, startDate: '', endDate: '' },
        ];
        nextAppraisalRoundId = 'formal';
      } else {
        nextAppraisalTabs = [
          { id: 'pre', name: '组织绩效预考核', isDefault: true, startDate: '', endDate: '' },
          { id: 'formal', name: '组织绩效正式考核', isDefault: true, startDate: '', endDate: '' },
        ];
        nextAppraisalRoundId = 'pre';
      }
    } else {
      nextAppraisalTabs = [
        { id: 'pre', name: '组织绩效预考核', isDefault: true, startDate: '', endDate: '' },
        { id: 'formal', name: '组织绩效正式考核', isDefault: true, startDate: '', endDate: '' },
      ];
      nextAppraisalRoundId = 'pre';
    }

    setMonitoringTabs2(nextAppraisalTabs);
    setActiveMonitoringTab2(nextAppraisalRoundId);
    setMidTermArchivedToAppraisal(true);
    setCurrentStep(2);
    setPreAssessmentPrimaryActionsLocked(false);
    syncMonitoringToActivity({
      midTermArchivedToAppraisal: true,
      currentAppraisalRoundId: nextAppraisalRoundId,
      phaseRoundTabs: {
        [MONITORING_PHASE_MID_TERM]: monitoringTabs1,
        [MONITORING_PHASE_APPRAISAL]: nextAppraisalTabs,
      },
    });
    showToast('已进入组织绩效考核', 'success');
  };

  const getStatusText = (item: any) => {
    if (item.status === '进行中' && item.isTimeout) return '滞留/超时';
    return item.status;
  };

  const getStatusStyle = (status: string, isTimeout?: boolean) => {
    if (status === '进行中' && isTimeout) {
      return 'bg-red-50 text-red-600 border-red-100';
    }
    switch (status) {
      case '进行中':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case '已完成':
        return 'bg-green-50 text-green-600 border-green-100';
      default:
        return 'bg-gray-50 text-gray-400 border-gray-100';
    }
  };

  const getStatusDot = (status: string, isTimeout?: boolean) => {
    if (status === '进行中' && isTimeout) return 'bg-red-600';
    switch (status) {
      case '进行中': return 'bg-blue-600';
      case '已完成': return 'bg-green-600';
      default: return 'bg-gray-400';
    }
  };

  const handleApplyFrequency = () => {
    setReviewFrequency(tempFrequency);
    setReviewStages(tempStages);
    setIsFrequencyModalOpen(false);
  };

  const handleAddStage = () => {
    setTempStages([...tempStages, { name: `第${tempStages.length + 1}轮回顾` }]);
  };

  const handleDeleteStage = (index: number) => {
    setTempStages(tempStages.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <AlertCircle className="text-red-500" size={24} />
                  </div>
                  <h3 className="text-[16px] font-semibold text-gray-900">确认删除数据？</h3>
                </div>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                  确认要删除当前选中的考核对象吗？删除数据后数据不可恢复。
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 bg-red-500 text-white rounded text-[13px] hover:bg-red-600 shadow-md shadow-red-100 transition-colors"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeletePreAssessmentOpen && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <AlertCircle className="text-red-500" size={24} />
                  </div>
                  <h3 className="text-[16px] font-semibold text-gray-900">删除组织绩效预考核？</h3>
                </div>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                  「组织绩效预考核」为<strong className="text-gray-800">可选</strong>轮次，仅预考核支持删除。删除后仍保留「组织绩效正式考核」；需要时可再通过「添加组织绩效预考核」补回。
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDeletePreAssessmentOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleDeletePreAssessmentConfirm}
                    className="px-4 py-2 bg-red-500 text-white rounded text-[13px] hover:bg-red-600 shadow-md shadow-red-100 transition-colors"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSkipPreAssessmentConfirmOpen && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <AlertCircle className="text-amber-600" size={24} />
                  </div>
                  <h3 className="text-[16px] font-semibold text-gray-900">确认跳过组织绩效预考核？</h3>
                </div>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-2">
                  跳过后将直接进入<strong className="text-gray-900">组织绩效正式考核</strong>轮次，当前预考核轮次结束，名单与数据将按当前状态推送至正式考核。
                </p>
                <p className="text-[14px] text-amber-900/90 leading-relaxed mb-6 font-medium">
                  该操作<strong>不可撤销</strong>，请确认后再继续。
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSkipPreAssessmentConfirmOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleSkipPreAssessmentToFormal}
                    className="px-4 py-2 bg-amber-600 text-white rounded text-[13px] hover:bg-amber-700 shadow-md transition-colors"
                  >
                    确认跳过
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gradeAdjustModal && isOrgAppraisalStage && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[16px] font-semibold text-gray-900">调整等级</h3>
                <button
                  type="button"
                  onClick={() => setGradeAdjustModal(null)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] text-gray-600 font-medium">原等级</label>
                  <div className="w-full border border-gray-100 rounded-lg px-3 py-2.5 text-[14px] bg-gray-50 text-gray-700 font-semibold">
                    {gradeAdjustModal.originalGrade}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] text-gray-600 font-medium">
                    现等级 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={gradeAdjustModal.currentGrade}
                    onChange={(e) =>
                      setGradeAdjustModal((m) => (m ? { ...m, currentGrade: e.target.value } : m))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-[#2f54eb] bg-white"
                  >
                    {APPRAISAL_GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] text-gray-600 font-medium">
                    调整原因 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={gradeAdjustModal.reason}
                    onChange={(e) =>
                      setGradeAdjustModal((m) => (m ? { ...m, reason: e.target.value } : m))
                    }
                    placeholder="请填写调整原因"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-[#2f54eb] resize-none"
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGradeAdjustModal(null)}
                  className="px-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={confirmGradeAdjustModal}
                  className="px-4 py-2 bg-[#2f54eb] text-white rounded text-[13px] hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -12, x: '-50%' }}
            className="fixed top-3 left-1/2 z-[10050] px-4 py-2.5 rounded-lg shadow-xl flex items-start gap-2 bg-white border border-orange-200 min-w-[240px] max-w-[min(92vw,560px)] pointer-events-auto"
          >
            {toast.type === 'warning' && <AlertCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <X size={16} className="text-red-500 shrink-0 mt-0.5" />}
            {toast.type === 'success' && <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />}
            <span className="text-[13px] text-gray-800 leading-snug whitespace-pre-line">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="fixed inset-0 z-[200] bg-[#f0f2f5] flex flex-col"
      >
        {/* Header - Styled like Figure 1 */}
        <div className="bg-white px-6 py-3 flex items-center justify-between shrink-0 border-b border-gray-100 shadow-sm z-50">
          <div className="flex items-center gap-4 text-[14px]">
            <div className="flex items-center gap-1">
              <span
                className={`font-medium ${
                  activity?.status === '草稿'
                    ? 'inline-flex items-center px-2 py-0.5 rounded text-[13px] bg-gray-100 text-gray-700 border border-gray-200'
                    : 'text-gray-900'
                }`}
              >
                {activity?.status || '进行中'}
              </span>
              <span className="text-gray-300 mx-1">/</span>
              <span className="font-medium text-gray-800">{activity?.name || '产品考核方案'}</span>
              <span className="text-gray-400 mx-1">·</span>
              <span className="text-gray-800">{activity?.year || '2024'} {activity?.period || '第三季度'}</span>
              <span className="text-gray-400 mx-1">·</span>
              <span className="text-gray-800">{activity?.type === '年度' ? '2024/07/01 ~ 2024/09/30' : QUARTER_ORG_ASSESSMENT_HEADER_CYCLE}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose} 
              className="px-4 py-1.5 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer bg-white"
            >
              返回
            </button>
            {activity?.status !== '已完成' && (
              activity?.status === '草稿' ? (
                <>
                  <button
                    type="button"
                    onClick={() => onEditActivity?.()}
                    className="px-4 py-1.5 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer bg-white"
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteActivity?.()}
                    className="px-4 py-1.5 border border-red-200 rounded text-[13px] text-red-600 hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer bg-white"
                  >
                    删除
                  </button>
                </>
              ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (isActivityInProgress) return;
                    if (currentStep !== 2) return;
                    const tab = monitoringTabs.find(t => t.id === activeMonitoringTab);
                    if (tab) handleOpenEditModal(tab);
                  }}
                  disabled={isActivityInProgress || currentStep !== 2}
                  title={
                    isActivityInProgress
                      ? '活动进行中：顶部「编辑」已关闭。请通过上方轮次标签旁的铅笔图标，维护各轮次的开始与结束时间。'
                      : currentStep !== 2
                        ? '请进入「组织绩效考核」阶段后编辑轮次时间'
                        : '编辑当前轮次开始/结束时间（与轮次标签旁图标相同）'
                  }
                  className={`px-4 py-1.5 border rounded text-[13px] transition-all cursor-pointer bg-white ${
                    currentStep === 2 && !isActivityInProgress
                      ? 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                      : 'border-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  编辑
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isActivityInProgress) return;
                    if (currentStep === 2 && activeMonitoringTab === 'pre') {
                      setIsDeletePreAssessmentOpen(true);
                    }
                  }}
                  disabled={
                    isActivityInProgress ||
                    currentStep !== 2 ||
                    activeMonitoringTab !== 'pre'
                  }
                  title={
                    isActivityInProgress
                      ? '活动进行中，不可删除活动或移除此处轮次'
                      : currentStep !== 2
                        ? '请进入「组织绩效考核」阶段'
                        : activeMonitoringTab !== 'pre'
                          ? '仅「组织绩效预考核」为可选阶段，可删除；正式考核不可删除'
                          : '删除可选的组织绩效预考核轮次'
                  }
                  className={`px-4 py-1.5 border rounded text-[13px] transition-all cursor-pointer bg-white ${
                    currentStep === 2 && activeMonitoringTab === 'pre' && !isActivityInProgress
                      ? 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                      : 'border-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  删除
                </button>
              </>
              )
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {/* Steps Bar - Optimized for space */}
          <div className="bg-white py-4 px-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between max-w-5xl mx-auto relative">
              {/* Connection Line */}
              <div className="absolute top-[14px] left-[8%] right-[8%] h-[1px] bg-gray-100 z-0" />
              <div 
                className="absolute top-[14px] left-[8%] h-[1px] bg-[#2f54eb] transition-all duration-500 z-0 opacity-30" 
                style={{
                  width: isActivityCompleted ? '84%' : `${(currentStep / Math.max(1, steps.length - 1)) * 84}%`,
                }}
              />

              {steps.map((step, idx) => {
                const stepBlockTitle = getStepNavigationBlockTitle(idx);
                const stepNavLocked = Boolean(stepBlockTitle);
                return (
                <div key={step.title} className="relative z-10 flex flex-col items-center gap-2 max-w-[28%]">
                  <div 
                    role="button"
                    tabIndex={0}
                    onClick={() => handleStepNavigationClick(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleStepNavigationClick(idx);
                      }
                    }}
                    title={stepBlockTitle}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 text-[12px] font-bold border-2 ${
                      stepNavLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                    } ${
                      isActivityCompleted || idx <= currentStep 
                        ? 'bg-[#2f54eb] text-white border-blue-50 shadow-md shadow-blue-50' 
                        : 'bg-white text-gray-300 border-gray-100'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="text-center" title={stepBlockTitle}>
                    <div className={`text-[13px] font-medium transition-colors ${isActivityCompleted || idx <= currentStep ? 'text-[#2f54eb]' : 'text-gray-400'}`}>
                      {step.title}
                    </div>
                    {step.date && (
                      <div className="text-[11px] text-gray-400 mt-1 px-2 py-0.5 bg-gray-50/80 border border-gray-100/50 rounded inline-block min-w-max">
                        {step.date}
                      </div>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Review Rounds Tabs - Optimized UI */}
          {currentStep >= 1 && (
            <div className="bg-[#f8f9fb] px-6 pt-3 flex items-center border-b border-gray-200 overflow-x-auto no-scrollbar gap-2 relative">
              {monitoringTabs.map((tab) => (
                <div 
                  key={tab.id}
                  onClick={() => handleMonitoringTabClick(tab.id)}
                  className={`group relative flex items-center gap-2 px-5 py-3 text-[14px] font-medium transition-all cursor-pointer whitespace-nowrap rounded-t-lg border-t border-x ${
                    activeMonitoringTab === tab.id 
                      ? 'bg-white text-[#2f54eb] border-gray-200 shadow-[0_-2px_4px_rgba(0,0,0,0.02)] z-10 -mb-[1px]' 
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100/80'
                  }`}
                >
                  <span className={activeMonitoringTab === tab.id ? 'font-bold' : ''}>
                    {currentStep === 2 ? tab.name : (currentStep === 1 ? tab.name.replace('考核', '回顾') : tab.name)}
                  </span>
                  
                  {/* Action Icons */}
                  {(currentStep === 1 || currentStep === 2) && !isActivityCompleted && (
                    <div className={`flex items-center gap-1.5 transition-all duration-200 ${activeMonitoringTab === tab.id ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'}`}>
                      <Edit 
                        size={13} 
                        className="cursor-pointer hover:text-[#2f54eb] text-gray-400 hover:scale-110 transition-transform shrink-0" 
                        onClick={(e) => handleOpenEditModal(tab, e)}
                      />
                      {currentStep === 1 && !tab.isDefault && (
                        <X 
                          size={13} 
                          className="cursor-pointer hover:text-red-500 text-gray-400 hover:scale-110 transition-transform shrink-0" 
                          onClick={(e) => handleDeleteTab(tab.id, e)}
                        />
                      )}
                    </div>
                  )}

                  {/* Active Indicator Line */}
                  {activeMonitoringTab === tab.id && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#2f54eb] rounded-t-lg" />
                  )}
                </div>
              ))}
              
              {!isActivityCompleted && currentStep !== 2 && (
                <button 
                  onClick={handleOpenAddModal}
                  className="flex items-center justify-center p-2 mb-1.5 text-gray-400 hover:text-[#2f54eb] hover:bg-white hover:shadow-sm rounded-full transition-all shrink-0 ml-1 group border border-transparent hover:border-gray-200"
                  title="添加新一轮"
                >
                  <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              )}
              {!isActivityCompleted && currentStep === 2 && !monitoringTabs2.some(t => t.id === 'pre') && (
                <button
                  type="button"
                  onClick={addPreAssessmentRound}
                  title="删除预考核后，可在此补回组织绩效预考核轮次"
                  className="mb-1.5 ml-1 shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#2f54eb] bg-white border border-[#2f54eb]/30 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Plus size={16} />
                  添加组织绩效预考核
                </button>
              )}
            </div>
          )}

          {currentStep === 1 && monitoringTabs1.length > 1 && !isLastMidTermRoundTab && !isActivityCompleted && (
            <div className="mx-4 mb-0 px-4 py-2.5 rounded-md bg-amber-50 border border-amber-100 text-[12px] text-amber-900 leading-relaxed">
              「归档并进入下一步」仅在<strong className="font-semibold">组织绩效中期回顾最后一轮</strong>（{monitoringTabs1.at(-1)?.name ?? ''}）下显示；请切换至该轮次后再归档。
            </div>
          )}

          {/* Secondary View Filter - 考核对象 / 考核监控 */}
          {![0, 1, 2].includes(currentStep) && (
            <div className="bg-white px-6 py-4 flex items-center gap-2 border-b border-gray-50">
              {['考核对象', '考核监控'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-1.5 text-[13px] font-semibold rounded-full transition-all cursor-pointer ${
                    activeTab === tab 
                      ? 'bg-[#2f54eb] text-white shadow-[0_2px_8px_rgba(47,84,235,0.25)]' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* Round Modal */}
          {isRoundModalOpen && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-[1000] animate-in fade-in duration-200">
              <div className="bg-white rounded-lg shadow-2xl w-[450px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-[16px] font-bold text-gray-800">
                    {roundModalMode === 'add' 
                      ? (currentStep === 2 ? '新增考核轮次' : '新增回顾轮次') 
                      : (currentStep === 2 ? '编辑考核轮次' : '编辑回顾轮次')}
                  </h3>
                  <button onClick={() => setIsRoundModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-gray-600">轮次名称</label>
                    <input 
                      type="text"
                      value={roundModalData.name || ''}
                      onChange={(e) => setRoundModalData({ ...roundModalData, name: e.target.value })}
                      placeholder="请输入轮次名称"
                      disabled={currentStep === 2 && (roundModalData.id === 'pre' || roundModalData.id === 'formal')}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-[14px] outline-none focus:border-[#2f54eb] transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                      autoFocus={!(currentStep === 2 && (roundModalData.id === 'pre' || roundModalData.id === 'formal'))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-gray-600">开始时间</label>
                      <input 
                        type="date"
                        value={roundModalData.startDate || ''}
                        onChange={(e) => setRoundModalData({ ...roundModalData, startDate: e.target.value })}
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-[14px] outline-none focus:border-[#2f54eb] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-gray-600">结束时间</label>
                      <input 
                        type="date"
                        value={roundModalData.endDate || ''}
                        onChange={(e) => setRoundModalData({ ...roundModalData, endDate: e.target.value })}
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-[14px] outline-none focus:border-[#2f54eb] transition-colors"
                      />
                    </div>
                  </div>
                  {currentStep === 2 && midTermBounds && (
                    <p className="text-[12px] text-gray-500 leading-relaxed">
                      说明：从组织绩效中期回顾进入本阶段后默认包含「组织绩效预考核」与「组织绩效正式考核」两个轮次（预考核为可选，可删除）。约束：开始、结束须在组织绩效中期回顾（{midTermBounds.start} ~ {midTermBounds.end}）内；预考核与正式考核时间段不可交叉。
                    </p>
                  )}
                </div>
                <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                  <button 
                    onClick={() => setIsRoundModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-[14px] transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleSaveRound}
                    className="px-4 py-2 bg-[#2f54eb] text-white rounded text-[14px] hover:bg-[#1d39c4] transition-colors shadow-sm"
                  >
                    确定
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 更新轮次名单：预考核 / 正式考核 / 中期回顾（比对 + 二次确认） */}
          {rosterUpdateModalKind !== null && (
            <div className="fixed inset-0 bg-black/35 backdrop-blur-[2px] flex items-center justify-center z-[1001] animate-in fade-in duration-200 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-[640px] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-3 shrink-0">
                  <div>
                    <h3 className="text-[16px] font-bold text-gray-900">更新名单 · 数据比对确认</h3>
                    <p className="text-[12px] text-gray-500 mt-1.5 leading-relaxed">
                      {rosterUpdateModalKind === 'mid' ? (
                        <>
                          将<strong className="text-gray-700">组织绩效计划制定阶段已确认的组织名单</strong>与<strong className="text-gray-700">组织主数据</strong>比对。请分别确认是否应用「新增」「删除」「信息变更」；仅勾选的部分会在您点击「确认执行」后写入<strong className="text-gray-700">当前回顾轮次</strong>名单。
                        </>
                      ) : rosterUpdateModalKind === 'formal' ? (
                        <>
                          将<strong className="text-gray-700">组织绩效中期回顾阶段已归档并推送</strong>的组织数据与<strong className="text-gray-700">组织主数据</strong>比对。请分别确认是否应用「新增」「删除」「信息变更」；仅勾选的部分会在您点击「确认执行」后写入<strong className="text-gray-700">组织绩效正式考核</strong>本轮名单。
                        </>
                      ) : (
                        <>
                          将<strong className="text-gray-700">组织绩效中期回顾阶段已归档并推送</strong>的组织数据与<strong className="text-gray-700">组织主数据</strong>比对。请分别确认是否应用「新增」「删除」「信息变更」；仅勾选的部分会在您点击「确认执行」后写入<strong className="text-gray-700">组织绩效预考核</strong>本轮名单。
                        </>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRosterUpdateModalKind(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 p-1"
                    aria-label="关闭"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="px-6 py-4 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
                  {/* 新增 */}
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 overflow-hidden">
                    <div className="px-4 py-2.5 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between gap-3">
                      <span className="text-[13px] font-semibold text-emerald-900">
                        新增 <span className="font-normal text-emerald-700">（{rosterUpdateModalKind === 'mid' ? '主数据有、计划阶段名单未包含' : '主数据有、中期归档未包含'} · {PRE_ASSESSMENT_ROSTER_DIFF.added.length}）</span>
                      </span>
                      <label className="flex items-center gap-2 text-[12px] text-emerald-900 cursor-pointer select-none shrink-0">
                        <input
                          type="checkbox"
                          checked={preRosterApplyAdd}
                          onChange={(e) => setPreRosterApplyAdd(e.target.checked)}
                          disabled={PRE_ASSESSMENT_ROSTER_DIFF.added.length === 0}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        应用新增
                      </label>
                    </div>
                    <ul className="px-4 py-2 max-h-[140px] overflow-y-auto text-[13px] text-gray-800 space-y-1.5">
                      {PRE_ASSESSMENT_ROSTER_DIFF.added.length === 0 ? (
                        <li className="text-gray-400 py-1">无</li>
                      ) : (
                        PRE_ASSESSMENT_ROSTER_DIFF.added.map((row) => (
                          <li key={row.code} className="flex flex-wrap gap-x-2 gap-y-0.5">
                            <span className="font-mono text-[12px] text-gray-500">{row.code}</span>
                            <span className="font-medium">{orgPathDisplayName(row.path)}</span>
                            <span className="text-gray-500 text-[12px]">（{row.path}）</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  {/* 删除 */}
                  <div className="rounded-lg border border-rose-100 bg-rose-50/40 overflow-hidden">
                    <div className="px-4 py-2.5 bg-rose-50/80 border-b border-rose-100 flex items-center justify-between gap-3">
                      <span className="text-[13px] font-semibold text-rose-900">
                        删除 <span className="font-normal text-rose-700">（{rosterUpdateModalKind === 'mid' ? '计划阶段名单有、主数据已不存在' : '中期归档有、主数据已不存在'} · {PRE_ASSESSMENT_ROSTER_DIFF.removed.length}）</span>
                      </span>
                      <label className="flex items-center gap-2 text-[12px] text-rose-900 cursor-pointer select-none shrink-0">
                        <input
                          type="checkbox"
                          checked={preRosterApplyRemove}
                          onChange={(e) => setPreRosterApplyRemove(e.target.checked)}
                          disabled={PRE_ASSESSMENT_ROSTER_DIFF.removed.length === 0}
                          className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        />
                        应用删除
                      </label>
                    </div>
                    <ul className="px-4 py-2 max-h-[140px] overflow-y-auto text-[13px] text-gray-800 space-y-1.5">
                      {PRE_ASSESSMENT_ROSTER_DIFF.removed.length === 0 ? (
                        <li className="text-gray-400 py-1">无</li>
                      ) : (
                        PRE_ASSESSMENT_ROSTER_DIFF.removed.map((row) => (
                          <li key={row.code} className="flex flex-wrap gap-x-2 gap-y-0.5">
                            <span className="font-mono text-[12px] text-gray-500">{row.code}</span>
                            <span className="font-medium">{orgPathDisplayName(row.path)}</span>
                            <span className="text-gray-500 text-[12px]">（{row.path}）</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  {/* 信息变更 */}
                  <div className="rounded-lg border border-amber-100 bg-amber-50/40 overflow-hidden">
                    <div className="px-4 py-2.5 bg-amber-50/80 border-b border-amber-100 flex items-center justify-between gap-3">
                      <span className="text-[13px] font-semibold text-amber-900">
                        信息变更 <span className="font-normal text-amber-800">（部门名称、部门负责人、HRBP、分管执委/常委等发生变化 · {PRE_ASSESSMENT_ROSTER_DIFF.changed.length}）</span>
                      </span>
                      <label className="flex items-center gap-2 text-[12px] text-amber-900 cursor-pointer select-none shrink-0">
                        <input
                          type="checkbox"
                          checked={preRosterApplyChange}
                          onChange={(e) => setPreRosterApplyChange(e.target.checked)}
                          disabled={PRE_ASSESSMENT_ROSTER_DIFF.changed.length === 0}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        应用更新
                      </label>
                    </div>
                    <ul className="px-4 py-2 max-h-[180px] overflow-y-auto text-[13px] space-y-3">
                      {PRE_ASSESSMENT_ROSTER_DIFF.changed.length === 0 ? (
                        <li className="text-gray-400 py-1">无</li>
                      ) : (
                        PRE_ASSESSMENT_ROSTER_DIFF.changed.map((c) => (
                          <li key={c.line.code} className="border-b border-amber-100/80 last:border-0 pb-3 last:pb-0">
                            <div className="flex flex-wrap gap-x-2 gap-y-0.5 font-medium text-gray-900">
                              <span className="font-mono text-[12px] text-gray-500">{c.line.code}</span>
                              {orgPathDisplayName(c.line.path)}
                            </div>
                            <ul className="mt-1.5 space-y-1 text-[12px] text-amber-900/90">
                              {c.labels.map((t, i) => (
                                <li key={i} className="pl-2 border-l-2 border-amber-200">{t}</li>
                              ))}
                            </ul>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setRosterUpdateModalKind(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-[14px] transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={
                      rosterUpdateModalKind === 'mid'
                        ? handleApplyMidTermRosterUpdate
                        : rosterUpdateModalKind === 'formal'
                          ? handleApplyFormalRosterUpdate
                          : handleApplyPreRosterUpdate
                    }
                    className="px-4 py-2 bg-[#2f54eb] text-white rounded-lg text-[14px] hover:bg-[#1d39c4] transition-colors shadow-sm"
                  >
                    确认执行
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col relative z-10">
            {(activeTab === '考核对象' || [0, 1, 2].includes(currentStep)) ? (
              <>
                <div className="px-6 py-3 border-b flex items-center justify-between bg-white relative z-40 backdrop-blur-sm bg-white/80">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="搜索部门编码/名称/负责人/HRBP" 
                        defaultValue={searchTerm}
                        onBlur={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setSearchTerm(e.currentTarget.value);
                          }
                        }}
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded text-[13px] outline-none focus:border-[#2f54eb] min-w-[320px] transition-all bg-white"
                      />
                    </div>
                    <div className="relative">
                      <div 
                        onClick={() => setActiveFilterColumn(activeFilterColumn === 'orgType' ? null : 'orgType')}
                        className={`flex items-center gap-2 px-3 py-2 border rounded text-[13px] cursor-pointer transition-all ${
                          columnFilters.orgType.length > 0 ? 'border-[#2f54eb] text-[#2f54eb] bg-blue-50/30' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span>组织类型</span>
                        {columnFilters.orgType.length > 0 && (
                          <span className="bg-[#2f54eb] text-white text-[10px] min-w-4 h-4 px-1 flex items-center justify-center rounded-full">
                            {columnFilters.orgType.length}
                          </span>
                        )}
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${activeFilterColumn === 'orgType' ? 'rotate-180' : ''}`} />
                      </div>
                      
                      {activeFilterColumn === 'orgType' && (
                        <>
                          <div className="fixed inset-0 z-[10002]" onClick={() => setActiveFilterColumn(null)} />
                          <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-white border border-gray-100 rounded-lg shadow-xl z-[10003] py-2 animate-in fade-in zoom-in duration-100 origin-top-left">
                            <div className="px-3 py-1 mb-1 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                              <span className="text-[12px] font-bold text-gray-400">筛选 组织类型</span>
                              {columnFilters.orgType.length > 0 && !isActivityCompleted && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); clearColumnFilter('orgType'); }}
                                  className="text-[11px] text-[#2f54eb] hover:underline"
                                >
                                  重置
                                </button>
                              )}
                            </div>
                            <div className="max-h-[240px] overflow-y-auto px-1 custom-scrollbar">
                              {getUniqueValues('orgType').sort().map(opt => (
                                <div 
                                  key={opt}
                                  onClick={() => handleToggleColumnFilter('orgType', opt)}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-black/[0.02] cursor-pointer group rounded-md"
                                >
                                  <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center transition-all ${
                                    columnFilters.orgType.includes(opt) ? 'bg-[#2f54eb] border-[#2f54eb]' : 'bg-white border-gray-300 group-hover:border-gray-400'
                                  }`}>
                                    {columnFilters.orgType.includes(opt) && <Check size={10} className="text-white" />}
                                  </div>
                                  <span className={`text-[13px] ${columnFilters.orgType.includes(opt) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                    {opt}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {!isActivityCompleted && (
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setColumnFilters({
                          path: [],
                          orgType: [],
                          level: [],
                          status: [],
                          node: [],
                          approver: [],
                          leader: [],
                          exec: [],
                          hrbp: [],
                        });
                      }}
                      className="px-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      重置
                    </button>
                    )}
                  </div>

                  {/* Action Buttons Area */}
                  {!isActivityCompleted && (
                  <div className="flex items-center gap-2">
                    {currentStep >= 1 ? (
                      <button 
                        type="button"
                        disabled={isPreAssessmentPrimaryActionsLocked}
                        onClick={() => {
                          if (isPreAssessmentPrimaryActionsLocked) return;
                          if (currentStep === 2 && activeMonitoringTab === 'pre') {
                            openPreRosterUpdateModal();
                            return;
                          }
                          if (currentStep === 2 && activeMonitoringTab === 'formal') {
                            openFormalRosterUpdateModal();
                            return;
                          }
                          if (currentStep === 1) {
                            openMidTermRosterUpdateModal();
                            return;
                          }
                          showToast('当前阶段请通过对应轮次入口更新名单', 'warning');
                        }}
                        title={isPreAssessmentPrimaryActionsLocked ? '当前预考核轮次已跳过，不可再更新名单' : undefined}
                        className={`flex items-center gap-2 text-[13px] px-3 py-1.5 rounded transition-colors font-medium border bg-white ${
                          isPreAssessmentPrimaryActionsLocked
                            ? 'text-gray-300 border-gray-100 cursor-not-allowed'
                            : 'text-[#2f54eb] border-[#2f54eb] hover:bg-blue-50 cursor-pointer'
                        }`}
                      >
                        <Settings size={14} />
                        <span>更新名单</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          setIsSubjectsGenerated(true);
                          showToast('考核对象生成成功', 'success');
                        }}
                        disabled={isPlanStarted}
                        className={`px-4 py-1.5 border border-gray-200 rounded text-[13px] transition-all bg-white ${
                          isPlanStarted 
                            ? 'text-gray-300 cursor-not-allowed border-gray-100' 
                            : 'text-gray-600 hover:bg-gray-50 hover:border-gray-300 cursor-pointer'
                        }`}
                      >
                        生成考核对象
                      </button>
                    )}
                    <button 
                      type="button"
                      disabled={isPreAssessmentPrimaryActionsLocked}
                      onClick={() => {
                        if (isPreAssessmentPrimaryActionsLocked) return;
                        handleStartPlan();
                      }}
                      title={isPreAssessmentPrimaryActionsLocked ? '当前预考核轮次已跳过，不可再启动' : undefined}
                      className={`px-4 py-1.5 rounded text-[13px] shadow-sm ${
                        isPreAssessmentPrimaryActionsLocked
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-[#2f54eb] text-white hover:bg-blue-600 cursor-pointer'
                      }`}
                    >
                      {currentStep === 1 ? '启动中期回顾' : currentStep === 2 ? '启动组织绩效考核' : '启动计划制定'}
                    </button>
                    {currentStep === 2 && activeMonitoringTab === 'pre' && (
                      <button
                        type="button"
                        disabled={isPreAssessmentPrimaryActionsLocked}
                        onClick={() => {
                          if (isPreAssessmentPrimaryActionsLocked) return;
                          handlePreAssessmentArchiveAndNextRound();
                        }}
                        title={isPreAssessmentPrimaryActionsLocked ? '当前预考核轮次已跳过，不可再归档' : undefined}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded text-[13px] shadow-sm ${
                          isPreAssessmentPrimaryActionsLocked
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-[#2f54eb] text-white hover:bg-blue-600 cursor-pointer'
                        }`}
                      >
                        <FileCheck size={14} />
                        <span>归档并进入下一轮次</span>
                      </button>
                    )}
                    {currentStep === 2 && activeMonitoringTab === 'pre' && (
                      <button
                        type="button"
                        disabled={preAssessmentPrimaryActionsLocked}
                        onClick={() => {
                          if (preAssessmentPrimaryActionsLocked) return;
                          setIsSkipPreAssessmentConfirmOpen(true);
                        }}
                        title={
                          preAssessmentPrimaryActionsLocked
                            ? '当前预考核轮次已跳过'
                            : '结束组织绩效预考核轮次，将当前名单与数据推送至组织绩效正式考核'
                        }
                        className={`px-4 py-1.5 border rounded text-[13px] ${
                          preAssessmentPrimaryActionsLocked
                            ? 'border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed'
                            : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        跳过
                      </button>
                    )}
                    {(currentStep !== 1 || isLastMidTermRoundTab) && !(currentStep === 2 && activeMonitoringTab === 'pre') && (
                    <button 
                      type="button"
                      onClick={() => {
                        if (currentStep === 1) {
                          performMidTermArchiveEnterAppraisal();
                          return;
                        }
                        handleArchive();
                      }}
                      title={
                        currentStep === 1
                          ? '在最后一轮中期回顾归档后进入组织绩效考核，默认打开组织绩效预考核轮次'
                          : undefined
                      }
                      className="px-4 py-1.5 bg-[#2f54eb] text-white rounded text-[13px] hover:bg-blue-600 transition-all cursor-pointer shadow-sm"
                    >
                      {currentStep === 2 ? '归档并完成' : '归档并进入下一步'}
                    </button>
                    )}
                    
                    {/* 组织绩效中期回顾：不使用「更多」，将「归档并进入下一轮次」平铺（单轮不展示「跳过此阶段」） */}
                    {currentStep === 1 && showMidTermArchiveNextRoundInMore && (
                      <button
                        type="button"
                        onClick={handleMidTermArchiveAndNextRound}
                        className="flex items-center gap-2 px-4 py-1.5 bg-[#2f54eb] text-white rounded text-[13px] hover:bg-blue-600 transition-all cursor-pointer shadow-sm"
                      >
                        <FileCheck size={14} />
                        <span>归档并进入下一轮次</span>
                      </button>
                    )}
                    {currentStep === 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedIds.length === 0) {
                            showToast('请至少选择一条数据', 'warning');
                            return;
                          }
                          const subjects = assessmentData.filter((r) => selectedIds.includes(r.id));
                          const aid = activity?.id;
                          if (aid == null || aid === '') {
                            showToast('无法识别当前活动，请从活动列表重新进入', 'error');
                            return;
                          }
                          const aidStr = String(aid);
                          const existing = planChangeSubjectsByActivityId[aidStr] ?? [];
                          const inProgressIds = new Set(
                            existing.filter((r: any) => r?.status === '进行中').map((r: any) => r.id)
                          );
                          const blocked = subjects.filter((s) => inProgressIds.has(s.id));
                          if (blocked.length > 0) {
                            showToast(
                              '所选考核对象中存在「进行中」的变更申请，无法重复发起；待该申请变为「已完成」后可再次发起。请调整勾选后重试',
                              'warning'
                            );
                            return;
                          }
                          onInitiatePlanChange?.(aidStr, subjects);
                          showToast('已发起绩效计划变更申请，可在「组织绩效考核流程监控 / 组织绩效计划变更监控」中查看', 'success');
                        }}
                        title="同一考核对象可多次发起：存在「进行中」变更时不可再发起；上一申请为「已完成」后可再次发起"
                        className="px-4 py-1.5 border border-amber-200 text-amber-800 rounded text-[13px] bg-amber-50/80 hover:bg-amber-50 transition-all cursor-pointer shrink-0 font-medium"
                      >
                        绩效计划变更
                      </button>
                    )}

                    {/* 仅计划制定阶段保留「更多」下拉 */}
                    {currentStep === 0 && (
                    <div className="relative">
                      <button 
                        onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                        className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer bg-white"
                      >
                        <span>更多</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isMoreMenuOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsMoreMenuOpen(false)}
                          />
                          <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-2 animate-in fade-in zoom-in duration-100 origin-bottom-right">
                            {([
                              { label: '添加考核对象', icon: <Plus size={14} />, disabled: isPlanStarted },
                              { label: '删除考核对象', icon: <Trash2 size={14} />, disabled: isPlanStarted },
                              { label: '导入', icon: <FileUp size={14} /> },
                              { label: '导出', icon: <FileDown size={14} /> },
                            ] as any).map((item: any) => {
                              const isDeleteRow = item.label === '删除考核对象';
                              const rowInactive = item.disabled;
                              return (
                              <button 
                                key={item.label}
                                type="button"
                                disabled={item.disabled}
                                onClick={() => {
                                  if (item.disabled) return;
                                  if (isDeleteRow) {
                                    if (selectedIds.length === 0) {
                                      showToast('请至少选择一条数据', 'warning');
                                      return;
                                    }
                                    const archivedCount = assessmentData.filter(
                                      (r) => selectedIds.includes(r.id) && r.status === '已完成'
                                    ).length;
                                    if (archivedCount > 0) {
                                      showToast('已归档的数据，不能再执行删除考核对象操作', 'error');
                                      return;
                                    }
                                    setIsDeleteConfirmOpen(true);
                                    setIsMoreMenuOpen(false);
                                    return;
                                  }
                                  if (item.onClick) {
                                    item.onClick();
                                  }
                                  setIsMoreMenuOpen(false);
                                }}
                                className={`group w-full text-left px-4 py-2 text-[13px] flex items-center gap-3 transition-colors ${
                                  rowInactive
                                    ? 'text-gray-300 cursor-not-allowed bg-white'
                                    : isDeleteRow
                                      ? 'text-red-500 hover:text-red-600 hover:bg-red-50/50 cursor-pointer'
                                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#2f54eb] cursor-pointer'
                                }`}
                              >
                                <span className={
                                  rowInactive
                                    ? 'text-gray-200'
                                    : isDeleteRow
                                      ? 'text-red-400'
                                      : 'text-gray-400 group-hover:text-[#2f54eb]'
                                }>
                                  {item.icon}
                                </span>
                                {item.label}
                              </button>
                            );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                    )}
                  </div>
                  )}
                </div>

                <div className="overflow-x-auto relative custom-scrollbar">
                  <table
                    className={`w-full text-left border-collapse table-fixed ${
                      isOrgAppraisalStage ? 'min-w-[1280px]' : 'min-w-[1000px]'
                    }`}
                  >
                    <thead>
                      <tr className="bg-gray-50/50 text-[12px] text-gray-400 uppercase tracking-wider font-semibold">
                        {!isActivityCompleted && (
                        <th className="px-4 py-4 border-b w-12 text-center sticky left-0 bg-gray-50/50 z-20">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.length === assessmentData.length && assessmentData.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded border-gray-300 text-[#2f54eb] focus:ring-[#2f54eb]" 
                          />
                        </th>
                        )}
                        <th className="px-6 py-4 border-b w-[120px]">部门编码</th>
                        <th className="px-6 py-4 border-b w-[240px]">
                          <div className="flex items-center gap-1">
                            部门名称
                          </div>
                        </th>
                        <th className="px-6 py-4 border-b w-[140px]">
                          <div className="flex items-center gap-1">
                            组织类型
                          </div>
                        </th>
                        <th className="px-6 py-4 border-b w-[120px]">
                          <div className="flex items-center gap-1">
                            组织层级
                          </div>
                        </th>
                        <th className="px-6 py-4 border-b w-[150px]">
                          <div className="flex items-center gap-1">
                            组织负责人
                          </div>
                        </th>
                        <th className="px-6 py-4 border-b w-[180px]">
                          <div className="flex items-center gap-1">
                            分管执委/分管常委
                          </div>
                        </th>
                        <th className="px-6 py-4 border-b w-[150px]">
                          <div className="flex items-center gap-1">
                            主HRBP
                          </div>
                        </th>
                        <th className="px-6 py-4 border-b w-[120px] text-center">
                          <div className="flex items-center justify-center gap-1">
                            状态
                          </div>
                        </th>
                        {isOrgAppraisalStage && (
                          <>
                            <th className="px-6 py-4 border-b w-[100px] text-center whitespace-nowrap">计算总分</th>
                            <th className="px-6 py-4 border-b w-[90px] text-center whitespace-nowrap">计算等级</th>
                            <th className="px-6 py-4 border-b w-[100px] text-center whitespace-nowrap">调整等级</th>
                          </>
                        )}
                        {!isActivityCompleted && (
                        <th className="px-6 py-4 border-b w-[100px] text-center sticky right-0 bg-white shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.1)] z-20">
                          操作
                        </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-[13px]">
                      {filteredData.map((item) => (
                        <tr key={`obj-${item.id}`} className="hover:bg-gray-50/80 transition-colors group">
                          {!isActivityCompleted && (
                          <td className="px-4 py-4 text-center sticky left-0 bg-white group-hover:bg-gray-50/80 z-10">
                            <input 
                              type="checkbox" 
                              checked={selectedIds.includes(item.id)}
                              onChange={() => handleToggleSelect(item.id)}
                              className="w-4 h-4 rounded border-gray-300 text-[#2f54eb] focus:ring-[#2f54eb]" 
                            />
                          </td>
                          )}
                          <td className="px-6 py-4 font-mono text-gray-500 whitespace-nowrap">{item.code}</td>
                          <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis" title={item.path.replace('集团总部/', '')}>{item.path.replace('集团总部/', '')}</td>
                          <td className="px-6 py-4 font-medium text-gray-600 whitespace-nowrap">{item.orgType}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {item.level}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {item.leader}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {item.exec}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {item.hrbp}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusStyle(item.status, item.isTimeout)}`}>
                              <div className={`w-1 h-1 rounded-full ${getStatusDot(item.status, item.isTimeout)}`} />
                              {getStatusText(item)}
                            </span>
                          </td>
                          {isOrgAppraisalStage && (() => {
                            const scoreView = getAppraisalScoreView(item);
                            const canAdjust = scoreView.hasResult && !isActivityCompleted;
                            return (
                              <>
                                <td className="px-6 py-4 text-center text-gray-700 whitespace-nowrap tabular-nums">
                                  {scoreView.totalScore}
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                  <span className="font-semibold text-gray-800">{scoreView.calculatedGrade}</span>
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                  {scoreView.hasResult ? (
                                    canAdjust ? (
                                      <button
                                        type="button"
                                        onClick={() => openGradeAdjustModal(item)}
                                        title={
                                          scoreView.adjustment?.adjustReason
                                            ? `调整原因：${scoreView.adjustment.adjustReason}`
                                            : '点击调整等级'
                                        }
                                        className={`font-semibold cursor-pointer hover:underline ${
                                          scoreView.adjustment ? 'text-amber-700' : 'text-[#2f54eb]'
                                        }`}
                                      >
                                        {scoreView.adjustedGrade}
                                      </button>
                                    ) : (
                                      <span
                                        className="font-semibold text-gray-800"
                                        title={
                                          scoreView.adjustment?.adjustReason
                                            ? `调整原因：${scoreView.adjustment.adjustReason}`
                                            : undefined
                                        }
                                      >
                                        {scoreView.adjustedGrade}
                                      </span>
                                    )
                                  ) : (
                                    <span className="text-gray-300">—</span>
                                  )}
                                </td>
                              </>
                            );
                          })()}
                          {!isActivityCompleted && (
                          <td className="px-6 py-4 text-center sticky right-0 bg-white group-hover:bg-gray-50/80 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.1)] z-10">
                            {item.status !== '未开始' && (
                              <button className="text-[#2f54eb] hover:underline font-medium cursor-pointer whitespace-nowrap">查看表单</button>
                            )}
                          </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pager Area in Footer */}
                {!isActivityCompleted && (
                <div className="px-6 py-3 border-t flex items-center justify-end bg-gray-50/30">
                  <div className="flex items-center gap-4 text-[13px] text-gray-500">
                    <div className="flex items-center gap-2 border border-gray-200 px-2 py-1 rounded hover:border-gray-300 transition-colors cursor-pointer bg-white group">
                      <span>10 条/页</span>
                      <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
                    </div>
                    <span className="text-gray-400 ml-1">共 {assessmentData.length} 条</span>
                    <div className="flex items-center gap-2 ml-2">
                      <button className="p-1 hover:bg-gray-200 rounded text-gray-300 cursor-not-allowed transition-colors">
                        <ChevronLeft size={18} />
                      </button>
                      <div className="flex items-center gap-1">
                        <span className="w-6 h-6 flex items-center justify-center bg-[#2f54eb] text-white rounded text-[12px] font-medium">1</span>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded text-gray-600 cursor-pointer transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                )}
              </>
            ) : (
              /* Assessment Monitoring View */
              <div className="flex flex-col h-full bg-[#f8f9fa]">
                {/* Stats Cards Row - Optimized for space */}
                <div className="grid grid-cols-4 gap-3 p-3 shrink-0">
                  <div className="bg-white px-4 py-3 rounded border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="text-[12px] text-gray-400 mb-0.5">考核对象数</div>
                      <div className="text-[20px] font-bold text-gray-900 leading-tight">{assessmentData.length}</div>
                    </div>
                    <div className="text-[11px] text-gray-300 text-right max-w-[80px]">当前考核数</div>
                  </div>
                  <div className="bg-white px-4 py-3 rounded border border-gray-100 shadow-sm border-l-4 border-l-green-400 flex items-center justify-between">
                    <div>
                      <div className="text-[12px] text-gray-400 mb-0.5">已完成</div>
                      <div className="text-[20px] font-bold text-green-500 leading-tight">
                        {assessmentData.filter(i => i.status === '已完成').length}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[12px] font-bold text-green-500">
                        {Math.round((assessmentData.filter(i => i.status === '已完成').length / assessmentData.length) * 100)}%
                      </div>
                      <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-green-400" style={{ width: `${(assessmentData.filter(i => i.status === '已完成').length / assessmentData.length) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white px-4 py-3 rounded border border-gray-100 shadow-sm border-l-4 border-l-blue-400 flex items-center justify-between">
                    <div>
                      <div className="text-[12px] text-gray-400 mb-0.5">进行中</div>
                      <div className="text-[20px] font-bold text-blue-500 leading-tight">
                        {assessmentData.filter(i => i.status === '进行中').length}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[12px] font-bold text-blue-500">
                        {Math.round((assessmentData.filter(i => i.status === '进行中').length / assessmentData.length) * 100)}%
                      </div>
                      <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-blue-400" style={{ width: `${(assessmentData.filter(i => i.status === '进行中').length / assessmentData.length) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white px-4 py-3 rounded border border-gray-100 shadow-sm border-l-4 border-l-red-400 flex items-center justify-between">
                    <div>
                      <div className="text-[12px] text-gray-400 mb-0.5">未开始</div>
                      <div className="text-[20px] font-bold text-red-500 leading-tight">
                        {assessmentData.filter(i => i.status === '未开始').length}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-red-400 font-medium">存在超时节点</div>
                      <div className="w-16 h-1 bg-red-50 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-red-400" style={{ width: `${(assessmentData.filter(i => i.status === '进行中' && i.isTimeout).length / assessmentData.length) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter & Actions Bar */}
                <div className="px-4 py-2 border-t border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="搜索部门编码/名称/负责人/HRBP" 
                        defaultValue={searchTerm}
                        onBlur={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setSearchTerm(e.currentTarget.value);
                          }
                        }}
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded text-[13px] outline-none focus:border-[#2f54eb] min-w-[320px] transition-all bg-white"
                      />
                    </div>
                    
                    <div className="relative">
                      <div 
                        onClick={() => setActiveFilterColumn(activeFilterColumn === 'orgType' ? null : 'orgType')}
                        className={`flex items-center gap-2 px-3 py-2 border rounded text-[13px] cursor-pointer transition-all ${
                          columnFilters.orgType.length > 0 ? 'border-[#2f54eb] text-[#2f54eb] bg-blue-50/30' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span>组织类型</span>
                        {columnFilters.orgType.length > 0 && (
                          <span className="bg-[#2f54eb] text-white text-[10px] min-w-4 h-4 px-1 flex items-center justify-center rounded-full">
                            {columnFilters.orgType.length}
                          </span>
                        )}
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${activeFilterColumn === 'orgType' ? 'rotate-180' : ''}`} />
                      </div>
                      
                      {activeFilterColumn === 'orgType' && (
                        <>
                          <div className="fixed inset-0 z-[10002]" onClick={() => setActiveFilterColumn(null)} />
                          <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-white border border-gray-100 rounded-lg shadow-xl z-[10003] py-2 animate-in fade-in zoom-in duration-100 origin-top-left">
                            <div className="px-3 py-1 mb-1 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                              <span className="text-[12px] font-bold text-gray-400">筛选 组织类型</span>
                              {columnFilters.orgType.length > 0 && !isActivityCompleted && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); clearColumnFilter('orgType'); }}
                                  className="text-[11px] text-[#2f54eb] hover:underline"
                                >
                                  重置
                                </button>
                              )}
                            </div>
                            <div className="max-h-[240px] overflow-y-auto px-1 custom-scrollbar">
                              {getUniqueValues('orgType').sort().map(opt => (
                                <div 
                                  key={opt}
                                  onClick={() => handleToggleColumnFilter('orgType', opt)}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-black/[0.02] cursor-pointer group rounded-md"
                                >
                                  <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center transition-all ${
                                    columnFilters.orgType.includes(opt) ? 'bg-[#2f54eb] border-[#2f54eb]' : 'bg-white border-gray-300 group-hover:border-gray-400'
                                  }`}>
                                    {columnFilters.orgType.includes(opt) && <Check size={10} className="text-white" />}
                                  </div>
                                  <span className={`text-[13px] ${columnFilters.orgType.includes(opt) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                    {opt}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {!isActivityCompleted && (
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setColumnFilters({
                          path: [],
                          orgType: [],
                          level: [],
                          status: [],
                          node: [],
                          approver: [],
                          leader: [],
                          exec: [],
                          hrbp: [],
                        });
                      }}
                      className="px-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      重置
                    </button>
                    )}
                  </div>
                  
                  {!isActivityCompleted && (
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-[#faad14] text-white rounded text-[13px] hover:bg-[#d48806] transition-all cursor-pointer shadow-sm font-medium">
                      <Bell size={14} />
                      <span>发送提醒</span>
                    </button>
                    
                    {/* Export Dropdown */}
                    <div className="relative">
                      <button 
                        onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                        className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-all cursor-pointer bg-white"
                      >
                        <FileDown size={14} />
                        <span>导出</span>
                      </button>
                      
                      {isExportMenuOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsExportMenuOpen(false)}
                          />
                          <div className="absolute left-0 mt-2 w-36 bg-white border border-gray-100 rounded shadow-xl z-50 py-1 animate-in fade-in zoom-in duration-100 origin-top-left">
                            <button className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-blue-50 hover:text-[#2f54eb] transition-colors cursor-pointer">
                              导出明细
                            </button>
                            <button className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-blue-50 hover:text-[#2f54eb] transition-colors cursor-pointer">
                              导出表单
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  )}
                </div>

                {/* Tables Grid */}
                <div className="flex-1 overflow-auto bg-white custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[1240px] table-fixed">
                    <thead className="sticky top-0 bg-[#f8f9fa] text-[13px] text-gray-500 border-b border-gray-200 z-30 font-medium">
                      <tr>
                        {!isActivityCompleted && (
                        <th className="px-4 py-4 w-12 text-center sticky left-0 bg-[#f8f9fa] z-40">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.length === assessmentData.length && assessmentData.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded border-gray-300 text-[#2f54eb] focus:ring-[#2f54eb]" 
                          />
                        </th>
                        )}
                        <th className="px-4 py-4 font-semibold w-[100px]">部门编码</th>
                        <th className="px-4 py-4 font-semibold w-[220px]">
                          <div className="flex items-center gap-1">
                            部门名称
                          </div>
                        </th>
                        <th className="px-4 py-4 font-semibold w-[120px]">
                          <div className="flex items-center gap-1">
                            组织类型
                          </div>
                        </th>
                        <th className="px-4 py-4 font-semibold w-[100px]">
                          <div className="flex items-center gap-1">
                            组织层级
                          </div>
                        </th>
                        <th className="px-4 py-4 font-semibold w-[140px]">
                          <div className="flex items-center gap-1">
                            当前办理节点
                          </div>
                        </th>
                        <th className="px-4 py-4 font-semibold w-[150px]">
                          <div className="flex items-center gap-1">
                            当前办理人
                          </div>
                        </th>
                        <th className="px-4 py-4 font-semibold text-center w-[120px]">
                          <div className="flex items-center justify-center gap-1">
                            状态
                          </div>
                        </th>
                        {!isActivityCompleted && (
                        <th className="px-4 py-4 font-semibold text-left pl-6 w-[280px] sticky right-0 bg-[#f8f9fa] shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)] z-40">
                          操作
                        </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[13px]">
                      {filteredData.map((item, idx) => (
                        <tr key={`mon-${item.code}`} className="hover:bg-blue-50/30 transition-colors group">
                          {!isActivityCompleted && (
                          <td className="px-4 py-4 text-center sticky left-0 bg-white group-hover:bg-blue-50/30 z-20 transition-colors">
                            <input 
                              type="checkbox" 
                              checked={selectedIds.includes(item.id)}
                              onChange={() => handleToggleSelect(item.id)}
                              className="w-4 h-4 rounded border-gray-300 text-[#2f54eb] focus:ring-[#2f54eb]" 
                            />
                          </td>
                          )}
                          <td className="px-4 py-4 font-mono text-gray-500 whitespace-nowrap">{item.code}</td>
                          <td className="px-4 py-4 font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis" title={item.path.replace('集团总部/', '')}>{item.path.replace('集团总部/', '')}</td>
                          <td className="px-4 py-4 font-medium text-gray-600 whitespace-nowrap">{item.orgType}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                            {item.level}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                            {item.status !== '未开始' && item.node !== '-' && (
                              <span className="px-2 py-0.5 bg-blue-50 text-[#2f54eb] border border-blue-100 rounded text-[11px] font-medium whitespace-nowrap">{item.node}</span>
                            )}
                            {(item.status === '未开始' || item.node === '-') && <span className="text-gray-300">--</span>}
                          </td>
                          <td className="px-4 py-4 text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis" title={item.approver}>
                            {item.status === '未开始' ? '--' : item.approver}
                          </td>
                          <td className="px-4 py-4 text-center whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusStyle(item.status, item.isTimeout)}`}>
                              <div className={`w-1 h-1 rounded-full ${getStatusDot(item.status, item.isTimeout)}`} />
                              {getStatusText(item)}
                            </span>
                          </td>
                          {!isActivityCompleted && (
                          <td className="px-4 py-4 text-left pl-6 whitespace-nowrap sticky right-0 bg-white group-hover:bg-blue-50/30 shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)] z-20 transition-colors">
                            {item.status === '进行中' ? (
                              <div className="flex items-center justify-start gap-3 translate-x-0">
                                <button 
                                  onClick={() => {
                                    setSelectedRow(withProcessInterventionPendingContext(item));
                                    setIsInterventionModalOpen(true);
                                  }}
                                  className="text-[#2f54eb] hover:text-blue-700 transition-colors cursor-pointer text-xs font-medium"
                                >
                                  流程干预
                                </button>
                                <button 
                                  onClick={() => { setSelectedRow(item); setIsApprovalChainModalOpen(true); }}
                                  className="text-[#2f54eb] hover:text-blue-700 transition-colors cursor-pointer text-xs font-medium"
                                >
                                  审批链
                                </button>
                                <button className="text-[#2f54eb] hover:text-blue-700 transition-colors cursor-pointer text-xs font-medium">查看表单</button>
                                <button className="text-[#2f54eb] hover:text-blue-700 transition-colors cursor-pointer text-xs font-medium">导出表单</button>
                              </div>
                            ) : item.status === '已完成' ? (
                              <div className="flex items-center justify-start gap-3 translate-x-0">
                                <button className="text-[#2f54eb] hover:text-blue-700 transition-colors cursor-pointer text-xs font-medium">查看表单</button>
                                <button className="text-[#2f54eb] hover:text-blue-700 transition-colors cursor-pointer text-xs font-medium">导出表单</button>
                              </div>
                            ) : null}
                          </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>


        <AnimatePresence>
          {isInterventionModalOpen && (
            <ProcessInterventionModal 
              isOpen={isInterventionModalOpen} 
              onClose={() => setIsInterventionModalOpen(false)} 
              data={selectedRow}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isApprovalChainModalOpen && (
            <ApprovalChainModal 
              isOpen={isApprovalChainModalOpen} 
              onClose={() => setIsApprovalChainModalOpen(false)} 
              data={selectedRow}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

type IndicatorDimItem = { id: string; name: string };

const DEFAULT_INDICATOR_DIMENSION_CATALOG: IndicatorDimItem[] = [
  { id: 'dim-def-1', name: '财务指标' },
  { id: 'dim-def-2', name: '运营指标' },
  { id: 'dim-def-3', name: '客户指标' },
  { id: 'dim-def-4', name: '组织发展指标' },
  { id: 'dim-def-5', name: '能力建设指标' },
];

const FIXED_INDICATOR_DEPT_ROWS = [
  { id: 'fixed-1', deptType: '经营单元' },
  { id: 'fixed-2', deptType: '职级部门' },
  { id: 'fixed-3', deptType: '能力中心' },
] as const;

function collectLegacyDimensionNamesFromRules(rules: any[] | undefined): string[] {
  const out: string[] = [];
  for (const r of rules || []) {
    for (const d of r.optionalDimensions || []) {
      const s = String(d || '').trim();
      if (s && !out.includes(s)) out.push(s);
    }
    for (const d of r.requiredDimensions || []) {
      const s = String(d || '').trim();
      if (s && !out.includes(s)) out.push(s);
    }
  }
  return out;
}

function buildIndicatorDimensionCatalog(data: any | null): IndicatorDimItem[] {
  if (data?.dimensionCatalog && Array.isArray(data.dimensionCatalog) && data.dimensionCatalog.length > 0) {
    return data.dimensionCatalog.map((d: any, i: number) => ({
      id: String(d.id || `dim-${i}`),
      name: String(d.name || '').trim() || `指标维度${i + 1}`,
    }));
  }
  const catalog = [...DEFAULT_INDICATOR_DIMENSION_CATALOG];
  for (const name of collectLegacyDimensionNamesFromRules(data?.rules)) {
    if (!catalog.some((c) => c.name === name)) {
      catalog.push({ id: `dim-legacy-${catalog.length}-${encodeURIComponent(name)}`, name });
    }
  }
  return catalog;
}

function legacyNamesToIds(names: string[] | undefined, catalog: IndicatorDimItem[]): string[] {
  return (names || [])
    .map((n) => catalog.find((c) => c.name === n)?.id)
    .filter((id): id is string => Boolean(id));
}

function mergeIndicatorFixedRules(data: any | null, catalog: IndicatorDimItem[]) {
  return FIXED_INDICATOR_DEPT_ROWS.map((template) => {
    const existing = data?.rules?.find((r: any) => r.deptType === template.deptType);
    let optionalIds: string[] =
      existing?.optionalDimensionIds?.length > 0
        ? [...existing.optionalDimensionIds]
        : legacyNamesToIds(existing?.optionalDimensions, catalog);
    let requiredIds: string[] =
      existing?.requiredDimensionIds?.length > 0
        ? [...existing.requiredDimensionIds]
        : legacyNamesToIds(existing?.requiredDimensions, catalog);
    requiredIds = requiredIds.filter((id) => optionalIds.includes(id));
    return {
      id: existing?.id || template.id,
      deptType: template.deptType,
      isFixed: true,
      optionalDimensionIds: optionalIds,
      requiredDimensionIds: requiredIds,
    };
  });
}

const IndicatorDimensionDrawer = ({ 
  isOpen, 
  onClose, 
  data, 
  onSave 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  data: any, 
  onSave: (newData: any) => void 
}) => {
  const [formData, setFormData] = useState<any>(() => ({
    name: '',
    description: '',
    dimensionCatalog: DEFAULT_INDICATOR_DIMENSION_CATALOG,
    rules: mergeIndicatorFixedRules(null, DEFAULT_INDICATOR_DIMENSION_CATALOG),
  }));
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const catalog = buildIndicatorDimensionCatalog(data);
    const rules = mergeIndicatorFixedRules(data, catalog);
    if (data) {
      setFormData({
        name: data.name || '',
        description: data.description || '',
        dimensionCatalog: catalog,
        rules,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        dimensionCatalog: catalog,
        rules: mergeIndicatorFixedRules(null, catalog),
      });
    }
    setSubmitError(null);
  }, [data, isOpen]);

  const idToName = (id: string) =>
    (formData.dimensionCatalog as IndicatorDimItem[] | undefined)?.find((d) => d.id === id)?.name || '';

  const serializeForSave = () => {
    const cat = (formData.dimensionCatalog || []) as IndicatorDimItem[];
    const rules = (formData.rules || []).map((r: any) => {
      const opt = (r.optionalDimensionIds || []) as string[];
      const req = ((r.requiredDimensionIds || []) as string[]).filter((id) => opt.includes(id));
      return {
        ...r,
        optionalDimensionIds: opt,
        requiredDimensionIds: req,
        optionalDimensions: opt.map(idToName).filter(Boolean),
        requiredDimensions: req.map(idToName).filter(Boolean),
      };
    });
    return {
      name: formData.name?.trim() || '',
      description: formData.description || '',
      dimensionCatalog: cat,
      rules,
    };
  };

  const handleConfirm = () => {
    setSubmitError(null);
    const cat = (formData.dimensionCatalog || []) as IndicatorDimItem[];
    if (!String(formData.name || '').trim()) {
      setSubmitError('请填写规则名称。');
      return;
    }
    if (cat.length === 0) {
      setSubmitError('请至少保留一个指标维度。');
      return;
    }
    if (cat.some((d) => !String(d.name || '').trim())) {
      setSubmitError('指标维度名称不能为空。');
      return;
    }
    const seenNames = new Set<string>();
    for (const d of cat) {
      const k = String(d.name).trim();
      if (seenNames.has(k)) {
        setSubmitError(`指标维度名称「${k}」重复。`);
        return;
      }
      seenNames.add(k);
    }
    for (const r of formData.rules || []) {
      if (!(r.optionalDimensionIds || []).length) {
        setSubmitError(`「${r.deptType}」请至少勾选一个可选指标维度。`);
        return;
      }
    }
    onSave(serializeForSave());
  };

  const toggleOptional = (ruleId: string, dimId: string) => {
    setSubmitError(null);
    setFormData((prev: any) => ({
      ...prev,
      rules: (prev.rules || []).map((r: any) => {
        if (r.id !== ruleId) return r;
        const opt = (r.optionalDimensionIds || []) as string[];
        const req = (r.requiredDimensionIds || []) as string[];
        if (opt.includes(dimId)) {
          return {
            ...r,
            optionalDimensionIds: opt.filter((x: string) => x !== dimId),
            requiredDimensionIds: req.filter((x: string) => x !== dimId),
          };
        }
        return { ...r, optionalDimensionIds: [...opt, dimId] };
      }),
    }));
  };

  const toggleRequired = (ruleId: string, dimId: string) => {
    setSubmitError(null);
    setFormData((prev: any) => ({
      ...prev,
      rules: (prev.rules || []).map((r: any) => {
        if (r.id !== ruleId) return r;
        const opt = (r.optionalDimensionIds || []) as string[];
        const req = (r.requiredDimensionIds || []) as string[];
        if (!opt.includes(dimId)) return r;
        if (req.includes(dimId)) {
          return { ...r, requiredDimensionIds: req.filter((x: string) => x !== dimId) };
        }
        return { ...r, requiredDimensionIds: [...req, dimId] };
      }),
    }));
  };

  const catalog = (formData.dimensionCatalog || []) as IndicatorDimItem[];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[800px] bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-[16px] font-bold text-gray-900">
                {data?._isDuplicate ? '复制考核指标维度规则' : data ? '编辑考核指标维度规则' : '新增考核指标维度规则'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32">
              <section className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div className="w-1 h-4 bg-[#2f54eb] rounded-full" />
                  <h3 className="text-[14px] font-bold text-gray-900">基本信息</h3>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[13px] text-gray-600 font-medium">规则名称 <span className="text-red-500">*</span></label>
                    <input 
                      type="text"
                      placeholder="请输入规则名称"
                      className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#2f54eb] transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] text-gray-600 font-medium">规则说明</label>
                  <textarea 
                    placeholder="请输入规则说明"
                    rows={4}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#2f54eb] transition-all resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-[#2f54eb] rounded-full" />
                    <h3 className="text-[14px] font-bold text-gray-900">考核指标维度</h3>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-[12px] font-bold text-gray-500 w-[180px]">部门类型</th>
                        <th className="px-6 py-4 text-[12px] font-bold text-gray-500">可选指标维度</th>
                        <th className="px-6 py-4 text-[12px] font-bold text-gray-500">必填指标维度</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {formData.rules.map((rule: any) => (
                        <tr key={rule.id} className="hover:bg-gray-50/30 transition-colors">
                          <td className="px-6 py-5 align-top">
                            <div className="w-full border border-gray-100 rounded px-3 py-1.5 text-[13px] bg-gray-50 text-gray-500 font-medium">
                              {rule.deptType}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-x-6 gap-y-3">
                              {catalog.map((dim) => (
                                <label
                                  key={dim.id}
                                  className="flex items-center gap-2 cursor-pointer group"
                                  onClick={() => toggleOptional(rule.id, dim.id)}
                                >
                                  <div
                                    className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                                      rule.optionalDimensionIds?.includes(dim.id)
                                        ? 'bg-[#2f54eb] border-[#2f54eb]'
                                        : 'border-gray-300 group-hover:border-gray-400 bg-white'
                                    }`}
                                  >
                                    {rule.optionalDimensionIds?.includes(dim.id) && (
                                      <Check size={12} className="text-white" />
                                    )}
                                  </div>
                                  <span className="text-[13px] text-gray-600 select-none group-hover:text-gray-900">
                                    {dim.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            {(rule.optionalDimensionIds || []).length === 0 ? (
                              <span className="text-[12px] text-gray-400">请先勾选左侧可选指标维度</span>
                            ) : (
                              <div className="flex flex-wrap gap-x-6 gap-y-3">
                                {(rule.optionalDimensionIds || []).map((dimId: string) => {
                                  const dim = catalog.find((d) => d.id === dimId);
                                  if (!dim) return null;
                                  return (
                                    <label
                                      key={dimId}
                                      className="flex items-center gap-2 cursor-pointer group"
                                      onClick={() => toggleRequired(rule.id, dimId)}
                                    >
                                      <div
                                        className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                                          rule.requiredDimensionIds?.includes(dimId)
                                            ? 'bg-[#2f54eb] border-[#2f54eb]'
                                            : 'border-gray-300 group-hover:border-gray-400 bg-white'
                                        }`}
                                      >
                                        {rule.requiredDimensionIds?.includes(dimId) && (
                                          <Check size={12} className="text-white" />
                                        )}
                                      </div>
                                      <span className="text-[13px] text-gray-600 select-none group-hover:text-gray-900">
                                        {dim.name}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex flex-col gap-3 z-20">
              {submitError && (
                <div className="text-[13px] text-red-600 leading-snug">{submitError}</div>
              )}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-10 py-2.5 bg-[#2f54eb] text-white rounded text-[14px] font-bold hover:bg-blue-600 transition-all shadow-sm cursor-pointer"
                >
                  确定
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-10 py-2.5 border border-gray-200 rounded text-[14px] text-gray-600 font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  取消
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

type ProcessInterventionHandlerApprovalStatus = 'approved' | 'pending';

/** 流程干预 · 更换办理人：节点与当前办理人（演示数据） */
const PROCESS_INTERVENTION_HANDLER_ROWS: {
  nodeName: string;
  handler: string;
  /** 当前待办节点下多名办理人时的个人审批状态 */
  approvalStatus?: ProcessInterventionHandlerApprovalStatus;
}[] = [
  { nodeName: '主HRBP', handler: '张三(001)' },
  { nodeName: '一级部门负责人', handler: '李四(002)' },
  { nodeName: '数据提供人', handler: '王五(003)', approvalStatus: 'approved' },
  { nodeName: '数据提供人', handler: '李红(004)', approvalStatus: 'pending' },
  { nodeName: '能力中心负责人', handler: '' },
  { nodeName: '分管执委/常委', handler: '' },
];

type ProcessInterventionHandlerRow = (typeof PROCESS_INTERVENTION_HANDLER_ROWS)[number] & {
  isFirstOfNode: boolean;
  nodeRowSpan: number;
};

/** 连续相同节点名称合并单元格：仅首行渲染节点名称并设置 rowSpan */
function buildProcessInterventionHandlerTableRows(
  rows: { nodeName: string; handler: string }[]
): ProcessInterventionHandlerRow[] {
  return rows.map((row, idx) => {
    const isFirstOfNode = idx === 0 || rows[idx - 1].nodeName !== row.nodeName;
    let nodeRowSpan = 1;
    if (isFirstOfNode) {
      let j = idx + 1;
      while (j < rows.length && rows[j].nodeName === row.nodeName) {
        nodeRowSpan += 1;
        j += 1;
      }
    }
    return { ...row, isFirstOfNode, nodeRowSpan };
  });
}

const PROCESS_INTERVENTION_HANDLER_TABLE_ROWS = buildProcessInterventionHandlerTableRows(
  PROCESS_INTERVENTION_HANDLER_ROWS
);

/** 流程干预 · 更换办理人：节点顺序（用于判断当前待办及是否可更换） */
const PROCESS_INTERVENTION_NODE_SEQUENCE = [
  '主HRBP',
  '一级部门负责人',
  '数据提供人',
  '能力中心负责人',
  '分管执委/常委',
] as const;

/** 流程刚启动且未到达时，不允许预更换办理人的节点 */
const INTERVENTION_NODES_NO_CHANGE_WHEN_UPCOMING = new Set(['数据提供人']);

const PROCESS_INTERVENTION_DEFAULT_PENDING_NODE: (typeof PROCESS_INTERVENTION_NODE_SEQUENCE)[number] =
  '数据提供人';

function resolveProcessInterventionPendingNode(data: any): (typeof PROCESS_INTERVENTION_NODE_SEQUENCE)[number] {
  const explicit = data?.interventionPendingNode;
  if (explicit && (PROCESS_INTERVENTION_NODE_SEQUENCE as readonly string[]).includes(explicit)) {
    return explicit;
  }
  const current = data?.currentNode ?? data?.node;
  if (current && (PROCESS_INTERVENTION_NODE_SEQUENCE as readonly string[]).includes(current)) {
    return current as (typeof PROCESS_INTERVENTION_NODE_SEQUENCE)[number];
  }
  return PROCESS_INTERVENTION_DEFAULT_PENDING_NODE;
}

function withProcessInterventionPendingContext(row: any) {
  if (!row) return row;
  const pending =
    row.interventionPendingNode &&
    (PROCESS_INTERVENTION_NODE_SEQUENCE as readonly string[]).includes(row.interventionPendingNode)
      ? row.interventionPendingNode
      : PROCESS_INTERVENTION_DEFAULT_PENDING_NODE;
  return {
    ...row,
    interventionPendingNode: pending,
    currentNode: pending,
  };
}

/** 流程干预标题下考核对象：取列表部门名称（去掉「集团总部/」前缀） */
function getProcessInterventionAssessmentObjectName(data: any): string {
  if (!data) return '—';
  if (typeof data.path === 'string' && data.path.trim()) {
    return data.path.replace(/^集团总部\//, '').trim() || data.path;
  }
  if (typeof data.dept === 'string' && data.dept.trim()) return data.dept.trim();
  return data.code || data.id || '—';
}

function getInterventionNodeStepStatus(
  nodeName: string,
  pendingNodeName: string
): 'completed' | 'current' | 'upcoming' {
  const pendingIdx = PROCESS_INTERVENTION_NODE_SEQUENCE.indexOf(
    pendingNodeName as (typeof PROCESS_INTERVENTION_NODE_SEQUENCE)[number]
  );
  const nodeIdx = PROCESS_INTERVENTION_NODE_SEQUENCE.indexOf(
    nodeName as (typeof PROCESS_INTERVENTION_NODE_SEQUENCE)[number]
  );
  if (pendingIdx < 0 || nodeIdx < 0) return 'upcoming';
  if (nodeIdx < pendingIdx) return 'completed';
  if (nodeIdx === pendingIdx) return 'current';
  return 'upcoming';
}

function groupProcessInterventionHandlersByNode() {
  return PROCESS_INTERVENTION_NODE_SEQUENCE.map((nodeName) => ({
    nodeName,
    handlers: PROCESS_INTERVENTION_HANDLER_ROWS.filter((r) => r.nodeName === nodeName),
  }));
}

function hasInterventionHandler(handler?: string): boolean {
  const value = (handler ?? '').trim();
  return (
    value.length > 0 &&
    value !== '-' &&
    value !== '—' &&
    value !== '--' &&
    value !== '待配置' &&
    value !== '未配置'
  );
}

function formatInterventionHandlerDisplay(handler?: string): string {
  return hasInterventionHandler(handler) ? (handler as string).trim() : '—';
}

function canChangeInterventionHandler(
  stepStatus: 'completed' | 'current' | 'upcoming',
  handlerRow: (typeof PROCESS_INTERVENTION_HANDLER_ROWS)[number]
): boolean {
  if (stepStatus === 'completed') return false;
  if (!hasInterventionHandler(handlerRow.handler)) return false;
  if (handlerRow.approvalStatus === 'approved') return false;
  if (
    stepStatus === 'upcoming' &&
    INTERVENTION_NODES_NO_CHANGE_WHEN_UPCOMING.has(handlerRow.nodeName)
  ) {
    return false;
  }
  if (stepStatus === 'upcoming') return true;
  return true;
}

function renderInterventionHandlerApprovalBadge(
  stepStatus: 'completed' | 'current' | 'upcoming',
  handlerRow: (typeof PROCESS_INTERVENTION_HANDLER_ROWS)[number]
) {
  if (stepStatus !== 'current') {
    return <span className="text-gray-300">—</span>;
  }
  if (handlerRow.approvalStatus === 'approved') {
    return (
      <span className="inline-flex w-fit items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-700 border border-green-100">
        已通过
      </span>
    );
  }
  return (
    <span className="inline-flex w-fit items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-orange-700 border border-orange-100">
      待处理
    </span>
  );
}

function renderInterventionNodeStatusBadge(status: 'completed' | 'current' | 'upcoming') {
  if (status === 'current') {
    return (
      <span className="inline-flex w-fit items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#2f54eb] text-white">
        当前待办
      </span>
    );
  }
  if (status === 'completed') {
    return (
      <span className="inline-flex w-fit items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500">
        已完成
      </span>
    );
  }
  return (
    <span className="inline-flex w-fit items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500">
      未到达
    </span>
  );
}

/** 流程干预 · 流程退回：按节点序号选择退回目标 */
const PROCESS_INTERVENTION_RETURN_NODES: { order: number; label: string }[] = [
  { order: 10, label: '数据提交人、主HRBP两个节点' },
  { order: 20, label: '一级部门负责人' },
];

const ProcessInterventionModal = ({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data: any }) => {
  const [activeTab, setActiveTab] = useState('更换办理人');
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<number | null>(null);
  const [returnNodeError, setReturnNodeError] = useState('');
  const tabs = ['更换办理人', '流程退回'];

  useEffect(() => {
    if (isOpen) {
      setActiveTab('更换办理人');
      setSelectedReturnOrder(null);
      setReturnNodeError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeTab === '流程退回') {
      setSelectedReturnOrder(null);
      setReturnNodeError('');
    }
  }, [activeTab]);

  const handleConfirm = () => {
    if (activeTab === '流程退回' && selectedReturnOrder === null) {
      setReturnNodeError('请选择退回节点');
      return;
    }
    onClose();
  };

  const handleInterventionTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const pendingNodeName = useMemo(
    () => resolveProcessInterventionPendingNode(data),
    [data?.interventionPendingNode, data?.currentNode, data?.id]
  );

  const renderHandlerChangeTable = (actionColumnLabel: string) => (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-[12px] text-gray-600 bg-blue-50/60 border border-blue-100 rounded-lg px-3 py-2">
        <span className="text-gray-500">当前待办节点</span>
        <span className="font-semibold text-[#2f54eb]">{pendingNodeName}</span>
        <span className="text-gray-400">· 已完成节点、已通过办理人不可更换</span>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#fafafa] text-gray-500 border-b border-gray-200">
              <th className="py-3 px-4 font-medium text-left w-[26%] border-r border-gray-100">
                节点名称
              </th>
              <th className="py-3 px-4 font-medium text-left w-[24%] border-r border-gray-100">
                当前办理人
              </th>
              <th className="py-3 px-4 font-medium text-left w-[18%] border-r border-gray-100">
                审批状态
              </th>
              <th className="py-3 px-4 font-medium text-left w-[32%]">{actionColumnLabel}</th>
            </tr>
          </thead>
          <tbody>
            {groupProcessInterventionHandlersByNode().map((nodeGroup) => {
              const stepStatus = getInterventionNodeStepStatus(nodeGroup.nodeName, pendingNodeName);
              const isCurrentStep = stepStatus === 'current';
              const rowSpan = nodeGroup.handlers.length;

              return nodeGroup.handlers.map((handlerRow, handlerIdx) => {
                const canChange = canChangeInterventionHandler(stepStatus, handlerRow);
                return (
                  <tr
                    key={`${nodeGroup.nodeName}-${handlerRow.handler}-${handlerIdx}`}
                    className={`border-b border-gray-100 last:border-b-0 ${
                      isCurrentStep ? 'bg-blue-50/35' : 'bg-white'
                    }`}
                  >
                    {handlerIdx === 0 && (
                      <td
                        rowSpan={rowSpan}
                        className={`py-3 px-4 align-top border-r border-gray-100 ${
                          isCurrentStep ? 'bg-blue-50/50' : 'bg-white'
                        }`}
                      >
                        <div className="flex flex-col gap-1.5">
                          <span className="font-medium text-gray-900">{nodeGroup.nodeName}</span>
                          {renderInterventionNodeStatusBadge(stepStatus)}
                        </div>
                      </td>
                    )}
                    <td
                      className={`py-3 px-4 border-r border-gray-100 ${
                        isCurrentStep ? 'text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      {formatInterventionHandlerDisplay(handlerRow.handler)}
                    </td>
                    <td className="py-3 px-4 border-r border-gray-100">
                      {renderInterventionHandlerApprovalBadge(stepStatus, handlerRow)}
                    </td>
                    <td className="py-3 px-4">
                      {canChange ? (
                        <button
                          type="button"
                          className="text-[#2f54eb] hover:underline cursor-pointer font-medium"
                        >
                          + 选择人员
                        </button>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case '更换办理人':
        return renderHandlerChangeTable('更换为');
      case '添加办理人':
        return renderHandlerChangeTable('添加人');
      case '移除办理人':
        return (
          <div className="p-6">
            <table className="w-full border border-gray-100 rounded overflow-hidden">
              <thead>
                <tr className="bg-gray-50 text-[13px] text-gray-500 border-b border-gray-100">
                  <th className="py-2.5 px-4 font-medium text-left">节点名称</th>
                  <th className="py-2.5 px-4 font-medium text-left">当前办理人</th>
                  <th className="py-2.5 px-4 font-medium text-left">操作</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {PROCESS_INTERVENTION_HANDLER_TABLE_ROWS.map((row, idx) => (
                  <tr
                    key={`remove-${row.nodeName}-${row.handler}-${idx}`}
                    className={idx < PROCESS_INTERVENTION_HANDLER_TABLE_ROWS.length - 1 ? 'border-b border-gray-50' : ''}
                  >
                    {row.isFirstOfNode && (
                      <td
                        rowSpan={row.nodeRowSpan}
                        className="py-3 px-4 text-gray-900 align-middle bg-white border-r border-gray-50"
                      >
                        {row.nodeName}
                      </td>
                    )}
                    <td className="py-3 px-4 text-gray-600">{row.handler}</td>
                    <td className="py-3 px-4 text-red-500 cursor-pointer hover:underline flex items-center gap-1">
                      <Trash2 size={14} /> 移除
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case '流程终审':
        return (
          <div className="p-6 space-y-6">
            <div className="bg-orange-50 border border-orange-100 p-3 rounded flex items-start gap-3">
              <AlertCircle size={16} className="text-orange-500 mt-0.5" />
              <p className="text-[12px] text-orange-700">终审操作将直接结束流程，请谨慎操作。操作后将记录在审计日志中。</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-gray-900">终审结果</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="finalResult" className="w-4 h-4 text-[#2f54eb] focus:ring-[#2f54eb]" defaultChecked />
                    <span className="text-[13px] text-gray-700">审批同意 (Pass)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="finalResult" className="w-4 h-4 text-[#2f54eb] focus:ring-[#2f54eb]" />
                    <span className="text-[13px] text-gray-700">审批拒绝 (Reject)</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-gray-900"><span className="text-red-500 mr-1">*</span>审批意见</label>
                <textarea 
                  placeholder="请输入终审意见..." 
                  className="w-full h-32 p-3 border border-gray-200 rounded text-[13px] outline-none focus:border-[#2f54eb] resize-none"
                />
              </div>
            </div>
          </div>
        );
      case '流程退回':
        return (
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <label className="text-[14px] font-bold text-gray-900">
                <span className="text-red-500 mr-1">*</span>
                选择退回节点
              </label>
              <div className="space-y-2">
                {PROCESS_INTERVENTION_RETURN_NODES.map((node) => (
                  <label
                    key={`return-order-${node.order}`}
                    className={`flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedReturnOrder === node.order
                        ? 'border-blue-100 bg-blue-50/30'
                        : returnNodeError
                          ? 'border-red-200'
                          : 'border-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="processInterventionReturnNode"
                      value={String(node.order)}
                      checked={selectedReturnOrder === node.order}
                      onChange={() => {
                        setSelectedReturnOrder(node.order);
                        setReturnNodeError('');
                      }}
                      className="w-4 h-4 text-[#2f54eb] focus:ring-[#2f54eb] shrink-0"
                    />
                    <span className="text-[13px] text-gray-700 leading-snug">
                      <span className="font-medium text-gray-900">序号 {node.order}</span>
                      {' '}
                      {node.label}
                    </span>
                  </label>
                ))}
              </div>
              {returnNodeError ? (
                <p className="text-[12px] text-red-500">{returnNodeError}</p>
              ) : null}
            </div>
          </div>
        );
      case '调整节点':
        return (
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-gray-900">大阶段</label>
              <div className="relative">
                <select className="w-full p-2.5 border border-gray-200 rounded text-[13px] outline-none appearance-none bg-white cursor-pointer focus:border-[#2f54eb]">
                  <option>组织绩效计划制定</option>
                  <option>组织绩效中期回顾</option>
                  <option>组织绩效考核评估</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[14px] font-bold text-gray-900">大阶段-流程子节点配置</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-blue-100 bg-blue-50/30 rounded cursor-pointer">
                  <input type="radio" name="nodeConfig" className="w-4 h-4 text-[#2f54eb] focus:ring-[#2f54eb]" defaultChecked />
                  <div className="flex flex-col">
                    <span className="text-[13px] text-gray-700">按原有流程审批</span>
                    <span className="text-[11px] text-gray-400">阶段开启后，按阶段预设的审批链进行。</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="nodeConfig" className="w-4 h-4 text-[#2f54eb] focus:ring-[#2f54eb]" />
                  <div className="flex flex-col">
                    <span className="text-[13px] text-gray-700">完成后跳转至指定节点</span>
                    <span className="text-[11px] text-gray-400">提交后，跳过中间节点，直接跳转至指定的审批人节点...</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-100 rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="nodeConfig" className="w-4 h-4 text-[#2f54eb] focus:ring-[#2f54eb]" />
                  <div className="flex flex-col">
                    <span className="text-[13px] text-gray-700">无需审批</span>
                    <span className="text-[11px] text-gray-400">提交后，流程自动完成，无需任何审批环节。</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-gray-900"><span className="text-red-500 mr-1">*</span>操作原因</label>
              <textarea 
                placeholder="请输入调整原因，例如：新入职员工补充绩效目标" 
                className="w-full h-24 p-3 border border-gray-200 rounded text-[13px] outline-none focus:border-[#2f54eb] resize-none"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative bg-white w-full max-w-2xl shadow-2xl flex flex-col h-full"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-[18px] font-bold text-gray-900">流程干预</h2>
            <p className="text-[12px] text-gray-400">
              考核对象：
              <span className="text-gray-600">{getProcessInterventionAssessmentObjectName(data)}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {tabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => handleInterventionTabChange(tab)}
              className={`px-4 py-3 text-[14px] font-medium transition-all relative ${
                activeTab === tab ? 'text-[#2f54eb]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTabIntervention"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2f54eb]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-[400px]">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-gray-200 rounded text-[14px] text-gray-600 hover:bg-gray-100 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-8 py-2 bg-[#2f54eb] text-white rounded text-[14px] font-medium shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95"
          >
            确认
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ApprovalChainModal = ({ isOpen, onClose, data: _data }: { isOpen: boolean; onClose: () => void; data: any }) => {
  return (
    <div className="fixed inset-0 z-[200] flex justify-end overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative bg-white w-full max-w-4xl shadow-2xl flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">审批链</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Content - Timeline */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="max-w-2xl mx-auto space-y-0">
            {/* Timeline Item 1 */}
            <div className="relative pl-12 pb-12 group last:pb-0">
              {/* Connector */}
              <div className="absolute left-[20px] top-4 w-px h-full bg-gray-100" />
              {/* Dot */}
              <div className="absolute left-[13px] top-1.5 w-[14px] h-[14px] rounded-full border-2 border-[#2f54eb] bg-white z-10 shadow-[0_0_0_4px_white]" />
              
              <div className="flex items-center justify-between mb-3 pt-0.5">
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-bold text-gray-900">发起</span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] bg-blue-50 text-[#2f54eb] border border-blue-100 font-medium">
                    发起
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-[12px] font-mono">
                  <Clock size={12} />
                  <span>2025-07-01 09:30:15</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-all group-hover:border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-gray-900">
                      员工本人 (202301) 
                      <span className="mx-2 text-gray-300 font-normal">|</span> 
                      <span className="text-gray-500 font-normal">信息化中心/研发组</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-gray-600 text-[13px] pl-11">
                  <MessageSquare size={14} className="mt-0.5 shrink-0 opacity-40 text-[#2f54eb]" />
                  <span>提交绩效目标</span>
                </div>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative pl-12 pb-12 group last:pb-0">
              <div className="absolute left-[20px] top-4 w-px h-full bg-gray-100" />
              <div className="absolute left-[13px] top-1.5 w-[14px] h-[14px] rounded-full border-2 border-green-500 bg-white z-10 shadow-[0_0_0_4px_white]" />
              
              <div className="flex items-center justify-between mb-3 pt-0.5">
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-bold text-gray-900">直接上级审批</span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] bg-green-50 text-green-600 border border-green-100 font-medium">
                    审批通过
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-[12px] font-mono">
                  <Clock size={12} />
                  <span>2025-07-02 14:00:05</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-all group-hover:border-green-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-gray-900">
                      张经理 (M001) 
                      <span className="mx-2 text-gray-300 font-normal">|</span> 
                      <span className="text-gray-500 font-normal">信息化中心/研发组</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-gray-600 text-[13px] pl-11">
                  <MessageSquare size={14} className="mt-0.5 shrink-0 opacity-40 text-green-500" />
                  <span>符合阶段执行要求</span>
                </div>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative pl-12 pb-12 group last:pb-0">
              <div className="absolute left-[20px] top-4 w-px h-full bg-gray-100" />
              <div className="absolute left-[13px] top-1.5 w-[14px] h-[14px] rounded-full border-2 border-orange-500 bg-white z-10 shadow-[0_0_0_4px_white]" />
              
              <div className="flex items-center justify-between mb-3 pt-0.5">
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-bold text-gray-900">管理员操作</span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] bg-orange-50 text-orange-600 border border-orange-100 font-medium flex items-center gap-1">
                    <AlertCircle size={10} />
                    系统干预-更换办理人
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-[12px] font-mono">
                  <Clock size={12} />
                  <span>2025-07-03 10:00:00</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-all group-hover:border-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-gray-900">
                      系统管理员 (admin) 
                      <span className="mx-2 text-gray-300 font-normal">|</span> 
                      <span className="text-gray-500 font-normal">系统管理</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-gray-600 text-[13px] pl-11">
                  <MessageSquare size={14} className="mt-0.5 shrink-0 opacity-40 text-orange-500" />
                  <span>原审批人休假，转交给 王总监(M002)</span>
                </div>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="relative pl-12 pb-0 group last:pb-0 pt-0.5">
              <div className="absolute left-[13px] top-1.5 w-[14px] h-[14px] rounded-full border-2 border-green-500 bg-white z-10 shadow-[0_0_0_4px_white]" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-bold text-gray-900">隔级上级审批</span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] bg-green-50 text-green-600 border border-green-100 font-medium">
                    审批通过
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-[12px] font-mono">
                  <Clock size={12} />
                  <span>2025-07-03 16:25:40</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DashboardDataMgmtPage = () => {
  const [activeTab, setActiveTab] = useState<'group' | 'dept'>('group');
  const [selectedActivity, setSelectedActivity] = useState('2025年组织绩效活动');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  const batches = [
    { id: 'B2026040601', time: '2026-04-06 10:00:23', operator: 'HR管理员', status: '最新', count: 45 },
    { id: 'B2026033102', time: '2026-03-31 15:30:12', operator: 'HR管理员', status: '已存档', count: 42 },
    { id: 'B2026031501', time: '2026-03-15 09:15:44', operator: '系统自动导入', status: '已存档', count: 38 },
  ];
  
  const [selectedBatch, setSelectedBatch] = useState(batches[0]);

  const groupData = [
    { id: 1, dimension: '财务指标', name: '集团年度营业收入', target: '1000亿', result: '850亿', progress: 85, light: 'green' },
    { id: 2, dimension: '运营指标', name: '集团数字化转型进度', target: '100%', result: '75%', progress: 75, light: 'blue' },
    { id: 3, dimension: '客户指标', name: '集团客户满意度', target: '95%', result: '92%', progress: 92, light: 'green' },
  ];

  const deptData = [
    { id: 1, dept: '信息化中心', dimension: '财务指标', name: '部门预算执行率', weight: '20%', result: '98%', progress: 98, light: 'green' },
    { id: 2, dept: '技术研发部', dimension: '运营指标', name: '核心产品研发进度', weight: '40%', result: '60%', progress: 60, light: 'yellow' },
    { id: 3, dept: '流程效能部', dimension: '组织发展指标', name: '流程优化完成数', weight: '30%', result: '15个', progress: 50, light: 'red' },
  ];

  const getLightColor = (light: string) => {
    switch (light) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f0f2f5] overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-[18px] font-bold text-gray-900">绩效看板管理</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500">绩效活动:</span>
            <div className="relative">
              <select 
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded px-3 py-1.5 pr-8 text-[13px] outline-none focus:border-[#2f54eb] transition-colors"
              >
                <option>2025年组织绩效活动</option>
                <option>2024年组织绩效活动</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500">当前数据批次:</span>
            <div className="relative">
              <select 
                value={selectedBatch.id}
                onChange={(e) => setSelectedBatch(batches.find(b => b.id === e.target.value) || batches[0])}
                className={`appearance-none border rounded px-3 py-1.5 pr-8 text-[13px] outline-none transition-colors ${selectedBatch.status === '最新' ? 'bg-blue-50 border-blue-200 text-[#2f54eb]' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.time} ({b.status})</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-6 border-b border-gray-200 shrink-0">
        <div className="flex gap-8">
          {[
            { id: 'group', label: '集团级指标' },
            { id: 'dept', label: '部门级指标' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 text-[14px] relative transition-colors ${activeTab === tab.id ? 'text-[#2f54eb] font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabDashboard"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2f54eb]" 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col gap-4">
        {selectedBatch.status !== '最新' && (
          <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-orange-700 text-[13px]">
              <AlertCircle size={16} />
              <span>您当前正在查看历史批次数据（批次号：{selectedBatch.id}），该数据仅供参考，不可编辑。</span>
            </div>
            <button 
              onClick={() => setSelectedBatch(batches[0])}
              className="text-[#2f54eb] text-[13px] font-medium hover:underline"
            >
              返回最新数据
            </button>
          </div>
        )}
        
        {/* Toolbar */}
        <div className="flex items-center justify-between bg-white p-4 rounded shadow-sm border border-gray-100 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="搜索指标名称/部门" 
                className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-[13px] outline-none focus:border-[#2f54eb]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-gray-500">指标维度:</span>
              <select className="border border-gray-200 rounded px-2 py-1 text-[13px] outline-none">
                <option>全部</option>
                <option>财务指标</option>
                <option>客户指标</option>
                <option>运营指标</option>
                <option>组织发展指标</option>
                <option>能力建设指标</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2f54eb] text-white rounded text-[13px] hover:bg-[#1d39c4] transition-colors shadow-sm">
              <FileUp size={14} />
              <span>导入</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 bg-white rounded shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-left text-[12px] text-gray-500 border-b border-gray-100 sticky top-0 z-10">
                  <th className="py-3 px-4 font-medium w-16">序号</th>
                  {activeTab === 'dept' && <th className="py-3 px-4 font-medium">一级部门名称</th>}
                  <th className="py-3 px-4 font-medium">指标维度</th>
                  <th className="py-3 px-4 font-medium">指标名称</th>
                  {activeTab === 'group' ? (
                    <th className="py-3 px-4 font-medium">目标值</th>
                  ) : (
                    <th className="py-3 px-4 font-medium">指标权重</th>
                  )}
                  <th className="py-3 px-4 font-medium">当前完成结果</th>
                  <th className="py-3 px-4 font-medium">当前完成进度</th>
                  <th className="py-3 px-4 font-medium text-center">红黄蓝绿灯</th>
                  <th className="py-3 px-4 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'group' ? groupData : deptData).map((item: any, idx) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors text-[13px]">
                    <td className="py-3 px-4 text-gray-500">{idx + 1}</td>
                    {activeTab === 'dept' && <td className="py-3 px-4 text-gray-900 font-medium">{item.dept}</td>}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-[#2f54eb] rounded text-[11px]">{item.dimension}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{item.name}</td>
                    <td className="py-3 px-4 text-gray-600">{activeTab === 'group' ? item.target : item.weight}</td>
                    <td className="py-3 px-4 text-gray-900 font-medium">{item.result}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getLightColor(item.light)}`} 
                            style={{ width: `${item.progress}%` }} 
                          />
                        </div>
                        <span className="text-[11px] text-gray-500 w-8">{item.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <div className={`w-3 h-3 rounded-full ${getLightColor(item.light)} shadow-sm`} />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-3">
                        <button 
                          disabled={selectedBatch.status !== '最新'}
                          className={`text-[#2f54eb] hover:underline disabled:opacity-30 disabled:no-underline`}
                        >
                          编辑
                        </button>
                        {activeTab === 'group' && (
                          <button 
                            disabled={selectedBatch.status !== '最新'}
                            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-500 shrink-0">
            <span>共 {(activeTab === 'group' ? groupData : deptData).length} 条数据</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-gray-100 rounded border border-gray-200 disabled:opacity-30" disabled><ChevronLeft size={14} /></button>
                <button className="w-6 h-6 flex items-center justify-center bg-[#2f54eb] text-white rounded">1</button>
                <button className="p-1 hover:bg-gray-100 rounded border border-gray-200 disabled:opacity-30" disabled><ChevronRight size={14} /></button>
              </div>
              <div className="flex items-center gap-2">
                <span>10条/页</span>
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Records Modal */}
      <AnimatePresence>
        {isHistoryModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-[800px] max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <History size={20} className="text-[#2f54eb]" />
                  <h3 className="text-[16px] font-bold text-gray-900">数据导入历史记录</h3>
                </div>
                <X size={20} className="text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => setIsHistoryModalOpen(false)} />
              </div>
              
              <div className="p-6 overflow-y-auto">
                <div className="border border-gray-100 rounded overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-4 py-3 text-[12px] font-medium text-gray-500">批次编号</th>
                        <th className="px-4 py-3 text-[12px] font-medium text-gray-500">导入时间</th>
                        <th className="px-4 py-3 text-[12px] font-medium text-gray-500">操作人</th>
                        <th className="px-4 py-3 text-[12px] font-medium text-gray-500">数据量</th>
                        <th className="px-4 py-3 text-[12px] font-medium text-gray-500">状态</th>
                        <th className="px-4 py-3 text-[12px] font-medium text-gray-500 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batches.map((batch) => (
                        <tr key={batch.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 text-[13px] font-mono text-gray-600">{batch.id}</td>
                          <td className="px-4 py-3 text-[13px] text-gray-600">{batch.time}</td>
                          <td className="px-4 py-3 text-[13px] text-gray-600">{batch.operator}</td>
                          <td className="px-4 py-3 text-[13px] text-gray-600">{batch.count} 条</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] ${batch.status === '最新' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {batch.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button 
                              onClick={() => {
                                setSelectedBatch(batch);
                                setIsHistoryModalOpen(false);
                              }}
                              className="text-[#2f54eb] text-[13px] hover:underline"
                            >
                              查看此批次
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                <button 
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/** 解析活动更新时间，用于比较「最近更新」 */
function activityUpdateTimeMs(updateTime: string | undefined): number {
  if (updateTime == null || String(updateTime).trim() === '') return 0;
  const s = String(updateTime).trim();
  const normalized = s.includes('T') ? s : s.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1/$2/$3');
  const ms = new Date(normalized).getTime();
  return Number.isFinite(ms) ? ms : 0;
}

/** 在状态为「进行中」的活动中，取 updateTime 最新的一条（离当前时刻最近的一次更新） */
function pickLatestUpdatedOngoingActivityId(activityList: any[]): string {
  const ongoing = activityList.filter((a) => a?.status === '进行中');
  if (ongoing.length === 0) return '';
  const sorted = [...ongoing].sort(
    (a, b) => activityUpdateTimeMs(b.updateTime) - activityUpdateTimeMs(a.updateTime)
  );
  return sorted[0]?.id ?? '';
}

/** 与流程监控「组织绩效计划变更」列表节点一致 */
const PLAN_CHANGE_MONITORING_FLOW_NODES = [
  { nodeName: '变更申请填报', role: 'leader' as const },
  { nodeName: '变更审批', role: 'hrbp' as const },
  { nodeName: '计划发布确认', role: 'exec' as const },
];

function buildPlanChangeRowFromAssessmentSubject(row: any, index: number) {
  const config = PLAN_CHANGE_MONITORING_FLOW_NODES[index % PLAN_CHANGE_MONITORING_FLOW_NODES.length];
  let approver = '-';
  if (config.role === 'leader') approver = row.leader;
  else if (config.role === 'hrbp') approver = row.hrbp;
  else if (config.role === 'exec') approver = row.exec;
  return {
    id: row.id,
    path: row.path,
    level: row.level,
    leader: row.leader,
    hrbp: row.hrbp,
    exec: row.exec,
    standing: row.exec,
    orgType: row.orgType,
    status: '进行中',
    currentNode: config.nodeName,
    currentApprover: approver,
  };
}

/** 流程监控页：无活动或未配置阶段时的占位（与列表活动结构一致） */
const DEFAULT_PERFORMANCE_MONITORING_PHASES: any[] = [
  { name: '组织绩效计划制定', date: '—', showRounds: false, rounds: [] },
  {
    name: MONITORING_PHASE_MID_TERM,
    date: '—',
    showRounds: true,
    rounds: [
      { id: '1', name: '第一轮回顾' },
      { id: '2', name: '第二轮回顾' },
    ],
  },
  {
    name: MONITORING_PHASE_APPRAISAL,
    date: '—',
    showRounds: true,
    rounds: [
      { id: 'pre', name: '组织绩效预考核' },
      { id: 'formal', name: '组织绩效正式考核' },
    ],
  },
];

/** 从活动配置解析某阶段下的轮次 Tab（与活动详情 monitoringTabs 对齐） */
function resolveMonitoringPhaseRounds(activity: any, phaseName: string): { id: string; name: string }[] {
  if (!activity) return [];
  const phases = activity?.config?.phases;
  const phase = Array.isArray(phases) ? phases.find((p: any) => p.name === phaseName) : undefined;
  if (!phase?.showRounds) return [];

  const tabRounds = activity?.config?.phaseRoundTabs?.[phaseName];
  if (Array.isArray(tabRounds) && tabRounds.length > 0) {
    return tabRounds.map((t: any) => ({
      id: String(t.id),
      name: (t.name || '').trim() || '未命名轮次',
    }));
  }

  if (Array.isArray(phase.rounds) && phase.rounds.length > 0) {
    return phase.rounds.map((r: any) => ({
      id: String(r.id),
      name: (r.name || '').trim() || '未命名轮次',
    }));
  }

  if (phaseName === MONITORING_PHASE_MID_TERM && activity.planStageArchivedToMidTerm) {
    const def = DEFAULT_PERFORMANCE_MONITORING_PHASES.find((p) => p.name === phaseName);
    return (def?.rounds ?? []).map((r: any) => ({ id: String(r.id), name: r.name }));
  }
  if (phaseName === MONITORING_PHASE_APPRAISAL && activity.midTermArchivedToAppraisal) {
    const def = DEFAULT_PERFORMANCE_MONITORING_PHASES.find((p) => p.name === phaseName);
    return (def?.rounds ?? []).map((r: any) => ({ id: String(r.id), name: r.name }));
  }

  return [];
}

function mergeActivityPhaseRoundTabs(activity: any, phaseName: string, tabs: MonitoringTab[]) {
  const rounds = tabs.map((t) => ({ id: String(t.id), name: t.name }));
  const phases = (activity?.config?.phases ?? []).map((p: any) =>
    p.name === phaseName ? { ...p, showRounds: true, rounds } : p
  );
  return {
    ...activity,
    config: {
      ...activity.config,
      phases,
      phaseRoundTabs: {
        ...(activity.config?.phaseRoundTabs ?? {}),
        [phaseName]: tabs.map((t) => ({ ...t })),
      },
    },
  };
}

type MonitoringSummaryKey = 'assessmentTotal' | 'completed' | 'inProgress' | 'stuck';
type PlanChangeSummaryKey = 'departments' | 'completed' | 'inProgress' | 'stuck';

type MonitoringFormDetailMetric = {
  name: string;
  weight: number;
  type: '定量' | '定性';
  zeroGoal: string;
  threeGoal: string;
  fiveGoal: string;
  lastYear: string;
  yoyGrowth: string;
  provider: string;
  reviewer: string;
  reviewerWeight: number;
  formula: string;
};

type MonitoringFormDetailSection = {
  title: string;
  required?: boolean;
  metrics: MonitoringFormDetailMetric[];
};

/** 组织绩效计划制定 · 查看表单只读指标（与门户端计划阶段演示数据一致） */
const MONITORING_PLAN_FORM_DETAIL_SECTIONS: MonitoringFormDetailSection[] = [
  {
    title: '财务指标',
    required: true,
    metrics: [
      {
        name: '营收达成（亿）',
        weight: 18,
        type: '定量',
        zeroGoal: '40',
        threeGoal: '48',
        fiveGoal: '60',
        lastYear: '42',
        yoyGrowth: '42.9%',
        provider: '李四',
        reviewer: '张三',
        reviewerWeight: 100,
        formula: '实际完成值 ÷ 目标值 × 100%',
      },
      {
        name: '毛利率（%）',
        weight: 17,
        type: '定量',
        zeroGoal: '22',
        threeGoal: '26',
        fiveGoal: '30',
        lastYear: '24.5',
        yoyGrowth: '22.4%',
        provider: '李四',
        reviewer: '张三',
        reviewerWeight: 100,
        formula: '(营业收入 - 营业成本) ÷ 营业收入 × 100%',
      },
    ],
  },
  {
    title: '客户指标',
    required: true,
    metrics: [
      {
        name: '市占率（%）',
        weight: 12,
        type: '定量',
        zeroGoal: '18',
        threeGoal: '22',
        fiveGoal: '28',
        lastYear: '20',
        yoyGrowth: '40.0%',
        provider: '赵六',
        reviewer: '王五',
        reviewerWeight: 100,
        formula: '本公司销售额 ÷ 行业总销售额 × 100%',
      },
      {
        name: '客诉率（%）',
        weight: 10,
        type: '定量',
        zeroGoal: '1.2',
        threeGoal: '0.8',
        fiveGoal: '0.4',
        lastYear: '1.0',
        yoyGrowth: '-60.0%',
        provider: '赵六',
        reviewer: '王五',
        reviewerWeight: 100,
        formula: '客诉件数 ÷ 销售订单数 × 100%',
      },
    ],
  },
  {
    title: '运营指标',
    required: true,
    metrics: [
      {
        name: '交付及时率（%）',
        weight: 15,
        type: '定量',
        zeroGoal: '90',
        threeGoal: '95',
        fiveGoal: '98',
        lastYear: '92',
        yoyGrowth: '15.2%',
        provider: '周八',
        reviewer: '孙七',
        reviewerWeight: 100,
        formula: '准时交付订单数 ÷ 总订单数 × 100%',
      },
      {
        name: '库存周转（天）',
        weight: 14,
        type: '定量',
        zeroGoal: '50',
        threeGoal: '45',
        fiveGoal: '40',
        lastYear: '52',
        yoyGrowth: '-26.9%',
        provider: '周八',
        reviewer: '孙七',
        reviewerWeight: 100,
        formula: '365 ÷ (销售成本 ÷ 平均库存)',
      },
    ],
  },
  {
    title: '组织发展指标',
    required: true,
    metrics: [
      {
        name: '人效（万/人）',
        weight: 8,
        type: '定量',
        zeroGoal: '80',
        threeGoal: '100',
        fiveGoal: '120',
        lastYear: '95',
        yoyGrowth: '26.3%',
        provider: '郑十',
        reviewer: '吴九',
        reviewerWeight: 100,
        formula: '营业收入 ÷ 在岗人数',
      },
      {
        name: '关键人才保留',
        weight: 7,
        type: '定性',
        zeroGoal: '核心人才流失率 > 20%',
        threeGoal: '核心人才流失率 10%-20%',
        fiveGoal: '核心人才流失率 < 10%',
        lastYear: '达标',
        yoyGrowth: '0%',
        provider: '郑十',
        reviewer: '吴九',
        reviewerWeight: 100,
        formula: '按定性评价规则对照目标区间打分',
      },
    ],
  },
];

function getMonitoringAssessmentObjectName(row: any): string {
  return row?.path?.replace('集团总部/', '') || row?.id || '—';
}

function clonePlanFormDetailSections(): MonitoringFormDetailSection[] {
  return MONITORING_PLAN_FORM_DETAIL_SECTIONS.map((section) => ({
    ...section,
    metrics: section.metrics.map((m) => ({ ...m })),
  }));
}

function emptyPlanFormDetailSections(): MonitoringFormDetailSection[] {
  return MONITORING_PLAN_FORM_DETAIL_SECTIONS.map((section) => ({
    ...section,
    metrics: [] as MonitoringFormDetailMetric[],
  }));
}

/** 按当前阶段 + 待办节点生成表单展示区块（计划制定阶段使用图1-4指标明细） */
function buildMonitoringFormSections(
  phaseName: string,
  currentNode: string,
  row: { status?: string; orgType?: string }
): MonitoringFormDetailSection[] {
  const hasNodeContent =
    row.status !== '未开始' && currentNode && currentNode !== '-' && currentNode !== '已归档';

  if (phaseName === '组织绩效计划制定' && hasNodeContent) {
    return clonePlanFormDetailSections();
  }

  if (!hasNodeContent && phaseName === '组织绩效计划制定') {
    return emptyPlanFormDetailSections();
  }

  if (phaseName === MONITORING_PHASE_MID_TERM && hasNodeContent) {
    return [
      {
        title: '财务指标',
        required: true,
        metrics: [
          {
            name: '营收达成（亿）',
            weight: 18,
            type: '定量',
            zeroGoal: '40',
            threeGoal: '48',
            fiveGoal: '60',
            lastYear: '42',
            yoyGrowth: '18.5',
            provider: '李四',
            reviewer: '张三',
            reviewerWeight: 100,
            formula: '实际完成值 ÷ 目标值 × 100%',
          },
        ],
      },
      {
        title: '运营指标',
        required: true,
        metrics: [
          {
            name: '交付及时率（%）',
            weight: 15,
            type: '定量',
            zeroGoal: '90',
            threeGoal: '95',
            fiveGoal: '98',
            lastYear: '92',
            yoyGrowth: '72%',
            provider: '周八',
            reviewer: '孙七',
            reviewerWeight: 100,
            formula: '准时交付订单数 ÷ 总订单数 × 100%',
          },
        ],
      },
    ];
  }

  if (phaseName === MONITORING_PHASE_APPRAISAL && hasNodeContent) {
    return clonePlanFormDetailSections();
  }

  return emptyPlanFormDetailSections();
}

function getMonitoringFormEmptyHint(phaseName: string, activityYear?: string): string {
  const year = activityYear || new Date().getFullYear();
  if (phaseName === MONITORING_PHASE_MID_TERM) {
    return `考核对象尚未参与 ${year} 年组织绩效中期回顾填报`;
  }
  if (phaseName === MONITORING_PHASE_APPRAISAL) {
    return `考核对象尚未参与 ${year} 年组织绩效考核填报`;
  }
  return `被考核人未参与 ${year} 年组织绩效计划制定目标填报`;
}

const MonitoringAssessmentFormDrawer = ({
  isOpen,
  onClose,
  row,
  activityName,
  phaseName,
  roundName,
}: {
  isOpen: boolean;
  onClose: () => void;
  row: any;
  activityName: string;
  phaseName: string;
  roundName?: string;
}) => {
  const objectName = row ? getMonitoringAssessmentObjectName(row) : '—';
  const currentNode = row?.currentNode || '—';
  const activityYear = activityName?.match(/\d{4}/)?.[0];
  const sections = useMemo(
    () => (row ? buildMonitoringFormSections(phaseName, currentNode, row) : []),
    [phaseName, currentNode, row]
  );
  const emptyHint = getMonitoringFormEmptyHint(phaseName, activityYear);

  if (!isOpen || !row) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="relative bg-[#f5f6f8] w-full max-w-[min(96vw,1400px)] shadow-2xl flex flex-col h-full"
      >
        <div className="flex items-start justify-between px-6 py-5 bg-white border-b border-gray-100 shrink-0">
          <div className="min-w-0 pr-4">
            <h2 className="text-[22px] font-bold text-gray-900 leading-tight truncate">{objectName}</h2>
            <p className="text-[13px] text-gray-500 mt-1 truncate">
              活动名称：<span className="text-gray-700">{activityName || '—'}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600 shrink-0"
            aria-label="关闭"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-3 bg-white border-b border-gray-100 shrink-0 flex flex-wrap items-center gap-2 text-[12px]">
          <span className="px-2.5 py-1 rounded bg-blue-50 text-[#2f54eb] border border-blue-100">
            当前阶段：{phaseName || '—'}
          </span>
          {roundName ? (
            <span className="px-2.5 py-1 rounded bg-gray-50 text-gray-600 border border-gray-100">
              当前轮次：{roundName}
            </span>
          ) : null}
          <span className="px-2.5 py-1 rounded bg-orange-50 text-orange-700 border border-orange-100">
            待办节点：{currentNode}
          </span>
          {row.currentApprover && row.currentApprover !== '-' ? (
            <span className="text-gray-500">办理人：{row.currentApprover}</span>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="h-14 px-5 border-b border-blue-100 bg-[#f0f6fc] flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1 h-4 bg-[#2f54eb] rounded-full shrink-0" />
                  <h3 className="text-[15px] font-bold text-slate-800">{section.title}</h3>
                  {section.required && phaseName === '组织绩效计划制定' ? (
                    <span className="text-red-500 text-[12px] font-medium">（必选）</span>
                  ) : null}
                  <HelpCircle size={14} className="text-slate-400 shrink-0" />
                </div>
              </div>
              {section.metrics.length === 0 ? (
                <div className="py-14 px-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                    <FileText size={32} className="text-gray-300" />
                  </div>
                  <p className="text-[13px] text-gray-500 max-w-md leading-relaxed">{emptyHint}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse table-fixed min-w-[1320px] text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 whitespace-nowrap">
                        <th className="px-2 py-3 font-medium w-12 text-center">序号</th>
                        <th className="px-2 py-3 font-medium w-[10%]">指标名称</th>
                        <th className="px-2 py-3 font-medium w-[5%]">指标权重</th>
                        <th className="px-2 py-3 font-medium w-[6%]">指标类型</th>
                        <th className="px-2 py-3 font-medium w-[10%]">零分目标</th>
                        <th className="px-2 py-3 font-medium w-[10%]">三分目标</th>
                        <th className="px-2 py-3 font-medium w-[10%]">五分目标</th>
                        <th className="px-2 py-3 font-medium w-[75px] text-left">上年同期</th>
                        <th className="px-2 py-3 font-medium w-[85px] text-left">同比增长率</th>
                        <th className="px-2 py-3 font-medium w-[7%]">数据提供人</th>
                        <th className="px-2 py-3 font-medium w-[8%]">考核人及权重</th>
                        <th className="px-2 py-3 font-medium w-[10%]">计算公式</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {section.metrics.map((metric, idx) => (
                        <tr key={`${section.title}-${metric.name}-${idx}`} className="border-t border-slate-100">
                          <td className="px-2 py-3 text-center text-slate-600">{idx + 1}</td>
                          <td className="px-2 py-3 text-slate-900 font-medium whitespace-pre-wrap break-words">
                            {metric.name}
                          </td>
                          <td className="px-2 py-3 text-center">{metric.weight}</td>
                          <td className="px-2 py-3 text-center">{metric.type}</td>
                          <td className="px-2 py-3 whitespace-pre-wrap break-words">{metric.zeroGoal}</td>
                          <td className="px-2 py-3 whitespace-pre-wrap break-words">{metric.threeGoal}</td>
                          <td className="px-2 py-3 whitespace-pre-wrap break-words">{metric.fiveGoal}</td>
                          <td className="px-2 py-3 text-left">{metric.lastYear}</td>
                          <td className="px-2 py-3 text-left">{metric.yoyGrowth}</td>
                          <td className="px-2 py-3">
                            <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                              {metric.provider}
                            </span>
                          </td>
                          <td className="px-2 py-3">
                            <span className="text-slate-800">
                              {metric.reviewer} {metric.reviewerWeight}
                            </span>
                          </td>
                          <td className="px-2 py-3 whitespace-pre-wrap break-words text-slate-600">
                            {metric.formula || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const PerformanceProcessMonitoringPage = ({
  activities = [],
  planChangeSubjectsByActivityId = {},
}: {
  activities?: any[];
  planChangeSubjectsByActivityId?: Record<string, any[]>;
}) => {
  const [monitoringSearchTerm, setMonitoringSearchTerm] = useState('');
  const [monitoringSummaryKey, setMonitoringSummaryKey] = useState<MonitoringSummaryKey>('assessmentTotal');
  const [toolbarFilterDropdown, setToolbarFilterDropdown] = useState<null | 'orgType' | 'status'>(null);
  const monitoringSummaryFirstCardRef = useRef<HTMLDivElement | null>(null);
  const planChangeSummaryFirstCardRef = useRef<HTMLDivElement | null>(null);
  const [monitoringViewTab, setMonitoringViewTab] = useState<'组织绩效考核流程监控' | '组织绩效计划变更监控'>('组织绩效考核流程监控');
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [isApprovalChainModalOpen, setIsApprovalChainModalOpen] = useState(false);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isSendMessageDrawerOpen, setIsSendMessageDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [planChangeSearchTerm, setPlanChangeSearchTerm] = useState('');
  const [planChangeSelectedIds, setPlanChangeSelectedIds] = useState<string[]>([]);
  const [planChangeSummaryKey, setPlanChangeSummaryKey] = useState<PlanChangeSummaryKey>('departments');
  const [planChangeFilters, setPlanChangeFilters] = useState<{ orgType: string[]; status: string[] }>({
    orgType: [],
    status: [],
  });
  const [planChangeToolbarDropdown, setPlanChangeToolbarDropdown] = useState<null | 'orgType' | 'status'>(null);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    path: [],
    orgType: [],
    level: [],
    currentNode: [],
    currentApprover: [],
    status: []
  });

  const toggleFilterValue = (column: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[column] || [];
      const next = current.includes(value) 
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [column]: next };
    });
  };

  const clearFilter = (column: string) => {
    setSelectedFilters(prev => ({ ...prev, [column]: [] }));
  };

  const getColumnOptions = (column: string) => {
    const options = Array.from(new Set(tableData.map(row => (row as any)[column]).filter(v => v && v !== '-')));
    return options.sort();
  };

  const FilterPopover = ({ column, label }: { column: string, label: string }) => {
    if (activeFilterColumn !== column) return null;
    
    const options = getColumnOptions(column);
    const selected = selectedFilters[column] || [];

    return (
      <div className="absolute top-full left-0 mt-2 w-[220px] bg-white rounded-lg shadow-xl border border-gray-100 z-[100] py-3">
        <div className="px-3 mb-2 flex items-center justify-between">
          <span className="text-[12px] font-bold text-gray-900">{label}筛选</span>
          {selected.length > 0 && (
            <button 
              onClick={(e) => { e.stopPropagation(); clearFilter(column); }}
              className="text-[11px] text-[#2f54eb] hover:underline"
            >
              重置
            </button>
          )}
        </div>
        <div className="max-h-[240px] overflow-y-auto px-1">
          {options.map(option => (
            <label 
              key={option}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer group transition-colors"
            >
              <div 
                onClick={(e) => { e.stopPropagation(); toggleFilterValue(column, option); }}
                className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                  selected.includes(option) ? 'bg-[#2f54eb] border-[#2f54eb]' : 'border-gray-300 group-hover:border-gray-400'
                }`}
              >
                {selected.includes(option) && <Check size={10} className="text-white" />}
              </div>
              <span className="text-[13px] text-gray-600 group-hover:text-gray-900 truncate flex-1">
                {column === 'path' ? option.replace('集团总部/', '') : option}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  // Activity Selection：仅「进行中」，默认选中 updateTime 最新的活动
  const ongoingActivities = useMemo(
    () => activities.filter((a: any) => a?.status === '进行中'),
    [activities]
  );
  const latestOngoingActivityId = useMemo(
    () => pickLatestUpdatedOngoingActivityId(activities),
    [activities]
  );
  const [selectedActivityId, setSelectedActivityId] = useState(() =>
    pickLatestUpdatedOngoingActivityId(activities)
  );

  useEffect(() => {
    const next = pickLatestUpdatedOngoingActivityId(activities);
    setSelectedActivityId((prev) => (prev === next ? prev : next));
  }, [activities]);

  const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false);
  const selectedActivity =
    ongoingActivities.find((a) => a.id === selectedActivityId) ||
    ongoingActivities.find((a) => a.id === latestOngoingActivityId);

  const isMonitoringActivityCompleted = (selectedActivity?.status ?? '进行中') === '已完成';
  const planStageArchivedToMidTerm = Boolean((selectedActivity as any)?.planStageArchivedToMidTerm);
  const midTermArchivedToAppraisal = Boolean((selectedActivity as any)?.midTermArchivedToAppraisal);

  /** 与绩效活动详情步骤条一致：未满足前置归档时不可进入后续阶段（hover / 点击提示文案一致） */
  const getMonitoringPhaseStepBlockTitle = (phaseIndex: number): string | undefined => {
    if (isMonitoringActivityCompleted) return undefined;
    if (phaseIndex <= 0) return undefined;
    if (phaseIndex === 1 && !planStageArchivedToMidTerm) {
      return '请先在「组织绩效计划制定」阶段勾选已完成的数据，并点击「归档并进入下一步」后，方可进入「组织绩效中期回顾」。';
    }
    if (phaseIndex >= 2 && !midTermArchivedToAppraisal) {
      return '请先在「组织绩效中期回顾」最后一轮勾选已完成的数据，并点击「归档并进入下一步」后，方可进入「组织绩效考核」。';
    }
    return undefined;
  };

  const handleMonitoringPhaseStepClick = (phaseIndex: number, phaseName: string) => {
    const tip = getMonitoringPhaseStepBlockTitle(phaseIndex);
    if (tip) {
      setToast({ message: tip, type: 'warning' });
      return;
    }
    setSelectedPhase(phaseName);
  };

  // Phase Selection：阶段与轮次名称均来自当前选中活动的 config.phases
  const activityPhases = useMemo(() => {
    const p = selectedActivity?.config?.phases;
    return Array.isArray(p) && p.length > 0 ? p : DEFAULT_PERFORMANCE_MONITORING_PHASES;
  }, [selectedActivity]);

  const [selectedPhase, setSelectedPhase] = useState('');
  const [isPhaseDropdownOpen, setIsPhaseDropdownOpen] = useState(false);

  // Rounds Selection
  const [rounds, setRounds] = useState<any[]>([]);
  const [activeRoundId, setActiveRoundId] = useState('');
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  /** 切换活动时校正当前阶段；归档进度不足时仅能停留在已开放的最大阶段（与绩效活动详情一致） */
  useEffect(() => {
    if (!activityPhases.length) {
      setSelectedPhase('');
      setRounds([]);
      setActiveRoundId('');
      return;
    }
    if (isMonitoringActivityCompleted) {
      setSelectedPhase((prev) =>
        prev && activityPhases.some((x: any) => x.name === prev) ? prev : activityPhases[0]?.name || ''
      );
      return;
    }
    const maxIdx = !planStageArchivedToMidTerm ? 0 : !midTermArchivedToAppraisal ? 1 : activityPhases.length - 1;
    setSelectedPhase((prev) => {
      const inList = prev && activityPhases.some((x: any) => x.name === prev);
      const prevIdx = inList ? activityPhases.findIndex((x: any) => x.name === prev) : 0;
      const safeIdx = Math.min(Math.max(0, prevIdx), maxIdx);
      return activityPhases[safeIdx]?.name || activityPhases[0]?.name || '';
    });
  }, [
    selectedActivityId,
    activityPhases,
    isMonitoringActivityCompleted,
    planStageArchivedToMidTerm,
    midTermArchivedToAppraisal,
  ]);

  /** 当前阶段 / 活动变化时，同步轮次 Tab（优先活动详情写入的 phaseRoundTabs） */
  useEffect(() => {
    const phaseConfig = activityPhases.find((p) => p.name === selectedPhase);
    if (!phaseConfig?.showRounds) {
      setRounds([]);
      setActiveRoundId('');
      return;
    }
    const newRounds = resolveMonitoringPhaseRounds(selectedActivity, selectedPhase);
    setRounds(newRounds);
    setActiveRoundId((prev) => {
      if (newRounds.some((r) => r.id === prev)) return prev;
      const preferred =
        selectedPhase === MONITORING_PHASE_MID_TERM
          ? (selectedActivity as any)?.currentMidTermRoundId
          : selectedPhase === MONITORING_PHASE_APPRAISAL
            ? (selectedActivity as any)?.currentAppraisalRoundId
            : '';
      if (preferred && newRounds.some((r) => r.id === preferred)) return preferred;
      return newRounds[0]?.id || '';
    });
  }, [selectedPhase, activityPhases, selectedActivity, selectedActivityId]);

  const activeRound = rounds.find(r => r.id === activeRoundId) || (rounds.length > 0 ? rounds[0] : { id: '', name: '-' });

  const handleEditRound = (id: string, name: string) => {
    setEditingRoundId(id);
    setEditingValue(name);
  };

  const handleSaveRound = () => {
    if (editingRoundId && editingValue.trim()) {
      setRounds(prev => prev.map(r => r.id === editingRoundId ? { ...r, name: editingValue.trim() } : r));
    }
    setEditingRoundId(null);
  };

  const handleAddRound = () => {
    const newId = Date.now().toString();
    const newRound = { id: newId, name: `第${rounds.length + 1}轮考核` };
    setRounds([...rounds, newRound]);
    setActiveRoundId(newId);
  };

  const handleSendReminder = () => {
    if (selectedIds.length === 0) {
      setToast({ message: '请至少选择一条数据', type: 'info' });
      return;
    }
    setIsSendMessageDrawerOpen(true);
  };

  const toggleSelectAll = () => {
    const filtered = getFilteredData().slice(0, 10);
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(row => row.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleIntervention = (row: any) => {
    setSelectedRow(withProcessInterventionPendingContext(row));
    setIsInterventionModalOpen(true);
  };

  const handleApprovalChain = (row: any) => {
    setSelectedRow(row);
    setIsApprovalChainModalOpen(true);
  };

  const handleViewForm = (row: any) => {
    setSelectedRow(row);
    setIsFormDrawerOpen(true);
  };

  const phaseNodeConfigs: Record<string, any> = {
    '组织绩效计划制定': [
      { nodeName: '指标填报', role: 'leader' },
      { nodeName: '指标审核', role: 'hrbp' }
    ],
    '组织绩效中期回顾': [
      { nodeName: '指标回顾', role: 'leader' },
      { nodeName: '回顾审核', role: 'hrbp' }
    ],
    '组织绩效考核': [
      { nodeName: '自评', role: 'leader' },
      { nodeName: '上级评价', role: 'exec' },
      { nodeName: '隔级审核', role: 'standing' }
    ]
  };

  const baseTableData = [
    {
      id: 'D001',
      path: '集团总部/信息化中心',
      level: '一级部门',
      leader: '刘信息 (M1001)',
      hrbp: '李HR (H1001)',
      exec: '赵执委 (E1001)',
      standing: '钱常委 (S1001)',
      orgType: '能力中心',
      status: '进行中',
      interventionPendingNode: '数据提供人',
    },
    { id: 'D002', path: '集团总部/人力行政中心', level: '一级部门', leader: '张研发 (M1002)', hrbp: '李HR (H1001)', exec: '赵执委 (E1001)', standing: '钱常委 (S1001)', orgType: '职能部门', status: '滞留/超时' },
    { id: 'D003', path: '集团总部/财务管理中心', level: '一级部门', leader: '陈效能 (M1003)', hrbp: '王HR (H1002)', exec: '赵执委 (E1001)', standing: '钱常委 (S1001)', orgType: '职能部门', status: '未开始' },
    { id: 'D004', path: '集团总部/战略发展部', level: '一级部门', leader: '卫系统 (M1004)', hrbp: '王HR (H1002)', exec: '赵执委 (E1001)', standing: '钱常委 (S1001)', orgType: '职能部门', status: '已完成' },
    { id: 'D005', path: '集团总部/法务合规部', level: '一级部门', leader: '何法务 (M1005)', hrbp: '张BP (H1003)', exec: '孙执委 (E1002)', standing: '李常委 (S1002)', orgType: '能力中心', status: '进行中' },
    { id: 'D006', path: '集团总部/品牌营销部', level: '一级部门', leader: '曹营销 (M1006)', hrbp: '张BP (H1003)', exec: '孙执委 (E1002)', standing: '李常委 (S1002)', orgType: '职能部门', status: '未开始' },
    { id: 'D007', path: '集团总部/供应链管理中心', level: '一级部门', leader: '陶供应 (M1007)', hrbp: '赵BP (H1004)', exec: '孙执委 (E1002)', standing: '李常委 (S1002)', orgType: '经营单元', status: '未开始' },
    { id: 'D008', path: '集团总部/审计监察部', level: '一级部门', leader: '喻审计 (M1008)', hrbp: '赵BP (H1004)', exec: '孙执委 (E1002)', standing: '李常委 (S1002)', orgType: '职能部门', status: '未开始' },
    { id: 'D009', path: '集团总部/公共关系部', level: '一级部门', leader: '云公关 (M1009)', hrbp: '钱BP (H1005)', exec: '周执委 (E1003)', standing: '吴常委 (S1003)', orgType: '职能部门', status: '进行中' },
    { id: 'D010', path: '集团总部/技术研发中心', level: '一级部门', leader: '范技术 (M1010)', hrbp: '钱BP (H1005)', exec: '周执委 (E1003)', standing: '吴常委 (S1003)', orgType: '能力中心', status: '未开始' },
  ];

  const tableData = useMemo(
    () =>
      baseTableData.map((row, index) => {
        if (row.status === '未开始') {
          return { ...row, currentNode: '-', currentApprover: '-' };
        }
        if (row.status === '已完成') {
          return { ...row, currentNode: '已归档', currentApprover: '-' };
        }

        if (row.interventionPendingNode) {
          const pending = row.interventionPendingNode;
          const approver =
            pending === '数据提供人'
              ? '王五(003)、李红(004)'
              : pending === '一级部门负责人'
                ? '李四(002)'
                : pending === '主HRBP'
                  ? row.hrbp || '张三(001)'
                  : pending === '能力中心负责人'
                      ? '-'
                      : pending === '分管执委/常委'
                        ? '-'
                        : row.leader;
          return { ...row, currentNode: pending, currentApprover: approver };
        }

        const configs = phaseNodeConfigs[selectedPhase] || [];
        if (configs.length === 0) {
          return { ...row, currentNode: '-', currentApprover: '-' };
        }

        const configIndex = (index % 4 === 0 || index === 4) ? 0 : (index % 2 === 1 ? 1 : 2);
        const config = configs[configIndex];

        let approver = '-';
        if (config && config.role === 'leader') approver = row.leader;
        else if (config && config.role === 'hrbp') approver = row.hrbp;
        else if (config && config.role === 'exec') approver = (row as any).exec;
        else if (config && config.role === 'standing') approver = (row as any).standing;

        return {
          ...row,
          currentNode: config ? config.nodeName : '-',
          currentApprover: approver,
        };
      }),
    [selectedPhase]
  );

  const monitoringSummaryCards = useMemo(() => {
    const rows = tableData;
    const total = rows.length;
    const completed = rows.filter((r) => r.status === '已完成').length;
    const inProgress = rows.filter((r) => r.status === '进行中').length;
    const stuck = rows.filter((r) => r.status === '滞留/超时').length;
    const pct = total ? Math.round((completed / total) * 100) : 0;
    return [
      {
        key: 'assessmentTotal' as const,
        title: '考核部门数',
        value: String(total),
        subValue: '当前阶段应参与考核',
        color: 'text-gray-900',
        bgColor: 'bg-white',
      },
      {
        key: 'completed' as const,
        title: '已完成',
        value: String(completed),
        subValue: `占比 ${pct}%`,
        color: 'text-green-500',
        bgColor: 'bg-green-50/30',
      },
      {
        key: 'inProgress' as const,
        title: '进行中',
        value: String(inProgress),
        subValue: '流程正常流转中',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50/30',
      },
      {
        key: 'stuck' as const,
        title: '滞留 / 超时',
        value: String(stuck),
        subValue: stuck ? `${stuck} 个部门存在超时节点` : '暂无滞留',
        color: 'text-red-500',
        bgColor: 'bg-red-50/30',
      },
    ];
  }, [tableData]);

  const getFilteredData = () => {
    const q = monitoringSearchTerm.trim().toLowerCase();
    let rows = tableData;
    if (q) {
      rows = rows.filter((row) => {
        const pathShort = row.path.replace('集团总部/', '').toLowerCase();
        return (
          row.id.toLowerCase().includes(q) ||
          pathShort.includes(q) ||
          row.leader.toLowerCase().includes(q) ||
          row.hrbp.toLowerCase().includes(q)
        );
      });
    }
    if (monitoringSummaryKey === 'completed') {
      rows = rows.filter((r) => r.status === '已完成');
    } else if (monitoringSummaryKey === 'inProgress') {
      rows = rows.filter((r) => r.status === '进行中');
    } else if (monitoringSummaryKey === 'stuck') {
      rows = rows.filter((r) => r.status === '滞留/超时');
    }
    return rows.filter((row) => {
      for (const [key, values] of Object.entries(selectedFilters)) {
        const filterValues = values as any[];
        if (filterValues.length > 0) {
          const rowValue = (row as any)[key];
          if (!filterValues.includes(rowValue)) return false;
        }
      }
      return true;
    });
  };

  useEffect(() => {
    setMonitoringSummaryKey('assessmentTotal');
  }, [selectedActivityId, selectedPhase]);

  useEffect(() => {
    setPlanChangeSummaryKey('departments');
    setPlanChangeFilters({ orgType: [], status: [] });
    setPlanChangeToolbarDropdown(null);
    setPlanChangeSearchTerm('');
  }, [selectedActivityId]);

  useEffect(() => {
    if (monitoringViewTab !== '组织绩效考核流程监控') return;
    const timer = window.setTimeout(() => {
      monitoringSummaryFirstCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }, 120);
    return () => clearTimeout(timer);
  }, [monitoringViewTab]);

  useEffect(() => {
    if (monitoringViewTab !== '组织绩效计划变更监控') return;
    setPlanChangeSummaryKey('departments');
    setPlanChangeFilters({ orgType: [], status: [] });
    setPlanChangeToolbarDropdown(null);
    const timer = window.setTimeout(() => {
      planChangeSummaryFirstCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }, 120);
    return () => clearTimeout(timer);
  }, [monitoringViewTab]);

  const planChangeRows = useMemo(() => {
    const rows = planChangeSubjectsByActivityId[selectedActivityId];
    if (Array.isArray(rows) && rows.length > 0) return rows;
    return [];
  }, [planChangeSubjectsByActivityId, selectedActivityId]);

  const planChangeSummaryCards = useMemo(() => {
    const total = planChangeRows.length;
    const done = planChangeRows.filter((r) => r.status === '已完成').length;
    const ing = planChangeRows.filter((r) => r.status === '进行中').length;
    const stuck = planChangeRows.filter((r) => r.status === '滞留/超时').length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return [
      {
        key: 'departments' as const,
        title: '涉及部门数',
        value: String(total),
        subValue: '当前存在计划变更流程',
        color: 'text-gray-900',
        bgColor: 'bg-white',
      },
      {
        key: 'completed' as const,
        title: '已完成',
        value: String(done),
        subValue: `占比 ${pct}%`,
        color: 'text-green-500',
        bgColor: 'bg-green-50/30',
      },
      {
        key: 'inProgress' as const,
        title: '进行中',
        value: String(ing),
        subValue: '变更流程处理中',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50/30',
      },
      {
        key: 'stuck' as const,
        title: '滞留 / 超时',
        value: String(stuck),
        subValue: stuck ? `${stuck} 个部门存在超时节点` : '暂无滞留',
        color: 'text-red-500',
        bgColor: 'bg-red-50/30',
      },
    ];
  }, [planChangeRows]);

  const getPlanChangeColumnOptions = (column: 'orgType' | 'status') => {
    return Array.from(new Set(planChangeRows.map((r) => r[column]).filter((v) => v && v !== '-'))).sort();
  };

  const togglePlanChangeFilterValue = (column: 'orgType' | 'status', value: string) => {
    setPlanChangeFilters((prev) => {
      const cur = prev[column];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      return { ...prev, [column]: next };
    });
  };

  const clearPlanChangeFilter = (column: 'orgType' | 'status') => {
    setPlanChangeFilters((prev) => ({ ...prev, [column]: [] }));
  };

  const getPlanChangeFilteredRows = () => {
    const q = planChangeSearchTerm.trim().toLowerCase();
    let rows = planChangeRows;
    if (q) {
      rows = rows.filter((row) => {
        const pathShort = row.path.replace('集团总部/', '').toLowerCase();
        const org = String(row.orgType ?? '').toLowerCase();
        const node = String(row.currentNode ?? '').toLowerCase();
        const st = String(row.status ?? '').toLowerCase();
        const appr = String(row.currentApprover ?? '').toLowerCase();
        return (
          row.id.toLowerCase().includes(q) ||
          pathShort.includes(q) ||
          row.leader.toLowerCase().includes(q) ||
          row.hrbp.toLowerCase().includes(q) ||
          org.includes(q) ||
          node.includes(q) ||
          st.includes(q) ||
          appr.includes(q)
        );
      });
    }
    if (planChangeFilters.orgType.length) {
      rows = rows.filter((r) => planChangeFilters.orgType.includes(r.orgType));
    }
    if (planChangeFilters.status.length) {
      rows = rows.filter((r) => planChangeFilters.status.includes(r.status));
    }
    if (planChangeSummaryKey === 'completed') {
      rows = rows.filter((r) => r.status === '已完成');
    } else if (planChangeSummaryKey === 'inProgress') {
      rows = rows.filter((r) => r.status === '进行中');
    } else if (planChangeSummaryKey === 'stuck') {
      rows = rows.filter((r) => r.status === '滞留/超时');
    }
    return rows;
  };

  const handlePlanChangeSendReminder = () => {
    if (planChangeSelectedIds.length === 0) {
      setToast({ message: '请至少选择一条数据', type: 'info' });
      return;
    }
    setIsSendMessageDrawerOpen(true);
  };

  const handlePlanChangeExport = () => {
    const rows = getPlanChangeFilteredRows();
    if (rows.length === 0) {
      setToast({ message: '当前筛选条件下暂无数据可导出', type: 'info' });
      return;
    }
    setToast({ message: `已导出 ${rows.length} 条计划变更监控数据`, type: 'success' });
  };

  const handlePlanChangeBatchExportForms = () => {
    if (planChangeSelectedIds.length === 0) {
      setToast({ message: '请至少选择一条数据', type: 'info' });
      return;
    }
    setToast({ message: `已批量导出 ${planChangeSelectedIds.length} 份表单`, type: 'success' });
  };

  const togglePlanChangeSelectAll = () => {
    const filtered = getPlanChangeFilteredRows().slice(0, 10);
    if (planChangeSelectedIds.length === filtered.length && filtered.length > 0) {
      setPlanChangeSelectedIds([]);
    } else {
      setPlanChangeSelectedIds(filtered.map((r) => r.id));
    }
  };

  const togglePlanChangeSelectRow = (id: string) => {
    setPlanChangeSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };


  return (
    <div className="flex-1 flex flex-col h-full bg-[#f4f5f7] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <h1 className="text-[18px] font-bold text-gray-900 shrink-0">组织绩效流程监控</h1>
          <div className="flex items-center h-9 rounded-lg bg-gray-100 p-0.5 gap-0.5 shrink-0">
            {(['组织绩效考核流程监控', '组织绩效计划变更监控'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setMonitoringViewTab(tab);
                  setSelectedIds([]);
                  setPlanChangeSelectedIds([]);
                  if (tab === '组织绩效考核流程监控') {
                    setMonitoringSummaryKey('assessmentTotal');
                    setToolbarFilterDropdown(null);
                  }
                }}
                className={`h-full px-4 rounded-md text-[13px] font-medium whitespace-nowrap transition-all ${
                  monitoringViewTab === tab
                    ? 'bg-white text-[#2f54eb] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div 
              onClick={() => setIsActivityDropdownOpen(!isActivityDropdownOpen)}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-1.5 cursor-pointer hover:border-[#2f54eb] transition-colors min-w-[200px] justify-between"
            >
              <span className="text-[13px] text-gray-600">
                {selectedActivity?.name || '请选择活动'}
              </span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${isActivityDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
              {isActivityDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsActivityDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded shadow-lg z-40 py-1 max-h-[300px] overflow-y-auto"
                  >
                    {ongoingActivities.length > 0 ? (
                      ongoingActivities.map((activity) => (
                        <div
                          key={activity.id}
                          onClick={() => {
                            setSelectedActivityId(activity.id);
                            setIsActivityDropdownOpen(false);
                          }}
                          className={`px-4 py-2 text-[13px] cursor-pointer hover:bg-gray-50 flex items-center justify-between ${selectedActivityId === activity.id ? 'text-[#2f54eb] bg-blue-50/50 font-medium' : 'text-gray-600'}`}
                        >
                          {activity.name}
                          {selectedActivityId === activity.id && <div className="w-1.5 h-1.5 rounded-full bg-[#2f54eb]" />}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-[13px] text-gray-400 text-center">暂无进行中活动</div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {monitoringViewTab === '组织绩效考核流程监控' ? (
      <>
      {/* Phase Progress and Rounds */}
      <div className="bg-white border-b border-gray-100 flex flex-col">
        {/* Phase Steps */}
        <div className="px-12 py-5 flex items-center justify-center relative">
          <div className="absolute left-[15%] right-[15%] h-[1px] bg-gray-100" />
          <div 
            className="absolute left-[15%] h-[1px] bg-[#2f54eb] transition-all duration-300" 
            style={{ 
              right: selectedPhase === activityPhases[0]?.name 
                ? '85%' 
                : selectedPhase === activityPhases[1]?.name 
                  ? '50%' 
                  : '15%' 
            }} 
          />
          
          <div className="flex justify-between w-full max-w-4xl relative z-10 px-8">
              {activityPhases.map((p, idx) => {
                const phaseStepBlockTitle = getMonitoringPhaseStepBlockTitle(idx);
                const phaseStepLocked = Boolean(phaseStepBlockTitle);
                return (
                <div
                  key={p.name}
                  role="button"
                  tabIndex={0}
                  title={phaseStepBlockTitle}
                  onClick={() => handleMonitoringPhaseStepClick(idx, p.name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleMonitoringPhaseStepClick(idx, p.name);
                    }
                  }}
                  className={`flex flex-col items-center gap-1 group outline-none ${
                    phaseStepLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    phaseStepLocked ? 'opacity-60' : ''
                  } ${
                    p.name === selectedPhase ? 'bg-[#2f54eb] border-[#2f54eb] text-white' : idx === 0 ? 'bg-white border-[#2f54eb] text-[#2f54eb]' : `bg-white border-gray-200 text-gray-400 ${phaseStepLocked ? '' : 'group-hover:border-gray-300'}`
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex flex-col items-center" title={phaseStepBlockTitle}>
                    <span className={`text-[13px] font-bold transition-colors ${p.name === selectedPhase ? 'text-[#2f54eb]' : 'text-gray-500'}`}>{p.name}</span>
                    <span className="text-[11px] text-gray-400 min-w-max bg-gray-50/50 px-1.5 py-0.5 rounded border border-gray-100/50">{p.date}</span>
                  </div>
                </div>
                );
              })}
          </div>
        </div>

        {/* Rounds Tabs：中期回顾 / 组织绩效考核等多轮阶段 */}
        {activityPhases.find((p) => p.name === selectedPhase)?.showRounds && rounds.length > 0 && (
          <div className="px-6 flex items-center gap-1 border-b border-gray-100 bg-white">
            {rounds.map((round) => (
              <div 
                key={round.id}
                className={`group flex items-center gap-2 px-6 py-2.5 border-t-2 border-x transition-all cursor-pointer relative ${
                  activeRoundId === round.id 
                    ? 'border-t-[#2f54eb] border-x-gray-100 bg-white text-[#2f54eb] font-bold z-10 shadow-[0_-2px_8px_rgba(0,0,0,0.02)]' 
                    : 'border-t-transparent border-x-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveRoundId(round.id)}
              >
                <span className="text-[13px]">{round.name}</span>
                {activeRoundId === round.id && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-white" />}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          {monitoringSummaryCards.map((card, idx) => (
            <div
              key={card.key}
              ref={idx === 0 ? monitoringSummaryFirstCardRef : undefined}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setMonitoringSummaryKey(card.key);
                }
              }}
              onClick={() => setMonitoringSummaryKey(card.key)}
              className={`${card.bgColor} p-5 rounded-sm shadow-sm relative overflow-hidden group hover:shadow-md transition-all cursor-pointer border ${
                monitoringSummaryKey === card.key
                  ? 'ring-2 ring-[#2f54eb] ring-offset-2 border-[#2f54eb]/40'
                  : 'border-gray-100/80'
              }`}
            >
              <div className="relative z-10 flex flex-col py-1">
                <span className="text-[13px] text-gray-500 mb-2">{card.title}</span>
                <div className="flex items-baseline gap-3">
                  <span className={`text-[32px] font-bold leading-none ${card.color}`}>{card.value}</span>
                  <span className="text-[12px] text-gray-400 font-normal">{card.subValue}</span>
                </div>
              </div>

              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gray-50/50 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
              {card.color !== 'text-gray-900' && (
                <div className={`absolute top-0 right-0 w-1 h-full opacity-40 ${card.color.replace('text-', 'bg-')}`} />
              )}
            </div>
          ))}
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-3 rounded shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <div className="relative w-80 shrink-0">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索部门编码/名称/负责人/HRBP"
                value={monitoringSearchTerm}
                onChange={(e) => setMonitoringSearchTerm(e.target.value)}
                className="w-full pl-9 pr-12 py-1.5 border border-gray-200 rounded text-[13px] outline-none focus:border-[#2f54eb] bg-gray-50/50"
              />
              {monitoringSearchTerm && (
                <button
                  type="button"
                  onClick={() => setMonitoringSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setToolbarFilterDropdown((d) => (d === 'orgType' ? null : 'orgType'))}
                className={`flex items-center gap-1.5 min-w-[120px] justify-between border rounded px-3 py-1.5 text-[13px] transition-colors cursor-pointer ${
                  toolbarFilterDropdown === 'orgType' || (selectedFilters.orgType?.length ?? 0) > 0
                    ? 'border-[#2f54eb] text-[#2f54eb] bg-blue-50/40'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="truncate">组织类型</span>
                <span className="flex items-center gap-1 shrink-0">
                  {(selectedFilters.orgType?.length ?? 0) > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-[#2f54eb]/15 text-[11px] font-medium">
                      {selectedFilters.orgType.length}
                    </span>
                  )}
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${toolbarFilterDropdown === 'orgType' ? 'rotate-180' : ''}`} />
                </span>
              </button>
              <AnimatePresence>
                {toolbarFilterDropdown === 'orgType' && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setToolbarFilterDropdown(null)} />
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute left-0 top-full mt-1 w-[240px] max-h-[280px] overflow-y-auto bg-white border border-gray-100 rounded-lg shadow-xl z-40 py-2"
                    >
                      <div className="px-3 pb-2 flex items-center justify-between border-b border-gray-50 mb-1">
                        <span className="text-[12px] font-bold text-gray-900">组织类型</span>
                        {(selectedFilters.orgType?.length ?? 0) > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearFilter('orgType');
                            }}
                            className="text-[11px] text-[#2f54eb] hover:underline"
                          >
                            清空
                          </button>
                        )}
                      </div>
                      {getColumnOptions('orgType').map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer group"
                        >
                          <div
                            role="presentation"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFilterValue('orgType', opt);
                            }}
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                              selectedFilters.orgType?.includes(opt)
                                ? 'bg-[#2f54eb] border-[#2f54eb]'
                                : 'border-gray-300 group-hover:border-gray-400'
                            }`}
                          >
                            {selectedFilters.orgType?.includes(opt) && <Check size={10} className="text-white" />}
                          </div>
                          <span className="text-[13px] text-gray-700 truncate">{opt}</span>
                        </label>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setToolbarFilterDropdown((d) => (d === 'status' ? null : 'status'))}
                className={`flex items-center gap-1.5 min-w-[120px] justify-between border rounded px-3 py-1.5 text-[13px] transition-colors cursor-pointer ${
                  toolbarFilterDropdown === 'status' || (selectedFilters.status?.length ?? 0) > 0
                    ? 'border-[#2f54eb] text-[#2f54eb] bg-blue-50/40'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="truncate">状态</span>
                <span className="flex items-center gap-1 shrink-0">
                  {(selectedFilters.status?.length ?? 0) > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-[#2f54eb]/15 text-[11px] font-medium">
                      {selectedFilters.status.length}
                    </span>
                  )}
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${toolbarFilterDropdown === 'status' ? 'rotate-180' : ''}`} />
                </span>
              </button>
              <AnimatePresence>
                {toolbarFilterDropdown === 'status' && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setToolbarFilterDropdown(null)} />
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute left-0 top-full mt-1 w-[240px] max-h-[280px] overflow-y-auto bg-white border border-gray-100 rounded-lg shadow-xl z-40 py-2"
                    >
                      <div className="px-3 pb-2 flex items-center justify-between border-b border-gray-50 mb-1">
                        <span className="text-[12px] font-bold text-gray-900">状态</span>
                        {(selectedFilters.status?.length ?? 0) > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearFilter('status');
                            }}
                            className="text-[11px] text-[#2f54eb] hover:underline"
                          >
                            清空
                          </button>
                        )}
                      </div>
                      {getColumnOptions('status').map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer group"
                        >
                          <div
                            role="presentation"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFilterValue('status', opt);
                            }}
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                              selectedFilters.status?.includes(opt)
                                ? 'bg-[#2f54eb] border-[#2f54eb]'
                                : 'border-gray-300 group-hover:border-gray-400'
                            }`}
                          >
                            {selectedFilters.status?.includes(opt) && <Check size={10} className="text-white" />}
                          </div>
                          <span className="text-[13px] text-gray-700 truncate">{opt}</span>
                        </label>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => {
                setMonitoringSearchTerm('');
                setMonitoringSummaryKey('assessmentTotal');
                setToolbarFilterDropdown(null);
                setSelectedFilters({
                  path: [],
                  orgType: [],
                  level: [],
                  currentNode: [],
                  currentApprover: [],
                  status: [],
                });
              }}
              className="px-4 py-1.5 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
            >
              重置
            </button>
            <button
              type="button"
              className="px-4 py-1.5 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Download size={14} />
              导出
            </button>
            <button
              type="button"
              className="px-4 py-1.5 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Download size={14} />
              批量导出表单
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSendReminder}
              className="px-4 py-1.5 bg-orange-50 border border-orange-200 text-orange-600 rounded text-[13px] hover:bg-orange-100 transition-colors flex items-center gap-1.5"
            >
              <Share2 size={14} className="rotate-90" />
              发送提醒
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 text-[12px] text-gray-500 border-b border-gray-100">
                <th className="w-[48px] py-3 px-4 bg-gray-50/50">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-[#2f54eb] focus:ring-[#2f54eb] cursor-pointer" 
                    checked={selectedIds.length > 0 && selectedIds.length === getFilteredData().slice(0, 10).length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="w-[100px] py-3 px-4 font-medium text-left bg-gray-50/50 whitespace-nowrap">部门编码</th>
                <th className="w-[200px] py-3 px-4 font-medium text-left bg-gray-50/50 whitespace-nowrap relative">
                  <div className="flex items-center gap-1">
                    部门名称
                  </div>
                </th>
                <th className="w-[120px] py-3 px-3 font-medium text-left whitespace-nowrap relative">
                  <div className="flex items-center gap-1">
                    组织类型
                  </div>
                </th>
                <th className="w-[150px] py-3 px-3 font-medium text-left whitespace-nowrap relative">
                  <div className="flex items-center gap-1">
                    当前办理节点
                  </div>
                </th>
                <th className="w-[150px] py-3 px-3 font-medium text-left whitespace-nowrap relative">
                  <div className="flex items-center gap-1">
                    当前办理人
                  </div>
                </th>
                <th className="w-[120px] py-3 px-3 font-medium text-left whitespace-nowrap relative">
                  <div className="flex items-center gap-1">
                    状态
                  </div>
                </th>
                <th className="py-3 px-4 font-medium text-right sticky right-0 bg-gray-50 z-20 shadow-[-4px_0_8px_rgba(0,0,0,0.05)] whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {getFilteredData().slice(0, 10).map((row) => (
                <tr key={row.id} className={`border-b border-gray-50 hover:bg-gray-50/30 transition-colors ${selectedIds.includes(row.id) ? 'bg-blue-50/20' : ''}`}>
                  <td className="py-3 px-4 bg-transparent">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-[#2f54eb] focus:ring-[#2f54eb] cursor-pointer" 
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleSelectRow(row.id)}
                    />
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-mono bg-white whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 bg-white whitespace-nowrap">
                    {row.path.replace('集团总部/', '')}
                  </td>
                  <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                    <span className="text-[13px]">{row.orgType}</span>
                  </td>
                  <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                    {row.currentNode === '-' ? (
                      <span className="text-gray-300">-</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] border bg-blue-50 text-[#2f54eb] border-blue-100">
                        {row.currentNode}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                    <span className="text-[13px]">{row.currentApprover}</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      row.status === '已完成' ? 'bg-green-50 text-green-600 border border-green-100' :
                      row.status === '进行中' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      row.status === '滞留/超时' ? 'bg-red-50 text-red-600 border border-red-100' :
                      'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right sticky right-0 bg-white z-10 shadow-[-4px_0_8px_rgba(0,0,0,0.05)] whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleIntervention(row)}
                        className="text-[#2f54eb] hover:underline whitespace-nowrap"
                      >
                        流程干预
                      </button>
                      <button 
                        onClick={() => handleApprovalChain(row)}
                        className="text-[#2f54eb] hover:underline whitespace-nowrap"
                      >
                        审批链
                      </button>
                      <button
                        type="button"
                        onClick={() => handleViewForm(row)}
                        className="text-[#2f54eb] hover:underline whitespace-nowrap"
                      >
                        查看表单
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-4 text-[12px] text-gray-500 py-2">
          <span>第 1 页 / 共 3 页</span>
          <div className="flex items-center gap-1">
            <button className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30" disabled>
              <ChevronLeft size={12} />
            </button>
            <button className="w-6 h-6 flex items-center justify-center bg-[#2f54eb] text-white rounded shadow-sm">1</button>
            <button className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50">2</button>
            <button className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50">3</button>
            <button className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50">
              <ChevronRight size={12} />
            </button>
          </div>
          <div className="relative">
            <select className="border border-gray-200 rounded pl-2 pr-6 py-0.5 outline-none appearance-none bg-white cursor-pointer">
              <option>10条/页</option>
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      </>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            <div className="grid grid-cols-4 gap-4">
              {planChangeSummaryCards.map((card, idx) => (
                <div
                  key={card.key}
                  ref={idx === 0 ? planChangeSummaryFirstCardRef : undefined}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setPlanChangeSummaryKey(card.key);
                    }
                  }}
                  onClick={() => setPlanChangeSummaryKey(card.key)}
                  className={`${card.bgColor} p-5 rounded-sm shadow-sm relative overflow-hidden group hover:shadow-md transition-all cursor-pointer border ${
                    planChangeSummaryKey === card.key
                      ? 'ring-2 ring-[#2f54eb] ring-offset-2 border-[#2f54eb]/40'
                      : 'border-gray-100/80'
                  }`}
                >
                  <div className="relative z-10 flex flex-col py-1">
                    <span className="text-[13px] text-gray-500 mb-2">{card.title}</span>
                    <div className="flex items-baseline gap-3">
                      <span className={`text-[32px] font-bold leading-none ${card.color}`}>{card.value}</span>
                      <span className="text-[12px] text-gray-400 font-normal">{card.subValue}</span>
                    </div>
                  </div>
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gray-50/50 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                  {card.color !== 'text-gray-900' && (
                    <div className={`absolute top-0 right-0 w-1 h-full opacity-40 ${card.color.replace('text-', 'bg-')}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white p-3 rounded shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 min-w-0">
                <div className="relative w-80 shrink-0">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索部门编码/名称/负责人/HRBP"
                    value={planChangeSearchTerm}
                    onChange={(e) => setPlanChangeSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-10 py-1.5 border border-gray-200 rounded text-[13px] outline-none focus:border-[#2f54eb] bg-gray-50/50"
                  />
                  {planChangeSearchTerm && (
                    <button
                      type="button"
                      onClick={() => setPlanChangeSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setPlanChangeToolbarDropdown((d) => (d === 'orgType' ? null : 'orgType'))}
                    className={`flex items-center gap-1.5 min-w-[120px] justify-between border rounded px-3 py-1.5 text-[13px] transition-colors cursor-pointer ${
                      planChangeToolbarDropdown === 'orgType' || planChangeFilters.orgType.length > 0
                        ? 'border-[#2f54eb] text-[#2f54eb] bg-blue-50/40'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="truncate">组织类型</span>
                    <span className="flex items-center gap-1 shrink-0">
                      {planChangeFilters.orgType.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-[#2f54eb]/15 text-[11px] font-medium">
                          {planChangeFilters.orgType.length}
                        </span>
                      )}
                      <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform ${planChangeToolbarDropdown === 'orgType' ? 'rotate-180' : ''}`}
                      />
                    </span>
                  </button>
                  <AnimatePresence>
                    {planChangeToolbarDropdown === 'orgType' && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setPlanChangeToolbarDropdown(null)} />
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          className="absolute left-0 top-full mt-1 w-[240px] max-h-[280px] overflow-y-auto bg-white border border-gray-100 rounded-lg shadow-xl z-40 py-2"
                        >
                          <div className="px-3 pb-2 flex items-center justify-between border-b border-gray-50 mb-1">
                            <span className="text-[12px] font-bold text-gray-900">组织类型</span>
                            {planChangeFilters.orgType.length > 0 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearPlanChangeFilter('orgType');
                                }}
                                className="text-[11px] text-[#2f54eb] hover:underline"
                              >
                                清空
                              </button>
                            )}
                          </div>
                          {getPlanChangeColumnOptions('orgType').map((opt) => (
                            <label key={opt} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer group">
                              <div
                                role="presentation"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePlanChangeFilterValue('orgType', opt);
                                }}
                                className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                  planChangeFilters.orgType.includes(opt)
                                    ? 'bg-[#2f54eb] border-[#2f54eb]'
                                    : 'border-gray-300 group-hover:border-gray-400'
                                }`}
                              >
                                {planChangeFilters.orgType.includes(opt) && <Check size={10} className="text-white" />}
                              </div>
                              <span className="text-[13px] text-gray-700 truncate">{opt}</span>
                            </label>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setPlanChangeToolbarDropdown((d) => (d === 'status' ? null : 'status'))}
                    className={`flex items-center gap-1.5 min-w-[120px] justify-between border rounded px-3 py-1.5 text-[13px] transition-colors cursor-pointer ${
                      planChangeToolbarDropdown === 'status' || planChangeFilters.status.length > 0
                        ? 'border-[#2f54eb] text-[#2f54eb] bg-blue-50/40'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="truncate">状态</span>
                    <span className="flex items-center gap-1 shrink-0">
                      {planChangeFilters.status.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-[#2f54eb]/15 text-[11px] font-medium">
                          {planChangeFilters.status.length}
                        </span>
                      )}
                      <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform ${planChangeToolbarDropdown === 'status' ? 'rotate-180' : ''}`}
                      />
                    </span>
                  </button>
                  <AnimatePresence>
                    {planChangeToolbarDropdown === 'status' && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setPlanChangeToolbarDropdown(null)} />
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          className="absolute left-0 top-full mt-1 w-[240px] max-h-[280px] overflow-y-auto bg-white border border-gray-100 rounded-lg shadow-xl z-40 py-2"
                        >
                          <div className="px-3 pb-2 flex items-center justify-between border-b border-gray-50 mb-1">
                            <span className="text-[12px] font-bold text-gray-900">状态</span>
                            {planChangeFilters.status.length > 0 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearPlanChangeFilter('status');
                                }}
                                className="text-[11px] text-[#2f54eb] hover:underline"
                              >
                                清空
                              </button>
                            )}
                          </div>
                          {getPlanChangeColumnOptions('status').map((opt) => (
                            <label key={opt} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer group">
                              <div
                                role="presentation"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePlanChangeFilterValue('status', opt);
                                }}
                                className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                  planChangeFilters.status.includes(opt)
                                    ? 'bg-[#2f54eb] border-[#2f54eb]'
                                    : 'border-gray-300 group-hover:border-gray-400'
                                }`}
                              >
                                {planChangeFilters.status.includes(opt) && <Check size={10} className="text-white" />}
                              </div>
                              <span className="text-[13px] text-gray-700 truncate">{opt}</span>
                            </label>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPlanChangeSearchTerm('');
                    setPlanChangeSummaryKey('departments');
                    setPlanChangeFilters({ orgType: [], status: [] });
                    setPlanChangeToolbarDropdown(null);
                  }}
                  className="px-4 py-1.5 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
                >
                  重置
                </button>
                <button
                  type="button"
                  onClick={handlePlanChangeExport}
                  className="px-4 py-1.5 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Download size={14} />
                  导出
                </button>
                <button
                  type="button"
                  onClick={handlePlanChangeBatchExportForms}
                  className="px-4 py-1.5 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Download size={14} />
                  批量导出表单
                </button>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePlanChangeSendReminder}
                  className="px-4 py-1.5 bg-orange-50 border border-orange-200 text-orange-600 rounded text-[13px] hover:bg-orange-100 transition-colors flex items-center gap-1.5"
                >
                  <Share2 size={14} className="rotate-90" />
                  发送提醒
                </button>
              </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-100 overflow-x-auto">
              <table className="w-full border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-50/50 text-[12px] text-gray-500 border-b border-gray-100">
                    <th className="w-[48px] py-3 px-4 bg-gray-50/50">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#2f54eb] focus:ring-[#2f54eb] cursor-pointer"
                        checked={
                          planChangeSelectedIds.length > 0 &&
                          planChangeSelectedIds.length === getPlanChangeFilteredRows().slice(0, 10).length
                        }
                        onChange={togglePlanChangeSelectAll}
                      />
                    </th>
                    <th className="w-[100px] py-3 px-4 font-medium text-left bg-gray-50/50 whitespace-nowrap">部门编码</th>
                    <th className="w-[200px] py-3 px-4 font-medium text-left bg-gray-50/50 whitespace-nowrap">部门名称</th>
                    <th className="w-[120px] py-3 px-3 font-medium text-left whitespace-nowrap">组织类型</th>
                    <th className="w-[150px] py-3 px-3 font-medium text-left whitespace-nowrap">当前办理节点</th>
                    <th className="w-[150px] py-3 px-3 font-medium text-left whitespace-nowrap">当前办理人</th>
                    <th className="w-[120px] py-3 px-3 font-medium text-left whitespace-nowrap">状态</th>
                    <th className="py-3 px-4 font-medium text-right sticky right-0 bg-gray-50 z-20 shadow-[-4px_0_8px_rgba(0,0,0,0.05)] whitespace-nowrap">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {getPlanChangeFilteredRows()
                    .slice(0, 10)
                    .map((row) => (
                      <tr
                        key={row.id}
                        className={`border-b border-gray-50 hover:bg-gray-50/30 transition-colors ${
                          planChangeSelectedIds.includes(row.id) ? 'bg-blue-50/20' : ''
                        }`}
                      >
                        <td className="py-3 px-4 bg-transparent">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-[#2f54eb] focus:ring-[#2f54eb] cursor-pointer"
                            checked={planChangeSelectedIds.includes(row.id)}
                            onChange={() => togglePlanChangeSelectRow(row.id)}
                          />
                        </td>
                        <td className="py-3 px-4 text-gray-600 font-mono bg-white whitespace-nowrap">{row.id}</td>
                        <td className="py-3 px-4 font-medium text-gray-900 bg-white whitespace-nowrap">
                          {row.path.replace('集团总部/', '')}
                        </td>
                        <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                          <span className="text-[13px]">{row.orgType}</span>
                        </td>
                        <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                          {row.currentNode === '-' ? (
                            <span className="text-gray-300">-</span>
                          ) : row.currentNode === '已归档' ? (
                            <span className="px-2 py-0.5 rounded text-[11px] border bg-gray-100 text-gray-600 border-gray-200">
                              {row.currentNode}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] border bg-blue-50 text-[#2f54eb] border-blue-100">
                              {row.currentNode}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                          <span className="text-[13px]">{row.currentApprover}</span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              row.status === '已完成'
                                ? 'bg-green-50 text-green-600 border border-green-100'
                                : row.status === '进行中'
                                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                  : row.status === '滞留/超时'
                                    ? 'bg-red-50 text-red-600 border border-red-100'
                                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right sticky right-0 bg-white z-10 shadow-[-4px_0_8px_rgba(0,0,0,0.05)] whitespace-nowrap">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => handleIntervention(row)}
                              className="text-[#2f54eb] hover:underline whitespace-nowrap"
                            >
                              流程干预
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApprovalChain(row)}
                              className="text-[#2f54eb] hover:underline whitespace-nowrap"
                            >
                              审批链
                            </button>
                            <button
                              type="button"
                              onClick={() => handleViewForm(row)}
                              className="text-[#2f54eb] hover:underline whitespace-nowrap"
                            >
                              查看表单
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-4 text-[12px] text-gray-500 py-2">
              <span>第 1 页 / 共 3 页</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30"
                  disabled
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center bg-[#2f54eb] text-white rounded shadow-sm"
                >
                  1
                </button>
                <button type="button" className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50">
                  2
                </button>
                <button type="button" className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50">
                  3
                </button>
                <button type="button" className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50">
                  <ChevronRight size={12} />
                </button>
              </div>
              <div className="relative">
                <select className="border border-gray-200 rounded pl-2 pr-6 py-0.5 outline-none appearance-none bg-white cursor-pointer">
                  <option>10条/页</option>
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {isSendMessageDrawerOpen && (
          <SendMessageReminderDrawer 
            isOpen={isSendMessageDrawerOpen}
            onClose={() => setIsSendMessageDrawerOpen(false)}
            selectedCount={monitoringViewTab === '组织绩效考核流程监控' ? selectedIds.length : planChangeSelectedIds.length}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInterventionModalOpen && (
          <ProcessInterventionModal 
            isOpen={isInterventionModalOpen} 
            onClose={() => setIsInterventionModalOpen(false)} 
            data={selectedRow}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isApprovalChainModalOpen && (
          <ApprovalChainModal 
            isOpen={isApprovalChainModalOpen} 
            onClose={() => setIsApprovalChainModalOpen(false)} 
            data={selectedRow}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFormDrawerOpen && selectedRow && (
          <MonitoringAssessmentFormDrawer
            isOpen={isFormDrawerOpen}
            onClose={() => setIsFormDrawerOpen(false)}
            row={selectedRow}
            activityName={selectedActivity?.name || '—'}
            phaseName={
              monitoringViewTab === '组织绩效计划变更监控'
                ? '组织绩效计划变更'
                : selectedPhase || '组织绩效计划制定'
            }
            roundName={activeRound?.name}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[1000] bg-white border border-gray-100 shadow-xl rounded-full px-6 py-2.5 flex items-center gap-3 max-w-[min(92vw,720px)]"
          >
            {toast.type === 'warning' ? (
              <div className="w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                <AlertCircle size={14} />
              </div>
            ) : toast.type === 'error' ? (
              <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                <X size={12} />
              </div>
            ) : toast.type === 'success' ? (
              <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                <CheckCircle2 size={13} />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                <Info size={12} />
              </div>
            )}
            <span className="text-[14px] text-gray-700 font-medium leading-snug">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 发送消息提醒抽屉组件 ---
const SendMessageReminderDrawer = ({ isOpen, onClose, selectedCount }: any) => {
  const [formData, setFormData] = useState<{
    scope: string;
    receivers: string[];
    methods: string[];
    methodTemplates: { [key: string]: string };
    title: string;
    content: string;
  }>({
    scope: '全部',
    receivers: ['当前审批人'],
    methods: ['企微消息'],
    methodTemplates: {
      '企微消息': ''
    },
    title: '',
    content: ''
  });

  const availableParams = ['员工姓名', '直接上级姓名', '员工部门', '考核周期', '阶段窗口期开始日期', '阶段窗口期结束日期', '节点窗口期开始日期', '节点窗口期结束日期'];

  const insertParam = (param: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + `@${param} `
    }));
  };

  const methodOptions = [
    { id: '企微消息', label: '发企微', icon: <MessageCircle size={18} /> }
  ];
  const [activeMethodTab, setActiveMethodTab] = useState(methodOptions[0].id);

  const templateMockData: { [key: string]: { title: string, content: string } } = {
    'default': {
      title: '【待办提醒】关于组织绩效考核流程处理通知',
      content: '您处理的项目 {@考核周期} 已经开始，请于 {@节点窗口期结束日期} 前完成 {@考核阶段} 处理。\n点击查看详情：${系统链接}'
    },
    'timeout': {
      title: '【超时提醒】组织绩效考核节点已逾期',
      content: '您处理的项目 {@考核周期} 的 {@考核阶段} 已于 {@节点窗口期结束日期} 到期，目前处于逾期状态，请尽快处理。\n点击查看详情：${系统链接}'
    },
    'mail_urgent': {
      title: '【紧急任务】请尽快处理您的组织绩效考核待办',
      content: '紧急通知：您在 {@考核周期} 中的考核任务即将关闭。请务必在 {@阶段窗口期结束日期} 之前登录系统完成。'
    },
    '': {
      title: '（未选择模板）',
      content: '请在上方选择消息模板以预览具体内容'
    }
  };

  const toggleMethod = (method: string) => {
    setFormData(prev => {
      const isRemoving = prev.methods.includes(method);
      const newMethods = isRemoving 
        ? prev.methods.filter(m => m !== method) 
        : [...prev.methods, method];
      
      // Keep at least one method
      if (newMethods.length === 0) return prev;

      // Update active tab if removing active one
      if (isRemoving && activeMethodTab === method) {
        setActiveMethodTab(newMethods[0]);
      } else if (!isRemoving && prev.methods.length === 0) {
        setActiveMethodTab(method);
      }

      return {
        ...prev,
        methods: newMethods,
        methodTemplates: {
          ...prev.methodTemplates,
          [method]: isRemoving ? '' : prev.methodTemplates[method]
        }
      };
    });
  };

  const updateMethodTemplate = (method: string, template: string) => {
    setFormData(prev => ({
      ...prev,
      methodTemplates: {
        ...prev.methodTemplates,
        [method]: template
      }
    }));
  };

  const templateOptions = [
    { value: 'default', label: '默认催办模板' },
    { value: 'timeout', label: '超时提醒模板' },
    { value: 'mail_urgent', label: '紧急通知模板' }
  ];

  const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>({
    '企微消息': ''
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const getFilteredOptions = (methodId: string) => {
    const term = searchTerms[methodId].toLowerCase();
    const options = templateOptions.filter(o => o.value !== 'mail_urgent');
    return options.filter(o => o.label.toLowerCase().includes(term));
  };

  return (
    <div className="fixed inset-0 z-[500] flex justify-end overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative bg-white w-full max-w-[800px] shadow-2xl flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-[17px] font-bold text-gray-900">发送消息提醒</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-50 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Section: Configuration Hub */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 bg-[#2f54eb] rounded-full"></div>
                <h3 className="text-[16px] font-bold text-gray-900">发送配置</h3>
              </div>
              <div className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-2 text-[#2f54eb] text-[12px] font-medium">
                  <MessageCircle size={14} />
                  <span>当前发送方式：固定为企微消息</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-[#2f54eb] shadow-sm">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-gray-900">企微消息通知</div>
                  <div className="text-[12px] text-gray-500">将通过企业微信工作通知发送给相关人员</div>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[13px] font-medium text-gray-700 mb-2">选择消息模板</div>
                <div className="relative max-w-md">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === '企微消息' ? null : '企微消息');
                    }}
                    className={`w-full h-10 px-3 flex items-center justify-between text-[13px] bg-white border rounded-lg shadow-sm hover:border-[#2f54eb] transition-all
                      ${openDropdown === '企微消息' ? 'border-[#2f54eb] ring-2 ring-blue-50' : 'border-gray-200'}
                      ${!formData.methodTemplates['企微消息'] ? 'text-gray-400 italic' : 'text-gray-700'}
                    `}
                  >
                    <span className="truncate">
                      {templateOptions.find(t => t.value === formData.methodTemplates['企微消息'])?.label || '点击选择消息通知模板...'}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === '企微消息' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {openDropdown === '企微消息' && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden flex flex-col z-[100]"
                      >
                        <div className="p-2.5 border-b border-gray-50 flex items-center gap-2 bg-gray-50">
                          <Search size={14} className="text-gray-400 shrink-0" />
                          <input 
                            autoFocus
                            placeholder="搜索模板名称..."
                            className="bg-transparent text-[12px] outline-none w-full py-1"
                            value={searchTerms['企微消息']}
                            onChange={(e) => setSearchTerms(p => ({ ...p, ['企微消息']: e.target.value }))}
                          />
                        </div>
                        <div className="max-h-60 overflow-y-auto py-1">
                          {getFilteredOptions('企微消息').map(tmpl => (
                            <div
                              key={tmpl.value}
                              onClick={() => {
                                updateMethodTemplate('企微消息', tmpl.value);
                                setOpenDropdown(null);
                              }}
                              className={`px-4 py-2.5 text-[13px] cursor-pointer flex items-center justify-between transition-colors
                                ${formData.methodTemplates['企微消息'] === tmpl.value ? 'bg-blue-50 text-[#2f54eb] font-medium' : 'text-gray-600 hover:bg-gray-50'}
                              `}
                            >
                              <span>{tmpl.label}</span>
                              {formData.methodTemplates['企微消息'] === tmpl.value && <FileCheck size={14} />}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>


          {/* Section: Template Information */}
          <div className="space-y-6 pt-6 border-t border-gray-100 pb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-[#2f54eb] rounded-full"></div>
                <h3 className="text-[15px] font-bold text-gray-900">模板信息内容预监</h3>
              </div>
              <div className="text-[12px] text-gray-400 bg-gray-50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-gray-100">
                <Info size={12} />
                <span>下方内容仅用于内容预览，由所选模板生成，不可编辑</span>
              </div>
            </div>

            {/* Tabs for Methods */}
            <div className="border-b border-gray-100 flex gap-8">
              {formData.methods.map(method => (
                <button
                  key={method}
                  onClick={() => setActiveMethodTab(method)}
                  className={`pb-3 text-[14px] relative transition-all duration-300 ${
                    activeMethodTab === method 
                      ? 'text-[#2f54eb] font-bold' 
                      : 'text-gray-400 hover:text-gray-600 font-medium'
                  }`}
                >
                  {method}
                  {activeMethodTab === method && (
                    <motion.div 
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2f54eb] rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Preview Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMethodTab + (formData.methodTemplates[activeMethodTab] || '')}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 p-6 bg-gray-50/50 rounded-xl border border-gray-100"
              >
                <div className="space-y-2">
                  <label className="text-[13px] text-gray-400 font-medium ml-1">消息标题</label>
                  <div className="px-4 py-3 bg-white border border-gray-100 rounded-lg text-[14px] text-gray-700 font-medium shadow-sm">
                    {templateMockData[formData.methodTemplates[activeMethodTab] || ''].title || '（未配置标题）'}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] text-gray-400 font-medium ml-1">
                    消息详细内容 <span className="text-[11px] bg-blue-50 text-blue-400 px-1.5 py-0.5 rounded ml-2 font-normal">内容已根据参数自动填充</span>
                  </label>
                  <div className="px-4 py-4 bg-white border border-gray-100 rounded-lg text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap min-h-[120px] shadow-sm">
                    {templateMockData[formData.methodTemplates[activeMethodTab] || ''].content}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[11px] text-gray-400 w-full mb-1 ml-1">关联参数标识：</span>
                  {availableParams.filter(p => templateMockData[formData.methodTemplates[activeMethodTab] || ''].content.includes(`@${p}`) || templateMockData[formData.methodTemplates[activeMethodTab] || ''].content.includes(`{${p}}`)).map(p => (
                    <span key={p} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[11px] border border-gray-200/50">
                      @{p}
                    </span>
                  ))}
                  {availableParams.filter(p => templateMockData[formData.methodTemplates[activeMethodTab] || ''].content.includes(`@${p}`) || templateMockData[formData.methodTemplates[activeMethodTab] || ''].content.includes(`{${p}}`)).length === 0 && (
                    <span className="text-[11px] text-gray-300 italic ml-1">无关联参数</span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50">
            取消
          </button>
          <button className="px-6 py-1.5 bg-[#2f54eb] text-white rounded text-[13px] font-medium hover:bg-[#2744b8] shadow-sm shadow-blue-200">
            确定
          </button>
        </div>

        <button className="absolute right-[-48px] bottom-32 w-12 h-12 bg-white rounded-l-xl shadow-[-4px_0_12px_rgba(0,0,0,0.05)] border border-gray-100 border-r-0 flex items-center justify-center text-gray-400 group">
          <Share2 size={24} className="-rotate-45 group-hover:text-blue-500 transition-colors" />
        </button>
      </motion.div>
    </div>
  );
};

/** 通知规则「消息模板」下拉项对应的预览正文（占位符展示为字面量） */
const NOTIFICATION_TEMPLATE_PREVIEW_BODIES: Record<string, string> = {
  绩效目标制定通知:
    '您好，${employeeName}：当前已进入组织绩效计划制定阶段，请于 ${deadlineDate} 前在系统中完成本周期绩效目标的制定与提交。如有疑问请联系您的直属上级或 HR。',
  默认通知模板:
    '回首过去，拼搏与汗水，换来今天的喜悦与收获，总结过去，勤奋加努力，得来今天的幸福与成功；亲爱的${hhrEmpName}，今天是您入司${number}周年纪念日，宇通愿您扬帆起航，创造更加精彩的明天！',
  绩效方案启动通知:
    '各位同事：${cycleName} 绩效方案已正式启动，请登录绩效系统查看方案说明与时间安排。启动时间：${startDate}。',
  组织绩效考核提醒:
    '您好，${employeeName}：${cycleName} 组织绩效考核正在进行中，请于 ${deadlineDate} 前完成自评/提交相关材料，逾期可能影响考核进度。',
};

/** 通知规则抽屉阶段页签顺序；旧数据缺「组织绩效计划变更」时自动补默认规则 */
const NOTIFICATION_DRAWER_PHASE_ORDER = [
  '组织绩效计划制定',
  '组织绩效中期回顾',
  '组织绩效考核',
  '组织绩效计划变更',
] as const;

const NOTIFICATION_PHASE_DEFAULT_TEMPLATE: Record<(typeof NOTIFICATION_DRAWER_PHASE_ORDER)[number], string> = {
  组织绩效计划制定: '绩效目标制定通知',
  组织绩效中期回顾: '组织绩效中期回顾通知',
  组织绩效考核: '组织绩效考核启动通知',
  组织绩效计划变更: '绩效方案启动通知',
};

// --- 通知规则抽屉组件 ---
const NotificationDrawer = ({ isOpen, onClose, data, onSave }: any) => {
  const [activePhase, setActivePhase] = useState('组织绩效计划制定');
  const [openRecipientDropdownId, setOpenRecipientDropdownId] = useState<string | null>(null);
  const [openMethodsDropdownId, setOpenMethodsDropdownId] = useState<string | null>(null);
  const [templatePreview, setTemplatePreview] = useState<{ title: string; body: string } | null>(null);

  const createDefaultRule = (id: string, template: string) => ({
    id,
    baseDay: '阶段开始日',
    direction: '向后',
    days: 1,
    isWorkDay: true,
    frequency: '仅发送一次',
    time: '09:00',
    interval: '-',
    recipients: ['员工'],
    methods: ['企微'],
    template,
    deadline: ''
  });

  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    phases: {
      '组织绩效计划制定': [createDefaultRule('init-1', '绩效目标制定通知')],
      '组织绩效中期回顾': [createDefaultRule('init-2', '组织绩效中期回顾通知')],
      '组织绩效考核': [createDefaultRule('init-3', '组织绩效考核启动通知')],
      '组织绩效计划变更': [createDefaultRule('init-4', '绩效方案启动通知')],
    },
  });

  const phases = [...NOTIFICATION_DRAWER_PHASE_ORDER];

  useEffect(() => {
    const ensureMethods = (rules: any[]) =>
      rules.map((r: any) => ({
        ...r,
        methods: Array.isArray(r.methods) && r.methods.length > 0 ? r.methods : ['企微'],
      }));

    const fillPhases = (raw: Record<string, any[]> | undefined) => {
      const src = raw && typeof raw === 'object' ? raw : {};
      const out: Record<string, any[]> = {};
      for (const key of NOTIFICATION_DRAWER_PHASE_ORDER) {
        const list =
          src[key as string] ??
          (key === '组织绩效计划变更' ? src['绩效计划变更'] : undefined);
        if (Array.isArray(list) && list.length > 0) {
          out[key] = ensureMethods(list);
        } else {
          out[key] = ensureMethods([
            createDefaultRule(
              `fill-${key}-${Date.now()}`,
              NOTIFICATION_PHASE_DEFAULT_TEMPLATE[key]
            ),
          ]);
        }
      }
      return out;
    };

    if (data) {
      setFormData({
        name: data.name || '',
        description: data.description || '',
        phases: fillPhases(data.phases),
      });
    } else {
      setFormData({
        name: '',
        description: '',
        phases: fillPhases(undefined),
      });
    }
  }, [data, isOpen]);

  useEffect(() => {
    if (!isOpen) setTemplatePreview(null);
  }, [isOpen]);

  const handleRemoveRule = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      phases: {
        ...prev.phases,
        [activePhase]: prev.phases[activePhase].filter((r: any) => r.id !== id)
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-[100]" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-[1200px] bg-[#f8f9fa] shadow-2xl z-[101] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <h2 className="text-[16px] font-bold text-gray-900">
            {data?._isDuplicate ? '复制通知规则' : data ? '编辑通知规则' : '新增通知规则'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32">
          {/* 基本信息 */}
          <section className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-[#2f54eb] rounded-full" />
              <h3 className="text-[14px] font-bold text-gray-900">基本信息</h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[13px] text-gray-600 flex items-center gap-1">
                  规则名称 <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="请输入规则名称"
                  className="w-full border border-gray-200 rounded px-4 py-2 text-[13px] outline-none focus:border-[#2f54eb] transition-all bg-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] text-gray-600">规则说明</label>
                <textarea 
                  placeholder="请输入规则说明"
                  rows={3}
                  className="w-full border border-gray-200 rounded px-4 py-2 text-[13px] outline-none focus:border-[#2f54eb] transition-all bg-white resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* 阶段通知配置 */}
          <section className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-[#2f54eb] rounded-full" />
                <h3 className="text-[14px] font-bold text-gray-900">阶段通知配置</h3>
              </div>
            </div>

            {/* 页签交互 */}
            <div className="flex border-b border-gray-100 mb-6">
              {phases.map(phase => (
                <button
                  key={phase}
                  onClick={() => {
                    setOpenRecipientDropdownId(null);
                    setOpenMethodsDropdownId(null);
                    setActivePhase(phase);
                  }}
                  className={`px-6 py-3 text-[13px] font-medium transition-all relative ${
                    activePhase === phase ? 'text-[#2f54eb]' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {phase}
                  {activePhase === phase && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2f54eb]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/40 px-4 py-3 text-[12px] text-gray-600 leading-relaxed mb-4">
              <Info size={14} className="text-[#2f54eb] shrink-0 mt-0.5" />
              <span>本规则中的通知统一通过<strong className="text-gray-800">企业微信（企微）</strong>发送。</span>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-3 py-4 text-[12px] font-bold text-gray-500 min-w-[100px]">通知基准日</th>
                    <th className="px-3 py-4 text-[12px] font-bold text-gray-500 w-[100px]">偏移方向</th>
                    <th className="px-3 py-4 text-[12px] font-bold text-gray-500 w-[80px]">天数</th>
                    <th className="px-3 py-4 text-[12px] font-bold text-gray-500 w-[120px]">提醒频率</th>
                    <th className="px-3 py-4 text-[12px] font-bold text-gray-500 w-[120px]">发送时间</th>
                    <th className="px-3 py-4 text-[12px] font-bold text-gray-500 w-[80px]">每隔天数</th>
                    <th className="px-3 py-4 text-[12px] font-bold text-gray-500 min-w-[150px]">接收对象</th>
                    <th className="px-3 py-4 text-[12px] font-bold text-gray-500 min-w-[130px]">接收方式</th>
                    <th className="px-3 py-4 text-[12px] font-bold text-gray-500 min-w-[150px]">消息模板</th>
                    <th className="px-3 py-4 text-[12px] font-bold text-gray-500 text-center w-[80px]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(formData.phases[activePhase] || []).length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center text-[13px] text-gray-400">暂无配置规则</td>
                    </tr>
                  ) : (
                    formData.phases[activePhase].map((rule: any) => (
                      <tr key={rule.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-3 py-4">
                          <select 
                            className="w-full border border-gray-200 rounded px-3 py-1.5 text-[13px] outline-none bg-white focus:border-[#2f54eb]"
                            defaultValue={rule.baseDay || "阶段开始日"}
                            onChange={(e) => {
                              const newPhases = { ...formData.phases };
                              newPhases[activePhase] = newPhases[activePhase].map((r2: any) => 
                                r2.id === rule.id ? { ...r2, baseDay: e.target.value } : r2
                              );
                              setFormData({ ...formData, phases: newPhases });
                            }}
                          >
                            <option>阶段开始日</option>
                            <option>阶段结束日</option>
                          </select>
                        </td>
                        <td className="px-3 py-4">
                          <select className="w-full border border-gray-200 rounded px-3 py-1.5 text-[13px] outline-none bg-white focus:border-[#2f54eb]">
                            <option>向后</option>
                            <option>向前</option>
                          </select>
                        </td>
                        <td className="px-3 py-4">
                          <input 
                            type="text" 
                            className="w-full border border-gray-200 rounded px-2 py-1.5 text-[13px] outline-none bg-white text-center focus:border-[#2f54eb]" 
                            defaultValue="1" 
                          />
                        </td>
                        <td className="px-3 py-4">
                          <select 
                            className="w-full border border-gray-200 rounded px-3 py-1.5 text-[13px] outline-none bg-white focus:border-[#2f54eb]"
                            defaultValue={rule.frequency}
                            onChange={(e) => {
                              const newPhases = { ...formData.phases };
                              newPhases[activePhase] = newPhases[activePhase].map((r2: any) => 
                                r2.id === rule.id ? { ...r2, frequency: e.target.value } : r2
                              );
                              setFormData({ ...formData, phases: newPhases });
                            }}
                          >
                            <option>仅发送一次</option>
                            <option>每天发送</option>
                            <option>按间隔天数</option>
                          </select>
                        </td>
                        <td className="px-3 py-4">
                          <input 
                            type="text" 
                            className="w-full border border-gray-200 rounded px-3 py-1.5 text-[13px] outline-none bg-white font-mono focus:border-[#2f54eb]" 
                            defaultValue={rule.time || "09:00"} 
                          />
                        </td>
                        <td className="px-3 py-4 text-center">
                          {rule.frequency === '按间隔天数' ? (
                            <input 
                              type="text" 
                              className="w-[60px] border border-gray-200 rounded px-2 py-1.5 text-[13px] outline-none bg-white text-center focus:border-[#2f54eb]" 
                              defaultValue={rule.interval === '-' ? '1' : rule.interval}
                              onChange={(e) => {
                                const newPhases = { ...formData.phases };
                                newPhases[activePhase] = newPhases[activePhase].map((r2: any) => 
                                  r2.id === rule.id ? { ...r2, interval: e.target.value } : r2
                                );
                                setFormData({ ...formData, phases: newPhases });
                              }}
                            />
                          ) : (
                            <span className="text-gray-400 text-[13px]">-</span>
                          )}
                        </td>
                        <td className="px-3 py-4">
                          <div className="relative">
                            <div 
                              onClick={() => {
                                setOpenMethodsDropdownId(null);
                                setOpenRecipientDropdownId(openRecipientDropdownId === rule.id ? null : rule.id);
                              }}
                              className="w-full border border-gray-200 rounded px-2 py-1 min-h-[32px] flex items-center gap-1.5 bg-white cursor-pointer hover:border-blue-300"
                            >
                              {rule.recipients.map((r: string) => (
                                <span key={r} className="px-2 py-0.5 bg-blue-50 text-[#2f54eb] text-[12px] rounded border border-blue-100 font-medium whitespace-nowrap flex items-center gap-1">
                                  {r === '员工' ? '员工本人' : r}
                                  <X 
                                    size={10} 
                                    className="cursor-pointer hover:text-red-500" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newPhases = { ...formData.phases };
                                      newPhases[activePhase] = newPhases[activePhase].map((r2: any) => 
                                        r2.id === rule.id ? { ...r2, recipients: r2.recipients.filter((item: string) => item !== r) } : r2
                                      );
                                      setFormData({ ...formData, phases: newPhases });
                                    }}
                                  />
                                </span>
                              ))}
                              {rule.recipients.length === 0 && <span className="text-gray-300 text-[13px]">请选择</span>}
                              <ChevronDown size={14} className="ml-auto text-gray-400" />
                            </div>

                            {/* 接收对象下拉框 */}
                            {openRecipientDropdownId === rule.id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenRecipientDropdownId(null)} />
                                <div className="absolute top-full left-0 mt-1 w-[220px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-2 animate-in fade-in zoom-in duration-200">
                                  <div className="flex border-b border-gray-100 pb-2 mb-2 gap-3 px-1">
                                    <button 
                                      onClick={() => {
                                        const newPhases = { ...formData.phases };
                                        newPhases[activePhase] = newPhases[activePhase].map((r2: any) => 
                                          r2.id === rule.id ? { ...r2, recipients: ['员工', '直接上级', '隔级上级'] } : r2
                                        );
                                        setFormData({ ...formData, phases: newPhases });
                                      }}
                                      className="text-[12px] text-[#2f54eb] hover:opacity-80"
                                    >
                                      全选
                                    </button>
                                    <button 
                                      onClick={() => {
                                        const newPhases = { ...formData.phases };
                                        const all = ['员工', '直接上级', '隔级上级'];
                                        newPhases[activePhase] = newPhases[activePhase].map((r2: any) => 
                                          r2.id === rule.id ? { ...r2, recipients: all.filter(a => !r2.recipients.includes(a)) } : r2
                                        );
                                        setFormData({ ...formData, phases: newPhases });
                                      }}
                                      className="text-[12px] text-[#2f54eb] hover:opacity-80"
                                    >
                                      反选
                                    </button>
                                    <button 
                                      onClick={() => {
                                        const newPhases = { ...formData.phases };
                                        newPhases[activePhase] = newPhases[activePhase].map((r2: any) => 
                                          r2.id === rule.id ? { ...r2, recipients: [] } : r2
                                        );
                                        setFormData({ ...formData, phases: newPhases });
                                      }}
                                      className="text-[12px] text-[#2f54eb] hover:opacity-80"
                                    >
                                      无
                                    </button>
                                  </div>
                                  <div className="space-y-1">
                                    {['员工', '直接上级', '隔级上级'].map(opt => (
                                      <label key={opt} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer group">
                                        <input 
                                          type="checkbox" 
                                          checked={rule.recipients.includes(opt)}
                                          onChange={(e) => {
                                            const newPhases = { ...formData.phases };
                                            const currentRecipients = rule.recipients;
                                            const updated = e.target.checked 
                                              ? [...currentRecipients, opt]
                                              : currentRecipients.filter((i: string) => i !== opt);
                                            newPhases[activePhase] = newPhases[activePhase].map((r2: any) => 
                                              r2.id === rule.id ? { ...r2, recipients: updated } : r2
                                            );
                                            setFormData({ ...formData, phases: newPhases });
                                          }}
                                          className="w-3.5 h-3.5 accent-[#2f54eb]" 
                                        />
                                        <span className="text-[13px] text-gray-600 group-hover:text-[#2f54eb]">{opt === '员工' ? '员工本人' : opt}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="relative">
                            <div
                              onClick={() => {
                                setOpenRecipientDropdownId(null);
                                setOpenMethodsDropdownId(openMethodsDropdownId === rule.id ? null : rule.id);
                              }}
                              className="w-full border border-gray-200 rounded px-2 py-1 min-h-[32px] flex items-center gap-1.5 bg-white cursor-pointer hover:border-blue-300"
                            >
                              {(() => {
                                const methodList = Array.isArray(rule.methods) && rule.methods.length > 0 ? rule.methods : [];
                                if (methodList.length === 0) {
                                  return <span className="text-gray-300 text-[13px]">请选择</span>;
                                }
                                return methodList.map((m: string) => (
                                <span
                                  key={m}
                                  className="px-2 py-0.5 bg-green-50 text-green-700 text-[12px] rounded border border-green-100 font-medium whitespace-nowrap flex items-center gap-1"
                                >
                                  {m}
                                  <X
                                    size={10}
                                    className="cursor-pointer hover:text-red-500"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newPhases = { ...formData.phases };
                                      newPhases[activePhase] = newPhases[activePhase].map((r2: any) =>
                                        r2.id === rule.id
                                          ? { ...r2, methods: (r2.methods || []).filter((item: string) => item !== m) }
                                          : r2
                                      );
                                      setFormData({ ...formData, phases: newPhases });
                                    }}
                                  />
                                </span>
                                ));
                              })()}
                              <ChevronDown size={14} className="ml-auto text-gray-400" />
                            </div>
                            {openMethodsDropdownId === rule.id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenMethodsDropdownId(null)} />
                                <div className="absolute top-full left-0 mt-1 w-[200px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-2 animate-in fade-in zoom-in duration-200">
                                  <div className="space-y-1">
                                    {['企微'].map((opt) => (
                                      <label
                                        key={opt}
                                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer group"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={Array.isArray(rule.methods) && rule.methods.includes(opt)}
                                          onChange={(e) => {
                                            const newPhases = { ...formData.phases };
                                            const current = Array.isArray(rule.methods) ? rule.methods : [];
                                            const updated = e.target.checked
                                              ? [...current, opt].filter((v, i, a) => a.indexOf(v) === i)
                                              : current.filter((i: string) => i !== opt);
                                            newPhases[activePhase] = newPhases[activePhase].map((r2: any) =>
                                              r2.id === rule.id ? { ...r2, methods: updated } : r2
                                            );
                                            setFormData({ ...formData, phases: newPhases });
                                          }}
                                          className="w-3.5 h-3.5 accent-[#2f54eb]"
                                        />
                                        <span className="text-[13px] text-gray-600 group-hover:text-[#2f54eb]">{opt}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <select 
                            className="w-full border border-gray-200 rounded px-3 py-1.5 text-[13px] outline-none bg-white focus:border-[#2f54eb]"
                            value={rule.template || '绩效目标制定通知'}
                            onChange={(e) => {
                              const v = e.target.value;
                              const newPhases = { ...formData.phases };
                              newPhases[activePhase] = newPhases[activePhase].map((r2: any) =>
                                r2.id === rule.id ? { ...r2, template: v } : r2
                              );
                              setFormData({ ...formData, phases: newPhases });
                            }}
                          >
                            <option>绩效目标制定通知</option>
                            <option>默认通知模板</option>
                            <option>绩效方案启动通知</option>
                            <option>组织绩效考核提醒</option>
                          </select>
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex items-center justify-center gap-3">
                             <button
                               type="button"
                               className="flex items-center gap-1 text-[#2f54eb] hover:opacity-80 transition-all cursor-pointer"
                               onClick={() => {
                                 const name = rule.template || '绩效目标制定通知';
                                 const body =
                                   NOTIFICATION_TEMPLATE_PREVIEW_BODIES[name] ||
                                   NOTIFICATION_TEMPLATE_PREVIEW_BODIES['绩效目标制定通知'];
                                 setTemplatePreview({
                                   title: `模板预览 - ${name}`,
                                   body,
                                 });
                               }}
                             >
                               <Eye size={14} />
                               <span className="text-[12px]">预览</span>
                             </button>
                             <button 
                               onClick={() => {
                                 const newPhases = { ...formData.phases };
                                 newPhases[activePhase] = newPhases[activePhase].filter((r: any) => r.id !== rule.id);
                                 setFormData({ ...formData, phases: newPhases });
                               }}
                               className="flex items-center gap-1 text-red-300 hover:text-red-500 transition-all cursor-pointer"
                             >
                               <Trash2 size={14} />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 添加按钮 - 对应红框位置 */}
            <div className="mt-4 px-1">
              <button 
                onClick={() => {
                  const newPhases = { ...formData.phases };
                  newPhases[activePhase] = [
                    ...(newPhases[activePhase] || []),
                    {
                      id: Date.now().toString(),
                      frequency: '仅发送一次',
                      time: '09:00',
                      recipients: ['员工'],
                      methods: ['企微'],
                      template: '绩效目标制定通知'
                    }
                  ];
                  setFormData({ ...formData, phases: newPhases });
                }}
                className="w-full py-2 border border-dashed border-gray-200 rounded text-gray-400 hover:border-[#2f54eb] hover:text-[#2f54eb] hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <span className="text-[13px]">添加规则</span>
              </button>
            </div>
          </section>
        </div>

        {/* 底部按钮吸底 - 靠左对齐 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex items-center justify-start gap-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => onSave(formData)}
            className="px-8 py-2 bg-[#2f54eb] text-white rounded text-[14px] font-medium hover:bg-blue-600 transition-all cursor-pointer shadow-sm shadow-blue-100"
          >
            确定
          </button>
          <button 
            onClick={onClose}
            className="px-8 py-2 border border-gray-200 text-gray-600 rounded text-[14px] font-medium hover:bg-gray-50 transition-all cursor-pointer"
          >
            取消
          </button>
        </div>
      </motion.div>

      {templatePreview && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 border-0 cursor-default"
            aria-label="关闭预览"
            onClick={() => setTemplatePreview(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-[221] w-full max-w-lg rounded-xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-gray-100 bg-white">
              <h3 className="text-[15px] font-bold text-gray-900 truncate pr-2">{templatePreview.title}</h3>
              <button
                type="button"
                onClick={() => setTemplatePreview(null)}
                className="p-1.5 shrink-0 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label="关闭"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[min(70vh,520px)] overflow-y-auto px-5 py-5 text-[14px] text-gray-700 leading-relaxed whitespace-pre-wrap">
              {templatePreview.body}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const GradeRangeDrawer = ({ isOpen, onClose, data, onSave }: any) => {
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    ranges: [
      { id: '1', grade: 'S', min: '4.75', max: '5.00' }
    ],
    roundingRule: 'round' // round, up, floor
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        description: data.description || '',
        ranges: data.ranges && data.ranges.length > 0 ? data.ranges : [{ id: Date.now().toString(), grade: 'S', min: '', max: '' }],
        roundingRule: data.roundingRule || 'round'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        ranges: [{ id: Date.now().toString(), grade: 'S', min: '', max: '' }],
        roundingRule: 'round'
      });
    }
  }, [data, isOpen]);

  const handleAddRow = () => {
    setFormData((prev: any) => ({
      ...prev,
      ranges: [...prev.ranges, { id: Date.now().toString(), grade: '', min: '', max: '' }]
    }));
  };

  const handleRemoveRow = (id: string) => {
    if (formData.ranges.length <= 1) return;
    setFormData((prev: any) => ({
      ...prev,
      ranges: prev.ranges.filter((r: any) => r.id !== id)
    }));
  };

  const handleUpdateRow = (id: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      ranges: prev.ranges.map((r: any) => r.id === id ? { ...r, [field]: value } : r)
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-[100]" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-[800px] bg-[#f8f9fa] shadow-2xl z-[101] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <h2 className="text-[16px] font-bold text-gray-900">
            {data?._isDuplicate ? '复制等级分数区间规则' : data ? '编辑等级分数区间规则' : '新增等级分数区间规则'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32">
          {/* 基本信息 */}
          <section className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-[#2f54eb] rounded-full" />
              <h3 className="text-[14px] font-bold text-gray-900">基本信息</h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[13px] text-gray-600 flex items-center gap-1">
                  规则名称 <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="请输入规则名称"
                  className="w-full border border-gray-200 rounded px-4 py-2 text-[13px] outline-none focus:border-[#2f54eb] transition-all bg-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] text-gray-600">规则说明</label>
                <textarea 
                  placeholder="请输入规则说明"
                  rows={4}
                  className="w-full border border-gray-200 rounded px-4 py-2 text-[13px] outline-none focus:border-[#2f54eb] transition-all bg-white resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* 等级分数区间 */}
          <section className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-[#2f54eb] rounded-full" />
                <h3 className="text-[14px] font-bold text-gray-900">等级分数区间</h3>
              </div>
              <button 
                onClick={handleAddRow}
                className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>添加行</span>
              </button>
            </div>

            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">组织绩效等级</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">最小值 (X≥最小值)</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">最大值</th>
                    <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight w-[80px] text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {formData.ranges.map((row: any) => (
                    <tr key={row.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <select 
                          className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#2f54eb] transition-all bg-white"
                          value={row.grade}
                          onChange={(e) => handleUpdateRow(row.id, 'grade', e.target.value)}
                        >
                          <option value="S">S</option>
                          <option value="A">A</option>
                          <option value="B+">B+</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="text"
                          placeholder="例如 4.75"
                          className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#2f54eb] transition-all bg-white font-mono"
                          value={row.min}
                          onChange={(e) => handleUpdateRow(row.id, 'min', e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="text"
                          placeholder="例如 5.00"
                          className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-[#2f54eb] transition-all bg-white font-mono"
                          value={row.max}
                          onChange={(e) => handleUpdateRow(row.id, 'max', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button 
                          onClick={() => handleRemoveRow(row.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-6 border-t border-gray-50">
              <h4 className="text-[13px] font-bold text-gray-800 mb-4">绩效分数取整规则</h4>
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setFormData({ ...formData, roundingRule: 'round' })}>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${formData.roundingRule === 'round' ? 'border-[#2f54eb] bg-blue-50' : 'border-gray-300 bg-white'}`}>
                    {formData.roundingRule === 'round' && <div className="w-2 h-2 rounded-full bg-[#2f54eb]" />}
                  </div>
                  <span className="text-[13px] text-gray-600 group-hover:text-gray-900">四舍五入保留2位小数 <span className="text-gray-400 ml-1">(例: 3.745 ≈ 3.75)</span></span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setFormData({ ...formData, roundingRule: 'up' })}>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${formData.roundingRule === 'up' ? 'border-[#2f54eb] bg-blue-50' : 'border-gray-300 bg-white'}`}>
                    {formData.roundingRule === 'up' && <div className="w-2 h-2 rounded-full bg-[#2f54eb]" />}
                  </div>
                  <span className="text-[13px] text-gray-600 group-hover:text-gray-900">向上取整保留2位小数 <span className="text-gray-400 ml-1">(例: 3.741 ≈ 3.75)</span></span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setFormData({ ...formData, roundingRule: 'floor' })}>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${formData.roundingRule === 'floor' ? 'border-[#2f54eb] bg-blue-50' : 'border-gray-300 bg-white'}`}>
                    {formData.roundingRule === 'floor' && <div className="w-2 h-2 rounded-full bg-[#2f54eb]" />}
                  </div>
                  <span className="text-[13px] text-gray-600 group-hover:text-gray-900">向下取整保留2位小数 <span className="text-gray-400 ml-1">(例: 3.749 ≈ 3.74)</span></span>
                </label>
              </div>
            </div>
          </section>
        </div>

        {/* 底部按钮吸底 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex items-center gap-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => onSave(formData)}
            className="px-8 py-2 bg-[#2f54eb] text-white rounded text-[14px] font-medium hover:bg-blue-600 transition-all cursor-pointer shadow-sm shadow-blue-100"
          >
            确定
          </button>
          <button 
            onClick={onClose}
            className="px-8 py-2 border border-gray-200 text-gray-600 rounded text-[14px] font-medium hover:bg-gray-50 transition-all cursor-pointer"
          >
            取消
          </button>
        </div>
      </motion.div>
    </>
  );
};

/** 组织绩效流程规则抽屉：大阶段顺序（与 DEFAULT_PERFORMANCE_PROCESS_NODES 的 title 一致） */
const PERFORMANCE_PROCESS_DRAWER_PHASE_ORDER = [
  '组织绩效计划制定',
  '组织绩效中期回顾',
  '组织绩效考核',
  '组织绩效计划变更',
] as const;

const DEFAULT_PERFORMANCE_PROCESS_NODES = [
  {
    id: '1',
    title: '组织绩效计划制定',
    subNodes: [
      { id: '1-1', title: '填写绩效计划' },
      { id: '1-2', title: '填写绩效计划' },
      { id: '1-3', title: '相关方审批绩效计划' },
      { id: '1-4', title: '能力中心负责人审批绩效计划' },
      { id: '1-5', title: '分管执委/常委审核' },
    ],
  },
  { id: '2', title: '组织绩效中期回顾', subNodes: [
    { id: '2-1', title: '数据提供人填报中期回顾结果' },
    { id: '2-2', title: 'HRBP审核' },
    { id: '2-3', title: '一级部门负责人审批中期回顾' },
  ] as { id: string; title: string }[] },
  {
    id: '3',
    title: '组织绩效考核',
    subNodes: [
      { id: '3-1', title: '数据评分人评分' },
      { id: '3-2', title: 'HRBP审批' },
      { id: '3-3', title: '一级部门负责人自评' },
      { id: '3-4', title: '相关方评分定级' },
      { id: '3-5', title: '分管执委/常委评分定级' },
    ],
  },
  {
    id: '4',
    title: '组织绩效计划变更',
    subNodes: [
      { id: '4-1', title: '提交计划变更' },
      { id: '4-2', title: '计划变更审批' },
    ],
  },
];

type WorkflowSubNode = { id: string; title: string; order?: number };

function normalizeWorkflowSubNodes(subNodes: WorkflowSubNode[]): WorkflowSubNode[] {
  return (subNodes || []).map((sn, i) => ({
    ...sn,
    order: typeof sn.order === 'number' && sn.order > 0 ? sn.order : i + 1,
  }));
}

function sortWorkflowSubNodesByOrder(subNodes: WorkflowSubNode[]): WorkflowSubNode[] {
  return [...normalizeWorkflowSubNodes(subNodes)].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function getSortedWorkflowSubNodes(nodes: any[], phaseTitle: string): WorkflowSubNode[] {
  const phase = nodes.find((n: any) => n.title === phaseTitle);
  return sortWorkflowSubNodesByOrder(phase?.subNodes ?? []);
}

function getNextWorkflowSubNodeOrder(nodes: any[], phaseTitle: string): number {
  const list = getSortedWorkflowSubNodes(nodes, phaseTitle);
  return list.length === 0 ? 1 : Math.max(...list.map((s) => s.order ?? 0)) + 1;
}

function orderExistsInWorkflowPhase(
  nodes: any[],
  phaseTitle: string,
  order: number,
  excludeSubId?: string
): boolean {
  return getSortedWorkflowSubNodes(nodes, phaseTitle).some(
    (s) => s.order === order && s.id !== excludeSubId
  );
}

function reindexWorkflowSubNodeOrders(subNodes: WorkflowSubNode[]): WorkflowSubNode[] {
  return sortWorkflowSubNodesByOrder(subNodes).map((s, i) => ({ ...s, order: i + 1 }));
}

function cloneDefaultPerformanceProcessNodes() {
  return DEFAULT_PERFORMANCE_PROCESS_NODES.map((n) => ({
    ...n,
    subNodes: n.subNodes.map((s, i) => ({ ...s, order: i + 1 })),
  }));
}

/** 将已保存的 nodes 与当前默认大阶段对齐（补全新增阶段，避免旧数据缺少「组织绩效计划变更」） */
function mergeSavedProcessNodesWithDefaults(saved: any[]) {
  const defaults = cloneDefaultPerformanceProcessNodes();
  return defaults.map((def) => {
    const hit = saved.find(
      (n: any) =>
        n.title === def.title ||
        (def.title === '组织绩效计划变更' && n.title === '绩效计划变更')
    );
    if (!hit) return def;
    return {
      id: hit.id ?? def.id,
      title: def.title,
      subNodes: Array.isArray(hit.subNodes)
        ? normalizeWorkflowSubNodes(hit.subNodes)
        : def.subNodes,
    };
  });
}

function getPhaseSubNodes(nodes: any[], phaseTitle: string): { id: string; title: string }[] {
  const node = nodes.find((n: any) => n.title === phaseTitle);
  return node?.subNodes ?? [];
}

/** 同阶段下是否已有相同节点名称（trim 后比较，可排除当前子节点 id） */
function titleExistsInPhase(
  nodes: any[],
  phaseTitle: string,
  title: string,
  excludeSubId?: string
): boolean {
  const t = title.trim();
  if (!t) return false;
  return getPhaseSubNodes(nodes, phaseTitle).some(
    (s) => s.id !== excludeSubId && (s.title || '').trim() === t
  );
}

/** 新增子节点时的默认名称：在当前大阶段内不重复 */
function nextUniqueDefaultSubNodeTitle(nodes: any[], phaseTitle: string): string {
  const titles = new Set(
    getPhaseSubNodes(nodes, phaseTitle)
      .map((s) => (s.title || '').trim())
      .filter(Boolean)
  );
  const base = '新节点';
  if (!titles.has(base)) return base;
  let n = 2;
  while (titles.has(`${base}${n}`)) n += 1;
  return `${base}${n}`;
}

/** 流程配置 ·「选择执行/抄送规则」弹窗选项（唯一数据源） */
const PERFORMANCE_EXECUTOR_RULE_OPTIONS = [
  '一级部门负责人',
  '主HRBP',
  '能力中心负责人',
  '考核人',
  '数据提供人',
  '分管执委/常委',
] as const;

function normalizePerformanceExecutorRuleLabel(value: string): string {
  if (value === 'HRBP') return '主HRBP';
  if (value === '被考核人') return '一级部门负责人';
  if (value === '相关方') return '考核人';
  return value;
}

const PerformanceProcessDrawer = ({ 
  isOpen, 
  onClose, 
  data,
  onSave
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  data: any;
  onSave: (data: any) => void; 
}) => {
  const [activeMainNode, setActiveMainNode] = useState('组织绩效计划制定');
  const [activeSubNodeId, setActiveSubNodeId] = useState('1-1');
  const [formData, setFormData] = useState<any>(() => ({
    name: '',
    description: '',
    nodes: cloneDefaultPerformanceProcessNodes(),
  }));

  // 执行人/抄送人规则相关状态
  const [executorType, setExecutorType] = useState<'rule' | 'person'>('rule');
  const [selectedExecutor, setSelectedExecutor] = useState('');
  const [ccType, setCCType] = useState<'rule' | 'person'>('rule');
  const [selectedCC, setSelectedCC] = useState('');
  const [pickerContext, setPickerContext] = useState<'executor' | 'cc'>('executor');
  const [showRulePicker, setShowRulePicker] = useState(false);
  const [showPersonPicker, setShowPersonPicker] = useState(false);
  /** 退回：系统默认可退至已发生任意节点；此处配置「再次提交」策略与意见是否必填 */
  const [returnResubmitMode, setReturnResubmitMode] = useState<'reapprove' | 'jumpToReturned'>('reapprove');
  const [returnCommentRequired, setReturnCommentRequired] = useState(false);

  const rules = [...PERFORMANCE_EXECUTOR_RULE_OPTIONS];

  // 模拟人员数据
  const mockPeople = [
    { id: '1', name: '张三', empId: 'A001', deptPath: 'XXX集团/研发中心/移动端开发部' },
    { id: '2', name: '李四', empId: 'A002', deptPath: 'XXX集团/产品中心/绩效产品组' },
    { id: '3', name: '王五', empId: 'A003', deptPath: 'XXX集团/设计中心/体验设计部' },
    { id: '4', name: '赵六', empId: 'A004', deptPath: 'XXX集团/市场中心/华北区销售部' },
  ];

  // 新增/编辑子节点弹窗
  const [subNodeForm, setSubNodeForm] = useState<null | { mode: 'add' } | { mode: 'edit'; subId: string }>(null);
  const [tempNodeName, setTempNodeName] = useState('');
  const [tempNodeOrder, setTempNodeOrder] = useState('');
  const [deletingSubNode, setDeletingSubNode] = useState<any>(null);
  const [drawerToast, setDrawerToast] = useState<{ message: string; type: 'error' | 'warning' } | null>(null);
  const drawerToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showDrawerToast = (message: string, type: 'error' | 'warning' = 'warning') => {
    if (drawerToastTimerRef.current) clearTimeout(drawerToastTimerRef.current);
    setDrawerToast({ message, type });
    drawerToastTimerRef.current = setTimeout(() => {
      setDrawerToast(null);
      drawerToastTimerRef.current = null;
    }, 3200);
  };

  useEffect(() => {
    return () => {
      if (drawerToastTimerRef.current) clearTimeout(drawerToastTimerRef.current);
    };
  }, []);

  const openAddSubNodeModal = () => {
    setSubNodeForm({ mode: 'add' });
    setTempNodeOrder(String(getNextWorkflowSubNodeOrder(formData.nodes, activeMainNode)));
    setTempNodeName('');
  };

  const openEditSubNodeModal = (sub: WorkflowSubNode) => {
    const sorted = getSortedWorkflowSubNodes(formData.nodes, activeMainNode);
    const idx = sorted.findIndex((s) => s.id === sub.id);
    setSubNodeForm({ mode: 'edit', subId: sub.id });
    setTempNodeOrder(String(sub.order ?? (idx >= 0 ? idx + 1 : 1)));
    setTempNodeName(sub.title);
  };

  const closeSubNodeForm = () => {
    setSubNodeForm(null);
    setTempNodeName('');
    setTempNodeOrder('');
  };

  const confirmSubNodeForm = () => {
    if (!subNodeForm) return;
    const orderTrimmed = tempNodeOrder.trim();
    if (!orderTrimmed) {
      showDrawerToast('请输入节点序号', 'error');
      return;
    }
    const orderNum = Number(orderTrimmed);
    if (!Number.isInteger(orderNum) || orderNum < 1) {
      showDrawerToast('节点序号须为正整数', 'error');
      return;
    }
    const titleTrimmed = tempNodeName.trim();
    if (!titleTrimmed) {
      showDrawerToast('请输入节点名称', 'error');
      return;
    }
    const excludeId = subNodeForm.mode === 'edit' ? subNodeForm.subId : undefined;
    if (titleExistsInPhase(formData.nodes, activeMainNode, titleTrimmed, excludeId)) {
      showDrawerToast('当前阶段下已存在同名节点，请修改名称', 'warning');
      return;
    }
    if (orderExistsInWorkflowPhase(formData.nodes, activeMainNode, orderNum, excludeId)) {
      showDrawerToast('当前阶段下已存在相同序号的节点，请修改序号', 'warning');
      return;
    }

    let newActiveId = excludeId ?? '';
    const updatedNodes = formData.nodes.map((node: any) => {
      if (node.title !== activeMainNode) return node;
      const list = normalizeWorkflowSubNodes(node.subNodes || []);
      if (subNodeForm.mode === 'add') {
        newActiveId = `${Date.now()}`;
        const nextList = sortWorkflowSubNodesByOrder([
          ...list,
          { id: newActiveId, title: titleTrimmed, order: orderNum },
        ]);
        return { ...node, subNodes: nextList };
      }
      const editId = subNodeForm.subId;
      const nextList = sortWorkflowSubNodesByOrder(
        list.map((sn) => (sn.id === editId ? { ...sn, title: titleTrimmed, order: orderNum } : sn))
      );
      newActiveId = editId;
      return { ...node, subNodes: nextList };
    });
    setFormData({ ...formData, nodes: updatedNodes });
    setActiveSubNodeId(newActiveId);
    closeSubNodeForm();
  };

  useEffect(() => {
    if (!isOpen) return;
    if (data) {
      setFormData({
        name: data.name || '',
        description: data.description || '',
        nodes:
          Array.isArray(data.nodes) && data.nodes.length > 0
            ? mergeSavedProcessNodesWithDefaults(data.nodes)
            : cloneDefaultPerformanceProcessNodes(),
      });
    } else {
      setFormData({
        name: '',
        description: '',
        nodes: cloneDefaultPerformanceProcessNodes(),
      });
    }
    if (data?.workflowReturnRule) {
      const wr = data.workflowReturnRule;
      if (wr.returnResubmitMode === 'reapprove' || wr.returnResubmitMode === 'jumpToReturned') {
        setReturnResubmitMode(wr.returnResubmitMode);
      } else {
        setReturnResubmitMode('reapprove');
      }
      setReturnCommentRequired(Boolean(wr.returnCommentRequired));
    } else {
      setReturnResubmitMode('reapprove');
      setReturnCommentRequired(false);
    }
    setActiveMainNode('组织绩效计划制定');
    setActiveSubNodeId('1-1');
    setSubNodeForm(null);
    setTempNodeName('');
    setTempNodeOrder('');
  }, [data, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 z-[100] backdrop-blur-sm"
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 w-full max-w-[750px] h-full bg-[#f8fafc] z-[101] shadow-2xl flex flex-col"
      >
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold text-gray-900">
              {data?._isDuplicate ? '复制组织绩效流程规则' : data ? '编辑组织绩效流程规则' : '新增组织绩效流程规则'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
          {/* 基本信息 */}
          <section className="bg-white p-6 rounded-lg border border-gray-100 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-[#2f54eb] rounded-full" />
              <span className="text-[15px] font-bold text-gray-900">基本信息</span>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1.5">
                <label className="text-[13px] text-gray-600 font-medium">规则名称 <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入规则名称"
                  className="w-full border border-gray-200 rounded px-4 py-2 text-[14px] outline-none focus:border-[#2f54eb] transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] text-gray-600 font-medium">规则说明</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请输入规则说明"
                  className="w-full border border-gray-200 rounded px-4 py-2 text-[14px] outline-none focus:border-[#2f54eb] transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* 流程子节点配置 */}
          <section className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col h-[650px] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-[#2f54eb] rounded-full" />
                <span className="text-[15px] font-bold text-gray-900">流程子节点配置</span>
              </div>
            </div>

            {/* 阶段页签 - 水平排列 */}
            <div className="px-6 border-b border-gray-100 bg-white flex items-center gap-8 flex-wrap">
              {PERFORMANCE_PROCESS_DRAWER_PHASE_ORDER.map((phase) => (
                <div 
                  key={phase}
                  title={phase === '组织绩效计划变更' ? '组织绩效计划制定完成后，用于处理计划变更相关业务' : undefined}
                  onClick={() => {
                    setActiveMainNode(phase);
                    const currentNode = formData.nodes.find((n: { title: string }) => n.title === phase);
                    if (currentNode && currentNode.subNodes.length > 0) {
                      setActiveSubNodeId(currentNode.subNodes[0].id);
                    } else {
                      setActiveSubNodeId('');
                    }
                  }}
                  className={`py-4 text-[14px] font-medium cursor-pointer relative transition-all ${
                    activeMainNode === phase ? 'text-[#2f54eb]' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {phase}
                  {activeMainNode === phase && (
                    <motion.div layoutId="phaseTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2f54eb]" />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              {/* 左侧节点列表 */}
              <div className="w-56 bg-gray-50/50 border-r border-gray-100 flex flex-col">
                <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white/50">
                  <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">节点列表</span>
                  <div className="flex items-center gap-2">
                    <Plus 
                      size={14} 
                      className="text-[#2f54eb] cursor-pointer hover:scale-110 transition-transform" 
                      onClick={openAddSubNodeModal}
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                  {getSortedWorkflowSubNodes(formData.nodes, activeMainNode).map(sub => (
                    <div
                      key={sub.id}
                      role="button"
                      tabIndex={0}
                      className={`mx-2 my-1 rounded-md text-[13px] flex items-center justify-between py-2.5 px-2 cursor-pointer group transition-all border border-transparent ${
                        activeSubNodeId === sub.id ? 'bg-[#2f54eb] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveSubNodeId(sub.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveSubNodeId(sub.id);
                        }
                      }}
                    >
                        <span className={`truncate ${activeSubNodeId === sub.id ? 'font-bold' : ''}`}>
                          <span className="opacity-80 mr-1">{sub.order ?? ''}.</span>
                          {sub.title}
                        </span>
                      <div
                        className={`flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                          activeSubNodeId === sub.id ? 'text-white' : 'text-gray-400'
                        }`}
                      >
                        <Edit2
                          size={12}
                          className="hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditSubNodeModal(sub);
                            }}
                        />
                        <Trash2
                          size={12}
                          className="hover:scale-110"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingSubNode(sub);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {(formData.nodes.find(n => n.title === activeMainNode)?.subNodes.length ?? 0) === 0 && (
                    <div className="px-4 py-12 text-center">
                      <div className="text-[12px] text-gray-400 italic">暂无子节点</div>
                      <button 
                        type="button"
                        className="mt-2 text-[12px] text-[#2f54eb] hover:underline"
                        onClick={openAddSubNodeModal}
                      >点击添加</button>
                    </div>
                  )}
                </div>
              </div>

              {/* 右侧详细配置 */}
              <div className="flex-1 p-8 space-y-6 overflow-y-auto bg-white">
                {activeSubNodeId ? (
                  <>
                {/* 执行人规则 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-[3px] h-3 bg-[#2f54eb] rounded-full" />
                    <span className="text-[14px] font-bold text-gray-900">执行人规则</span>
                  </div>
                  <div className="flex items-center gap-8 pl-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="approver" 
                        checked={executorType === 'rule'} 
                        onChange={() => {
                          setExecutorType('rule');
                          setSelectedExecutor('');
                        }}
                        className="w-4 h-4 text-[#2f54eb] focus:ring-[#2f54eb]" 
                      />
                      <span className="text-[13px] text-gray-700">指定规则</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="approver" 
                        checked={executorType === 'person'} 
                        onChange={() => {
                          setExecutorType('person');
                          setSelectedExecutor('');
                        }}
                        className="w-4 h-4 text-[#2f54eb] focus:ring-[#2f54eb]" 
                      />
                      <span className="text-[13px] text-gray-700">指定人</span>
                    </label>
                  </div>
                  <div className="relative pl-6">
                    <input 
                      type="text" 
                      readOnly
                      placeholder={executorType === 'rule' ? "请选择执行规则" : "请选择执行人"}
                      value={executorType === 'rule' ? normalizePerformanceExecutorRuleLabel(selectedExecutor) : selectedExecutor}
                      onClick={() => {
                        setPickerContext('executor');
                        if (executorType === 'rule') setShowRulePicker(true);
                        else setShowPersonPicker(true);
                      }}
                      className="w-full max-w-md border border-gray-200 rounded px-10 py-2 text-[13px] outline-none focus:border-[#2f54eb] cursor-pointer hover:border-gray-300 transition-colors" 
                    />
                    <Search size={14} className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="pl-6 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked={false}
                        className="w-4 h-4 text-[#2f54eb] rounded border-gray-300 focus:ring-[#2f54eb]" 
                      />
                      <span className="text-[13px] text-gray-700">允许编辑</span>
                    </label>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-50/50" />

                {/* 2、审批通过 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-[3px] h-3 bg-[#2f54eb] rounded-full" />
                    <span className="text-[14px] font-bold text-gray-900">审批通过</span>
                  </div>
                  <div className="pl-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-[#2f54eb] rounded border-gray-300 focus:ring-[#2f54eb]" />
                      <span className="text-[13px] text-gray-700">审批意见必填</span>
                    </label>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-50/50" />

                {/* 3、退回规则（默认可退至已发生任意节点，仅配置再次提交策略与意见必填） */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-[3px] h-3 bg-[#2f54eb] rounded-full" />
                    <span className="text-[14px] font-bold text-gray-900">退回规则</span>
                  </div>
                  <div className="pl-6 space-y-4">
                    <p className="text-[12px] text-gray-600 leading-relaxed rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-2.5">
                      <span className="font-medium text-[#2f54eb]">提示：</span>
                      退回时可将流程退回到<strong className="text-gray-800">已发生的任意节点</strong>
                      （含发起节点及流程中已执行过的节点），请在实际操作中确认退回目标是否符合业务要求。
                    </p>
                    <div className="space-y-2">
                      <div className="text-[13px] text-gray-700 font-medium">
                        退回后重新提交 <span className="text-gray-400 font-normal text-[12px]">（单选）</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="returnResubmitMode"
                            checked={returnResubmitMode === 'reapprove'}
                            onChange={() => setReturnResubmitMode('reapprove')}
                            className="w-4 h-4 text-[#2f54eb] focus:ring-[#2f54eb]"
                          />
                          <span className="text-[13px] text-gray-700">按流程重新审批</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="returnResubmitMode"
                            checked={returnResubmitMode === 'jumpToReturned'}
                            onChange={() => setReturnResubmitMode('jumpToReturned')}
                            className="w-4 h-4 text-[#2f54eb] focus:ring-[#2f54eb]"
                          />
                          <span className="text-[13px] text-gray-700">直接跳转至被退回节点</span>
                        </label>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={returnCommentRequired}
                        onChange={(e) => setReturnCommentRequired(e.target.checked)}
                        className="w-4 h-4 text-[#2f54eb] rounded border-gray-300 focus:ring-[#2f54eb]"
                      />
                      <span className="text-[13px] text-gray-700">退回意见必填</span>
                    </label>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-50/50" />

                {/* 4、抄送人规则 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-[3px] h-3 bg-[#2f54eb] rounded-full" />
                    <span className="text-[14px] font-bold text-gray-900">抄送人规则</span>
                  </div>
                  <div className="pl-6 space-y-4">
                    <div className="flex items-center gap-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="ccRule" 
                          checked={ccType === 'rule'} 
                          onChange={() => {
                            setCCType('rule');
                            setSelectedCC('');
                          }}
                          className="w-4 h-4 text-[#2f54eb] focus:ring-[#2f54eb]" 
                        />
                        <span className="text-[13px] text-gray-700">指定规则</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="ccRule" 
                          checked={ccType === 'person'} 
                          onChange={() => {
                            setCCType('person');
                            setSelectedCC('');
                          }}
                          className="w-4 h-4 text-[#2f54eb] focus:ring-[#2f54eb]" 
                        />
                        <span className="text-[13px] text-gray-700">指定人</span>
                      </label>
                    </div>
                    <div className="relative">
                      <input 
                        type="text" 
                        readOnly
                        placeholder={ccType === 'rule' ? "请选择抄送规则" : "请选择抄送人"}
                        value={ccType === 'rule' ? normalizePerformanceExecutorRuleLabel(selectedCC) : selectedCC}
                        onClick={() => {
                          setPickerContext('cc');
                          if (ccType === 'rule') setShowRulePicker(true);
                          else setShowPersonPicker(true);
                        }}
                        className="w-full max-w-md border border-gray-200 rounded px-10 py-2 text-[13px] outline-none focus:border-[#2f54eb] cursor-pointer hover:border-gray-300 transition-colors" 
                      />
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">抄送时机:</span>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="ccTiming" defaultChecked className="w-4 h-4 text-[#2f54eb] focus:ring-[#2f54eb]" />
                          <span className="text-[13px] text-gray-700">节点到达时</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="ccTiming" className="w-4 h-4 text-[#2f54eb] focus:ring-[#2f54eb]" />
                          <span className="text-[13px] text-gray-700">节点完成时</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                      <Search size={24} className="text-gray-200" />
                    </div>
                    <div className="text-[14px]">请在左侧选择一个子节点进行配置</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* 底部按钮吸底 - 靠左对齐 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex items-center justify-start gap-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() =>
              onSave({
                ...formData,
                workflowReturnRule: {
                  returnScope: 'any_executed_node' as const,
                  returnResubmitMode,
                  returnCommentRequired,
                },
              })
            }
            className="px-10 py-2 bg-[#2f54eb] text-white rounded-lg text-[14px] font-bold hover:bg-blue-600 transition-all cursor-pointer shadow-md shadow-blue-100 hover:-translate-y-0.5 active:translate-y-0"
          >
            确定
          </button>
          <button 
            onClick={onClose}
            className="px-10 py-2 border border-gray-200 text-gray-600 rounded-lg text-[14px] font-bold hover:bg-gray-50 transition-all cursor-pointer"
          >
            取消
          </button>
        </div>

        {/* 新增/编辑流程子节点 */}
        {subNodeForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeSubNodeForm}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <span className="font-bold text-gray-900">
                  {subNodeForm.mode === 'add' ? '新增流程节点' : '编辑流程节点'}
                </span>
                <X size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" onClick={closeSubNodeForm} />
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                    节点序号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    autoFocus
                    value={tempNodeOrder}
                    onChange={(e) => setTempNodeOrder(e.target.value)}
                    placeholder="请输入节点序号"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] outline-none focus:border-[#2f54eb] focus:ring-2 focus:ring-blue-50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                    节点名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tempNodeName}
                    onChange={(e) => setTempNodeName(e.target.value)}
                    placeholder="请输入节点名称"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] outline-none focus:border-[#2f54eb] focus:ring-2 focus:ring-blue-50 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="p-4 bg-gray-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeSubNodeForm}
                  className="px-5 py-2 text-[14px] text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={confirmSubNodeForm}
                  className="px-6 py-2 text-[14px] bg-[#2f54eb] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-200 transition-all cursor-pointer"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 删除确认弹窗 */}
        {deletingSubNode && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeletingSubNode(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 size={28} className="text-red-500" />
                </div>
                <h4 className="text-[16px] font-bold text-gray-900 mb-2">确认删除节点</h4>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  确认删除当前选中的 <span className="text-[#2f54eb] font-bold">【{deletingSubNode.title}】</span> 节点吗？删除后不可恢复
                </p>
              </div>
              <div className="p-4 bg-gray-50 flex gap-3">
                <button 
                  onClick={() => setDeletingSubNode(null)}
                  className="flex-1 py-3 text-[14px] text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >取消</button>
                <button 
                  onClick={() => {
                    const updatedNodes = formData.nodes.map((node: any) => {
                      if (node.title === activeMainNode) {
                        return {
                          ...node,
                          subNodes: reindexWorkflowSubNodeOrders(
                            node.subNodes.filter((sn: any) => sn.id !== deletingSubNode.id)
                          ),
                        };
                      }
                      return node;
                    });
                    setFormData({ ...formData, nodes: updatedNodes });
                    const nextList = updatedNodes.find((n: any) => n.title === activeMainNode)?.subNodes || [];
                    if (activeSubNodeId === deletingSubNode.id) {
                      setActiveSubNodeId(nextList[0]?.id ?? '');
                    }
                    setDeletingSubNode(null);
                  }}
                  className="flex-1 py-3 text-[14px] bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 shadow-lg shadow-red-100 transition-all cursor-pointer"
                >删除</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 规则选择弹窗 */}
        {showRulePicker && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowRulePicker(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <span className="font-bold text-gray-900">选择{pickerContext === 'executor' ? '执行' : '抄送'}规则</span>
                <X size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => setShowRulePicker(false)} />
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2">
                {rules.map((rule) => {
                  const currentRule =
                    pickerContext === 'executor' ? selectedExecutor : selectedCC;
                  const isSelected = normalizePerformanceExecutorRuleLabel(currentRule) === rule;
                  return (
                    <div 
                      key={rule}
                      onClick={() => {
                        if (pickerContext === 'executor') setSelectedExecutor(rule);
                        else setSelectedCC(rule);
                        setShowRulePicker(false);
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all mb-1 ${isSelected ? 'bg-blue-50 text-[#2f54eb]' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                      <span className="text-[14px] font-medium">{rule}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${isSelected ? 'border-[#2f54eb] bg-[#2f54eb]' : 'border-gray-200'}`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}

        {/* 指定人选择弹窗 (单选) */}
        {showPersonPicker && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowPersonPicker(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <span className="font-bold text-gray-900">选择{pickerContext === 'executor' ? '执行人' : '抄送人'}</span>
                <X size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => setShowPersonPicker(false)} />
              </div>
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <input type="text" placeholder="搜索姓名/工号" className="w-full bg-gray-100 border-none rounded-lg pl-10 pr-4 py-2 text-[14px] outline-none" />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2">
                {mockPeople.map((person) => {
                  const isSelected = (pickerContext === 'executor' ? selectedExecutor : selectedCC) === person.name;
                  return (
                    <div 
                      key={person.id}
                      onClick={() => {
                        if (pickerContext === 'executor') setSelectedExecutor(person.name);
                        else setSelectedCC(person.name);
                        setShowPersonPicker(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all mb-1 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#2f54eb]/10 text-[#2f54eb] flex items-center justify-center font-bold text-sm">
                        {person.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-gray-900">{person.name}</span>
                          <span className="text-[12px] text-gray-400 font-normal">({person.empId})</span>
                        </div>
                        <div className="text-[12px] text-gray-500 mt-0.5">{person.deptPath}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-[#2f54eb] bg-[#2f54eb]' : 'border-gray-200'}`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {drawerToast && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -10, x: '-50%' }}
            className={`fixed top-4 left-1/2 z-[20050] px-4 py-2.5 rounded-lg shadow-xl flex items-start gap-2 min-w-[260px] max-w-[min(92vw,420px)] pointer-events-none border ${
              drawerToast.type === 'error' ? 'bg-white border-red-200' : 'bg-white border-orange-200'
            }`}
          >
            {drawerToast.type === 'warning' && <AlertCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />}
            {drawerToast.type === 'error' && <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />}
            <span className="text-[13px] text-gray-800 leading-snug">{drawerToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const employeeTableData = [
  { id: '90000001', name: '执委测试', dept: '执委会', postCode: '20010275', postName: '董事长', company: '鼎' },
  { id: '90000002', name: '测试2', dept: '执委会', postCode: '20000959', postName: '总裁', company: '纳' },
  { id: '90000003', name: '华忠润', dept: '产品开发部', postCode: '20010283', postName: '负责人', company: '纳' },
  { id: '90000004', name: '史雨嘉', dept: '亚太业务大区', postCode: '20002027', postName: '海外销售高级主管', company: '九' },
  { id: '90000005', name: '陶冰轩', dept: '基础服务和平台组', postCode: '20000891', postName: '前端开发工程师', company: '九' },
  { id: '90000006', name: '陆晓龙', dept: '执委会', postCode: '20000954', postName: 'CTO', company: '纳' },
  { id: '90000007', name: '王雪薇', dept: '执委会', postCode: '20000956', postName: 'VP', company: '纳' },
];

const deptTableData = [
  { name: '九号公司', code: '10000000', level: '根组织', path: '九号公司' },
  { name: '未岚大陆', code: '10010267', level: '根组织', path: '未岚大陆' },
  { name: '66 Studios', code: '10000766', level: '一级组织', path: '66 Studios' },
  { name: '系统测试2', code: '10010002', level: '一级组织', path: '系统测试2' },
  { name: 'GSC测试', code: '10010150', level: '一级组织', path: 'GSC测试' },
  { name: '测试组织22222', code: '10010158', level: '一级组织', path: '测试组织22222' },
  { name: '测试组织单位新组织', code: '10010160', level: '一级组织', path: '测试组织单位新组织' },
];

const dashboardOptions = [
  '组织绩效全景图', '中期回顾总览', '红绿灯指标汇总', '部门详细回顾', '组织绩效正式考核看板'
];

const BasicRuleSettingsPage = ({ 
  gradeRanges, 
  addRow, 
  deleteRow, 
  updateRow, 
  roundingRule, 
  setRoundingRule,
  deptDimensionConfigs,
  setDeptDimensionConfigs,
  levelScoreConfigs,
  setLevelScoreConfigs,
  notificationConfigs,
  setNotificationConfigs,
  performanceProcessConfigs,
  setPerformanceProcessConfigs
}: { 
  gradeRanges: GradeRange[],
  addRow: () => void,
  deleteRow: (id: string) => void,
  updateRow: (id: string, field: keyof GradeRange, value: string) => void,
  roundingRule: string,
  setRoundingRule: (rule: string) => void,
  deptDimensionConfigs: any[],
  setDeptDimensionConfigs: React.Dispatch<React.SetStateAction<any[]>>,
  levelScoreConfigs: any[],
  setLevelScoreConfigs: React.Dispatch<React.SetStateAction<any[]>>,
  notificationConfigs: any[],
  setNotificationConfigs: React.Dispatch<React.SetStateAction<any[]>>,
  performanceProcessConfigs: any[],
  setPerformanceProcessConfigs: React.Dispatch<React.SetStateAction<any[]>>
}) => {
  const [activeTab, setActiveTab] = useState('考核指标维度规则');
  const [activePermissionTab, setActivePermissionTab] = useState('看板权限');
  const [activeSidebar, setActiveSidebar] = useState('通知规则');
  const [activePhase, setActivePhase] = useState('组织绩效计划制定');
  const [activeSubNode, setActiveSubNode] = useState('员工本人');

  const [configSearchTerm, setConfigSearchTerm] = useState('');
  const [processSearchTerm, setProcessSearchTerm] = useState('');
  const [levelSearchTerm, setLevelSearchTerm] = useState('');
  const [notificationSearchTerm, setNotificationSearchTerm] = useState('');
  const [permissionSearchTerm, setPermissionSearchTerm] = useState('');

  const dimensionOptions = ['财务指标', '运营指标', '客户指标', '组织发展指标', '能力建设指标'];

  const [isIndicatorDrawerOpen, setIsIndicatorDrawerOpen] = useState(false);
  const [currentIndicatorData, setCurrentIndicatorData] = useState<any>(null);

  const [isGradeRangeDrawerOpen, setIsGradeRangeDrawerOpen] = useState(false);
  const [currentGradeRangeData, setCurrentGradeRangeData] = useState<any>(null);

  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [currentNotificationData, setCurrentNotificationData] = useState<any>(null);

  const [isProcessDrawerOpen, setIsProcessDrawerOpen] = useState(false);
  const [currentProcessData, setCurrentProcessData] = useState<any>(null);

  const [isAuthEmployeeDrawerOpen, setIsAuthEmployeeDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [authFormData, setAuthFormData] = useState({
    employeeName: '',
    depts: [] as string[],
    dashboards: [] as string[]
  });

  const [empModalSearch, setEmpModalSearch] = useState({ idOrName: '', deptName: '' });
  const [deptModalSearch, setDeptModalSearch] = useState({ name: '', code: '' });
  const [dashboardSearch, setDashboardSearch] = useState('');
  const [isDashboardsOpen, setIsDashboardsOpen] = useState(false);
  const [isPortalButtonEnabled, setIsPortalButtonEnabled] = useState(false);
  const [showFormErrors, setShowFormErrors] = useState(false);

  /** 复制规则时规则名称默认加「（副本）」，与纯新增共用抽屉，保存走新增逻辑 */
  const ruleNameForDuplicate = (name: string) => {
    const base = String(name || '').trim();
    return base.endsWith('（副本）') ? base : `${base}（副本）`;
  };

  const handleIndicatorSave = (newData: any) => {
    if (currentIndicatorData && !currentIndicatorData._isDuplicate) {
      // Edit
      setDeptDimensionConfigs(deptDimensionConfigs.map(c => 
        c.id === currentIndicatorData.id ? { ...c, ...newData, updater: '管理员', updateTime: new Date().toLocaleString() } : c
      ));
    } else {
      // Add
      const newConfig = {
        ...newData,
        id: Date.now().toString(),
        status: true,
        creator: '管理员',
        createTime: new Date().toLocaleString(),
        updater: '管理员',
        updateTime: new Date().toLocaleString()
      };
      setDeptDimensionConfigs([...deptDimensionConfigs, newConfig]);
    }
    setIsIndicatorDrawerOpen(false);
    setCurrentIndicatorData(null);
  };

  const handleGradeRangeSave = (newData: any) => {
    if (currentGradeRangeData && !currentGradeRangeData._isDuplicate) {
      // Edit
      setLevelScoreConfigs(levelScoreConfigs.map(c => 
        c.id === currentGradeRangeData.id ? { ...c, ...newData, updater: '管理员', updateTime: new Date().toLocaleString() } : c
      ));
    } else {
      // Add
      const newConfig = {
        ...newData,
        id: Date.now().toString(),
        status: true,
        creator: '管理员',
        createTime: new Date().toLocaleString(),
        updater: '管理员',
        updateTime: new Date().toLocaleString()
      };
      setLevelScoreConfigs([...levelScoreConfigs, newConfig]);
    }
    setIsGradeRangeDrawerOpen(false);
    setCurrentGradeRangeData(null);
  };

  const handleNotificationSave = (newData: any) => {
    if (currentNotificationData && !currentNotificationData._isDuplicate) {
      // Edit
      setNotificationConfigs(notificationConfigs.map(c => 
        c.id === currentNotificationData.id ? { ...c, ...newData, updater: '管理员', updateTime: new Date().toLocaleString() } : c
      ));
    } else {
      // Add
      const newConfig = {
        ...newData,
        id: Date.now().toString(),
        status: true,
        creator: '管理员',
        createTime: new Date().toLocaleString(),
        updater: '管理员',
        updateTime: new Date().toLocaleString()
      };
      setNotificationConfigs([...notificationConfigs, newConfig]);
    }
    setIsNotificationDrawerOpen(false);
    setCurrentNotificationData(null);
  };

  const handleProcessSave = (newData: any) => {
    if (currentProcessData && !currentProcessData._isDuplicate) {
      // Edit
      setPerformanceProcessConfigs(performanceProcessConfigs.map(c => 
        c.id === currentProcessData.id ? { ...c, ...newData, updater: '管理员', updateTime: new Date().toLocaleString() } : c
      ));
    } else {
      // Add
      const newConfig = {
        ...newData,
        id: Date.now().toString(),
        status: true,
        creator: '管理员',
        createTime: new Date().toLocaleString(),
        updater: '管理员',
        updateTime: new Date().toLocaleString()
      };
      setPerformanceProcessConfigs([...performanceProcessConfigs, newConfig]);
    }
    setIsProcessDrawerOpen(false);
    setCurrentProcessData(null);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string | number, name: string, type: string } | null>(null);

  const handleDeleteClick = (id: string | number, name: string, type: string) => {
    setItemToDelete({ id, name, type });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'notification') {
      setNotificationConfigs(prev => prev.filter(p => p.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'indicator') {
      setDeptDimensionConfigs(prev => prev.filter(p => p.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'process') {
      setPerformanceProcessConfigs(prev => prev.filter(p => p.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'grade') {
      setLevelScoreConfigs(prev => prev.filter(p => p.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'auth_employee') {
      // Logic to delete auth employee would go here
      console.log('Action: Delete auth employee', itemToDelete.id);
    }
    
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const tabs = ['考核指标维度规则', '组织绩效流程规则', '等级分数区间规则', '通知规则', '权限设置'];
  const sidebars = ['考核员工范围', '通知规则'];

  const permissionData = [
    { id: '1', empId: '10001', name: '张三', deptPath: '集团总部/信息化中心', boardPermissions: ['集团指标大盘', '实时组织计划全景图', '组织计划全景图'] },
    { id: '2', empId: '10002', name: '李四', deptPath: '集团总部/人力行政中心', boardPermissions: ['中期回顾总览', '红灯指标汇总'] },
    { id: '3', empId: '10003', name: '王五', deptPath: '集团总部/财务管理中心', boardPermissions: ['部门详细回顾', '组织计划全景图'] },
    { id: '4', empId: '10004', name: '赵六', deptPath: '集团总部/战略发展部', boardPermissions: ['集团指标大盘'] },
    { id: '5', empId: '10005', name: '孙七', deptPath: '集团总部/法务合规部', boardPermissions: ['实时组织计划全景图'] },
    { id: '6', empId: '10006', name: '周八', deptPath: '集团总部/品牌营销部', boardPermissions: ['组织计划全景图'] },
    { id: '7', empId: '10007', name: '吴九', deptPath: '集团总部/供应链管理中心', boardPermissions: ['中期回顾总览'] },
    { id: '8', empId: '10008', name: '郑十', deptPath: '集团总部/审计监察部', boardPermissions: ['红灯指标汇总'] },
    { id: '9', empId: '10009', name: '钱一', deptPath: '集团总部/公共关系部', boardPermissions: ['部门详细回顾'] },
    { id: '10', empId: '10010', name: '陈二', deptPath: '集团总部/技术研发中心', boardPermissions: ['集团指标大盘', '组织计划全景图'] },
  ];

  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
  const [lastSavedTimes, setLastSavedTimes] = useState<Record<string, string>>({});

  const handleTabSave = (tabName: string) => {
    setIsSaving(prev => ({ ...prev, [tabName]: true }));
    setTimeout(() => {
      setIsSaving(prev => ({ ...prev, [tabName]: false }));
      setLastSavedTimes(prev => ({ ...prev, [tabName]: new Date().toLocaleTimeString() }));
    }, 800);
  };

  const TabFooter = ({ tabName }: { tabName: string }) => (
    <div className="mt-6 px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between sticky bottom-0 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => handleTabSave(tabName)}
          disabled={isSaving[tabName]}
          className="px-8 py-2 bg-[#2f54eb] text-white rounded text-[14px] font-medium hover:bg-[#1d39c4] transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving[tabName] ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          <span>{isSaving[tabName] ? '正在保存...' : '提交保存'}</span>
        </button>
        <button className="px-8 py-2 border border-gray-200 rounded text-[14px] text-gray-600 font-medium hover:bg-gray-50 transition-colors cursor-pointer">
          取消重置
        </button>
      </div>
      {lastSavedTimes[tabName] && (
        <span className="text-[12px] text-gray-400">上次保存于 {lastSavedTimes[tabName]}</span>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f4f5f7] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100">
        <h1 className="text-[16px] font-medium text-gray-900">
          组织绩效基础设置
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-white px-6 border-b border-gray-100">
        {tabs.map(tab => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-[13px] cursor-pointer transition-colors relative ${
              activeTab === tab ? 'text-[#2f54eb] font-medium' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTabBasic"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2f54eb]" 
              />
            )}
          </div>
        ))}
      </div>

      {/* Notice for specific tabs */}
      {['考核指标维度规则', '组织绩效流程规则', '等级分数区间规则', '通知规则'].includes(activeTab) && (
        <div className="mx-6 mt-4 px-4 py-2 bg-blue-50/50 border border-blue-100 rounded flex items-center gap-2 text-[12px] text-[#2f54eb]">
          <Info size={14} className="text-blue-400" />
          <span>已生成的规则，被绩效活动引用后，活动未开启时，可修改，活动启动后，无法修改</span>
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === '考核指标维度规则' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
              {/* Top Controls */}
              <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="规则名称" 
                      value={configSearchTerm}
                      onChange={(e) => setConfigSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded text-[13px] outline-none focus:border-[#2f54eb] min-w-[320px] transition-all bg-white"
                    />
                  </div>
                  <button 
                    onClick={() => setConfigSearchTerm('')}
                    className="px-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    重置
                  </button>
                </div>
                <button 
                  onClick={() => {
                    setCurrentIndicatorData(null);
                    setIsIndicatorDrawerOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-6 py-2 bg-[#2f54eb] text-white rounded text-[13px] font-medium hover:bg-blue-600 transition-all shadow-sm cursor-pointer"
                >
                  <Plus size={16} />
                  <span>新增</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-sm shadow-sm">
                      <tr>
                        <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">规则名称</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">状态</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">创建人</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">创建时间</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">更新人</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">更新时间</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {deptDimensionConfigs
                        .filter(config => config.name.toLowerCase().includes(configSearchTerm.toLowerCase()))
                        .map(config => (
                        <tr key={config.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="text-[13px] font-medium text-gray-900 group-hover:text-[#2f54eb] transition-colors">{config.name}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div 
                              onClick={() => setDeptDimensionConfigs(prev => prev.map(c => c.id === config.id ? { ...c, status: !c.status } : c))}
                              className={`w-10 h-5 rounded-full relative cursor-pointer transition-all duration-300 ${config.status ? 'bg-[#2f54eb] shadow-[0_0_8px_rgba(47,84,235,0.2)]' : 'bg-gray-200'}`}
                            >
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${config.status ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                            </div>
                          </td>
                          <td className="px-4 py-4 text-[13px] text-gray-600">{config.creator}</td>
                          <td className="px-4 py-4 text-[13px] text-gray-400 font-mono italic">{config.createTime}</td>
                          <td className="px-4 py-4 text-[13px] text-gray-600">{config.updater}</td>
                          <td className="px-4 py-4 text-[13px] text-gray-400 font-mono italic">{config.updateTime}</td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-4">
                              <button 
                                onClick={() => {
                                  setCurrentIndicatorData(config);
                                  setIsIndicatorDrawerOpen(true);
                                }}
                                className="text-[#2f54eb] hover:text-blue-700 text-[13px] transition-colors cursor-pointer hover:font-bold"
                              >
                                编辑
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(config.id, config.name, 'indicator')}
                                className="text-red-500 hover:text-red-700 text-[13px] transition-colors cursor-pointer hover:font-bold"
                              >
                                删除
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  setCurrentIndicatorData({ ...config, name: ruleNameForDuplicate(config.name), _isDuplicate: true });
                                  setIsIndicatorDrawerOpen(true);
                                }}
                                className="text-[#2f54eb] hover:text-blue-700 text-[13px] transition-colors cursor-pointer hover:font-bold"
                              >
                                复制
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Pagination */}
                <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-sm">
                  <span className="text-[12px] text-gray-400">共 {deptDimensionConfigs.length} 条数据</span>
                  <div className="flex items-center gap-1.5">
                    <button className="p-2 border border-gray-100 rounded hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                      <ChevronLeft size={16} className="text-gray-400" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-[#2f54eb] text-white rounded text-[13px] font-bold shadow-sm">1</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">2</button>
                    <button className="p-2 border border-gray-100 rounded hover:bg-gray-50 transition-colors">
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <IndicatorDimensionDrawer 
              isOpen={isIndicatorDrawerOpen}
              onClose={() => setIsIndicatorDrawerOpen(false)}
              data={currentIndicatorData}
              onSave={handleIndicatorSave}
            />
          </div>
        )}

        {activeTab === '组织绩效流程规则' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
              {/* Top Controls */}
              <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="搜索规则名称" 
                      value={processSearchTerm}
                      onChange={(e) => setProcessSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded text-[13px] outline-none focus:border-[#2f54eb] min-w-[320px] transition-all bg-white"
                    />
                  </div>
                  <button 
                    onClick={() => setProcessSearchTerm('')}
                    className="px-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    重置
                  </button>
                </div>
                <button 
                  onClick={() => {
                    setCurrentProcessData(null);
                    setIsProcessDrawerOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-6 py-2 bg-[#2f54eb] text-white rounded text-[13px] font-medium hover:bg-blue-600 transition-all shadow-sm cursor-pointer"
                >
                  <Plus size={16} />
                  <span>新增</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-sm shadow-sm">
                      <tr>
                        <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">规则名称</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">状态</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">创建人</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">创建时间</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">更新人</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">更新时间</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {performanceProcessConfigs
                        .filter(config => config.name.toLowerCase().includes(processSearchTerm.toLowerCase()))
                        .map(config => (
                        <tr key={config.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="text-[13px] font-medium text-gray-900 group-hover:text-[#2f54eb] transition-colors">{config.name}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div 
                              onClick={() => setPerformanceProcessConfigs(prev => prev.map(c => c.id === config.id ? { ...c, status: !c.status } : c))}
                              className={`w-10 h-5 rounded-full relative cursor-pointer transition-all duration-300 ${config.status ? 'bg-[#2f54eb]' : 'bg-gray-200'}`}
                            >
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${config.status ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                            </div>
                          </td>
                          <td className="px-4 py-4 text-[13px] text-gray-600">{config.creator}</td>
                          <td className="px-4 py-4 text-[13px] text-gray-400 font-mono italic">{config.createTime}</td>
                          <td className="px-4 py-4 text-[13px] text-gray-600">{config.updater}</td>
                          <td className="px-4 py-4 text-[13px] text-gray-400 font-mono italic">{config.updateTime}</td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-4">
                              <button 
                                onClick={() => {
                                  setCurrentProcessData(config);
                                  setIsProcessDrawerOpen(true);
                                }}
                                className="text-[#2f54eb] hover:text-blue-700 text-[13px] transition-colors cursor-pointer hover:font-bold"
                              >
                                编辑
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(config.id, config.name, 'process')}
                                className="text-red-500 hover:text-red-700 text-[13px] transition-colors cursor-pointer hover:font-bold"
                              >
                                删除
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  setCurrentProcessData({ ...config, name: ruleNameForDuplicate(config.name), _isDuplicate: true });
                                  setIsProcessDrawerOpen(true);
                                }}
                                className="text-[#2f54eb] hover:text-blue-700 text-[13px] transition-colors cursor-pointer hover:font-bold"
                              >
                                复制
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Pagination */}
                <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-sm">
                  <span className="text-[12px] text-gray-400">共 {performanceProcessConfigs.length} 条数据</span>
                  <div className="flex items-center gap-1.5">
                    <button className="p-2 border border-gray-100 rounded hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" disabled>
                      <ChevronLeft size={16} className="text-gray-400" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-[#2f54eb] text-white rounded text-[13px] font-bold shadow-sm">1</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">2</button>
                    <button className="p-2 border border-gray-100 rounded hover:bg-gray-50 transition-colors">
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <PerformanceProcessDrawer 
              isOpen={isProcessDrawerOpen}
              onClose={() => setIsProcessDrawerOpen(false)}
              data={currentProcessData}
              onSave={handleProcessSave}
            />
          </div>
        )}

        {activeTab === '等级分数区间规则' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
              {/* Top Controls */}
              <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="规则名称" 
                      value={levelSearchTerm}
                      onChange={(e) => setLevelSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded text-[13px] outline-none focus:border-[#2f54eb] min-w-[320px] transition-all bg-white"
                    />
                  </div>
                  <button 
                    onClick={() => setLevelSearchTerm('')}
                    className="px-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    重置
                  </button>
                </div>
                <button 
                  onClick={() => {
                    setCurrentGradeRangeData(null);
                    setIsGradeRangeDrawerOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-6 py-2 bg-[#2f54eb] text-white rounded text-[13px] font-medium hover:bg-blue-600 transition-all shadow-sm cursor-pointer"
                >
                  <Plus size={16} />
                  <span>新增</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-sm shadow-sm">
                      <tr>
                        <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">规则名称</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">状态</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">创建人</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">创建时间</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">更新人</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">更新时间</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {levelScoreConfigs
                        .filter(config => config.name.toLowerCase().includes(levelSearchTerm.toLowerCase()))
                        .map(config => (
                        <tr key={config.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="text-[13px] font-medium text-gray-900 group-hover:text-[#2f54eb] transition-colors">{config.name}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div 
                              onClick={() => setLevelScoreConfigs(prev => prev.map(c => c.id === config.id ? { ...c, status: !c.status } : c))}
                              className={`w-10 h-5 rounded-full relative cursor-pointer transition-all duration-300 ${config.status ? 'bg-[#2f54eb] shadow-[0_0_8px_rgba(47,84,235,0.2)]' : 'bg-gray-200'}`}
                            >
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${config.status ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                            </div>
                          </td>
                          <td className="px-4 py-4 text-[13px] text-gray-600">{config.creator}</td>
                          <td className="px-4 py-4 text-[13px] text-gray-400 font-mono italic">{config.createTime}</td>
                          <td className="px-4 py-4 text-[13px] text-gray-600">{config.updater}</td>
                          <td className="px-4 py-4 text-[13px] text-gray-400 font-mono italic">{config.updateTime}</td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-4">
                              <button 
                                onClick={() => {
                                  setCurrentGradeRangeData(config);
                                  setIsGradeRangeDrawerOpen(true);
                                }}
                                className="text-[#2f54eb] hover:text-blue-700 text-[13px] transition-colors cursor-pointer hover:font-bold"
                              >
                                编辑
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(config.id, config.name, 'grade')}
                                className="text-red-500 hover:text-red-700 text-[13px] transition-colors cursor-pointer hover:font-bold"
                              >
                                删除
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  setCurrentGradeRangeData({ ...config, name: ruleNameForDuplicate(config.name), _isDuplicate: true });
                                  setIsGradeRangeDrawerOpen(true);
                                }}
                                className="text-[#2f54eb] hover:text-blue-700 text-[13px] transition-colors cursor-pointer hover:font-bold"
                              >
                                复制
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Pagination */}
                <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-sm">
                  <span className="text-[12px] text-gray-400">共 {levelScoreConfigs.length} 条数据</span>
                  <div className="flex items-center gap-1.5">
                    <button className="p-2 border border-gray-100 rounded hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                      <ChevronLeft size={16} className="text-gray-400" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-[#2f54eb] text-white rounded text-[13px] font-bold shadow-sm">1</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">2</button>
                    <button className="p-2 border border-gray-100 rounded hover:bg-gray-50 transition-colors">
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <GradeRangeDrawer 
              isOpen={isGradeRangeDrawerOpen}
              onClose={() => setIsGradeRangeDrawerOpen(false)}
              data={currentGradeRangeData}
              onSave={handleGradeRangeSave}
            />
          </div>
        )}

        {activeTab === '通知规则' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
              {/* Top Controls */}
              <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="规则名称" 
                      value={notificationSearchTerm}
                      onChange={(e) => setNotificationSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded text-[13px] outline-none focus:border-[#2f54eb] min-w-[320px] transition-all bg-white"
                    />
                  </div>
                  <button 
                    onClick={() => setNotificationSearchTerm('')}
                    className="px-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    重置
                  </button>
                </div>
                <button 
                  onClick={() => {
                    setCurrentNotificationData(null);
                    setIsNotificationDrawerOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-6 py-2 bg-[#2f54eb] text-white rounded text-[13px] font-medium hover:bg-blue-600 transition-all shadow-sm cursor-pointer"
                >
                  <Plus size={16} />
                  <span>新增</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-sm shadow-sm">
                      <tr>
                        <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">规则名称</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">状态</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">创建人</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">创建时间</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">更新人</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">更新时间</th>
                        <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {notificationConfigs
                        .filter(config => config.name.toLowerCase().includes(notificationSearchTerm.toLowerCase()))
                        .map(config => (
                        <tr key={config.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="text-[13px] font-medium text-gray-900 group-hover:text-[#2f54eb] transition-colors">{config.name}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div 
                              onClick={() => setNotificationConfigs(prev => prev.map(c => c.id === config.id ? { ...c, status: !c.status } : c))}
                              className={`w-10 h-5 rounded-full relative cursor-pointer transition-all duration-300 ${config.status ? 'bg-[#2f54eb] shadow-[0_0_8px_rgba(47,84,235,0.2)]' : 'bg-gray-200'}`}
                            >
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${config.status ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                            </div>
                          </td>
                          <td className="px-4 py-4 text-[13px] text-gray-600">{config.creator}</td>
                          <td className="px-4 py-4 text-[13px] text-gray-400 font-mono italic">{config.createTime}</td>
                          <td className="px-4 py-4 text-[13px] text-gray-600">{config.updater}</td>
                          <td className="px-4 py-4 text-[13px] text-gray-400 font-mono italic">{config.updateTime}</td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-4">
                              <button 
                                onClick={() => {
                                  setCurrentNotificationData(config);
                                  setIsNotificationDrawerOpen(true);
                                }}
                                className="text-[#2f54eb] hover:text-blue-700 text-[13px] transition-colors cursor-pointer hover:font-bold"
                              >
                                编辑
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(config.id, config.name, 'notification')}
                                className="text-red-500 hover:text-red-700 text-[13px] transition-colors cursor-pointer hover:font-bold"
                              >
                                删除
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  setCurrentNotificationData({ ...config, name: ruleNameForDuplicate(config.name), _isDuplicate: true });
                                  setIsNotificationDrawerOpen(true);
                                }}
                                className="text-[#2f54eb] hover:text-blue-700 text-[13px] transition-colors cursor-pointer hover:font-bold"
                              >
                                复制
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Pagination */}
                <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-sm">
                  <span className="text-[12px] text-gray-400">共 {notificationConfigs.length} 条数据</span>
                  <div className="flex items-center gap-1.5">
                    <button className="p-2 border border-gray-100 rounded hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                      <ChevronLeft size={16} className="text-gray-400" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-[#2f54eb] text-white rounded text-[13px] font-bold shadow-sm">1</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">2</button>
                    <button className="p-2 border border-gray-100 rounded hover:bg-gray-50 transition-colors">
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <NotificationDrawer 
              isOpen={isNotificationDrawerOpen}
              onClose={() => setIsNotificationDrawerOpen(false)}
              data={currentNotificationData}
              onSave={handleNotificationSave}
            />
          </div>
        )}

        {activeTab === '权限设置' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#fbfcfd]">
            {/* 子页签切换 - 优化为胶囊式切换 */}
            <div className="bg-white px-6 py-3 border-b border-gray-100 flex items-center justify-between shadow-sm relative z-20">
              <div className="flex p-0.5 bg-gray-100/80 rounded-lg border border-gray-200/50">
                {['看板权限', '按钮权限'].map(subTab => (
                  <button
                    key={subTab}
                    onClick={() => setActivePermissionTab(subTab)}
                    className={`px-8 py-1.5 text-[13px] font-medium rounded-md transition-all relative cursor-pointer ${
                      activePermissionTab === subTab 
                      ? 'text-[#2f54eb] shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {activePermissionTab === subTab && (
                      <motion.div 
                        layoutId="activePermissionPill"
                        className="absolute inset-0 bg-white rounded-md shadow-sm"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{subTab}</span>
                  </button>
                ))}
              </div>
            </div>

            {activePermissionTab === '看板权限' ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* 看板权限设置的内容 */}
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2f54eb] transition-colors" size={16} />
                        <input 
                          type="text" 
                          placeholder="搜索员工姓名/ID" 
                          value={permissionSearchTerm}
                          onChange={(e) => setPermissionSearchTerm(e.target.value)}
                          className="pl-9 pr-4 py-2 border border-gray-200 rounded text-[13px] outline-none focus:border-[#2f54eb] min-w-[320px] transition-all bg-white"
                        />
                      </div>
                      <button 
                        onClick={() => setPermissionSearchTerm('')}
                        className="px-4 py-2 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                      >
                        重置
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => {
                          setIsEditMode(false);
                          setAuthFormData({ employeeName: '', depts: [], dashboards: [] });
                          setIsAuthEmployeeDrawerOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-6 py-2 bg-[#2f54eb] text-white rounded text-[13px] font-medium hover:bg-blue-600 transition-all shadow-sm cursor-pointer"
                      >
                        <Plus size={16} />
                        <span>添加授权员工</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 授权列表表格 */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                  <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                        <tr className="bg-gray-50/50">
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight w-[100px] whitespace-nowrap">员工ID</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight w-[120px] whitespace-nowrap">员工姓名</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight w-[200px] whitespace-nowrap">部门名称</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight whitespace-nowrap">组织绩效看板权限</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight w-[100px] whitespace-nowrap">创建人</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight w-[150px] whitespace-nowrap">创建时间</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight w-[100px] whitespace-nowrap">更新人</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight w-[150px] whitespace-nowrap">更新时间</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight w-[240px] text-left sticky right-0 z-20 bg-gray-50 shadow-[-4px_0_10px_rgba(0,0,0,0.03)] whitespace-nowrap">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {[
                          { id: '10001', name: '张三', dept: '信息化中心', permissions: ['集团指标大盘', '实时组织计划全景图', '组织计划全景图'], creator: '管理员', createTime: '2024-03-20 10:00', updater: '管理员', updateTime: '2024-03-22 14:30' },
                          { id: '10002', name: '李四', dept: '人力行政中心', permissions: ['中期回顾总览', '红灯指标汇总'], creator: '管理员', createTime: '2024-03-21 09:00', updater: '张某某', updateTime: '2024-03-25 11:20' },
                          { id: '10003', name: '王五', dept: '财务管理中心', permissions: ['部门详细回顾', '组织计划全景图'], creator: '管理员', createTime: '2024-03-15 14:20', updater: '管理员', updateTime: '2024-03-20 09:15' },
                          { id: '10004', name: '赵六', dept: '战略发展部', permissions: ['集团指标大盘'], creator: '李四', createTime: '2024-02-12 11:30', updater: '李四', updateTime: '2024-02-15 16:40' },
                          { id: '10005', name: '孙七', dept: '法务合规部', permissions: ['实时组织计划全景图'], creator: '李晓明', createTime: '2024-01-20 08:50', updater: '赵六', updateTime: '2024-01-25 10:20' },
                          { id: '10006', name: '周八', dept: '品牌营销部', permissions: ['组织计划全景图'], creator: '周强', createTime: '2023-12-05 15:45', updater: '周强', updateTime: '2023-12-10 11:30' },
                          { id: '10007', name: '吴九', dept: '供应链管理中心', permissions: ['中期回顾总览'], creator: '王凯', createTime: '2023-11-28 09:15', updater: '王凯', updateTime: '2023-12-01 14:00' },
                          { id: '10008', name: '郑十', dept: '审计监察部', permissions: ['红灯指标汇总'], creator: '刘洋', createTime: '2023-11-15 13:20', updater: '刘洋', updateTime: '2023-11-20 17:50' },
                        ]
                        .filter(emp => emp.name.toLowerCase().includes(permissionSearchTerm.toLowerCase()) || emp.id.includes(permissionSearchTerm))
                        .map((emp) => (
                          <tr key={emp.id} className="hover:bg-gray-50/30 transition-colors group">
                            <td className="px-6 py-4 text-[13px] text-gray-600 font-mono italic whitespace-nowrap">{emp.id}</td>
                            <td className="px-6 py-4 text-[13px] text-gray-900 font-medium whitespace-nowrap">{emp.name}</td>
                            <td className="px-6 py-4 text-[13px] text-gray-500 whitespace-nowrap">{emp.dept}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-nowrap gap-2">
                                {emp.permissions.map(p => (
                                  <span key={p} className="px-2 py-0.5 bg-blue-50 text-[#2f54eb] text-[11px] rounded border border-blue-100 whitespace-nowrap">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[13px] text-gray-600 whitespace-nowrap">{emp.creator}</td>
                            <td className="px-6 py-4 text-[13px] text-gray-500 font-mono italic whitespace-nowrap">{emp.createTime}</td>
                            <td className="px-6 py-4 text-[13px] text-gray-600 whitespace-nowrap">{emp.updater}</td>
                            <td className="px-6 py-4 text-[13px] text-gray-500 font-mono italic whitespace-nowrap">{emp.updateTime}</td>
                            <td className="px-6 py-4 text-left sticky right-0 z-10 bg-white group-hover:bg-gray-50 transition-colors shadow-[-4px_0_10px_rgba(0,0,0,0.03)] whitespace-nowrap">
                              <div className="flex items-center justify-start gap-4">
                                <button 
                                  onClick={() => {
                                    setIsEditMode(true);
                                    setAuthFormData({
                                      employeeName: emp.name,
                                      depts: [emp.dept],
                                      dashboards: emp.permissions
                                    });
                                    setIsAuthEmployeeDrawerOpen(true);
                                  }}
                                  className="text-[#2f54eb] hover:text-blue-700 text-[13px] transition-colors cursor-pointer font-bold"
                                >
                                  权限设置
                                </button>
                                <button 
                                  onClick={() => {
                                    setItemToDelete({ id: emp.id, name: emp.name, type: 'auth_employee' });
                                    setIsDeleteModalOpen(true);
                                  }}
                                  className="text-red-500 hover:text-red-700 text-[13px] transition-colors cursor-pointer font-bold"
                                >
                                  删除
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[12px] text-gray-400">共 {[
                          { id: '10001', name: '张三', dept: '信息化中心', permissions: ['集团指标大盘', '实时组织计划全景图', '组织计划全景图'], creator: '管理员', createTime: '2024-03-20 10:00', updater: '管理员', updateTime: '2024-03-22 14:30' },
                          { id: '10002', name: '李四', dept: '人力行政中心', permissions: ['中期回顾总览', '红灯指标汇总'], creator: '管理员', createTime: '2024-03-21 09:00', updater: '张某某', updateTime: '2024-03-25 11:20' },
                          { id: '10003', name: '王五', dept: '财务管理中心', permissions: ['部门详细回顾', '组织计划全景图'], creator: '管理员', createTime: '2024-03-15 14:20', updater: '管理员', updateTime: '2024-03-20 09:15' },
                          { id: '10004', name: '赵六', dept: '战略发展部', permissions: ['集团指标大盘'], creator: '李四', createTime: '2024-02-12 11:30', updater: '李四', updateTime: '2024-02-15 16:40' },
                          { id: '10005', name: '孙七', dept: '法务合规部', permissions: ['实时组织计划全景图'], creator: '李晓明', createTime: '2024-01-20 08:50', updater: '赵六', updateTime: '2024-01-25 10:20' },
                          { id: '10006', name: '周八', dept: '品牌营销部', permissions: ['组织计划全景图'], creator: '周强', createTime: '2023-12-05 15:45', updater: '周强', updateTime: '2023-12-10 11:30' },
                          { id: '10007', name: '吴九', dept: '供应链管理中心', permissions: ['中期回顾总览'], creator: '王凯', createTime: '2023-11-28 09:15', updater: '王凯', updateTime: '2023-12-01 14:00' },
                          { id: '10008', name: '郑十', dept: '审计监察部', permissions: ['红灯指标汇总'], creator: '刘洋', createTime: '2023-11-15 13:20', updater: '刘洋', updateTime: '2023-11-20 17:50' },
                        ].filter(emp => emp.name.toLowerCase().includes(permissionSearchTerm.toLowerCase()) || emp.id.includes(permissionSearchTerm)).length} 条数据</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-gray-400 mr-2">第 1 页 / 共 1 页</span>
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 disabled:opacity-30" disabled>
                        <ChevronLeft size={16} />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center bg-[#2f54eb] text-white rounded text-[13px] shadow-sm">1</button>
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 disabled:opacity-30" disabled>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-y-auto bg-[#f0f2f5] p-6">
                {/* 按钮权限设置的内容 */}
                <div className="max-w-7xl mx-auto w-full space-y-6">
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-5 bg-[#2f54eb] rounded-full" />
                        <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">门户按钮显示控制</h3>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50/50 px-4 py-2 rounded-lg">
                        <span className="text-[13px] text-gray-600 font-medium">启用状态</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={isPortalButtonEnabled}
                            onChange={(e) => setIsPortalButtonEnabled(e.target.checked)}
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2f54eb]"></div>
                        </label>
                      </div>
                    </div>

                    <div className={`p-8 transition-opacity duration-300 ${!isPortalButtonEnabled ? 'opacity-50 grayscale-[0.2]' : ''}`}>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                        <div className="md:col-span-3 space-y-3">
                          <label className="text-[12px] font-bold text-gray-400 block uppercase tracking-wider">功能按钮名称</label>
                          <div className={`w-full px-4 py-2.5 bg-gray-50 text-gray-800 font-bold border border-gray-100 rounded-lg text-[14px] ${!isPortalButtonEnabled ? 'bg-gray-100/80 text-gray-400' : ''}`}>
                            组织绩效计划变更
                          </div>
                        </div>

                        <div className="md:col-span-4 space-y-3">
                          <label className="text-[12px] font-bold text-gray-400 block uppercase tracking-wider">显示截止参考阶段</label>
                          <div className="relative group">
                            <select 
                              disabled={!isPortalButtonEnabled}
                              className={`w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] text-gray-900 outline-none focus:border-[#2f54eb] focus:ring-4 focus:ring-blue-50 transition-all ${!isPortalButtonEnabled ? 'cursor-not-allowed bg-gray-50 text-gray-400' : 'cursor-pointer'}`}
                            >
                              <option>绩效制定计划</option>
                              <option>绩效中期考核</option>
                              <option>组织绩效考核</option>
                            </select>
                            <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${isPortalButtonEnabled ? 'group-focus-within:text-[#2f54eb]' : ''}`} />
                          </div>
                        </div>

                        <div className="md:col-span-5 space-y-3">
                          <label className="text-[12px] font-bold text-gray-400 block uppercase tracking-wider">截止时间偏移配置</label>
                          <div className="flex items-center gap-3 w-full">
                            <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap">参考阶段开始前</span>
                            <input 
                              type="number" 
                              disabled={!isPortalButtonEnabled}
                              defaultValue={1}
                              className={`w-16 border border-gray-200 rounded-lg px-2 py-2.5 text-[14px] text-center font-bold text-[#2f54eb] outline-none focus:border-[#2f54eb] focus:ring-4 focus:ring-blue-50 transition-all ${!isPortalButtonEnabled ? 'cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200' : 'bg-white'}`}
                            />
                            <div className="relative group flex-1">
                              <select 
                                disabled={!isPortalButtonEnabled}
                                className={`w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] text-gray-900 outline-none focus:border-[#2f54eb] focus:ring-4 focus:ring-blue-50 transition-all ${!isPortalButtonEnabled ? 'cursor-not-allowed bg-gray-50 text-gray-400' : 'cursor-pointer'}`}
                              >
                                <option>周</option>
                                <option>天</option>
                                <option>工作日</option>
                              </select>
                              <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${isPortalButtonEnabled ? 'group-focus-within:text-[#2f54eb]' : ''}`} />
                            </div>
                            <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap">停止显示</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`mt-8 p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex items-start gap-3 transition-opacity duration-300 ${!isPortalButtonEnabled ? 'opacity-50' : ''}`}>
                        <div className="text-blue-500 mt-0.5"><Info size={16} /></div>
                        <div className="text-[12px] text-blue-700 leading-relaxed">
                          <p className="font-bold mb-1">规则说明：</p>
                          <p>当系统进入“显示截止参考阶段”之前（按偏移配置计算），门户页面将自动隐藏该功能按钮，以确保流程的严谨性。</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 保持提交保存按钮在该视图 */}
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg text-[14px] font-medium hover:bg-white transition-all cursor-pointer active:scale-95">
                      取消重置
                    </button>
                    <button className="flex items-center gap-2 px-10 py-2 bg-[#2f54eb] text-white rounded-lg text-[14px] font-medium hover:bg-blue-600 transition-all cursor-pointer shadow-lg shadow-blue-200 active:scale-95">
                      <Save size={16} />
                      <span>提交保存</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 删除确认弹窗 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsDeleteModalOpen(false)} />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white rounded-xl shadow-2xl w-[440px] overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={24} className="text-red-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[16px] font-bold text-gray-900">确认删除</h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed">
                    确认删除当前选择的 <span className="text-gray-900 font-bold">[{itemToDelete?.name}]</span> 吗？删除后不可恢复。
                  </p>
                </div>
              </div>
            </div>
            <div className="px-8 py-4 bg-gray-50 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 text-[14px] font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                关闭
              </button>
              <button 
                onClick={confirmDelete}
                className="px-8 py-2 text-[14px] font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all shadow-lg shadow-red-100 cursor-pointer active:scale-95"
              >
                确认删除
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 添加授权员工抽屉 */}
      <AnimatePresence>
        {isAuthEmployeeDrawerOpen && (
          <div className="fixed inset-0 z-[150] overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAuthEmployeeDrawerOpen(false);
                setShowFormErrors(false);
              }}
              className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-[600px] bg-white shadow-2xl flex flex-col"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">{isEditMode ? '权限设置' : '添加授权员工'}</h2>
                <button 
                  onClick={() => {
                    setIsAuthEmployeeDrawerOpen(false);
                    setShowFormErrors(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 group cursor-pointer"
                >
                  <X size={20} className="group-hover:text-gray-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-8">
                {/* 员工姓名 */}
                <div className="space-y-3">
                  <label className="text-[14px] text-gray-600 flex items-center gap-1.5 ml-1">
                    <span className="text-red-500 font-bold">*</span> 员工姓名 :
                  </label>
                  <div className="relative group">
                    <div 
                      className={`w-full ${isEditMode ? 'bg-gray-50' : 'bg-white'} border ${
                        !authFormData.employeeName && showFormErrors 
                        ? 'border-red-500 ring-4 ring-red-50' 
                        : 'border-gray-200 focus-within:border-[#2f54eb] focus-within:ring-4 focus-within:ring-blue-50'
                      } rounded-lg flex transition-all shadow-sm h-[44px] overflow-hidden`}
                    >
                      <input 
                        type="text" 
                        readOnly
                        value={authFormData.employeeName}
                        placeholder="请选择员工"
                        onClick={() => !isEditMode && setIsEmployeeModalOpen(true)}
                        className={`flex-1 px-4 py-2.5 text-[14px] text-gray-900 outline-none placeholder:text-gray-300 ${isEditMode ? 'cursor-not-allowed text-gray-500' : 'cursor-pointer'}`}
                      />
                      {!isEditMode && (
                        <button 
                          onClick={() => setIsEmployeeModalOpen(true)}
                          className="px-4 border-l border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#2f54eb] hover:bg-gray-50 transition-all cursor-pointer"
                        >
                          <Search size={18} />
                        </button>
                      )}
                    </div>
                    {!authFormData.employeeName && showFormErrors && (
                      <p className="text-[12px] text-red-500 mt-1.5 ml-1">请选择员工姓名。</p>
                    )}
                  </div>
                </div>

                {/* 授权部门 */}
                <div className="space-y-3">
                  <label className="text-[14px] text-gray-600 flex items-center gap-1.5 ml-1">
                    <span className="text-red-500 font-bold">*</span> 授权部门 :
                  </label>
                  <div className="relative group">
                    <div 
                      className={`w-full bg-white border ${
                        authFormData.depts.length === 0 && showFormErrors 
                        ? 'border-red-500 ring-4 ring-red-50' 
                        : 'border-gray-200 focus-within:border-[#2f54eb] focus-within:ring-4 focus-within:ring-blue-50'
                      } rounded-lg flex transition-all shadow-sm h-[44px] overflow-hidden`}
                    >
                      <div className="flex-1 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {authFormData.depts.length > 0 ? (
                          authFormData.depts.map(d => (
                            <span key={d} className="px-2 py-0.5 bg-gray-50 text-gray-600 border border-gray-200 rounded text-[12px] whitespace-nowrap flex items-center gap-1">
                              {d}
                              <X size={12} className="cursor-pointer hover:text-red-500" onClick={(e) => {
                                e.stopPropagation();
                                setAuthFormData({...authFormData, depts: authFormData.depts.filter(dept => dept !== d)});
                              }} />
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-300 text-[14px] whitespace-nowrap flex-shrink-0">请选择</span>
                        )}
                        <input 
                          type="text"
                          readOnly
                          onClick={() => setIsDeptModalOpen(true)}
                          className="flex-1 min-w-[30px] outline-none cursor-pointer h-full"
                        />
                      </div>
                      <button 
                        onClick={() => setIsDeptModalOpen(true)}
                        className="px-4 border-l border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#2f54eb] hover:bg-gray-50 transition-all cursor-pointer"
                      >
                        <Search size={18} />
                      </button>
                    </div>
                    {authFormData.depts.length === 0 && showFormErrors && (
                      <p className="text-[12px] text-red-500 mt-1.5 ml-1">请选择授权部门。</p>
                    )}
                  </div>
                </div>

                {/* 授权看板 */}
                <div className="space-y-3">
                  <label className="text-[14px] text-gray-600 flex items-center gap-1.5 ml-1">
                    <span className="text-red-500 font-bold">*</span> 授权看板 :
                  </label>
                  <div className="relative">
                    <div 
                      onClick={() => setIsDashboardsOpen(!isDashboardsOpen)}
                      className={`w-full bg-white border ${
                        authFormData.dashboards.length === 0 && showFormErrors 
                        ? 'border-red-500 ring-4 ring-red-50' 
                        : 'border-gray-200 hover:border-[#2f54eb] focus-within:border-[#2f54eb] focus-within:ring-4 focus-within:ring-blue-50'
                      } rounded-lg flex items-center justify-between px-4 h-[44px] transition-all shadow-sm cursor-pointer`}
                    >
                      <div className="flex flex-nowrap gap-2 overflow-x-auto no-scrollbar py-1">
                        {authFormData.dashboards.length > 0 ? (
                          authFormData.dashboards.map(d => (
                            <span key={d} className="px-2 py-0.5 bg-blue-50 text-[#2f54eb] border border-blue-100 rounded text-[12px] whitespace-nowrap flex items-center gap-1">
                              {d}
                              <X size={12} className="cursor-pointer hover:text-red-500" onClick={(e) => {
                                e.stopPropagation();
                                setAuthFormData({...authFormData, dashboards: authFormData.dashboards.filter(db => db !== d)});
                              }} />
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-300 text-[14px] whitespace-nowrap">请选择</span>
                        )}
                      </div>
                      <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isDashboardsOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {authFormData.dashboards.length === 0 && showFormErrors && (
                      <p className="text-[12px] text-red-500 mt-1.5 ml-1">请选择授权看板。</p>
                    )}

                    {/* 授权看板下拉选择 */}
                    <AnimatePresence>
                      {isDashboardsOpen && (
                        <>
                          <div className="fixed inset-0 z-[160]" onClick={() => setIsDashboardsOpen(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-[170] top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                          >
                            <div className="p-4 border-b border-gray-50 bg-gray-50/30">
                              <div className="relative group">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2f54eb] transition-colors" />
                                <input 
                                  type="text" 
                                  placeholder="搜索" 
                                  value={dashboardSearch}
                                  onChange={(e) => setDashboardSearch(e.target.value)}
                                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-[#2f54eb] transition-all bg-white"
                                />
                              </div>
                              <div className="flex items-center gap-6 mt-4 ml-1">
                                <button 
                                  onClick={() => setAuthFormData({...authFormData, dashboards: [...new Set([...authFormData.dashboards, ...dashboardOptions])]})}
                                  className="text-[13px] text-[#2f54eb] font-medium hover:underline cursor-pointer"
                                >
                                  全选
                                </button>
                                <button 
                                  onClick={() => {
                                    const reversed = dashboardOptions.filter(opt => !authFormData.dashboards.includes(opt));
                                    setAuthFormData({...authFormData, dashboards: reversed});
                                  }}
                                  className="text-[13px] text-[#2f54eb] font-medium hover:underline cursor-pointer"
                                >
                                  反选
                                </button>
                                <button 
                                  onClick={() => setAuthFormData({...authFormData, dashboards: []})}
                                  className="text-[13px] text-[#2f54eb] font-medium hover:underline cursor-pointer"
                                >
                                  无
                                </button>
                              </div>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto p-2 scroll-smooth">
                              {dashboardOptions
                                .filter(opt => opt.toLowerCase().includes(dashboardSearch.toLowerCase()))
                                .map(opt => (
                                <div 
                                  key={opt}
                                  onClick={() => {
                                    const isSelected = authFormData.dashboards.includes(opt);
                                    if (isSelected) {
                                      setAuthFormData({...authFormData, dashboards: authFormData.dashboards.filter(d => d !== opt)});
                                    } else {
                                      setAuthFormData({...authFormData, dashboards: [...authFormData.dashboards, opt]});
                                    }
                                  }}
                                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-all cursor-pointer group"
                                >
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                    authFormData.dashboards.includes(opt) 
                                    ? 'bg-[#2f54eb] border-[#2f54eb]' 
                                    : 'border-gray-300 group-hover:border-[#2f54eb]'
                                  }`}>
                                    {authFormData.dashboards.includes(opt) && <Check size={10} className="text-white" />}
                                  </div>
                                  <span className={`text-[13px] ${authFormData.dashboards.includes(opt) ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>
                                    {opt}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/30">
                <button 
                  onClick={() => {
                    setIsAuthEmployeeDrawerOpen(false);
                    setShowFormErrors(false);
                  }}
                  className="px-8 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-[14px] font-medium hover:bg-white transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    if (authFormData.employeeName && authFormData.depts.length > 0 && authFormData.dashboards.length > 0) {
                      // Save logic here
                      setIsAuthEmployeeDrawerOpen(false);
                      setShowFormErrors(false);
                      setAuthFormData({ employeeName: '', depts: [], dashboards: [] });
                    } else {
                      setShowFormErrors(true);
                    }
                  }}
                  className="px-10 py-2.5 bg-[#2f54eb] text-white rounded-lg text-[14px] font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 cursor-pointer active:scale-95"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 员工选择弹窗 */}
      <AnimatePresence>
        {isEmployeeModalOpen && (
          <div className="fixed inset-0 z-[180] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEmployeeModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden max-h-[90vh]"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                <h3 className="text-[20px] font-bold text-gray-900 tracking-tight">员工</h3>
                <button 
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 group cursor-pointer"
                >
                  <X size={20} className="group-hover:text-gray-600" />
                </button>
              </div>

              <div className="p-8 space-y-6 flex-1 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                        <span className="text-gray-400 group-focus-within:text-[#2f54eb] transition-colors"><Search size={14} /></span>
                      </div>
                      <input 
                        type="text" 
                        placeholder="工号或姓名" 
                        value={empModalSearch.idOrName}
                        onChange={(e) => setEmpModalSearch({...empModalSearch, idOrName: e.target.value})}
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-[#2f54eb] focus:ring-4 focus:ring-blue-50 min-w-[200px] transition-all"
                      />
                    </div>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                        <span className="text-gray-400 group-focus-within:text-[#2f54eb] transition-colors"><Search size={14} /></span>
                      </div>
                      <input 
                        type="text" 
                        placeholder="部门名称" 
                        value={empModalSearch.deptName}
                        onChange={(e) => setEmpModalSearch({...empModalSearch, deptName: e.target.value})}
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-[#2f54eb] focus:ring-4 focus:ring-blue-50 min-w-[200px] transition-all"
                      />
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 cursor-pointer">
                    <RefreshCw size={16} />
                  </button>
                </div>

                <div className="flex-1 border border-gray-100 rounded-xl overflow-hidden flex flex-col min-h-0 bg-[#fbfcfd]">
                  <div className="flex-1 overflow-x-auto overflow-y-auto scroll-smooth">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                      <thead className="sticky top-0 z-10 bg-white border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">员工工号</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">姓名</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">部门名称</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">岗位编码</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">岗位名称</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">公司</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {employeeTableData
                          .filter(emp => (
                            (emp.id.includes(empModalSearch.idOrName) || emp.name.includes(empModalSearch.idOrName)) &&
                            emp.dept.includes(empModalSearch.deptName)
                          ))
                          .map((emp) => (
                          <tr 
                            key={emp.id} 
                            onClick={() => setAuthFormData({...authFormData, employeeName: emp.name})}
                            className={`hover:bg-blue-50/50 transition-all cursor-pointer group ${authFormData.employeeName === emp.name ? 'bg-blue-50/80 shadow-[inset_4px_0_0_#2f54eb]' : ''}`}
                          >
                            <td className="px-6 py-4 text-[13px] text-gray-500 font-mono italic">{emp.id}</td>
                            <td className="px-6 py-4 text-[13px] text-gray-900 font-medium group-hover:text-[#2f54eb]">{emp.name}</td>
                            <td className="px-6 py-4 text-[13px] text-gray-600">{emp.dept}</td>
                            <td className="px-6 py-4 text-[13px] text-gray-500">{emp.postCode}</td>
                            <td className="px-6 py-4 text-[13px] text-gray-500">{emp.postName}</td>
                            <td className="px-6 py-4 text-[13px] text-gray-500">{emp.company}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="px-6 py-4 bg-white border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        <select className="appearance-none bg-white border border-gray-200 rounded px-3 py-1 pr-8 text-[12px] text-gray-600 outline-none focus:border-[#2f54eb] transition-all cursor-pointer">
                          <option>10 条 / 页</option>
                          <option>20 条 / 页</option>
                          <option>50 条 / 页</option>
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#2f54eb] pointer-events-none" />
                      </div>
                      <span className="text-[12px] text-gray-400">共 3886 条数据</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:text-[#2f54eb] hover:bg-blue-50 transition-all">
                        <ChevronLeft size={16} />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center bg-[#2f54eb] text-white rounded text-[13px] font-bold shadow-sm">1</button>
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:text-[#2f54eb] hover:bg-blue-50 transition-all cursor-pointer">2</button>
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:text-[#2f54eb] hover:bg-blue-50 transition-all cursor-pointer">3</button>
                      <span className="text-gray-400 mx-1">...</span>
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:text-[#2f54eb] hover:bg-blue-50 transition-all cursor-pointer">389</button>
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:text-[#2f54eb] hover:bg-blue-50 transition-all cursor-pointer">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/30 relative z-10">
                <button 
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="px-8 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-[14px] font-medium hover:bg-white transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  取消
                </button>
                <button 
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="px-10 py-2.5 bg-[#2f54eb] text-white rounded-lg text-[14px] font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 cursor-pointer active:scale-95"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 部门选择弹窗 */}
      <AnimatePresence>
        {isDeptModalOpen && (
          <div className="fixed inset-0 z-[180] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeptModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden max-h-[90vh]"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                <h3 className="text-[20px] font-bold text-gray-900 tracking-tight">请选择部门</h3>
                <button 
                  onClick={() => setIsDeptModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 group cursor-pointer"
                >
                  <X size={20} className="group-hover:text-gray-600" />
                </button>
              </div>

              <div className="p-8 space-y-6 flex-1 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                        <span className="text-gray-400 group-focus-within:text-[#2f54eb] transition-colors"><Search size={14} /></span>
                      </div>
                      <input 
                        type="text" 
                        placeholder="部门名称" 
                        value={deptModalSearch.name}
                        onChange={(e) => setDeptModalSearch({...deptModalSearch, name: e.target.value})}
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-[#2f54eb] focus:ring-4 focus:ring-blue-50 min-w-[200px] transition-all"
                      />
                    </div>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                        <span className="text-gray-400 group-focus-within:text-[#2f54eb] transition-colors"><Search size={14} /></span>
                      </div>
                      <input 
                        type="text" 
                        placeholder="部门编码" 
                        value={deptModalSearch.code}
                        onChange={(e) => setDeptModalSearch({...deptModalSearch, code: e.target.value})}
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-[#2f54eb] focus:ring-4 focus:ring-blue-50 min-w-[200px] transition-all"
                      />
                    </div>
                    <button className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-gray-900 font-medium transition-colors cursor-pointer ml-2">
                      <Plus size={16} />
                      添加筛选
                    </button>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 cursor-pointer">
                    <RefreshCw size={16} />
                  </button>
                </div>

                <div className="flex-1 border border-gray-100 rounded-xl overflow-hidden flex flex-col min-h-0 bg-[#fbfcfd]">
                  <div className="flex-1 overflow-x-auto overflow-y-auto scroll-smooth">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                      <thead className="sticky top-0 z-10 bg-white border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 w-12">
                            <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#2f54eb] bg-white transition-all">
                              {/* All selected state could be here */}
                            </div>
                          </th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">部门名称</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">部门编码</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">组织层级</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">组织路径名称</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {deptTableData
                          .filter(dept => dept.name.includes(deptModalSearch.name) && dept.code.includes(deptModalSearch.code))
                          .map((dept) => (
                          <tr 
                            key={dept.code} 
                            onClick={() => {
                              const exists = authFormData.depts.includes(dept.name);
                              if (exists) {
                                setAuthFormData({...authFormData, depts: authFormData.depts.filter(d => d !== dept.name)});
                              } else {
                                setAuthFormData({...authFormData, depts: [...authFormData.depts, dept.name]});
                              }
                            }}
                            className={`hover:bg-blue-50/50 transition-all cursor-pointer group ${authFormData.depts.includes(dept.name) ? 'bg-blue-50/80' : ''}`}
                          >
                            <td className="px-6 py-4">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                authFormData.depts.includes(dept.name) 
                                ? 'bg-[#2f54eb] border-[#2f54eb] shadow-sm shadow-blue-100' 
                                : 'border-gray-300 group-hover:border-[#2f54eb]'
                              }`}>
                                {authFormData.depts.includes(dept.name) && <Check size={10} className="text-white" />}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[13px] text-gray-900 font-medium group-hover:text-[#2f54eb]">{dept.name}</td>
                            <td className="px-6 py-4 text-[13px] text-gray-500 font-mono">{dept.code}</td>
                            <td className="px-6 py-4 text-[13px] text-gray-500">{dept.level}</td>
                            <td className="px-6 py-4 text-[13px] text-gray-500">{dept.path}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="px-6 py-4 bg-white border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        <select className="appearance-none bg-white border border-gray-200 rounded px-3 py-1 pr-8 text-[12px] text-gray-600 outline-none focus:border-[#2f54eb] transition-all cursor-pointer">
                          <option>10 条 / 页</option>
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      <span className="text-[12px] text-gray-400">共 532 条数据</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:text-[#2f54eb] hover:bg-blue-50 transition-all">
                        <ChevronLeft size={16} />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center bg-[#2f54eb] text-white rounded text-[13px] font-bold shadow-sm">1</button>
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:text-[#2f54eb] hover:bg-blue-50 transition-all cursor-pointer">2</button>
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:text-[#2f54eb] hover:bg-blue-50 transition-all cursor-pointer">3</button>
                      <span className="text-gray-400 mx-1">...</span>
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:text-[#2f54eb] hover:bg-blue-50 transition-all cursor-pointer">54</button>
                      <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:text-[#2f54eb] hover:bg-blue-50 transition-all cursor-pointer">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/30 relative z-10">
                <button 
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-8 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-[14px] font-medium hover:bg-white transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  取消
                </button>
                <button 
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-10 py-2.5 bg-[#2f54eb] text-white rounded-lg text-[14px] font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 cursor-pointer active:scale-95"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PerformanceActivityPage = ({
  deptDimensionConfigs,
  levelScoreConfigs,
  notificationConfigs,
  performanceProcessConfigs,
  activities,
  setActivities,
  onInitiatePlanChange,
  planChangeSubjectsByActivityId = {},
}: {
  deptDimensionConfigs: any[],
  levelScoreConfigs: any[],
  notificationConfigs: any[],
  performanceProcessConfigs: any[],
  activities: any[],
  setActivities: React.Dispatch<React.SetStateAction<any[]>>,
  onInitiatePlanChange?: (activityId: string, subjects: any[]) => void,
  planChangeSubjectsByActivityId?: Record<string, any[]>,
}) => {
  const [activeTab, setActiveTab] = useState<'进行中' | '已完成'>('进行中');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit' | 'copy'>('add');
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [activityToDelete, setActivityToDelete] = useState<any>(null);
  const [activityToComplete, setActivityToComplete] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNew = () => {
    setSelectedActivity(null);
    setDrawerMode('add');
    setDrawerOpen(true);
  };

  const handleEdit = (activity: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedActivity(activity);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleCopy = (activity: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedActivity(activity);
    setDrawerMode('copy');
    setDrawerOpen(true);
  };

  const handleDeleteClick = (activity: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActivityToDelete(activity);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setActivities(activities.filter(a => a.id !== activityToDelete.id));
    setIsDeleteModalOpen(false);
    setActivityToDelete(null);
  };

  const handleCompleteClick = (activity: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActivityToComplete(activity);
    setIsCompleteModalOpen(true);
  };

  const confirmComplete = () => {
    setActivities(activities.map(a => a.id === activityToComplete.id ? { ...a, status: '已完成' } : a));
    setIsCompleteModalOpen(false);
    setActivityToComplete(null);
  };

  const handleOrgClick = (activity: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedActivity(activity);
    setIsOrgModalOpen(true);
  };

  const handleActivityDrawerCreateSubmit = (payload: ActivityDrawerSubmitPayload) => {
    setActivities((prev) => {
      const ts = formatActivityDateTime();
      const slash = (iso: string) => isoDateToSlash(iso);
      const row: any = {
        id: `act-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
        name: payload.name,
        year: payload.year,
        type: '年度',
        targetList: 0,
        status: '草稿',
        creator: '管理员',
        createTime: ts,
        updater: '管理员',
        updateTime: ts,
        planStageArchivedToMidTerm: false,
        midTermArchivedToAppraisal: false,
        cycleStart: payload.cycleStart,
        cycleEnd: payload.cycleEnd,
        planStageStart: payload.planStageStart,
        planStageEnd: payload.planStageEnd,
        midStageStart: payload.midStageStart,
        midStageEnd: payload.midStageEnd,
        appraisalStageStart: payload.appraisalStageStart,
        appraisalStageEnd: payload.appraisalStageEnd,
        config: {
          phases: [
            {
              name: '组织绩效计划制定',
              date: `${slash(payload.planStageStart)} ~ ${slash(payload.planStageEnd)}`,
              showRounds: false,
              rounds: [],
            },
            {
              name: '组织绩效中期回顾',
              date: `${slash(payload.midStageStart)} ~ ${slash(payload.midStageEnd)}`,
              showRounds: false,
              rounds: [],
            },
            {
              name: '组织绩效考核',
              date: `${slash(payload.appraisalStageStart)} ~ ${slash(payload.appraisalStageEnd)}`,
              showRounds: false,
              rounds: [],
            },
          ],
        },
      };
      return [...prev, row].sort(
        (a, b) => parseActivityUpdateTime(b.updateTime) - parseActivityUpdateTime(a.updateTime)
      );
    });
  };

  const filteredActivities = useMemo(() => {
    const filtered = activities.filter((item) => {
      const tabMatch =
        activeTab === '进行中'
          ? item.status === '草稿' || item.status === '进行中'
          : item.status === '已完成';
      const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return tabMatch && searchMatch;
    });
    return [...filtered].sort(
      (a, b) => parseActivityUpdateTime(b.updateTime) - parseActivityUpdateTime(a.updateTime)
    );
  }, [activities, activeTab, searchQuery]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fcfcfc] overflow-hidden">
      {/* Page Header + Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-3">
          <h1 className="text-[16px] font-medium text-gray-900">组织绩效活动</h1>
        </div>
        
        <div className="flex px-6">
          {(['进行中', '已完成'] as const).map((tab) => (
            <div 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-[14px] cursor-pointer relative transition-colors ${activeTab === tab ? 'text-[#2f54eb] font-medium' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2f54eb]" 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Activity Drawer */}
      <ActivityDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        activity={selectedActivity}
        mode={drawerMode}
        deptConfigs={deptDimensionConfigs}
        levelConfigs={levelScoreConfigs}
        notifyConfigs={notificationConfigs}
        processConfigs={performanceProcessConfigs}
        onSubmit={handleActivityDrawerCreateSubmit}
      />

      {/* Org Assessment Modal */}
      <OrgAssessmentModal 
        isOpen={isOrgModalOpen} 
        onClose={() => setIsOrgModalOpen(false)} 
        activity={selectedActivity}
        planChangeSubjectsByActivityId={planChangeSubjectsByActivityId}
        onInitiatePlanChange={onInitiatePlanChange}
        onActivityMonitoringSync={(activityId, patch) => {
          setActivities((prev) =>
            prev.map((a) => {
              if (a.id !== activityId) return a;
              let next = { ...a, ...patch };
              if (patch.phaseRoundTabs) {
                for (const [phaseName, tabs] of Object.entries(patch.phaseRoundTabs)) {
                  if (tabs?.length) next = mergeActivityPhaseRoundTabs(next, phaseName, tabs);
                }
              }
              return next;
            })
          );
        }}
        onFormalAssessmentArchived={() => {
          const id = selectedActivity?.id;
          if (id) {
            setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, status: '已完成' } : a)));
          }
          setIsOrgModalOpen(false);
        }}
        onEditActivity={() => {
          setIsOrgModalOpen(false);
          setDrawerMode('edit');
          setDrawerOpen(true);
        }}
        onDeleteActivity={() => {
          setIsOrgModalOpen(false);
          if (selectedActivity) {
            setActivityToDelete(selectedActivity);
            setIsDeleteModalOpen(true);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="确认删除绩效活动"
        content={`确定要删除“${activityToDelete?.name}”吗？此操作不可撤销，删除后将无法查看该活动的所有考核数据。`}
      />

      {/* Complete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirm={confirmComplete}
        title="确认完成绩效活动"
        content="确认要执行完成操作吗？操作后数据不可回退"
        confirmText="确认完成"
        confirmColor="bg-[#2f54eb] hover:bg-[#1d39c4]"
      />

      {/* Operation Bar */}
      <div className="px-6 py-3 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="搜索活动名称" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded py-1.5 pl-9 pr-3 text-[13px] focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb] outline-none"
            />
          </div>
          <button 
            onClick={() => setSearchQuery('')}
            className="px-4 py-1.5 border border-gray-200 rounded text-[13px] text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            重置
          </button>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === '进行中' && (
            <button 
              onClick={handleNew}
              className="flex items-center gap-1.5 bg-[#2f54eb] text-white px-4 py-1.5 rounded text-[13px] hover:bg-[#1d39c4] transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              <span>新增</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto p-4 bg-[#fcfcfc]">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 bg-white shadow-sm rounded-lg border border-gray-100 min-w-max">
            <thead>
              <tr className="text-left text-[13px] text-gray-500 bg-gray-50/50">
                <th className="py-3 px-4 font-medium border-b border-gray-100">活动名称</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100">考核年度</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100">考核类型</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100">考核名单</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100 text-center">状态</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100">创建人</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100">创建时间</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100">更新人</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100">更新时间</th>
                <th className="py-3 px-4 font-medium border-b border-gray-100 text-center sticky right-0 bg-gray-50 shadow-[-4px_0_4px_-2px_rgba(0,0,0,0.05)] z-10">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((item) => {
                  const isDraft = item.status === '草稿';
                  return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors text-[13px]">
                    <td className="py-3.5 px-4 border-b border-gray-50">
                      <span 
                        onClick={(e) => handleOrgClick(item, e)}
                        className="font-medium text-[#2f54eb] hover:underline cursor-pointer"
                      >
                        {item.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 border-b border-gray-50 text-gray-600">{item.year}</td>
                    <td className="py-3.5 px-4 border-b border-gray-50 text-gray-600">{item.type}</td>
                    <td className="py-3.5 px-4 border-b border-gray-50 text-gray-600">
                      {item.targetList}
                    </td>
                    <td className="py-3.5 px-4 border-b border-gray-50 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] ${
                        item.status === '草稿'
                          ? 'bg-gray-100 text-gray-600'
                          : item.status === '进行中'
                            ? 'bg-blue-50 text-[#2f54eb]'
                            : 'bg-green-50 text-green-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 border-b border-gray-50 text-gray-600">{item.creator}</td>
                    <td className="py-3.5 px-4 border-b border-gray-50 text-gray-500">{item.createTime}</td>
                    <td className="py-3.5 px-4 border-b border-gray-50 text-gray-600">{item.updater}</td>
                    <td className="py-3.5 px-4 border-b border-gray-50 text-gray-500">{item.updateTime}</td>
                    <td className="py-3.5 px-4 border-b border-gray-50 text-center sticky right-0 bg-white shadow-[-4px_0_4px_-2px_rgba(0,0,0,0.05)] z-10">
                      <div className="flex items-center justify-center gap-3 px-2">
                        <button
                          type="button"
                          aria-disabled={!isDraft}
                          tabIndex={isDraft ? 0 : -1}
                          title={isDraft ? undefined : '仅草稿状态的活动可以编辑'}
                          onClick={(e) => {
                            if (!isDraft) {
                              e.preventDefault();
                              return;
                            }
                            handleEdit(item, e);
                          }}
                          className={`font-medium whitespace-nowrap transition-colors ${
                            isDraft
                              ? 'text-[#2f54eb] hover:text-[#1d39c4] cursor-pointer'
                              : 'text-gray-300 cursor-not-allowed'
                          }`}
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          aria-disabled={!isDraft}
                          tabIndex={isDraft ? 0 : -1}
                          title={isDraft ? undefined : '仅草稿状态的活动可以删除'}
                          onClick={(e) => {
                            if (!isDraft) {
                              e.preventDefault();
                              return;
                            }
                            handleDeleteClick(item, e);
                          }}
                          className={`font-medium whitespace-nowrap transition-colors ${
                            isDraft
                              ? 'text-red-500 hover:text-red-700 cursor-pointer'
                              : 'text-gray-300 cursor-not-allowed'
                          }`}
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-20 text-center text-gray-400 bg-white">
                    <div className="flex flex-col items-center gap-2">
                      <Database size={40} className="opacity-20" />
                      <span>暂无相关活动数据</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-[13px] text-gray-500 bg-white">
        <div className="flex items-center gap-2">
          <span>共 {filteredActivities.length} 条</span>
          <div className="relative ml-2">
            <select className="border border-gray-200 rounded pl-2 pr-6 py-1 outline-none appearance-none bg-white cursor-pointer hover:border-[#2f54eb] transition-all">
              <option>10条/页</option>
              <option>20条/页</option>
              <option>50条/页</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30 transition-colors" disabled>
            <ChevronRight size={16} className="rotate-180" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-[#2f54eb] text-white rounded shadow-sm font-medium">1</button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 transition-colors">2</button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 transition-colors">3</button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activities, setActivities] = useState([
    { 
      id: '1', 
      name: '2023年年度组织绩效考核活动', 
      year: '2023', 
      type: '年度', 
      targetList: 125, 
      status: '进行中', 
      creator: '张三', 
      createTime: '2025-01-10 10:00:00',
      updater: '张三',
      updateTime: '2026-02-01 09:00:00',
      planStageArchivedToMidTerm: true,
      midTermArchivedToAppraisal: false,
      config: {
        phases: [
          { name: '组织绩效计划制定', date: '2023/01/10 ~ 2023/01/15', showRounds: false, rounds: [] },
          {
            name: '组织绩效中期回顾',
            date: '2023/02/15 ~ 2023/02/20',
            showRounds: true,
            rounds: [
              { id: '1', name: '第一轮回顾' },
              { id: '2', name: '第二轮回顾' },
            ],
          },
          { name: '组织绩效考核', date: '2023/03/30 ~ 2023/04/05', showRounds: true, rounds: [{ id: '1', name: '第一轮考核' }] }
        ]
      }
    },
    { 
      id: '2', 
      name: '2024年年度组织绩效考核活动', 
      year: '2024', 
      type: '年度', 
      targetList: 48, 
      status: '进行中', 
      creator: '李四', 
      createTime: '2025-02-01 09:00:00',
      updater: '李四',
      updateTime: '2026-03-01 10:00:00',
      planStageArchivedToMidTerm: true,
      midTermArchivedToAppraisal: true,
      config: {
        phases: [
          { name: '组织绩效计划制定', date: '2024/01/01 ~ 2024/01/31', showRounds: false, rounds: [] },
          { name: '组织绩效中期回顾', date: '2024/07/01 ~ 2024/07/31', showRounds: false, rounds: [] },
          { name: '组织绩效考核', date: '2024/12/01 ~ 2024/12/31', showRounds: true, rounds: [{ id: '1', name: '年度评估轮' }] }
        ]
      }
    },
    { 
      id: '3', 
      name: '2024年年度综合绩效评估', 
      year: '2024', 
      type: '年度', 
      targetList: 560, 
      status: '已完成', 
      creator: '王五', 
      createTime: '2024-12-01 08:30:00',
      updater: '系统管理员',
      updateTime: '2025-01-15 17:00:00'
    },
    { 
      id: '4', 
      name: '2024年市场部专项考核', 
      year: '2024', 
      type: '专项', 
      targetList: 32, 
      status: '已完成', 
      creator: '赵六', 
      createTime: '2024-11-15 10:00:00',
      updater: '张三',
      updateTime: '2024-12-10 16:45:00'
    },
    { 
      id: '5', 
      name: '2025年年度组织绩效考核活动', 
      year: '2025', 
      type: '年度', 
      targetList: 15, 
      status: '进行中', 
      creator: '李四', 
      createTime: '2025-03-01 14:00:00',
      updater: '李四',
      updateTime: '2026-04-15 11:00:00',
      planStageArchivedToMidTerm: true,
      midTermArchivedToAppraisal: false,
      currentMidTermRoundId: 'mid-1',
      config: {
        phases: [
          { name: '组织绩效计划制定', date: '2025/03/01', showRounds: false, rounds: [] },
          {
            name: '组织绩效中期回顾',
            date: '2025/04/15',
            showRounds: true,
            rounds: [
              { id: 'mid-1', name: '第一轮回顾' },
              { id: 'mid-2', name: '第二轮回顾' },
            ],
          },
          { name: '组织绩效考核', date: '2025/05/30', showRounds: true, rounds: [{ id: '1', name: '最终考核轮' }] },
        ],
        phaseRoundTabs: {
          组织绩效中期回顾: [
            { id: 'mid-1', name: '第一轮回顾', isDefault: true, startDate: '2025-03-15', endDate: '2025-04-01' },
            { id: 'mid-2', name: '第二轮回顾', isDefault: false, startDate: '2025-04-02', endDate: '2025-04-15' },
          ],
        },
      },
    },
    {
      id: '6',
      name: '2026年年度组织绩效考核活动',
      year: '2026',
      type: '年度',
      targetList: 0,
      status: '草稿',
      creator: '张三',
      createTime: '2025-04-01 09:00:00',
      updater: '张三',
      updateTime: '2026-05-10 14:00:00',
      config: {
        phases: [
          { name: '组织绩效计划制定', date: '', showRounds: false, rounds: [] },
          { name: '组织绩效中期回顾', date: '', showRounds: true, rounds: [{ id: '1', name: '第一轮回顾' }] },
          { name: '组织绩效考核', date: '', showRounds: true, rounds: [{ id: '1', name: '第一轮考核' }] }
        ]
      }
    },
  ]);

  /** 各活动下「绩效计划变更」监控行：同一考核对象可多条时间线合并为一条展示时，仅「进行中」阻止叠发；上一申请「已完成」后再次发起会写入新的进行中行 */
  const [planChangeSubjectsByActivityId, setPlanChangeSubjectsByActivityId] = useState<Record<string, any[]>>({});

  /** 同一考核对象可多次发起：仅当该对象在本活动下已有「进行中」记录时跳过写入；否则（含上一申请已为「已完成」）覆盖/写入新申请 */
  const handleInitiatePlanChange = (activityId: string, subjects: any[]) => {
    if (!activityId || !subjects?.length) return;
    setPlanChangeSubjectsByActivityId((prev) => {
      const prevRows = prev[activityId] || [];
      const map = new Map<string, any>(prevRows.map((r: any) => [r.id, r]));
      subjects.forEach((row, i) => {
        const existing = map.get(row.id);
        if (existing?.status === '进行中') return;
        map.set(row.id, buildPlanChangeRowFromAssessmentSubject(row, prevRows.length + i));
      });
      return { ...prev, [activityId]: Array.from(map.values()) };
    });
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const updateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    setActivities((acts) => acts.map((a) => (a.id === activityId ? { ...a, updateTime } : a)));
  };

  const [activeMenu, setActiveMenu] = useState('performance-activity');
  const [gradeRanges, setGradeRanges] = useState<GradeRange[]>([
    { id: '1', grade: 'S', min: '4.75', max: '5.00' },
    { id: '2', grade: 'A', min: '4.25', max: '4.74' },
    { id: '3', grade: 'B+', min: '3.75', max: '4.24' },
    { id: '4', grade: 'B', min: '3.00', max: '3.74' },
    { id: '5', grade: 'C', min: '2.00', max: '2.99' },
  ]);

  const [roundingRule, setRoundingRule] = useState('round');

  const [deptDimensionConfigs, setDeptDimensionConfigs] = useState([
    { 
      id: '1', 
      name: '标准部门考核规则',
      description: '标准部门的考核指标维度规则说明',
      status: true,
      creator: '管理员',
      createTime: '2024-03-20 10:00',
      updater: '管理员',
      updateTime: '2024-03-22 14:30',
      rules: [
        { id: '101', deptType: '经营单元', requiredDimensions: ['财务指标', '运营指标'], optionalDimensions: ['客户指标', '组织发展指标'] },
        { id: '102', deptType: '职能部门', requiredDimensions: ['运营指标', '组织发展指标'], optionalDimensions: ['能力建设指标'] }
      ]
    },
    { 
      id: '2', 
      name: '职能体系通用规则',
      description: '职能体系通用的考核指标维度规则说明',
      status: true,
      creator: '管理员',
      createTime: '2024-03-21 09:00',
      updater: '张某某',
      updateTime: '2024-03-25 11:20',
      rules: [
        { id: '201', deptType: '职能部门', requiredDimensions: ['运营指标', '组织发展指标'], optionalDimensions: ['能力建设指标'] }
      ]
    }
  ]);

  const [levelScoreConfigs, setLevelScoreConfigs] = useState([
    { 
      id: '1', 
      name: '2024年度等级评分标准',
      status: true,
      creator: '管理员',
      createTime: '2024-01-15 10:00',
      updater: '管理员',
      updateTime: '2024-03-24 16:30',
      levels: [
        { grade: 'S', min: '4.75', max: '5.00' },
        { grade: 'A', min: '4.25', max: '4.74' }
      ]
    },
    { 
      id: '2', 
      name: '研发体系职级考核规则',
      status: true,
      creator: '张某某',
      createTime: '2024-02-10 09:00',
      updater: '李某某',
      updateTime: '2024-03-20 11:20',
      levels: [
        { grade: 'S', min: '4.80', max: '5.00' },
        { grade: 'A', min: '4.50', max: '4.79' }
      ]
    }
  ]);

  const [notificationConfigs, setNotificationConfigs] = useState([
    { 
      id: '1', 
      name: '全员绩效通知模版',
      status: true,
      creator: '管理员',
      createTime: '2024-02-01 10:00',
      updater: '管理员',
      updateTime: '2024-03-15 14:30',
    },
    { 
      id: '2', 
      name: '管理层特殊节点预警',
      status: false,
      creator: '张某某',
      createTime: '2024-02-15 09:00',
      updater: '张某某',
      updateTime: '2024-02-28 11:20',
    }
  ]);

  const [performanceProcessConfigs, setPerformanceProcessConfigs] = useState([
    { id: '1', name: '标准部门考核规则', status: true, creator: '管理员', createTime: '2024-03-20 10:00', updater: '管理员', updateTime: '2024-03-22 14:30' },
    { id: '2', name: '职能体系通用规则', status: true, creator: '管理员', createTime: '2024-03-21 09:00', updater: '张某某', updateTime: '2024-03-25 11:20' },
  ]);

  const addRow = () => {
    const newRow: GradeRange = {
      id: Math.random().toString(36).substr(2, 9),
      grade: '',
      min: '',
      max: ''
    };
    setGradeRanges([...gradeRanges, newRow]);
  };

  const deleteRow = (id: string) => {
    setGradeRanges(gradeRanges.filter(row => row.id !== id));
  };

  const updateRow = (id: string, field: keyof GradeRange, value: string) => {
    setGradeRanges(gradeRanges.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  return (
    <div className="flex h-screen bg-[#f4f5f7] font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Logo Area */}
        <div className="h-12 bg-[#2f54eb] flex items-center justify-between px-4 text-white">
          <span className="text-sm font-bold tracking-wide">HR2.0开发环境</span>
          <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center cursor-pointer hover:bg-white/30">
            <Plus size={16} />
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="菜单搜索 (⌘+/)" 
              className="w-full bg-gray-100 border-none rounded py-1.5 pl-9 pr-3 text-[12px] focus:ring-1 focus:ring-[#2f54eb] outline-none"
            />
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto">
          <SidebarItem icon={User} label="个人绩效管理" hasSubmenu={false} />
          
          <div className="mt-1">
            <SidebarItem icon={Users} label="组织绩效管理" hasSubmenu={true} isOpen={true} />
            <div className="bg-blue-50/30">
              <SubmenuItem 
                label="组织绩效活动" 
                active={activeMenu === 'performance-activity'} 
                onClick={() => setActiveMenu('performance-activity')}
              />
              <SubmenuItem 
                label="组织绩效流程监控" 
                active={activeMenu === 'performance-monitoring'} 
                onClick={() => setActiveMenu('performance-monitoring')}
              />
              <SubmenuItem 
                label="组织绩效指标库" 
                active={activeMenu === 'indicator-library'} 
                onClick={() => setActiveMenu('indicator-library')}
              />
              <SubmenuItem 
                label="组织绩效基础设置" 
                active={activeMenu === 'basic-rules'} 
                onClick={() => setActiveMenu('basic-rules')}
              />
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-2 border-t border-gray-100 flex justify-between text-gray-400">
          <LayoutGrid size={16} className="cursor-pointer hover:text-gray-600" />
          <FileText size={16} className="cursor-pointer hover:text-gray-600" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-12 bg-[#2f54eb] flex items-center justify-end px-4 gap-6 text-white shrink-0">
          <div className="flex items-center gap-1 text-[13px] cursor-pointer hover:opacity-80">
            <span>HR2.0租户</span>
            <ChevronDown size={14} />
          </div>
          <div className="cursor-pointer hover:opacity-80 relative">
            <div className="w-5 h-5 border border-white/40 rounded-sm flex items-center justify-center">
              <span className="text-[10px]">👕</span>
            </div>
          </div>
          <div className="relative cursor-pointer hover:opacity-80">
            <Bell size={18} />
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] px-1 rounded-full border border-[#2f54eb]">46</span>
          </div>
          <HelpCircle size={18} className="cursor-pointer hover:opacity-80" />
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
            <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
              HR
            </div>
            <span className="text-[13px]">HR租户管理员</span>
            <ChevronDown size={14} />
          </div>
        </header>

        {/* Content Area */}
        {activeMenu === 'grade-settings' ? (
          <GradeSettingsPage 
            gradeRanges={gradeRanges}
            addRow={addRow}
            deleteRow={deleteRow}
            updateRow={updateRow}
            roundingRule={roundingRule}
            setRoundingRule={setRoundingRule}
          />
        ) : activeMenu === 'indicator-library' ? (
          <IndicatorLibraryPage />
        ) : activeMenu === 'performance-monitoring' ? (
          <PerformanceProcessMonitoringPage
            activities={activities}
            planChangeSubjectsByActivityId={planChangeSubjectsByActivityId}
          />
        ) : activeMenu === 'dashboard-mgmt' ? (
          <DashboardDataMgmtPage />
        ) : activeMenu === 'basic-rules' ? (
          <BasicRuleSettingsPage 
            gradeRanges={gradeRanges}
            addRow={addRow}
            deleteRow={deleteRow}
            updateRow={updateRow}
            roundingRule={roundingRule}
            setRoundingRule={setRoundingRule}
            deptDimensionConfigs={deptDimensionConfigs}
            setDeptDimensionConfigs={setDeptDimensionConfigs}
            levelScoreConfigs={levelScoreConfigs}
            setLevelScoreConfigs={setLevelScoreConfigs}
            notificationConfigs={notificationConfigs}
            setNotificationConfigs={setNotificationConfigs}
            performanceProcessConfigs={performanceProcessConfigs}
            setPerformanceProcessConfigs={setPerformanceProcessConfigs}
          />
        ) : (
          <PerformanceActivityPage 
            deptDimensionConfigs={deptDimensionConfigs}
            levelScoreConfigs={levelScoreConfigs}
            notificationConfigs={notificationConfigs}
            performanceProcessConfigs={performanceProcessConfigs}
            activities={activities}
            setActivities={setActivities}
            onInitiatePlanChange={handleInitiatePlanChange}
            planChangeSubjectsByActivityId={planChangeSubjectsByActivityId}
          />
        )}
      </main>
    </div>
  );
}
