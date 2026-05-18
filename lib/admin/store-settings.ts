import { PAYMENT_METHOD_IDS, PAYMENT_METHOD_LABELS } from '@/lib/checkout/payment-methods';

export type GeneralSettings = {
  storeName: string;
  supportEmail: string;
  complianceStatement: string;
  siteUrl: string;
};

export type PaymentsSettings = {
  enabledMethods: string[];
};

export type NotificationsSettings = {
  orderStatusEmail: boolean;
  orderConfirmationEmail: boolean;
};

export type OperationsSettings = {
  scraperLogRetentionDays: number;
};

export type StoreSettingsBundle = {
  general: GeneralSettings;
  payments: PaymentsSettings;
  notifications: NotificationsSettings;
  operations: OperationsSettings;
};

export const DEFAULT_STORE_SETTINGS: StoreSettingsBundle = {
  general: {
    storeName: 'Premium Peptides Lab',
    supportEmail: 'support@premiumpeptideslab.online',
    complianceStatement:
      'All products listed are strictly for in-vitro research use only. Not for human consumption.',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://premiumpeptideslab.online',
  },
  payments: {
    enabledMethods: [...PAYMENT_METHOD_IDS],
  },
  notifications: {
    orderStatusEmail: true,
    orderConfirmationEmail: true,
  },
  operations: {
    scraperLogRetentionDays: 30,
  },
};

export const STORE_SETTING_KEYS = ['general', 'payments', 'notifications', 'operations'] as const;
export type StoreSettingKey = (typeof STORE_SETTING_KEYS)[number];

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function str(v: unknown, fallback: string): string {
  return typeof v === 'string' && v.trim() ? v.trim() : fallback;
}

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback;
}

function num(v: unknown, fallback: number): number {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function mergeStoreSettings(rows: { key: string; value: unknown }[]): StoreSettingsBundle {
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const g = asRecord(map.get('general'));
  const p = asRecord(map.get('payments'));
  const n = asRecord(map.get('notifications'));
  const o = asRecord(map.get('operations'));

  const rawMethods = p.enabledMethods;
  let enabledMethods = DEFAULT_STORE_SETTINGS.payments.enabledMethods;
  if (Array.isArray(rawMethods)) {
    enabledMethods = rawMethods
      .filter((id): id is string => typeof id === 'string' && PAYMENT_METHOD_IDS.includes(id));
    if (enabledMethods.length === 0) enabledMethods = ['credit-card'];
  }

  return {
    general: {
      storeName: str(g.storeName, DEFAULT_STORE_SETTINGS.general.storeName),
      supportEmail: str(g.supportEmail, DEFAULT_STORE_SETTINGS.general.supportEmail),
      complianceStatement: str(
        g.complianceStatement,
        DEFAULT_STORE_SETTINGS.general.complianceStatement,
      ),
      siteUrl: str(g.siteUrl, DEFAULT_STORE_SETTINGS.general.siteUrl),
    },
    payments: { enabledMethods },
    notifications: {
      orderStatusEmail: bool(n.orderStatusEmail, DEFAULT_STORE_SETTINGS.notifications.orderStatusEmail),
      orderConfirmationEmail: bool(
        n.orderConfirmationEmail,
        DEFAULT_STORE_SETTINGS.notifications.orderConfirmationEmail,
      ),
    },
    operations: {
      scraperLogRetentionDays: Math.min(
        3650,
        Math.max(1, num(o.scraperLogRetentionDays, DEFAULT_STORE_SETTINGS.operations.scraperLogRetentionDays)),
      ),
    },
  };
}

/** Public-safe subset for storefront / checkout. */
export function toPublicStoreSettings(bundle: StoreSettingsBundle) {
  return {
    general: bundle.general,
    payments: {
      enabledMethods: bundle.payments.enabledMethods,
      labels: Object.fromEntries(
        bundle.payments.enabledMethods.map((id) => [id, PAYMENT_METHOD_LABELS[id] ?? id]),
      ),
    },
  };
}

export function validateSettingsPatch(
  key: StoreSettingKey,
  value: unknown,
): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  const merged = mergeStoreSettings([{ key, value }]);
  switch (key) {
    case 'general':
      return { ok: true, value: merged.general as unknown as Record<string, unknown> };
    case 'payments':
      return { ok: true, value: merged.payments as unknown as Record<string, unknown> };
    case 'notifications':
      return { ok: true, value: merged.notifications as unknown as Record<string, unknown> };
    case 'operations':
      return { ok: true, value: merged.operations as unknown as Record<string, unknown> };
    default:
      return { ok: false, error: 'Unknown settings key' };
  }
}
