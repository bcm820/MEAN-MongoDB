
module.exports = function route(app, server, mongoose, moment, session){
    mongoose.connect('mongodb://localhost/quoting_dojo');
    mongoose.Promise = global.Promise;

    const QuoteModel = new mongoose.Schema({
        author: {
            type: String,
            required: [true, 'You must enter your name.'],
            minlength: [3, 'Your name must be at least 3 characters long.']
        },
        text: {
            type: String,
            required: [true, 'You must enter a quote.'],
            minlength: [5, 'Your quote must be at least 5 characters long.'],
            maxlength: [50, 'Your quote must be no longer than 50 characters.']
        },
    }, {timestamps: true});

    mongoose.model('Quote', QuoteModel);
    const Quote = mongoose.model('Quote');


    function getFlashes(req){
        let flashes;
        if(req.session.flashes){
            flashes = req.session.flashes;
            req.session.destroy();
        }
        else { flashes = {}; }
        return flashes;
    }


    app.get('/', (req, res) => {
        let flashes = getFlashes(req);
        res.render('index', flashes);
    });


    app.get('/quotes', (req, res) => {
        Quote.find({}, (err, quotes) => {
            if(err){ return console.error(err); }
            else {
                res.render('quotes', {quotes, moment});
            }
        }).sort({createdAt: -1});
    });


    app.post('/quotes', (req, res) => {
        const quote = new Quote({
            author: req.body.author,
            text: req.body.text
        })
        quote.save((err) => {
            if(err){
                req.session.flashes = err;
                res.redirect('/');
            }
            else { res.redirect('/quotes'); }
        })
    });

};