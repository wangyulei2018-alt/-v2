const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const newMetricsStr = `
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
    stakeholderScores: [],
    executiveScore: 0,
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
    stakeholderScores: [],
    executiveScore: 0,
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
    stakeholderScores: [],
    executiveScore: 0,
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
    stakeholderScores: [],
    executiveScore: 0,
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
    stakeholderScores: [],
    executiveScore: 0,
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
    stakeholderScores: [],
    executiveScore: 0,
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
    stakeholderScores: [],
    executiveScore: 0,
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
    stakeholderScores: [],
    executiveScore: 0,
    standingCommitteeScore: 0
  }
];
`;

// Replace initialMetrics definition
content = content.replace(/const initialMetrics: Metric\[\] = \[[\s\S]*?\];\n/, newMetricsStr);

// Update useState initializations
content = content.replace(/const \[financialMetrics, setFinancialMetrics\] = useState<Metric\[\]>\([\s\S]*?\);/, 'const [financialMetrics, setFinancialMetrics] = useState<Metric[]>(initialFinancialMetrics);');
content = content.replace(/const \[customerMetrics, setCustomerMetrics\] = useState<Metric\[\]>\([\s\S]*?\);/, 'const [customerMetrics, setCustomerMetrics] = useState<Metric[]>(initialCustomerMetrics);');
content = content.replace(/const \[operationalMetrics, setOperationalMetrics\] = useState<Metric\[\]>\([\s\S]*?\);/, 'const [operationalMetrics, setOperationalMetrics] = useState<Metric[]>(initialOperationalMetrics);');
content = content.replace(/const \[orgMetrics, setOrgMetrics\] = useState<Metric\[\]>\([\s\S]*?\);/, 'const [orgMetrics, setOrgMetrics] = useState<Metric[]>(initialOrgMetrics);');

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated successfully');
