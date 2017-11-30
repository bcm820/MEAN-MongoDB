
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
            let context = {}
            context.moment = moment;
            context.rappers = rappers;
            res.render('index', context);
        }).sort({votes: -1});
    })

    // form to add a rapper
    app.get('/rapper/add', (req, res) => {
        let flashes = getFlashes(req);
        res.render('add', flashes);
    });

    // post: add a rapper
    app.post('/rapper/add', (req, res) => {
        let rapper = new Rapper({
            name: req.body.name,
            amtOfHits: req.body.amtOfHits,
            topAlbum: req.body.topAlbum,
            releaseDate: req.body.releaseDate,
            votes: 0
        })
        rapper.save((err) => {
            if(err){
                req.session.flashes = err;
                res.redirect('/rapper/add')
            }
            else { res.redirect(`/rapper/${rapper._id}`); }
        });
    });

    // show and edit one rapper
    app.get('/rapper/:id', (req, res) => {
        Rapper.findOne({_id:req.params.id}, (err, rapper) => {
            if(err){ return console.error(err); }
            else { 
                let flashes = getFlashes(req);
                let context = {
                    rapper:rapper,
                    flashes:flashes,
                    moment:moment
                }
                res.render('show', context);
            }
        });
    });

    // post: edit a rapper (vote)
    app.post('/rapper/:id/voteup', (req, res) => {
        Rapper.findOne({_id:req.params.id}, (err, rapper) => {
            rapper.votes += 1;
            rapper.save((err) => {
                if(err){ return console.error(err); }
                res.redirect(`/`);
            })
        });
    });

    // post: edit a rapper (vote)
    app.post('/rapper/:id/votedown', (req, res) => {
        Rapper.findOne({_id:req.params.id}, (err, rapper) => {
            rapper.votes -= 1;
            rapper.save((err) => {
                if(err){ return console.error(err); }
                res.redirect(`/`);
            })
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