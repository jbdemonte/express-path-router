module.exports = {
  middlewares: [
    function () {
      return 'PRODUCT-GET-ID-1';
    },
    function () {
      return 'PRODUCT-GET-ID-2';
    }
  ],
  callback: function () {
    return 'PRODUCT-GET-ID-3';
  }
};