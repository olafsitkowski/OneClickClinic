$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectDirectory = Join-Path $scriptDirectory "..\client"

cd $projectDirectory

Start-Process "npm" -ArgumentList "start" -NoNewWindow