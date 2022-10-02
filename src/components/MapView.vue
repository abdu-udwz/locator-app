<script setup lang="ts">
import { computed } from 'vue'
import useStore from '../store';

const { store } = useStore()

const center = computed((): [number, number] => {
  return store.matrix[store.currentBlock.row][store.currentBlock.col]
})

const fullSource = computed(() => {
  let url = new URL('https://www.google.com/maps/embed/v1/view')

  const params = new URLSearchParams()
  params.append('key', import.meta.env.VITE_GMAP_API_KEY)
  params.append('zoom', store.zoom.toString())
  params.append('maptype', 'satellite')
  params.append('center', `${center.value[0]}, ${center.value[1]}`)

  return url + '?' + params.toString()
})

</script>

<template>
  <iframe
    width="100%"
    height="100%"
    frameborder="0"
    style="border: 0"
    referrerpolicy="no-referrer-when-downgrade"
    :src="fullSource"
    allowfullscreen
  ></iframe>
</template>

<style scoped>

</style>
