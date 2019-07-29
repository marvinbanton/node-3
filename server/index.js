const express = require('express');
const massive = require('massive');
const users = require('./controllers/users.js');
const post = require('./controllers/post.js')
const jwt = require('jsonwebtoken');
const secret = require('../secret');

massive({
	host: 'localhost',
	port: 5432,
	database: 'node3',
	user: 'postgres',
	password: 'node3db',
}).then(db => {
	const app = express();

	app.set('db', db);

	var authenticate = function (req, res, next) {
		if (req._parsedUrl.pathname === '/api/users') return next();
		if (!req.headers.authorization) {
			return res.status(401).end();
		}

		try {
			const token = req.headers.authorization.split(' ')[1];
			jwt.verify(token, secret);
			next();
		} catch (err) {
			console.error(err);
			res.status(401).end();
		}
	};

	app.use(authenticate);
	app.use(express.json());

	app.post('/api/users', users.create);
	app.get('/api/users', users.list);
	app.get('/api/users/:id', users.getById)
	app.get('/api/users/:id/profile', users.getProfile)
	app.post('/api/posts', post.createPost)
	app.get('/api/posts/:id', post.fetchSinglePost)
	app.post('/api/comments', post.createComment)
	app.get('/api/fetch/posts/:userId', post.fetchAllPosts)
	app.patch('/api/update/:postId', post.updatePost)
	app.patch('/api/edit/:commentId', post.editComment)

	app.get('/debug', (req, res) => {
		res.status(200).json(req.app.get('db'))
	});


	const PORT = 3001;

	app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
	});

})



