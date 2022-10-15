import React, {useState, useEffect} from "react";

const API_BASE = "http://localhost:4000";

function App() {
  
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    GetTodos();
  }, [])

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
        .then(res => res.json())
        .then(data => setTodos(data))
        .catch(err => console.error("Error: ", err));
  }

  const completeTodo = async id => {
    const data = await fetch(API_BASE + "/todo/complete/" + id)
        .then(res => res.json());
        setTodos(todos => todos.map(todo => {
          if(todo._id === data._id) {
            todo.complete = data.complete;
          }
          return todo;
        }));
  }

  const deleteTodo = async id => {
		const data = await fetch(API_BASE + '/todo/delete/' + id, { 
      method: "DELETE"
     }).then(res => res.json());

		setTodos(todos => todos.filter(todo => todo._id !== data._id));
	}

  const addTodo = async () => {
		const data = await fetch(API_BASE + "/todo/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json" 
			},
			body: JSON.stringify({
				text: newTodo
			})
		}).then(res => res.json());

		setTodos([...todos, data]);
		setNewTodo("");
	}
  
 
  return (
    <div className="container">
    <div className="heading">
      <h1>To-Do List</h1>
    </div>
    <div className="form">
      <input type="text"  
      onChange={e => setNewTodo(e.target.value)} 
      value={newTodo}/>
      <button onClick={addTodo}>
        <span>Add</span>
      </button>
    </div>
    <div className="todos">
      {todos.map(todo => (
        <div className={
          "todo " + (todo.complete ? "is-complete" : "")
          }  key={todo._id} onClick={() => completeTodo(todo._id)}>
          <div className="checkbox"></div>
            <div className="text">{todo.text}</div>
            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>x</div>
        </div>    
      ))}   
    </div>
  </div>
  );
}

export default App;
