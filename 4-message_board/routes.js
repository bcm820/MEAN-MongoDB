
module.exports = function route(app, server, mongoose, session){
    
    // configure mongoose and require models
    mongoose.connect('mongodb://localhost/message_board');
    mongoose.set('debug', true);
    mongoose.Promise = global.Promise;

    const PostModel = require('./postModel');
    const CommentModel = require('./commentModel');

    mongoose.model('Post', PostModel);
    mongoose.model('Comment', CommentModel);

    const Post = mongoose.model('Post');
    const Comment = mongoose.model('Comment');

    // setup flash validations
    function getFlashes(req) {
        let flashes = {};
        if(req.session.flashes) { // post validations
            flashes = req.session.flashes;
            req.session.destroy();
        }
        else { flashes = {}; }
        return flashes;
    }

    // get all posts and comments
    app.get('/', (req, res) => {
        Post.find({})
        .populate('comments')
        .then(posts => {
            console.log(posts);
            let flashes = getFlashes(req);
            res.render('index', {posts, flashes})
        })
    });

    // add post
    app.post('/post', (req, res) => {
        const post = new Post(req.body);
        post.save((err) => {
            if(err){ req.session.flashes = err; }
            return res.redirect('/');
        });
    });

    // add comment
    app.post('/comment/:id', (req, res) => {
        Post.findOne({_id: req.params.id}, (err, post) => {
            
            // in body of model1 query, create model2 instance
            // add post to new comment via known post._id
            let comment = new Comment(req.body);
            comment._post = post._id;

            // save both models to DB
            comment.save((err) => {
                if(err) { req.session.flashes = err; }
                post.comments.push(comment);
                post.save((err) => {
                    return res.redirect('/');
                });
            });
        });
    });

};