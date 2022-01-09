const User = require('../models/userModel');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const faker = require('faker');
chai.should();
chai.use(chaiHttp);

//Stores the docs ID to delete them all a te end by iterating throug this array
const createdDocumentID = [];

//After an user is registered, the recieved token will be stored here and used to update that user later
const createdDocumentJWT = [];

const registerTestData = {
	incompleteUsers: [
		{ lastName: faker.random.words(), email: faker.internet.email(), password: faker.random.words() },
		{ firstName: faker.random.words(), email: faker.internet.email(), password: faker.random.words() },
		{ firstName: faker.random.words(), lastName: faker.random.words(), password: faker.random.words() },
	],
	badEmailUser: {
		firstName: faker.random.words(),
		lastName: faker.random.words(),
		email: 'unittestinguser@friendsbook.com', //email already in use
		password: "Abcd'1234",
	},
	goodUser1: {
		firstName: faker.random.words(),
		lastName: faker.random.words(),
		email: faker.internet.email(),
		password: "Abcd'1234",
	},
};

const loginTestData = {
	goodUser: {
		email: 'unittestinguser@friendsbook.com',
		password: "Abcd'1234",
	},
	badPasswordUser: {
		email: 'user1@friendsbook.com',
		password: 'WRONG_PASSWORD',
	},
	badEmailUser: {
		email: 'UNEXISTING_EMAIL@friendsbook.com',
		password: "Abcd'1234",
	},
};

const UpdateTestData = {
	goodUser: {
		firstName: 'Test1Updated',
		lastName: 'User1Updated',
		email: 'updatedUser@friendsbook.com',
		password: "Abcd'1234",
		role: 'user',
	},
	badEmailUser: {
		firstName: 'dummyUser',
		email: 'unittestinguser@friendsbook.com', //email already in use
	},
};

describe('********* Users *********', () => {
	// REGISTER user
	describe('/POST register user', () => {
		registerTestData.incompleteUsers.map((user) => {
			it('it should NOT POST an user with missing data', (done) => {
				chai.request(server)
					.post('/api/users/register')
					.send(user)
					.end((err, res) => {
						res.should.have.status(403);
						res.body.should.be.an('object');
						res.body.should.have.property('errors');
						done();
					});
			});
		});

		it('it should NOT POST an user with an email already in the Data Base', (done) => {
			chai.request(server)
				.post('/api/users/register')
				.send(registerTestData.badEmailUser)
				.end((err, res) => {
					res.should.have.status(403);
					res.body.should.be.an('object');
					res.body.should.have.property('errors');
					done();
				});
		});

		it('it should POST an user ', (done) => {
			chai.request(server)
				.post('/api/users/register')
				.send(registerTestData.goodUser1)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.an('object');
					res.body.should.include.keys('_id', 'firstName', 'lastName', 'email', 'token');
					createdDocumentID.push(res.body._id);
					createdDocumentJWT.push(res.body.token);
					done();
				});
		});
	});

	//LOGIN
	describe('/POST login', () => {
		it('it should GET a token for the user', (done) => {
			chai.request(server)
				.post('/api/users/login')
				.send(loginTestData.goodUser)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.an('object');
					res.body.should.have.property('token');
					loginTestData.goodUser.token = res.body.token;
					done();
				});
		});

		it('it should reject the login because of a bad password', (done) => {
			chai.request(server)
				.post('/api/users/login')
				.send(loginTestData.badPasswordUser)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});

		it('it should reject the login because of an unexisting email', (done) => {
			chai.request(server)
				.post('/api/users/login')
				.send(loginTestData.badEmailUser)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});
	});

	// ***UPDATE user***
	describe('POST update user', () => {
		it('it should UPDATE an user given the JWT', (done) => {
			const goodToken = createdDocumentJWT.slice(-1).pop();
			chai.request(server)
				.post('/api/users/profile')
				.set('Authorization', `Bearer ${goodToken}`)
				.send(UpdateTestData.goodUser)
				.end((error, res) => {
					res.should.have.status(200);
					res.body.should.be.an('object');
					res.body.should.have.property('token');
					res.body.should.include.keys('_id', 'email');
					createdDocumentJWT.push(res.body.token);
					done();
				});
		});

		it('it should NOT UPDATE an user with an invalid JWT', (done) => {
			const badToken = 'Definitely.Not.A.Good.JWT';
			chai.request(server)
				.post('/api/users/profile')
				.set('Authorization', `${badToken}`)
				.send(UpdateTestData.goodUser)
				.end((error, res) => {
					res.should.have.status(401);
					done();
				});
		});

		it('it should NOT UPDATE the user email with an email already in use by another user', (done) => {
			const goodToken = createdDocumentJWT.slice(-1); //No .pop() because this one will fail and wont recieve a new token
			chai.request(server)
				.post('/api/users/profile')
				.set('Authorization', `Bearer ${goodToken}`)
				.send(UpdateTestData.badEmailUser)
				.end((error, res) => {
					res.should.have.status(403);
					res.body.should.be.an('object');
					res.body.should.have.property('errors');
					done();
				});
		});
	});

	describe('DELETE  user', () => {
		it('it should NOT DELETE an user with an invalid JWT', (done) => {
			const badToken = 'Definitely.Not.A.Good.JWT';
			chai.request(server)
				.delete('/api/users/delete')
				.set('Authorization', `Bearer ${badToken}`)
				.end((error, res) => {
					res.should.have.status(401);
					done();
				});
		});

		it('it should DELETE the user given its JWT', (done) => {
			const goodToken = createdDocumentJWT.slice(-1).pop();
			chai.request(server)
				.delete('/api/users/delete')
				.set('Authorization', `Bearer ${goodToken}`)
				.end((error, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});

	// Clean Up
	after(() => {
		createdDocumentID.forEach((id) => {
			User.findByIdAndRemove(id, (err) => {
				if (err) {
					console.log(err);
				}
			});
		});
	});
});
