var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice;

(function($, window) {
  var InputLimit;
  InputLimit = (function() {
    InputLimit.prototype.defaults = {
      limit: 2,
      regexp: '[0-9,]+(\.[0-9][0-9]?)?',
      onInit: function() {},
      onDestroy: function() {}
    };

    function InputLimit(el, options) {
      this.destroy = bind(this.destroy, this);
      this.process = bind(this.process, this);
      this.extractNumbers = bind(this.extractNumbers, this);
      this.hasDecimalCorrect = bind(this.hasDecimalCorrect, this);
      this.limitValue = bind(this.limitValue, this);
      this.setVal = bind(this.setVal, this);
      this.getVal = bind(this.getVal, this);
      this.options = $.extend({}, this.defaults, options);
      this.$el = $(el);
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

    InputLimit.prototype.limitValue = function() {
      var int;
      int = this.val.replace(',', '');
      this.setVal(parseInt(int).toFixed(this.options.limit));
      return this.$el.trigger('spinchange');
    };

    InputLimit.prototype.hasDecimalCorrect = function() {
      var curPos, expPos;
      curPos = this.val.lastIndexOf('.');
      expPos = this.val.length - 3;
      if ((curPos === expPos) && (curPos > 0)) {
        return true;
      } else {
        return false;
      }
    };

    InputLimit.prototype.extractNumbers = function() {
      var regexp;
      if (this.val !== null) {
        regexp = this.options.regexp;
        return this.val.match(regexp);
      }
    };

    InputLimit.prototype.process = function() {
      var extr, num;
      this.getVal();
      extr = this.extractNumbers();
      if (extr) {
        num = extr[0];
        console.log('Current Value', this.val);
        console.log('Extracted Numbers', num);
        if ((this.val !== num) && (this.val !== num + '.')) {
          this.setVal(num);
          return this.limitValue();
        }
      }
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
