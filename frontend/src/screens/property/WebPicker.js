import React from 'react';

// Componente simple para representar un selector en web
const WebPicker = ({ selectedValue, onValueChange, children, style }) => {
  return (
    <select
      value={selectedValue}
      onChange={(e) => onValueChange(e.target.value)}
      style={{
        height: 50,
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 16,
        border: 'none',
        outline: 'none',
        ...style
      }}
    >
      {React.Children.map(children, child => {
        if (!child) return null;
        return (
          <option value={child.props.value}>
            {child.props.label}
          </option>
        );
      })}
    </select>
  );
};

WebPicker.Item = ({ label, value }) => null;

export default WebPicker; 