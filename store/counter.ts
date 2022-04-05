import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'

@Module({
  name: 'counter',
  stateFactory: true,
  namespaced: true,
})
export default class Counter extends VuexModule {
  value = 0;

  @Mutation
  increment(value: number) {
    this.value += value;
  }

  @Mutation
  decrement(value: number) {
    this.value -= value;
  }

  @Action({commit: 'increment'})
  increaseValue() {
    return 5;
  }

  @Action({commit: 'decrement'})
  decreaseValue() {
    return 5;
  }

  get getCounter(): number {
    return this.value * 2
  }
}

