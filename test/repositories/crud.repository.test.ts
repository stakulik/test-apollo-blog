import { expect } from 'chai';
import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';

import { Post, User } from '../../src/models';
import { sequelize } from '../../src/db';
import { PostRepository } from '../../src/repositories';
import { omitCommonAttributes } from '../utils/common';
import { getClockTimestamp } from '../utils/datetime';

describe(__filename, () => {
  let postRepository;
  let user;

  beforeEach(async () => {
    postRepository = new PostRepository();
    user = await factory.create<User>('User');
  });

  describe('#create', () => {
    const runTest = async (data, options = {}) => postRepository.create(data, options);

    it('should create instance', async () => {
      const creationAttributes = await factory.attrs('Post', {
        user_id: user.id,
      });

      const startTime = await getClockTimestamp(sequelize);
      const result = await runTest(creationAttributes);
      const finishTime = await getClockTimestamp(sequelize);

      expect(
        omitCommonAttributes(result.toJSON(), ['published_at'],)).to.eql({
          ...omitCommonAttributes(creationAttributes, ['published_at']),
        });
      expect(result.created_at).to.be.within(startTime, finishTime);
      expect(result.published_at).to.be.within(startTime, finishTime);
    });
  });

  describe('#find', () => {
    beforeEach(async () => {
      await factory.create<Post>('Post');
    });

    const runTest = async (conditions, options = {}) => postRepository.find(conditions, options);

    it('should return instances', async () => {
      const title = faker.lorem.word();
      const post1 = await factory.create<Post>('Post', {
        title,
        user_id: user.id,
      });
      const post2 = await factory.create<Post>('Post', {
        title,
        user_id: user.id,
      });

      const result = await runTest({ title });

      expect(result.map((item) => item.id)).to.eql([
        post1.id,
        post2.id,
      ]);
    });

    context('when found nothing', () => {
      it('should return empty array', async () => {
        const result = await runTest({ title: faker.lorem.sentence() });

        expect(result).to.eql([]);
      });
    });
  });

  describe('#getByCriteria', () => {
    beforeEach(async () => {
      await factory.create<Post>('Post');
    });

    const runTest = async (criteria, options = {}) => postRepository.getByCriteria(criteria, options);

    it('should return instance', async () => {
      const post = await factory.create<Post>('Post', {
        title: faker.lorem.sentence(),
      });

      const result = await runTest({ title: post.title });

      expect(result.toJSON()).to.eql(post.toJSON());
    });

    context('when found nothing', () => {
      it('should return null', async () => {
        const result = await runTest({ title: faker.lorem.sentence() });

        expect(result).to.be.null;
      });
    });
  });

  describe('#getById', () => {
    const runTest = async (id, options = {}) => postRepository.getById(id, options);

    it('should return instance', async () => {
      const post = await factory.create<Post>('Post');

      const result = await runTest(post.id);

      expect(result.toJSON()).to.eql(post.toJSON());
    });

    context('when found nothing', () => {
      it('should return null', async () => {
        const result = await runTest(faker.string.uuid());

        expect(result).to.be.null;
      });
    });
  });
});
