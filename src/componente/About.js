import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import { Card,CardBody } from 'reactstrap';
class About extends Component {

  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

   state={ collapseID: "toggler", windowWidth : window.innerWidth || document.documentElement.clientWidth , windowHeight : window.innerHeight || document.documentElement.clientHeight
                       ,APPVERSION: null}
   toggle = collapseID => () => {
          console.log('si dio click');
	  this.setState(prevState => ({
	    collapseID: prevState.collapseID !== collapseID ? collapseID : ""
	  }));
   }

   componentDidMount(){
                window.addEventListener('resize', this.updateWindowDimensions)
		ReactDOM.findDOMNode(this).addEventListener('touchstart', (e)=>{ 
		    console.log("touchstart triggered");
		},{passive: true});

		if ('serviceWorker' in navigator) {
		  navigator.serviceWorker.ready.then((registration) => {
		    if (registration.active) {
		      registration.active.postMessage({ action: 'GET_VERSION' });
		    }
		  });

		  // Listen for version response from the service worker
		  navigator.serviceWorker.addEventListener('message', (event) => {
		    if (event.data && event.data.action === 'VERSION') {
		      console.log('Service Worker Version:', event.data.version);
			    this.setState({APPVERSION:event.data.version}) ;
		      // Optionally display the version in the UI
		    }
		  });
		}

   }

   ponpasivo = () => {
		ReactDOM.findDOMNode(this).addEventListener('touchstart', (e)=>{ 
		    console.log("touchstart triggered");
		},{passive: true});
   }

   updateWindowDimensions() {
          this.setState({ windowWidth: window.innerWidth || document.documentElement.clientWidth, windowHeight: window.innerHeight || document.documentElement.clientHeight});
   }


  render() {

     return  (
        <div id="ayuda" data-role="dialog" data-url="ayuda" data-theme="d">
          <div data-role="header">
                  <h2 className="text-center">Se muestra información acerca del aplicativo</h2>
          </div>
          <div data-role="content">
                 <div className="mb-2" >
			<Card >
			  <CardBody>
				  <p className="text-justify">Versión de la base de datos <b>{window.DBVERSION}</b></p>
				  <p className="text-justify">Alto de la pantalla <b>{this.state.windowHeight}px</b></p>
				  <p className="text-justify">Ancho de la pantalla <b>{this.state.windowWidth}px</b></p>
				  <p className="text-justify">Versión del aplicativo <b>{this.state.APPVERSION}</b></p>
			  </CardBody>
			</Card>
                  </div>
          </div>
        </div>
    )
  };
};
export default About;
