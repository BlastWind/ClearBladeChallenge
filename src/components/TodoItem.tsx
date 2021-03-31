import React from "react";

interface TodoData {
  istodocompleted: boolean;
  todoitem: string;
  item_id: number;
}

interface Props {
  todoData: TodoData;
  onCheckBoxClick: Function;
}

const TodoItem: React.FC<Props> = ({ todoData, onCheckBoxClick }) => {
  let { istodocompleted, todoitem, item_id } = todoData;

  return (
    <div className="todoItemContainer">
      <input
        type="checkbox"
        checked={istodocompleted}
        onChange={() => {
          onCheckBoxClick(item_id);
        }}
      />
      <span
        className="todoItemText"
        style={
          istodocompleted
            ? { textDecoration: "line-through" }
            : { textDecoration: "none" }
        }
      >
        {todoitem}
      </span>
    </div>
  );
};

export default TodoItem;
