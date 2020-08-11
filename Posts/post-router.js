const express = require("express")
const router = express.Router()
const posts = require("../data/db")

router.get("/", (req, res) => {
	res.json({
		message: "Welcome to our API",
	})
})

router.get("/api/posts", (req, res) => {
	posts.find()
		.then((posts) => {
			res.status(200).json(posts)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				error: "The posts information could not be retrieved.",
			})
		})
})

router.get("/api/posts/:id", (req, res) => {
    posts.findById(req.params.id)
        .then((posts) => {
            res.status(200).json(posts)
        })
        .catch((error) => {
            console.log(error)
			res.status(500).json({
				message: "The post with the specified ID does not exist.",
			})
        })
})

router.get("/api/posts/:id/comments", (req, res) => {
    posts.findPostComments(req.params.id)
        .then((comments) => {
            res.status(200).json(comments)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "The comments information could not be retrieved."
            })
        })
})

router.post("/api/posts", (req,res) => {
    if (!req.body.title || !req.body.contents) {
		return res.status(400).json({
		 errorMessage: "Please provide title and contents for the post.",
		})
	}

	posts.insert(req.body)
		.then((post) => {
			res.status(201).json(post)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error adding new post",
			})
		})
})


router.post('/api/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    const comment = {...req.body, post_id: req.params.id };
    if (!req.params.id) {
        res.status(404).json({  message: "The post with the specified ID does not exist." });
    } else if (!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment."  });
    } else {
        posts.insertComment(comment)
            .then(comment => {
                res.status(201).json(comment);
            })
            .catch(error => {
                console.log('Error: ', error);
                res.status(500).json({
                    error: "There was an error while saving the comment to the database"
                });
            });
    }
});

router.put("/api/posts/:id", (req, res) => {
    posts.update(req.params.id, req.body)
        .then((post) => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({
					message: "The post with the specified ID does not exist.",
				})
            }
        })
        .catch(error => {
            console.log('Error: ', error);
            res.status(500).json({
                error: "The post information could not be modified."
            });
        });
})

router.delete("/api/posts/:id", (req, res) => {
    posts.remove(req.params.id)
    .then((count) => {
            if (count > 0) {
                res.status(200).json({
                    message: "The post has been deleted",
                })
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist.",
                })
        }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "The post could not be removed",
            })
        })
})




module.exports = router