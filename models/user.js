/**
 * Created by apple on 6/30/17.
 */
var db = require('../db')
var basemodel = require('./basemodel')


const UserModel = basemodel.createObject('user')

// state == 0: not logged, 1: logged
var user = {
    EMAIL: '',
    PASSWORD: '',
    FIRST_NAME: '',
    LAST_NAME: '',
    DISPLAY_NAME: '',
    ADDRESS: '',
    STATE: 0,
    CREATE_DATE: new Date(),
    UPDATE_DATE: new Date(),
    LAST_SESSION: new Date(),
    TWITTER_AUTH: false,
    FACEBOOK_AUTH: false,
    GOOGLE_AUTH: false
}

var repository = {}

repository.find = function (email) {
    return UserModel.findOne({EMAIL: email})
}

repository.createUserIfNotExist = (email, password, firstName, lastName, displayName) => {
    user['EMAIL'] = email
    user['PASSWORD'] = password
    user['FIRST_NAME'] = firstName
    user['LAST_NAME'] = lastName
    user['DISPLAY_NAME'] = displayName
    user['STATE'] = 1
    return UserModel.insertIfNotExist({EMAIL: email}, user)
}

repository.updateAddress = (email, address) => UserModel.findOneAndUpdate({EMAIL: email}, {$set: {ADDRESS: address}})

module.exports = repository

/*user schema
 ID
 NUMBER(18,0)
 DIRECTORY_ID
 NUMBER(18,0)
 Links to CWD_DIRECTORY
 USER_NAME
 VARCHAR(255)
 LOWER_USER_NAME
 VARCHAR(255)
 used for case-insensitive search
 ACTIVE
 NUMBER(9,0)
 CREATED_DATE
 DATE
 UPDATED_DATE
 DATE
 FIRST_NAME
 VARCHAR(255)
 Not used
 LOWER_FIRST_NAME
 VARCHAR(255)
 Not used
 LAST_NAME
 VARCHAR(255)
 Not used
 LOWER_LAST_NAME
 VARCHAR(255)
 Not used
 DISPLAY_NAME
 VARCHAR(255)
 LOWER_DISPLAY_NAME
 VARCHAR(255)
 EMAIL_ADDRESS
 VARCHAR(255)
 LOWER_EMAIL_ADDRESS
 VARCHAR(255)
 CREDENTIAL
 VARCHAR(255)*/
