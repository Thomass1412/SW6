const authTest = (req, res) => {
    res.send(`Hello ${req.user.email}, you have access!`);
};

module.exports = { authTest };
