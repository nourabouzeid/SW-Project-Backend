import Joi, { ObjectSchema } from 'joi';

const verify: { signup: ObjectSchema, login: ObjectSchema } = {
    signup: Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().pattern(/@gmail\.com$/).required(),
        password: Joi.string().min(3).max(50).required(),
        confirm_pass: Joi.string().valid(Joi.ref('password')).required().messages({ "any.only": "Passwords don't match" }),
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(50).required(),
    })
}

export default verify;