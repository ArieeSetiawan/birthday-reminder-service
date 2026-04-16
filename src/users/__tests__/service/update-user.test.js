jest.mock('../../model');

const Users = require('../../model');
const service = require('../../service');

jest.mock('../../../config/agenda', () => ({
  agenda: {
    cancel: jest.fn().mockResolvedValue(),
    schedule: jest.fn().mockResolvedValue()
  }
}));

it('should update user if exists', async () => {
  Users.findOneAndUpdate.mockResolvedValue({
    _id: '1',
    name: 'Updated',
    email: 'test@test.com',
    birthday: '1999-01-01',
    timezone: 'Asia/Jakarta'
  });

  const result = await service.updateUser('1', { name: 'Updated' });

  expect(result).toEqual({
    id: '1',
    name: 'Updated',
    email: 'test@test.com',
    birthday: '1999-01-01',
    timezone: 'Asia/Jakarta'
  });
});

it('should throw 404 if user not found', async () => {
  Users.findOneAndUpdate.mockResolvedValue(null);

  await expect(
    service.updateUser('1', { name: 'Updated' })
  ).rejects.toThrow('User Not Found');
});

it('should pass correct update payload to DB', async () => {
  Users.findOneAndUpdate.mockResolvedValue({
    _id: '1',
    name: 'Updated'
  });

  await service.updateUser('1', {
    name: 'Updated',
    timezone: 'Asia/Jakarta'
  });

  expect(Users.findOneAndUpdate).toHaveBeenCalledWith(
    {
      _id: '1',
      isDeleted: { $ne: true }
    },
    {
      $set: {
        name: 'Updated',
        timezone: 'Asia/Jakarta'
      }
    },
    { new: true }
  );
});

it('should not update deleted user', async () => {
  Users.findOneAndUpdate.mockResolvedValue(null);

  await expect(
    service.updateUser('1', { name: 'Updated' })
  ).rejects.toThrow('User Not Found');

  expect(Users.findOneAndUpdate).toHaveBeenCalledWith(
    {
      _id: '1',
      isDeleted: { $ne: true }
    },
    expect.any(Object),
    expect.any(Object)
  );
});

it('should return only selected fields', async () => {
  Users.findOneAndUpdate.mockResolvedValue({
    _id: '1',
    name: 'Arie',
    email: 'a@test.com',
    birthday: '1999-01-01',
    timezone: 'Asia/Jakarta',
    extraField: 'should not appear'
  });

  const result = await service.updateUser('1', { name: 'Arie' });

  expect(result).toEqual({
    id: '1',
    name: 'Arie',
    email: 'a@test.com',
    birthday: '1999-01-01',
    timezone: 'Asia/Jakarta'
  });

  expect(result.extraField).toBeUndefined();
});