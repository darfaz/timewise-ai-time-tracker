export interface Activity {
  id: string;
  appName: string;
  appIcon: string;
  windowTitle: string;
  duration: number; // in minutes
  timestamp: Date;
  projectId?: string;
  issues?: string[];
  narrative?: string;
  narrativePreview?: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  totalHours: number;
  billableRate: number;
  status: "active" | "archived";
  color: string;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  description: string;
  duration: number;
  category: string;
  date: Date;
  billable: boolean;
}

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Client Website Redesign",
    category: "Web Development",
    totalHours: 127.5,
    billableRate: 95,
    status: "active",
    color: "hsl(217, 91%, 60%)",
  },
  {
    id: "2",
    name: "Mobile App - Dashboard",
    category: "Mobile Development",
    totalHours: 89.2,
    billableRate: 110,
    status: "active",
    color: "hsl(160, 84%, 39%)",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    category: "Marketing",
    totalHours: 45.8,
    billableRate: 75,
    status: "active",
    color: "hsl(38, 92%, 50%)",
  },
  {
    id: "4",
    name: "Internal Tool Development",
    category: "Internal",
    totalHours: 63.3,
    billableRate: 0,
    status: "active",
    color: "hsl(220, 9%, 46%)",
  },
];

export const mockActivities: Activity[] = [
  {
    id: "1",
    appName: "VS Code",
    appIcon: "Code2",
    windowTitle: "TimeWise - Dashboard.tsx",
    duration: 45,
    timestamp: new Date(Date.now() - 30 * 60000),
    projectId: "1",
    issues: [],
  },
  {
    id: "2",
    appName: "Chrome",
    appIcon: "Chrome",
    windowTitle: "React Documentation - useEffect",
    duration: 15,
    timestamp: new Date(Date.now() - 75 * 60000),
    projectId: "1",
    issues: ["Vague narrative", "Exceeds max block time"],
  },
  {
    id: "3",
    appName: "Figma",
    appIcon: "Figma",
    windowTitle: "Mobile App Design System",
    duration: 62,
    timestamp: new Date(Date.now() - 137 * 60000),
    projectId: "2",
    issues: [],
  },
  {
    id: "4",
    appName: "Slack",
    appIcon: "MessageSquare",
    windowTitle: "Team - Design Discussion",
    duration: 12,
    timestamp: new Date(Date.now() - 199 * 60000),
    projectId: "2",
    issues: ["Missing client code"],
  },
  {
    id: "5",
    appName: "Gmail",
    appIcon: "Mail",
    windowTitle: "Client Update - Project Timeline",
    duration: 8,
    timestamp: new Date(Date.now() - 211 * 60000),
    projectId: "3",
    issues: [],
  },
];

export const mockTimeEntries: TimeEntry[] = [
  {
    id: "1",
    projectId: "1",
    description: "Implemented responsive navigation component with mobile menu, integrated Tailwind CSS utilities for smooth animations and transitions.",
    duration: 120,
    category: "Development",
    date: new Date(),
    billable: true,
  },
  {
    id: "2",
    projectId: "2",
    description: "Designed and prototyped dashboard screens in Figma, created component library with reusable design tokens and variants.",
    duration: 180,
    category: "Design",
    date: new Date(),
    billable: true,
  },
  {
    id: "3",
    projectId: "3",
    description: "Coordinated with marketing team on campaign strategy, drafted email templates and scheduled social media posts.",
    duration: 90,
    category: "Marketing",
    date: new Date(),
    billable: true,
  },
];

