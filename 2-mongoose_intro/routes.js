
module.exports = function route(app, server, mongoose){

    mongoose.connect('mongodb://localhost/users');
    mongoose.Promise = global.Promise;

    // define user model
    const UserModel = new mongoose.Schema({
        name: String,
        age: Number
    });

    // create db collection from model
    mongoose.model('User', UserModel);
    const User = mongoose.model('User');
    
    app.get('/', (req, res) => {
        User.find({}, (err, users) => {
            if(err){ console.log('Error!'); }
            else {
                console.log(users);
                let context = {users:users};
                res.render('index', users);
            }
        });
    });

    app.post('/users', (req, res) => {
        
        let user = new User({
            name: req.body.name,
            age: req.body.age
        });

        user.save((err) => {
            if(err){ console.log('Error!'); }
        });

        res.redirect('/');
    });

};