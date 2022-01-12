const Room = require('../models/roomModel');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const faker = require('faker');
chai.should();
chai.use(chaiHttp);

//Stores the docs ID to delete them all a te end by iterating throug this array
const createdDocumentID = [];

const createTestData = {
	goodRoom: {
		name: faker.random.words(),
		images: [
			'https://res.cloudinary.com/dypchsfgk/image/upload/v1641767091/Hotel/rooms/studioroom_luywjo.jpg',
			'https://res.cloudinary.com/dypchsfgk/image/upload/v1641767091/Hotel/rooms/studioroom_luywjo.jpg',
		],
		description: faker.random.words(),
		price: faker.datatype.number(),
		details: [
			{
				room_details_icon: 'https://res.cloudinary.com/dypchsfgk/image/upload/v1641768186/Hotel/details/details-person-dark_rhv9l3.svg',
				room_details_description: faker.random.words(),
			},
		],
		amenities: [
			{
				room_amenities_icon: 'https://res.cloudinary.com/dypchsfgk/image/upload/v1641763616/Hotel/amenities_icons/wifi_qz8mip.svg',
				room_amenities_description: faker.random.words(),
			},
		],
	},
	badNameRoom: {
		name: 'Unit Testing Room', //already exists
		images: [
			'https://res.cloudinary.com/dypchsfgk/image/upload/v1641767091/Hotel/rooms/studioroom_luywjo.jpg',
			'https://res.cloudinary.com/dypchsfgk/image/upload/v1641767091/Hotel/rooms/studioroom_luywjo.jpg',
		],
		description: faker.random.words(),
		price: faker.datatype.number(),
		details: [
			{
				room_details_icon: 'https://res.cloudinary.com/dypchsfgk/image/upload/v1641768186/Hotel/details/details-person-dark_rhv9l3.svg',
				room_details_description: faker.random.words(),
			},
		],
		amenities: [
			{
				room_amenities_icon: 'https://res.cloudinary.com/dypchsfgk/image/upload/v1641763616/Hotel/amenities_icons/wifi_qz8mip.svg',
				room_amenities_description: faker.random.words(),
			},
		],
	},
	incompleteRooms: [
		{
			// name: faker.random.words(),
			images: [
				'https://res.cloudinary.com/dypchsfgk/image/upload/v1641767091/Hotel/rooms/studioroom_luywjo.jpg',
				'https://res.cloudinary.com/dypchsfgk/image/upload/v1641767091/Hotel/rooms/studioroom_luywjo.jpg',
			],
			description: faker.random.words(),
			price: faker.datatype.number(),
			details: [
				{
					room_details_icon: 'https://res.cloudinary.com/dypchsfgk/image/upload/v1641768186/Hotel/details/details-person-dark_rhv9l3.svg',
					room_details_description: faker.random.words(),
				},
			],
			amenities: [
				{
					room_amenities_icon: 'https://res.cloudinary.com/dypchsfgk/image/upload/v1641763616/Hotel/amenities_icons/wifi_qz8mip.svg',
					room_amenities_description: faker.random.words(),
				},
			],
		},
		{
			name: faker.random.words(),
			// images: [
			// 	'https://res.cloudinary.com/dypchsfgk/image/upload/v1641767091/Hotel/rooms/studioroom_luywjo.jpg',
			// 	'https://res.cloudinary.com/dypchsfgk/image/upload/v1641767091/Hotel/rooms/studioroom_luywjo.jpg',
			// ],
			description: faker.random.words(),
			price: faker.datatype.number(),
			details: [
				{
					room_details_icon: 'https://res.cloudinary.com/dypchsfgk/image/upload/v1641768186/Hotel/details/details-person-dark_rhv9l3.svg',
					room_details_description: faker.random.words(),
				},
			],
			amenities: [
				{
					room_amenities_icon: 'https://res.cloudinary.com/dypchsfgk/image/upload/v1641763616/Hotel/amenities_icons/wifi_qz8mip.svg',
					room_amenities_description: faker.random.words(),
				},
			],
		},
		{
			name: faker.random.words(),
			images: [
				'https://res.cloudinary.com/dypchsfgk/image/upload/v1641767091/Hotel/rooms/studioroom_luywjo.jpg',
				'https://res.cloudinary.com/dypchsfgk/image/upload/v1641767091/Hotel/rooms/studioroom_luywjo.jpg',
			],
			//description: faker.random.words(),
			price: faker.datatype.number(),
			details: [
				{
					room_details_icon: 'https://res.cloudinary.com/dypchsfgk/image/upload/v1641768186/Hotel/details/details-person-dark_rhv9l3.svg',
					room_details_description: faker.random.words(),
				},
			],
			amenities: [
				{
					room_amenities_icon: 'https://res.cloudinary.com/dypchsfgk/image/upload/v1641763616/Hotel/amenities_icons/wifi_qz8mip.svg',
					room_amenities_description: faker.random.words(),
				},
			],
		},
		{
			name: faker.random.words(),
			images: [
				'https://res.cloudinary.com/dypchsfgk/image/upload/v1641767091/Hotel/rooms/studioroom_luywjo.jpg',
				'https://res.cloudinary.com/dypchsfgk/image/upload/v1641767091/Hotel/rooms/studioroom_luywjo.jpg',
			],
			description: faker.random.words(),
			price: faker.datatype.number(),
			// details: [
			// 	{
			// 		room_details_icon: 'https://res.cloudinary.com/dypchsfgk/image/upload/v1641768186/Hotel/details/details-person-dark_rhv9l3.svg',
			// 		room_details_description: faker.random.words(),
			// 	},
			// ],
			amenities: [
				{
					room_amenities_icon: 'https://res.cloudinary.com/dypchsfgk/image/upload/v1641763616/Hotel/amenities_icons/wifi_qz8mip.svg',
					room_amenities_description: faker.random.words(),
				},
			],
		},
		{
			name: faker.random.words(),
			images: [
				'https://res.cloudinary.com/dypchsfgk/image/upload/v1641767091/Hotel/rooms/studioroom_luywjo.jpg',
				'https://res.cloudinary.com/dypchsfgk/image/upload/v1641767091/Hotel/rooms/studioroom_luywjo.jpg',
			],
			description: faker.random.words(),
			price: faker.datatype.number(),
			details: [
				{
					room_details_icon: 'https://res.cloudinary.com/dypchsfgk/image/upload/v1641768186/Hotel/details/details-person-dark_rhv9l3.svg',
					room_details_description: faker.random.words(),
				},
			],
			// amenities: [
			// 	{
			// 		room_amenities_icon: 'https://res.cloudinary.com/dypchsfgk/image/upload/v1641763616/Hotel/amenities_icons/wifi_qz8mip.svg',
			// 		room_amenities_description: faker.random.words(),
			// 	},
			// ],
		},
	],
};

