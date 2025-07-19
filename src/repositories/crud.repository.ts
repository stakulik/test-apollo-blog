import {
  CreationAttributes,
  DataModel,
  FindConditions,
  QueryOptions,
} from './typings';
import { filterQueryOptions } from './shared';
import { CoreRepository } from './core.repository';

const _model = Symbol('data model');

export class CrudRepository extends CoreRepository {
  constructor(model: DataModel) {
    super();
    this[_model] = model;
  }

  get model() {
    return this[_model];
  }

  async create<M>(data: CreationAttributes, options: QueryOptions): Promise<M | null> {
    const queryOptions = filterQueryOptions(options);

    return this.model.create(data, queryOptions) as Promise<M | null>;
  }

  async delete(id: string, options: QueryOptions): Promise<number> {
    const queryOptions = filterQueryOptions(options);

    return this.model.destroy({ where: { id }, ...queryOptions });
  }

  async find<M>(conditions: FindConditions, options: QueryOptions): Promise<M[]> {
    const queryOptions = filterQueryOptions(options);

    return this.model.findAll({
      where: conditions,
      ...queryOptions,
    }) as Promise<M[]>;
  }

  async getByCriteria<M, T = FindConditions>(criteria: T, options: QueryOptions): Promise<M | null> {
    const queryOptions = filterQueryOptions(options);

    return this.model.findOne({ where: criteria, ...queryOptions }) as Promise<M | null>;
  }

  async getById<M>(id: string, options: QueryOptions): Promise<M | null> {
    const queryOptions = filterQueryOptions(options);

    return this.model.findByPk(id, queryOptions) as Promise<M | null>;
  }
}
