import { useState, useEffect } from 'react'

import { getDictTypeList } from '@/api/dict'

export default function useDictTypeList() {
  const [dictTypeList, setDictTypeList] = useState([])
  useEffect(() => {
    getDictTypeList({
      pageSize: -1,
      pageNo: 1,
    }).then(resp => {
      setDictTypeList(resp.page.list.map(item => {
        return {
          label: item.description,
          value: item.type,
        }
      }))
    })
  }, [])

  return dictTypeList
}

