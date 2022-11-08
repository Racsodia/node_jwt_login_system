import User  from '../../models/user.model';
import crypto from 'crypto';

/************************ CREATE USER METHOD******************************/
export const userRegister = (req, res) => {
    User.findOne({ email: req.body.email }, (error, user) => {
        if (error)
            res.status(400).json({ message: 'Bad Request: ' + error })
        if (user)
            res.status(400).json({ message: 'El correo electrónico ya existe' })
        else {
            const { name, lastname, email, password} = req.body
            const user = new User({ name, lastname, email })
            if (user.checkNewPassword(password)) {
               const  { salt, hash } = user.setPassword(password)
                user.hash = hash;
                user.salt = salt;
                user.save()
                    .then(() => res.status(200).json({ data: user, message: 'Usuario registrado' }))
                    .catch(err => res.status(400).json('Error: ' + err))
            }
            else {
                res.status(400).json({ message: 'La contraseña debe contener más de 6 caracteres' })
            }
        }
    })
}
/************************ UPDATE USER METHOD******************************/
export const userUpdate = (req, res, next) => {
    const { body: { user } } = req
    User.findById(user._id, (err, userFind) => {
        if (err) res.status(400).json({ message: err })
        if (userFind === null)
            res.status(400).json({ message: 'Usuario no encontrado' })
        else {
            if (user.name)
                userFind.name = user.name
            if (user.lastname)
                userFind.lastname = user.lastname
            if (user.email)
                userFind.email = user.email
            if (user.role)
                userFind.role = user.role
            if (user.dni)
                userFind.dni = user.dni
            if (user.phone)
                userFind.phone = user.phone
            if (user.address)
                userFind.address = user.address
            if (user.subAddress)
                userFind.subAddress = user.subAddress
            if (user.password)
                if (userFind.checkNewPassword(user.password)) {
                    userFind.password = userFind.setPassword(user.password)

                } else {
                    res.status(400).json({ message: 'La contraseña debe contener más de 6 caracteres, mayúsculas y/o minúsculas.' })
                }
            userFind.save()
                .then(() => { res.status(200).json({ message: 'Usuario actualizado correctamente' }) })
                .catch(err => res.status(400).json('Error:' + err))
        }
    })
}
/************************ DELETE USER METHOD******************************/
export const userDelete = (req, res) => {
    const { body: { user } } = req
    User.findByIdAndRemove(user._id, (err, user) => {
        if (err) res.status(400).json({ msg: err })
        if (user === null)
            res.status(400).json({ message: 'Usuario no encontrado' })
        else res.status(200).json({ user: user, msg: 'Eliminado correctamente' })
    })
}

/************************ LOGIN USER METHOD******************************/
export const userLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email) return res.status(400).json({ error: 'Correo electrónico es un campo requerido' })

    if (!password) return res.status(400).json({ error: 'Contraseña es un campo requerido' })

    User.findOne({ email: email.toLowerCase() }, function (err, user) {
        if (err) res.status(400).json({ error: err })

        if (!user) return res.status(400).json({ message: 'No existe el usuario con ese correo electrónico.' })
        else {
            const hash = crypto.pbkdf2Sync(password, user.salt, 200000, 64, 'sha512').toString('hex')
            if (user.hash !== hash) return res.status(400).json({ message: 'Correo y/o contraseña incorrectas.' })
            else {
                const token = user.createToken(user) // Create token no funciona como deberia, ya que no reconce el objeto this
                
                return res.status(200).json({ message: 'Usuario ingresado correctamente', token: token, nickname: user.nickname, role: user.role })
            }
        }
    })
}

/************************ GET LOGIN USER METHOD******************************/
export const getUser = (req, res) => {
    const { _id } = req.body
    User.findById(_id).then(user =>
        res.status(200).json({ user: user })
    )
        .catch(err => res.status(400).json({ error: err }))
}