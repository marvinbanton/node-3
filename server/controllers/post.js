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

    fetchSinglePost: (req, res) => {
        const db = req.app.get('db')

        db.posts
            .findOne({
                id: req.params.id,
            })
            .then(post => db.comments
                .find({
                    postId: req.params.id,
                })
                .then(comment => {
                    const postComment = Object.assign({
                        post,
                        comments: [
                            comment
                        ]
                    });
                    res.status(200).send(postComment)
                }))
            .catch(err => {
                console.log(err);
                res.status(500).end();
            })
    },

    createComment: (req, res) => {
        const db = req.app.get('db')
        const { userId, postId, comment } = req.body


        db.comments
            .insert({
                userId,
                postId,
                comment
            })
            .then(comment => res.status(200).send(comment))
            .catch(err => {
                console.log(err)
                res.status(500).end();
            })

    },


    fetchAllPosts: (req, res) => {
        const db = req.app.get('db')

        db.posts
            .find({
                userId: req.params.userId
            })
            .then(post => res.status(200).send(post))
            .catch(err => {
                console.log(err)
                res.status(500).end();
            })
    },


    updatePost: (req, res) => {
        const db = req.app.get('db')
        const { userId, content } = req.body
        const { postId } = req.params

        db.posts
            .update(
                {

                    'userId': userId,
                    'id': postId
                },
                {
                    'content': content
                })
            .then(post => res.status(200).send(post))
            .catch(err => {
                console.log(err)
                res.status(500).end();
            })
    },


    editComment: (req, res) => {
        const db = req.app.get('db')
        const { userId, comment } = req.body
        const { commentId } = req.params

        db.comments
            .update(
                {
                    'id': commentId,
                    'userId': userId
                },
                {
                    'comment': comment
                })
            .then(comment => res.status(200).send(comment))
            .catch(err => {
                console.log(err)
                res.status(500).end();
            })

    }






}