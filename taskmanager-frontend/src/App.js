// import { useEffect, useState } from "react";
// import api from "./api";

// function App() {
//   const [tasks, setTasks] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   const loadTasks = async () => {
//     const res = await api.get("/tasks");
//     setTasks(res.data);
//   };

//   const addTask = async () => {
//     if (!title) return;

//     await api.post("/tasks", {
//       title,
//       description,
//       dueDate: new Date(),
//       isCompleted: false,
//     });

//     setTitle("");
//     setDescription("");
//     loadTasks();
//   };

//   const completeTask = async (id) => {
//     await api.put(`/tasks/${id}/complete`);
//     loadTasks();
//   };

//   useEffect(() => {
//     loadTasks();
//   }, []);

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Task Manager</h1>

//       <input
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         placeholder="Enter task title"
//       />

//       <input
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         placeholder="Enter description"
//       />

//       <button onClick={addTask}>Add</button>

//       <ul>
//         {tasks.map((t) => (
//           <li key={t.id}>
//              <strong>{t.title}</strong> <br />
//              <small>{t.description}</small> <br />
//              {t.isCompleted ? "✅" : ""}
//             {!t.isCompleted && (
//               <button onClick={() => completeTask(t.id)}>Complete</button>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;

import { useEffect, useState } from "react";
import api, { login } from "./api";

function App() {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  const getEmailFromToken = () => {
    if (!token) return "";

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload["email"];
  };

  const loadTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    setLoading(true);
    await api.post("/tasks", {
      title,
      description,
      dueDate: new Date(),
      isCompleted: false,
    });
    setTitle("");
     setDescription("");
    setLoading(false);
    loadTasks();
  };
    const completeTask = async (id) => {
    await api.put(`/tasks/${id}/complete`);
    loadTasks();
  };

  const handleLogin = async () => {
    const res = await login({ email, password });
    localStorage.setItem("token", res.data.token);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    loadTasks();
  };

  useEffect(() => {
    if (token) loadTasks();
  }, [token]);

  // 🔐 If not logged in → show login
  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  // ✅ Logged in → show tasks
  return (
    <div style={{ padding: 20 }}>
      <h1>Task Manager</h1>
      <h3>Welcome {getEmailFromToken()}</h3>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task"
      />

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description"
      />

      <button onClick={addTask} disabled={loading}>
        {loading ? "Adding..." : "Add"}
      </button>

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <strong>{t.title} </strong> 
             <small>{t.description} </small>
             {t.isCompleted ? "✅" : ""}
            {!t.isCompleted && (
              <button onClick={() => completeTask(t.id)}>Complete</button>
            )}
            <button onClick={() => deleteTask(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default App;
