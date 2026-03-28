-- Migrasi Fase 8: Tabel Monetisasi Custom Lokal

-- Task 71: Tabel plugin_licenses
CREATE TABLE IF NOT EXISTS plugin_licenses (
  id SERIAL PRIMARY KEY,
  plugin_id VARCHAR(255) REFERENCES plugins(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  license_key VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, REVOKED, EXPIRED, PENDING_PAYMENT
  trial_expiration TIMESTAMP WITH TIME ZONE, -- Task 77: Free Trial
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(plugin_id, user_id)
);

-- Task 74: Omni Credits Wallet untuk User (Local tracking tanpa stripe)
CREATE TABLE IF NOT EXISTS user_wallets (
  user_id VARCHAR(255) PRIMARY KEY,
  balance NUMERIC(15,2) DEFAULT 0.00
);

-- Task 78: Quota Overrides (Tambahan limit untuk user dari plugin pro)
CREATE TABLE IF NOT EXISTS quota_overrides (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  resource VARCHAR(100) NOT NULL, -- "upload_limit_mb", "max_video_resolution"
  bonus_value INTEGER NOT NULL,
  source_plugin_id VARCHAR(255) REFERENCES plugins(id) ON DELETE CASCADE
);
