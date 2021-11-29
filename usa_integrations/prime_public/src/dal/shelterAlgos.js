const { read } = require('./dbhelpers/mysql');
const tableName = 'shelter_algos';

const getAllShelterAlgos = async () => {
    const result = await read(tableName, '*', {});  
    return result;
};

module.exports = {
    getAllShelterAlgos
}