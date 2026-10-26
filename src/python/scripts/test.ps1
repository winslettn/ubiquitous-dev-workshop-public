$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "ensure-env.ps1")

Push-Location $ProjectRoot
try {
    & $VenvPython -m pytest
}
finally {
    Pop-Location
}
