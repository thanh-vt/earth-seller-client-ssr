import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Counter from '~/store/counter'

// eslint-disable-next-line import/no-mutable-exports
let counterStore: Counter;

function initialiseStores(store: Store<any>): void {
  counterStore = getModule(Counter, store)
}

export { initialiseStores, counterStore }
