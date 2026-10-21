$ErrorActionPreference = 'Stop'
$workspaceRoot = (Resolve-Path (Join-Path $PSScriptRoot '../../..')).Path
$leanExecutable = Join-Path $workspaceRoot 'work/lean-toolchain/lean-4.19.0-windows/bin/lean.exe'
if (-not (Test-Path -LiteralPath $leanExecutable)) {
    $leanCommand = Get-Command lean -ErrorAction SilentlyContinue
    if (-not $leanCommand) { throw 'Lean 4.19.0 is required; see lean-toolchain.' }
    $leanExecutable = $leanCommand.Source
}
& $leanExecutable --version
if ($LASTEXITCODE -ne 0) { throw 'Lean version check failed.' }
& $leanExecutable (Join-Path $PSScriptRoot 'Localization.lean')
if ($LASTEXITCODE -ne 0) { throw 'Lean proof check failed.' }
