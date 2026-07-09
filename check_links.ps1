# Check internal markdown links in all docs pages
# Usage: powershell -File check_links.ps1

$ErrorActionPreference = "Continue"
$docsRoot = "src\content\docs"
$siteRoot = (Get-Location).Path

$mdFiles = Get-ChildItem -Path $docsRoot -Recurse -Filter "*.md"
Write-Host "Scanning $($mdFiles.Count) markdown files..."

$brokenLinks = @()
$totalLinks = 0

foreach ($file in $mdFiles) {
    $content = Get-Content -LiteralPath $file.FullName -Raw
    $relPath = $file.FullName.Substring($siteRoot.Length + 1)
    $pageUrl = $relPath -replace "^src\\content\\docs\\", "/" -replace "\\", "/" -replace "\.md$", "/" -replace "/index/$", "/"

    # Find all markdown links [text](url)
    $linkPattern = '\[([^\]]*)\]\(([^)#]+)(#[^)]*)?\)'
    $matches = [regex]::Matches($content, $linkPattern)

    foreach ($m in $matches) {
        $linkText = $m.Groups[1].Value
        $linkUrl = $m.Groups[2].Value.Trim()
        $totalLinks++

        # Skip external links
        if ($linkUrl -match '^https?://' -or $linkUrl -match '^mailto:') { continue }
        # Skip image / asset links
        if ($linkUrl -match '\.(png|jpg|jpeg|gif|svg|webp|pdf)$') { continue }

        # Resolve target
        $target = $linkUrl
        if ($target.StartsWith("/")) {
            # Absolute from site root
            $resolved = $target -replace "^/", ""
        } else {
            # Relative — join with current page URL
            $base = ($pageUrl -replace "[^/]+$", "")
            $resolved = $base + $target -replace "^/", ""
            # Normalize: handle ../
            $parts = $resolved -split "/"
            $stack = @()
            foreach ($p in $parts) {
                if ($p -eq ".." -and $stack.Count -gt 0) {
                    $null = $stack[$stack.Count - 1]
                    $stack = $stack[0..($stack.Count - 2)]
                } elseif ($p -ne "" -and $p -ne ".") {
                    $stack += $p
                }
            }
            $resolved = ($stack -join "/")
        }
        $resolved = $resolved.TrimEnd("/")

        # Check whether the target page exists in docs
        # Try: docs/<resolved>.md or docs/<resolved>/index.md
        $candidate1 = Join-Path $docsRoot ("$resolved.md" -replace "/", "\")
        $candidate2 = Join-Path $docsRoot ("$resolved\index.md" -replace "/", "\")

        if (-not (Test-Path -LiteralPath $candidate1) -and -not (Test-Path -LiteralPath $candidate2)) {
            $brokenLinks += [PSCustomObject]@{
                File = $relPath
                LinkText = $linkText
                LinkUrl = $linkUrl
                Resolved = $resolved
            }
        }
    }
}

Write-Host ""
Write-Host "Total links checked: $totalLinks"
Write-Host "Broken links: $($brokenLinks.Count)"
Write-Host ""

if ($brokenLinks.Count -gt 0) {
    Write-Host "=== Broken links ==="
    $grouped = $brokenLinks | Group-Object -Property Resolved | Sort-Object -Property Count -Descending
    foreach ($g in $grouped) {
        Write-Host ""
        Write-Host "Missing target: $($g.Name) ($($g.Count) link(s))"
        foreach ($b in $g.Group) {
            Write-Host "  - in [$($b.File)] -> '$($b.LinkUrl)' (text: $($b.LinkText))"
        }
    }
}
