const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app');
const Users = require('../../model');

jest.mock('../../../config/agenda', () => ({
  cancel: jest.fn().mockResolvedValue(),
  schedule: jest.fn().mockResolvedValue()
}));

describe('PATCH /users/:user_id', () => {
  afterEach(async () => {
    await Users.deleteMany({});
  });

  it('should update user', async () => {
    const user = await Users.create({
      name: 'Arie',
      email: 'arie@test.com',
      birthday: '1999-01-01',
      timezone: 'Asia/Jakarta'
    });

     const id = user._id.toString()

    const res = await request(app)
      .patch(`/users/${id}`)
      .send({ name: 'Updated Name' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  it('should return 400 for invalid id', async () => {
    const res = await request(app)
      .patch('/users/invalid-id')
      .send({ name: 'Test' });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for empty body', async () => {
    const user = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/users/${user}`)
      .send();

    expect(res.statusCode).toBe(400);
  });

  it('should return 404 if user not found', async () => {
    const id = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/users/${id}`)
      .send({ name: 'Test' });

    expect(res.statusCode).toBe(404);
  });
});

describe('PATCH /users/:user_id', () => {
  it('should return 400 when updating email (not allowed field)', async () => {
    const userId = '69df0f45e932d37394b0bf000';

    const res = await request(app)
      .patch(`/users/${userId}`)
      .send({
        email: 'test@test.com'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });
});