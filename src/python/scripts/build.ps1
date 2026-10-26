$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "ensure-env.ps1")

Push-Location $ProjectRoot
try {
    & $VenvPython -m compileall app tests
}
finally {
    Pop-Location
}
