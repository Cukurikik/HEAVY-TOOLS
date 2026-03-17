$ErrorActionPreference = "Continue"
$branches = Get-Content unmerged_clean.txt

foreach ($branch in $branches) {
    $b = $branch.Trim()
    if ([string]::IsNullOrWhiteSpace($b) -or $b -eq "origin/push" -or $b -like "origin/jules-*") {
        continue
    }
    
    Write-Host "----------------------------------------"
    Write-Host "Merging $b"
    Write-Host "----------------------------------------"
    
    # We use $env:GIT_EDITOR=true just in case it prompts for an editor
    $env:GIT_EDITOR = "true"
    git merge $b
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Merge conflict or error on $b! Stopping script."
        exit 1
    }
}

Write-Host "Successfully merged all selected branches!"
exit 0
