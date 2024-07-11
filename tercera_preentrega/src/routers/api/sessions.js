import { Router } from 'express';
import passport from 'passport'

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: 'failregister' }), async (req, res) => {
    res.redirect('/login')
});


router.post('/failregister', (req, res) => {
    console.log(("Estrategia Fallida"))
    res.send({ error: "Fallo" })
})
router.post('/login', passport.authenticate('login', { failureRedirect: 'faillogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Datos incompletos" })
    try {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role || "",
            cartId: req.user.cartId
        };

        res.redirect('/api/products');


    } catch (err) {
        console.log(err)
        res.status(500).send('Error al iniciar sesión');
    }
});

router.get('/faillogin', (req, res) => {
    res.send({ error: "Usuario o Clave Incorrecta" })
})

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});




router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })


router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {

    await addCartToUser(req.user)

    req.session.user = req.user
    res.redirect("/api/products")
})

export default router;