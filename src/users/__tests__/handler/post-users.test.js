const request = require('supertest');
const app = require('../../../app');
const Users = require('../../model');

describe('POST /users', () => {
  afterEach(async () => {
    await Users.deleteMany({});
  });

  it('should create user', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'Arie',
        email: 'arie@test.com',
        birthday: '1999-01-01',
        timezone: 'Asia/Jakarta'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('arie@test.com');
  });

  it('should reject duplicate email', async () => {
    await request(app).post('/users').send({
      name: 'A',
      email: 'dup@test.com',
      birthday: '1999-01-01',
      timezone: 'Asia/Jakarta'
    });

    const res = await request(app).post('/users').send({
      name: 'B',
      email: 'dup@test.com',
      birthday: '1999-01-01',
      timezone: 'Asia/Jakarta'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email Already Exists');
  });
});