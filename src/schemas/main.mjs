/**
 * Note: modifying the schema currently requires:
 * 1. Restarting the server
 * 2. Refreshing the browser
 *
 * Other than that, DB migrations are automatically handled*
 *
 * *Note: the auto-migration path is still _beta_ quality.
 * Given that, you may need to reset your DB after certain schema changes.
 * You can disable auto-migration in production.
 */
export default {
  namespace: 'default',
  name: 'main',
  active: true,
  content: /*sql*/ `
    CREATE TABLE IF NOT EXISTS projects (id TEXT NOT NULL PRIMARY KEY, account_id TEXT, name TEXT, label TEXT, crs INTEGER DEFAULT 4326, deleted INTEGER DEFAULT 0, use_labels INTEGER DEFAULT 0);
    SELECT crsql_as_crr('projects');
    CREATE TABLE IF NOT EXISTS tables (id TEXT NOT NULL PRIMARY KEY, project_id TEXT, rel_type TEXT, name TEXT, label TEXT, singular_label TEXT, row_label TEXT, sort INTEGER, type TEXT default 'standard', deleted INTEGER DEFAULT 0);
    SELECT crsql_as_crr('tables');
    CREATE TABLE IF NOT EXISTS fields (id TEXT NOT NULL PRIMARY KEY, table_id TEXT, name TEXT, label TEXT, sort INTEGER, table_rel TEXT, is_internal_id INTEGER DEFAULT 0, field_type TEXT, widget_type TEXT, options_table text, standard_value TEXT, deleted INTEGER DEFAULT 0);
    SELECT crsql_as_crr('fields');
    CREATE TABLE IF NOT EXISTS rows (id TEXT NOT NULL PRIMARY KEY, table_id TEXT, geometry TEXT, bbox TEXT, data TEXT, deleted INTEGER DEFAULT 0);
    SELECT crsql_as_crr('rows');
    CREATE TABLE IF NOT EXISTS tile_layers (id TEXT NOT NULL PRIMARY KEY, label TEXT, sort INTEGER, active INTEGER, project_id TEXT, type TEXT, wmts_url_template TEXT, wmts_subdomains TEXT, max_zoom REAL, min_zoom REAL, opacity REAL, wms_base_url TEXT, wms_format TEXT, wms_layers TEXT, wms_parameters TEXT, wms_styles TEXT, wms_transparent INTEGER, wms_version TEXT, wms_info_format TEXT, wms_queryable INTEGER, grayscale INTEGER DEFAULT 0, local_data_size REAL, local_data_bounds TEXT, deleted INTEGER DEFAULT 0);
    SELECT crsql_as_crr('tile_layers');
    CREATE TABLE IF NOT EXISTS vector_layers (id TEXT NOT NULL PRIMARY KEY, label TEXT, sort INTEGER, active INTEGER, project_id TEXT, type TEXT, url TEXT, max_zoom REAL, min_zoom REAL, type_name TEXT, wfs_version TEXT, output_format TEXT, opacity REAL, max_features INTEGER DEFAULT 1000, feature_count INTEGER, point_count INTEGER, line_count INTEGER, polygon_count INTEGER, deleted INTEGER DEFAULT 0);
    SELECT crsql_as_crr('vector_layers');
    CREATE TABLE IF NOT EXISTS project_users (id TEXT NOT NULL PRIMARY KEY, project_id TEXT, email TEXT, role TEXT, deleted INTEGER DEFAULT 0);
    SELECT crsql_as_crr('project_users');
  `,
}
