param(
  [Parameter(Mandatory = $true)]
  [string] $OutputDirectory
)

$ErrorActionPreference = 'Stop'
if (-not $env:DATABASE_URL) { throw '请先在当前进程设置 DATABASE_URL。' }
foreach ($name in @('pg_dump', 'pg_restore')) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "缺少 $name；请安装与数据库版本兼容的 PostgreSQL 客户端。"
  }
}

$uri = [Uri] $env:DATABASE_URL
if ($uri.Scheme -notin @('postgres', 'postgresql') -or -not $uri.Host) {
  throw 'DATABASE_URL 不是有效的 PostgreSQL 连接地址。'
}
$credentials = $uri.UserInfo.Split(':', 2)
if ($credentials.Count -ne 2) { throw 'DATABASE_URL 缺少数据库用户名或密码。' }

$names = @('PGHOST', 'PGPORT', 'PGUSER', 'PGPASSWORD', 'PGDATABASE', 'PGSSLMODE')
$previous = @{}
foreach ($name in $names) { $previous[$name] = [Environment]::GetEnvironmentVariable($name, 'Process') }
try {
  $env:PGHOST = $uri.Host
  $env:PGPORT = if ($uri.IsDefaultPort) { '5432' } else { [string] $uri.Port }
  $env:PGUSER = [Uri]::UnescapeDataString($credentials[0])
  $env:PGPASSWORD = [Uri]::UnescapeDataString($credentials[1])
  $env:PGDATABASE = [Uri]::UnescapeDataString($uri.AbsolutePath.TrimStart('/'))
  if ($uri.Query -match '(?:^\?|&)sslmode=([^&]+)') {
    $env:PGSSLMODE = [Uri]::UnescapeDataString($Matches[1])
  }

  $directory = [System.IO.Path]::GetFullPath($OutputDirectory)
  [System.IO.Directory]::CreateDirectory($directory) | Out-Null
  $backup = Join-Path $directory ('keben-{0}.dump' -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
  & pg_dump --format=custom --no-owner --no-privileges --file=$backup
  if ($LASTEXITCODE -ne 0) { throw 'pg_dump 失败；请检查数据库连接和输出路径。' }
  & pg_restore --list $backup | Out-Null
  if ($LASTEXITCODE -ne 0 -or (Get-Item -LiteralPath $backup).Length -eq 0) {
    throw '备份文件校验失败。'
  }
  Write-Output "备份已写入并通过归档目录校验：$backup"
} finally {
  foreach ($name in $names) { [Environment]::SetEnvironmentVariable($name, $previous[$name], 'Process') }
}

