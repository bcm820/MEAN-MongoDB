
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const moment = require('moment');
const uniqueCheck = require('mongoose-unique-validator');


const UserSchema = new mongoose.Schema({
    
    email: {
        type: String, unique: [true], trim: true,
        required: [true, 'Email required'],
        uniqueCaseInsensitive: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },

    first: { // can also query user.fullName
        type: String, trim: true,
        required: [true, 'First name required'],
        minlength: [3, 'First name must be 3 characters min.']
    },

    last: {
        type: String, trim: true,
        required: [true, 'Last name required'],
        minlength: [3, 'Last name must be 3 characters min.']
    },

    _pw: {
        type: String,
        required: [true, 'Password required'],
        minlength: [8, 'Password must be 8 characters min.'],
        maxlength: [32, 'Password must be 32 characters max.']
    },

    _pwconf: {
        type: String,
        required: [true, 'Confirmation required'],
        validate: function(pwconf){
            if(pwconf !== this._pw){
                this.invalidate('pwconf', 'Confirmation does not match');
            }
        }
    },

    bday: { // can also query user.age
        type: Date,
        required: [true, 'Birthday required'],
        get: (date) => { return moment(date).format('YYYY-MM-DD'); },
        validate: function(bday){
            if(moment(bday).isValid() === false){
                this.invalidate('bday', 'Invalid date format')
            }
            if(moment(bday).isAfter(moment())){
                this.invalidate('bday', 'Date must be in the past')
            }
        }
    },

    // gender: {
    //     type: String,
    //     enum: ['Male', 'Female']
    // }
    
}, {timestamps: true});

// unique plugin
UserSchema.plugin(uniqueCheck, {message: 'Duplicate email found' });

// virtual fullName attr
UserSchema.virtual('name').get(function(){
    return `${this.first} ${this.last}`;
});

// virtual age attr
UserSchema.virtual('age').get(function() {
    return moment().diff(this.bday, 'years');
});

// hash password and clear pwconf prior to save
UserSchema.pre('save', function(next){
    bcrypt.hash(this._pw, 10, function(err, hashedPass){
        this._pw = hashedPass;
        this._pwconf = undefined;
        this.save(null)
        next();
    });
});

// check password prior to login - call as user.checkPW(pw);
UserSchema.methods.checkPW = function(password){
    bcrypt.compare(password, this._pw)
    .then(confirmed => {return confirmed})
    .catch(err => {return err});
}

mongoose.model('User', UserSchema);



// LATER:
// post find (for updating password)