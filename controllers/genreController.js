var Genre = require('../models/genre');
var Book = require('../models/book');

var async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Display list of all Genre.
exports.genre_list = function(req, res, next) {
    Genre
    .find()
    .sort([['name', 'ascending']])
    .exec(function(err, list_genre) {
        if (err) { return next(err) }

        //if success render
        res.render('genre_list', { title: 'Genre List', genre_list: list_genre });
    })
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
                .exec(callback);
        },
        genre_books: function(callback) {
            Book.find({'genre': req.params.id})
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err) }
        if (results.genre === null) {
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err)
        }
        //if successful render
        res.render('genre_detail', {title: "Genre Detail", genre: results.genre, genre_books: results.genre_books});
    });
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next) {
    res.render('genre_form', {title: 'Create Genre'});
};

// Handle Genre create on POST.
exports.genre_create_post = [
    //Validate that name field is not empty
    body('name', 'Genre name required').isLength({min: 1}).trim(),

    //Sanitize name field
    sanitizeBody('name').trim().escape(),

    //Process request after validation and sanitization.
    (req, res, next) => {
        //Extract validation errors from request.
        const errors = validationResult(req);
        //create genre object with escaped and trimmed data
        var genre = new Genre(
            {
                name: req.body.name
            }
        );

        if (!errors.isEmpty()) {
            //There are errors, re render with sanitized values/error messsages.
            res.render('genre_form', {title: 'Create Genre', genre: genre, errors: erorrs.array()});
            return;
        } else {
            //Data is valid, check for same name Genre
            Genre.findOne({ 'name': req.body.name })
                .exec( function(err, found_genre) {
                    if (err) { return next(err); }
                    if (found_genre) {
                        //Genre exists, redirect to its detail page
                        res.redirect(found_genre.url);
                    }
                    else {
                        genre.save(function (err) {
                            if (err) { return next(err) }
                            //Genre saved, redirect to genre page
                            res.redirect(genre.url);
                        });
                    }
                });
        }
    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};