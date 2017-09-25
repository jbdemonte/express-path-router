module.exports = {
  middlewares: [
    function () {
      return 'USER-POST-ID-1';
    },
    function () {
      return 'USER-POST-ID-2';
    }
  ],
  callback: function () {
    return 'USER-POST-ID-3';
  }
};