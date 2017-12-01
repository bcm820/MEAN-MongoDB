
module.exports = function route(app, server, mongoose, moment, session){
    
    // configure mongoose and model
    mongoose.connect('mongodb://localhost/rappers');
    mongoose.Promise = global.Promise;
    const RapperModel = require('./rapper');
    mongoose.model('Rapper', RapperModel);
    const Rapper = mongoose.model('Rapper');

    function getFlashes(req){
        let flashes;
        if(req.session.flashes){
            flashes = req.session.flashes;
            req.session.destroy();
        }
        else { flashes = {}; }
        return flashes;
    }

    // display all rappers
    // add link to vote up
    app.get('/', (req, res) => {
        Rapper.find({}, (err, rappers) => {
            if(err){ return console.error(err); }
            res.render('index', {rappers, moment});
        }).sort({votes: -1});
    })

    // form to add a rapper
    app.get('/rapper/add', (req, res) => {
        let flashes = getFlashes(req);
        res.render('add', flashes);
    });

    // post: add a rapper
    app.post('/rapper/add', (req, res) => {
        let rapper = new Rapper(req.body)
        rapper.save((err) => {
            if(err){
                req.session.flashes = err;
                res.redirect('/rapper/add')
            }
            else { res.redirect(`/rapper/${rapper._id}`); }
        });
    });

    // show rapper page
    app.get('/rapper/:id', (req, res) => {
        Rapper.findOne({_id:req.params.id}, (err, rapper) => {
            if(err){ return console.error(err); }
            else { res.render('show', {rapper, moment}); }
        });
    });

    // edit rapper page
    app.get('/rapper/:id/edit', (req, res) => {
        Rapper.findOne({_id:req.params.id}, (err, rapper) => {
            if(err){ return console.error(err); }
            let flashes = getFlashes(req);
            res.render('edit', {rapper, moment, flashes});
        });
    });

    // post: edit rapper
    app.post('/rapper/:id/edit', (req, res) => {
        console.log(req.body);
        Rapper.findOneAndUpdate({_id:req.params.id}, req.body, (err, rapper) => {
            if(err){ req.session.flashes = err; }
            res.redirect(`/rapper/${rapper._id}/edit`);
        });
    });

    // post: upvote rapper
    app.post('/rapper/:id/voteup', (req, res) => {
        Rapper.findOne({_id:req.params.id}, (err, rapper) => {
            rapper.votes += 1;
            rapper.save((err) => {
                if(err){ return console.error(err); }
                res.redirect(`/`);
            })
        });
    });

    // post: downvote rapper
    app.post('/rapper/:id/votedown', (req, res) => {
        Rapper.findOne({_id:req.params.id}, (err, rapper) => {
            if(rapper.votes > 0){
                rapper.votes -= 1;
                rapper.save((err) => {
                    if(err){ return console.error(err); }
                    res.redirect(`/`);
                })
            }
        });
    });

    // post: delete a rapper
    app.post('/rapper/:id/delete', (req, res) => {
        Rapper.remove({_id:req.params.id}, (err) => {
            if(err){ return console.error(err); }
        });
        res.redirect('/');
    });

};