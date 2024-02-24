import { useState } from "react";
import "./ToDoList.css";
import api from "./api";

function ToDoList() {
  const [task, setTask] = useState([]);

  const [newtask, setNewtask] = useState("");

  const [load, setLoad] = useState(false);

  const [taskId, setTaskId] = useState([]);

  async function get_list() {
    const message = await api.get(`/list/${1}`);
    if (message.data !== null) {
      console.log(message.data);
      const listFromDb = message.data.map((l) => l.note);
      const taskIdfromDb = message.data.map((t) => t.id);
      console.log(listFromDb, taskIdfromDb);
      setTask(listFromDb);
      setTaskId(taskIdfromDb);
    }
  }

  if (!load) {
    setLoad(true);
    get_list();
  }

  async function deleteFromDb(index) {
    await api.delete(`/delete/list/${index}`);
  }
  async function addTaskToDb() {
    const message = await api.post(`/add/list/${1}`, {
      userid: 1,
      note: newtask,
    });

    setTaskId((i) => [message.data["message"], ...i]);
  }
  function handleInputChange(event) {
    setNewtask(event.target.value);
  }

  function addTask() {
    if (newtask.trim() !== "") {
      setTask((t) => [newtask, ...t]);
      setNewtask("");
      addTaskToDb();
    }
  }
  function deleteTask(index) {
    const updatedTask = task.filter((_, i) => i !== index);
    const updatedTaskId = taskId.filter((_, i) => i !== index);
    setTask(updatedTask);

    deleteFromDb(taskId[index]);

    setTaskId(updatedTaskId);
  }

  function moveTaskUp(index) {
    if (index > 0) {
      const updatedTask = [...task];
      [updatedTask[index], updatedTask[index - 1]] = [
        updatedTask[index - 1],
        updatedTask[index],
      ];
      setTask(updatedTask);

      const updatedTaskId = [...taskId];
      [updatedTaskId[index], updatedTaskId[index - 1]] = [
        updatedTaskId[index - 1],
        updatedTaskId[index],
      ];
      setTaskId(updatedTaskId);
    }
  }

  function moveTaskDown(index) {
    if (index < task.length - 1) {
      const updatedTask = [...task];
      [updatedTask[index], updatedTask[index + 1]] = [
        updatedTask[index + 1],
        updatedTask[index],
      ];
      setTask(updatedTask);

      const updatedTaskId = [...taskId];
      [updatedTaskId[index], updatedTaskId[index + 1]] = [
        updatedTaskId[index + 1],
        updatedTaskId[index],
      ];
      setTaskId(updatedTaskId);
    }
  }

  return (
    <div className="to-do-list">
      <h1>To Do List</h1>
      <div>
        <input
          type="text"
          placeholder="Enter a task"
          value={newtask}
          onChange={handleInputChange}
        />

        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>

      <ol>
        {task.map((element, index) => (
          <li key={index}>
            <span className="text">{element}</span>
            <button className="delete-button" onClick={() => deleteTask(index)}>
              Delete
            </button>
            <button className="move-button" onClick={() => moveTaskUp(index)}>
              Up
            </button>
            <button className="move-button" onClick={() => moveTaskDown(index)}>
              Down
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
export default ToDoList;
