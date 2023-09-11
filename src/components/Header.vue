<template>

    <nav class="">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-8">
        <a href="/" class="flex items-center relative  z-10">
          <img
            :src="cube.src"
            class="h-8 mr-3" alt="Minecraft cube svg" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            CentralCraft
          </span>
          <span v-show="isOnline"
            class="bg-green-500 text-black px-2 py-1 rounded-full text-xs absolute -top-4 -right-12 wooble">Online</span>
          <span v-show="!isOnline"
            class="bg-red-500 text-white px-2 py-1 rounded-full text-xs absolute -top-4 -right-12 wooble">Offline</span>
        </a>

        <div class="hidden w-full md:block md:w-auto z-10" id="navbar-default">

          

          <ul
            class="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:border-gray-700">
                
            <li>
              <a href="https://paypal.me/blackpiorg?country.x=HN&locale.x=es_XC"
                class="inline-block bg-white px-4 py-2 bg-white-500 text-black font-bold hover:shadow-[0_10px_15px_rgba(150,255,255,100)] rounded-lg shadow-md">
                💳 Donar
              </a>

            </li>
            <li>
              <a href="/contact"
                class="inline-block bg-white px-4 py-2 bg-white-500 text-black font-bold hover:shadow-[0_10px_15px_rgba(150,255,255,100)] rounded-lg shadow-md">
                📱 Contacto
              </a>

            </li>
          </ul>
        </div>
      </div>
    </nav>

  
</template>
<style>
.wooble {
  animation: wobble 1s;
  animation-iteration-count: 1;
}

@keyframes wobble {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  50% {
    transform: translateX(5px);
  }

  75% {
    transform: translateX(-5px);
  }

  100% {
    transform: translateX(2px);
  }
}
</style>
<script setup>
import { ref } from 'vue';
import {getServerData, SERVER_HOST} from "../functions/fetchServerData"
import cube from "../cube.webp";

const isOnline = ref(true)

const data = getServerData(SERVER_HOST).then((data)=> {
  data.online ? isOnline.value = true : isOnline.value = false
})





</script>