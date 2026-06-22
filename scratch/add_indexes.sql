-- Add indexes for JHIRO performance optimization
-- Run this SQL directly on the database

-- Notifications: composite index for userId + isRead (for groupBy query)
CREATE INDEX IF NOT EXISTS idx_notification_userId_isRead 
  ON notifications (userId, isRead);

-- Projects: index for deletedAt (for WHERE deletedAt IS NULL filter)
CREATE INDEX IF NOT EXISTS idx_project_deletedAt 
  ON projects (deletedAt);

-- Verify indexes created
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('notifications', 'projects') 
  AND indexname LIKE 'idx_%';
