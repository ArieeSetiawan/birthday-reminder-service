const { HttpError } = require('../../error');

describe('HttpError', () => {
  test('should create error with default 500 code when no code provided', () => {
    const err = new HttpError();

    expect(err.code).toBe(500);
    expect(err.message).toBe('Internal server error');
    expect(err.meta).toEqual({});
    expect(err instanceof Error).toBe(true);
  });

  test('should set default message for 400', () => {
    const err = new HttpError(400);

    expect(err.code).toBe(400);
    expect(err.message).toBe('Bad request');
  });

  test('should set default message for 401', () => {
    const err = new HttpError(401);

    expect(err.message).toBe('Unauthorized');
  });

  test('should set default message for 403', () => {
    const err = new HttpError(403);

    expect(err.message).toBe('Forbidden');
  });

  test('should set default message for 404', () => {
    const err = new HttpError(404);

    expect(err.message).toBe('Not found');
  });

  test('should set default message for 500', () => {
    const err = new HttpError(500);

    expect(err.message).toBe('Internal server error');
  });

  test('should override default message when custom message is provided', () => {
    const err = new HttpError(400, 'Invalid payload');

    expect(err.message).toBe('Invalid payload');
    expect(err.code).toBe(400);
  });

  test('should store meta object correctly', () => {
    const meta = { field: 'email', reason: 'invalid format' };

    const err = new HttpError(400, 'Bad request', meta);

    expect(err.meta).toEqual(meta);
  });

  test('should capture stack trace (basic check)', () => {
    const err = new HttpError(500);

    expect(err.stack).toBeDefined();
    expect(typeof err.stack).toBe('string');
  });
});