import type {
  DeclarationActionFlags,
  DeclarationContentPayload,
  DeclarationEditorForm,
  DeclarationParticipatingUnit,
  DeclarationPersonnelMember,
  DeclarationScheduleItem,
  DeclarationStatus,
  TemplateItem,
  TemplateSnapshot
} from "./declaration-editor.types";

export const declarationEditorSteps = [
  "基本信息",
  "单位信息",
  "人员信息",
  "项目概述",
  "申报内容",
  "计划进度",
  "绩效指标",
  "经费预算"
] as const;

const asRecord = (value: unknown): Record<string, unknown> | undefined => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
};

const asArray = <T = unknown>(value: unknown): T[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value as T[];
};

const toText = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return "";
};

const buildSnapshot = (template: TemplateItem | null | undefined): TemplateSnapshot => ({
  templateId: template?.id,
  title: template?.title,
  planCategory: template?.planCategory,
  projectCategory: template?.projectCategory,
  sourceName: template?.sourceName,
  guideUnit: template?.guideUnit,
  contactPhone: template?.contactPhone,
  startAt: template?.startAt,
  endAt: template?.endAt,
  fileUrl: template?.fileUrl
});

export const createEmptyDeclarationForm = (contactPhone = "", projectCategory = ""): DeclarationEditorForm => ({
  basicInfo: {
    projectName: "",
    subject: "",
    specialty: "",
    keywords: projectCategory,
    researchType: projectCategory,
    leader: {
      name: "",
      gender: "男",
      birthday: "",
      idType: "身份证",
      idNumber: "",
      education: "",
      degree: "",
      title: "",
      workUnit: "",
      email: "",
      officePhone: "",
      mobile: "",
      profession: "",
      task: ""
    },
    assistant: {
      name: "",
      gender: "男",
      idType: "身份证",
      idNumber: "",
      workUnit: "",
      email: "",
      officePhone: "",
      mobile: ""
    }
  },
  unitInfo: {
    unitName: "",
    address: "",
    contactName: "",
    contactPhone,
    unitType: "",
    jurisdiction: "省直",
    participatingUnits: []
  },
  personnel: {
    members: []
  },
  overview: {
    overview: "",
    plan: ""
  },
  research: {
    target: "",
    content: "",
    keyIssues: "",
    purpose: "",
    domesticStatus: "",
    foundation: "",
    route: ""
  },
  schedule: [
    {
      id: "schedule-1",
      period: "",
      workPlan: "",
      phaseGoal: ""
    }
  ],
  performance: {
    techReportValue: "",
    techReportDetails: "",
    innovations: {
      newTech: "",
      newProcess: "",
      newMaterial: "",
      newEquip: "",
      newTheory: "",
      newMethod: "",
      newVariety: "",
      newProduct: ""
    },
    innovationDetails: "",
    papers: "",
    platform: "",
    ip: {
      invention: "",
      utility: "",
      software: ""
    },
    books: "",
    newEquipCount: "",
    sharedEquipUsage: "",
    training: {
      sessions: "",
      people: ""
    },
    talent: {
      phd: "",
      master: "",
      other: ""
    },
    otherName: "",
    otherValue: "",
    otherUnit: "",
    otherDetails: ""
  },
  budget: {
    totalBudget: "",
    provinceGrant: "",
    otherFunding: "",
    equipTotal: "",
    equipPurchase: "",
    business: "",
    labor: "",
    indirect: "",
    ratioType: "无特殊要求",
    ratioValue: "",
    ratioExplanation: ""
  }
});

const parseParticipatingUnits = (value: unknown): DeclarationParticipatingUnit[] =>
  asArray<Record<string, unknown>>(value).map((item, index) => ({
    id: toText(item.id) || `unit-${index + 1}`,
    name: toText(item.name),
    contact: toText(item.contact),
    phone: toText(item.phone),
    typePrimary: toText(item.typePrimary || item.type1),
    typeSecondary: toText(item.typeSecondary || item.type2),
    jurisdiction: toText(item.jurisdiction)
  }));

const parsePersonnelMembers = (value: unknown): DeclarationPersonnelMember[] =>
  asArray<Record<string, unknown>>(value).map((item, index) => ({
    id: toText(item.id) || `member-${index + 1}`,
    name: toText(item.name),
    gender: toText(item.gender) || "男",
    idNumber: toText(item.idNumber),
    unitDept: toText(item.unitDept),
    title: toText(item.title),
    profession: toText(item.profession),
    task: toText(item.task)
  }));

