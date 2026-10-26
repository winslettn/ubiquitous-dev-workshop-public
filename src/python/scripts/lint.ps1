$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "ensure-env.ps1")

$Ruff = Join-Path $ProjectRoot ".venv\Scripts\ruff.exe"

Push-Location $ProjectRoot
try {
    & $Ruff check .
}
finally {
    Pop-Location
}
