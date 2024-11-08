   importScripts('forge.min.js');
   /* genera las llaves RSA del aplicativo */
   generallaves = () => {
        lee_llaves().then( x => {
	        //console.log(' ya estan generadas las llaves');
	}).catch((error) => {
                //console.log('va a generar llaves ');
                const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
                const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
                const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
                obj={ 'pu' : publicKeyPem, 'pr':privateKeyPem , 'url':'_X_' };
                inserta_llaves(obj).then( res => {
                            console.log('alta llaves='+res);
                });

	});
   }

   /* inserta las RSA llaves en la bd */
   inserta_llaves = (obj)  => {
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then( objectStore => {
                                addObject(objectStore, obj).then( (key) => {
                                    obj.key=key;
                                    resolve(obj) ; } );
                        }).catch(function(err) {
                                console.log("[inserta_llaves] Database error: "+err.message);
                });
        })
   }

   /* lee llaves llaves RSA */
   lee_llaves = ()  => {
        return new Promise(function (resolve, reject) {
                openDatabasex(DBNAME, DBVERSION).then(function(db) {
                        return openObjectStore(db, 'request', "readwrite");
                        }).then(function(objectStore) {
                                selObjectUlt(objectStore,'url','_X_').then(function(requests) {
                                                               resolve(requests) ;
                                                            }).catch(function(err) {  reject(err) });
                        }).catch(function(err) {
                                console.log("[db.js leefirmas] Database error: "+err.message);
                });
        })
   }

   /* obtiene la pwd */
   dame_pwd = ()  => {
        return new Promise(function (resolve, reject) {
                lee_llaves().then(x => {
                        const privateKey = forge.pki.privateKeyFromPem(x.value.pr);
                        // Encrypt the message with the public key
		        encryptedBase64=x.value.pwd;	
			const encryptedBytes = forge.util.decode64(encryptedBase64);
				
			const decrypted = privateKey.decrypt(encryptedBytes, 'RSA-OAEP');
                        resolve(decrypted);
                });
        })
   }

   /* guarda el pwd encriptado */
   guarda_pwd = (obj)  => {
	   updObjectByKey('request',obj.value,obj.key);
   }

   /* Encripta la llave del pwd */
   encripta_pw = (pr) => {
	        lee_llaves().then(x => {
			const publicKey = forge.pki.publicKeyFromPem(x.value.pu);
			// Encrypt the message with the public key
			const encrypted = publicKey.encrypt(pr, 'RSA-OAEP');

			// Base64 encode the encrypted data for easy display
			const encryptedBase64 = forge.util.encode64(encrypted);
			x.value.pwd=encryptedBase64;
			guarda_pwd(x);
                });
   }
