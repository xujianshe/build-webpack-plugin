class testHelper {
    static assert(funObj, ret) {
        let funName = testHelper.getFunName(funObj);
        if (ret) {
            console.log(funName + " successed");
        } else {
            throw Error(funName + " failed")
        }
    }

    static getFunName(funObj) {
        let funStr = funObj.toString();
        let re = /function\s*(\w*)/i;
        let matches = re.exec(funStr);
        
        return matches[1];
    }

}

module.exports = testHelper;