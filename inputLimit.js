var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice;

(function($, window) {
  var InputLimit;
  InputLimit = (function() {
    InputLimit.prototype.defaults = {
      numberLimit: false,
      decimalLimit: false,
      onInit: function() {},
      onDestroy: function() {}
    };

    function InputLimit(el, options) {
      this.destroy = bind(this.destroy, this);
      this.process = bind(this.process, this);
      this.extractNumbers = bind(this.extractNumbers, this);
      this.setVal = bind(this.setVal, this);
      this.getVal = bind(this.getVal, this);
      this.options = $.extend({}, this.defaults, options);
      this.$el = $(el);
      this.decimalLimit = this.$el.attr('data-limitdecimal') || this.options.decimalLimit;
      this.numberLimit = this.$el.attr('data-limitnumber') || this.options.numberLimit;
      this.bind();
      this.options.onInit(this.$el, this.getVal());
    }

    InputLimit.prototype.bind = function() {
      return this.$el.on('input propertychange', this.process);
    };

    InputLimit.prototype.unbind = function() {
      return this.$el.off('input propertychange');
    };

    InputLimit.prototype.getVal = function() {
      return this.val = this.$el.val();
    };

    InputLimit.prototype.setVal = function(value) {
      return this.$el.val(value);
    };

    InputLimit.prototype.buildRegex = function() {
      var allowedChars, decLimit, numLimit, regex;
      allowedChars = '';
      this.allowedDecimals = 0;
      if (this.allowedChars) {
        allowedChars = this.allowedChars;
      }
      numLimit = '[0-9' + allowedChars + ']';
      decLimit = '';
      if (this.numberLimit && this.numberLimit !== 'false') {
        numLimit += '{1,' + this.numberLimit + '}';
      } else {
        numLimit += '+';
      }
      if (this.decimalLimit && this.decimalLimit !== 'false') {
        console.log(this.decimalLimit);
        decLimit = '(\\.[0-9]{1,' + this.decimalLimit + '})?';
        this.allowedDecimals = 1;
      }
      regex = new RegExp(numLimit + decLimit);
      console.log(regex);
      return regex;
    };

    InputLimit.prototype.extractNumbers = function() {
      if (this.val !== null) {
        return this.val.match(this.buildRegex());
      }
    };

    InputLimit.prototype.process = function() {
      var extr, num;
      this.getVal();
      extr = this.extractNumbers();
      if (extr) {
        num = extr[0];
        if (((this.val !== num) && (this.val !== num + '.')) || (this.occurrances(this.val) > this.allowedDecimals)) {
          return this.setVal(num);
        }
      }
    };

    InputLimit.prototype.occurrances = function(haystack) {
      return (haystack.match(/\./g) || []).length;
    };

    InputLimit.prototype.destroy = function() {
      this.unbind();
      return this.options.onDestroy(this.$el, this.getVal());
    };

    return InputLimit;

  })();
  return $.fn.extend({
    inputLimit: function() {
      var args, option;
      option = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      return this.each(function() {
        var $this, data;
        $this = $(this);
        data = $this.data('inputLimit');
        if (!data) {
          $this.data('inputLimit', (data = new InputLimit(this, option)));
        }
        if (typeof option === 'string') {
          return data[option].apply(data, args);
        }
      });
    }
  });
})(window.jQuery, window);
