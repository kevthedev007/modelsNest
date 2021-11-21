const jwt = require('jsonwebtoken');
const models = require('../models');
const { User, Recruiter, Models } = require('../models/index')

const verifyToken = (req, res, next) => {
    if (!req.headers['authorization']) return res.status(401).send('Access Denied!')
    const token = req.headers['authorization']

    if (!token) return res.status(401).send('Access Denied!')

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = user;
        next()
    } catch (err) {
        return res.status(400).send('Invalid Token');
    }
}

const recruiter_role = async (req, res, next) => {
    console.log(req.user.id)
    try {
        const recruiter = await User.findOne({ where: { id: req.user.id, role: "recruiter" } })

        if (recruiter) {
            next()
        } else {
            return res.status(403).send('Recruiter role required!')
        }
    } catch (err) {
        return res.status(500).send(err);
    }
}

const model_role = async (req, res, next) => {
    try {
        const model = await User.findOne({ where: { id: req.user.id, role: "model" } })
        if (model) {
            next()
        } else {
            return res.status(403).send('Model role required!')
        }

    } catch (err) {
        res.status(500).send(err)
    }
}


module.exports = { verifyToken, recruiter_role, model_role }