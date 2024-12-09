import { useState, useEffect } from "preact/hooks";
import style from "./style.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { generateBoxShadow, generateUniqueId } from "./function";
import { initialBoxShadow, template1, template2 } from "./variable";
// Main component
const Home = () => {
  const [shadowProps, setShadowProps] = useState(initialBoxShadow);
  const [selectedItem, setSelectedItem] = useState(null);
  const [listBoxShadow, setListBoxShadow] = useState([
    {
      id: generateUniqueId(),
      boxShadow: generateBoxShadow(shadowProps),
      shadowProps: { ...shadowProps },
    },
  ]);

  const [boxShadowColor, setBoxShadowColor] = useState({
    boxColor: "#3D9DF6",
    boxBgColor: "#FFFFFF",
  });

  useEffect(() => {
    if (listBoxShadow.length > 0 && selectedItem === null) {
      setSelectedItem(listBoxShadow[0].id);
    }
  }, [listBoxShadow]);

  const handleSelectBoxShadow = (index) => {
    const selectedShadow = listBoxShadow[index];
    setShadowProps(selectedShadow.shadowProps);
    setSelectedItem(selectedShadow.id);
  };

  const handleShadowChange = (property, value) => {
    setShadowProps((prevProps) => {
      if (property === "opacity") {
        value = isNaN(value) ? 0.2 : parseFloat(value);
      }

      const updatedProps = { ...prevProps, [property]: value };
      if (selectedItem !== null) {
        updateBoxShadowInList(updatedProps);
      }

      return updatedProps;
    });
  };

  const updateBoxShadowInList = (updatedProps) => {
    const updatedList = listBoxShadow.map((item) =>
      item.id === selectedItem
        ? {
            ...item,
            boxShadow: generateBoxShadow(updatedProps),
            shadowProps: updatedProps,
          }
        : item
    );
    setListBoxShadow(updatedList);
  };

  const handleAddLayer = () => {
    const newLayer = {
      id: generateUniqueId(),
      boxShadow: generateBoxShadow(initialBoxShadow),
      shadowProps: { ...initialBoxShadow },
    };
    setListBoxShadow((prev) => [...prev, newLayer]);
  };

  const handleRemoveLayer = (id) => {
    if (listBoxShadow.length === 1) return;

    const newSelectedItem =
      selectedItem === id && listBoxShadow[0].id !== id
        ? listBoxShadow[0].id
        : listBoxShadow[1].id;

    setListBoxShadow((prev) => prev.filter((item) => item.id !== id));
    setSelectedItem(newSelectedItem);
  };

  const handleOnDragEnd = ({ source, destination }) => {
    if (!destination) return;

    const updatedList = Array.from(listBoxShadow);
    const [removed] = updatedList.splice(source.index, 1);
    updatedList.splice(destination.index, 0, removed);

    setListBoxShadow(updatedList);
  };

  const combinedBoxShadow = listBoxShadow
    .map((item) => item.boxShadow)
    .join(", ");
  const combinedBoxShadowTemplate1 = template1
    .map(generateBoxShadow)
    .join(", ");
  const combinedBoxShadowTemplate2 = template2
    .map(generateBoxShadow)
    .join(", ");

  const addTemplate = (template) => {
    const isTemplatePresent =
      listBoxShadow.length === template.length &&
      listBoxShadow.every((item, index) =>
        Object.keys(template[index]).every(
          (key) => item.shadowProps[key] === template[index][key]
        )
      );

    const newShadows = (
      isTemplatePresent ? [...template].reverse() : [...template]
    ).map((props) => ({
      id: generateUniqueId(),
      boxShadow: generateBoxShadow(props),
      shadowProps: { ...props },
    }));

    setSelectedItem(newShadows[0].id);
    setListBoxShadow(newShadows);
  };

  const addTemplate1 = () => addTemplate(template1);
  const addTemplate2 = () => addTemplate(template2);

  return (
    <div class={style.container}>
      <div class={style.box}>
        <div class={style.paper}>
          <div class={style.controls}>
            <h3>Box-Shadow CSS Generator</h3>
            {[
              {name: "Shift Right", variable: "shiftRight", min: -50, max: 50, step: 1},
              {name: "Shift Down", variable: "shiftDown", min: -50, max: 50, step: 1},
              {name: "Spread", variable: "spread", min: 0, max: 100, step: 1},
              {name: "Blur", variable: "blur", min: 0, max: 100, step: 1},
              {name: "Opacity", variable: "opacity", min: 0, max: 100, step: 1},
            ].map((item, index) => (
              <label key={index}>
                {item.name}
                <span> {shadowProps[item.variable]}</span>
                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={shadowProps[item.variable]}
                  onChange={(e) => handleShadowChange(item.variable, e.target.value)}
                />
              </label>
            ))
            }
            <label>
              <input
                type="checkbox"
                checked={shadowProps.inset}
                onChange={(e) => handleShadowChange("inset", e.target.checked)}
              />
              Inset
            </label>
            <label>
              Color
              <input
                type="color"
                value={shadowProps.color}
                onInput={(e) => handleShadowChange("color", e.target.value)}
              />
            </label>
          </div>
        </div>
        <div class={style.paper}>
          <button class={style.button} onClick={handleAddLayer}>
            Add Layer
          </button>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  class={style.listBox}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {listBoxShadow.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          class={`${style.item} ${
                            selectedItem === item.id ? style.selected : ""
                          }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => handleSelectBoxShadow(index)}
                        >
                          {`box-shadow: ${item.boxShadow}`}
                          <button
                            class={style.removeButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveLayer(item.id);
                            }}
                            aria-label="Remove layer"
                            style={{
                              marginLeft: "10px",
                            }}
                          >
                            Xóa
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      <div class={style.box}>
        <div class={style.paper}>
          <div class={style.box_preview_title}>
            <h3>Preview</h3>
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <input
                type="color"
                value={boxShadowColor.boxBgColor}
                onInput={(e) => {
                  setBoxShadowColor({
                    ...boxShadowColor,
                    boxBgColor: e.target.value,
                  });
                }}
              />
              <input
                type="color"
                value={boxShadowColor.boxColor}
                onInput={(e) => {
                  setBoxShadowColor({
                    ...boxShadowColor,
                    boxColor: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div
            class={style.preview}
            style={{
              backgroundColor: boxShadowColor.boxBgColor,
            }}
          >
            <div
              style={{
                boxShadow: combinedBoxShadow,
                backgroundColor: boxShadowColor.boxColor,
                transition: "all 0.3s",
              }}
            ></div>
          </div>
        </div>
        <div class={style.paper}>
          <h3>CSS code</h3>
          <p>{`box-shadow: ${combinedBoxShadow};`}</p>
        </div>
        <div class={style.paper}>
          <h3>Template</h3>
          <div class={style.box_template}>
            <button onClick={addTemplate1}>
              <div style={{ boxShadow: combinedBoxShadowTemplate1 }}></div>
            </button>
            <button onClick={addTemplate2}>
              <div style={{ boxShadow: combinedBoxShadowTemplate2 }}></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
