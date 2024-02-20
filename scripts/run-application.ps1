$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backendDirectory = Join-Path $scriptDirectory "..\server"

cd $backendDirectory

Start-Process "npm" -ArgumentList "run start" -NoNewWindow
Start-Sleep -Seconds 5

$frontendDirectory = Join-Path $scriptDirectory "..\client"

cd $frontendDirectory

Start-Process "npm" -ArgumentList "start" -NoNewWindow