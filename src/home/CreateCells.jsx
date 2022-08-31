
import './home.css'

export default function CreateCells(props) {
    return (
        <div className="box">
            {
                props.cells.map((item) => {
                    return (
                        <span className={`cell ${item.isActive? 'cell-active' : ''} ${props.isOver ? 'over-cell' : ''}`} key={item.id}>
                            <span className='cell-inner'></span>
                        </span>
                    )
                })
            }
        </div>
    )
}