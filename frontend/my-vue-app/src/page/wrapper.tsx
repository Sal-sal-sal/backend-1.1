import { Link } from "react-router-dom"

function Home() {
  return (
    <div>
        <h1>Home</h1>
        <div className="flex flex-row gap-10 w-full justify-evenly ">
          <button >
            <Link to="/tasks" className="text-white w-5 h-5">Create Task</Link>
          </button>
          <button className="text-white w-5 h-5">
            <Link to="/read">Read Task</Link>
          </button>
          <button className="text-white w-5 h-5">
            <Link to="/update_task">Update Task</Link> 
          </button>
          <button className="text-white w-5 h-5">
            <Link to="/delete_task">Delete Task</Link>
          </button>
        </div>
    </div>
  )
}

export default Home