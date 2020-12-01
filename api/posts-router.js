const e = require('express')
const express = require('express')
const Posts = require('../data/db')

const router = express.Router()


router.post('/', (req, res) => {
    Posts.insert(req.body)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: 'Error adding the post'})
        })
    // const postFromClient = req.body
    // if (!postFromClient.title || !postFromClient.contents) {
    //     res.status(400).json({ message: "Please provide title and contents for the post." })
    // } else {
    //     const newlyCreatedPost = Posts.insert(postFromClient)
    //     res.status(201).json(newlyCreatedPost)
    // }
})
router.post('/:id/comments', (req, res) => {
    const { id } = req.params
    const post = Posts.findCommentById(id)
    const postFromClient = req.body
    if (!post) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else if (!postFromClient.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else if (postFromClient.text) {
        const newlyCreatedComment = Posts.insertComment(commentFromClient)
        res.status(201).json(newlyCreatedComment)
    }
})
router.get('/', async (req, res) => {
    const { query } = req
    try {
        const posts = await Posts.find(query)
        res.json(posts)
    } catch (error) {
        res.json(error.message)
    }
})
router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
})
router.get('/:id/comments', async (req, res) => {
    Posts.findCommentById(req.params.id)
    .then(comment => {
        if (comment) {
            res.status(200).json(comment)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
})
router.delete('/:id', async (req, res) => {
    Posts.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: 'Post has been deleted.'})
            } else {
                res.status(404).json({message: 'The post could not be found.'})
            }
        })
})
router.put('/:id', (req, res) => {
    const changes = req.body
    const { id } = req.params
    const updatedPost = Posts.update(id, changes)
    if (updatedPost) {
        res.status(200).json(updatedPost)
    } else if (!changes.title || changes.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else if (!updatedPost) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
})

module.exports = router