# Input Limit
A jQuery plugin to limit the input of a text field to numbers, commas and decimal places

## Installation

1. Include the file `inputLimit.js` in your project

```html
<script src="/js/inputLimit.js"></script>
```

## Usage

```js
$('.js-inputlimit').inputLimit();
```

By default the input limit plugin only allows numbers to be entered into the input.

**The `<input>` must be `type="text"`**

## Options
Options can be passed in as `data-*` attributes.
```html
<input
  type="text"
  value="1.00
  class="js-inputlimit"
  data-limitdecimal=2
  data-limitnumber=3>
```

#### data-limitdecimal
How many decimal places. Default is false (no decimal places are allowed)

#### data-limitnumber
How many whole numbers are allowed (before the decimal place if present). Default is false (unlimited numbers are allowed)
