module.exports = {
  middlewares: [
    function () {
      return 'USER-GET-ID-1';
    },
    function () {
      return 'USER-GET-ID-2';
    }
  ],
  callback: function () {
    return 'USER-GET-ID-3';
  }
};