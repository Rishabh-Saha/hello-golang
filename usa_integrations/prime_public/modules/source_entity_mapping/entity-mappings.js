var env = process.env.NODE_ENV;
var requireHelper = require('../../server/utility/require-helper');
var _ = requireHelper.lodash;
var moment = requireHelper.moment;
var utils = require('./../utils');
var async = requireHelper.async;
var ENTITY_MODEL_MAPPING = requireHelper.ENTITY_MODEL_MAPPING
var request = requireHelper.request;
var externalApiParams = require('../../server/externalApi.json');
const log = requireHelper.createBunyanLogger('EntityMapping');

module.exports = function(EntityMapping) {
	EntityMapping.fetchExternalMappingDetails = function(data,cb) {
		const functionName = 'EntityMapping.fetchExternalMappingDetails';
		//fetch mappings
		utils.hasSufficientParameters(data,['ClientID','lookupObj'],[],[],function(error,hasSufficientParameters) {
			if(error) {
				return cb(error)
			} else {
				async.map(data.lookupObj,function(lo,mapCallback) {
					try {
						var whereObj = {};
						whereObj.ClientID = data.ClientID;
						whereObj[lo.LookUpField] = lo.LookUpValue
						EntityMapping.app[lo.EntityType].findOne({
							where : whereObj
						})
						.then(function(entityResult) {
							if(!entityResult) {
								mapCallback({
									success:false,
									msg:'Invalid details'
								})
							} else {
								if(data.RequestBody && lo.FieldPath) {
									_.set(data.RequestBody,lo.FieldPath,entityResult[lo.EntityType+'ID']);
									mapCallback(null,entityResult);
								}
								var returnObj = {
									EntityType:lo.EntityType,
									MappedObject:entityResult
								}
								mapCallback(null,returnObj)
							}
						})
						.catch(function(error) {
							log.errorInfo(functionName,'error in fetchExternalMappingDetails',error);
							//add error code
							mapCallback({
								success:false,
								msg:'Invalid model details'
							})
						})
					} catch {
						mapCallback({
							success:false,
							msg:'Invalid model details'
						})
					}
				},function(error,mapResult) {
					if(error) {
						return cb(null,error);
					} else {
						return cb(null,{
							ModifiedRequestBody:data.RequestBody,
							MappedResult : mapResult
						})
					}
				})
			}
		})
	}
}