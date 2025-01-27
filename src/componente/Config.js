import React, { useState } from 'react';

function Config() {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
    var obj = { muestra:event.target.checked };
    window.insertaOActualizaConfig(obj,'Log');
  };

  return (
    <div>
      <label>
        ¿Muestra log?  
	<input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
        />
        <span>{isChecked ? " Si" : " No"}</span>
      </label>
    </div>
  );
}

export default Config;
