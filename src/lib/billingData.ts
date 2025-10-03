import { mockMatters } from "./mockData";

export interface BillingEntry {
  id: string;
  date: Date;
  timekeeper: string;
  matterId: string;
  taskCode: string;
  activityCode: string;
  hours: number;
  rate: number;
  amount: number;
  narrative: string;
  status: "Draft" | "Ready" | "Exported";
  complianceStatus: "compliant" | "warning" | "error";
  complianceIssues: string[];
}

export interface ExportHistory {
  id: string;
  exportDate: Date;
  matterIds: string[];
  totalHours: number;
  totalAmount: number;
  filename: string;
  format: "LEDES" | "CSV";
}

export const mockBillingEntries: BillingEntry[] = [
  {
    id: "1",
    date: new Date("2024-03-15"),
    timekeeper: "John Smith",
    matterId: "1",
    taskCode: "L110",
    activityCode: "A101",
    hours: 2.5,
    rate: 350,
    amount: 875,
    narrative: "Reviewed and analyzed patent application documents, identified potential prior art conflicts, prepared detailed memorandum regarding patentability assessment.",
    status: "Ready",
    complianceStatus: "compliant",
    complianceIssues: [],
  },
  {
    id: "2",
    date: new Date("2024-03-15"),
    timekeeper: "Lisa Wong",
    matterId: "1",
    taskCode: "L310",
    activityCode: "A102",
    hours: 1.8,
    rate: 325,
    amount: 585,
    narrative: "Conference with client regarding strategy.",
    status: "Draft",
    complianceStatus: "warning",
    complianceIssues: ["Vague narrative - lacks specific details", "Missing participant information"],
  },
  {
    id: "3",
    date: new Date("2024-03-14"),
    timekeeper: "Sarah Davis",
    matterId: "2",
    taskCode: "L210",
    activityCode: "A103",
    hours: 3.2,
    rate: 300,
    amount: 960,
    narrative: "Drafted licensing agreement provisions covering intellectual property rights, usage restrictions, termination clauses, and compliance requirements for software platform deployment.",
    status: "Ready",
    complianceStatus: "compliant",
    complianceIssues: [],
  },
  {
    id: "4",
    date: new Date("2024-03-14"),
    timekeeper: "Robert Taylor",
    matterId: "3",
    taskCode: "L140",
    activityCode: "A101",
    hours: 0.8,
    rate: 375,
    amount: 300,
    narrative: "Review documents.",
    status: "Draft",
    complianceStatus: "error",
    complianceIssues: ["Exceeds max block time (0.3h for carrier)", "Vague narrative - insufficient detail", "Missing document description"],
  },
  {
    id: "5",
    date: new Date("2024-03-13"),
    timekeeper: "Jennifer Lee",
    matterId: "3",
    taskCode: "L230",
    activityCode: "A104",
    hours: 4.5,
    rate: 350,
    amount: 1575,
    narrative: "Conducted comprehensive discovery review including interrogatory responses, document production analysis, and deposition preparation materials for upcoming witness examination sessions.",
    status: "Ready",
    complianceStatus: "compliant",
    complianceIssues: [],
  },
  {
    id: "6",
    date: new Date("2024-03-13"),
    timekeeper: "Michael Brown",
    matterId: "4",
    taskCode: "L410",
    activityCode: "A105",
    hours: 2.0,
    rate: 285,
    amount: 570,
    narrative: "Legal research.",
    status: "Draft",
    complianceStatus: "warning",
    complianceIssues: ["Vague narrative - lacks specific research topics"],
  },
  {
    id: "7",
    date: new Date("2024-03-12"),
    timekeeper: "Patricia Martinez",
    matterId: "5",
    taskCode: "L520",
    activityCode: "A106",
    hours: 1.5,
    rate: 310,
    amount: 465,
    narrative: "Reviewed HIPAA compliance policies, analyzed regulatory requirements, prepared recommendations for healthcare data protection enhancement measures.",
    status: "Ready",
    complianceStatus: "compliant",
    complianceIssues: [],
  },
  {
    id: "8",
    date: new Date("2024-03-12"),
    timekeeper: "James Wilson",
    matterId: "6",
    taskCode: "L140",
    activityCode: "A107",
    hours: 0.5,
    rate: 340,
    amount: 170,
    narrative: "Email to opposing counsel re: settlement discussions and mediation scheduling with John Doe and Jane Smith participating.",
    status: "Ready",
    complianceStatus: "compliant",
    complianceIssues: [],
  },
  {
    id: "9",
    date: new Date("2024-03-11"),
    timekeeper: "Thomas Anderson",
    matterId: "7",
    taskCode: "L340",
    activityCode: "A108",
    hours: 5.2,
    rate: 395,
    amount: 2054,
    narrative: "Prepared detailed response to SEC inquiry including comprehensive documentation review, financial statement analysis, regulatory compliance assessment, and coordinated with expert witnesses.",
    status: "Ready",
    complianceStatus: "compliant",
    complianceIssues: [],
  },
  {
    id: "10",
    date: new Date("2024-03-11"),
    timekeeper: "Richard Kim",
    matterId: "8",
    taskCode: "L110",
    activityCode: "A109",
    hours: 0.4,
    rate: 360,
    amount: 144,
    narrative: "Research and analysis.",
    status: "Draft",
    complianceStatus: "error",
    complianceIssues: ["Exceeds max block time (0.3h for carrier)", "Vague narrative - no specific subject matter"],
  },
];

export { mockMatters };


export const mockExportHistory: ExportHistory[] = [
  {
    id: "1",
    exportDate: new Date("2024-03-10"),
    matterIds: ["1", "2", "3"],
    totalHours: 45.8,
    totalAmount: 16030,
    filename: "LEDES_Export_2024-03-10.txt",
    format: "LEDES",
  },
  {
    id: "2",
    exportDate: new Date("2024-02-28"),
    matterIds: ["4", "5", "6"],
    totalHours: 38.2,
    totalAmount: 12845,
    filename: "LEDES_Export_2024-02-28.txt",
    format: "LEDES",
  },
  {
    id: "3",
    exportDate: new Date("2024-02-15"),
    matterIds: ["7", "8"],
    totalHours: 52.6,
    totalAmount: 18920,
    filename: "February_Billing_2024-02-15.csv",
    format: "CSV",
  },
];
