var insertaRFCS = function insertaRFCS() {
    // 1. Primero leemos qué hay en la tabla
    leeRFCS().then(datos => {
        // Filtrar para ver si ya existen registros del catálogo 'rfcs'
        const existenDatos = datos.filter(item => item.catalogo === 'rfcs').length > 0;

        if (existenDatos) {
            console.log("El catálogo de RFCs ya tiene información. No se insertarán los valores por defecto.");
            return; // Salimos de la función sin hacer nada
        }

        // 2. Si está vacía, procedemos a insertar con IDs fijos y Alias en Mayúsculas
        console.log("Insertando datos iniciales del catálogo...");
        
        const iniciales = [
            {id: 1, catalogo:'rfcs', label:'GDF9712054NA', alias:'CDMX GOBIERNO', activo:true},
            {id: 2, catalogo:'rfcs', label:'NWM9709244W4', alias:'WALMART O AURRERA', activo:true},
            {id: 3, catalogo:'rfcs', label:'FGU830930PD3', alias:'FARMACIAS GUADALAJARA', activo:true},
            {id: 4, catalogo:'rfcs', label:'TTB040915CY9', alias:'TRES B', activo:true},
            {id: 5, catalogo:'rfcs', label:'SSD050315240', alias:'SIMILARES', activo:true},
            {id: 6, catalogo:'rfcs', label:'MCS2007152D3', alias:'METROPOLITA CAR SHOW', activo:true},
            {id: 7, catalogo:'rfcs', label:'SAT8410245V8', alias:'SEGUROS ATLAS', activo:true},
            {id: 8, catalogo:'rfcs', label:'GPA161202UGB', alias:'FACTURA GAS', activo:true}
        ];

        iniciales.forEach(objeto => {
            inserta_catalogo('catalogos', objeto);
        });
        
    }).catch(err => {
        console.error("Error al validar el estado del catálogo:", err);
    });
}
