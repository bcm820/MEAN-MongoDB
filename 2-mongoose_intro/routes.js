
module.exports = function route(app, server, mongoose, moment){
    
    mongoose.connect('mongodb://localhost/users');
    mongoose.Promise = global.Promise;

    // define user model with validations, create db collection
    const UserModel = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 3
        },
        age: {
            type: Number,
            required: true,
            maxlength: 3,
            min: 1, max: 150
        },
        note: {
            type: String,
            required: false,
            minlength: 1,
            maxlength: 20
        }
    }, {timestamps: true});

    mongoose.model('User', UserModel);
    const User = mongoose.model('User');


    // handle multiple queries in one route
    app.get('/', (req, res) => {
        (async () => {
            let context = {};

            // get all users
            context.users = await User.find({}, (err, all) => {
                if(err){ return console.error(err); }
                else {
                    let sum = 0;
                    for (let user of all){ sum+= user.age; }
                    context.avgAge = Math.floor(sum/all.length);
                    return all;
                }
            }).sort({createdAt: -1}); // queryset sorting

            // get one user (first document in query)
            context.user = await User.findOne({}, (err, one) => {
                if(err){ return console.error(err); }
                else { return one; }
            });

            // get count of all User documents
            context.count = await User.count({}, (err, count) => {
                if(err){ return console.error(err); }
                else { return count; }
            });

            res.render('index', context);
        })().catch(err => console.error(error.stack));
    });

    // add a user
    app.post('/users', (req, res) => {
        const user = new User({
            name: req.body.name,
            age: req.body.age,
            note: "none"
        })
        user.save((err) => {
            if(err){ return console.error(err); }
        })
        res.redirect('/');
    });

    // delete all users
    app.post('/users/deleteAll', (req, res) => {
        User.remove({}, (err) => {
            if(err){ return console.error(err); }
        });
        res.redirect('/');
    });

    // delete a user
    app.post('/users/delete/:id', (req, res) => {
        User.remove({_id:req.params.id}, (err) => {
            if(err){ return console.error(err); }
        });
        res.redirect('/');
    });

    // update a user
    app.post('/users/updateOne/:id', (req, res) => {
        User.findOne({_id:req.params.id}, (err, user) => {
            if(err){ return console.error(err); }
            else {
                user.note = req.body.note;
                user.save((err) => {
                    if(err){ return console.error(err); }
                });
                console.log(user);
            }
        });
        res.redirect('/');
    });

};