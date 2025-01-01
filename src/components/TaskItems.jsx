import tick from "../assets/tick.png"
import not_tick from "../assets/not_tick.png"
import delete_icon from "../assets/delete.png"

export const TaskItems = ({ title, id, completed, deleteTask, toggle }) => {
    return (
        <div className='flex items-center my-3 gap-2'>
            <div onClick={() => { toggle(id) }} className="flex flex-1 items-center cursor-pointer">
                <img src={completed ? tick : not_tick} alt="" className="w-7" />
                <p className={`text-slate-700 ml-4 text-[17px] decoration-slate-500 ${completed ? "line-through" : ""}`}>{title}</p>
            </div>

            <img onClick={() => { deleteTask(id) }} src={delete_icon} alt="" className="w-3.5 cursor-pointer" />
        </div>
    )
}
