import { filterQueryOptions } from './shared';
import { CoreRepository } from './core.repository';

const _model = Symbol('data model');

export class CrudRepository extends CoreRepository {
  constructor(model) {
    super();
    this[_model] = model;
  }

  get model() {
    return this[_model];
  }

  async create(data, options) {
    const queryOptions = filterQueryOptions(options);

    return this.model.create(data, queryOptions);
  }

  async getByCriteria<T = Record<string, unknown>>(criteria: T, options) {
    const queryOptions = filterQueryOptions(options);

    return this.model.findOne({ where: criteria, ...queryOptions });
  }

  async getById(id, options) {
    const queryOptions = filterQueryOptions(options);

    return this.model.findByPk(id, queryOptions);
  }
}
