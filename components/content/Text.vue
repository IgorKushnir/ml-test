<template>
  <div class="text-content" v-html="data"/>
<!--  <div>{{data}}</div>-->
</template>

<script setup>

const props = defineProps({
  data: {
    type: String,
    required: true
  }
})





</script>





<style lang="scss">


.text-content {
  height: 100%;
  *:first-child {
    margin-top: 0;
  }
  *:last-child {
    margin-bottom: 0;
  }
}
.text-content img {
  max-width: 100%;
  background-image: unset;
}


.text-content > .history {
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
.text-content > .timeline-list {
  & ul {
    list-style: none !important;
    padding-inline-start: 0;
  }

  & > ul {
    column-count: 2;
    color: $gray;

    & > li {
      display: inline-flex;
      column-gap: 16px;
      align-items: baseline;
      border-top: 1px solid $border-dark;
      padding-top: 24px;
      margin-top: 40px;

      & > p {
        font-size: 24px;
        font-weight: bold;
        color: $dark-blue;
      }
    }
  }
}



.text-content > .key-list {
  & ul {
    list-style: none!important;
    padding-inline-start: 0;
    text-align: center;
  }

  & > ul {
    display: grid;
    grid-gap: 40px;
    grid-template-columns: repeat(3, 1fr);
    color: $gray;
    li {
      max-width: 180px;
      margin: 0 auto;
    }
    p {
      margin-top: unset;
    }
    & > li > p {
      font-size: 32px;
      margin-bottom: 16px;
      font-weight: bold;
      color: $dark-blue;
    }
  }
}






.block-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  p {
    max-width: 340px;
  }
}




@include md {
  .text-content > .timeline-list {
    & > ul {
      column-count: 1;
      & > li {
        padding-top: 16px;
        margin-top: 16px;
        & > p {
          font-size: 20px;
        }
      }
    }
  }

  .text-content >  .key-list {
    & > ul {
      grid-gap: 20px;
      color: $gray;
      line-height: 1.2em;
      & > li > p {
        font-size: 24px;
        margin-bottom: 8px;
      }
    }

  }





}


// Table
.text-content table {
  width: 100%;
  border-spacing: 0;
  p {
    font-size: 16px;
  }
  th {
    background-color: $gray;
    p {
      color: $white;
      text-align: left;
    }
  }
  tr:nth-child(2n) {
    background-color: rgb($light-gray, 0.5);
  }
  tr:nth-child(2n -1) {
    background-color: $light-gray;
  }
  tr {
    height: 48px;
  }
  th {
    height: 64px;
  }
  td, th {
    padding: 0 16px;
  }
}

</style>
