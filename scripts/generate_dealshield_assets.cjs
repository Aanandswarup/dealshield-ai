const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const svgBanner = `<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070b12" />
      <stop offset="50%" stop-color="#0c1220" />
      <stop offset="100%" stop-color="#05080e" />
    </linearGradient>

    <radialGradient id="glow" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3" />
      <stop offset="50%" stop-color="#6366f1" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#60a5fa" />
      <stop offset="50%" stop-color="#818cf8" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>

    <linearGradient id="cardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#131b2e" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#0d1424" stop-opacity="0.9" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="1280" height="720" fill="url(#bg)" />

  <!-- Ambient Glow -->
  <circle cx="640" cy="220" r="450" fill="url(#glow)" />

  <!-- Grid Lines -->
  <g opacity="0.06" stroke="#ffffff" stroke-width="1">
    <line x1="0" y1="120" x2="1280" y2="120" />
    <line x1="0" y1="240" x2="1280" y2="240" />
    <line x1="0" y1="360" x2="1280" y2="360" />
    <line x1="0" y1="480" x2="1280" y2="480" />
    <line x1="0" y1="600" x2="1280" y2="600" />
  </g>

  <!-- Top Pill -->
  <g transform="translate(490, 75)">
    <rect width="300" height="34" rx="17" fill="#3b82f6" fill-opacity="0.12" stroke="#3b82f6" stroke-opacity="0.4" stroke-width="1.5" />
    <text x="150" y="22" font-family="sans-serif" font-size="12" font-weight="700" fill="#60a5fa" letter-spacing="2" text-anchor="middle">LIFETIME ACCESS PASS • $29</text>
  </g>

  <!-- Main Title -->
  <text x="640" y="170" font-family="sans-serif" font-size="54" font-weight="900" fill="#ffffff" letter-spacing="-1" text-anchor="middle">
    DealShield <tspan fill="url(#accent)">AI</tspan>
  </text>

  <!-- Subtitle -->
  <text x="640" y="215" font-family="sans-serif" font-size="20" font-weight="500" fill="#94a3b8" text-anchor="middle">
    Client Contract &amp; SOW Risk Audit Studio for Freelancers &amp; Agencies
  </text>
  <text x="640" y="245" font-family="sans-serif" font-size="14" font-weight="400" fill="#64748b" text-anchor="middle">
    100% In-Browser Privacy • Catch Uncapped Liability, IP Forfeiture &amp; Net-90 Traps in 5 Seconds
  </text>

  <!-- Bento Cards Grid -->
  <!-- Card 1: Liability -->
  <g transform="translate(140, 310)">
    <rect width="300" height="240" rx="20" fill="url(#cardBg)" stroke="#1e293b" stroke-width="1.5" />
    <circle cx="50" cy="50" r="22" fill="#ef4444" fill-opacity="0.15" />
    <text x="50" y="56" font-family="sans-serif" font-size="20" fill="#f87171" text-anchor="middle">🛡️</text>
    <text x="30" y="115" font-family="sans-serif" font-size="20" font-weight="800" fill="#ffffff">Liability Shield</text>
    <text x="30" y="145" font-family="sans-serif" font-size="13" font-weight="400" fill="#94a3b8">Uncapped Indemnity Detector</text>
    <text x="30" y="165" font-family="sans-serif" font-size="13" font-weight="400" fill="#94a3b8">Consequential damage caps</text>
    <text x="30" y="185" font-family="sans-serif" font-size="13" font-weight="700" fill="#ef4444">1-click mutual cap fix</text>
  </g>

  <!-- Card 2: IP Protection -->
  <g transform="translate(490, 310)">
    <rect width="300" height="240" rx="20" fill="url(#cardBg)" stroke="#3b82f6" stroke-width="2" />
    <circle cx="50" cy="50" r="22" fill="#3b82f6" fill-opacity="0.15" />
    <text x="50" y="56" font-family="sans-serif" font-size="20" fill="#60a5fa" text-anchor="middle">⚡</text>
    <text x="30" y="115" font-family="sans-serif" font-size="20" font-weight="800" fill="#ffffff">IP &amp; Code Defense</text>
    <text x="30" y="145" font-family="sans-serif" font-size="13" font-weight="400" fill="#94a3b8">Pre-existing tool carve-outs</text>
    <text x="30" y="165" font-family="sans-serif" font-size="13" font-weight="400" fill="#94a3b8">Portfolio showcase rights</text>
    <text x="30" y="185" font-family="sans-serif" font-size="13" font-weight="700" fill="#60a5fa">Work-for-hire redlines</text>
  </g>

  <!-- Card 3: Executive PDF & Email -->
  <g transform="translate(840, 310)">
    <rect width="300" height="240" rx="20" fill="url(#cardBg)" stroke="#1e293b" stroke-width="1.5" />
    <circle cx="50" cy="50" r="22" fill="#10b981" fill-opacity="0.15" />
    <text x="50" y="56" font-family="sans-serif" font-size="20" fill="#34d399" text-anchor="middle">📄</text>
    <text x="30" y="115" font-family="sans-serif" font-size="20" font-weight="800" fill="#ffffff">Executive Redline</text>
    <text x="30" y="145" font-family="sans-serif" font-size="13" font-weight="400" fill="#94a3b8">Downloadable Audit PDF</text>
    <text x="30" y="165" font-family="sans-serif" font-size="13" font-weight="400" fill="#94a3b8">Client negotiation email draft</text>
    <text x="30" y="185" font-family="sans-serif" font-size="13" font-weight="700" fill="#34d399">100% in-browser privacy</text>
  </g>

  <!-- Bottom Trust Bar -->
  <g transform="translate(0, 620)">
    <line x1="200" y1="0" x2="1080" y2="0" stroke="#1e293b" stroke-width="1" />
    <text x="640" y="45" font-family="sans-serif" font-size="13" font-weight="600" fill="#64748b" text-anchor="middle">
      ✓ ZERO CLOUD STORAGE • ✓ ATTORNEY-GRADE REPLACEMENT CLAUSES • ✓ UNLIMITED AUDITS • ✓ COMMERCIAL RIGHTS
    </text>
  </g>
</svg>`;

