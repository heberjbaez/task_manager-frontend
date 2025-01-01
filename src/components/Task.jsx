import todo_icon from "../assets/todo_icon.png"
import { TaskItems } from "./TaskItems"
import { useRef, useState, useEffect } from "react"

export const Task = () => {
    const [taskList, setTaskList] = useState([])
    const inputRef = useRef()

    const add = async () => {
        const inputText = inputRef.current.value.trim()
        if (inputText === "") {
            return null
        }

        const newTask = {
            title: inputText,
        }

        try {
            const response = await fetch("http://localhost:3000/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newTask)
            })

            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const createdTask = await response.json()

            setTaskList((prev) => [...prev, createdTask])
            inputRef.current.value = ""
        } catch (error) {
            console.error(error)
        }

    }

    const deleteTask = async (id) => {
        const task = taskList.find((task) => task._id === id)
        try {
            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(task)
            })

            if (!response.ok) {
                throw new Error(response.statusText);
            }


            setTaskList((prevTasks) => {
                return prevTasks.filter((task) =>
                    task._id !== id
                )
            })

        } catch (error) {
            console.error(error)
        }


    }

    //TODO, cada vez que se hace clic y se tacha el titulo, hace un movimiento raro
    const toggle = async (id) => {
        try {
            const task = taskList.find((task) => task._id === id)

            if (!task) {
                throw new Error("Tarea no encontrada");
            }

            const taskCompleted = { completed: !task.completed }

            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(taskCompleted)
            })



            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const updatedTask = await response.json()


            setTaskList((prevTasks) => {
                return prevTasks.map((task) => {
                    if (task._id === id) {
                        return { ...task, completed: !task.completed }
                    }

                    return task
                })
            })

        } catch (error) {
            console.error(error)
        }

    }

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch('http://localhost:3000/tasks');
            const tasks = await response.json();
            setTaskList(tasks);
        };

        fetchTasks();
    }, []);


    return (

        <div className="bg-white place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl">

            {/* {title} */}

            <div className="flex items-center mt-7 gap-2">
                <img className="w-8" src={todo_icon} alt="" />
                <h1 className="text-3xl font-semibold">Task Manager</h1>
            </div>

            {/* {Form} */}

            <div className="flex items-center my-7 bg-gray-200 rounded-full">
                <input ref={inputRef} className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600" type="text" placeholder="Add your task" />
                <button onClick={add} className="border-none rounded-full bg-orange-600 w-32 h-14 text-white text-lg font-medium cursor-pointer">ADD</button>
            </div>
            {/* {Task List} */}


            <div>
                {taskList.map((item, index) => {
                    return <TaskItems key={index} title={item.title} id={item._id} completed={item.completed} deleteTask={deleteTask} toggle={toggle} />
                })}

            </div>
        </div>

    )
}
