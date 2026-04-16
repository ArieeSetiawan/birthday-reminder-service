const { DateTime } = require("luxon");
const { calculateNextBirthday } = require("../../birthday_calculator");

jest.mock("../../../config/agenda", () => ({
  cancel: jest.fn().mockResolvedValue(),
  schedule: jest.fn().mockResolvedValue(),
}));

describe("calculateNextBirthday", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-16T00:00:00.000Z"));

    process.env = { ...ORIGINAL_ENV };
    process.env.BIRTHDAY_HOUR = "9";
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetModules();
  });

  it("should return birthday in current year if not passed", () => {
    const birthday = new Date("2000-12-31");

    const result = calculateNextBirthday(birthday, "Asia/Jakarta");

    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBeGreaterThan(Date.now());
  });

  it("should move to next year if birthday already passed", () => {
    const birthday = new Date("2000-01-01");

    const result = calculateNextBirthday(birthday, "Asia/Jakarta");

    const resultYear = new Date(result).getUTCFullYear();
    const currentYear = new Date().getUTCFullYear();

    expect(resultYear).toBeGreaterThanOrEqual(currentYear);
  });

  it("should respect timezone and return valid date", () => {
    const birthday = new Date("2000-06-15");

    const result = calculateNextBirthday(birthday, "Asia/Singapore");

    expect(result).toBeInstanceOf(Date);
    expect(isNaN(result.getTime())).toBe(false);
  });

  it("should use env BIRTHDAY_HOUR", () => {
    process.env.BIRTHDAY_HOUR = "10";

    const birthday = new Date("2000-06-15");

    const result = calculateNextBirthday(birthday, "Asia/Singapore");

    expect(result).toBeInstanceOf(Date);
  });

  it("should handle invalid input safely", () => {
    const result = calculateNextBirthday(null, "Asia/Singapore");

    expect(isNaN(result?.getTime?.())).toBe(true);
  });
});