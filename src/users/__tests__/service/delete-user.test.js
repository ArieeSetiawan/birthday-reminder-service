jest.mock('../../model');
const service = require('../../service');
const Users = require('../../model');
const { HttpError } = require('../../../lib/error');

jest.mock('../../../config/agenda', () => ({
  cancel: jest.fn().mockResolvedValue(),
  schedule: jest.fn().mockResolvedValue()
}));

describe('UserService.deleteUser', () => {
  afterEach(() => jest.clearAllMocks());

  it('should soft delete user', async () => {
    Users.findOneAndUpdate.mockResolvedValue({
      _id: '69df0f45e932d37394b0bf000',
      isDeleted: true
    });

    const result = await service.deleteUser('69df0f45e932d37394b0bf000');

    expect(Users.findOneAndUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: '69df0f45e932d37394b0bf000'
      }),
      expect.any(Object),
      expect.any(Object)
    );

    expect(result.message).toContain('User deleted successfully');
  });

  it('should throw 404 if user not found', async () => {
    Users.findOneAndUpdate.mockResolvedValue(null);

    await expect(service.deleteUser('69df0f45e932d37394b0bf000'))
      .rejects
      .toThrow(HttpError);
  });
});