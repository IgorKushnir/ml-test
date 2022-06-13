<template>
  <div class="fact">
    <h2>This collection is also about the love, work, and creativity</h2>
    <p>This collection is also about the love, work, and creativity put into producing a wedding, which reflects the personal style of bride.</p>
  </div>
</template>

<script>
export default {
  name: "Fact"
}
</script>

<style scoped lang="scss">
.fact {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: $pink;
  text-align: center;
  padding: 40px;
  * {
    max-width: 400px;
    margin-top: unset;
  }
}
</style>
