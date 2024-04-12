import React from 'react';

// Page component takes props: elements, selectedElement, onDrop, onElementClick, onDragEnd, onDragStart
const Page = ({ elements, selectedElement, onDrop, onElementClick, onDragEnd, onDragStart }) => {
  
  // Function to handle click event on an element
  const handleElementClick = (event, element) => {
    event.stopPropagation(); // Prevents event bubbling
    onElementClick(element); // Calls onElementClick prop function with element parameter
  };

  // Function to handle drag end event
  const handleDragEnd = () => {
    onDragEnd(); // Calls onDragEnd prop function
  };

  // Function to handle drag start event
  const handleDragStart = (event, element) => {
    event.dataTransfer.setData('elementId', element.id); // Sets data for drag-and-drop operation
    onDragStart(event, element); // Calls onDragStart prop function with event and element parameters
  };

  // Function to get styling for elements
  const getElementStyle = (element) => {
    return {
      position: 'absolute',
      padding: '10px',
      top: element.position.y,
      left: element.position.x,
      cursor: 'pointer',
      border: element === selectedElement ? '4px solid red' : '2px solid black',
      fontSize: element.style.fontSize, // Sets font size
      fontWeight: element.style.fontWeight, // Sets font weight
    };
  };

  // Render method
  return (
    <div
      className="page"
      style={{ width: '80%', height: '100vh', overflow: 'auto', position: 'relative' }} // Styling for the page container
      onDrop={onDrop} // Handles drop event
      onDragOver={(event) => event.preventDefault()} // Prevents default behavior of dragover event
    >
      {/* Maps over elements array to render each element */}
      {elements.map((element, index) => (
        <div
          key={index} // Unique key for each element
          className="element" // Class name for element
          style={getElementStyle(element)} // Inline styling for element
          onClick={(event) => handleElementClick(event, element)} // Handles click event on element
          draggable={true} // Makes element draggable
          onDragStart={(event) => handleDragStart(event, element)} // Handles drag start event on element
          onDragEnd={handleDragEnd} // Handles drag end event on element
        >
          {element.text} 
          {/* Displays text content of the element */}
        </div>
      ))}
    </div>
  );
};

export default Page; // Exports Page component
