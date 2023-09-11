<template>
    <h1 class="text-white text-2xl text-center pb-5" >Listado de usuarios en linea</h1>
    <div v-if="players" class="flex text-white text-base justify-center">

        <div class="grid grid-cols-1 gap-1" v-for="player in players" v-bind:key="player.uuid">
            <p >🟢 {{ player.name }}</p>

        </div>
    </div>
    <div v-else>
        <div class="text-center text-base text-white">
<p>🔴 Sin conexiones 🔴</p>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    players: Array
})



</script>