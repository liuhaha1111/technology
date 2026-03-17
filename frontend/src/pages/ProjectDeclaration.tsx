import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { portalApi } from "../lib/api";
import ProjectDeclarationEditor from "./project-declaration/ProjectDeclarationEditor";
import type {
  DeclarationEditorForm,
  DeclarationItem,
  DeclarationStatus,
  TemplateItem,
  TemplateSnapshot
} from "./project-declaration/declaration-editor.types";
import {
  buildDeclarationContent,
  createEmptyDeclarationForm,
  declarationEditorSteps,
  getDeclarationActionFlags,
  parseDeclarationEditorState,
  parseTemplateSnapshot
} from "./project-declaration/declaration-editor.utils";

type TabKey = "fill" | "mine" | "submit" | "print";
type TemplateApplyStatus = "open" | "pending" | "ended";

type EditorSession = {
  template: TemplateItem;
  declaration: DeclarationItem | null;
  initialForm: DeclarationEditorForm;
  initialStep: number;
  returnTab: TabKey;
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "fill", label: "填报申报书" },
  { key: "mine", label: "我的申报书" },
  { key: "submit", label: "提交申报书" },
  { key: "print", label: "打印申报书" }
];

const declarationStatusTextMap: Record<DeclarationStatus, string> = {
  draft: "草稿",
  submitted: "已提交",
  accepted: "已通过",
  rejected: "已退回"
};

const declarationStatusClassMap: Record<DeclarationStatus, string> = {
  draft: "text-amber-600",
  submitted: "text-blue-600",
  accepted: "text-emerald-600",
  rejected: "text-rose-600"
};

const templateStatusClassMap: Record<TemplateApplyStatus, string> = {
  open: "text-emerald-600",
  pending: "text-amber-600",
  ended: "text-rose-600"
};

const asRecord = (value: unknown): Record<string, unknown> | undefined => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
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

const formatDateTime = (value: string | undefined) => {
  if (!value) return "-";
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? value : new Date(parsed).toLocaleString("zh-CN", { hour12: false });
};

const readCurrentStep = (content: Record<string, unknown> | undefined) => {
  const meta = asRecord(content?.meta);
  const currentStep = meta?.currentStep;
  return typeof currentStep === "number" && currentStep >= 0 ? currentStep : 0;
};

const toTemplateApplyStatus = (template: TemplateItem): { key: TemplateApplyStatus; text: string } => {
  const now = Date.now();
  const startAt = Date.parse(template.startAt);
  const endAt = Date.parse(template.endAt);

  if (!Number.isNaN(startAt) && now < startAt) return { key: "pending", text: "未开始" };
  if (!Number.isNaN(endAt) && now > endAt) return { key: "ended", text: "已截止" };
  return { key: "open", text: "可填报" };
};

