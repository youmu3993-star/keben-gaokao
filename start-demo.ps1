Set-Location -LiteralPath $PSScriptRoot
$ErrorActionPreference = 'Stop'
$taskNode = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $taskNode) { throw '请安装 Node.js 22+，然后重新运行。' }
if (-not (Test-Path -LiteralPath 'node_modules/next')) { throw '请先运行 pnpm install 和 pnpm db:generate；详见 README.md。' }
$env:DEMO_MODE = 'true'
$env:APP_ORIGIN = 'http://127.0.0.1:3000'
& $taskNode scripts/preview.cjs

