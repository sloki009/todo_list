import React, { useState, useEffect } from "react";
import { API } from "./api";
import List from "./List";

function Todo() {
  const [todoData, settodoData] = useState({
    completed: [],
    pending: [],
    data: [],
  });
  const [addTask, setaddTask] = useState("");
  useEffect(() => {
    const fetchList = async () => {
      const res = await fetch(`${API}`);
      const json = await res.json();
      filterFetchedData(json).then((res) => {
        console.log(JSON.parse(res));
        res = JSON?.parse(res);
        settodoData((prevState) => {
          return {
            ...prevState,
            completed: res["completed"],
            pending: res["pending"],
            data: res["data"],
          };
        });
      });
    };

    const filterFetchedData = (data, userid = 1) => {
      const filteredData = data?.filter((list) => list["userId"] === userid);
      //console.log();
      return getListsOfType(filteredData);
    };
    const getListsOfType = (filteredData) => {
      return new Promise((resolve, reject) => {
        try {
          let completedTask = [];
          let pendingTask = [];
          filteredData.forEach((element) => {
            //console.log(element, element["completed"]);
            if (element["completed"]) {
              completedTask.push(element);
            } else {
              pendingTask.push(element);
            }
          });
          resolve(
            JSON.stringify({
              completed: completedTask,
              pending: pendingTask,
              data: filteredData,
            })
          );
        } catch (e) {
          alert("Error Faced");
          throw new Error(e);
        }
      });
    };
    fetchList();
  }, []);
  const [lastCompleted, setLastCompleted] = useState({});

  const handleAddTask = () => {
    if (addTask.trim() === "") {
      alert("Task is empty");
      return;
    }
    console.log("clicked", addTask);
    let temp = { UserId: 1, id: todoData.pending.length, title: addTask };
    let temp_arr = [...todoData.pending, temp];
    settodoData((prevState) => {
      return {
        ...prevState,
        pending: temp_arr,
      };
    });
  };

  const handlePendingToCompleted = (selectedTask) => {
    let index = -1;
    let findIndex = todoData.pending?.find((task, i) => {
      if (task.id === selectedTask.id && task.title === selectedTask.title) {
        index = i;
        return i;
      }
    });
    console.log(index);
    if (index > -1) {
      let temp = [...todoData.pending];
      temp?.splice(index, 1);
      //console.log(temp);

      settodoData((prevState) => {
        return {
          ...prevState,
          pending: temp,
          completed: [...prevState.completed, selectedTask],
        };
      });
      setLastCompleted(selectedTask);
      document.getElementById("undo_container").style.visibility = "visible";
      setTimeout(() => {
        console.log("in settimeout", document.getElementById("undo_container"));
        setLastCompleted({});
        document.getElementById("undo_container").style.visibility = "hidden";
      }, 10000);
    }
  };

  const handleUndoTask = () => {
    let selectedTask = { ...lastCompleted };
    let index = -1;
    let findIndex = todoData.completed?.find((task, i) => {
      if (task.id === selectedTask.id && task.title === selectedTask.title) {
        index = i;
        return i;
      }
    });
    console.log(index);
    if (index > -1) {
      let temp = [...todoData.completed];
      temp?.splice(index, 1);
      //console.log(temp);

      settodoData((prevState) => {
        return {
          ...prevState,
          completed: temp,
          pending: [...prevState.pending, selectedTask],
        };
      });
      setLastCompleted({});
      document.getElementById("undo_container").style.visibility = "hidden";
    }
  };

  return (
    <div className="container">
      <div className="container_tasks">
        <div className="load_pendingtasks">
          <List
            data={todoData.pending}
            rowTitle="Tasks"
            isCompleted={false}
            handlePendingToCompleted={handlePendingToCompleted}
          />
        </div>
        <div className="load_completedtasks">
          <List
            data={todoData.completed}
            rowTitle="Completed"
            isCompleted={true}
            handlePendingToCompleted={handlePendingToCompleted}
          />
        </div>
      </div>
      <div className="addtask_container">
        <input
          type="text"
          className="addask_eles"
          id="addtask_input"
          placeholder="Add task..."
          value={addTask}
          onChange={(e) => setaddTask(e.target.value)}
        />
        <button
          id="addtask_btn"
          className="addask_eles"
          onClick={handleAddTask}
        >
          Save
        </button>
      </div>
      <div className="undo_container" id="undo_container">
        <div className="undo">
          <span>1 Completed</span>
          <button id="undo_btn" onClick={handleUndoTask}>
            UNDO
          </button>
        </div>
      </div>
    </div>
  );
}

export default Todo;
