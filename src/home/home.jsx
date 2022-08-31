/* eslint-disable no-loop-func */

import './home.css'
import CreateCells from './CreateCells';
import React from 'react';
import {Row, Col} from './util';

export default class Home extends React.Component {
    constructor(props){
        super(props);
        const data = new Array(Row * Col).fill({isActive:false}).map((item,index) => {
            return {...item, id: index}
        });
        this.state = {
            cells: data,
            isOver: false
        }
        this.isStart = false;
        this.currentLocation = [];
        this.nextLocation = [];
        this.existLocation = [];
        this.cellTimer = null;
        this.isRunToEnd = false;
        this.allTypeCell = [
            [4, 13, 14, 23],  
            // ['0-4','1-4','1-5','2-5'],
            // ['0-4','1-4','2-4','1-5'],
            // ['0-4','1-4','2-4','1-3'],
            // ['0-4','1-4','0-5','1-5'],
            // ['0-3','0-4','1-4','2-4'],
            // ['0-5','0-4','1-4','2-4'],
            // ['0-3','0-4','0-5','0-6']
        ]
        this.handleRotate = this.handleRotate.bind(this);
        this.handleMoveDrop = this.handleMoveDrop.bind(this);
        this.handleMoveDown = this.handleMoveDown.bind(this);
        this.handleMoveLeft = this.handleMoveLeft.bind(this);
        this.handleMoveRight = this.handleMoveRight.bind(this);
    }
    startTimer() {
        this.clearTimer();
        this.cellTimer = setInterval(()=> {
            if(this.isRunToEnd){
                this.clearTimer();
                //判断是否继续掉下一个方块
                this.handleGetNewCell();
            }else{
                this.handleMoveDown();
            }
        },1000)
    }
    clearTimer(){
        if(this.cellTimer){
            clearInterval(this.cellTimer);
            this.cellTimer = null;
        }
    }
    initGameData() {
        this.isStart = false;
        this.currentLocation = [];
        this.nextLocation = [];
        this.existLocation = [];
        this.clearTimer();
        this.isRunToEnd = false;
    }
    handleGetNewCell(){
        if(this.checkGameIsOver()){
            this.setState({isOver: true})
            this.initGameData();
            return;
        }
        // let r = Math.floor(Math.random()*6);
        this.currentLocation = this.allTypeCell[0];
        this.isRunToEnd = false;
        this.renderCells();
        this.startTimer();
    }
    handleMoveDrop(){
        if(!this.isStart){
            this.isStart = true;
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
            let addRow = Row  - currentRow;
            let newLocation = [];
            do{ 
                newLocation = [];
                addRow--;
                this.currentLocation.forEach(item => {
                    let newCell = item + addRow * Col;
                    newLocation.push(newCell);
                })
            }while(this.isTouchTheBoundary(newLocation))
            this.currentLocation = newLocation;
            this.existLocation.push(...this.currentLocation);
            this.renderCells();
            setTimeout(() => {
                this.handleGetNewCell();
            },500)
        }
    }
    handleRotate() {

    }
    handleMoveDown(){
        let newLocation = [];
        this.currentLocation.forEach(item => {
            let rowNumber = item % Col;
            let colNumber = Math.floor(item/Col);
            let newCell = rowNumber + (colNumber + 1) * Col;
            newLocation.push(newCell);
        })
        if(this.isTouchTheBoundary(newLocation)){
            this.isRunToEnd = true;
            this.existLocation.push(...this.currentLocation);
            return;
        }
        this.currentLocation = newLocation;
        this.renderCells();
    }
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
        this.currentLocation = newLocation;
        this.renderCells();
    }
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
        this.currentLocation = newLocation;
        this.renderCells();
    }
    //渲染最新的方块位置
    renderCells(){
        let data = this.state.cells.map(item => {
            return {
                    ...item, 
                    isActive: false
                };
        });
        [...new Set([...this.currentLocation,...this.existLocation])].forEach(i => {
            data[i].isActive = true;
        })
        this.setState({cells: data});
    }
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
        return (
            <div>
                <CreateCells cells={this.state.cells} isOver={this.state.isOver}></CreateCells>
                <div className='right-box'>
    
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