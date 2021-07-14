
export const  MutationType = {
  'prependColumn': 'prependColumn',   // 左插入列
  'appendColumn': 'apppendColumn',   // 右插入列
  'prependRow': 'prependRow',   // 上插入行
  'appendRow': 'appendRow',   // 下插入行
  'mergeRight': 'mergeRight',   // 向右合并
  'mergeDown': 'mergeDown',   // 向下合并
  'splitColumn': 'splitColumn',   // 拆分成行
  'splitRow': 'splitRow',   // 拆分成列
  'deleteRow': 'deleteRow',   // 删除当前行
  'deleteColumn': 'deleteColumn',   // 删除当前列
}

/**
 * 在表格原有数据上执行操作，返回新数据
 * rows: 表格原有数据
 * type: 操作类型
 * rowIndex: 操作单元格行索引
 * columnIndex: 操作单元格列索引
 */
export function tableMutation(rows, type, rowIndex, columnIndex) {
  console.log(rows, type, rowIndex, columnIndex);

  function createCell() {
    return {
      "type": "td",
      "options": {
        "customClass": "",
        "colspan": 1,
        "rowspan": 1,
        "align": "left",
        "valign": "top",
        "width": "",
        "height": ""
      },
      "list": [],
      "key": Math.random()
    }
  }
  function createRow() {
    return {
      columns: []
    }
  }
  function getColumnCount(row) {
    var count = 0
    row.columns.forEach(d => {
      count += d.options.rowspan
    })
    return count
  }

  const mutationFunction = {
    [MutationType.prependColumn]: (rows, rowIndex, columnIndex) => {
      return rows.map(row => {
        row.columns.splice(columnIndex, 0, createCell())
        return row
      })
    },
    [MutationType.appendColumn]: (rows, rowIndex, columnIndex) => {
      return rows.map(row => {
        row.columns.splice(columnIndex + 1, 0, createCell())
        return row
      })
    },
    [MutationType.prependRow]: (rows, rowIndex, columnIndex) => {
      var row = createRow()
      var columnCount = getColumnCount(rows[0])
      for (var i = 0; i < columnCount; ++i) {
        row.columns.push(createCell())
      }
      rows.splice(rowIndex, 0, row)
      return rows
    },
    [MutationType.appendRow]: (rows, rowIndex, columnIndex) => {
      var row = createRow()
      var columnCount = getColumnCount(rows[0])
      for (var i = 0; i < columnCount; ++i) {
        row.columns.push(createCell())
      }
      rows.splice(rowIndex + 1, 0, row)
      return rows
    },
    [MutationType.mergeRight]: (rows, rowIndex, columnIndex) => {
      if (columnIndex < rows[rowIndex].columns.length - 1) {
        var currentCell = rows[rowIndex].columns[columnIndex]
        var nextCell = rows[rowIndex].columns[columnIndex + 1]
        var cell = createCell()
        if (currentCell.options.rowspan == nextCell.options.rowspan) {
          cell.options.colspan = currentCell.options.colspan + nextCell.options.colspan
          cell.options.rowspan = currentCell.options.rowspan
          cell.list = [...currentCell.list, ...nextCell.list]
          rows[rowIndex].columns.splice(columnIndex, 2, cell)
        }
      }
      return rows
    },
    [MutationType.mergeDown]: (rows, rowIndex, columnIndex) => {
      if (rowIndex < rows.length - 1) {
        var currentCell = rows[rowIndex].columns[columnIndex]
        var nextCell = rows[rowIndex + 1].columns[columnIndex]
        var cell = createCell()
        if (currentCell.options.colspan == nextCell.options.colspan) {
          cell.options.rowspan = currentCell.options.rowspan + nextCell.options.rowspan
          cell.options.colspan = currentCell.options.colspan
          cell.list = [...currentCell.list, ...nextCell.list]
          rows[rowIndex].columns.splice(columnIndex, 1, cell)
          rows[rowIndex + 1].columns.splice(columnIndex, 1)
        }
      }
      return rows
    },
    [MutationType.splitColumn]: (rows, rowIndex, columnIndex) => {
      const cell = rows[rowIndex].columns[columnIndex]
      var rowspan = cell.options.rowspan
      for (var i = 1; i < rowspan; ++i) {
        const newCell = createCell()
        rows[rowIndex + i].columns.splice(columnIndex - 1, 0, {
          ...newCell,
          options: {
            ...newCell.options,
            colspan: cell.options.colspan
          }
        })
      }
      rows[rowIndex].columns[columnIndex].options.rowspan = 1
      return rows
    },
    [MutationType.splitRow]: (rows, rowIndex, columnIndex) => {
      const cell = rows[rowIndex].columns[columnIndex]
      var colspan = cell.options.colspan
      for (var i = 1; i < colspan; ++i) {
        const newCell = createCell()
        rows[rowIndex].columns.splice(columnIndex + 1, 0, {
          ...newCell,
          options: {
            ...newCell.options,
            rowspan: cell.options.rowspan
          }
        })
      }
      rows[rowIndex].columns[columnIndex].options.colspan = 1
      return rows
    },
    [MutationType.deleteRow]: (rows, rowIndex, columnIndex) => {
      if (rowIndex >= 0 && rowIndex < rows.length) {
        rows.splice(rowIndex, 1)
      }
      return rows
    },
    [MutationType.deleteColumn]: (rows, rowIndex, columnIndex) => {
      if (columnIndex >= 0 && columnIndex < rows[rowIndex].columns.length) {
        rows.forEach(r => {
          r.columns.splice(columnIndex, 1)
        })
      }
      return rows
    },
  }

  return mutationFunction[type](rows, rowIndex, columnIndex)
}

export function isMutationDisabled(rows, type, rowIndex, columnIndex) {
  const statusFunction = {
    [MutationType.mergeRight]: (rows, rowIndex, columnIndex) => {
      var disabled = false
      if (columnIndex == rows[rowIndex].columns.length - 1) {
        disabled = true
      } else {
        const cell = rows[rowIndex].columns[columnIndex]
        const nextCell = rows[rowIndex].columns[columnIndex + 1]
        if (cell && nextCell) {
          if (cell.options.rowspan !== nextCell.options.rowspan) {
            disabled = true
          }
        } else {
          disabled = true
        }
      }
      return disabled
    },
    [MutationType.mergeDown]: (rows, rowIndex, columnIndex) => {
      var disabled = false
      if (rowIndex === rows.length - 1) {
        disabled = true
      } else {
        const cell = rows[rowIndex].columns[columnIndex]
        const nextCell = rows[rowIndex + 1].columns[columnIndex]
        if (cell && nextCell) {
          if (cell.options.colspan !== nextCell.options.colspan) {
            disabled = true
          }
        } else {
          disabled = true
        }
      }
      return disabled
    },
    [MutationType.splitRow]: (rows, rowIndex, columnIndex) => {
      var disabled = false
      if (rows[rowIndex].columns[columnIndex].options.colspan == 1) {
        disabled = true
      }
      return disabled
    },
    [MutationType.splitColumn]: (rows, rowIndex, columnIndex) => {
      var disabled = false
      if (rows[rowIndex].columns[columnIndex].options.rowspan == 1) {
        disabled = true
      }
      return disabled
    },
  }

  return statusFunction[type](rows, rowIndex, columnIndex)
}
