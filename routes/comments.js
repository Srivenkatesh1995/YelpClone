var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var User = require('../models/user');
var middleware = require('../middleware');

//==========COMMENTS ROUTES =========//
router.get('/new', middleware.IsLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

//Post for the Comments Form
router.post('/', middleware.IsLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					req.flash('error', 'Something went wrong');
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					console.log(req.user.username);
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'Successfully added the comment');
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

//Edit the Comment Route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', {
				campground_id: req.params.id,
				comment: foundComment
			});
		}
	});
});

//Method PUT for the Comment Route
router.put('/:comment_id', function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//Delete Route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect('back');
		} else {
			req.flash('success', 'Comment Successfully Deleted');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//==========COMMENTS ROUTES END  =========//

module.exports = router;
