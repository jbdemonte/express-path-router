module.exports = {
  middlewares: [
    function () {
      return 'USER-PUT-1';
    },
    function () {
      return 'USER-PUT-2';
    }
  ],
  callback: function () {
    return 'USER-PUT-3';
  }
};