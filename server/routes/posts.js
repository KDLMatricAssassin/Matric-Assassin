const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Post = require('../models/Post');

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { content, imageUrl, videoUrl } = req.body;
        
        const newPost = new Post({
            user: req.user.id,
            content,
            imageUrl,
            videoUrl,
            status: req.user.role === 'admin' ? 'approved' : 'pending'
        });

        const post = await newPost.save();
        
        // Populate user data
        await post.populate('user', 'name image');
        
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/posts
// @desc    Get all approved posts
// @access  Public
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({ status: 'approved' })
            .sort({ createdAt: -1 })
            .populate('user', 'name image');
            
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/posts/pending
// @desc    Get all pending posts (admin only)
// @access  Private/Admin
router.get('/pending', protect, admin, async (req, res) => {
    try {
        const posts = await Post.find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .populate('user', 'name image');
            
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/posts/:id/approve
// @desc    Approve a post (admin only)
// @access  Private/Admin
router.put('/:id/approve', protect, admin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        
        post.status = 'approved';
        await post.save();
        
        // Populate user data
        await post.populate('user', 'name image');
        
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post (admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        
        await post.remove();
        
        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
