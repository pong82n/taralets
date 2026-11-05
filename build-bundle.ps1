$utf8 = [System.Text.Encoding]::UTF8

function Clean-Js($content) {
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, '(?m)^\s*import\s+[^;]+;\s*$', '')
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, '(?m)^\s*export\s+(default\s+)?', '')
    return $content
}

$data = Clean-Js ([System.IO.File]::ReadAllText("js/data.js", $utf8))
$storage = Clean-Js ([System.IO.File]::ReadAllText("js/storage.js", $utf8))
$matching = Clean-Js ([System.IO.File]::ReadAllText("js/matching.js", $utf8))
$map = Clean-Js ([System.IO.File]::ReadAllText("js/map.js", $utf8))
$chat = Clean-Js ([System.IO.File]::ReadAllText("js/chat.js", $utf8))
$app = Clean-Js ([System.IO.File]::ReadAllText("js/app.js", $utf8))

$bundle = @"
/**
 * TaraLets - Standalone Application Bundle
 * Complete Ridesharing Platform with Mobile Screen Fit, Commuter Login/Logout, Verified QR Codes & Payment Modes
 */
(function() {
  'use strict';

  // --- DATA ---
  $data

  // --- STORAGE SERVICE ---
  $storage

  // --- MATCHING ENGINE ---
  $matching

  // --- MAP MANAGER ---
  $map

  // --- CHAT MANAGER ---
  $chat

  // --- APP CONTROLLER ---
  $app
})();
"@

[System.IO.File]::WriteAllText("js/bundle.js", $bundle, $utf8)
Write-Output "bundle.js rebuilt successfully, length: $($bundle.Length)"
