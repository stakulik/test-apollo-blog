import {
  CreationAttributes,
  CrudRepository,
  FindConditions,
  QueryOptions,
} from '../repositories';

import { CoreService } from './core.service';

const _modelName = Symbol('model name');
const _repository = Symbol('repository');

export class CrudService extends CoreService {
  constructor(repository: InstanceType<typeof CrudRepository>) {
    const { model } = repository;

    super(model);
    this[_modelName] = model;
    this[_repository] = repository;
  }

  get modelName() {
    return this[_modelName];
  }

  get repository(): InstanceType<typeof CrudRepository> {
    return this[_repository];
  }

  async create<M>(data: CreationAttributes, options: QueryOptions = {}): Promise<M | null> {
    return this.repository.create(data, options);
  }

  async delete(id: string, options: QueryOptions = {}): Promise<number> {
    return this.repository.delete(id, options);
  }

  async find<M>(conditions: FindConditions, options: QueryOptions = {}): Promise<M[]> {
    return this.repository.find(conditions, options);
  }

  async getByCriteria<M, T = Record<string, unknown>>(criteria: T, options: QueryOptions = {}): Promise<M | null> {
    return this.repository.getByCriteria(criteria, options);
  }

  async getById<M>(id: string, options: QueryOptions = {}): Promise<M | null> {
    return this.repository.getById(id, options);
  }
}
