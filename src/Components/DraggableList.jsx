import React from 'react';

const DraggableList = ({ onDragStart }) => {
  return (
    <React.Fragment>
      <h2 className='sidebar-head'>BLOCKS</h2>
      <div className="sidebar-item" draggable onDragStart={(event) => onDragStart(event, 'Label')}>
          Label
      </div>
      <div className="sidebar-item" draggable onDragStart={(event) => onDragStart(event, 'Input')}>
       Input
      </div>
      <div className="sidebar-item" draggable onDragStart={(event) => onDragStart(event, 'Button')}>
       Button
      </div>
    </React.Fragment>
  );
};

export default DraggableList;
