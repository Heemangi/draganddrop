import React, { useState, useEffect } from "react";
import DraggableList from "./DraggableList";
import Sidebar from "./Sidebar";
import Page from "./Page";

const PageBuilder = () => {
  //elements  stores an array of elements representing items on the page. It attempts to retrieve the
  //elements from local storage and initializes them to an empty array if not found.
  const [elements, setElements] = useState(
    JSON.parse(localStorage.getItem("elements")) || []
  );

  const [modalCoordinates, setModalCoordinates] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState();
  const [fontWeight, setFontWeight] = useState("normal");

  //We need to show a modal immediately on initial drop as specified in problem that's why separate state for initial drop
  const [initialDrop, setInitialDrop] = useState(false);

  // It listens for keydown events and calls the handleKeyDown function. keydown means pressing a key.
  // It's also cleaned up when the component unmounts.called every time element is selected
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElement]);

  //When elements change, it updates the local storage with the new elements data.
  useEffect(() => {
    localStorage.setItem("elements", JSON.stringify(elements));
  }, [elements]);

  //Called when a key is pressed. It checks if the Enter key is pressed and an element is selected, it sets the modal coordinates and shows the modal.
  //If the Delete key is pressed and an element is selected, it removes that element from the elements state.
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && selectedElement) {
      setModalCoordinates(selectedElement.position);
      setShowModal(true);
    } else if (event.key === "Delete" && selectedElement) {
      setElements((prevElements) =>
        prevElements.filter((element) => element !== selectedElement)
      );
      setSelectedElement(null);
    }
  };

  const handleDrop = (event) => {
    //Prevents default action of opening a modal everytime on the drop after drag and duplicating the lement after drag and drop
    event.preventDefault();
    //retrieves the data associated with the dragged element from the event object. elementType is the key.
    const elementType = event.dataTransfer.getData("elementType");
    //clientX and Y gives the current position where element is dropped
    const newPosition = { x: event.clientX, y: event.clientY };


    //Creates a new element object with properties. 
    //These values are obtained from the state variables and the event object
    if (!initialDrop) {
      setInitialDrop(true);
      const newElement = {
        id: elements.length + 1,
        type: elementType,
        text,
        position: newPosition,
        style: {
          fontSize: `${fontSize}px`,
          fontWeight,
        },
      };
      setElements([newElement]);  //Sets the elements state variable to an array containing only the newly created element.
      setSelectedElement(newElement); //Makes this newElement as the  currently selected element.
      setModalCoordinates(newPosition); //Sets the modalCoordinates state variable to the coordinates of the dropped element, positioning the modal accordingly.
      setShowModal(true); //displaying the modal.

    } else {
      
      // creates a new array updatedElements by mapping over the elements array. 
      // For each element, it checks if it's the currently selected element. 
      // If it is, it creates a new object with the updated position; otherwise, it returns the element unchanged.
      const updatedElements = elements.map((element) =>
        element === selectedElement
          ? { ...element, position: newPosition }
          : element
      );


      setElements(updatedElements);  //sets elements array to the new array with updated positions.
      setSelectedElement({ ...selectedElement, position: newPosition });  //Updates the position of the selected element to match the new position.
      setModalCoordinates(newPosition); //updates variable to newposition .
      setInitialDrop(false);  //indicates that the first drop has already occured so that it doesn't open modal 
      //on drop again in drag and drop. 
    }
  };


  //updates the properties of the selected element with the values entered in the modal 
  // for selected element and when clicked enter to open the modal as specified in question
  const handleModalSave = () => {
    const updatedElements = elements.map((element) => {
      if (element === selectedElement) {
        return {
          ...element,
          position: modalCoordinates,
          text,
          style: {
            fontSize: `${fontSize}px`,
            fontWeight,
          },
        };
      }
      return element;
    });
    setElements(updatedElements);
    setShowModal(false);
  };


  //select an element on click
  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  //sets the selected element to be dragged
  const handleDragStart = (event, elementType) => {
    event.dataTransfer.setData("elementType", elementType);
  };


  // deselects an element on drop after dragging by making it null
  const handleDragEnd = () => {
    setSelectedElement(null);
  };

  const handleInputChange = (event, axis) => {
    const { value } = event.target; //represents the value of the input field that triggered the event.
    
    //This condition ensures that the function only updates coordinates for the x or y axis.
    if (axis === "x" || axis === "y") {
      const intValue = parseInt(value); //converted to a number

      //ensures that the input value is a valid number. Because when cleaing the input field completely 
      //It started showing NaN and didn't allow to edit the field
      if (!isNaN(intValue)) {

        // It spreads the previous coordinates (prevCoordinates) 
        // and updates the specified axis ('x' or 'y') with the parsed integer value.
        setModalCoordinates((prevCoordinates) => ({
          ...prevCoordinates,
          [axis]: intValue,
        }));

        //if number is a NaN
      } else {

        //setting the specified axis ('x' or 'y') to an empty string.
        setModalCoordinates((prevCoordinates) => ({
          ...prevCoordinates,
          [axis]: "",
        }));
      }
    }
  };

  //States for updating values of text font size and font weight
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleFontSizeChange = (event) => {
    const value = parseInt(event.target.value);
    setFontSize(isNaN(value) ? "" : value);
  };

  const handleFontWeightChange = (event) => {
    setFontWeight(event.target.value);
  };

  return (
    <React.Fragment>
      {/* sidebar consists of the draggable list defined separately */}
      <Sidebar>
        <DraggableList onDragStart={handleDragStart} />
      </Sidebar>
      {/* passing the props to page component */}
      <Page
        elements={elements}
        selectedElement={selectedElement}
        onDrop={handleDrop}
        onElementClick={handleElementClick}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        fontSize={handleFontSizeChange}
      />

      {/* If modal is true */}
      {showModal && (
        <div className="modal" style={{ fontFamily: "Poppins" }}>
          <h2>
            Edit {selectedElement && selectedElement.type} <hr />
          </h2>
          <button className="close-btn" onClick={() => setShowModal(false)}>
            X
          </button>
          <div className="modal-content">
            <div>Text</div>
            <input type="text" value={text} onChange={handleTextChange} />
            <div>X</div>
            <input
              type="text"
              value={modalCoordinates.x}
              onChange={(event) => handleInputChange(event, "x")}
            />
            <div>Y</div>
            <input
              type="text"
              value={modalCoordinates.y}
              onChange={(event) => handleInputChange(event, "y")}
            />
            <div>Font Size</div>
            <input
              type="number"
              value={fontSize}
              onChange={handleFontSizeChange}
            />
            <div>Font Weight</div>
            <input
              type="text"
              value={fontWeight}
              onChange={handleFontWeightChange}
            />
            <button onClick={handleModalSave}>Save Changes</button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default PageBuilder;
