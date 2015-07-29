do($ = window.jQuery, window) ->

  # Define the plugin class
  class InputLimit

    defaults:
      numberLimit: false
      decimalLimit: false
      onInit: ->
      onDestroy: ->

    # Construct / init the plugin
    constructor: (el, options) ->
      @options = $.extend({}, @defaults, options)
      @$el = $(el)
      
      @decimalLimit = @$el.attr('data-limitdecimal') || @options.decimalLimit
      @numberLimit = @$el.attr('data-limitnumber') || @options.numberLimit
      
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
      
    # Build the regex from options
    buildRegex: ->      
      allowedChars = ''
      @allowedDecimals = 0
      
      if @allowedChars
        allowedChars = @allowedChars
        
      numLimit = '[0-9' + allowedChars + ']'
      decLimit = ''
        
      if @numberLimit
        numLimit += '{1,' + @numberLimit + '}'
      else 
        numLimit += '+'

      if @decimalLimit
        decLimit = '(\\.[0-9]{1,' + @decimalLimit + '})?'
        @allowedDecimals = 1

      regex = new RegExp numLimit + decLimit
      console.log regex

      return regex

    extractNumbers: =>
      if @val != null
        return @val.match( @buildRegex() )

    process: =>
      # Set the current value so we can access it anywhere
      # without having to read it all the time
      @getVal()
      extr = @extractNumbers()
      
      # If there are captured numbers
      if extr
        num = extr[0]

        # Only update the value if
        # - the capture is different to the value 
        # - AND there is no '.' present after the capture
        # - OR there is no more than one '.' present
        if ((@val != num) && (@val != num + '.')) || ( @occurrances(@val) > @allowedDecimals)
          @setVal( num )
          
    # Simple function to check how many times
    # a decimal appears in a string
    occurrances: (haystack) ->
      return (haystack.match( /\./g ) || []).length

    # Remove the function and handlers
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
