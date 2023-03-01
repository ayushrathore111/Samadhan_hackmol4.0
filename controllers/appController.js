import UserModel from '../model/User.model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import cloudinary from '../Cloudinary.js';

/** middleware for verify user */
export async function verifyUser(req, res, next) {
    try {

        const email = req.body.email;

        // check the user existence
        let exist = await UserModel.findOne({ email });
        if (!exist) return res.status(404).send({ error: "Can't find User!" });
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" });
    }
}

export const signUp = async(req, res) => {

    try {
        await bcrypt.hash(req.body.password, 10).then(async hashedPass => {
            const reslt = await cloudinary.uploader.upload(req.file.path);
            const user = new UserModel({
                name: req.body.name,
                password: hashedPass,
                email: req.body.email,
                url: reslt.secure_url,
                cloudinary_id: reslt.public_id
            })
            await user.save().then(() => res.status(201).render('home', { name: user.name, url: user.url })).catch(err => console.log(err));
        })
    } catch (err) {
        console.log(err);
    }
}

export async function login(req, res) {
    const { email, password } = req.body;
    try {
        await UserModel.findOne({ email })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {
                        if (!passwordCheck) return res.status(400).send({ error: "Don't have Password" });
                        // create jwt token
                        const token = jwt.sign({
                            userId: user._id,
                            name: user.name
                        }, ENV.JWT_SECRET, { expiresIn: "24*100000" });
                        console.log({
                            msg: "Login Successful...!",
                            email: user.email,
                            token
                        });
                        res.status(201).render('home', { name: user.name, url: user.url });
                    })
                    .catch(error => {
                        return res.status(400).send({ error: "Password does not Match" })
                    })
            })
            .catch(error => {
                return res.status(404).send({ error: "Username not Found" });
            })
    } catch (error) {
        return res.status(500).send({ error });
    }
}
export async function getUser(req, res) {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) res.status(401).send("user not found.");
        res.status(201).json(user);
    } catch (error) {
        return res.status(404).json("Cannot Find User Data");
    }
}
export async function allUser(req, res) {
    try {
        const user = await UserModel.find();
        if (user) {
            res.status(201).json(user);
        }
        res.status(401).send("users not exist.");
    } catch (err) {
        console.log(err);
    }
}

export async function resetPassword(req, res) {
    try {

        if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" });

        const { name, password } = req.body;

        try {

            UserModel.findOne({ name })
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ name: user.name }, { password: hashedPassword }, function(err, data) {
                                if (err) throw err;
                                req.app.locals.resetSession = false; // reset session
                                console.log(`password updated of user ${user.name} `);
                                return res.status(201).render('home');
                            });
                        })
                        .catch(e => {
                            return res.status(500).send({
                                error: "Enable to hashed password"
                            })
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error: "Username not Found" });
                })

        } catch (error) {
            return res.status(500).send({ error })
        }

    } catch (error) {
        return res.status(401).send({ error })
    }
}