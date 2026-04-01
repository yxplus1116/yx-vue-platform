# exam-center-platform

考试中心前端基础仓，包含两套前端项目：

- `web-admin`
  后台管理端
- `web-portal`
  门户前台

这两个项目默认面向同一套后端接口，适合作为后续同类项目的脚手架模板。

## 目录结构

```text
exam-center-platform/
├── web-admin/     # 后台管理端
├── web-portal/    # 门户前台
├── package.json   # 根目录脚本
└── pnpm-workspace.yaml
```

## 初始化

```bash
pnpm install
```

## 常用命令

启动后台管理端：

```bash
pnpm dev:admin
```

启动门户前台：

```bash
pnpm dev:portal
```

分别构建两个项目：

```bash
pnpm build:admin
pnpm build:portal
```

## 作为脚手架使用

推荐把当前目录单独作为一个 GitHub 仓库维护，后续新项目可以直接：

1. 克隆模板仓库
2. 修改项目名称、接口地址、品牌信息
3. 在此基础上继续开发

如果要作为真正的模板仓使用，建议后续再补充：

- 根目录 `LICENSE`
- GitHub Actions
- 提交规范和代码规范配置
- 环境变量示例文件
