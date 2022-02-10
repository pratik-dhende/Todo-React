import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";

const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  Important: task => task.important && !task.completed,
  Completed: task => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState('All');
  const [filterList, setFilterList] = useState(
    FILTER_NAMES.map(name => (
      <FilterButton
        key={name}
        name={name}
        isPressed={name === filter}
        setFilter={setFilter}
      />
    ))
  );
  const [filterMap, setFilterMap] = useState(FILTER_MAP);
  const [filterNames, setFilterNames] = useState(FILTER_NAMES);

  useEffect(() => {
    setFilterNames(Object.keys(filterMap));
  }, [filterMap]);

  useEffect(() => {
    setFilterList (filterNames.map(name => (
      <FilterButton
        key={name}
        name={name}
        isPressed={name === filter}
        setFilter={setFilter}
      />
    )));
  }, [filterNames]);

  function addTask(name, category) {
    if (category != ""){
      setFilterMap({...filterMap, [category] : (task => task.category === category)})
    }
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false, important: false, category: (category == "" ? "All" : category) };
    setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map(task => {
      if (id === task.id) {
        return {...task, completed: !task.completed}
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function toggleTaskImportant(id){
    const updatedTasks = tasks.map(task => {
      if (id === task.id) {
        return {...task, important: !task.important}
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    if (window.confirm(`Are you sure, you want to delete ${(tasks.filter(task => id === task.id))[0].name} task?`)){
      const remainingTasks = tasks.filter(task => id !== task.id);
      setTasks(remainingTasks);
    }
  }

  function editTaskPriority(id, priority) {
    let sortedList = [...tasks];
    let taskIndex = tasks.findIndex(task => task.id === id);
    let priorityTask = tasks[taskIndex];
    let priorityIndex = priority - 1;

    sortedList.splice(taskIndex, 1);
    sortedList.splice(priorityIndex, 0, priorityTask);

    setTasks(sortedList);
  }

  const taskList = tasks
  .filter(filterMap[filter])
  .map((task, index) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      important={task.important}
      priority={index + 1}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTaskPriority={editTaskPriority}
      toggleTaskImportant={toggleTaskImportant}
    />
  ));

  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun}`;

  return (
    <div className="todoapp stack-large">
      <h1>TodoApp</h1>
      <Form 
        onSubmit={addTask} 
      />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList.map(task => task)}
      </ul>
    </div>
  );
}

export default App;
