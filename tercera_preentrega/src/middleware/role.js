export const isAdmin = (req, res, next) => {
    if (req.session.user.role === 'admin') {
        return next();
    } else {
        res.redirect('/api/products');
    }
};