const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '123',
            name: 'Rafa',
            room: 'Oasis Room'
        }, {
            id: '523',
            name: 'Nuna',
            room: 'Oasis Room'
        }, {
            id: '923',
            name: 'Fefe',
            room: 'Pes Room'
        }];
    });

    it('should add new user', () => {
        let users = new Users();
        let user = {
            id: '123',
            name: 'Rafa',
            room: 'Oasis Room'
        };
        let resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        let userId = '123';
        let user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', () => {
        let userId = '999';
        let user = users.removeUser(userId);

        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should find user', () => {
        let userId = '123';
        let user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it('should not find user', () => {
        let userId = '8823';
        let user = users.getUser(userId);

        expect(user).toNotExist();
    });

    it('should return names for Oasis Room', () => {
        let userList = users.getUserList('Oasis Room');

        expect(userList).toEqual(['Rafa', 'Nuna']);
    });
});