const svgThumb = `<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgSquare" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070b12" />
      <stop offset="50%" stop-color="#0c1220" />
      <stop offset="100%" stop-color="#05080e" />
    </linearGradient>

    <radialGradient id="thumbGlow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.35" />
      <stop offset="60%" stop-color="#6366f1" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="600" height="600" fill="url(#bgSquare)" />
  <circle cx="300" cy="240" r="260" fill="url(#thumbGlow)" />
  <rect x="12" y="12" width="576" height="576" rx="36" fill="none" stroke="#1e293b" stroke-width="2" />

  <!-- Shield Icon -->
  <g transform="translate(250, 140)">
    <path d="M50 0 L100 20 L100 60 C100 110 50 140 50 140 C50 140 0 110 0 60 L0 20 Z" fill="#3b82f6" fill-opacity="0.2" stroke="#60a5fa" stroke-width="4" />
    <path d="M30 65 L45 80 L75 45" fill="none" stroke="#60a5fa" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <text x="300" y="340" font-family="sans-serif" font-size="38" font-weight="900" fill="#ffffff" text-anchor="middle">DealShield AI</text>
  <text x="300" y="380" font-family="sans-serif" font-size="16" font-weight="600" fill="#94a3b8" text-anchor="middle">Contract &amp; SOW Risk Audit Studio</text>
  <text x="300" y="420" font-family="sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">LIFETIME ACCESS PASS • $29</text>
</svg>`;

const publicDir = path.join(__dirname, '..', 'public');
fs.mkdirSync(publicDir, { recursive: true });

const coverSvgPath = path.join(publicDir, 'dealshield_cover.svg');
const thumbSvgPath = path.join(publicDir, 'dealshield_thumbnail.svg');

fs.writeFileSync(coverSvgPath, svgBanner, 'utf8');
fs.writeFileSync(thumbSvgPath, svgThumb, 'utf8');

console.log('SVGs generated cleanly in public folder.');

// Render to PNG via Edge headless
const coverPngDesktop = 'C:\\Users\\hp\\Desktop\\dealshield_cover.png';
const thumbPngDesktop = 'C:\\Users\\hp\\Desktop\\dealshield_thumbnail.png';
const coverPngPublic = path.join(publicDir, 'dealshield_cover.png');
const thumbPngPublic = path.join(publicDir, 'dealshield_thumbnail.png');

try {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  if (fs.existsSync(edgePath)) {
    console.log('Rendering high-DPI PNGs with Microsoft Edge headless...');
    execSync(`"${edgePath}" --headless --screenshot="${coverPngDesktop}" --window-size=1280,720 --default-background-color=000000 "file:///${coverSvgPath.replace(/\\\\/g, '/')}"`);
    execSync(`"${edgePath}" --headless --screenshot="${thumbPngDesktop}" --window-size=600,600 --default-background-color=000000 "file:///${thumbSvgPath.replace(/\\\\/g, '/')}"`);
    fs.copyFileSync(coverPngDesktop, coverPngPublic);
    fs.copyFileSync(thumbPngDesktop, thumbPngPublic);
    console.log('✅ Generated dealshield_cover.png & dealshield_thumbnail.png on Desktop and public/');
  }
} catch (err) {
  console.warn('Note: Could not render PNG with Edge headless, keeping SVG source:', err.message);
}
