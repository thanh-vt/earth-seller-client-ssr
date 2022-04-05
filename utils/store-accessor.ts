import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import { CounterModule } from '~/store/counter.module'

// eslint-disable-next-line import/no-mutable-exports
let counterStore: CounterModule;

function initialiseStores(store: Store<any>): void {
  counterStore = getModule(CounterModule, store)
}

export { initialiseStores, counterStore }
