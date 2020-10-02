import React, {Component} from 'react';
import RichTextEditor from 'react-rte';
import Firmar from './Firmar';
import Quefirmar from './Quefirmar';
import Consultafirmas from './Consultafirmas';


class Misfirmas extends Component {
  constructor(props){
    super(props);
    this.state = {  value: RichTextEditor.createEmptyValue(),dropdownOpen:false,dropdownValue:'Texto libre' } 
    this.quefirma=React.createRef()
    this.onRefresca=this.onRefresca.bind(this);
    this.onRefrescaValor=this.onRefrescaValor.bind(this);
    this.changeConsulta=React.createRef()
  }

  onRefrescaValor(value ) {
      this.setState({ value: value });
  }

  onRefresca() {
      this.changeConsulta.current.totalFirmas();
  }


  render() {
    return  (
         <>
              <Quefirmar onRefrescaValor={this.onRefrescaValor} />
              <Firmar value={this.state.value.toString('markdown')} onRefresca={this.onRefresca} />
              <Consultafirmas ref={this.changeConsulta} onRefresca={this.onRefresca}/>
         </>
    )
  }
};
export default Misfirmas;
