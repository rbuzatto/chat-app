const expect = require('expect');
const {isRealString} = require('./validation');
// import is RealString
//isRealString
    // should reject non-string values
    // should reject string with only spaces
    // should allow string with non-space characters

describe('isRealString', () => {
    it('should reject non-string values', () => {
        let str = 123;
        expect(isRealString(str)).toBeFalsy();
    });

    it('should reject string with only spaces', () => {
        let str = '  ';
        expect(isRealString(str)).toBeFalsy();
    });

    it('should allow string with non-space characters', () => {
        let str = 'user 123';
        expect(isRealString(str)).toBeTruthy();
    });
});