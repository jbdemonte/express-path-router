module.exports = {
  middlewares: [
    function () {
      return 'USER-GET-1';
    },
    function () {
      return 'USER-GET-2';
    }
  ],
  callback: function () {
    return 'USER-GET-3';
  }
};