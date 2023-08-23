import { observable, when } from '@legendapp/state'
import {
  persistObservable,
  configureObservablePersistence,
} from '@legendapp/state/persist'
import { ObservablePersistIndexedDB } from '@legendapp/state/persist-plugins/indexeddb'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'

configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage,
  // persistLocalOptions: {
  //   indexedDB: {
  //     databaseName: 'state',
  //     version: 1,
  //     tableNames: ['state'],
  //   },
  // },
})

export const state$ = observable({
  showTree: true,
  showForm: true,
  showMap: false,
  mapInitiated: false,
})

window.state = state$

state$.showMap.onChange(() => state$.mapInitiated.set(true))

const status = persistObservable(state$, {
  local: 'state',
})
await when(status.isLoadedLocal)
state$.mapInitiated.set(false)
state$.notifications.set({})
state$.session.set(undefined)
state$.sessionCounter.set(0)
console.log('state loaded from local storage:', state$)
