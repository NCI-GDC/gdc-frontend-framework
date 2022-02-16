import _ from "lodash";

export const convertArrayToString = (arr) => {
    let tableStr = "";
    arr.forEach(disease => {
        tableStr += disease + ", "
    });
    return tableStr.substring(0, tableStr.length - 2)
}

export const getDescendingOrderArray = (param, arr) => {
    return arr.sort((a, b) => {
        if (a[param] < b[param]) {
            return -1
        } else if (a[param] > b[param]) {
            return 1
        } else {
            return 0
        }
    })
}

export const getAscendingOrderArray = (param, arr) => {
    return arr.sort((a, b) => {
        if (b[param] < a[param]) {
            return -1
        } else if (b[param] > a[param]) {
            return 1
        } else {
            return 0
        }
    })
}

export const getDisplayEntryOptions = (totalRows) => {
    const displayNumberOptions = [];
    let entryIncrement = 5;
    while (entryIncrement < totalRows) {
        displayNumberOptions.push({
            value: entryIncrement,
            label: entryIncrement.toString()
        });
        entryIncrement += entryIncrement
    }
    displayNumberOptions.push({
        value: totalRows.length,
        label: "All"
    });
    return displayNumberOptions
}

export const removeObjectId = (obj) => {
    let newObj = obj;
    delete newObj.id
    return newObj
}

export const getAllColumnListOptions = (rowObj) => {
    const columnListArr = [];
    const headerKeys = Object.keys(removeObjectId(keyObj));
    headerKeys.forEach(key => {
        if (typeof rowObj[key] === 'number') {
            columnListArr.push(key);
        }
    });
}

export const getAllColumnHeaderOptions = (rowObj) => {
    const columnHeaderArr = [];
    const headerKeys = Object.keys(removeObjectId(keyObj));
    headerKeys.forEach(key => {
        if (typeof rowObj[key] === 'number') {
        }
    })
}