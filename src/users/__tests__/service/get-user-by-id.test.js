jest.mock('../../model');
const service = require('../../service');
const Users = require('../../model');
const { HttpError } = require('../../../lib/error');


describe('UserService.getUserById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user if found', async () => {
    Users.findOne.mockResolvedValue({
        _id: '123',
        name: 'Arie',
        email: 'arie@test.com',
        birthday: new Date(),
        timezone: 'Asia/Jakarta'
    });

    const result = await service.getUserById('123');

    expect(Users.findOne).toHaveBeenCalledWith({
        _id: '123',
        isDeleted: { $ne: true }
    });
    expect(result.email).toBe('arie@test.com');
  });

  it('should throw 404 if user not found', async () => {
    Users.findOne.mockResolvedValue(null);

    await expect(service.getUserById('69df0f45e932d37394b0bf000'))
      .rejects
      .toThrow(HttpError);
  });
});