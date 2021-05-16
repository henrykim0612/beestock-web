var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ckeditor5CustomUploadAdapter = function () {

  function customUploadAdaptor(loader) {
    _classCallCheck(this, customUploadAdaptor);

    // CKEditor5's FileLoader instance.
    this.loader = loader;
    // URL where to send files.
    this.url = CONTEXT_PATH + "/common/ckeditor5/upload.do";
  }
  // Starts the upload process.

  _createClass(customUploadAdaptor, [{
    key: "upload",
    value: function upload() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this._initRequest();
        _this._initListeners(resolve, reject);
        _this._sendRequest();
      });
    }
    // Aborts the upload process.
  }, {
    key: "abort",
    value: function abort() {
      if (this.xhr) {
        this.xhr.abort();
      }
    }
    // Example implementation using XMLHttpRequest.

  }, {
    key: "_initRequest",
    value: function _initRequest() {
      var xhr = this.xhr = new XMLHttpRequest();
      xhr.open("POST", this.url, true);
      xhr.responseType = "json";
    }
    // Initializes XMLHttpRequest listeners.

  }, {
    key: "_initListeners",
    value: function _initListeners(resolve, reject) {
      var xhr = this.xhr;
      var loader = this.loader;
      var genericErrorText = "Couldn't upload file:" + (" " + loader.file.name + ".");
      xhr.addEventListener("error", function () {
        return reject(genericErrorText);
      });
      xhr.addEventListener("abort", function () {
        return reject();
      });
      xhr.addEventListener("load", function () {
        var response = xhr.response;
        if (!response || response.error) {
          return reject(response && response.error ? response.error.message : genericErrorText);
        }
        // If the upload is successful, resolve the upload promise with an object containing
        // at least the "default" URL, pointing to the image on the server.
        if (response[0].status === 0) {
          // 파일 사이즈 초과함
          cmmUtils.showWarningModal(response[0].originalFileName + ' 파일 사이즈 초과', '3MB를 초과한 이미지는 첨부할 수 없습니다.');
          reject();
        } else if(response[0].status === -1) {
          // 총 사용량 초과
          cmmUtils.showWarningModal('첨부 이미지 사용량 초과', '첨부 가능한 이미지 사용량을 초과하였습니다.');
          reject();
        } else {
          resolve({
            default: getCkeditor5DownloadUrl(response[0])
          });
        }

      });
      if (xhr.upload) {
        xhr.upload.addEventListener("progress", function (evt) {
          if (evt.lengthComputable) {
            loader.uploadTotal = evt.total;
            loader.uploaded = evt.loaded;
          }
        });
      }
    }
    // Prepares the data and sends the request.

  }, {
    key: "_sendRequest",
    value: function _sendRequest() {
      var data = new FormData();
      var that = this;
      var file = that.loader.file;
      // set jwt token if required.
      // that.xhr.setRequestHeader("Authorization", authHeader().Authorization);
      file.then(function (result) {
        //wait for the promise to finish then continue
        data.append("upload", result);
        that.xhr.send(data);
      });
    }
  }]);

  return customUploadAdaptor;
}();

/**
 * return full image url with responsed JSON object
 *
 * @param {*} item
 */


function getCkeditor5DownloadUrl(item) {
  return encodeURI(CONTEXT_PATH + "/common/image/" + item.linkId + '.do');
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = function (loader) {
    return new ckeditor5CustomUploadAdapter(loader);
  };
}

