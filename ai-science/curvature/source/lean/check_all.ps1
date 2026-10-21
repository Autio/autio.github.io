param([string]$MathlibPath)
$ErrorActionPreference = 'Stop'
$workspaceRoot = (Resolve-Path (Join-Path $PSScriptRoot '../../..')).Path
$leanBin = Join-Path $workspaceRoot 'work/lean-toolchain/lean-4.19.0-windows/bin'
if (-not $MathlibPath) { $MathlibPath = Join-Path $workspaceRoot 'work/mathlib4' }
if (-not (Test-Path -LiteralPath (Join-Path $MathlibPath 'lakefile.lean'))) {
    throw 'Provide -MathlibPath pointing to a Mathlib v4.19.0 checkout with its cached dependencies.'
}
$previousPath = $env:PATH
try {
    if (Test-Path -LiteralPath $leanBin) { $env:PATH = "$leanBin;$env:PATH" }
    Push-Location -LiteralPath $MathlibPath
    try {
        $files = @('Localization','SharpLocalization','GraphHall','CutLabels','DeletionStability','GraphDeletion','NegativeThreshold')
        foreach ($name in $files) {
            $source = Join-Path $PSScriptRoot "$name.lean"
            $log = Join-Path $PSScriptRoot "$name.verification.log"
            $result = & lake env lean $source 2>&1
            $code = $LASTEXITCODE
            $result | Set-Content -LiteralPath $log -Encoding utf8
            $result
            if ($code -ne 0) { throw "Lean check failed: $name" }
        }
        $manifest = [ordered]@{
            checked_utc = (Get-Date).ToUniversalTime().ToString('o')
            compiler = (& lean --version | Out-String).Trim()
            mathlib_commit = (& git rev-parse HEAD | Out-String).Trim()
            source_sha256 = [ordered]@{}
            scope = 'Partial formalization: actual finite-graph lemmas and conditional numerical arguments; no complete optimal-transport curvature formalization.'
        }
        foreach ($name in $files) {
            $manifest.source_sha256["$name.lean"] = (Get-FileHash -LiteralPath (Join-Path $PSScriptRoot "$name.lean") -Algorithm SHA256).Hash
        }
        $manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'verification-manifest.json') -Encoding utf8
    } finally { Pop-Location }
} finally { $env:PATH = $previousPath }
