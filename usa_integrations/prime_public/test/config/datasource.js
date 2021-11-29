const dataSource = require('../../src/config/datasource.json')
const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('chai').assert;

describe('checking for objects in datasource file',function(){
    it('check if datasources exist', function(){
        assert.exists(dataSource.mysql_prime, 'mysql database exists'); 
        assert.exists(dataSource.redis, 'redis database exists');
    });

    it('checks if mysql has needed keys',function(){
        const mysqlDS = dataSource.mysql_prime;
        assert.exists(mysqlDS["host"], "host exists");
        assert.exists(mysqlDS["port"], "port exists");
        assert.exists(mysqlDS["database"], "database exists");
        assert.exists(mysqlDS["password"], "password exists");
        assert.exists(mysqlDS["name"], "name exists");
        assert.exists(mysqlDS["user"], "user exists");
        assert.exists(mysqlDS["connector"], "connector exists");
        assert.exists(mysqlDS["connectTimeout"], "connectTimeout exists");
        assert.exists(mysqlDS["acquireTimeout"], "acquireTimeout exists");

        assert.isNotEmpty(mysqlDS["host"], "host is not empty");
        assert.isNotEmpty(mysqlDS["database"], "database is not empty");
        assert.isNotEmpty(mysqlDS["password"], "password is not empty");
        assert.isNotEmpty(mysqlDS["name"], "name is not empty");
        assert.isNotEmpty(mysqlDS["user"], "user is not empty");
    });

    it('checks if redis has needed keys',function(){
        const redisDS = dataSource.redis;
        assert.exists(redisDS["host"], "host exists");
        assert.exists(redisDS["port"], "port exists");
        assert.exists(redisDS["password"], "password exists");

        assert.isNotEmpty(redisDS["host"], "host is not empty");
    })
})