import logo from "./logo.svg";
import "./App.css";
import "clearblade-js-client/lib/mqttws31";
import { ClearBlade } from "clearblade-js-client";
import { useEffect, useState } from "react";

function App() {
  const [isClientLoading, setIsClientLoading] = useState(true);
  const [isTodoLoading, setIsTodoLoading] = useState(true);
  const [todoItems, setTodoItems] = useState([]);
  useEffect(() => {
    const cb = new ClearBlade();

    cb.init({
      URI: "https://platform.clearblade.com", // e.g., 'https://platform.clearblade.com'
      systemKey: "86daa4860cceef81fcbeef87a469",
      systemSecret: "86DAA4860CD8B5A7F7CDE4DFEC9101",
      email: "test@gmail.com", // use registerEmail instead if you wish to create a new user
      password: "test@gmail.com",
      callback: initCallback,
    });

    function initCallback(err, _) {
      setIsClientLoading(false);
      // err is a boolean, cb has APIs and constructors attached
      if (err) {
        throw new Error(cb);
      } else {
        var query = cb.Query("cceea4860cccdeb4c19d8884e27a");
        query.fetch((err, itemArray) => {
          setIsTodoLoading(false);
          console.log({ itemArray });
          setTodoItems(itemArray);
        });
      }
    }
  }, []);

  return (
    <div className="App">
      {isClientLoading ? (
        <div>Client is loading, please be patient</div>
      ) : isTodoLoading ? (
        <div>fetching todo items</div>
      ) : (
        <div>
          {todoItems.map((eachTodoItem) => (
            <div key={eachTodoItem.data.item_id}>
              <TodoItem todoData={eachTodoItem.data} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

const TodoItem = ({ todoData }) => {
  const { istodocompleted, todoitem } = todoData;
  console.log(istodocompleted, istodocompleted ? "true" : "false");

  return (
    <div style={istodocompleted ? { color: "blue" } : { color: "green" }}>
      {todoitem}
      {istodocompleted}
    </div>
  );
};
