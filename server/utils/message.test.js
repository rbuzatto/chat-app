const expect = require('expect');

let {generateMessage, generateLocationMessage} = require('./message')

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

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        // from property is correct; createdAt is a number; url property is what you expect given the input 
        let fromValue = 'user1';
        let coordValue = {lat: 50, lng: -20};
        let {from, url, createdAt} = generateLocationMessage(fromValue, coordValue.lat, coordValue.lng);
        expect(from).toBe(fromValue);
        expect(createdAt).toBeA('number');
        expect(url).toBe(`https://www.google.com/maps?q=${coordValue.lat},${coordValue.lng}`);
    });
});