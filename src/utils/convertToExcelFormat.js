import toExcelColumnName from "./toExcelColumnName.js";
/**
 * 转换函数
 * @param {Object} json 
 * @returns {Object}
 */
const convertToExcelFormat = (json) => {
    const result = {};
    const colunmArr = []
    const rowArr = []
    for (const [rowKey, rowValue] of Object.entries(json)) {
        rowArr.push(parseInt(rowKey) + 1)
        for (const [colKey, colValue] of Object.entries(rowValue)) {
            colunmArr.push(colKey)
            const columnName = toExcelColumnName(parseInt(colKey));
            const cellKey = `${columnName}${parseInt(rowKey) + 1}`; // 行数从1开始
            result[cellKey] = {
                v: colValue.v,
                t: 's'
            };
        }
    }
    result["!ref"] = `A1:${toExcelColumnName(Math.max.apply(null, colunmArr)) + Math.max.apply(null, rowArr)}`
    return result;
}

export default convertToExcelFormat