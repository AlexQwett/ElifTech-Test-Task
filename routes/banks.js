const { Router } = require('express');
const Banks = require('../models/Banks');
const router = Router();

router.get('/', async (req, res) => {
    const banks = await Banks.find({}).lean();

    res.render('index', {
        title: "Banks list",
        isBMP: true,
        banks
    });
});

router.get('/create', (req, res) => {
    res.render('create', {
        title: "Create",
        isCreate: true
    });
});

router.post('/create', async (req, res) => {
    if (req.body.bankName == '' || req.body.interesRate == ''
        || req.body.maximumLoan == '' || req.body.minLoan == ''
        || req.body.minimumDownPayment == '' || req.body.loanTerm == '') {
        res.render('create', {
            title: "Create",
            isCreate: true,
            emptyName: req.body.bankName == '',
            emptyIntrsRate: req.body.interesRate == '',
            emptyMaxLoan: req.body.maximumLoan == '',
            emptyMinLoan: req.body.minLoan == '',
            emptyMinDownPaymnt: req.body.minimumDownPayment == '',
            emptyLoanTerm: req.body.loanTerm == '',
            bankName: req.body.bankName,
            interestRate: req.body.interesRate,
            maximumLoan: req.body.maximumLoan,
            minLoan: req.body.minLoan,
            minimumDownPayment: req.body.minimumDownPayment,
            loanTerm: req.body.loanTerm,
        })
    } else {
        const bank = new Banks({
            bankName: req.body.bankName,
            interestRate: req.body.interesRate,
            maximumLoan: req.body.maximumLoan,
            minLoan: req.body.minLoan,
            minimumDownPayment: req.body.minimumDownPayment,
            loanTerm: req.body.loanTerm,
        });

        await bank.save();
        res.redirect('/');
    }
});

router.post('/edit', async (req, res) => {
    const bank = await Banks.findById(req.body.id).lean();

    res.render('edit', {
        title: "Edit",
        bank,
        id: req.body.id
    });
});

router.post('/editing', async (req, res) => {
    Banks.findByIdAndUpdate(req.body.id, {
        bankName: req.body.bankName,
        interestRate: req.body.interestRate,
        maximumLoan: req.body.maximumLoan,
        minLoan: req.body.minLoan,
        minimumDownPayment: req.body.minimumDownPayment,
        loanTerm: req.body.loanTerm,
    }, () => {

    });

    res.redirect('/');
});

router.post('/removing', async (req, res) => {
    await Banks.findByIdAndDelete(req.body.id);

    res.redirect('/');
});

router.post('/calculator', async (req, res) => {
    const banks = await Banks.find({}).lean();

    res.render('calculator', {
        title: "Calculator",
        banks,
    });
});

router.post('/calculate', async (req, res) => {
    const banks = await Banks.find({}).lean();
    let names = [];
    const userData = req.body.bankName;

    for (const bank of banks) {
        names.push(bank.bankName);
    }

    const getObjByName = (nameObj) => {
        for (const name of banks) {
            if (nameObj === name.bankName) {
                return name;
            }
        }
    }

    const isMatchADataUser = (userValue) => {
        for (const name of names) {
            if (userValue === name) {
                return true;
            }
        }

        return false;
    }

    if (isMatchADataUser(userData) && req.body.initialLoan !== '' && req.body.userDownPayment !== '') {
        const userObj = getObjByName(userData);
        let frstDepAreCorrect = false;
        let downPaymentAreCorrect = false;

        if (userObj.minLoan <= req.body.initialLoan && req.body.initialLoan <= userObj.maximumLoan) {
            frstDepAreCorrect = true;
        }

        const minBankDownPayment = (userObj.minimumDownPayment * req.body.initialLoan) / 100;
        if (req.body.userDownPayment >= minBankDownPayment) {
            downPaymentAreCorrect = true;
        }

        const result = frstDepAreCorrect && downPaymentAreCorrect;
        const monthPayment = (req.body.initialLoan * (userObj.interestRate / 12)
         * Math.pow((1 + (userObj.interestRate / 12)), userObj.loanTerm))
         / (Math.pow((1 + (userObj.interestRate / 12)), userObj.loanTerm) - 1);

        res.render('result', {
            title: "Result",
            result,
            monthPayment,
            term: userObj.loanTerm
        });
    } else {
        res.render('calculator', {
            title: "Calculator",
            incorrectName: !isMatchADataUser(userData),
            emptyMinDwnPamnt: req.body.userDownPayment == '',
            emptyInitLoan: req.body.initialLoan == '',
            bankName: req.body.bankName,
            minDownPayment: req.body.userDownPayment,
            initialLoan: req.body.initialLoan
        });
    }
});

module.exports = router;

