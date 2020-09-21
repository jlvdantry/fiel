import React, {Component} from 'react';
import fiel from '../fiel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RichTextEditor from 'react-rte';
import {getTextAlignBlockMetadata, getTextAlignClassName, getTextAlignStyles} from 'react-rte/lib/lib/blockStyleFunctions';


class Firmar extends Component {
  constructor(props){
    super(props);
    console.log('antes de state');
    this.state = {  value: RichTextEditor.createEmptyValue() } 
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

  render() {
   console.log('rendereo');
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

    return  (
         <>
	      <RichTextEditor
		value={this.state.value}
		onChange={this.onChange}
                placeholder={placeHolder}
                blockStyleFn={getTextAlignClassName}
                toolbarConfig={toolbarConfig}
	      />
         </>
    )
  }
};
export default Firmar;
