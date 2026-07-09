# Fix broken relative links by converting to absolute paths.
# Resolution: use source-file directory as base (writer's intent).

$ErrorActionPreference = "Stop"
$docsRoot = "src\content\docs"

$mdFiles = Get-ChildItem -Path $docsRoot -Recurse -Filter "*.md"
Write-Host "Processing $($mdFiles.Count) markdown files..."

$totalFixes = 0
$totalLinks = 0
$changedFiles = 0

foreach ($file in $mdFiles) {
    $content = Get-Content -LiteralPath $file.FullName -Raw
    $relPath = $file.FullName.Substring((Get-Location).Path.Length + 1)

    # Source-dir (everything except filename + ".md")
    # E.g. src\content\docs\game\objects\asteroid.md  → src\content\docs\game\objects
    # Strip "src\content\docs\" prefix → game\objects
    $srcRel = $relPath -replace "^src\\content\\docs\\", "" -replace "\\", "/"
    $isIndex = $srcRel -match "(^|/)index\.md$"
    if ($isIndex) {
        $sourceDirPath = ($srcRel -replace "(^|/)index\.md$", "")
    } else {
        $sourceDirPath = ($srcRel -replace "/[^/]+\.md$", "")
        # if file is at root level (e.g. "X.md") sourceDirPath = ""
        if ($srcRel -notmatch "/") { $sourceDirPath = "" }
    }

    # Find all markdown links
    $linkPattern = '(\[[^\]]*\])\(([^)#]+)(#[^)]*)?\)'
    $regex = [regex]$linkPattern

    # Read file fresh with UTF-8 to avoid encoding issues
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        $bytes = $bytes[3..($bytes.Length - 1)]
    }
    $content = [System.Text.Encoding]::UTF8.GetString($bytes)
    $origContent = $content

    $newContent = $regex.Replace($content, {
        param($m)
        $linkText = $m.Groups[1].Value     # includes [ ]
        $linkUrl = $m.Groups[2].Value.Trim()
        $anchor = $m.Groups[3].Value
        $script:totalLinks++

        # Skip external links
        if ($linkUrl -match '^https?://' -or $linkUrl -match '^mailto:') {
            return $m.Value
        }
        # Skip image / asset links (already absolute-ish or external)
        if ($linkUrl -match '\.(png|jpg|jpeg|gif|svg|webp|pdf|ico|mp4|webm)$') {
            return $m.Value
        }
        # Skip already-absolute links
        if ($linkUrl.StartsWith("/")) {
            return $m.Value
        }
        # Skip pure-anchor links
        if ($linkUrl -eq "" -or $linkUrl.StartsWith("#")) {
            return $m.Value
        }

        # Resolve target as if from source dir
        $combined = if ($sourceDirPath -eq "") { $linkUrl } else { "$sourceDirPath/$linkUrl" }

        # Normalize ..
        $parts = $combined -split "/"
        $stack = New-Object System.Collections.Generic.List[string]
        foreach ($p in $parts) {
            if ($p -eq "..") {
                if ($stack.Count -gt 0) {
                    $stack.RemoveAt($stack.Count - 1)
                }
            } elseif ($p -ne "" -and $p -ne ".") {
                $stack.Add($p)
            }
        }
        $resolved = ($stack -join "/").TrimEnd("/")
        if ($resolved -eq "") { return $m.Value }  # avoid weird cases

        $newUrl = "/$resolved/$anchor"
        # Only change if different from what writer wrote and target exists in docs
        $candidate1 = Join-Path $docsRoot ("$resolved.md" -replace "/", "\")
        $candidate2 = Join-Path $docsRoot ("$resolved\index.md" -replace "/", "\")
        if ((Test-Path -LiteralPath $candidate1) -or (Test-Path -LiteralPath $candidate2)) {
            $script:totalFixes++
            return "$linkText($newUrl)"
        }
        # target doesn't exist even after source-relative resolution — leave for manual review
        return $m.Value
    })

    if ($newContent -ne $origContent) {
        # Write UTF-8 without BOM
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllBytes($file.FullName, $utf8NoBom.GetBytes($newContent))
        $changedFiles++
    }
}

Write-Host ""
Write-Host "Total links scanned: $totalLinks"
Write-Host "Total links converted to absolute: $totalFixes"
Write-Host "Files changed: $changedFiles"