const parseSchedule = (value: unknown): DeclarationScheduleItem[] => {
  const items = asArray<Record<string, unknown>>(value).map((item, index) => ({
    id: toText(item.id) || `schedule-${index + 1}`,
    period: toText(item.period),
    workPlan: toText(item.workPlan),
    phaseGoal: toText(item.phaseGoal)
  }));

  return items.length > 0
    ? items
    : [
        {
          id: "schedule-1",
          period: "",
          workPlan: "",
          phaseGoal: ""
        }
      ];
};

export const parseDeclarationEditorState = (
  content: Record<string, unknown> | undefined,
  template?: TemplateItem | null
): DeclarationEditorForm => {
  const empty = createEmptyDeclarationForm(template?.contactPhone ?? "", template?.projectCategory ?? "");
  const structuredForm = asRecord(content?.form);

  if (structuredForm && asRecord(structuredForm.basicInfo)) {
    const basicInfo = asRecord(structuredForm.basicInfo) ?? {};
    const leader = asRecord(basicInfo.leader) ?? {};
    const assistant = asRecord(basicInfo.assistant) ?? {};
    const unitInfo = asRecord(structuredForm.unitInfo) ?? {};
    const personnel = asRecord(structuredForm.personnel) ?? {};
    const overview = asRecord(structuredForm.overview) ?? {};
    const research = asRecord(structuredForm.research) ?? {};
    const performance = asRecord(structuredForm.performance) ?? {};
    const performanceInnovations = asRecord(performance.innovations) ?? {};
    const performanceIp = asRecord(performance.ip) ?? {};
    const performanceTraining = asRecord(performance.training) ?? {};
    const performanceTalent = asRecord(performance.talent) ?? {};
    const budget = asRecord(structuredForm.budget) ?? {};
    const attachment = asRecord(research.attachment);

    return {
      basicInfo: {
        projectName: toText(basicInfo.projectName),
        subject: toText(basicInfo.subject),
        specialty: toText(basicInfo.specialty),
        keywords: toText(basicInfo.keywords),
        researchType: toText(basicInfo.researchType),
        leader: {
          name: toText(leader.name),
          gender: toText(leader.gender) || empty.basicInfo.leader.gender,
          birthday: toText(leader.birthday),
          idType: toText(leader.idType) || empty.basicInfo.leader.idType,
          idNumber: toText(leader.idNumber),
          education: toText(leader.education),
          degree: toText(leader.degree),
          title: toText(leader.title),
          workUnit: toText(leader.workUnit),
          email: toText(leader.email),
          officePhone: toText(leader.officePhone),
          mobile: toText(leader.mobile),
          profession: toText(leader.profession),
          task: toText(leader.task)
        },
        assistant: {
          name: toText(assistant.name),
          gender: toText(assistant.gender) || empty.basicInfo.assistant.gender,
          idType: toText(assistant.idType) || empty.basicInfo.assistant.idType,
          idNumber: toText(assistant.idNumber),
          workUnit: toText(assistant.workUnit),
          email: toText(assistant.email),
          officePhone: toText(assistant.officePhone),
          mobile: toText(assistant.mobile)
        }
      },
      unitInfo: {
        unitName: toText(unitInfo.unitName),
        address: toText(unitInfo.address),
        contactName: toText(unitInfo.contactName),
        contactPhone: toText(unitInfo.contactPhone) || template?.contactPhone || "",
        unitType: toText(unitInfo.unitType),
        jurisdiction: toText(unitInfo.jurisdiction) || empty.unitInfo.jurisdiction,
        participatingUnits: parseParticipatingUnits(unitInfo.participatingUnits)
      },
      personnel: {
        members: parsePersonnelMembers(personnel.members)
      },
      overview: {
        overview: toText(overview.overview),
        plan: toText(overview.plan)
      },
      research: {
        target: toText(research.target),
        content: toText(research.content),
        keyIssues: toText(research.keyIssues),
        purpose: toText(research.purpose),
        domesticStatus: toText(research.domesticStatus),
        foundation: toText(research.foundation),
        route: toText(research.route),
        attachment: attachment
          ? {
              fileName: toText(attachment.fileName),
              mimeType: toText(attachment.mimeType),
              fileBase64: toText(attachment.fileBase64)
            }
          : undefined
      },
      schedule: parseSchedule(structuredForm.schedule),
      performance: {
        techReportValue: toText(performance.techReportValue),
        techReportDetails: toText(performance.techReportDetails),
        innovations: {
          newTech: toText(performanceInnovations.newTech),
          newProcess: toText(performanceInnovations.newProcess),
          newMaterial: toText(performanceInnovations.newMaterial),
          newEquip: toText(performanceInnovations.newEquip),
          newTheory: toText(performanceInnovations.newTheory),
          newMethod: toText(performanceInnovations.newMethod),
          newVariety: toText(performanceInnovations.newVariety),
          newProduct: toText(performanceInnovations.newProduct)
        },
        innovationDetails: toText(performance.innovationDetails),
        papers: toText(performance.papers),
        platform: toText(performance.platform),
        ip: {
          invention: toText(performanceIp.invention),
          utility: toText(performanceIp.utility),
          software: toText(performanceIp.software)
        },
        books: toText(performance.books),
        newEquipCount: toText(performance.newEquipCount),
        sharedEquipUsage: toText(performance.sharedEquipUsage),
        training: {
          sessions: toText(performanceTraining.sessions),
          people: toText(performanceTraining.people)
        },
        talent: {
          phd: toText(performanceTalent.phd),
          master: toText(performanceTalent.master),
          other: toText(performanceTalent.other)
        },
        otherName: toText(performance.otherName),
        otherValue: toText(performance.otherValue),
        otherUnit: toText(performance.otherUnit),
        otherDetails: toText(performance.otherDetails)
      },
      budget: {
        totalBudget: toText(budget.totalBudget),
        provinceGrant: toText(budget.provinceGrant),
        otherFunding: toText(budget.otherFunding),
        equipTotal: toText(budget.equipTotal),
        equipPurchase: toText(budget.equipPurchase),
        business: toText(budget.business),
        labor: toText(budget.labor),
        indirect: toText(budget.indirect),
        ratioType: toText(budget.ratioType) || empty.budget.ratioType,
        ratioValue: toText(budget.ratioValue),
        ratioExplanation: toText(budget.ratioExplanation)
      }
    };
  }

  const legacyForm = structuredForm ?? content ?? {};

  return {
    ...empty,
    basicInfo: {
      ...empty.basicInfo,
      projectName: toText(legacyForm.projectName),
      keywords: toText(legacyForm.keyword || legacyForm.keywords) || empty.basicInfo.keywords
    },
    unitInfo: {
      ...empty.unitInfo,
      contactName: toText(legacyForm.contactName),
      contactPhone: toText(legacyForm.contactPhone) || empty.unitInfo.contactPhone
    },
    overview: {
      ...empty.overview,
      overview: toText(legacyForm.summary)
    },
    research: {
      ...empty.research,
      target: toText(legacyForm.target)
    },
    budget: {
      ...empty.budget,
      totalBudget: toText(legacyForm.total),
      provinceGrant: toText(legacyForm.provinceGrant),
      otherFunding: toText(legacyForm.otherFund)
    }
  };
};

