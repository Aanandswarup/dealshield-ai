import type { UserCredits } from '../types';

const STORAGE_KEY = 'dealshield_user_credits_v1';
const SEAL_STORAGE_KEY = 'dealshield_integrity_seal_v1';
const DAILY_FREE_LIMIT = 1;
const SALT = 'DS_PRO_SECRET_SALT_2026';

function computeChecksum(payload: string): string {
  let hash = 0x811c9dc5;
  const str = payload + SALT;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
  return hex.slice(0, 4);
}

function computeIntegritySeal(credits: Partial<UserCredits>): string {
  const seed = `${credits.freeAuditsRemaining ?? 0}:${credits.isPro ? 'PRO' : 'FREE'}:${credits.lastResetDate ?? ''}:${credits.licenseKey ?? ''}:${SALT}`;
  let hash = 0x5a17b89f;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

const WHITELISTED_VIP_KEYS = new Set([
  'DS-PRO-FOUNDER-VIP',
  'DS-PRO-AGENCY-VIP',
  'DS-PRO-2026-TEST',
  'DS-PRO-AUDIT-LIFETIME',
  'DS123'
]);

export function verifyLicenseKey(rawKey: string): boolean {
  if (!rawKey) return false;
  const cleanKey = rawKey.trim().toUpperCase();
  if (cleanKey.length < 5) return false;

  // 1. Signed format: DS-PRO-XXXX-XXXX-CHECKSUM
  const match = cleanKey.match(/^DS-PRO-([A-Z0-9]{4})-([A-Z0-9]{4})-([A-Z0-9]{4})$/);
  if (match) {
    const payload = `DS-PRO-${match[1]}-${match[2]}`;
    const expectedChecksum = computeChecksum(payload);
    if (match[3] === expectedChecksum) {
      return true;
    }
  }

  // 2. VIP whitelist
  if (WHITELISTED_VIP_KEYS.has(cleanKey)) {
    return true;
  }

  return false;
}

export const CreditManager = {
  getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  },

  getCredits(): UserCredits {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const seal = localStorage.getItem(SEAL_STORAGE_KEY);
      const today = this.getTodayDateString();

      if (!raw || !seal) {
        return this.initCredits(today);
      }

      const parsed: UserCredits = JSON.parse(raw);
      const expectedSeal = computeIntegritySeal(parsed);

      if (seal !== expectedSeal) {
        console.warn('Tamper detected in DealShield credits. Resetting to baseline.');
        return this.initCredits(today);
      }

      // Check daily reset for non-pro
      if (!parsed.isPro && parsed.lastResetDate !== today) {
        parsed.freeAuditsRemaining = DAILY_FREE_LIMIT;
        parsed.lastResetDate = today;
        this.saveCredits(parsed);
      }

      return parsed;
    } catch {
      return this.initCredits(this.getTodayDateString());
    }
  },

  initCredits(today: string): UserCredits {
    const initial: UserCredits = {
      freeAuditsRemaining: DAILY_FREE_LIMIT,
      isPro: false,
      lastResetDate: today
    };
    this.saveCredits(initial);
    return initial;
  },

  saveCredits(credits: UserCredits): void {
    const seal = computeIntegritySeal(credits);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credits));
    localStorage.setItem(SEAL_STORAGE_KEY, seal);
  },

  canAudit(): boolean {
    const credits = this.getCredits();
    if (credits.isPro) return true;
    return credits.freeAuditsRemaining > 0;
  },

  consumeAudit(): boolean {
    const credits = this.getCredits();
    if (credits.isPro) return true;
    if (credits.freeAuditsRemaining <= 0) return false;

    credits.freeAuditsRemaining -= 1;
    this.saveCredits(credits);
    return true;
  },

  activatePro(licenseKey: string): boolean {
    if (!verifyLicenseKey(licenseKey)) {
      return false;
    }

    const credits = this.getCredits();
    credits.isPro = true;
    credits.licenseKey = licenseKey.trim().toUpperCase();
    this.saveCredits(credits);
    return true;
  }
};
