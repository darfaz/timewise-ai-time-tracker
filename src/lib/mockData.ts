export interface Activity {
  id: string;
  appName: string;
  appIcon: string;
  windowTitle: string;
  duration: number; // in minutes
  timestamp: Date;
  projectId?: string;
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
  },
  {
    id: "2",
    appName: "Chrome",
    appIcon: "Chrome",
    windowTitle: "React Documentation - useEffect",
    duration: 15,
    timestamp: new Date(Date.now() - 75 * 60000),
    projectId: "1",
  },
  {
    id: "3",
    appName: "Figma",
    appIcon: "Figma",
    windowTitle: "Mobile App Design System",
    duration: 62,
    timestamp: new Date(Date.now() - 137 * 60000),
    projectId: "2",
  },
  {
    id: "4",
    appName: "Slack",
    appIcon: "MessageSquare",
    windowTitle: "Team - Design Discussion",
    duration: 12,
    timestamp: new Date(Date.now() - 199 * 60000),
    projectId: "2",
  },
  {
    id: "5",
    appName: "Gmail",
    appIcon: "Mail",
    windowTitle: "Client Update - Project Timeline",
    duration: 8,
    timestamp: new Date(Date.now() - 211 * 60000),
    projectId: "3",
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
