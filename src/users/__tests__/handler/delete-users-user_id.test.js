const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app');
const Users = require('../../model');

describe('DELETE /users/:user_id', () => {
  afterEach(async () => {
    await Users.deleteMany({});
  });

  it('should delete user', async () => {
    const user = await Users.create({
      name: 'Arie',
      email: 'arie@test.com',
      birthday: '1999-01-01',
      timezone: 'Asia/Jakarta'
    });

    const id = user._id.toString()

    const res = await request(app)
      .delete(`/users/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('User deleted successfully');
  });

  it('should return 400 for invalid id', async () => {
    const res = await request(app)
      .delete('/users/invalid-id');

    expect(res.statusCode).toBe(400);
  });

  it('should return 404 if user not found', async () => {
    const id = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/users/${id}`);

    expect(res.statusCode).toBe(404);
  });
});