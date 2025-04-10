import React from 'react';

// Componente simple para representar un selector en web con estilo de Airbnb
// pero usando una paleta de azules
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
        border: '1px solid #e4e4e4',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        color: '#003366', // Color de texto azul marino
        outline: 'none',
        cursor: 'pointer',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
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