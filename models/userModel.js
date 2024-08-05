const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    age: {
        type: Number
    },
    email: {
        type: String,
    },
    mobile: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    aadharCradNumber: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});

// Secure the password with the bcryptjs
userSchema.pre('save', async function () {
    //console.log("Value of this is",this);
    const user = this;
    if (!user.isModified("password")) {
        next();
    }
    try {
        // hash password generation
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(user.password, salt);

        //override the plain password with the hash password
        user.password = hashedPassword;
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        //Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }

}

module.exports = mongoose.model('User', userSchema);