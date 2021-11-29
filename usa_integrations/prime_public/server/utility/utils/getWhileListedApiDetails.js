const helper = require('../../../server/utility/require-helper');

module.exports = ({ ApiId, ExternalClientID, RestAction }) =>
    helper.app.models.ClientWhitelistedAPI.findOne({
        fields: {
            ClientWhitelistedApiID: true
        },
        where: {
            and:[{
                ExternalClientID,
            },{
                ApiId,
            },{
                RestAction
            },{
                Active: true,
            }]
        }
    })
;