module.exports = {
    createPost: (req, res) => {
        const db = req.app.get('db')
        const { userId, content } = req.body

        db.posts
            .insert({
                userId,
                content,
            },
                {
                    deepInsert: true,
                }
            )
            .then(post => res.status(200).send(post))
            .catch(err => {
                console.log(err);
                res.status(500).end();
            })
    },
}