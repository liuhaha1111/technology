# 独立后台管理系统设计文档

日期：2026-03-09  
范围：在当前仓库内新增独立后台子系统，与现有 `frontend/` 与 `supabase-project/` 完全隔离，不修改任何现有代码文件。

## 1. 系统架构与目录隔离

新增目录：

```text
admin-system/
  admin-frontend/          # React + Vite + TypeScript（PC管理端）
  admin-backend/           # Express + TypeScript（统一API层）
  database/
    supabase/
      migrations/          # SQL迁移（RBAC/业务表/审计/统计）
      seeds/               # 初始化角色、权限、演示数据
  docs/
    DEPLOYMENT.md
    OPERATIONS.md
  scripts/
    dev-up.ps1
    verify.ps1
```

访问链路：

- `http://localhost:3100`（admin-frontend）
- `http://localhost:3200`（admin-backend）
- `admin-backend -> local supabase-project`

原则：

- 新代码仅写入 `admin-system/` 与 `docs/plans/`。
- 不改动现有 `frontend/` 与 `supabase-project/` 代码。

## 2. 权限模型与数据模型

### 2.1 RBAC 角色

- `super_admin`：全局可见与全局管理
- `admin`：本单位全管理
- `analyst`：本单位读 + 审核/分析操作
- `viewer`：本单位只读

### 2.2 核心表

- `org_units`
- `admin_users`（关联 `auth.users`）
- `roles`
- `permissions`
- `role_permissions`
- `user_roles`
- `feature_modules`
- `projects`
- `project_stages`
- `project_reviews`
- `audit_logs`
- `daily_metrics`

### 2.3 单位/部门数据隔离

- 业务表统一包含 `org_unit_id`
- `super_admin` 跨单位访问
- 其他角色仅访问自身单位数据
- 后端权限校验 + Supabase RLS 双重控制

## 3. 功能模块与页面架构

### 3.1 仪表盘

- KPI：用户总数、活跃用户、角色分布、项目状态分布
- 趋势：近7/30天登录趋势、错误率、审计事件趋势

### 3.2 用户与权限

- 用户列表/新增/禁用/重置密码
- 角色分配与权限矩阵
- 单位归属管理
- 登录与授权审计查询

### 3.3 业务管理（覆盖现有全部业务模块）

- 项目申报
- 项目立项
- 中期检查
- 技术报告
- 项目验收
- 成果评价
- 诚信复议
- 专家管理
- 合同管理
- 经费调整
- 单位调整
- 延期申请
- 终止撤销
- 备案系统

统一交互：列表检索 + 详情 + 审核动作 + 历史记录

### 3.4 统计分析

- 多维筛选（时间、单位、模块、状态）
- 趋势分析、结构分析、漏斗分析、通过率、逾期率
- CSV 导出（第一版）

### 3.5 系统设置

- 模块开关
- 字典配置
- 通知模板（基础版）
- 审计策略与保留周期（基础版）

### 3.6 UI 风格约束

- 延续现有蓝色系视觉风格与卡片化信息架构
- 布局采用 `Header + Sidebar + Content`
- 仅PC端优化，最低宽度 1280px

## 4. 联通、接口契约与错误处理

### 4.1 联通策略

- 前端统一请求 `admin-backend` 的 `/api/v1/*`
- 后端使用 Supabase SDK 访问数据库
- 认证采用 Supabase Auth（邮箱密码）
- 前端统一注入 `Authorization: Bearer <token>`

### 4.2 接口分组

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET/POST /api/v1/users`
- `PUT /api/v1/users/:id/roles`
- `GET /api/v1/roles`
- `GET /api/v1/permissions`
- `GET /api/v1/modules/:moduleKey/records`
- `POST /api/v1/projects/:id/review`
- `GET /api/v1/analytics/overview`
- `GET /api/v1/analytics/trends`
- `GET /api/v1/analytics/funnel`
- `GET /api/v1/audits`

### 4.3 错误与审计

- 响应结构：`{ code, message, data, requestId }`
- 状态码语义：`401/403/404/409/422/500`
- 前端全局错误处理（边界、提示、重试）
- 审计记录关键操作（登录、授权变更、数据变更）

### 4.4 性能基线

- 列表分页（page+size）
- 常用统计优先读取 `daily_metrics`
- 后端参数校验与只读接口缓存

## 5. 测试、验收与文档

### 5.1 测试策略

- 后端：`vitest` + `supertest`
- 前端：组件/页面测试（权限可见性、关键交互、错误态）
- E2E：登录 -> 用户管理 -> 业务审核 -> 统计看板
- 数据层：迁移可重复执行，seed 幂等

### 5.2 验收标准

- 新代码完全隔离在新目录
- 前后端联通本地 Supabase
- 全业务模块可管理
- 权限控制与单位隔离有效
- 统计分析与审计功能可用
- 构建、测试、类型检查通过
- 独立部署文档完整

### 5.3 运维文档产物

- `admin-system/README.md`
- `admin-system/docs/DEPLOYMENT.md`
- `admin-system/docs/OPERATIONS.md`

