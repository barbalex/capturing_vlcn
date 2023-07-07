/**
 * Note: modifying the schema currently requires:
 * 1. Restarting the server
 * 2. Refreshing the browser
 *
 * Other than that, DB migrations are automatically handled.
 * WARNING: not null without default value is not supported
 */
export default {
  namespace: "default",
  name: "main",
  active: true,
  content: /*sql*/ `
    CREATE TABLE IF NOT EXISTS projects (id TEXT NOT NULL PRIMARY KEY, account_id TEXT, name TEXT, label TEXT, crs INTEGER DEFAULT 4326, deleted INTEGER DEFAULT 0, use_labels INTEGER DEFAULT 0);
    SELECT crsql_as_crr('projects');
  `,
};
