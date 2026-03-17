import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, ChevronLeft, ChevronRight, FileText, Info, Plus, Save, Trash2, Upload } from "lucide-react";
import type {
  DeclarationEditorForm,
  DeclarationParticipatingUnit,
  DeclarationPersonnelMember,
  DeclarationScheduleItem,
  TemplateItem
} from "./declaration-editor.types";
import { declarationEditorSteps } from "./declaration-editor.utils";

type ProjectDeclarationEditorProps = {
  template: TemplateItem;
  initialForm: DeclarationEditorForm;
  initialStep?: number;
  saving: boolean;
  editingLabel: string;
  onCancel: () => void;
  onSaveDraft: (form: DeclarationEditorForm, currentStep: number) => Promise<void>;
  onSubmit: (form: DeclarationEditorForm) => Promise<void>;
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const textAreaClass = `${inputClass} min-h-[140px] resize-y`;
const tableInputClass =
  "w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-center text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100";

const toMoney = (value: string) => {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const SectionTitle = ({ title, subtitle, extra }: { title: string; subtitle?: string; extra?: string }) => (
  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
    <div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
    </div>
    {extra ? <span className="text-xs font-medium text-slate-500">{extra}</span> : null}
  </div>
);

const Field = ({ label, children, required = false, description }: { key?: any; label: string; children: ReactNode; required?: boolean; description?: string }) => (
  <label className="flex flex-col gap-2 text-sm text-slate-700">
    <span className="font-medium">
      {label}
      {required ? <span className="ml-1 text-rose-500">*</span> : null}
    </span>
    {children}
    {description ? <span className="text-xs text-slate-400">{description}</span> : null}
  </label>
);

export default function ProjectDeclarationEditor({
  template,
  initialForm,
  initialStep = 0,
  saving,
  editingLabel,
  onCancel,
  onSaveDraft,
  onSubmit
}: ProjectDeclarationEditorProps) {
  const [form, setForm] = useState<DeclarationEditorForm>(initialForm);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setForm(initialForm);
    setCurrentStep(initialStep);
    setLocalError("");
  }, [initialForm, initialStep, template.id]);

  const totals = useMemo(() => {
    const direct = toMoney(form.budget.equipTotal) + toMoney(form.budget.business) + toMoney(form.budget.labor);
    const province = direct + toMoney(form.budget.indirect);
    const overall = province + toMoney(form.budget.otherFunding);
    return { direct: direct.toFixed(1), province: province.toFixed(1), overall: overall.toFixed(1) };
  }, [form.budget]);

  const updateParticipatingUnit = (id: string, field: keyof DeclarationParticipatingUnit, value: string) => {
    setForm((prev) => ({
      ...prev,
      unitInfo: {
        ...prev.unitInfo,
        participatingUnits: prev.unitInfo.participatingUnits.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      }
    }));
  };

  const updatePersonnel = (id: string, field: keyof DeclarationPersonnelMember, value: string) => {
    setForm((prev) => ({
      ...prev,
      personnel: { members: prev.personnel.members.map((item) => (item.id === id ? { ...item, [field]: value } : item)) }
    }));
  };

  const updateSchedule = (id: string, field: keyof DeclarationScheduleItem, value: string) => {
    setForm((prev) => ({
      ...prev,
      schedule: prev.schedule.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    }));
  };

  const validateForm = () => {
    if (!form.basicInfo.projectName.trim()) {
      setLocalError("请先填写项目名称。");
      setCurrentStep(0);
      return false;
    }
    setLocalError("");
    return true;
  };

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : "";
        resolve(result.includes(",") ? result.split(",").pop() ?? "" : result);
      };
      reader.onerror = () => reject(new Error("文件读取失败"));
      reader.readAsDataURL(file);
    });

  const handleAttachment = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setLocalError("附件大小不能超过 5MB。");
      event.target.value = "";
      return;
    }
    try {
      const fileBase64 = await fileToBase64(file);
      setForm((prev) => ({
        ...prev,
        research: {
          ...prev.research,
          attachment: { fileName: file.name, mimeType: file.type || "application/octet-stream", fileBase64 }
        }
      }));
      setLocalError("");
    } catch (error: any) {
      setLocalError(error?.message ?? "附件读取失败。");
    } finally {
      event.target.value = "";
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionTitle title="项目基本信息" subtitle="按模板要求补充项目基础信息。" />
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {[
            ["projectName", "项目名称", true],
            ["researchType", "项目研究类型", false],
            ["subject", "所属学科", false],
            ["specialty", "所属专业", false],
            ["keywords", "关键词", false]
          ].map(([field, label, required]) => (
            <Field key={field} label={label as string} required={Boolean(required)}>
              <input className={inputClass} value={form.basicInfo[field as keyof DeclarationEditorForm["basicInfo"]] as string} onChange={(event) => setForm((prev) => ({ ...prev, basicInfo: { ...prev.basicInfo, [field as string]: event.target.value } }))} />
            </Field>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionTitle title="项目负责人" />
        <div className="grid gap-4 p-5 md:grid-cols-3">
          {[
            ["name", "姓名"], ["gender", "性别"], ["birthday", "出生年月"], ["idType", "证件类型"], ["idNumber", "证件号码"], ["education", "学历"], ["degree", "学位"], ["title", "职称"], ["workUnit", "工作单位"], ["email", "电子邮箱"], ["officePhone", "办公电话"], ["mobile", "手机"], ["profession", "现从事专业"], ["task", "承担主要工作"]
          ].map(([field, label]) => (
            <Field key={field} label={label as string} required={field === "name" || field === "mobile"}>
              <input className={inputClass} value={form.basicInfo.leader[field as keyof DeclarationEditorForm["basicInfo"]["leader"]]} onChange={(event) => setForm((prev) => ({ ...prev, basicInfo: { ...prev.basicInfo, leader: { ...prev.basicInfo.leader, [field]: event.target.value } } }))} />
            </Field>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionTitle title="科研助理" subtitle="可填写日常联络人信息。" />
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {[["name", "姓名"], ["gender", "性别"], ["idType", "证件类型"], ["idNumber", "证件号码"], ["workUnit", "工作单位"], ["email", "电子邮箱"], ["officePhone", "办公电话"], ["mobile", "手机"]].map(([field, label]) => (
            <Field key={field} label={label as string}>
              <input className={inputClass} value={form.basicInfo.assistant[field as keyof DeclarationEditorForm["basicInfo"]["assistant"]]} onChange={(event) => setForm((prev) => ({ ...prev, basicInfo: { ...prev.basicInfo, assistant: { ...prev.basicInfo.assistant, [field]: event.target.value } } }))} />
            </Field>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUnitInfo = () => (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionTitle title="申报单位" subtitle="单位信息会与申报书一并进入 PDF。" />
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {[["unitName", "单位名称"], ["unitType", "单位类别"], ["address", "通讯地址"], ["jurisdiction", "隶属关系"], ["contactName", "联系人"], ["contactPhone", "联系电话"]].map(([field, label]) => (
            <Field key={field} label={label as string} required={field === "unitName" || field === "address"}>
              <input className={inputClass} value={form.unitInfo[field as keyof DeclarationEditorForm["unitInfo"]] as string} onChange={(event) => setForm((prev) => ({ ...prev, unitInfo: { ...prev.unitInfo, [field as string]: event.target.value } }))} />
            </Field>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionTitle title="参与单位" subtitle="联合申报时可补充多个合作单位。" />
        <div className="space-y-4 p-5">
          {form.unitInfo.participatingUnits.map((unit) => (
            <div key={unit.id} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">合作单位</h4>
                <button type="button" className="inline-flex items-center gap-1 text-sm text-rose-600" onClick={() => setForm((prev) => ({ ...prev, unitInfo: { ...prev.unitInfo, participatingUnits: prev.unitInfo.participatingUnits.filter((item) => item.id !== unit.id) } }))}><Trash2 className="h-4 w-4" />删除</button>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {[["name", "单位名称"], ["contact", "联系人"], ["phone", "联系电话"], ["typePrimary", "一级类别"], ["typeSecondary", "二级类别"], ["jurisdiction", "隶属关系"]].map(([field, label]) => (
                  <Field key={field} label={label as string}><input className={inputClass} value={unit[field as keyof DeclarationParticipatingUnit]} onChange={(event) => updateParticipatingUnit(unit.id, field as keyof DeclarationParticipatingUnit, event.target.value)} /></Field>
                ))}
              </div>
            </div>
          ))}
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-dashed border-blue-300 px-4 py-2 text-sm font-medium text-blue-700" onClick={() => setForm((prev) => ({ ...prev, unitInfo: { ...prev.unitInfo, participatingUnits: [...prev.unitInfo.participatingUnits, { id: makeId("unit"), name: "", contact: "", phone: "", typePrimary: "", typeSecondary: "", jurisdiction: "" }] } }))}><Plus className="h-4 w-4" />新增参与单位</button>
        </div>
      </div>
    </div>
  );
  const renderPersonnel = () => (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <SectionTitle title="其他参加人员" subtitle="项目参与成员信息将进入申报书附件内容。" />
      <div className="overflow-x-auto p-5">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600">
              {["姓名", "性别", "身份证号", "所在单位及部门", "职称", "专业", "承担工作", "操作"].map((label) => (
                <th key={label} className="border border-slate-200 px-3 py-2 text-left font-medium">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {form.personnel.members.map((member) => (
              <tr key={member.id}>
                {["name", "gender", "idNumber", "unitDept", "title", "profession", "task"].map((field) => (
                  <td key={field} className="border border-slate-200 p-2">
                    <input className={tableInputClass} value={member[field as keyof DeclarationPersonnelMember]} onChange={(event) => updatePersonnel(member.id, field as keyof DeclarationPersonnelMember, event.target.value)} />
                  </td>
                ))}
                <td className="border border-slate-200 p-2 text-center">
                  <button type="button" className="text-rose-600" onClick={() => setForm((prev) => ({ ...prev, personnel: { members: prev.personnel.members.filter((item) => item.id !== member.id) } }))}><Trash2 className="mx-auto h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-blue-300 px-4 py-2 text-sm font-medium text-blue-700" onClick={() => setForm((prev) => ({ ...prev, personnel: { members: [...prev.personnel.members, { id: makeId("member"), name: "", gender: "男", idNumber: "", unitDept: "", title: "", profession: "", task: "" }] } }))}><Plus className="h-4 w-4" />新增参加人员</button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><SectionTitle title="项目概述" subtitle="简要介绍项目核心内容。" /><div className="p-5"><textarea className={textAreaClass} value={form.overview.overview} onChange={(event) => setForm((prev) => ({ ...prev, overview: { ...prev.overview, overview: event.target.value } }))} /></div></div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><SectionTitle title="实施计划" subtitle="介绍整体研究安排与关键节奏。" /><div className="p-5"><textarea className={textAreaClass} value={form.overview.plan} onChange={(event) => setForm((prev) => ({ ...prev, overview: { ...prev.overview, plan: event.target.value } }))} /></div></div>
    </div>
  );

  const renderResearch = () => (
    <div className="space-y-6">
      {[["研究目标", "target"], ["项目研究内容", "content"], ["拟解决的关键技术问题", "keyIssues"], ["项目研究的目的和意义", "purpose"], ["国内外研究现状与发展趋势", "domesticStatus"], ["项目组现有工作基础", "foundation"], ["拟采取的技术路线", "route"]].map(([label, field]) => (
        <div key={field} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><SectionTitle title={label as string} /><div className="p-5"><textarea className={textAreaClass} value={form.research[field as keyof DeclarationEditorForm["research"]] as string} onChange={(event) => setForm((prev) => ({ ...prev, research: { ...prev.research, [field as string]: event.target.value } }))} /></div></div>
      ))}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionTitle title="图表附件" subtitle="支持 pdf、jpg、png，单个文件不超过 5MB。" />
        <div className="flex flex-wrap items-center gap-3 p-5">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"><Upload className="h-4 w-4" />上传附件<input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleAttachment} /></label>
          {form.research.attachment ? <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600"><FileText className="h-4 w-4 text-blue-600" /><span>{form.research.attachment.fileName}</span><button type="button" className="text-rose-600" onClick={() => setForm((prev) => ({ ...prev, research: { ...prev.research, attachment: undefined } }))}>移除</button></div> : null}
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <SectionTitle title="计划进度" subtitle="建议按半年或年度拆分阶段任务。" />
      <div className="overflow-x-auto p-5">
        <table className="min-w-full border-collapse text-sm">
          <thead><tr className="bg-slate-50 text-slate-600">{["时间段", "工作计划", "阶段目标", "操作"].map((label) => <th key={label} className="border border-slate-200 px-3 py-2 text-left font-medium">{label}</th>)}</tr></thead>
          <tbody>
            {form.schedule.map((item) => (
              <tr key={item.id}>
                {["period", "workPlan", "phaseGoal"].map((field) => (
                  <td key={field} className="border border-slate-200 p-2 align-top"><textarea className={`${tableInputClass} min-h-[92px] resize-y text-left`} value={item[field as keyof DeclarationScheduleItem]} onChange={(event) => updateSchedule(item.id, field as keyof DeclarationScheduleItem, event.target.value)} /></td>
                ))}
                <td className="border border-slate-200 p-2 text-center align-top"><button type="button" className="text-rose-600" onClick={() => setForm((prev) => ({ ...prev, schedule: prev.schedule.length > 1 ? prev.schedule.filter((row) => row.id !== item.id) : prev.schedule }))}><Trash2 className="mx-auto h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-blue-300 px-4 py-2 text-sm font-medium text-blue-700" onClick={() => setForm((prev) => ({ ...prev, schedule: [...prev.schedule, { id: makeId("schedule"), period: "", workPlan: "", phaseGoal: "" }] }))}><Plus className="h-4 w-4" />新增计划节点</button>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><SectionTitle title="绩效（验收）指标填报要求" /><div className="space-y-3 p-5 text-sm leading-7 text-slate-600"><p>绩效指标将作为项目评审、验收及绩效评价的重要依据，请按实际情况审慎填写。</p><div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-blue-900"><div className="flex items-start gap-2"><Info className="mt-0.5 h-4 w-4" /><span>核心指标建议优先填写，特殊指标请在“其他”处补充验收方式。</span></div></div></div></div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionTitle title="核心指标" />
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {[["techReportValue", "科技报告数量"], ["papers", "论文数量"], ["techReportDetails", "技术报告说明"], ["innovationDetails", "创新成果说明"]].map(([field, label]) => (
            <Field key={field} label={label as string}>{field.toString().includes("Details") ? <textarea className={textAreaClass} value={form.performance[field as keyof DeclarationEditorForm["performance"]] as string} onChange={(event) => setForm((prev) => ({ ...prev, performance: { ...prev.performance, [field as string]: event.target.value } }))} /> : <input className={inputClass} value={form.performance[field as keyof DeclarationEditorForm["performance"]] as string} onChange={(event) => setForm((prev) => ({ ...prev, performance: { ...prev.performance, [field as string]: event.target.value } }))} />}</Field>
          ))}
        </div>
        <div className="grid gap-4 border-t border-slate-200 p-5 md:grid-cols-4">{[["newTech", "新技术"], ["newProcess", "新工艺"], ["newMaterial", "新材料"], ["newEquip", "新装备"], ["newTheory", "新理论"], ["newMethod", "新方法"], ["newVariety", "新品种"], ["newProduct", "新产品"]].map(([field, label]) => <Field key={field} label={label as string}><input className={inputClass} value={form.performance.innovations[field as keyof DeclarationEditorForm["performance"]["innovations"]]} onChange={(event) => setForm((prev) => ({ ...prev, performance: { ...prev.performance, innovations: { ...prev.performance.innovations, [field]: event.target.value } } }))} /></Field>)}</div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionTitle title="扩展指标" />
        <div className="grid gap-4 p-5 md:grid-cols-3">{[["platform", "平台建设", "root"], ["books", "著作数", "root"], ["newEquipCount", "新增设备数", "root"], ["sharedEquipUsage", "共享设备使用次数", "root"], ["sessions", "培训场次", "training"], ["people", "培训人数", "training"], ["phd", "培养博士", "talent"], ["master", "培养硕士", "talent"], ["other", "其他人才", "talent"], ["invention", "发明专利", "ip"], ["utility", "实用新型", "ip"], ["software", "软件著作权", "ip"]].map(([field, label, group]) => <Field key={`${group}-${field}`} label={label as string}><input className={inputClass} value={group === "root" ? (form.performance[field as keyof DeclarationEditorForm["performance"]] as string) : (form.performance[group as "training" | "talent" | "ip"][field as never] as string)} onChange={(event) => setForm((prev) => ({ ...prev, performance: group === "root" ? { ...prev.performance, [field]: event.target.value } : { ...prev.performance, [group]: { ...prev.performance[group as "training" | "talent" | "ip"], [field]: event.target.value } } }))} /></Field>)}</div>
        <div className="grid gap-4 border-t border-slate-200 p-5 md:grid-cols-3"><Field label="其他指标名称"><input className={inputClass} value={form.performance.otherName} onChange={(event) => setForm((prev) => ({ ...prev, performance: { ...prev.performance, otherName: event.target.value } }))} /></Field><Field label="其他指标值"><input className={inputClass} value={form.performance.otherValue} onChange={(event) => setForm((prev) => ({ ...prev, performance: { ...prev.performance, otherValue: event.target.value } }))} /></Field><Field label="指标单位"><input className={inputClass} value={form.performance.otherUnit} onChange={(event) => setForm((prev) => ({ ...prev, performance: { ...prev.performance, otherUnit: event.target.value } }))} /></Field><Field label="验收考核方式"><textarea className={textAreaClass} value={form.performance.otherDetails} onChange={(event) => setForm((prev) => ({ ...prev, performance: { ...prev.performance, otherDetails: event.target.value } }))} /></Field></div>
      </div>
    </div>
  );

  const renderBudget = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">直接费用</p><p className="mt-2 text-3xl font-semibold text-slate-900">{totals.direct}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">申请省级财政专项资金</p><p className="mt-2 text-3xl font-semibold text-blue-700">{totals.province}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">总计</p><p className="mt-2 text-3xl font-semibold text-emerald-700">{totals.overall}</p></div></div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><SectionTitle title="经费预算表" extra="单位：万元" /><div className="grid gap-4 p-5 md:grid-cols-2">{[["totalBudget", "项目总预算"], ["provinceGrant", "省级财政专项资金"], ["otherFunding", "其他来源资金"], ["equipTotal", "设备费"], ["equipPurchase", "其中：设备购置费"], ["business", "业务费"], ["labor", "劳务费"], ["indirect", "间接费用"], ["ratioType", "首笔拨款比例类型"], ["ratioValue", "首笔拨款比例（%）"]].map(([field, label]) => <Field key={field} label={label as string}><input className={inputClass} value={form.budget[field as keyof DeclarationEditorForm["budget"]]} onChange={(event) => setForm((prev) => ({ ...prev, budget: { ...prev.budget, [field as string]: event.target.value } }))} /></Field>)}<Field label="比例说明"><textarea className={textAreaClass} value={form.budget.ratioExplanation} onChange={(event) => setForm((prev) => ({ ...prev, budget: { ...prev.budget, ratioExplanation: event.target.value } }))} /></Field></div></div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900"><div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4" /><p>请按实际测算填写预算信息。提交后 PDF 将固化当前预算内容，作为后续评审和验收依据。</p></div></div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderBasicInfo();
      case 1: return renderUnitInfo();
      case 2: return renderPersonnel();
      case 3: return renderOverview();
      case 4: return renderResearch();
      case 5: return renderSchedule();
      case 6: return renderPerformance();
      case 7: return renderBudget();
      default: return null;
    }
  };
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
      <div className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-blue-700">项目申报系统</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">{editingLabel}</h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-500 md:grid-cols-2">
              <span>模板标题：{template.title}</span>
              <span>计划类别：{template.planCategory}</span>
              <span>项目类别：{template.projectCategory}</span>
              <span>管理单位：{template.guideUnit || "-"}</span>
            </div>
          </div>
          <button type="button" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm" onClick={onCancel}>返回列表</button>
        </div>
        {localError ? <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{localError}</p> : null}
      </div>
      <div className="flex flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white lg:w-64 lg:border-b-0 lg:border-r">
          <nav className="space-y-1 p-4">
            {declarationEditorSteps.map((step, index) => {
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;
              return (
                <button key={step} type="button" onClick={() => setCurrentStep(index)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${isActive ? "border-blue-600 bg-white text-blue-700" : isCompleted ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-slate-500"}`}>{isCompleted ? <Check className="h-4 w-4" /> : index + 1}</span>
                  <span className="flex-1">{step}</span>
                  {isActive ? <ChevronRight className="h-4 w-4" /> : null}
                </button>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="border-b border-slate-200 bg-white px-6 py-6">
            <div className="grid gap-4 lg:grid-cols-8">
              {declarationEditorSteps.map((step, index) => {
                const isActive = currentStep === index;
                const isCompleted = currentStep > index;
                return (
                  <button key={step} type="button" onClick={() => setCurrentStep(index)} className="flex flex-col items-center gap-2 text-center text-xs text-slate-500">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full font-semibold ${isActive ? "bg-blue-600 text-white ring-4 ring-blue-100" : isCompleted ? "bg-emerald-500 text-white" : "border border-slate-300 bg-white text-slate-500"}`}>{isCompleted ? <Check className="h-4 w-4" /> : index + 1}</span>
                    <span className={isActive ? "font-semibold text-blue-700" : ""}>{step}</span>
                  </button>
                );
              })}
            </div>
          </header>
          <div className="p-4 md:p-6">{renderStepContent()}</div>
          <footer className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-4 md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <button type="button" onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))} disabled={currentStep === 0 || saving} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-4 w-4" />上一步</button>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={async () => { if (!validateForm()) return; await onSaveDraft(form, currentStep); }} disabled={saving} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "保存中..." : "暂存草稿"}</button>
                {currentStep < declarationEditorSteps.length - 1 ? (
                  <button type="button" onClick={() => setCurrentStep((prev) => Math.min(declarationEditorSteps.length - 1, prev + 1))} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-50">下一步<ChevronRight className="h-4 w-4" /></button>
                ) : (
                  <button type="button" onClick={async () => { if (!validateForm()) return; await onSubmit(form); }} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-50"><FileText className="h-4 w-4" />{saving ? "提交中..." : "提交审核"}</button>
                )}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}


