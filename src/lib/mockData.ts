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
  { day: "Mon", hours: 7.5 },
  { day: "Tue", hours: 8.2 },
  { day: "Wed", hours: 6.8 },
  { day: "Thu", hours: 8.5 },
  { day: "Fri", hours: 7.0 },
  { day: "Sat", hours: 3.5 },
  { day: "Sun", hours: 1.2 },
];
