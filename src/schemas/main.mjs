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
    CREATE TABLE IF NOT EXISTS tables (id TEXT NOT NULL PRIMARY KEY, project_id TEXT, rel_type TEXT, name TEXT, label TEXT, singular_label TEXT, row_label TEXT, sort INTEGER, type TEXT default 'standard', deleted INTEGER DEFAULT 0);
    SELECT crsql_as_crr('tables');
    CREATE TABLE IF NOT EXISTS fields (id TEXT NOT NULL PRIMARY KEY, table_id TEXT, name TEXT, label TEXT, sort INTEGER, table_rel TEXT, is_internal_id INTEGER DEFAULT 0, field_type TEXT, widget_type TEXT, options_table text, standard_value TEXT, deleted INTEGER DEFAULT 0);
    SELECT crsql_as_crr('fields');
  `,
};
