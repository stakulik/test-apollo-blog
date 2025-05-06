const _scope = Symbol('domain scope');

export class CoreService {
  constructor(scope: string) {
    this[_scope] = scope;
  }

  get scope() {
    return this[_scope];
  }
}
