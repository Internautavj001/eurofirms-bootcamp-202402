var logic = (function () {

function convertDateToISOString(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds()
    var millis = date.getMilliseconds()

    function twoDigits(value) {
        return value < 10 ? '0' + value : '' + value
    }

    function threeDigits(value) {
        return value < 10 ? '00' + value : value < 100 ? '0' + value : '' + value
    }

    var isoDate = year + '-' + twoDigits(month) + '-' + twoDigits(day) + ' ' + twoDigits(hours) + ':' + twoDigits(minutes) + ':' + twoDigits(seconds) + '.' + threeDigits(millis)

    return isoDate
}

    function validateName(name) {
        if (name.length < 1)
            throw new Error('El nombre tiene menos de 1 carácter')

        var nameIsBlank = true

        for (var i = 0; i < name.length && nameIsBlank; i++) {
            var char = name[i]

            if (char !== ' ')
                nameIsBlank = false
        }

        if (nameIsBlank)
            throw new Error('Nombre es blanco')
    }

    function validateBirthdate(birthdate) {
        if (birthdate.length !== 10)
            throw new Error('La fecha de nacimiento no tiene 10 caracteres')

        if (birthdate.includes(' '))
            throw new Error('Fecha de nacimiento tiene espacio en blanco')

        if (birthdate.indexOf('-') !== 4 || birthdate.lastIndexOf('-') !== 7)
            throw new Error('Fecha de nacimiento no está en el orden correcto')
    }

    function validateUsername(username) {
        if (username.length < 3)
            throw new Error('El nombre de usuario tiene menos de 3 caracteres')

        if (username.includes(' '))
            throw new Error('El nombre de usuario tiene espacio en blanco')
    }

    function validateEmail(email) {
        if (email.length < 6)
            throw new Error('Correo Electrónico es más pequeño que 6 carácteres')

        if (!email.includes('@'))
            throw new Error('El correo electrónico no tiene @')

        if (!email.includes('.'))
            throw new Error('El correo electrónico no tiene .')

        if (email.lastIndexOf('.') < email.indexOf('@'))
            throw new Error('El correo electrónico tiene . antes @')

        if (email.lastIndexOf('.') - email.indexOf('@') < 2)
            throw new Error('El correo electrónico tiene . junto a @')

        if (email.length - 1 - email.indexOf('.') < 2)
            throw new Error('El dominio de Correo electrónico es inferior a 2 cáracteres')

        if (email.includes(' '))
            throw new Error('El correo electrónico tiene espacio')
    }

    function validatePassword(password) {
        if (password.length < 8)
            throw new Error('La contraseña tiene menos de 8 caracteres')

        if (password.includes(' '))
            throw new Error('Contraseña tiene espacio')
    }

    function validateUserId(userId) {
        if (typeof userId !== 'string') throw new Error('Usuario no es un string')
        if (userId.includes(' ')) throw new Error('Usuario tiene espacios')
        if (!userId.length) throw new Error('Usuario está vacío')
    }

    function validateText(text) {
        if (typeof text !== 'string') throw new Error('Texto no es un string')
        if (text.includes(' ')) throw new Error('Texto tiene espacios')
        if (!text.length) throw new Error('Texto está vacío')
    }    



    function registerUser(name, birthdate, username, email, password) {
        validateName(name)
        validateBirthdate(birthdate)
        validateUsername(username)
        validateEmail(email)
        validatePassword(password)

        var user = data.findUser(function (user) {
            return user.username === username || user.email === email
        })

        if (user !== undefined)
            throw new Error('Usuario ya Existe')

        var user = {
            name: name,
            birthdate: birthdate,
            username: username,
            email: email,
            password: password
        }

        data.insertUser(user)
    }

    function loginUser(username, password) {
        validateUsername(username)
        validatePassword(password)

        var user = data.findUser(function (user) {
            return user.username === username
        })

        if (user === undefined)
            throw new Error('Usuario no encontrado')

        if (user.password !== password)
            throw new Error('Contraseña errónea')

        sessionStorage.userId = user.id

        user.online = true

        data.updateUser(user)
    }

    function retrieveUser() {
        var user = data.findUser(function (user) {
            return user.id === sessionStorage.userId
        })

        if (user === undefined)
            throw new Error('Usuario no encontrado')

        return user
    }

    function logoutUser() {
        var user = data.findUser(function (user) {
            return user.id === sessionStorage.userId
        })

        if (!user) throw new Error('Usuario no encontrado')

        user.online = false

        data.updateUser(user)

        delete sessionStorage.userId
    }

    function retrieveUsers() {
        var users = data.getAllUsers()

        var index = users.findIndex(function (user) {
            return user.id === sessionStorage.userId
        })

        users.splice(index, 1)

        users.forEach(function (user) {
            delete user.name
            delete user.birthdate
            delete user.email
            delete user.password
        })

        users.sort(function (user1, user2) {
            return user1.online > user2.online ? -1 : 1
        })

        return users
    }

    function sendMessageToUser(userId, text) {
        validateUserId(userId)
        validateText(text)

        var message = {
            from: sessionStorage.userId,
            to: userId,
            text: text,
            date: convertDateToISOString(new Date())
        }

        data.insertMessage(message)
    }

    function retrieveMessagesWithUser(userId) {
        validateUserId(userId)

        var messages = data.findMessages(function (message) {
            return message.from === sessionStorage.userId && message.to === userId || message.from === userId && message.to === sessionStorage.userId
        })

        return messages
    }

    return {
        registerUser: registerUser,
        loginUser: loginUser,
        retrieveUser: retrieveUser,
        logoutUser: logoutUser,
        retrieveUsers: retrieveUsers,
        sendMessageToUser: sendMessageToUser,
        retrieveMessagesWithUser: retrieveMessagesWithUser
    }
})()