# TaraLets - Lightweight Windows Local Server
# Runs directly in PowerShell using standard .NET HttpListener

param(
    [int]$Port = 8088
)

$prefix = "http://127.0.0.1:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Error "Failed to bind to $prefix. Error: $_"
    exit 1
}

$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  TaraLets Commute Server is running!" -ForegroundColor Cyan
Write-Host "  URL: $prefix" -ForegroundColor Yellow
Write-Host "  Directory: $root" -ForegroundColor Gray
Write-Host "  Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host "==========================================================" -ForegroundColor Green

# Open browser
Start-Process $prefix

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }

        $localPath = Join-Path $root ($urlPath.TrimStart('/').Replace('/', '\'))

        if (Test-Path $localPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $contentType
            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
