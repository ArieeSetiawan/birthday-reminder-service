const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app');
const Users = require('../../model');

jest.mock('../../../config/agenda', () => ({
  agenda: {
    cancel: jest.fn().mockResolvedValue(),
    schedule: jest.fn().mockResolvedValue()
  }
}));

describe('GET /users/:user_id', () => {
  afterEach(async () => {
    await Users.deleteMany({});
  });

  it('should return user by id', async () => {
    const created = await Users.create({
      name: 'Arie',
      email: 'arie@test.com',
      birthday: '1999-01-01',
      timezone: 'Asia/Jakarta'
    });

    const id = created._id.toString()

    const res = await request(app).get(`/users/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('arie@test.com');
  });

  it('should return 400 for invalid id', async () => {
    const res = await request(app).get('/users/invalid-id');

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid User ID');
  });

  it('should return 404 if user not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app).get(`/users/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('User Not Found');
  });
});