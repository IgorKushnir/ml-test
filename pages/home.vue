<template>
    <div>
        <h1>Home page - </h1>
        {{pending}}
        <ul v-if="pending">
            <li v-for="(item, index) in api.sections">
                {{index+1}} - {{item.name}}
            </li>
        </ul>
        <div v-else>loading</div>

    </div>
</template>

<script setup>
    const url = 'https://firebasestorage.googleapis.com/v0/b/milkgroupdelivery.appspot.com/o/json%2F12972-uk.json?alt=media&token=1e80c73a-dda3-44c2-a9fe-f7cea26968bc';
    // const { pending, data: api } =  await useLazyFetch(url)
</script>

<style scoped>
    body {
        background-color: antiquewhite;
    }
    h1 {
        color: red;
    }

</style>


