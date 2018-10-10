'use strict';

var path = require('path');

var async = require('async');
var cloudinary = require('cloudinary');


exports.config = function (config) {
  cloudinary.config({
    // jscs:disable
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret
    // jscs:enable
  });
};

function uploadImage(options, imagePath, done) {
  function callback(error, result) {
    var augmentedResult = {
      name: path.basename(imagePath),
      url: path.resolve(imagePath),
      cloudinaryData: result
    };
    done(null, augmentedResult);
  }
  cloudinary.v2.uploader.upload(imagePath, options, callback);
}

exports.uploadImages = function (images, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  async.mapLimit(images, 10, uploadImage.bind(null, options), callback);
};