describe('*Rooms*', () => {
	// CREATE ROOM
	it('it should POST a room', (done) => {
		chai.request(server)
			.post('/api/rooms/create')
			.send(createTestData.goodRoom)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.an('object');
				res.body.should.include.keys('_id');
				createdDocumentID.push(res.body._id);
				done();
			});
	});

	createTestData.incompleteRooms.map((room) => {
		it('it should NOT POST a room with missing data', (done) => {
			chai.request(server)
				.post('/api/rooms/create')
				.send(room)
				.end((err, res) => {
					res.should.have.status(403);
					res.body.should.be.an('object');
					res.body.should.have.property('errors');
					done();
				});
		});
	});

	it('it should NOT POST a room with a name already asigned to another room', (done) => {
		chai.request(server)
			.post('/api/rooms/create')
			.send(createTestData.badNameRoom)
			.end((err, res) => {
				res.should.have.status(403);
				res.body.should.be.an('object');
				res.body.should.have.property('errors');
				done();
			});
	});

	//GET ROOM
	it('it should GET a room', (done) => {
		const id = createdDocumentID.slice(-1).pop();
		chai.request(server)
			.get(`/api/rooms/${id}`)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				res.body.should.have.property('_id').eql(id);
				done();
			});
	});

	// Clean Up
	after(() => {
		createdDocumentID.forEach((id) => {
			Room.findByIdAndRemove(id, (err) => {
				if (err) {
					console.error(err);
				}
			});
		});
	});
});
