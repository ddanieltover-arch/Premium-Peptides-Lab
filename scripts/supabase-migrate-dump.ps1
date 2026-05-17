# Export public schema from OLD Supabase (run in PowerShell from repo root)
# Usage:
#   $env:PGPASSWORD = "your-old-db-password"
#   .\scripts\supabase-migrate-dump.ps1 -DbHost "db.tbgmkqklkshkjfhcqtzz.supabase.co"

param(
  [Parameter(Mandatory = $true)]
  [string]$DbHost,

  [string]$User = "postgres",
  [string]$Database = "postgres",
  [int]$Port = 5432,
  [string]$OutFile = "premium-peptides-public.dump"
)

$pgBin = "C:\Program Files\PostgreSQL\18\bin"
if (-not (Test-Path "$pgBin\pg_dump.exe")) {
  Write-Error "pg_dump not found at $pgBin. Install PostgreSQL or edit `$pgBin in this script."
  exit 1
}

if (-not $env:PGPASSWORD) {
  Write-Host "Set password first:  `$env:PGPASSWORD = 'your-database-password'" -ForegroundColor Yellow
  exit 1
}

$outPath = Join-Path (Get-Location) $OutFile
Write-Host "Writing dump to: $outPath"

& "$pgBin\pg_dump.exe" -h $DbHost -p $Port -U $User -d $Database `
  --schema=public --no-owner --no-acl -Fc -f $outPath

if ($LASTEXITCODE -eq 0) {
  Write-Host "Done. File size:" (Get-Item $outPath).Length "bytes" -ForegroundColor Green
} else {
  Write-Error "pg_dump failed (exit $LASTEXITCODE)"
}
