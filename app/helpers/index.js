const errField = (error = {}) => {
  let obj = {};
  for (const field in error.errors) {
    // console.log(error.errors.hasOwnProperty(field));
    if (error.errors.hasOwnProperty(field)) {
      obj[error.errors[field].path] = {
        message: error.errors[field].message,
      };
    }
  }

  return [obj];
};

module.exports = { errField };
