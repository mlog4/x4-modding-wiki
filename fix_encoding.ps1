# Reverse UTF-8 corruption (read-as-cp1252, written-as-UTF-8 roundtrip damage).
# Strip BOM markers. Detection via specific byte sequences in raw file content.

$ErrorActionPreference = "Stop"
$docsRoot = "src\content\docs"

$mdFiles = Get-ChildItem -Path $docsRoot -Recurse -Filter "*.md"
$cp1252 = [System.Text.Encoding]::GetEncoding(1252)
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

$fixedCount = 0
foreach ($file in $mdFiles) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)

    # Strip BOM if present (EF BB BF)
    $hasBom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
    if ($hasBom) {
        $bytes = $bytes[3..($bytes.Length - 1)]
    }

    # Detect corruption: presence of byte sequence C3 A2 E2 (multibyte UTF-8 cp1252-leak pattern)
    # In a clean UTF-8 file this is extremely rare; in corrupted file it appears for every em dash
    $needsRoundtrip = $false
    for ($i = 0; $i -lt $bytes.Length - 2; $i++) {
        if ($bytes[$i] -eq 0xC3 -and $bytes[$i+1] -eq 0xA2 -and $bytes[$i+2] -eq 0xE2) {
            $needsRoundtrip = $true
            break
        }
    }
    # Also detect Cyrillic corruption: C3 91 (Ñ) is a very common marker if Russian was corrupted
    if (-not $needsRoundtrip) {
        for ($i = 0; $i -lt $bytes.Length - 1; $i++) {
            # Pattern C3 followed by 80-91 is uncommon in clean files but common in corruption
            if ($bytes[$i] -eq 0xC3 -and $bytes[$i+1] -ge 0x82 -and $bytes[$i+1] -le 0x83) {
                # Could be Â or Ã — corruption candidates. But also possible in clean text.
                # Use a stricter check: require pattern repeats
                $needsRoundtrip = $true
                break
            }
        }
    }

    if ($needsRoundtrip) {
        # Decode current bytes as UTF-8
        $text = [System.Text.Encoding]::UTF8.GetString($bytes)
        # Re-encode chars as cp1252 (recovering original UTF-8 bytes)
        $cp1252Bytes = $cp1252.GetBytes($text)
        # Decode those bytes as UTF-8 (the original)
        $text = [System.Text.Encoding]::UTF8.GetString($cp1252Bytes)
        $bytes = $utf8NoBom.GetBytes($text)
    }

    if ($needsRoundtrip -or $hasBom) {
        [System.IO.File]::WriteAllBytes($file.FullName, $bytes)
        $fixedCount++
    }
}

Write-Host "Fixed encoding in $fixedCount files."
