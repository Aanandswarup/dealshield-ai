# DealShield AI - 1-Click Multi-Channel Launcher
param([string]$Channel = "all")

$siteUrl = "https://aanandswarup.github.io/dealshield-ai/"
$gumroadDiscounts = "https://app.gumroad.com/discounts"

$tweetMsg = "The most dangerous clause a freelancer can sign:`n`n'Contractor liability shall be unlimited and include consequential damages.'`n`nOne client server glitch, and you can be sued for $100k+.`n`nI built DealShield AI to catch contract traps in 5s: " + $siteUrl + "`n`n100% private in-browser audit. First 10 get 50% off with code EARLYBIRD"
$encodedTweet = [System.Uri]::EscapeDataString($tweetMsg)
$twitterUrl = "https://twitter.com/intent/tweet?text=" + $encodedTweet

$hnTitle = "Show HN: DealShield - In-browser contract risk scanner and redline generator for freelancers"
$encodedHnTitle = [System.Uri]::EscapeDataString($hnTitle)
$encodedSiteUrl = [System.Uri]::EscapeDataString($siteUrl)
$hnUrl = "https://news.ycombinator.com/submitlink?u=" + $encodedSiteUrl + "&t=" + $encodedHnTitle

$redditTitle = "A reminder to freelancers: ALWAYS check Section 8 for Uncapped Liability (here is what it actually means)"
$encodedRedditTitle = [System.Uri]::EscapeDataString($redditTitle)
$redditUrl = "https://www.reddit.com/r/freelance/submit?title=" + $encodedRedditTitle

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   DEALSHIELD AI - MULTI-CHANNEL DISTRIBUTION LAUNCHER     " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

Write-Host "[*] Opening live app: $siteUrl" -ForegroundColor Green
Start-Process $siteUrl
Start-Sleep -Milliseconds 800

Write-Host "[*] Opening Twitter / X composer..." -ForegroundColor Green
Start-Process $twitterUrl
Start-Sleep -Milliseconds 800

Write-Host "[*] Opening Hacker News (Show HN)..." -ForegroundColor Cyan
Start-Process $hnUrl
Start-Sleep -Milliseconds 800

Write-Host "[*] Opening Reddit (r/freelance)..." -ForegroundColor Magenta
Start-Process $redditUrl

Write-Host ""
Write-Host "SUCCESS: DealShield AI and all promotional channels launched!" -ForegroundColor Green
