const { scheduleBirthday } = require('../../birthday_calculator');
const agenda = require('../../../config/agenda');

jest.mock("../../../config/agenda", () => ({
  cancel: jest.fn().mockResolvedValue(),
  schedule: jest.fn().mockResolvedValue(),
}));

describe('scheduleBirthday', () => {
  it('should schedule birthday job', async () => {
    const user = {
      _id: '123',
      birthday: new Date('1999-01-01'),
      timezone: 'Asia/Jakarta',
    };

    await scheduleBirthday(user);

    expect(agenda.cancel).toHaveBeenCalledWith({
      'data.userId': user._id,
    });

    expect(agenda.schedule).toHaveBeenCalled();
  });

  it('should not crash on invalid date', async () => {
    const user = {
      _id: '123',
      birthday: null,
      timezone: 'Asia/Jakarta',
    };

    await scheduleBirthday(user);

    expect(agenda.schedule).not.toHaveBeenCalled();
  });
});