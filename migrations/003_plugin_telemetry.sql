-- Migrasi Fase 9: Tabel Telemetri & Analitik Lokal

-- Task 85: Tabel plugin_analytics
CREATE TABLE IF NOT EXISTS plugin_analytics (
  id SERIAL PRIMARY KEY,
  plugin_id VARCHAR(255) REFERENCES plugins(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  total_executions INTEGER DEFAULT 0,
  total_errors INTEGER DEFAULT 0,
  average_execution_time_ms INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  UNIQUE(plugin_id, record_date)
);

-- Task 88: Uninstall Reasons
CREATE TABLE IF NOT EXISTS plugin_uninstall_reasons (
  id SERIAL PRIMARY KEY,
  plugin_id VARCHAR(255) REFERENCES plugins(id) ON DELETE CASCADE,
  reason VARCHAR(255),
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
