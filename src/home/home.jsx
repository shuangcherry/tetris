/* eslint-disable no-fallthrough */
/* eslint-disable no-loop-func */

import './home.css'
import CreateCells from './CreateCells';
import React from 'react';
import {Row, Col, getInitCells, getCellByType, allTypesNumber, Mincol} from './util';
import { ScoreView } from './score';

export default class Home extends React.Component {
    constructor(props){
        super(props);
        const data = new Array(Row * Col).fill({isActive:false, isClear: false}).map((item,index) => {
            return {...item, id: index}
        });
        this.state = {
            cells: data,
            isOver: false,
            score: 0,
            clearRows: 0,
            nextLocation:[]
        }
        this.isStart = false;
        this.type = 0;
        this.nextType = null;
        this.currentLocation = [];
        this.existLocation = [];
        this.cellTimer = null;
        this.lowestRow = null;
        this.allTypeCell = getInitCells(5, Col);
        this.nextAllTypeCell = getInitCells(2, Mincol);
        this.handleRotate = this.handleRotate.bind(this);
        this.handleMoveDrop = this.handleMoveDrop.bind(this);
        this.handleMoveDown = this.handleMoveDown.bind(this);
        this.handleMoveLeft = this.handleMoveLeft.bind(this);
        this.handleMoveRight = this.handleMoveRight.bind(this);
    }
    startTimer() {
        this.clearTimer();
        this.cellTimer = setInterval(()=> {
            this.handleMoveDown();
        },1000)
    }
    clearTimer(){
        if(this.cellTimer){
            clearInterval(this.cellTimer);
            this.cellTimer = null;
        }
    }
    //游戏结束后初始化游戏数据
    initGameData() {
        this.isStart = false;
        this.currentLocation = [];
        this.existLocation = [];
        this.lowestRow = null;
        this.clearTimer();
    }
    //开始从顶部掉落一个方块下来
    handleGetNewCell(){
        this.type = this.nextType;
        this.currentLocation = this.allTypeCell[this.type];
        this.nextType = Math.floor(Math.random()*allTypesNumber);
        this.setState({nextLocation: this.nextAllTypeCell[this.nextType]});
        this.renderCells();
        this.startTimer();
    }
    //掉落
    handleMoveDrop(){
        if(!this.isStart){
            this.isStart = true;
            this.nextType = Math.floor(Math.random()*allTypesNumber);
            this.setState({isOver:false});
            this.handleGetNewCell();
        }else{
            if(this.currentLocation.length === 0){
                return;
            }
            this.clearTimer();
            let maxCells = this.currentLocation[3];
            let currentRow = Math.floor(maxCells/Col);
            if( currentRow === Row - 1){
                return;
            }
            let newLocation = [...this.currentLocation];
            let resultLocation = [];
            let i = 0;
            do{ 
                resultLocation = newLocation;
                newLocation = [];
                i++;
                this.currentLocation.forEach(item => {
                    let newCell = item + i * Col;
                    newLocation.push(newCell);
                })
            }while(!this.isTouchTheBoundary(newLocation))
            this.currentLocation = resultLocation;
            this.addNewLocation();
        }
    }
    //掉落到底部了
    async addNewLocation(){
        this.existLocation.push(...this.currentLocation); //添加进去了
        this.lowestRow = Math.floor(this.currentLocation[3] / Col);
        this.currentLocation = [];
        // await this.clearEntireLine(lowestRow);
        this.renderCells(true);
    }
    //判断是否是一整行都被填满了
    isCompleteRow(rowNumber){
        let flag = true;
        let start = rowNumber * Col;
        let end = (rowNumber + 1) * Col;
        for(let i = start; i < end; i++){
            if(!this.state.cells[i].isActive){
                flag = false;
                break;
            }
        }
        return flag;
    }
    //消除整行 (从第row行开始检查之上的行有没有需要消除的整行)
    clearEntireLine(row){
        return new Promise(resolve => {
            let rows = [];
            let i = 0;
            while(i < 4 && row >= 0){
                if(this.isCompleteRow(row)){
                    rows.push(row);
                }
                row--;
                i++;
            }
            if(rows.length === 0){
                resolve();
                return;
            }
            //给需要清除的行加上闪烁效果
            let data = this.state.cells.map(item => {
                return {
                    ...item,
                    isClear: rows.includes(Math.floor(item.id/10)) ? true : false
                }
            })
            let oldScore = this.state.score;
            this.setState({cells:data, clearRows: rows.length, score: 10 * rows.length + oldScore});
            setTimeout(() => {
                //将需要删除的行删除
                data = this.state.cells.map(item => {
                    return {
                        ...item,
                        isActive: item.isClear ? false : item.isActive,
                        isClear: false
                    }
                })
                let counts = rows[0] * Col;
                let needDropCells = data.filter(item => {
                    return item.id < counts && item.isActive
                })
                data.forEach(item => {
                    if(item.id < counts && item.isActive){
                        item.isActive = false;
                    }
                })
                let addNumbers = rows.length * Col;
                needDropCells.forEach(item => {
                    data[item.id + addNumbers].isActive = true;
                })
                this.existLocation = data.filter(item => item.isActive).map(item => item.id);
                this.setState({cells: data});
                resolve();
            },2000);
        })
    }
    //旋转
    handleRotate() {
        let newLocation = [];
        const x = this.currentLocation[0];
        let flag = true;
        switch (this.type) {
            case 0: {
                if(x % 10 === Col -1){
                    flag = false;
                    break;
                }
                newLocation = getCellByType(x, 1);
                this.type = 1;
                break;
            }
            case 1: {
                newLocation = getCellByType(x + 1, 0);
                this.type = 0;
                break;
            }
            case 2: {
                if(x % 10 >= Col - 2){
                    flag = false;
                    break;
                }
                newLocation = getCellByType(x + 1, 3);
                this.type = 3;
                break;
            }
            case 3: {
                newLocation = getCellByType(x, 2);
                this.type = 2;
                break;
            }
            case 4: {
                newLocation = getCellByType(x, 5);
                this.type = 5;
                break;
            }
            case 5: {
                if(x % Col === 0){
                    flag = false;
                    break;
                }
                newLocation = getCellByType(x,6);
                this.type = 6;
                break;
            }
            case 6: {
                newLocation = getCellByType(x + 1, 7);
                this.type = 7;
                break;
            }
            case 7: {
                if(x %  Col === Col -1){
                    flag = false;
                    break;
                }
                newLocation = getCellByType(x, 4);
                this.type = 4;
                break;
            }
            case 8: {
                flag = false;
            }
            case 9: {
                newLocation = getCellByType(x+2,10);
                break;
            }
            case 10: {
                if(x % Col < 3 || x % Col > Col - 2){
                    flag = false;
                    break;
                }
                newLocation = getCellByType(x, 9);
                break;
            }
            default: break;
        }
        if(!flag) return;
        if(!this.isTouchTheBoundary(newLocation)){
            this.currentLocation = newLocation;
            this.renderCells();
        }
    }
    //向下移动
    handleMoveDown(){
        let newLocation = [];
        this.currentLocation.forEach(item => {
            let rowNumber = item % Col;
            let colNumber = Math.floor(item/Col);
            let newCell = rowNumber + (colNumber + 1) * Col;
            newLocation.push(newCell);
        })
        if(this.isTouchTheBoundary(newLocation)){
            this.clearTimer();
            this.addNewLocation();
            return;
        }
        this.currentLocation = newLocation;
        this.renderCells();
    }
    //向左移动
    handleMoveLeft() {
        let newLocation = [];
        let minCol = Col - 1;
        this.currentLocation.forEach(item => {
            let newCell = item - 1;
            let colNumber = item % 10;
            if(colNumber <= minCol) minCol = colNumber;
            newLocation.push(newCell);
        })
        if(minCol === 0) return;
        if(this.isTouchTheBoundary(newLocation)) return;
        this.currentLocation = newLocation;
        this.renderCells();
    }
    //检查是否触碰边界了（就是所在位置已经有值了或者所在位置超出方格了）
    isTouchTheBoundary(cl) {
        let flag = false;
        let cells = this.state.cells;
        for(let i = 0; i < cl.length && !flag; i++){
            if(!cells[cl[i]]){
                flag = true;
            }
            if(cells[cl[i]] && cells[cl[i]].isActive && 
                !this.currentLocation.includes(cl[i])){
                flag = true;
            }
        }
        return flag;
    }
    //向右移动
    handleMoveRight() {
        let newLocation = [];
        let maxCol = 0;
        this.currentLocation.forEach(item => {
            let newCell = item + 1;
            let colNumber = item % 10;
            if(colNumber >= maxCol) maxCol = colNumber;
            newLocation.push(newCell);
        })
        if(maxCol === Col -1) return;
        if(this.isTouchTheBoundary(newLocation)) return;
        this.currentLocation = newLocation;
        this.renderCells();
    }
    //渲染最新的方块位置
    renderCells(flag){
        let data = this.state.cells.map(item => {
            return {
                    ...item, 
                    isActive: false
                };
        });
        [...new Set([...this.currentLocation,...this.existLocation])].forEach(i => {
            data[i].isActive = true;
        })
        this.setState({cells: data},async () => {
            if(flag){
                await this.clearEntireLine(this.lowestRow);
                this.lowestRow = null;
                if(this.checkGameIsOver()){
                    this.setState({isOver: true})
                    this.initGameData();
                    return;
                }
                setTimeout(() => {
                    // debugger;
                    this.handleGetNewCell();
                },500)
            }
        });
    }
    //检查游戏是否结束
    checkGameIsOver(){
        let flag = false;
        for(let i = 0; i < Col; i++){
            if(this.state.cells[i].isActive){
                flag = true;
                break;
            }
        }
        return flag;
    }
    componentWillUnmount() {
        this.clearTimer();
    }
    render() {
        const {isOver, cells, score, clearRows, nextLocation} = this.state;
        return (
            <div>
                <div className="top-box">
                    <CreateCells cells={cells} isOver={isOver}></CreateCells>
                    <div className='right-box'>
                        <ScoreView score={score} clearRows={clearRows} nextLocation={nextLocation}></ScoreView>
                    </div>
                </div>
                <div className='bottom-box'>
                    <button className='drop-btn' onClick={this.handleMoveDrop}>掉落</button>
                    <div className='btn-boxs'>
                        <button onClick={this.handleRotate}>旋转</button>
                        <div className='left-right-btn-box'>
                            <button onClick={this.handleMoveLeft}>左移</button>
                            <button onClick={this.handleMoveRight}>右移</button>
                        </div>
                        <button onClick={this.handleMoveDown}>下移</button>
                    </div>
                </div>
            </div>
        )
    }
    
}