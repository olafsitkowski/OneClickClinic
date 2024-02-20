$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectDirectory = Join-Path $scriptDirectory "..\server"

cd $projectDirectory

Start-Process "npm" -ArgumentList "run start" -NoNewWindow
