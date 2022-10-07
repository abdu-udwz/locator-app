<script setup lang="ts">
import { toRef, computed } from 'vue'
import useStore from '../store';
import useNavigation from '../navigation';

const { store } = useStore()
const { currentBlock } = useNavigation()
const center = computed(() => currentBlock.value?.coordinates ?? [0, 0])

const fullSource = computed(() => {
  let url = new URL('https://www.google.com/maps/embed/v1/view')

  const params = new URLSearchParams()
  params.append('key', import.meta.env.VITE_GMAP_API_KEY)
  params.append('zoom', store.zoom.toString())
  params.append('maptype', 'satellite')
  params.append('center', `${center.value[0]}, ${center.value[1]}`)

  return url + '?' + params.toString()
})

const mapViewFrame = toRef(store, 'mapViewFrame')
</script>

<template>
  <div
    ref="mapViewFrame"
    style="height: 100%; width: 100%"
  >
    <iframe
      v-if="currentBlock != null"
      id="map-view"
      ref="mapViewFrame"
      width="100%"
      height="100%"
      frameborder="0"
      style="border: 0"
      referrerpolicy="no-referrer-when-downgrade"
      :src="fullSource"
      allowfullscreen
    ></iframe>
    <VCard 
      v-else
      class="d-flex flex-column justify-center text-center"
      width="100%"
      height="100%"
    >
      <VCardTitle>
        No data to display.
      </VCardTitle>
      <VCardSubtitle>
        Please load a mission or start a new mission.
      </VCardSubtitle>
    </VCard>
  </div>  
</template>

<style scoped>

</style>