export const mockWeeklyData = [
  { day: "Mon", hours: 7.5, billable: 6.0, nonBillable: 1.5 },
  { day: "Tue", hours: 8.2, billable: 7.5, nonBillable: 0.7 },
  { day: "Wed", hours: 6.8, billable: 5.5, nonBillable: 1.3 },
  { day: "Thu", hours: 8.5, billable: 7.8, nonBillable: 0.7 },
  { day: "Fri", hours: 7.0, billable: 6.2, nonBillable: 0.8 },
  { day: "Sat", hours: 3.5, billable: 2.5, nonBillable: 1.0 },
  { day: "Sun", hours: 1.2, billable: 0.0, nonBillable: 1.2 },
];

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  keywords: string[];
  totalTimeThisWeek: number; // in hours
  entryCount: number;
}

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Work",
    color: "hsl(217, 91%, 60%)",
    icon: "Briefcase",
    keywords: ["vscode", "code", "github", "terminal", "figma", "slack"],
    totalTimeThisWeek: 32.5,
    entryCount: 87,
  },
  {
    id: "2",
    name: "Learning",
    color: "hsl(271, 91%, 65%)",
    icon: "BookOpen",
    keywords: ["documentation", "tutorial", "course", "udemy", "youtube"],
    totalTimeThisWeek: 8.2,
    entryCount: 23,
  },
  {
    id: "3",
    name: "Personal",
    color: "hsl(160, 84%, 39%)",
    icon: "User",
    keywords: ["personal", "email", "calendar", "notes"],
    totalTimeThisWeek: 4.7,
    entryCount: 15,
  },
  {
    id: "4",
    name: "Break",
    color: "hsl(220, 9%, 46%)",
    icon: "Coffee",
    keywords: ["break", "lunch", "rest", "away"],
    totalTimeThisWeek: 5.5,
    entryCount: 34,
  },
  {
    id: "5",
    name: "Focus Time",
    color: "hsl(38, 92%, 50%)",
    icon: "Target",
    keywords: ["deep work", "focus", "concentrated"],
    totalTimeThisWeek: 12.3,
    entryCount: 18,
  },
];

export const colorPalette = [
  { name: "Blue", value: "hsl(217, 91%, 60%)" },
  { name: "Purple", value: "hsl(271, 91%, 65%)" },
  { name: "Green", value: "hsl(160, 84%, 39%)" },
  { name: "Orange", value: "hsl(38, 92%, 50%)" },
  { name: "Red", value: "hsl(0, 84%, 60%)" },
  { name: "Pink", value: "hsl(340, 82%, 52%)" },
  { name: "Teal", value: "hsl(180, 84%, 39%)" },
  { name: "Indigo", value: "hsl(239, 84%, 67%)" },
  { name: "Yellow", value: "hsl(48, 96%, 53%)" },
  { name: "Cyan", value: "hsl(199, 89%, 48%)" },
  { name: "Gray", value: "hsl(220, 9%, 46%)" },
  { name: "Lime", value: "hsl(84, 81%, 44%)" },
];

// Legal billing types and interfaces
export interface Client {
  id: string;
  name: string;
  clientId: string; // Firm's internal client ID
  industry: string;
  billingContact: string;
  email: string;
  phone: string;
  billingGuidelines?: string;
  createdAt: Date;
}

export interface Matter {
  id: string;
  matterId: string; // Firm's internal matter ID
  matterName: string;
  clientId: string;
  caseType: "Litigation" | "Transactional" | "Corporate" | "Real Estate" | "IP" | "Employment" | "Other";
  status: "Active" | "Closed" | "On Hold";
  billingRules: string;
  assignedAttorneys: string[];
  notes: string;
  totalTimeLogged: number; // in hours
  lastActivityDate: Date;
  createdAt: Date;
}

export const mockClients: Client[] = [
  {
    id: "1",
    name: "TechCorp Industries",
    clientId: "TC-2024-001",
    industry: "Technology",
    billingContact: "Sarah Johnson",
    email: "sjohnson@techcorp.com",
    phone: "(555) 123-4567",
    billingGuidelines: "Standard ABA guidelines",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Global Manufacturing LLC",
    clientId: "GM-2024-002",
    industry: "Manufacturing",
    billingContact: "Michael Chen",
    email: "mchen@globalmanuf.com",
    phone: "(555) 234-5678",
    billingGuidelines: "UTBMS codes required",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    name: "Riverside Medical Center",
    clientId: "RM-2024-003",
    industry: "Healthcare",
    billingContact: "Dr. Emily Rodriguez",
    email: "erodriguez@riversidemedical.org",
    phone: "(555) 345-6789",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "4",
    name: "Apex Financial Services",
    clientId: "AF-2024-004",
    industry: "Finance",
    billingContact: "David Park",
    email: "dpark@apexfinancial.com",
    phone: "(555) 456-7890",
    billingGuidelines: "Detailed task descriptions required",
    createdAt: new Date("2024-03-10"),
  },
];

