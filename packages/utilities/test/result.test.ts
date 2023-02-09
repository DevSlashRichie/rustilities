import { Err, Ok } from '../src/result';

describe('Result', () => {

  it('should create an Ok Result', () => {
    const result = Ok('test');
    expect(result.isOk()).toBe(true);
    expect(result.isErr()).toBe(false);
    expect(result.unwrap()).toBe('test');
  });

  it('should create an Err Result', () => {
    const result = Err(new Error('test'));
    expect(result.isOk()).toBe(false);
    expect(result.isErr()).toBe(true);
    expect(() => result.unwrap()).toThrowError('Called unwrap on an Err Result');
  });

  describe('unwrap', () => {

    it('should unwrap an Ok Result', () => {
      const result = Ok('test');
      expect(result.unwrap()).toBe('test');
    });

    it("should throw an error when unwrapping an Err Result", () => {
      const result = Err(new Error("test"));
      expect(() => result.unwrap()).toThrowError("Called unwrap on an Err Result");
    });

  });

  describe('unwrapOr', () => {

      it('should unwrap an Ok Result', () => {
        const result = Ok('test');
        expect(result.unwrapOr('test2')).toBe('test');
      });

      it("should return the default value when unwrapping an Err Result", () => {
        const result = Err(new Error("test"));
        expect(result.unwrapOr('test2')).toBe('test2');
      });

  });

  describe('contains', () => {

      it('returns true when the value is contained in an Ok Result', () => {
        const result = Ok('test');
        expect(result.contains('test')).toBe(true);
      });

      it('returns false when the value is not contained in an Ok Result', () => {
        const result = Ok('test');
        expect(result.contains('test2')).toBe(false);
      });

      it('returns false when unwrapping an Err Result', () => {
        const result = Err(new Error('test'));
        expect(result.contains('test')).toBe(false);
      });

  });

  describe('unwrapOr', () => {

        it('should throw an error when unwrapping an Ok Result', () => {
          const result = Ok('test');
          expect(() => result.unwrapErr()).toThrowError("Called unwrapErr on an Ok Result");
        });

        it("should unwrap an Err Result", () => {
          const result = Err(new Error("test"));
          expect(result.unwrapErr()).toBeInstanceOf(Error);
        });

  });

  describe('unwrapOrElse', () => {
        it('should unwrap an Ok Result', () => {
          const result = Ok('test');
          expect(result.unwrapOrElse((error) => error.message + '2')).toBe('test');
        });

        it("should return the default value when unwrapping an Err Result", () => {
          const result = Err(new Error("test"));
          expect(result.unwrapOrElse((error) => error.message + '2')).toBe('test2');
        });
  });

  describe('map', () => {

      it('should map an Ok Result', () => {
        const result = Ok('test');
        expect(result.map((value) => value + '2')).toEqual(Ok('test2'));
      });

      it('won\'t map an Err Result', () => {
        const result = Err(new Error('test'));
        expect(result.map((value) => value + '2')).toEqual(Err(new Error('test')));
      });

  });

  describe('mapErr', () => {

      it('won\'t map an Ok Result', () => {
        const result = Ok('test');
        expect(result.mapErr((value) => new Error(value + '2'))).toEqual(Ok('test'));
      });

      it('will map an Err Result', () => {
        const result = Err(new Error('test'));
        expect(result.mapErr((value) => new Error(value.message + '2'))).toEqual(Err(new Error('test2')));
      });

  });


});
