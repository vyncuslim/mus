# 将 Vynalth Dictionary 部署到 Vercel

项目可以通过 Vercel 的 GitHub 集成构建。连接 GitHub、选择 Vercel 团队和确认发布，由账号所有者在 Vercel 页面操作；不要把任何密码、令牌或数据库连接串发送到聊天中。

## 1. 导入 GitHub 项目

1. 登录 Vercel，选择正确的个人账号或团队，点击 **Add New → Project**。
2. 连接 GitHub，并允许 Vercel 访问 `vyncuslim/mus`，然后导入此仓库。
3. **Root Directory** 选仓库根目录（`.`）；框架选择 **Next.js**。保留项目中的 `vercel.json` 配置：安装命令是 `npm ci`，构建命令是 `npm run vercel-build`。不要将输出目录改成 `out`，因为项目包含服务器端 API。
4. `package.json` 指定 Node.js 22.x。数据库和翻译服务的 API 密钥都不是首次部署的必需条件。

## 2. 选择包含代码的分支

本次部署适配在 `arena/a81de08c-mus` 分支的 [PR #1](https://github.com/vyncuslim/mus/pull/1) 中；在 PR 合并之前，默认 `main` 分支可能没有这份应用代码。

- 审核并合并 PR 后，可以按 Vercel 默认的 `main` 生产分支部署；或者在 Vercel 的 **Deployments → Create Deployment** 指定完整的 `arena/a81de08c-mus` 分支。
- 如确实希望该分支持续成为生产分支，可在 **Settings → Environments → Production → Branch Tracking** 中设置。不要把测试分支设置为生产分支，除非希望它更新正式网站。
- **新项目的第一次部署是生产部署**，即使来源不是生产分支；之后的非生产分支通常是预览部署。预览地址是否需要登录取决于 Vercel 的部署保护设置。

## 3. 环境变量

默认可以不填任何环境变量。Vercel 开启自动暴露系统变量时，网站会使用 `VERCEL_PROJECT_PRODUCTION_URL`，或退回 `VERCEL_URL`，生成规范链接和网站地图。

如果系统变量未暴露，或者想指定自己的正式域名，请在 Vercel 的 **Settings → Environment Variables** 设置：

- `NEXT_PUBLIC_SITE_URL`：真实域名的完整来源地址，例如 `https://你的域名`，不带路径、查询参数或末尾页面路径。按需要选择 Production 和 Preview，然后重新部署。它是公开值，不要在其中放秘密。
- `DATABASE_URL`：仅在需要外部 PostgreSQL 时设置，并作为私有变量保存；不设置时使用内置词典数据。现有数据库需要先备份，再按根目录 README 的说明执行 schema 和索引更新。

若没有设置公开域名，也没有可用的 Vercel 系统 URL，规范链接会退回本地开发地址 `http://localhost:3000`。上线后应检查并修正，而不是使用他人的域名。

## 4. 部署后检查

部署成功后，用自己的 Vercel 域名访问：

- `/`：首页能否加载。
- `/api/health`：应返回 JSON 和 `status: "ok"`；没有数据库时使用内置数据是正常的。
- `/api/definitions?q=mengikut`：检查本地词典释义索引。
- `/api/world?q=water`：检查多语言词汇对照索引。
- `/robots.txt` 和 `/sitemap.xml`：确认域名是自己的正式域名。

如果 API 返回 503，请查看 **Deployments → 对应部署 → Logs**，并确认 `data/` 文件没有被排除。定义快照约 88 MB（gzip）；`vercel-build` 会检查数据分片是否进入 Next.js 的函数追踪并预估大小，但实际函数包、冷启动、内存、流量和额度仍应在 Vercel 的 Resources / Usage 中核实。函数实例不共享内存中的请求限流计数，正式高流量场景需要共享限流方案。

词典的人工审核翻译目录当前为 0 条；可选的自动翻译依赖第三方网络和额度。缓存仅覆盖访问过的部分内容，不代表整部词典离线可用。
