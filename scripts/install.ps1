$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$Repo = "Teddir/casyuk"

Write-Host "🔋 Installing CasYuk..." -ForegroundColor Cyan

Write-Host "🔍 Finding latest release for Windows..."
$ReleaseUrl = "https://api.github.com/repos/$Repo/releases/latest"
$Release = Invoke-RestMethod -Uri $ReleaseUrl
$Asset = $Release.assets | Where-Object { $_.name -like "*.msi" -or $_.name -like "*setup*.exe" } | Select-Object -First 1

if (-not $Asset) {
    Write-Host "❌ Could not find a suitable release for Windows." -ForegroundColor Red
    exit 1
}

$DownloadUrl = $Asset.browser_download_url
$DownloadPath = Join-Path $env:TEMP $Asset.name

Write-Host "⬇️ Downloading CasYuk from $DownloadUrl..."
Invoke-WebRequest -Uri $DownloadUrl -OutFile $DownloadPath

Write-Host "📦 Installing..."
if ($DownloadPath -match "\.msi$") {
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$DownloadPath`" /quiet /norestart" -Wait -NoNewWindow
} else {
    Start-Process -FilePath $DownloadPath -ArgumentList "/S" -Wait -NoNewWindow
}

Remove-Item $DownloadPath -Force
Write-Host "✅ CasYuk installed successfully!" -ForegroundColor Green
Write-Host "🚀 You can now launch CasYuk from your Start Menu!" -ForegroundColor Cyan
