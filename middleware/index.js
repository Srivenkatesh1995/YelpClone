var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(
	//Check User Campground Ownership
	req,
	res,
	next
) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if (err) {
				req.flash('error', 'Campground not found!');
				res.redirect('back');
			} else {
				//make sure that the owns the campground
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You dont have permission to do that!');
		res.redirect('back');
	}
};

middlewareObj.checkCommentOwnership = function(
	//Check User Campground Ownership
	req,
	res,
	next
) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect('back');
			} else {
				//make sure that the owns the campground
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	} else {
		res.redirect('back');
	}
};

//IsLoggedIn MiddleWare
middlewareObj.IsLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'Please Log in to finish the Request');
	res.redirect('/login');
};

module.exports = middlewareObj;
