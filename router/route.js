import { Router } from "express";
import query from '../model/query.model.js'
const router = Router();
import upload from '../multer.js';
/** import all controllers */
import * as controller from '../controllers/appController.js';
import { registerMail } from '../controllers/mailer.js'
import fs from 'fs';
import path from 'path';
const dataFile = path.join('data.json');
import cloudinary from "../Cloudinary.js";
import ClubsModel from '../model/Clubs.model.js';
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
import ladcModel from "../model/ladc.model.js";
import zealModel from "../model/zeal.model.js";
import netraModel from "../model/netra.model.js";

/** POST Methods */
router.get('/signup', (req, res) => {
    res.render('login');
})
router.get('/resetPassword', (req, res) => {
    res.render('resetPass');
})
router.route('/signup').post(upload.single('image'), controller.signUp); // register user
router.route('/registerMail').post(registerMail); // send the email
router.route('/login').post(controller.verifyUser, controller.login); // login in app

/** GET Methods */
router.route('/user/:id').get(controller.getUser) // user with id
router.get('/alluser', isAuthenticatedUser, controller.allUser);

router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword);
// use to reset password

router.get('/clubs/gdsc/all', (req, res) => {
    res.render('clubs');
});
router.get('/clubs/ladc/all', (req, res) => {
    res.render('ladc');
});
router.get('/clubs/zeal/all', (req, res) => {
    res.render('zeal');
});
router.get('/clubs/netra/all', (req, res) => {
    res.render('netra');
});
router.get('/clubs/rtist/all', (req, res) => {
    res.render('rtist');
});
router.get('/', (req, res) => {
    res.render('index');
});
router.get('/canteen', (req, res) => {
    res.render('canteen');
})

router.get('/clubs', (req, res) => {
    res.render('club');
})
router.get('/afterloginHome', (req, res) => {
    res.render('home');
})
router.get('/live', (req, res) => {
    res.render('livestream');
})
router.get('/canteen', async(req, res) => {

    await fs.readFile(dataFile, "utf-8", (err, data) => {
        if (err) console.log(err);
        if (data) {
            const totalVotes = Object.values(JSON.parse(data)).reduce((total, n) => total += n, 0);
            let value = Object.entries(JSON.parse(data)).map(([label, votes]) => {
                return {
                    label,
                    percentage: (((100 * votes) / totalVotes) || 0).toFixed(0)

                }
            });
            res.render(value);
        }
    });
});

router.post('/samosa/nc', async(req, res) => {

    await fs.readFile(dataFile, "utf-8", async(err, data) => {
        if (err) console.log(err);
        if (data) {
            const value = JSON.parse(data);
            // let chk = document.getElementById()
            console.log(req.body);
            console.log(req.body.name);
            value[req.body.name]++;
            await fs.writeFile(dataFile, JSON.stringify(value), () => console.log("file written"));

            // console.log(percentage);
            res.send("thank u for voting..");
        }
    });
});
router.post('/samosa/cc', async(req, res) => {
    await fs.readFile(dataFile, "utf-8", async(err, data) => {
        if (err) console.log(err);
        if (data) {
            const value = JSON.parse(data);
            // let chk = document.getElementById()
            console.log(req.body);
            value[req.body.name]++;
            await fs.writeFile(dataFile, JSON.stringify(value), () => console.log("file written"));
            res.send("thank u for voting..");
        }
    });
});
router.post('/samosa/yc', async(req, res) => {

    try {

        await fs.readFile(dataFile, "utf-8", async(err, data) => {
            if (err) console.log(err);
            if (data) {
                const value = JSON.parse(data);
                // let chk = document.getElementById()
                console.log(req.body);
                value[req.body.name]++;
                res.redirect('canteen')
                await fs.writeFile(dataFile, JSON.stringify(value), () => console.log("file written"));
                await fs.readFile(dataFile, "utf-8", async(err, data) => {
                    if (err) console.log(err);
                    if (data) {
                        // const totalVotes = Object.values(JSON.parse(data)).reduce((total, n) => total += n, 0);
                        // let value = await Object.entries(JSON.parse(data)).map(([label, votes]) => {
                        //     return {
                        //         label,
                        //         percentage: (((100 * votes) / totalVotes) || 0).toFixed(0)
                        //     }
                        // });
                        console.log("value");

                        res.render('canteen');
                        // res.render('canteen', {percentage:value.yc});
                    }
                });

            }
        });
    } catch (error) {
        console.log(error)
    }
});


