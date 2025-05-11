import { CrudRepository } from '../repositories';

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

  get repository() {
    return this[_repository];
  }

  async create(data, options = {}) {
    return this.repository.create(data, options);
  }

  async getByCriteria<T = Record<string, unknown>>(criteria: T, options = {}) {
    return this.repository.getByCriteria(criteria, options);
  }

  async getById(id, options = {}) {
    return this.repository.getById(id, options);
  }
}
