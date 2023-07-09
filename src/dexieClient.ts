import { Dexie, DexieTable } from 'dexie'

window.Dexie = Dexie

export interface IAccount {
  id: string
  service_id?: string
  client_rev_at?: Date
  client_rev_by?: string
  server_rev_at?: Date
  deleted: number
}
export class Account implements IAccount {
  id: string
  service_id?: string
  client_rev_at?: Date
  client_rev_by?: string
  server_rev_at?: Date
  deleted: number

  constructor(
    id?: string,
    service_id?: string,
    client_rev_at?: Date,
    client_rev_by?: string,
    server_rev_at?: Date,
    deleted: number,
  ) {
    this.id = id ?? window.crypto.randomUUID()
    if (service_id) this.service_id = id
    if (client_rev_at) this.client_rev_at = id
    if (client_rev_by) this.client_rev_by = client_rev_by
    if (server_rev_at) this.server_rev_at = id
    this.deleted = deleted ?? 0
  }
  // TODO: add methods, see: https://dexie.org/docs/Typescript#storing-real-classes-instead-of-just-interfaces
  // TODO: method for related datasets
  // TODO: method for labels if helpful
  // TODO: methode for edit, delete
}

export interface INew {
  id: string
  time?: Date
  version_type?: string
  version?: string
  message?: string
  server_rev_at?: Date
  deleted: number
}
export class New implements INew {
  id: string
  time?: Date
  version_type?: string
  version?: string
  message?: string
  server_rev_at?: Date
  deleted: number

  constructor(
    id?: string,
    time?: Date,
    version_type?: string,
    version?: string,
    message?: string,
    server_rev_at?: Date,
    deleted: number,
  ) {
    this.id = id ?? window.crypto.randomUUID()
    if (time) this.time = time
    if (version_type) this.version_type = version_type
    if (version) this.version = version
    if (message) this.message = message
    if (server_rev_at) this.server_rev_at = server_rev_at
    this.deleted = deleted ?? 0
  }
}

export interface INewsDelivery {
  id: string
  news_id?: string
  user_id?: string
  server_rev_at?: Date
  deleted: number
}
export class NewsDelivery implements INewsDelivery {
  id: string
  news_id?: string
  user_id?: string
  server_rev_at?: Date
  deleted: number
  constructor(
    id?: string,
    news_id?: string,
    user_id?: string,
    server_rev_at?: Date,
    deleted: number,
  ) {
    this.id = id ?? window.crypto.randomUUID()
    if (news_id) this.news_id = news_id
    if (user_id) this.user_id = user_id
    if (server_rev_at) this.server_rev_at = server_rev_at
    this.deleted = deleted ?? 0
  }
}

export interface IUser {
  id: string
  name?: string
  email?: string
  account_id?: string
  auth_user_id?: string
  client_rev_at?: Date
  client_rev_by?: string
  server_rev_at?: Date
  deleted: number
}

export class User implements IUser {
  id: string
  name?: string
  email?: string
  account_id?: string
  auth_user_id?: string
  client_rev_at?: Date
  client_rev_by?: string
  server_rev_at?: Date
  deleted: number

  constructor(
    id?: string,
    name?: string,
    email?: string,
    account_id?: string,
    auth_user_id?: string,
    client_rev_at?: Date,
    client_rev_by?: string,
    server_rev_at?: Date,
    deleted: number,
  ) {
    this.id = id ?? window.crypto.randomUUID()
    if (name) this.name = name
    if (email) this.email = email
    if (account_id) this.account_id = account_id
    if (auth_user_id) this.auth_user_id = auth_user_id
    this.client_rev_at = new window.Date().toISOString()
    if (client_rev_by) this.client_rev_by = client_rev_by
    if (server_rev_at) this.server_rev_at = server_rev_at
    this.deleted = deleted ?? 0
  }
}

// TODO: update on every change of store
export interface IStore {
  id: string // always: 'store'
  store: Record<string, unknown>
}

export class MySubClassedDexie extends Dexie {
  accounts!: DexieTable<Account, string>
  news!: DexieTable<New, string>
  news_delivery!: DexieTable<NewsDelivery, string>
  stores!: DexieTable<IStore, string>

  constructor() {
    super('capturing')
    this.version(1).stores({
      accounts: 'id, server_rev_at, deleted',
      news: 'id, time, server_rev_at, deleted',
      news_delivery: 'id, server_rev_at, deleted',
      stores: 'id',
    })
    this.accounts.mapToClass(Account)
    this.news.mapToClass(New)
    this.news_delivery.mapToClass(NewsDelivery)
  }
}

export const dexie = new MySubClassedDexie()
