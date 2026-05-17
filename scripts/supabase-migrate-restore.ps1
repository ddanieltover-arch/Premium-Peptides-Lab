# Import public schema dump into NEW Supabase (run after supabase-migrate-dump.ps1)
# Usage:
#   $env:PGPASSWORD = "your-new-db-password"
#   .\scripts\supabase-migrate-restore.ps1 -DbHost "db.YOUR_NEW_REF.supabase.co"

param(
  [Parameter(Mandatory = $true)]
  [string]$DbHost,

  [string]$User = "postgres",
  [string]$Database = "postgres",
  [int]$Port = 5432,
  [string]$DumpFile = "premium-peptides-public.dump"
)

$pgBin = "C:\Program Files\PostgreSQL\18\bin"
if (-not (Test-Path "$pgBin\pg_restore.exe")) {
  Write-Error "pg_restore not found at $pgBin."
  exit 1
}

$dumpPath = Join-Path (Get-Location) $DumpFile
if (-not (Test-Path $dumpPath)) {
  Write-Error "Dump file not found: $dumpPath"
  exit 1
}

if (-not $env:PGPASSWORD) {
  Write-Host "Set password first:  `$env:PGPASSWORD = 'your-database-password'" -ForegroundColor Yellow
  exit 1
}

Write-Host "Restoring from: $dumpPath"

& "$pgBin\pg_restore.exe" --clean --if-exists --no-owner `
  -h $DbHost -p $Port -U $User -d $Database $dumpPath

if ($LASTEXITCODE -eq 0) {
  Write-Host "Restore finished." -ForegroundColor Green
} else {
  Write-Host "pg_restore may show warnings; exit code was $LASTEXITCODE. Check Supabase Table Editor for row counts." -ForegroundColor Yellow
}
