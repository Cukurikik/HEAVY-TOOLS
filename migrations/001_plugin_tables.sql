-- Fase 2: Tabel-tabel Custom Database (Tanpa Prisma) untuk Plugin Engine
-- File ini akan dijalankan oleh scripts/plugin-migrate.js

-- Task 13: Tabel plugins
CREATE TABLE IF NOT EXISTS plugins (
  id VARCHAR(255) PRIMARY KEY, -- ex: 'video-compressor-pro'
  name VARCHAR(255) NOT NULL,
  description TEXT,
  author VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0, -- Monetisasi (Fase 8)
  downloads INTEGER DEFAULT 0,
  category VARCHAR(100) DEFAULT 'general',
  is_official BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Task 14: Tabel plugin_versions
CREATE TABLE IF NOT EXISTS plugin_versions (
  id SERIAL PRIMARY KEY,
  plugin_id VARCHAR(255) REFERENCES plugins(id) ON DELETE CASCADE,
  version VARCHAR(50) NOT NULL,
  changelog TEXT,
  zip_url VARCHAR(1024), -- jika dari web (marketplace)
  file_hash VARCHAR(255), -- Integrity check (Fase 4)
  released_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(plugin_id, version)
);

-- Task 15: Tabel installed_plugins
CREATE TABLE IF NOT EXISTS installed_plugins (
  id SERIAL PRIMARY KEY,
  plugin_id VARCHAR(255) REFERENCES plugins(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL, -- User yang menginstal
  version_installed VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  local_path VARCHAR(500) NOT NULL, -- Path fisik /omni-plugins/data/{id}
  installed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(plugin_id, user_id)
);

-- Task 16: Tabel plugin_permissions
CREATE TABLE IF NOT EXISTS plugin_permissions (
  id SERIAL PRIMARY KEY,
  plugin_id VARCHAR(255) REFERENCES plugins(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  permission_scope VARCHAR(255) NOT NULL, -- 'read:local_files', 'access:network'
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(plugin_id, user_id, permission_scope)
);

-- Task 17: Tabel plugin_reviews
CREATE TABLE IF NOT EXISTS plugin_reviews (
  id SERIAL PRIMARY KEY,
  plugin_id VARCHAR(255) REFERENCES plugins(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(plugin_id, user_id)
);

-- Task 71: Tabel plugin_licenses (Monetisasi - Fase 8)
CREATE TABLE IF NOT EXISTS plugin_licenses (
  id SERIAL PRIMARY KEY,
  plugin_id VARCHAR(255) REFERENCES plugins(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  license_key VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(plugin_id, user_id)
);
