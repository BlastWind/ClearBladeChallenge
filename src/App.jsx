import "./App.css";
import "clearblade-js-client/lib/mqttws31";
import { ClearBlade } from "clearblade-js-client";
import { useEffect, useState, useRef } from "react";
import { SlippableList, SlippableListItem } from "react-slipping-list";
import TodoItem from "./components/TodoItem.tsx";

function App() {
  const [isClientLoading, setIsClientLoading] = useState(true);
  const [isTodoLoading, setIsTodoLoading] = useState(true);
  const [todoItems, setTodoItems] = useState([]);
  const cb = useRef(new ClearBlade());

  useEffect(() => {
    cb.current.init({
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
        throw new Error(cb.current);
      } else {
        // cached using useRef, so I can use in onCheckBoxClick
        const queryObj = cb.current.Query("cceea4860cccdeb4c19d8884e27a");
        const collectionObj = cb.current.Collection(
          "cceea4860cccdeb4c19d8884e27a"
        );
        collectionObj.fetch(queryObj, (err, itemArray) => {
          if (err) {
            throw new Error(err);
          }
          setIsTodoLoading(false);
          setTodoItems(itemArray);
        });
      }
    }
  }, []);

  const onCheckBoxClick = (clickedId) => {
    // Implementation Decision:
    // could set id attribute on input field and use event.target.id here
    // but that exposes item id to the user in the HTML!

    // First, update UI
    let newTodoCompletedValue = null;
    const newItems = todoItems.map((eachItem, i) => {
      if (clickedId === eachItem.data.item_id) {
        newTodoCompletedValue = !eachItem.data.istodocompleted;
        return {
          ...eachItem,
          data: {
            ...eachItem.data,
            istodocompleted: newTodoCompletedValue,
          },
        };
      }
      return eachItem;
    });
    setTodoItems(newItems);

    // Second and lastly, update database
    // Note: It seems like I have to make a new Query Object everytime
    // if I cache queryObj using useRef, equalTo doesn't work as expected
    const queryObj = cb.current.Query("cceea4860cccdeb4c19d8884e27a");
    queryObj.equalTo("item_id", clickedId);
    queryObj.update(
      {
        istodocompleted: newTodoCompletedValue,
      },
      (err, itemArray) => {
        // add notification and setTimeout to remove it later
        // I choose not to write in React because
        // setState in setTimeout overcomplicates things
        let newNotification = document.createElement("div");
        newNotification.innerHTML = "Update Successful!";
        newNotification.classList.add("notificationItem");
        document
          .getElementById("notificationQueneContainer")
          .prepend(newNotification);

        setTimeout(() => {
          let NotificationList = document.querySelectorAll(
            "#notificationQueneContainer > div.notificationItem"
          );
          if (NotificationList.length !== 0) {
            let NotificationToRemove =
              NotificationList[NotificationList.length - 1];
            if (NotificationToRemove) {
              NotificationToRemove.classList.remove("notificationItem");
              NotificationToRemove.style.transition = "opacity 1s";
              NotificationToRemove.style.opacity = "0";
              setTimeout(() => {
                NotificationToRemove.remove();
              }, 1000);
            }
          }
        }, 2500);
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
        <div className="todoListContainer">
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

          <div id="notificationQueneContainer"></div>
        </div>
      )}
    </div>
  );
}

export default App;
