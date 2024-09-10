export const roleOwnerCheck = (userId, owner, isAdmin, options) => {
  if (userId === owner.toString() || isAdmin === "admin") {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

export const roleCheck = (role, options) => {
  if (role === "premium" || role === "admin") {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

export const eq = (a, b, options) => {
  if (a === b) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};
