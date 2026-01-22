<div align="center">

<pre>
                _               _
   ___ ___     | |__  _   _  __| |
  / __/ __|____| '_ \| | | |/ _` |
 | (_| (__|____| | | | |_| | (_| |
  \___\___|    |_| |_|\__,_|\__,_|

</pre>

# cc-hud

**🎨 A customizable status line with activity tracking for Claude Code CLI**
*Display model info, git branch, token usage, tools, agents, todos, and more*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/sirmalloc/cc-hud/blob/main/LICENSE)
[![Node.js Version](https://img.shields.io/node/v/cc-hud.svg)](https://nodejs.org)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/sirmalloc/cc-hud/graphs/commit-activity)

> **Note:** This is a merge of [ccstatusline](https://github.com/sirmalloc/ccstatusline) and [claude-hud](https://github.com/anthropics/claude-hud), combining the best of both: ccstatusline's powerful rendering engine with claude-hud's activity tracking features.

![Demo](https://raw.githubusercontent.com/sirmalloc/cc-hud/main/screenshots/demo.gif)

</div>

## 📚 Table of Contents

- [Recent Updates](#-recent-updates)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Windows Support](#-windows-support)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Development](#️-development)
- [Contributing](#-contributing)
- [License](#-license)
- [Related Projects](#-related-projects)

---

## 🆕 Recent Updates

### v3.0.0 - Activity Tracking (claude-hud merge)

This major release merges the activity tracking features from claude-hud into ccstatusline's powerful rendering engine.

**New Activity Tracking Widgets:**
- **🔧 Tools Activity** - Shows currently running and recently used tools
  - Multiple display modes: running only, recent only, or both
  - Real-time tracking of tool invocations from transcript
- **🤖 Agents Activity** - Shows active subagents and tasks
  - Count mode, detailed mode, or minimal mode
  - Tracks Task tool invocations and their completion status
- **📋 Todos Progress** - Shows todo list progress
  - Progress percentage, count, or visual progress bar
  - Tracks TodoWrite tool updates in real-time
- **📊 Usage Limits** - Shows API tier and usage information
  - Detects tier from model ID (Free/Pro/Max/Team)
  - Multiple display modes for tier and usage info

**Technical Changes:**
- New `ActivityMetrics` type for tracking tools, agents, todos, and usage
- New transcript parser that includes sidechain messages (tool invocations)
- Extended `RenderContext` with activity metrics
- 4 new widgets registered in the widget system

### v2.0.16 - Add fish style path abbreviation toggle to Current Working Directory widget

### v2.0.15 - Block Timer calculation fixes

- Fix miscalculation in the block timer

### v2.0.14 - Add remaining mode toggle to Context Percentage widgets

- **Remaining Mode** - You can now toggle the Context Percentage widgets between usage percentage and remaining percentage when configuring them in the TUI by pressing the 'l' key.

### v2.0.12 - Custom Text widget now supports emojis

- **👾 Emoji Support** - You can now paste emoji into the custom text widget. You can also turn on the merge option to get emoji labels for your widgets like this:
  
![Emoji Support](https://raw.githubusercontent.com/sirmalloc/cc-hud/main/screenshots/emojiSupport.png)

### v2.0.11 - Unlimited Status Lines

- **🚀 No Line Limit** - Configure as many status lines as you need - the 3-line limitation has been removed

### v2.0.10 - Git Updates

- **🌳 Git Worktree widget** - Shows the active worktree name when working with git worktrees
- **👻 Hide 'no git' message toggle** - Git widgets now support hiding the 'no git' message when not in a repository (toggle with 'h' key while editing the widget)

### v2.0.8 - Powerline Auto-Alignment

![Powerline Auto-Alignment](https://raw.githubusercontent.com/sirmalloc/cc-hud/main/screenshots/autoAlign.png)

- **🎯 Widget Alignment** - Auto-align widgets across multiple status lines in Powerline mode for a clean, columnar layout (toggle with 'a' in Powerline Setup)

### v2.0.7 - Current Working Directory & Session Cost

![Current Working Directory and Session Cost](https://raw.githubusercontent.com/sirmalloc/cc-hud/main/screenshots/cwdAndSessionCost.png)

- **📁 Current Working Directory** - Display the current working directory with configurable segment display
  - Set the number of path segments to show (e.g., show only last 2 segments: `.../Personal/cc-hud`)
  - Supports raw value mode for compact display
  - Automatically truncates long paths with ellipsis
- **💰 Session Cost Widget** - Track your Claude Code session costs (requires Claude Code 1.0.85+)
  - Displays total session cost in USD
  - Supports raw value mode (shows just `$X.YZ` vs `Cost: $X.YZ`)
  - Real-time cost tracking from Claude Code session data
  - Note: Cost may not update properly when using `/resume` (Claude Code limitation)
- **🐛 Bug Fixes**
  - Fixed Block Timer calculations for accurate time tracking across block boundaries
  - Improved widget editor stability with proper Ctrl+S handling
  - Enhanced cursor display in numeric input fields

### v2.0.2 - Block Timer Widget

![Block Timer](https://raw.githubusercontent.com/sirmalloc/cc-hud/main/screenshots/blockTimerSmall.png)

- **⏱️ Block Timer** - Track your progress through 5-hour Claude Code blocks
  - Displays time elapsed in current block as hours/minutes (e.g., "3hr 45m")
  - Progress bar mode shows visual completion percentage
  - Two progress bar styles: full width (32 chars) or compact (16 chars)
  - Automatically detects block boundaries from transcript timestamps

### v2.0.0 - Powerline Support & Enhanced Themes
- **⚡ Powerline Mode** - Beautiful Powerline-style status lines with arrow separators and customizable caps
- **🎨 Built-in Themes** - Multiple pre-configured themes that you can copy and customize
- **🌈 Advanced Color Support** - Basic (16), 256-color (with custom ANSI codes), and truecolor (with hex codes) modes
- **🔗 Widget Merging** - Merge multiple widgets together with or without padding for seamless designs
- **📦 Easy Installation** - Install directly with `npx` or `bunx` - no global package needed
- **🔤 Custom Separators** - Add multiple Powerline separators with custom hex codes for font support
- **🚀 Auto Font Install** - Automatic Powerline font installation with user consent

---

## ✨ Features

- **📊 Real-time Metrics** - Display model name, git branch, token usage, session duration, block timer, and more
- **🔧 Activity Tracking** - Monitor running tools, active agents, todo progress, and API usage limits
- **🎨 Fully Customizable** - Choose what to display and customize colors for each element
- **⚡ Powerline Support** - Beautiful Powerline-style rendering with arrow separators, caps, and custom fonts
- **📐 Multi-line Support** - Configure multiple independent status lines
- **🖥️ Interactive TUI** - Built-in configuration interface using React/Ink
- **⚙️ Global Options** - Apply consistent formatting across all widgets (padding, separators, bold, background)
- **🚀 Cross-platform** - Works seamlessly with both Bun and Node.js
- **🔧 Flexible Configuration** - Supports custom Claude Code config directory via `CLAUDE_CONFIG_DIR` environment variable
- **📏 Smart Width Detection** - Automatically adapts to terminal width with flex separators
- **⚡ Zero Config** - Sensible defaults that work out of the box

---

## 🚀 Quick Start

### No installation needed! Use directly with npx or bunx:

```bash
# Run the configuration TUI with npm
npx cc-hud@latest

# Or with Bun (faster)
bunx cc-hud@latest
```

### Configure cc-hud

The interactive configuration tool provides a terminal UI where you can:
- Configure multiple separate status lines
- Add/remove/reorder status line widgets
- Customize colors for each widget
- Configure flex separator behavior
- Edit custom text widgets
- Install/uninstall to Claude Code settings
- Preview your status line in real-time

> 💡 **Tip:** Your settings are automatically saved to `~/.config/cc-hud/settings.json`

> 🔧 **Custom Claude Config:** If your Claude Code configuration is in a non-standard location, set the `CLAUDE_CONFIG_DIR` environment variable:
> ```bash
> # Linux/macOS
> export CLAUDE_CONFIG_DIR=/custom/path/to/.claude
> 
> # Windows PowerShell
> $env:CLAUDE_CONFIG_DIR="C:\custom\path\.claude"
> ```

---

## 🪟 Windows Support

cc-hud works seamlessly on Windows with full feature compatibility across PowerShell (5.1+ and 7+), Command Prompt, and Windows Subsystem for Linux (WSL).

### Installation on Windows

#### Option 1: Using Bun (Recommended)
```powershell
# Install Bun for Windows
irm bun.sh/install.ps1 | iex

# Run cc-hud
bunx cc-hud@latest
```

#### Option 2: Using Node.js
```powershell
# Using npm
npx cc-hud@latest

# Or with Yarn
yarn dlx cc-hud@latest

# Or with pnpm
pnpm dlx cc-hud@latest
```

### Windows-Specific Features

#### Powerline Font Support
For optimal Powerline rendering on Windows:

**Windows Terminal** (Recommended):
- Supports Powerline fonts natively
- Download from [Microsoft Store](https://aka.ms/terminal)
- Auto-detects compatible fonts

**PowerShell/Command Prompt**:
```powershell
# Install JetBrains Mono Nerd Font via winget
winget install DEVCOM.JetBrainsMonoNerdFont

# Alternative: Install base JetBrains Mono font
winget install "JetBrains.JetBrainsMono"

# Or download manually from: https://www.nerdfonts.com/font-downloads
```

#### Path Handling
cc-hud automatically handles Windows-specific paths:
- Git repositories work with both `/` and `\` path separators
- Current Working Directory widget displays Windows-style paths correctly
- Full support for mapped network drives and UNC paths
- Handles Windows drive letters (C:, D:, etc.)

### Windows Troubleshooting

#### Common Issues & Solutions

**Issue**: Powerline symbols showing as question marks or boxes
```powershell
# Solution: Install a compatible Nerd Font
winget install JetBrainsMono.NerdFont
# Then set the font in your terminal settings
```

**Issue**: Git commands not recognized
```powershell
# Check if Git is installed and in PATH
git --version

# If not found, install Git:
winget install Git.Git
# Or download from: https://git-scm.com/download/win
```

**Issue**: Permission errors during installation
```powershell
# Use non-global installation (recommended)
npx cc-hud@latest

# Or run PowerShell as Administrator for global install
```

**Issue**: "Execution Policy" errors in PowerShell
```powershell
# Temporarily allow script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Issue**: Windows Defender blocking execution
```powershell
# If Windows Defender flags the binary:
# 1. Open Windows Security
# 2. Go to "Virus & threat protection"
# 3. Add exclusion for the cc-hud binary location
# Or use temporary bypass (not recommended for production):
Add-MpPreference -ExclusionPath "$env:USERPROFILE\.bun\bin"
```

#### Windows Subsystem for Linux (WSL)
cc-hud works perfectly in WSL environments:

```bash
# Install in WSL Ubuntu/Debian
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
bunx cc-hud@latest
```

**WSL Benefits**:
- Native Unix-style path handling
- Better font rendering in WSL terminals
- Seamless integration with Linux development workflows

### Windows Terminal Configuration

For the best experience, configure Windows Terminal with these recommended settings:

#### Terminal Settings (settings.json)
```json
{
  "profiles": {
    "defaults": {
      "font": {
        "face": "JetBrainsMono Nerd Font",
        "size": 12
      },
      "colorScheme": "One Half Dark"
    }
  }
}
```

#### Claude Code Integration
Configure cc-hud in your Claude Code settings:

**Settings Location:**
- Default: `~/.claude/settings.json` (Windows: `%USERPROFILE%\.claude\settings.json`)
- Custom: Set `CLAUDE_CONFIG_DIR` environment variable to use a different directory

**For Bun users**:
```json
{
  "statusLine": "bunx cc-hud@latest"
}
```

**For npm users**:
```json
{
  "statusLine": "npx cc-hud@latest"
}
```

> 💡 **Custom Config Directory:** If you use a non-standard Claude Code configuration directory, set the `CLAUDE_CONFIG_DIR` environment variable before running cc-hud. The tool will automatically detect and use your custom location.

### Performance on Windows

cc-hud is optimized for Windows performance:
- **Bun runtime**: Significantly faster startup times on Windows
- **Caching**: Intelligent caching of git status and file operations
- **Async operations**: Non-blocking command execution
- **Memory efficient**: Minimal resource usage

### Windows-Specific Widget Behavior

Some widgets have Windows-specific optimizations:

- **Current Working Directory**: Displays Windows drive letters and UNC paths
- **Git Widgets**: Handle Windows line endings (CRLF) automatically  
- **Custom Commands**: Support both PowerShell and cmd.exe commands
- **Block Timer**: Accounts for Windows timezone handling

---

## 📖 Usage

Once configured, cc-hud automatically formats your Claude Code status line. The status line appears at the bottom of your terminal during Claude Code sessions.

### 📊 Available Widgets

- **Model Name** - Shows the current Claude model (e.g., "Claude 3.5 Sonnet")
- **Git Branch** - Displays current git branch name
- **Git Changes** - Shows uncommitted insertions/deletions (e.g., "+42,-10")
- **Git Worktree** - Shows the name of the current git worktree
- **Session Clock** - Shows elapsed time since session start (e.g., "2hr 15m")
- **Session Cost** - Shows total session cost in USD (e.g., "$1.23")
- **Block Timer** - Shows time elapsed in current 5-hour block or progress bar
- **Current Working Directory** - Shows current working directory with configurable path segments
- **Version** - Shows Claude Code version
- **Output Style** - Shows the currently set output style in Claude Code
- **Tokens Input** - Shows input tokens used
- **Tokens Output** - Shows output tokens used
- **Tokens Cached** - Shows cached tokens used
- **Tokens Total** - Shows total tokens used
- **Context Length** - Shows current context length in tokens
- **Context Percentage** - Shows percentage of context limit used (dynamic: 1M for Sonnet 4.5 with `[1m]` suffix, 200k otherwise)
- **Context Percentage (usable)** - Shows percentage of usable context (dynamic: 800k for Sonnet 4.5 with `[1m]` suffix, 160k otherwise, accounting for auto-compact at 80%)
- **Terminal Width** - Shows detected terminal width (for debugging)
- **Custom Text** - Add your own custom text to the status line
- **Custom Command** - Execute shell commands and display their output (refreshes whenever the statusline is updated by Claude Code)
- **Separator** - Visual divider between widgets (customizable: |, -, comma, space)
- **Flex Separator** - Expands to fill available space

#### Activity Tracking Widgets (v3.0+)
- **Tools Activity** - Shows running and recently used tools (e.g., "▶ Read, Edit" or "✓ Bash, Grep")
- **Agents Activity** - Shows active subagents/tasks (e.g., "2 active" or "▶ Explore, Build")
- **Todos Progress** - Shows todo list completion (e.g., "3/5 (60%)" or progress bar)
- **Usage Limits** - Shows API tier and usage (e.g., "Pro" or "45/50 msgs")

---

### Terminal Width Options
These settings affect where long lines are truncated, and where right-alignment occurs when using flex separators:
- **Full width always** - Uses full terminal width (may wrap if auto-compact message appears or IDE integration adds text)
- **Full width minus 40** - Reserves 40 characters for auto-compact message to prevent wrapping (default)
- **Full width until compact** - Dynamically switches between full width and minus 40 based on context percentage threshold (configurable, default 60%)

---

### ⚙️ Global Options

Configure global formatting preferences that apply to all widgets:

![Global Options](https://raw.githubusercontent.com/sirmalloc/cc-hud/main/screenshots/global.png)

#### Default Padding & Separators
- **Default Padding** - Add consistent padding to the left and right of each widget
- **Default Separator** - Automatically insert a separator between all widgets
  - Press **(p)** to edit padding
  - Press **(s)** to edit separator

<details>
<summary><b>Global Formatting Options</b></summary>

- **Inherit Colors** - Default separators inherit foreground and background colors from the preceding widget
  - Press **(i)** to toggle
- **Global Bold** - Apply bold formatting to all text regardless of individual widget settings
  - Press **(o)** to toggle
- **Override Foreground Color** - Force all widgets to use the same text color
  - Press **(f)** to cycle through colors
  - Press **(g)** to clear override
- **Override Background Color** - Force all widgets to use the same background color
  - Press **(b)** to cycle through colors
  - Press **(c)** to clear override

</details>

> 💡 **Note:** These settings are applied during rendering and don't add widgets to your widget list. They provide a consistent look across your entire status line without modifying individual widget configurations.

> ⚠️ **VSCode Users:** If colors appear incorrect in the VSCode integrated terminal, the "Terminal › Integrated: Minimum Contrast Ratio" (`terminal.integrated.minimumContrastRatio`) setting is forcing a minimum contrast between foreground and background colors. You can adjust this setting to 1 to disable the contrast enforcement, or use a standalone terminal for accurate colors.

### 🔧 Activity Tracking Widgets

The activity tracking widgets provide real-time visibility into Claude Code's operations by parsing the transcript JSONL file.

#### Tools Activity Widget
Shows which tools are currently running and recently completed:
- **Running Mode** - Shows tools currently being executed (e.g., "▶ Read, Edit")
- **Recent Mode** - Shows recently completed tools (e.g., "✓ Bash, Grep")
- **Both Mode** - Shows both running and recent tools
- Toggle between modes with the **(m)** key in the widgets editor

#### Agents Activity Widget
Tracks subagents spawned via the Task tool:
- **Count Mode** - Shows count of active agents (e.g., "2 active")
- **Detail Mode** - Shows agent descriptions (e.g., "▶ Explore, Build")
- **Minimal Mode** - Shows just the count with emoji (e.g., "🤖 2")
- Toggle between modes with the **(m)** key

#### Todos Progress Widget
Displays progress on the current todo list:
- **Progress Mode** - Shows completion with percentage (e.g., "3/5 (60%)")
- **Count Mode** - Shows just the count (e.g., "3/5")
- **Bar Mode** - Visual progress bar with in-progress indicator (e.g., "[████████▓░░░] 60%")
- Toggle between modes with the **(m)** key

#### Usage Limits Widget
Shows API tier information based on the model being used:
- **Tier Mode** - Shows detected tier (Free/Pro/Max/Team)
- **Usage Mode** - Shows message usage if available
- **Both Mode** - Combined tier and usage display
- Tier is detected from model ID (opus → Max, sonnet → Pro, haiku → Free)

### ⏱️ Block Timer Widget

The Block Timer widget helps you track your progress through Claude Code's 5-hour conversation blocks:

![Block Timer](https://raw.githubusercontent.com/sirmalloc/cc-hud/main/screenshots/blockTimer.png)

**Display Modes:**
- **Time Display** - Shows elapsed time as "3hr 45m" (default)
- **Progress Bar** - Full width 32-character progress bar with percentage
- **Progress Bar (Short)** - Compact 16-character progress bar with percentage

**Features:**
- Automatically detects block boundaries from transcript timestamps
- Floors block start time to the hour for consistent tracking
- Shows "Block: 3hr 45m" in normal mode or just "3hr 45m" in raw value mode
- Progress bars show completion percentage (e.g., "[████████████████████████░░░░░░░░] 73.9%")
- Toggle between modes with the **(p)** key in the widgets editor

### 🔤 Raw Value Mode

Some widgets support "raw value" mode which displays just the value without a label:
- Normal: `Model: Claude 3.5 Sonnet` → Raw: `Claude 3.5 Sonnet`
- Normal: `Session: 2hr 15m` → Raw: `2hr 15m`
- Normal: `Block: 3hr 45m` → Raw: `3hr 45m`
- Normal: `Ctx: 18.6k` → Raw: `18.6k`

---

### 🔧 Custom Widgets

#### Custom Text Widget
Add static text to your status line. Perfect for:
- Project identifiers
- Environment indicators (dev/prod)
- Personal labels or reminders

#### Custom Command Widget
Execute shell commands and display their output dynamically:
- Refreshes whenever the statusline is updated by Claude Code
- Receives the full Claude Code JSON data via stdin (model info, session ID, transcript path, etc.)
- Displays command output inline in your status line
- Configurable timeout (default: 1000ms)
- Examples:
  - `pwd | xargs basename` - Show current directory name
  - `node -v` - Display Node.js version
  - `git rev-parse --short HEAD` - Show current commit hash
  - `date +%H:%M` - Display current time
  - `curl -s wttr.in?format="%t"` - Show current temperature
  - `npx -y ccusage@latest statusline` - Display Claude usage metrics (set timeout: 5000ms)

> ⚠️ **Important:** Commands should complete quickly to avoid delays. Long-running commands will be killed after the configured timeout. If you're not seeing output from your custom command, try increasing the timeout value (press 't' in the editor).

> 💡 **Tip:** Custom commands can be other Claude Code compatible status line formatters! They receive the same JSON via stdin that cc-hud receives from Claude Code, allowing you to chain or combine multiple status line tools.

---

### 🔗 Integration Example: ccusage

[ccusage](https://github.com/ryoppippi/ccusage) is a tool that tracks and displays Claude Code usage metrics. You can integrate it directly into your status line:

1. Add a Custom Command widget
2. Set command: `npx -y ccusage@latest statusline`
3. Set timeout: `5000` (5 seconds for initial download)
4. Enable "preserve colors" to keep ccusage's color formatting

![ccusage integration](https://raw.githubusercontent.com/sirmalloc/cc-hud/main/screenshots/ccusage.png)

> 📄 **How it works:** The command receives Claude Code's JSON data via stdin, allowing ccusage to access session information, model details, and transcript data for accurate usage tracking.

### ✂️ Smart Truncation

When terminal width is detected, status lines automatically truncate with ellipsis (...) if they exceed the available width, preventing line wrapping.

---

## 📖 API Documentation

Complete API documentation is generated using TypeDoc and includes detailed information about:

- **Core Types**: Configuration interfaces, widget definitions, and render contexts
- **Widget System**: All available widgets and their customization options  
- **Utility Functions**: Helper functions for rendering, configuration, and terminal handling
- **Status Line Rendering**: Core rendering engine and formatting options

### Generating Documentation

To generate the API documentation locally:

```bash
# Generate documentation
bun run docs

# Clean generated documentation
bun run docs:clean
```

The documentation will be generated in the `docs/` directory and can be viewed by opening `docs/index.html` in your web browser.

### Documentation Structure

- **Types**: Core TypeScript interfaces and type definitions
- **Widgets**: Individual widget implementations and their APIs
- **Utils**: Utility functions for configuration, rendering, and terminal operations
- **Main Module**: Primary entry point and orchestration functions

---

## 🛠️ Development

### Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- Git
- Node.js 18+ (optional, for npm publishing)

### Setup

```bash
# Clone the repository
git clone https://github.com/sirmalloc/cc-hud.git
cd cc-hud

# Install dependencies
bun install
```

### Development Commands

```bash
# Run in TUI mode (configuration)
bun run src/cc-hud.ts

# Build for distribution
bun run build
```

### 📁 Project Structure

```
cc-hud/
├── src/
│   ├── cc-hud.ts         # Main entry point
│   ├── tui/                    # React/Ink configuration UI
│   │   ├── App.tsx             # Root TUI component
│   │   ├── index.tsx           # TUI entry point
│   │   └── components/         # UI components
│   │       ├── MainMenu.tsx
│   │       ├── LineSelector.tsx
│   │       ├── ItemsEditor.tsx
│   │       ├── ColorMenu.tsx
│   │       ├── PowerlineSetup.tsx
│   │       └── ...
│   ├── widgets/                # Status line widget implementations
│   │   ├── Model.ts
│   │   ├── GitBranch.ts
│   │   ├── TokensTotal.ts
│   │   ├── OutputStyle.ts
│   │   ├── ToolsActivity.ts    # Activity tracking (v3.0+)
│   │   ├── AgentsActivity.ts   # Activity tracking (v3.0+)
│   │   ├── TodosProgress.ts    # Activity tracking (v3.0+)
│   │   ├── UsageLimits.ts      # Activity tracking (v3.0+)
│   │   └── ...
│   ├── utils/                  # Utility functions
│   │   ├── config.ts           # Settings management
│   │   ├── renderer.ts         # Core rendering logic
│   │   ├── powerline.ts        # Powerline font utilities
│   │   ├── colors.ts           # Color definitions
│   │   ├── claude-settings.ts  # Claude Code integration (supports CLAUDE_CONFIG_DIR)
│   │   ├── activity-parser.ts  # Transcript parsing for activity tracking (v3.0+)
│   │   └── jsonl.ts            # JSONL transcript parsing
│   └── types/                  # TypeScript type definitions
│       ├── Settings.ts
│       ├── Widget.ts
│       ├── PowerlineConfig.ts
│       ├── ActivityMetrics.ts  # Activity tracking types (v3.0+)
│       └── ...
├── dist/                       # Built files (generated)
├── package.json
├── tsconfig.json
└── README.md
```
## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

[MIT](LICENSE) © Matthew Breedlove

---

## 👤 Author

**Matthew Breedlove**

- GitHub: [@sirmalloc](https://github.com/sirmalloc)

---

## 🔗 Related Projects

- [ccstatusline](https://github.com/sirmalloc/ccstatusline) - The original status line formatter (now merged into cc-hud)
- [tweakcc](https://github.com/Piebald-AI/tweakcc) - Customize Claude Code themes, thinking verbs, and more.
- [ccusage](https://github.com/ryoppippi/ccusage) - Track and display Claude Code usage metrics.

---

## 🙏 Acknowledgments

- Built for use with [Claude Code CLI](https://claude.ai/code) by Anthropic
- Based on [cc-hud](https://github.com/sirmalloc/cc-hud) by Matthew Breedlove
- Activity tracking features inspired by claude-hud
- Powered by [Ink](https://github.com/vadimdemedes/ink) for the terminal UI
- Made with ❤️ for the Claude Code community

---

## Star History

<a href="https://www.star-history.com/#sirmalloc/cc-hud&Timeline">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=sirmalloc/cc-hud&type=Timeline&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=sirmalloc/cc-hud&type=Timeline" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=sirmalloc/cc-hud&type=Timeline" />
 </picture>
</a>

<div align="center">

### 🌟 Show Your Support

Give a ⭐ if this project helped you!

[![GitHub stars](https://img.shields.io/github/stars/sirmalloc/cc-hud?style=social)](https://github.com/sirmalloc/cc-hud/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/sirmalloc/cc-hud?style=social)](https://github.com/sirmalloc/cc-hud/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/sirmalloc/cc-hud?style=social)](https://github.com/sirmalloc/cc-hud/watchers)

[![npm version](https://img.shields.io/npm/v/cc-hud.svg)](https://www.npmjs.com/package/cc-hud)
[![npm downloads](https://img.shields.io/npm/dm/cc-hud.svg)](https://www.npmjs.com/package/cc-hud)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/sirmalloc/cc-hud/blob/main/LICENSE)
[![Made with Bun](https://img.shields.io/badge/Made%20with-Bun-000000.svg?logo=bun)](https://bun.sh)

[![Issues](https://img.shields.io/github/issues/sirmalloc/cc-hud)](https://github.com/sirmalloc/cc-hud/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/sirmalloc/cc-hud)](https://github.com/sirmalloc/cc-hud/pulls)
[![Contributors](https://img.shields.io/github/contributors/sirmalloc/cc-hud)](https://github.com/sirmalloc/cc-hud/graphs/contributors)

### 💬 Connect

[Report Bug](https://github.com/sirmalloc/cc-hud/issues) · [Request Feature](https://github.com/sirmalloc/cc-hud/issues) · [Discussions](https://github.com/sirmalloc/cc-hud/discussions)

</div>