router.post('/feedback', (req, res) => {
    const { name, email, phone, message } = req.body;
    const query1 = new query({
        name,
        email,
        phone,
        message
    });
    query1.save().then(() => res.status(201).json(`thank you ${name}.`)).catch(err => console.log(err));
})



router.get('/clubs/gdsc/all', async(req, res) => {

    await ClubsModel.find().then((info) => {
            res.status(201).render('clubs', { info });
        })
        .catch((err) => res.status(401).send("clubs haven't any info.."));
});

router.post('/clubs/gdsc', upload.single('image'), async(req, res) => {

    if (!req.body.image) {
        const club = new ClubsModel({
            message: req.body.message
        }).save().then(() => res.redirect('/clubs/gdsc/all')).catch(err => console.log(err));
    } else {
        const reslt = await cloudinary.v2.uploader.upload(req.file.path);
        const club = new ClubsModel({
            message: req.body.message,
            url: reslt.secure_url,
        })
        await club.save().then(() => res.status(201).redirect('/clubs/gdsc/all')).catch(err => console.log(err));

    }
})

router.get('/clubs/netra/all', async(req, res) => {

    await netraModel.find().then((info) => {
            res.status(201).render('clubs', { info });
        })
        .catch((err) => res.status(401).send("clubs haven't any info.."));
});

router.post('/clubs/netra', upload.single('image'), async(req, res) => {

    if (!req.body.image) {
        const club = new netraModel({
            message: req.body.message
        }).save().then(() => res.redirect('/clubs/netra/all')).catch(err => console.log(err));
    } else {
        const reslt = await cloudinary.v2.uploader.upload(req.file.path);
        const club = new netraModel({
            message: req.body.message,
            url: reslt.secure_url,
        })
        await club.save().then(() => res.status(201).redirect('/clubs/netra/all')).catch(err => console.log(err));

    }
})
router.get('/clubs/zeal/all', async(req, res) => {

    await zealModel.find().then((info) => {
            res.status(201).render('clubs', { info });
        })
        .catch((err) => res.status(401).send("clubs haven't any info.."));
});

router.post('/clubs/zeal', upload.single('image'), async(req, res) => {

    if (!req.body.image) {
        const club = new zealModel({
            message: req.body.message
        }).save().then(() => res.redirect('/clubs/zeal/all')).catch(err => console.log(err));
    } else {
        const reslt = await cloudinary.v2.uploader.upload(req.file.path);
        const club = new zealModel({
            message: req.body.message,
            url: reslt.secure_url,
        })
        await club.save().then(() => res.status(201).redirect('/clubs/zeal/all')).catch(err => console.log(err));

    }
})
router.get('/clubs/ladc/all', async(req, res) => {

    await ladcModel.find().then((info) => {
            res.status(201).render('clubs', { info });
        })
        .catch((err) => res.status(401).send("clubs haven't any info.."));
});

router.post('/clubs/ladc', upload.single('image'), async(req, res) => {

    if (!req.body.image) {
        const club = new ladcModel({
            message: req.body.message
        }).save().then(() => res.redirect('/clubs/ladc/all')).catch(err => console.log(err));
    } else {
        const reslt = await cloudinary.v2.uploader.upload(req.file.path);
        const club = new ladcModel({
            message: req.body.message,
            url: reslt.secure_url,
        })
        await club.save().then(() => res.status(201).redirect('/clubs/ladc/all')).catch(err => console.log(err));

    }
})



//routrer for files 
router.get('/about', (req, res) => {
    res.render('about');
})
router.get('/courses', (req, res) => {
    res.render('courses');
})
router.get('/contact', (req, res) => {
    res.render('contact');
})
router.get('/feedback', (req, res) => {
    res.render('contact');
})
router.get('/food', (req, res) => {
    res.render('canteen');
})
router.get('/events', (req, res) => {
    res.render('events');
})
export default router;