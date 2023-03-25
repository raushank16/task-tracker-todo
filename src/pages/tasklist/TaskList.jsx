import TaskContainer from "./TaskContainer";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import axios from "axios";
import CreateTask from "./CreateTask";
import Toast from "../../components/toast/Toast";


const TaskList = () => {

    const { role } = useContext(AuthContext)

    const [tasks, setTasks] = useState([]);
    const [taskReload, setTaskReload] = useState(false);
    const [popup, setPopup] = useState(false)
    const [toast, setToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')



    const handleTaskUpdate = async (taskId, newStatus) => {
        // console.log(taskId, newStatus, 25)
        // Find the task with the given ID and update its status
        const updatedTasks = tasks.map((task) =>
            task._id === parseInt(taskId) ? { ...task, status: newStatus } : task
        );
        setTasks(updatedTasks);

        // console.log(`Task ${taskId} status changed to ${newStatus}.`)




        try {
            const res = await axios.put(`http://localhost:9000/api/tasks/${role === "ADMIN" ? "admin/" + taskId : taskId}`, { status: newStatus },
                {
                    headers: {
                        // 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                        // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                        application: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }

            ).then((res) => {
                console.log(res, "create task response");

                if (res.status === 200) {
                    console.log("updated")
                    setToastMessage("Task Moved To " + newStatus)
                    setToast(true)
                }


                setTaskReload(!taskReload);
            })
        } catch (error) {

            console.log(error, 53)
            setToastMessage(error.response.data.message)
            setToast(true)

            // if (error.response.status === 400) {
            //     setToastMessage("Already DONE task cannot be updated")
            //     setToast(true)
            // }
            // console.error(error);
        }

    };

    const handlePopup = () => {
        setPopup(true)
    }



    useEffect(() => {
        // i need to get tasks by user id
        axios.get('http://localhost:9000/api/tasks')
            .then((response) => {
                setTasks(response.data);
                // console.log(response.data)
            })
            .catch((error) => {
                console.error(error);
            });
    }, [taskReload, popup]);



    const handleToastClose = () => {
        setToast(false);
    };


    return (
        <div className="w-[1200px] overflow-x-auto">
            {toast && <Toast message={toastMessage} onClose={handleToastClose} />}
            {popup && <CreateTask popup={setPopup} />}

            <div className='flex md:flex-row flex-col gap-5 absolute'>
                <div>
                    <input type="text" placeholder='Search...' className='w-24 outline-slate-400 rounded-md px-3 py-1  focus:outline-2 focus:outline-blue-500 focus:w-full' />
                </div>
                <div>
                    <button onClick={handlePopup} className="bg-blue-200 px-3 py-1 shadow-md rounded-md">Add Task</button>
                </div>
            </div>
            <div className=" grid grid-cols-3 w-[1200px] h-[85vh] overflow-x-auto px-16 gap-12  py-6 ">
                <TaskContainer tasks={tasks} status="TODO" handleTaskUpdate={handleTaskUpdate} />
                <TaskContainer tasks={tasks} status="INPROGRESS" handleTaskUpdate={handleTaskUpdate} />
                <TaskContainer tasks={tasks} status="DONE" handleTaskUpdate={handleTaskUpdate} />
            </div>
        </div>
    );
};


export default TaskList;


