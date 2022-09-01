export const Row = 20;
export const Col = 10;
export const allTypesNumber = 11;
export const Mincol = 4;

/*
    固定几种的方块以及旋转方向后的方块
    1:  [x, x + Col, x + Col - 1, x + Col - 1 + Col  ],
    -1：[x - 1 , x + 1 , x + 1 + Col , x + 1 +  Col + 1 ],


    2: [x, x + Col, x + Col + 1, x + Col + 1 + Col],
    -2：[x + 1, x + 2, x - 1 + Col, x + Col]

    // 3: 

*/

export function getCellByType(x, type, colNums = Col){
    let result;
    switch(type){
        case 0: {
            result = [x, x + colNums, x + colNums -1, x + colNums -1 + colNums];
            break;
        }
        case 1: {
            result = [x -1, x, x + colNums , x + 1 + colNums];
            break;
        }
        case 2: {
            result = [x - 1, x -1 + colNums, x + colNums, x + colNums + colNums];
            break;
        }
        case 3: {
            result = [x, x + 1, x + colNums, x -1 + colNums];
            break;
        }
        case 4: {
            result = [x, x -1 +colNums, x + colNums, x+1+colNums];
            break;
        }
        case 5: {
            result = [x, x +colNums, x+1+colNums, x+colNums + colNums];
            break;
        }
        case 6: {
            result = [x - 1, x, x + 1, x+colNums];
            break;
        }
        case 7: {
            result = [x, x +colNums, x-1+colNums, x+colNums+colNums];
            break;
        }
        case 8: {
            result = [x,x+1,x+colNums, x+1+colNums];
            break;
        }
        case 9: {
            result = [x-2,x-1,x,x+1];
            break;
        }
        case 10: {
            result = [x, x+colNums, x+colNums+colNums,x+colNums+colNums+colNums];
            break;
        }

        default:break;
    }
    return result;
}

export function getInitCells(start, col = Col){
    let arr = new Array(allTypesNumber).fill([]);
    let result = arr.map((item, index) => {
        return getCellByType(start, index, col);
    })
    return result;
}

