$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$VenvPython = Join-Path $ProjectRoot ".venv\Scripts\python.exe"

if (-not (Test-Path $VenvPython)) {
    python -m venv (Join-Path $ProjectRoot ".venv")
}

Push-Location $ProjectRoot
try {
    & $VenvPython -m pip install --upgrade pip --quiet
    & $VenvPython -m pip install -e ".[dev]" --quiet
}
finally {
    Pop-Location
}

Set-Variable -Name ProjectRoot -Value $ProjectRoot -Scope Global
Set-Variable -Name VenvPython -Value $VenvPython -Scope Global
