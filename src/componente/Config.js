import React, { useState } from 'react';

function Config() {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
    console.log('[config] checked='+event.target.checked);
    var obj = { muestra:event.target.checked };
    window.insertaOActualizaConfig(obj,'Log');
    window.dameMuestraLog().then( x => {
        if (x===true) { document.querySelector('#logContainer').classList.add("d-none") } else { document.querySelector('#logContainer').classList.remove("d-none") };
    });
  };

  return (
    <div>
      <label>
        ¿Muestra log?  
	<input type="checkbox" className="m-3" checked={isChecked} onChange={handleChange} />
      </label>
    </div>
  );
}

export default Config;
