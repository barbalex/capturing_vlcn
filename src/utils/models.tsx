export type Project = {
  id: string
  account_id: string
  name: string
  label: string
  crs: integer
  deleted: integer
  use_labels: integer
}

export type ProjectUser = {
  id: string
  project_id: string
  email: string
  role: string
  deleted: integer
}

export type Table = {
  id: string
  project_id: string
  rel_type: string
  name: string
  label: string
  singular_label: string
  row_label: string
  sort: integer
  type: string
  deleted: integer
}
