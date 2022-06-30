<template>
  <div v-html="parsedData"/>
</template>

<script setup>
import shortcode from 'shortcode-parser';

const props = defineProps({
  data: {
    type: String,
    required: true
  }
})


shortcode.add('ul', function(buf, opt) {
  let classes = '';
  if (opt.class) classes = opt.class
  return '<div class="'+classes+'">' + buf + '</div>';
});
shortcode.add('li', function(buf, opt) {
  let title = '';
  if (opt.title) title = '<div class="li-title">'+opt.title+'</div>';
  return `<div> ${title} <p class="m-t-0"> ${buf} </p></div>`;
});
shortcode.add('button', function(buf, opt) {
  let classes = '';
  if (opt.primary) classes = 'primary'
  return '<div class="m-v-32"><a href="'+opt.link+'" class="button '+classes+'">' + buf + '</a></div>';
});

let parsedData = shortcode.parse(props.data, {
  charcodes: function(buf, opts) {
    return marked(buf, opts);
  }
});

parsedData = allReplace(parsedData, ['<pre>', '<code>', '</pre>', '</code>'])




function allReplace(string, array) {
  var retStr = string;
  for (var x in array) {
    retStr = retStr.replace(new RegExp(array[x], 'g'), '');
  }
  return retStr;
}


</script>

<style lang="scss" scoped>
>>> .history {
  column-count: 2;
  color: $gray;

  &  > div {
    display: inline-flex;
    column-gap: 16px;
    align-items: baseline;
    border-top: 1px solid $border-dark;
    padding-top: 24px;
    margin-top: 40px;
  }

  .li-title {
    font-size: 24px;
    font-weight: bold;
    color: $dark-blue;
  }
}
>>> .key {
  display: grid;
  grid-gap: 40px;
  grid-template-columns: repeat(3, 1fr);
  color: $gray;
  text-align: center;

  &  > div {
    padding: 0 40px;
  }

  .li-title {
    font-size: 32px;
    margin-bottom: 16px;
    font-weight: bold;
    color: $dark-blue;
  }
}
@include md {
  >>> .history {
    column-count: 1;
    &  > div {
      padding-top: 16px;
      margin-top: 16px;
    }

    .li-title {
      font-size: 20px;
    }
  }

  >>> .key {
    grid-gap: 20px;
    p {
      line-height: 1.2em;
    }
    &  > div {
      padding: 0 0px;
    }

    .li-title {
      font-size: 24px;
      margin-bottom: 8px;
    }
  }
}

</style>
