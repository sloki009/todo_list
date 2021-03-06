import React, { useState } from "react";

function List({ data, rowTitle, isCompleted, handlePendingToCompleted }) {
  const list_name = isCompleted === true ? "c_list" : "p_list";
  const taskCount = isCompleted === true ? `(${data.length})` : "";

  const sortByTitle = (a, b) => {
    var x = a.title?.toLowerCase();
    var y = b.title?.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  };

  const handleRadio = (e, task) => {
    console.log("radio selcted", e.target, task);
    handlePendingToCompleted(task);
    console.log("check checkd");
    setTimeout(() => {
      var checked_items = document.querySelectorAll(
        "input[type=radio]:checked"
      );
      var checked_len = checked_items.length;
      while (checked_len--) {
        checked_items[checked_len].checked = 0;
      }
    }, 100);
  };
  return (
    <div className="list_container">
      <div className="list_title">
        <strong>{rowTitle + "  " + taskCount}</strong>
      </div>
      <div className="list_loadhere">
        <ul className="list_tasks">
          {data?.sort(sortByTitle)?.map((task, index) => {
            return (
              <li key={index}>
                {/* <input type="radio" name={`${list_name}`} />
                <label>{task.title}</label> */}
                {isCompleted === false ? (
                  <input
                    type="radio"
                    id={`${task.id}`}
                    name={`${list_name}`}
                    value={`${task.id}`}
                    onChange={
                      isCompleted === false
                        ? (e) => handleRadio(e, task)
                        : () => {}
                    }
                  />
                ) : (
                  <svg
                    className="checkmark"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 40 40"
                  >
                    <path
                      className="checkmark__check"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg>
                )}
                <label
                  htmlFor={`${task.id}`}
                  className={`${isCompleted && "strike"}`}
                >{`${task.title}`}</label>
                <br></br>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default List;
