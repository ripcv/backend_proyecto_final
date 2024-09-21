export const ROLES = {
  admin: "admin",
  user: "user",
  premium: "premium",
};

export const authorize = (roles) => {
  return (req, res, next) => {
    
    if (!roles.includes(req.session.user.role)) {
      //return res.status(403).send({ error: 'Access denied' });
      return res.redirect("/");
    }
    next();
  };
};
