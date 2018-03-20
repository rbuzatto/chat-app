const expect = require('expect');

let {generateMessage} = require('./message')

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        let user = 'user';
        let userTxt = 'hi'
        let {from, text, createdAt} = generateMessage(user, userTxt);
        expect(from).toBe(user);
        expect(text).toBe(userTxt);
        expect(createdAt).toBeA('number');
    });
});