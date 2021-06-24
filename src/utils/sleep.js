const sleep = async (milliseconds) => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      resolve(null);
    }, milliseconds);
  });
};

module.exports = sleep;
