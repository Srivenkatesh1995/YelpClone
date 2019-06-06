var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campground');
var middleware = require('../middleware');

//THE CREATE NEW CAMPGROUNDS PAGE ROUTE
router.post('/', middleware.IsLoggedIn, function(req, res) {
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {
		name: name,
		price: price,
		image: image,
		description: desc,
		author: author
	};
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	});
});

//THE ADD NEW CAMPGROUND FORM PAGE ROUTE
router.get('/new', middleware.IsLoggedIn, function(req, res) {
	res.render('campgrounds/new');
});

//THE DISPLAY ALL CAMPGROUNDS PAGE ROUTE
router.get('/', function(req, res) {
	//Get all campgrounds from DB and display
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log('You have made an Error!');
			console.log(err);
		} else {
			res.render('campgrounds/index', {
				campgrounds: allCampgrounds,
				currentUser: req.user
			});
		}
	});
});

//Show Route- Shows more Info about one selected campground
router.get('/:id', function(req, res) {
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render('campgrounds/show', { campground: foundCampground });
		}
	});
});

//Edit Campground Route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		console.log(req.params.id);
		res.render('campgrounds/edit', { campground: foundCampground });
	});
});

//Update Campground Route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//Destroy Campground Route and Logic
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;
