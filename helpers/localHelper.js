const moment = require('moment');

const localHelper = (res) => {
    res.locals.moment = moment;

    res.locals.handlerError = (key) => {
        const { errors } = res.locals;
        let msg = '';
        if (errors.length) {
            for (let i = 0; i < errors.length; i++) {
                if (errors[i].param === key) {
                    msg = `<p style="color:red; text-transform: capitalize">${errors[i].msg}</p>`;
                    break;
                }
            }
        }

        return msg;
    }
};
module.exports = localHelper;