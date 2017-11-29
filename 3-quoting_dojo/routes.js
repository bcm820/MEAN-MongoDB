
module.exports = function route(app, server, mongoose, moment){
    mongoose.connect('mongodb://localhost/quoting_dojo');
    mongoose.Promise = global.Promise;

    const QuoteModel = new mongoose.Schema({
        author: {
            type: String,
            required: true,
            minlength: 3
        },
        text: {
            type: String,
            required: true,
            min: 5, max: 10
        },
    }, {timestamps: true});

    mongoose.model('Quote', QuoteModel);
    const Quote = mongoose.model('Quote');


    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/quotes', (req, res) => {
        Quote.find({}, (err, quotes) => {
            if(err){ return console.error(err); }
            else {
                let context = {};
                context.moment = moment;
                context.quotes = quotes;
                res.render('quotes', context);
            }
        }).sort({createdAt: -1});
    });

    app.post('/quotes', (req, res) => {
        const quote = new Quote({
            author: req.body.author,
            text: req.body.text
        })
        quote.save((err) => {
            if(err){ return console.error(err); }
        })
        res.redirect('/quotes');
    });

};