const express = require('express');
const massive = require('massive');
const users = require('./controllers/users.js');
const post = require('./controllers/post.js')

massive({
	host: 'localhost',
	port: 5432,
	database: 'node3',
	user: 'postgres',
	password: 'node3db',
}).then(db => {
	const app = express();

	app.set('db', db);

	app.use(express.json());

	app.post('/api/users', users.create);
	app.get('/api/users', users.list);
	app.get('/api/users/:id', users.getById)
	app.get('/api/users/:id/profile', users.getProfile)
	app.post('/api/posts', post.createPost)
	app.get('/api/posts/:id', post.fetchSinglePost)
	app.post('/api/comments', post.createComment)
	app.get('/api/fetch/posts/:userId', post.fetchAllPosts)

	app.get('/debug', (req, res) => {
		res.status(200).json(req.app.get('db'))
	});


	const PORT = 3001;

	app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
	});

})