export const buildDeclarationContent = (
  template: TemplateItem | null | undefined,
  form: DeclarationEditorForm,
  currentStep: number
): DeclarationContentPayload => ({
  meta: {
    currentStep,
    savedAt: new Date().toISOString()
  },
  form,
  templateSnapshot: buildSnapshot(template)
});

export const parseTemplateSnapshot = (content: Record<string, unknown> | undefined): TemplateSnapshot | undefined => {
  const snapshot = asRecord(content?.templateSnapshot);
  if (!snapshot) {
    return undefined;
  }

  return {
    templateId: toText(snapshot.templateId),
    title: toText(snapshot.title),
    planCategory: toText(snapshot.planCategory),
    projectCategory: toText(snapshot.projectCategory),
    sourceName: toText(snapshot.sourceName),
    guideUnit: toText(snapshot.guideUnit),
    contactPhone: toText(snapshot.contactPhone),
    startAt: toText(snapshot.startAt),
    endAt: toText(snapshot.endAt),
    fileUrl: toText(snapshot.fileUrl)
  };
};

export const getDeclarationActionFlags = (status: DeclarationStatus): DeclarationActionFlags => {
  if (status === "draft") {
    return {
      canEdit: true,
      canDelete: true,
      canSubmit: true,
      canViewPdf: false
    };
  }

  return {
    canEdit: false,
    canDelete: false,
    canSubmit: false,
    canViewPdf: true
  };
};
