import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const getAllThreads = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/thread`);
      const res = await response.json();
      const filterData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filterData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
    closeSidebar(); // close on mobile
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `${API_BASE}/api/thread/${newThreadId}`
      );

      if (!response.ok) {
        console.error(`HTTP Error: ${response.status}`);
        setPrevChats([]);
        return;
      }

      const text = await response.text();

      if (!text || text.trim() === "") {
        console.error("Empty response from server");
        setPrevChats([]);
        return;
      }

      const res = JSON.parse(text);
      setPrevChats(Array.isArray(res) ? res : []);
      setNewChat(false);
      setReply(null);
      closeSidebar();
    } catch (err) {
      console.error("Error fetching thread:", err);
      setPrevChats([]);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/thread/${threadId}`,
        { method: "DELETE" }
      );
      const res = await response.json();
      console.log(res);

      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="hamburger" onClick={toggleSidebar}>
        <i className="fa-solid fa-bars"></i>
      </div>

      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      <section className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button onClick={createNewChat}>
          <img
            src="src/assets/blacklogo.png"
            alt="gpt-logo"
            className="logo"
          ></img>
          <span>
            <i className="fa-solid fa-pen-to-square"></i>
          </span>
        </button>

        <ul className="history">
          {allThreads?.map((thread, idx) => (
            <li
              key={idx}
              onClick={() => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : ""}
            >
              <div className="thread-text">{thread.title}</div>

              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>

        <div className="sign">
          <p>By Ashutosh ❤️</p>
        </div>
      </section>
    </>
  );
}

export default Sidebar;
