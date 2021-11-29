const errorWrapper = error => {
    if(error instanceof Error){
        return error;
    }else{
        return new Error(error);
    }
};
module.exports = errorWrapper;