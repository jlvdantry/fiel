/* Revisa si esta autenticado */
var revisaSiEstaAutenticado = () => {
        dame_pwd().then(pwd => {
            if (pwd!==null)  { /* ya se tecleo la pwd */
               if (DMS===null) {
                   PWDFIEL= pwd;
                   DMS= new DescargaMasivaSat();
               }
               DMS.getTokenEstatusSAT().then( res => {
                   console.log('[se encontro token su estatus='+(res!==undefined ? res.tokenEstatusSAT : 'indefinido'));
                   if (res===undefined || res.tokenEstatusSAT===TOKEN.NOSOLICITADO || res.tokenEstatusSAT===TOKEN.CADUCADO
                                       || res.tokenEstatusSAT===ESTADOREQ.ERROR || res.tokenEstatusSAT===TOKEN.NOGENERADO
                                       || res.tokenEstatusSAT===ESTADOREQ.ERRORFETCH
                      ) {
                               console.log('Va a generar el request de autenticacion');
                               DMS.autenticate_armasoa(pwd).then( x => { console.log('[rSEA] genero el request de autentificacion') });
                   }
               }).catch(er => { console.log('[sw rSEA] error en getTokenEstatusSAT '+er);})
            }
        }).catch(er => { console.log('[sw rSEA] error en dame_pwd '+er)
        });
}

