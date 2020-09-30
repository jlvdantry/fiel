import React, {Component} from 'react';
import fiel from '../fiel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RichTextEditor from 'react-rte';
import {getTextAlignBlockMetadata, getTextAlignClassName, getTextAlignStyles} from 'react-rte/lib/lib/blockStyleFunctions';
import { Card,CardBody,CardHeader,Dropdown,DropdownToggle,DropdownMenu,DropdownItem } from 'reactstrap';
import Firmar from './Firmar';


class Misfirmas extends Component {
  constructor(props){
    super(props);
    console.log('antes de state');
    this.state = {  value: RichTextEditor.createEmptyValue(),dropdownOpen:false,dropdownValue:'Texto libre' } 
    console.log('depues de state');
    this.onChange = this.onChange.bind(this)
  }

  onChange = (value) => {
    this.setState({value});
    console.log('entro en onChange');
    if (this.props.onChange) {
      this.props.onChange(
        value.toString('html')
      );
    }
  };

    changeValue(e) {
        this.setState({dropdownValue: e.currentTarget.textContent});
    }


  render() {
   const placeHolder='Teclee aqui lo que desea firmar'
   const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
      {label: 'Negrillas', style: 'BOLD', className: 'custom-css-class'},
      {label: 'Italica', style: 'ITALIC'},
      {label: 'Subrayado', style: 'UNDERLINE'}
    ],
    BLOCK_TYPE_DROPDOWN: [
      {label: 'Normal', style: 'unstyled'},
      {label: 'Encabezado grande', style: 'header-one'},
      {label: 'Encabezado medio', style: 'header-two'},
      {label: 'Encabezado pequeño', style: 'header-three'}
    ],
    BLOCK_TYPE_BUTTONS: [
      {label: 'UL', style: 'unordered-list-item'},
      {label: 'OL', style: 'ordered-list-item'}
    ]
  };
    const dropdownValue = this.state.dropdownValue

    return  (
         <>
                        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}  className="d-flex justify-content-center mb-2" >
                              <DropdownToggle caret color="primary">
                                           Firma un {dropdownValue}
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem onClick={this.changeValue} >Texto libre</DropdownItem>
                                <DropdownItem onClick={this.changeValue} >Texto estructurado</DropdownItem>
                                <DropdownItem onClick={this.changeValue} >Pdf</DropdownItem>
                              </DropdownMenu>
                        </Dropdown>

	      <RichTextEditor
		value={this.state.value}
		onChange={this.onChange}
                placeholder={placeHolder}
                blockStyleFn={getTextAlignClassName}
                toolbarConfig={toolbarConfig}
	      />
              <Firmar value={this.state.value.toString('markdown')}/>
         </>
    )
  }
};
export default Misfirmas;
