import { observable, when } from '@legendapp/state'
import {
  persistObservable,
  configureObservablePersistence,
} from '@legendapp/state/persist'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'

configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage,
})

export const state$ = observable({
  showTree: true,
  showForm: true,
  showMap: false,
  mapInitiated: false,
  notifications: {},
  addNotification: (valPassed) => {
    const val = {
      // set default values
      id: window.crypto.randomUUID(),
      time: Date.now(),
      duration: 10000, // standard value: 10000
      dismissable: true,
      allDismissable: true,
      type: 'error',
      // overwrite with passed in values:
      ...valPassed,
    }
    state$.notifications.assign(val.id, val)
    // remove after duration
    setTimeout(() => {
      const notifs = state$.notifications.get()
      delete notifs[val.id]
      state$.notifications.set(notifs)
    }, val.duration)
    return val.id
  },
  removeNotificationById: (id: string): void => {
    const notifs = state$.notifications.get()
    delete notifs[id]
    state$.notifications.set(notifs)
  },
  user: {
    // TODO: set undefined when implementing auth
    role: 'account_manager',
    // TODO: set undefined when implementing auth
    email: 'alex@gabriel-software.ch',
  },
})

window.state = state$

state$.showMap.onChange(() => state$.mapInitiated.set(true))

const status = persistObservable(state$, {
  local: 'state',
})
// reset some values
await when(status.isLoadedLocal)
state$.mapInitiated.set(false)
state$.notifications.set({})
