import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import { Card,CardBody } from 'reactstrap';
import { DBVERSION,APPVERSION } from '../db.js'
class About extends Component {

  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

   state={ collapseID: "toggler", windowWidth : window.innerWidth || document.documentElement.clientWidth , windowHeight : window.innerHeight || document.documentElement.clientHeight}
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
				  <p className="text-justify">Versión de la base de datos <b>{DBVERSION}</b></p>
				  <p className="text-justify">Alto de la pantalla <b>{this.state.windowHeight}px</b></p>
				  <p className="text-justify">Ancho de la pantalla <b>{this.state.windowWidth}px</b></p>
				  <p className="text-justify">Versión del aplicativo <b>{APPVERSION}</b></p>
			  </CardBody>
			</Card>
                  </div>
          </div>
        </div>
    )
  };
};
export default About;
