import { useEffect } from "react";
import { useState } from "react";
import './score.css'

export function ScoreView(props){
    let cells = new Array(16).fill({isActive:false}).map((item,index) => {
        return {...item, id:index};
    })
    let [getCells, setCells] = useState(cells);
    useEffect(() => {   
        setCells( prev => {
            return prev.map(item => {
                return {
                    ...item,
                    isActive: false 
                }
            }).map(item => {
                return {
                    ...item,
                    isActive: props.nextLocation.includes(item.id) ? true : false
                }
            })
        })
    },[props.nextLocation]);
    return (
        <div>
            <div>
                <h1>分数</h1>
                <p>{props.score}</p>
            </div>
            <div>
                <h1>消除行数</h1>
                <p>{props.clearRows}</p>
            </div>
            <div>
                <h1>下一个</h1>
                <div className="next-box">
                    {
                        getCells.map((item) => {
                            return (
                                <span className={`cell ${item.isActive? 'cell-active' : ''}`} key={item.id}>
                                    <span className='cell-inner'></span>
                                </span>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}