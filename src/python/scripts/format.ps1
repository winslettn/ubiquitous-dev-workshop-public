$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "ensure-env.ps1")

$Ruff = Join-Path $ProjectRoot ".venv\Scripts\ruff.exe"

Push-Location $ProjectRoot
try {
    & $Ruff format .
}
finally {
    Pop-Location
}
