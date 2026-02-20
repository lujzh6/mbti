# Claude Code 安装说明

## 一、Claude Code CLI（已完成）

已通过 **WinGet** 安装 Claude Code 2.1.49。

- **安装路径**：`C:\Users\lxluj\AppData\Local\Microsoft\WinGet\Packages\Anthropic.ClaudeCode_Microsoft.Winget.Source_8wekyb3d8bbwe\claude.exe`
- 若在终端输入 `claude` 提示找不到命令，请：
  1. **关闭并重新打开 Cursor**（或新开一个终端），让 WinGet 写入的 PATH 生效；
  2. 或在 PowerShell 中临时加入 PATH 再运行：
     ```powershell
     $env:Path += ";C:\Users\lxluj\AppData\Local\Microsoft\WinGet\Packages\Anthropic.ClaudeCode_Microsoft.Winget.Source_8wekyb3d8bbwe"
     claude --version
     ```
- **首次使用**：在项目目录下执行 `claude`，会提示在浏览器中登录 Anthropic 账号完成授权。

---

## 二、在 Cursor 中安装 Claude Code 扩展

Claude Code 扩展让 Cursor 与 Claude 命令行联动（例如在终端运行 `claude` 时可与编辑器配合）。可按下面两种方式之一安装。

### 方式 A：从扩展市场安装（推荐先试）

1. 在 Cursor 中按 **`Ctrl+Shift+X`** 打开扩展面板；
2. 搜索 **「Claude Code」**；
3. 若出现由 **Anthropic** 发布的 **Claude Code**，点击 **安装**；
4. 安装后**完全退出并重新打开 Cursor**。

若 Cursor 扩展市场里没有该扩展，再用方式 B。

### 方式 B：通过 VSIX 手动安装

1. **获取 VSIX 文件**  
   - 打开：https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code  
   - 点击右侧 **「Download Extension」** 下载 `.vsix` 文件；  
   或已安装 Node 时，在命令行执行一次：
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```
   然后在：
   `%USERPROFILE%\.claude\local\node_modules\@anthropic-ai\claude-code\vendor\claude-code.vsix`
   找到 `claude-code.vsix`。

2. **在 Cursor 中安装 VSIX**  
   - 按 **`Ctrl+Shift+P`** 打开命令面板；  
   - 输入并选择 **「Extensions: Install from VSIX...」**；  
   - 选择刚下载或找到的 `claude-code.vsix` 文件；  
   - 安装完成后**完全重启 Cursor**。

3. **使用方式**  
   - 在 Cursor 的**集成终端**里进入项目目录，输入 **`claude`**；  
   - Claude Code 会检测到 Cursor 并与之配合使用。

---

## 三、验证

- **CLI**：新开终端，执行 `claude --version`，应能看到版本号。  
- **扩展**：重启 Cursor 后，在扩展列表中能看到「Claude Code」；在项目目录终端运行 `claude` 可开始对话并与编辑器联动。

---

*说明：Claude Code 通常需要 Anthropic 账号及 Claude Pro/Max 等订阅；具体以官方文档为准。*
