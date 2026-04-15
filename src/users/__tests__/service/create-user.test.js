const service = require('../../service');
const Users = require('../../model');
const { HttpError } = require('../../../lib/error');

jest.mock('../../model');

describe('UserService.createUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create user when email does not exist', async () => {
    Users.findOne.mockResolvedValue(null);
    Users.create.mockResolvedValue({
      _id: '123',
      name: 'Arie',
      email: 'arie@test.com'
    });

    const result = await service.createUser({
      name: 'Arie',
      email: 'arie@test.com',
      birthday: '1999-01-01',
      timezone: 'Asia/Jakarta'
    });

    expect(Users.create).toHaveBeenCalled();
    expect(result.email).toBe('arie@test.com');
  });

  it('should throw error if email already exists', async () => {
    Users.findOne.mockResolvedValue({
      _id: '123',
      email: 'dup@test.com'
    });
    
    await expect(
      service.createUser({
        name: 'A',
        email: 'dup@test.com',
        birthday: '1999-01-01',
        timezone: 'Asia/Jakarta'
      })
    ).rejects.toThrow(HttpError);
  });
});