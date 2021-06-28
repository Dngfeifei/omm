import { useMemo } from 'react'

import useDictMap from '@/page/ans/formmaking/hooks/useDictMap'

export default function useDictTypeItemList(options) {
  const dictMap = useDictMap()

  const optionList = useMemo(() => {
    if (options.remote === 3) {
      return dictMap[options.dictType] || []
    } else {
      return options.options
    }
  }, [options.remote, options.dictType, options.options])

  return optionList
}