const downloadBase64File = (fileName: string, mimeType: string, fileBase64: string) => {
  const cleanBase64 = fileBase64.includes(",") ? fileBase64.split(",").pop() ?? "" : fileBase64;
  const binary = window.atob(cleanBase64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  const blob = new Blob([bytes], { type: mimeType || "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

export default function ProjectDeclaration() {
  const [activeTab, setActiveTab] = useState<TabKey>("fill");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [declarations, setDeclarations] = useState<DeclarationItem[]>([]);
  const [editorSession, setEditorSession] = useState<EditorSession | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const templateMap = useMemo(() => new Map(templates.map((item) => [item.id, item])), [templates]);
  const sortedDeclarations = useMemo(
    () => [...declarations].sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt)),
    [declarations]
  );
  const submitRows = useMemo(() => sortedDeclarations.filter((item) => item.status === "draft"), [sortedDeclarations]);
  const printRows = useMemo(() => sortedDeclarations.filter((item) => item.status !== "draft"), [sortedDeclarations]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [templateRes, declarationRes] = await Promise.all([portalApi.getTemplates(), portalApi.listDeclarations()]);
      const templateItems = ((((templateRes as any)?.data?.items ?? []) as TemplateItem[]).filter((item) => item.status === "published"));
      const declarationItems = (((declarationRes as any)?.data?.items ?? []) as DeclarationItem[]);
      setTemplates(templateItems);
      setDeclarations(declarationItems);
    } catch (err: any) {
      setError(err?.message ?? "加载模板或申报书失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resolveTemplateForDeclaration = (declaration: DeclarationItem): TemplateItem | null => {
    const current = templateMap.get(declaration.templateId);
    if (current) return current;
    const snapshot: TemplateSnapshot | undefined = parseTemplateSnapshot(declaration.content);
    if (!snapshot) return null;
    return {
      id: snapshot.templateId || declaration.templateId,
      title: snapshot.title || declaration.title,
      planCategory: snapshot.planCategory || "-",
      projectCategory: snapshot.projectCategory || "-",
      sourceName: snapshot.sourceName,
      guideUnit: snapshot.guideUnit,
      contactPhone: snapshot.contactPhone,
      startAt: snapshot.startAt || declaration.createdAt,
      endAt: snapshot.endAt || declaration.updatedAt,
      fileUrl: snapshot.fileUrl,
      status: "published"
    };
  };

  const openCreate = (template: TemplateItem) => {
    setError("");
    setMessage("");
    setActiveTab("fill");
    setEditorSession({
      template,
      declaration: null,
      initialForm: createEmptyDeclarationForm(template.contactPhone ?? "", template.projectCategory),
      initialStep: 0,
      returnTab: "fill"
    });
  };

  const openEdit = (declaration: DeclarationItem, returnTab: TabKey = "mine") => {
    const template = resolveTemplateForDeclaration(declaration);
    if (!template) {
      setError("当前申报书关联模板不存在，无法继续编辑。");
      return;
    }
    setError("");
    setMessage("");
    setActiveTab(returnTab);
    setEditorSession({
      template,
      declaration,
      initialForm: parseDeclarationEditorState(declaration.content, template),
      initialStep: readCurrentStep(declaration.content),
      returnTab
    });
  };

  const closeEditor = () => {
    if (editorSession) {
      setActiveTab(editorSession.returnTab);
    }
    setEditorSession(null);
  };

  const saveDraft = async (form: DeclarationEditorForm, currentStep: number) => {
    if (!editorSession) return;
    const title = form.basicInfo.projectName.trim();
    if (!title) {
      setError("请填写项目名称后再保存。");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const content = buildDeclarationContent(editorSession.template, form, currentStep);
      if (editorSession.declaration) {
        await portalApi.updateDeclaration(editorSession.declaration.id, { title, content });
      } else {
        await portalApi.createDeclaration({ templateId: editorSession.template.id, title, content });
      }
      setMessage("草稿已保存。");
      closeEditor();
      setActiveTab("mine");
      await loadData();
    } catch (err: any) {
      setError(err?.message ?? "草稿保存失败");
    } finally {
      setSaving(false);
    }
  };

  const submitEditorDeclaration = async (form: DeclarationEditorForm) => {
    if (!editorSession) return;
    const title = form.basicInfo.projectName.trim();
    if (!title) {
      setError("请填写项目名称后再提交。");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const content = buildDeclarationContent(editorSession.template, form, declarationEditorSteps.length - 1);
      if (editorSession.declaration) {
        await portalApi.updateDeclaration(editorSession.declaration.id, { title, status: "submitted", content });
      } else {
        const createRes = (await portalApi.createDeclaration({ templateId: editorSession.template.id, title, content })) as any;
        const declarationId = toText(createRes?.data?.id);
        if (!declarationId) throw new Error("创建申报书失败");
        await portalApi.updateDeclaration(declarationId, { title, status: "submitted", content });
      }
      setMessage("申报书已提交并可生成 PDF。");
      closeEditor();
      setActiveTab("mine");
      await loadData();
    } catch (err: any) {
      setError(err?.message ?? "提交申报书失败");
    } finally {
      setSaving(false);
    }
  };
  const submitDeclaration = async (declaration: DeclarationItem) => {
    setError("");
    setMessage("");
    try {
      await portalApi.updateDeclaration(declaration.id, { title: declaration.title, status: "submitted", content: declaration.content });
      setMessage("申报书已提交。");
      await loadData();
    } catch (err: any) {
      setError(err?.message ?? "提交申报书失败");
    }
  };

  const removeDeclaration = async (id: string) => {
    setError("");
    setMessage("");
    try {
      await portalApi.deleteDeclaration(id);
      setMessage("草稿已删除。");
      await loadData();
    } catch (err: any) {
      setError(err?.message ?? "删除申报书失败");
    }
  };

  const downloadTemplate = (template: TemplateItem) => {
    if (!template.fileUrl) {
      setError("该模板未上传附件。");
      return;
    }
    window.open(template.fileUrl, "_blank", "noopener,noreferrer");
  };

  const downloadDeclaration = async (declarationId: string) => {
    setError("");
    setMessage("");
    try {
      const res = await portalApi.downloadDeclaration(declarationId);
      const data = asRecord((res as any)?.data);
      if (!data) throw new Error("下载数据缺失");
      const fileName = toText(data.fileName) || `declaration-${declarationId}.pdf`;
      const mimeType = toText(data.mimeType) || "application/pdf";
      const fileBase64 = toText(data.fileBase64);
      if (!fileBase64) throw new Error("下载文件为空");
      downloadBase64File(fileName, mimeType, fileBase64);
    } catch (err: any) {
      setError(err?.message ?? "查看 PDF 失败");
    }
  };

  const renderTemplateTable = () => (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            {["计划类别", "项目类别", "模板标题", "填报时间", "管理单位", "联系电话", "状态", "操作"].map((label) => (
              <th key={label} className="border-b border-slate-200 px-4 py-3 text-left font-medium">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {templates.length === 0 ? (
            <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-400">{loading ? "加载中..." : "暂无已发布模板"}</td></tr>
          ) : (
            templates.map((template) => {
              const applyStatus = toTemplateApplyStatus(template);
              return (
                <tr key={template.id} className="hover:bg-slate-50">
                  <td className="border-b border-slate-100 px-4 py-3">{template.planCategory}</td>
                  <td className="border-b border-slate-100 px-4 py-3">{template.projectCategory}</td>
                  <td className="border-b border-slate-100 px-4 py-3">{template.title}</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-slate-500">{formatDateTime(template.startAt)} ~ {formatDateTime(template.endAt)}</td>
                  <td className="border-b border-slate-100 px-4 py-3">{template.guideUnit || "-"}</td>
                  <td className="border-b border-slate-100 px-4 py-3">{template.contactPhone || "-"}</td>
                  <td className={`border-b border-slate-100 px-4 py-3 font-medium ${templateStatusClassMap[applyStatus.key]}`}>{applyStatus.text}</td>
                  <td className="border-b border-slate-100 px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700" onClick={() => downloadTemplate(template)} disabled={!template.fileUrl}>下载模板</button>
                      <button type="button" className="rounded-lg border border-blue-500 px-3 py-1.5 text-xs font-medium text-blue-700 disabled:opacity-50" onClick={() => openCreate(template)} disabled={applyStatus.key !== "open"}>填报</button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  const renderDeclarationTable = (rows: DeclarationItem[], mode: TabKey) => (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600"><tr>{["申报标题", "模板", "项目类别", "状态", "更新时间", "操作"].map((label) => <th key={label} className="border-b border-slate-200 px-4 py-3 text-left font-medium">{label}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0 ? <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">暂无数据</td></tr> : rows.map((item) => {
            const template = templateMap.get(item.templateId);
            const snapshot = parseTemplateSnapshot(item.content);
            const templateTitle = template?.title || snapshot?.title || "-";
            const category = template?.projectCategory || snapshot?.projectCategory || "-";
            const actions = getDeclarationActionFlags(item.status);
            return (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="border-b border-slate-100 px-4 py-3">{item.title}</td>
                <td className="border-b border-slate-100 px-4 py-3">{templateTitle}</td>
                <td className="border-b border-slate-100 px-4 py-3">{category}</td>
                <td className={`border-b border-slate-100 px-4 py-3 font-medium ${declarationStatusClassMap[item.status]}`}>{declarationStatusTextMap[item.status]}</td>
                <td className="border-b border-slate-100 px-4 py-3 text-slate-500">{formatDateTime(item.updatedAt)}</td>
                <td className="border-b border-slate-100 px-4 py-3"><div className="flex flex-wrap gap-2">
                  {mode === "mine" && actions.canEdit ? <button type="button" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700" onClick={() => openEdit(item, "mine")}>编辑</button> : null}
                  {mode === "mine" && actions.canDelete ? <button type="button" className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-600" onClick={() => removeDeclaration(item.id)}>删除</button> : null}
                  {mode === "mine" && actions.canViewPdf ? <button type="button" className="rounded-lg border border-blue-500 px-3 py-1.5 text-xs font-medium text-blue-700" onClick={() => downloadDeclaration(item.id)}>查看PDF</button> : null}
                  {mode === "submit" && item.status === "draft" ? <button type="button" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700" onClick={() => openEdit(item, "submit")}>编辑</button> : null}
                  {mode === "submit" && item.status === "draft" ? <button type="button" className="rounded-lg border border-blue-500 px-3 py-1.5 text-xs font-medium text-blue-700" onClick={() => submitDeclaration(item)}>提交审核</button> : null}
                  {mode === "print" ? <button type="button" className="rounded-lg border border-blue-500 px-3 py-1.5 text-xs font-medium text-blue-700" onClick={() => downloadDeclaration(item.id)}>查看PDF</button> : null}
                </div></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-white px-4 py-3 text-sm text-slate-600 shadow-sm"><span className="font-medium text-slate-500">当前位置：</span><span className="font-semibold text-slate-900">项目申报</span>{editorSession ? <span className="font-semibold text-blue-700"> / 项目申报系统</span> : null}</div>
      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      {message ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">{tabs.map((tab) => <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={`rounded-t-xl border px-4 py-2 text-sm ${activeTab === tab.key ? "border-slate-300 bg-slate-100 font-semibold text-slate-900" : "border-transparent bg-white text-slate-500"}`}>{tab.label}</button>)}</div>
      {editorSession ? (
        <ProjectDeclarationEditor template={editorSession.template} initialForm={editorSession.initialForm} initialStep={editorSession.initialStep} saving={saving} editingLabel={editorSession.declaration ? "编辑申报书" : "新建申报书"} onCancel={closeEditor} onSaveDraft={saveDraft} onSubmit={submitEditorDeclaration} />
      ) : activeTab === "fill" ? (
        renderTemplateTable()
      ) : activeTab === "mine" ? (
        renderDeclarationTable(sortedDeclarations, "mine")
      ) : activeTab === "submit" ? (
        renderDeclarationTable(submitRows, "submit")
      ) : (
        renderDeclarationTable(printRows, "print")
      )}
      {!editorSession && activeTab === "mine" ? <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500 shadow-sm"><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-blue-600" /><span>我的申报书中：草稿可编辑和删除，已提交及后续状态只允许查看 PDF。</span></div></div> : null}
    </div>
  );
}


