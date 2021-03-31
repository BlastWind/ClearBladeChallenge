import logo from "./logo.svg";
import "./App.css";
import "clearblade-js-client/lib/mqttws31";
import { ClearBlade } from "clearblade-js-client";
import { useEffect, useState, useRef } from "react";
import { SlippableList, SlippableListItem } from "react-slipping-list";

function App() {
  const [isClientLoading, setIsClientLoading] = useState(true);
  const [isTodoLoading, setIsTodoLoading] = useState(true);
  const [todoItems, setTodoItems] = useState([]);
  const queryObj = useRef(null);
  const collectionObj = useRef(null);

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
        // cached using useRef, so I can use in onCheckBoxClick
        queryObj.current = cb.Query("cceea4860cccdeb4c19d8884e27a");
        collectionObj.current = cb.Collection("cceea4860cccdeb4c19d8884e27a");
        collectionObj.current.fetch(queryObj.current, (err, itemArray) => {
          setIsTodoLoading(false);
          setTodoItems(itemArray);
        });
      }
    }
  }, []);

  const onCheckBoxClick = (clickedId) => {
    // could set id attribute on input field and use event.target.id here
    // but that exposes item id to the user in the HTML!

    // First, updated local UI
    const newItems = todoItems.map((eachItem, i) => {
      if (clickedId === eachItem.data.item_id) {
        return {
          ...eachItem,
          data: {
            ...eachItem.data,
            istodocompleted: !eachItem.data.istodocompleted,
          },
        };
      }
      return eachItem;
    });
    setTodoItems(newItems);

    // Second and Lastly, update database

    collectionObj.current.update(
      queryObj.current,
      {
        istodocompleted: [true, true, true],
      },
      (err, itemArray) => {
        console.log({ err }, { itemArray });
      }
    );
  };

  return (
    <div className="App">
      {isClientLoading ? (
        <div>Client is loading, please be patient</div>
      ) : isTodoLoading ? (
        <div>fetching todo items</div>
      ) : (
        <SlippableList>
          {todoItems.map((eachTodoItem) => (
            <SlippableListItem key={eachTodoItem.data.item_id}>
              <TodoItem
                onCheckBoxClick={onCheckBoxClick}
                todoData={eachTodoItem.data}
                blockSwipe
              />
            </SlippableListItem>
          ))}
        </SlippableList>
      )}
    </div>
  );
}

export default App;

const TodoItem = ({ todoData, onCheckBoxClick }) => {
  let { istodocompleted, todoitem, item_id } = todoData;

  return (
    <>
      <input
        type="checkbox"
        checked={istodocompleted}
        onChange={() => {
          onCheckBoxClick(item_id);
        }}
      />
      <div
        style={
          istodocompleted
            ? { textDecoration: "line-through" }
            : { textDecoration: "none" }
        }
      >
        {todoitem}
      </div>
    </>
  );
};
