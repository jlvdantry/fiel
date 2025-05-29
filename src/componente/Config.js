import React, { useEffect,useState } from 'react';

function Config() {
  const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		    console.log('useEffect');
		    window.dameMuestraLog().then( x => {
		        console.log('useEffect dameMuestraLog');
		if (x===true) { document.querySelector('#myCheck').checked=true; } else { document.querySelector('#myCheck').checked=false; };
		    });
	}, []);

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
    <div >
      <label >
        ¿Muestra log?  
	<input type="checkbox" className="m-3" checked={isChecked} onChange={handleChange} id="myCheck"/>
      </label>
    </div>
  );

}

export default Config;
