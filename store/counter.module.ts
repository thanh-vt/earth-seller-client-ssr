import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'

@Module({
  name: 'CounterModule',
  stateFactory: true,
  namespaced: true
})
export class CounterModule extends VuexModule {
  value = 0;

  @Mutation
  increment() {
    this.value++;
  }

  @Mutation
  decrement() {
    this.value--;
  }

  @Action
  increaseValue() {
    this.increment();
  }

  @Action
  decreaseValue() {
    this.decrement();
  }

  get getCounter(): number {
    return this.value * 2
  }
}

