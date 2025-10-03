import { z } from 'zod';

// Activity schemas
export const ActivitySchema = z.object({
  id: z.string(),
  appName: z.string(),
  appIcon: z.string(),
  windowTitle: z.string(),
  duration: z.number(),
  timestamp: z.coerce.date(),
  projectId: z.string().optional(),
  matterId: z.string().optional(),
  categoryId: z.string().optional(),
});

export type Activity = z.infer<typeof ActivitySchema>;

// Time Entry schemas
export const TimeEntrySchema = z.object({
  id: z.string(),
  date: z.coerce.date(),
  duration: z.number(),
  description: z.string(),
  projectId: z.string().optional(),
  matterId: z.string().optional(),
  categoryId: z.string().optional(),
  taskCode: z.string().optional(),
  activityCode: z.string().optional(),
  billable: z.boolean(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  narrative: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type TimeEntry = z.infer<typeof TimeEntrySchema>;

// Category schemas
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  keywords: z.array(z.string()),
  totalTimeThisWeek: z.number(),
  entryCount: z.number(),
});

export type Category = z.infer<typeof CategorySchema>;

// Client schemas
export const ClientSchema = z.object({
  id: z.string(),
  name: z.string(),
  clientId: z.string(),
  industry: z.string(),
  billingContact: z.string(),
  email: z.string().email(),
  phone: z.string(),
  billingGuidelines: z.string().optional(),
  createdAt: z.coerce.date(),
});

export type Client = z.infer<typeof ClientSchema>;

// Matter schemas
export const MatterSchema = z.object({
  id: z.string(),
  matterId: z.string(),
  matterName: z.string(),
  clientId: z.string(),
  caseType: z.enum(["Litigation", "Transactional", "Corporate", "Real Estate", "IP", "Employment", "Other"]),
  status: z.enum(["Active", "Closed", "On Hold"]),
  billingRules: z.string(),
  assignedAttorneys: z.array(z.string()),
  notes: z.string(),
  totalTimeLogged: z.number(),
  lastActivityDate: z.coerce.date(),
  createdAt: z.coerce.date(),
});

export type Matter = z.infer<typeof MatterSchema>;

// Billing Entry schemas
export const BillingEntrySchema = z.object({
  id: z.string(),
  date: z.coerce.date(),
  timekeeper: z.string(),
  matterId: z.string(),
  taskCode: z.string(),
  activityCode: z.string(),
  hours: z.number(),
  rate: z.number(),
  amount: z.number(),
  narrative: z.string(),
  status: z.enum(["Draft", "Ready", "Exported"]),
  complianceStatus: z.enum(["compliant", "warning", "error"]),
  complianceIssues: z.array(z.string()),
});

export type BillingEntry = z.infer<typeof BillingEntrySchema>;

// Export History schemas
export const ExportHistorySchema = z.object({
  id: z.string(),
  exportDate: z.coerce.date(),
  matterIds: z.array(z.string()),
  totalHours: z.number(),
  totalAmount: z.number(),
  filename: z.string(),
  format: z.enum(["LEDES", "CSV"]),
});

export type ExportHistory = z.infer<typeof ExportHistorySchema>;

// API Response schemas
export const HealthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  version: z.string().optional(),
});

export const ActivityWatchStatusSchema = z.object({
  connected: z.boolean(),
  lastSync: z.coerce.date().optional(),
  buckets: z.array(z.string()).optional(),
});

export const ComplianceCheckResponseSchema = z.object({
  totalEntries: z.number(),
  compliantCount: z.number(),
  warningCount: z.number(),
  errorCount: z.number(),
  issues: z.array(z.object({
    entryId: z.string(),
    severity: z.enum(["warning", "error"]),
    issues: z.array(z.string()),
  })),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type ActivityWatchStatus = z.infer<typeof ActivityWatchStatusSchema>;
export type ComplianceCheckResponse = z.infer<typeof ComplianceCheckResponseSchema>;
