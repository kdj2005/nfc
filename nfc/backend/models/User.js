const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    cartId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value){
                return validator.isEmail(value);
            },
            message: "Invalid email format"
        }
    },
    code_pin: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    solde: {
        type: Number,
        default: 100
    },
    role: {
        type: String,
        enum: ["user", "manager", "admin"],
        default: "user"
    },
    refreshToken: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


userSchema.pre("save", async function() {
    if(!this.isModified("code_pin")) return ;

        this.code_pin = await bcrypt.hash(this.code_pin, 10);
    
    ;
});

module.exports = mongoose.model("User", userSchema);