export const mockMatters: Matter[] = [
  {
    id: "1",
    matterId: "2024-TC-001",
    matterName: "Patent Infringement Defense",
    clientId: "1",
    caseType: "IP",
    status: "Active",
    billingRules: "ABA Model - Technology",
    assignedAttorneys: ["John Smith", "Lisa Wong"],
    notes: "High priority case with tight deadlines",
    totalTimeLogged: 127.5,
    lastActivityDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    matterId: "2024-TC-002",
    matterName: "Software Licensing Agreement",
    clientId: "1",
    caseType: "Transactional",
    status: "Active",
    billingRules: "Standard hourly",
    assignedAttorneys: ["Sarah Davis"],
    notes: "Negotiation phase with third-party vendor",
    totalTimeLogged: 45.2,
    lastActivityDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "3",
    matterId: "2024-GM-001",
    matterName: "Supply Chain Contract Dispute",
    clientId: "2",
    caseType: "Litigation",
    status: "Active",
    billingRules: "Carrier specific - UTBMS required",
    assignedAttorneys: ["Robert Taylor", "Jennifer Lee"],
    notes: "Discovery phase ongoing",
    totalTimeLogged: 89.8,
    lastActivityDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2024-02-05"),
  },
  {
    id: "4",
    matterId: "2024-GM-002",
    matterName: "Corporate Restructuring",
    clientId: "2",
    caseType: "Corporate",
    status: "On Hold",
    billingRules: "Flat fee arrangement",
    assignedAttorneys: ["Michael Brown"],
    notes: "Awaiting board approval",
    totalTimeLogged: 34.5,
    lastActivityDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "5",
    matterId: "2024-RM-001",
    matterName: "HIPAA Compliance Review",
    clientId: "3",
    caseType: "Corporate",
    status: "Active",
    billingRules: "Standard hourly",
    assignedAttorneys: ["Patricia Martinez"],
    notes: "Annual compliance audit",
    totalTimeLogged: 23.7,
    lastActivityDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2024-02-25"),
  },
  {
    id: "6",
    matterId: "2024-RM-002",
    matterName: "Employment Discrimination Defense",
    clientId: "3",
    caseType: "Employment",
    status: "Active",
    billingRules: "ABA Model - Healthcare",
    assignedAttorneys: ["James Wilson", "Linda Garcia"],
    notes: "Mediation scheduled for next month",
    totalTimeLogged: 67.3,
    lastActivityDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2024-01-30"),
  },
  {
    id: "7",
    matterId: "2024-AF-001",
    matterName: "Securities Fraud Investigation",
    clientId: "4",
    caseType: "Litigation",
    status: "Active",
    billingRules: "Carrier specific - detailed billing",
    assignedAttorneys: ["Thomas Anderson", "Maria Rodriguez"],
    notes: "SEC inquiry response due next week",
    totalTimeLogged: 156.9,
    lastActivityDate: new Date(),
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "8",
    matterId: "2024-AF-002",
    matterName: "Merger Due Diligence",
    clientId: "4",
    caseType: "Corporate",
    status: "Active",
    billingRules: "Blended rate",
    assignedAttorneys: ["Richard Kim", "Susan White"],
    notes: "Target company document review in progress",
    totalTimeLogged: 98.6,
    lastActivityDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2024-03-05"),
  },
  {
    id: "9",
    matterId: "2023-TC-015",
    matterName: "Trade Secret Litigation",
    clientId: "1",
    caseType: "Litigation",
    status: "Closed",
    billingRules: "Contingency + hourly",
    assignedAttorneys: ["John Smith"],
    notes: "Case settled favorably",
    totalTimeLogged: 234.5,
    lastActivityDate: new Date("2024-01-10"),
    createdAt: new Date("2023-08-15"),
  },
  {
    id: "10",
    matterId: "2023-GM-008",
    matterName: "Environmental Compliance Matter",
    clientId: "2",
    caseType: "Corporate",
    status: "Closed",
    billingRules: "Standard hourly",
    assignedAttorneys: ["Jennifer Lee"],
    notes: "EPA approval received",
    totalTimeLogged: 78.2,
    lastActivityDate: new Date("2024-02-15"),
    createdAt: new Date("2023-11-01"),
  },
];
