const fp = require("fastify-plugin")
const jwt = require("jsonwebtoken")

const AuthenticationRoles = {
    READ_ONLY: 'READ_ONLY',
    READ_WRITE: 'READ_WRITE'
}
Object.freeze(AuthenticationRoles)

function AuthenticationService(fastify, opts, done){

    async function authenticate(headers, roles, callback, ...args){
        try{
            if(!headers){
                throw new Error("You don't have any token")
            }
            let userRole = await getUserRole(headers.token)
            if(roles.includes(userRole)){
                let result = await callback(...args)
                if(result){
                    return getSuccessAuthResultWithValue(callback.name, result)
                }else{
                    return getSuccessAuthResult(callback.name)
                }
            }
            else{
                return getFailedAuthResult("You don't have permission to perform this operation")
            }
        }
        catch(err){
            fastify.log.error(err)
            return getFailedAuthResult(err.message)
        }
    }

    async function getUserRole(token){
        if(!token){
            throw new Error("You don't have any token")
        }
        let response = await fastify.dbPool.query("select role from authentication_tokens where token=$1", [token])
        if(response.rowCount < 1)
            throw new Error("Token doesn't exist in database")
        else{
            const decoded = jwt.verify(token, "MyDummySecretKey")
            if(decoded.role == response.rows[0]['role'])
                return decoded.role
            else
                throw new Error("Token mismatches database")
        }
    }

    function getSuccessAuthResult(functionName){
        return{
            status: "SUCCESS",
            message: "Successfully executed " + functionName
        }
    }

    function getSuccessAuthResultWithValue(functionName, value){
        return{
            status: "SUCCESS",
            message: "Successfully executed " + functionName,
            data: value
        }
    }

    function getFailedAuthResult(message){
        return{
            status: "FAIL",
            message: message
        }
    }

    fastify.decorate("AuthenticationRoles",AuthenticationRoles)
    fastify.decorate("authenticate", (headers, role, callback, ...args)=>authenticate(headers, role, callback, ...args))
    done()
}

module.exports = fp(AuthenticationService)