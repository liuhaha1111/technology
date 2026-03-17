export type TemplateStatus = "draft" | "published" | "archived";
export type DeclarationStatus = "draft" | "submitted" | "accepted" | "rejected";

export type TemplateItem = {
  id: string;
  planCategory: string;
  projectCategory: string;
  title: string;
  sourceName?: string;
  guideUnit?: string;
  contactPhone?: string;
  startAt: string;
  endAt: string;
  fileUrl?: string;
  status: TemplateStatus;
};

export type DeclarationItem = {
  id: string;
  templateId: string;
  title: string;
  status: DeclarationStatus;
  content?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type TemplateSnapshot = {
  templateId?: string;
  title?: string;
  planCategory?: string;
  projectCategory?: string;
  sourceName?: string;
  guideUnit?: string;
  contactPhone?: string;
  startAt?: string;
  endAt?: string;
  fileUrl?: string;
};

export type DeclarationEditorMeta = {
  currentStep: number;
  savedAt?: string;
};

export type DeclarationAttachment = {
  fileName: string;
  mimeType: string;
  fileBase64: string;
};

export type DeclarationLeader = {
  name: string;
  gender: string;
  birthday: string;
  idType: string;
  idNumber: string;
  education: string;
  degree: string;
  title: string;
  workUnit: string;
  email: string;
  officePhone: string;
  mobile: string;
  profession: string;
  task: string;
};

export type DeclarationAssistant = {
  name: string;
  gender: string;
  idType: string;
  idNumber: string;
  workUnit: string;
  email: string;
  officePhone: string;
  mobile: string;
};

export type DeclarationBasicInfo = {
  projectName: string;
  subject: string;
  specialty: string;
  keywords: string;
  researchType: string;
  leader: DeclarationLeader;
  assistant: DeclarationAssistant;
};

export type DeclarationParticipatingUnit = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  typePrimary: string;
  typeSecondary: string;
  jurisdiction: string;
};

export type DeclarationUnitInfo = {
  unitName: string;
  address: string;
  contactName: string;
  contactPhone: string;
  unitType: string;
  jurisdiction: string;
  participatingUnits: DeclarationParticipatingUnit[];
};

export type DeclarationPersonnelMember = {
  id: string;
  name: string;
  gender: string;
  idNumber: string;
  unitDept: string;
  title: string;
  profession: string;
  task: string;
};

export type DeclarationPersonnel = {
  members: DeclarationPersonnelMember[];
};

export type DeclarationOverview = {
  overview: string;
  plan: string;
};

export type DeclarationResearch = {
  target: string;
  content: string;
  keyIssues: string;
  purpose: string;
  domesticStatus: string;
  foundation: string;
  route: string;
  attachment?: DeclarationAttachment;
};

export type DeclarationScheduleItem = {
  id: string;
  period: string;
  workPlan: string;
  phaseGoal: string;
};

export type DeclarationPerformance = {
  techReportValue: string;
  techReportDetails: string;
  innovations: {
    newTech: string;
    newProcess: string;
    newMaterial: string;
    newEquip: string;
    newTheory: string;
    newMethod: string;
    newVariety: string;
    newProduct: string;
  };
  innovationDetails: string;
  papers: string;
  platform: string;
  ip: {
    invention: string;
    utility: string;
    software: string;
  };
  books: string;
  newEquipCount: string;
  sharedEquipUsage: string;
  training: {
    sessions: string;
    people: string;
  };
  talent: {
    phd: string;
    master: string;
    other: string;
  };
  otherName: string;
  otherValue: string;
  otherUnit: string;
  otherDetails: string;
};

export type DeclarationBudget = {
  totalBudget: string;
  provinceGrant: string;
  otherFunding: string;
  equipTotal: string;
  equipPurchase: string;
  business: string;
  labor: string;
  indirect: string;
  ratioType: string;
  ratioValue: string;
  ratioExplanation: string;
};

export type DeclarationEditorForm = {
  basicInfo: DeclarationBasicInfo;
  unitInfo: DeclarationUnitInfo;
  personnel: DeclarationPersonnel;
  overview: DeclarationOverview;
  research: DeclarationResearch;
  schedule: DeclarationScheduleItem[];
  performance: DeclarationPerformance;
  budget: DeclarationBudget;
};

export type DeclarationContentPayload = {
  meta: DeclarationEditorMeta;
  form: DeclarationEditorForm;
  templateSnapshot: TemplateSnapshot;
};

export type DeclarationActionFlags = {
  canEdit: boolean;
  canDelete: boolean;
  canSubmit: boolean;
  canViewPdf: boolean;
};
