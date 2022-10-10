import { computed } from 'vue'
import type { Ref } from 'vue'

export default function useBlockStyles(size?: Ref<number>) {
  return {
    size: computed(() => {
      if (size == null) {
        return {}
      }
      
      const sizeStr =  `${size.value}px`
      return {
        minWidth: sizeStr,
        maxWidth: sizeStr,
        height: sizeStr
      }
    }),

    priorityColors: [
      undefined, 
      'teal lighten-1',
      'green lighten-1',
      'amber', 
      'deep-orange'
    ]
  }
}