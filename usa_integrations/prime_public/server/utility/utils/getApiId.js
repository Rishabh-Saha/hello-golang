const helper = require('../../../server/utility/require-helper');

module.exports = ({
    ApiName
}) =>
    helper.app.models.ApiList.findOne({
        fields: {
            ApiId: true
        },
        where: {
            ApiName,
            Active: true
        }
    });