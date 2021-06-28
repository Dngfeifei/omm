import { useState, useEffect } from 'react'

import { getDictMap } from '@/api/dict'

export default function useDictMap() {
  const [dictMap, setDictMap] = useState([])

  useEffect(() => {
    getDictMap()
      .then(resp => {
        setDictMap(resp.dictList)
      })
  }, [])

  return dictMap
}

