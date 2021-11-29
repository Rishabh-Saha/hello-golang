module.exports = function disableAllMethods(model, methodsToExpose, defaultMethods) {
    if (model && model.sharedClass) {
        methodsToExpose = methodsToExpose || [];
  
        const defaultMethodList = [
            'create',
            'patchOrCreate',
            'replaceOrCreate',
            'upsertWithWhere',
            'exists',
            'findById',
            'replaceById',
            'find',
            'findOne',
            'updateAll',
            'deleteById',
            'count',
            'patchAttributes',
            'createChangeStream'
        ];
  
        var methods = model.sharedClass.methods();
        var relationMethods = [];
        var hiddenMethods = [];
  
        try {
            Object.keys(model.definition.settings.relations).forEach(function (relation) {
                relationMethods.push({
                    name: '__findById__' + relation,
                    isStatic: false
                });
                relationMethods.push({
                    name: '__destroyById__' + relation,
                    isStatic: false
                });
                relationMethods.push({
                    name: '__updateById__' + relation,
                    isStatic: false
                });
                relationMethods.push({
                    name: '__exists__' + relation,
                    isStatic: false
                });
                relationMethods.push({
                    name: '__link__' + relation,
                    isStatic: false
                });
                relationMethods.push({
                    name: '__get__' + relation,
                    isStatic: false
                });
                relationMethods.push({
                    name: '__create__' + relation,
                    isStatic: false
                });
                relationMethods.push({
                    name: '__update__' + relation,
                    isStatic: false
                });
                relationMethods.push({
                    name: '__destroy__' + relation,
                    isStatic: false
                });
                relationMethods.push({
                    name: '__unlink__' + relation,
                    isStatic: false
                });
                relationMethods.push({
                    name: '__count__' + relation,
                    isStatic: false
                });
                relationMethods.push({
                    name: '__delete__' + relation,
                    isStatic: false
                });
            });
        } catch (err) {
            //eslint-disable-line no-empty
        }
  
        methods.concat(relationMethods).forEach(function (method) {
            var methodName = method.name;
  
            //Loopback 3 has bug which https://github.com/strongloop/strong-remoting/issues/335
            if (methodName === 'patchAttributes') {
                model.disableRemoteMethodByName = model.disableRemoteMethod;
            }
            if (defaultMethods) {
                if (methodName && defaultMethodList.includes(methodName)) {
                    model.disableRemoteMethodByName(method.name, method.isStatic);
                }
            } else {
                if (methodsToExpose.indexOf(methodName) < 0) {
                    hiddenMethods.push(methodName);
                    model.disableRemoteMethodByName(methodName, method.isStatic);
                }
            }
        });
  
  
  
        if (defaultMethods || hiddenMethods.length > 0) {
            // console.log('\nRemote mehtods hidden for', modelName, ':', hiddenMethods.join(', '), '\n');
            // console.log('---- Remote methods hidden for :', modelName, '----'); //eslint-disable-line no-console
        }
    }
};
  