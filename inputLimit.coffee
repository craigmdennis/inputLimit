do($ = window.jQuery, window) ->

  # Define the plugin class
  class InputLimit

    defaults:
      limit: 2
      step: 50
      regexp: '[0-9,]+(\.[0-9][0-9]?)?'
      onInit: ->
      onDestroy: ->

    # Construct / init the plugin
    constructor: (el, options) ->
      @options = $.extend({}, @defaults, options)
      @$el = $(el)
      @bind()
      @options.onInit( @$el, @getVal() )

    # Bind event handlers
    bind: ->
      @$el.on 'input propertychange', @process

    unbind: ->
      @$el.off 'input propertychange'

    getVal: =>
      @val = @$el.val()

    setVal: (value) =>
      @$el.val( value )

    limitValue: =>
      # Remove comas from the value
      int = @val.replace(',', '')

      # Return a 2 decimal place value and prefix the symbol
      @setVal( parseInt( int ).toFixed( @options.limit ) )

      # Tell any spinners attached that the value needs parsing again
      # We don't use `@$el.spinner('value', @val )`
      # because we can't be sure there is one attached or that it's even included
      @$el.trigger('spinchange')

    hasDecimalCorrect: =>
      curPos = @val.lastIndexOf( '.' )
      expPos = @val.length - 3

      # console.log 'Current Decimal Position:', @val.lastIndexOf( '.' )
      # console.log 'Expected Decimal Position:', @val.length - 3

      if (curPos == expPos) && (curPos > 0)
        return true
      else
        return false

    extractNumbers: =>
      if @val != null
        regexp = @options.regexp
        return @val.match(regexp)

    process: =>
      # Set the current value so we can access it anywhere
      # without having to read it all the time
      @getVal()
      extr = @extractNumbers()
      if extr
        num = extr[0]

        console.log 'Current Value', @val
        console.log 'Extracted Numbers', num

        # Check to make sure the value is different to the regex
        # before we make any changes as the caret will move
        # to the end of the input
        if (@val != num) && (@val != num + '.')
          @setVal( num )
          @limitValue()

    destroy: =>
      @unbind()
      @options.onDestroy( @$el, @getVal() )



  # Define the plugin
  $.fn.extend inputLimit: (option, args...) ->
    @each ->
      $this = $(this)
      data = $this.data('inputLimit')

      if !data
        $this.data 'inputLimit', (data = new InputLimit(this, option))
      if typeof option == 'string'
        data[option].apply(data, args)
