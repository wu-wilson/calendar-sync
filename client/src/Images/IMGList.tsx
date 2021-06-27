// Type IMGitem declaration
type IMGitem = {
  todo: string;
  complete: string | undefined;
};

const ListImg = () => {
  // Array of todo items
  const items: IMGitem[] = [
    { todo: "Write 2nd body paragraph", complete: "IMGComplete" },
    { todo: "Add visual aid to slide 15", complete: undefined },
    { todo: "Write 3rd body paragraph", complete: "IMGComplete" },
    { todo: "Proofread Sarah's body paragraph", complete: undefined },
    { todo: "Practice project script", complete: undefined },
    { todo: "Revise conclusion paragraph", complete: "IMGComplete" },
    { todo: "Edit script introduction", complete: "IMGComplete" },
  ];

  return (
    <div className="IMGContainer Scroll">
      <div className="IMGListTitle">My List</div>
      <div className="IMGInputContainer">
        <div className="IMGInput">Add item here...</div>
        <div className="IMGSubmit">Add</div>
      </div>
      <div className="IMGItemsContainer">
        {items.map((item) => (
          <div className="IMGItem" key={item.todo}>
            <li className={item.complete}>{item.todo}</li>
            <div className="IMGBtnContainer">
              <div className="IMGXBtn">X</div>
              <div className="IMG✓Btn">✓</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListImg;
