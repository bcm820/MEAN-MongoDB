
module.exports = function route(app, server, mongoose, moment, session){
    
    mongoose.connect('mongodb://localhost/users');
    mongoose.Promise = global.Promise;

    // define user model with validations, create db collection
    const UserModel = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'You must enter a name.'],
            minlength: [3, 'Name field must be 3 characters min.']
        },
        age: {
            type: Number,
            required: [true, 'You must enter an age.'],
            maxlength: [3, 'The age field takes 3 digits max.'],
            min: [1, 'Enter an age over 1 y.o.'],
            max: [150, 'Enter an age under 150 y.o.']
        },
        note: {
            type: String,
            required: false,
            minlength: [3, 'Note must be 3 characters min.'],
            maxlength: [20, 'Note must be 20 characters max.'],
        }
    }, {timestamps: true});

    mongoose.model('User', UserModel);
    const User = mongoose.model('User');

    function getFlashes(req){
        let flashes;
        if(req.session.flashes){
            flashes = req.session.flashes;
            req.session.destroy();
        }
        else { flashes = {}; }
        return flashes;
    }

    // handle multiple queries in one route
    app.get('/', (req, res) => {
        
        (async () => {

            // get all users
            let users = await User.find({}, (err, all) => {
                if(err){ console.error(err); }
                else { return all; }
            }).sort({createdAt: -1}); // queryset sorting

            // get one user (first document in query)
            let user = await User.findOne({}, (err, one) => {
                if(err){ console.error(err); }
                else { return one; }
            });

            // get count of all User documents
            let count = await User.count({}, (err, count) => {
                if(err){ console.error(err); }
                else { return count; }
            });

            // calculate avg age of users
            let sum = 0;
            for (let user of users){ sum+= user.age; }
            let avgAge = Math.floor(sum/users.length);

            // get flashes if errors
            let flashes = getFlashes(req);

            return res.render('index', {users, user, avgAge, count, flashes});
        })().catch(err => console.error(err.stack));
    });

    // add a user
    app.post('/users', (req, res) => {
        const user = new User(req.body)
        user.save((err) => {
            if(err){ req.session.flashes = err; }
            return res.redirect('/');
        })
    });

    // delete all users
    app.post('/users/deleteAll', (req, res) => {
        User.remove({}, (err) => {
            if(err){ console.error(err); }
            return res.redirect('/');
        });
    });

    // delete a user
    app.post('/users/delete/:id', (req, res) => {
        User.remove({_id:req.params.id}, (err) => {
            if(err){ console.error(err); }
            return res.redirect('/');
        });
    });

    // update a user
    app.post('/users/updateOne/:id', (req, res) => {
        User.findOne({_id:req.params.id}, (err, user) => {
            if(err){ console.error(err); }
            user.note = req.body.note;
            user.save((err) => {
                if(err){ req.session.flashes = err; }
                return res.redirect('/');
            });
        });
    });

};