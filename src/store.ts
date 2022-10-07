import { reactive } from 'vue'

const store = reactive({
  zoom: 19,

  mapViewFrame: null as HTMLDivElement | null,  
})

export default function useStore () {
  return {
    store,
  }
}