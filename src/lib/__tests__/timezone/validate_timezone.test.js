const { validateTimezone } = require("../../timezone");
const { IANAZone } = require("luxon");

jest.mock("luxon", () => ({
  IANAZone: {
    isValidZone: jest.fn(),
  },
}));

describe("validateTimezone", () => {
  let helpers;

  beforeEach(() => {
    helpers = {
      error: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return value when timezone is valid", () => {
    const value = "Asia/Jakarta";

    IANAZone.isValidZone.mockReturnValue(true);

    const result = validateTimezone(value, helpers);

    expect(result).toBe(value);
    expect(helpers.error).not.toHaveBeenCalled();
  });

  it("should call helpers.error when timezone is invalid", () => {
    const value = "Invalid/Timezone";

    IANAZone.isValidZone.mockReturnValue(false);

    validateTimezone(value, helpers);

    expect(helpers.error).toHaveBeenCalledWith("any.invalid");
  });
});