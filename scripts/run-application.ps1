$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backendDirectory = Join-Path $scriptDirectory "..\server"

cd $backendDirectory

npm install --legacy-peer-deps

Start-Process "npm" -ArgumentList "run start" -NoNewWindow
Start-Sleep -Seconds 5

$frontendDirectory = Join-Path $scriptDirectory "..\client"

cd $frontendDirectory

npm install --legacy-peer-deps

Start-Process "npm" -ArgumentList "start" -NoNewWindow