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
