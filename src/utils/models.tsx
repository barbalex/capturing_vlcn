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
