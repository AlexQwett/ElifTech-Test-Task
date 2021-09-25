const { Schema, model } = require("mongoose");

const schema = Schema({
    bankName: {
        type: String,
        required: true
    },
    interestRate: {
        type: Number,
        required: true
    },
    maximumLoan: {
        type: Number,
        required: true
    },
    minLoan: {
        type: Number,
        required: true
    },
    minimumDownPayment: {
        type: Number,
        required: true
    },
    loanTerm: {
        type: Number,
        required: true
    }
});

module.exports = model("Banks", schema);