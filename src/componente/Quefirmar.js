import React, {Component} from 'react';
import RichTextEditor from 'react-rte';
import { getTextAlignClassName } from 'react-rte/lib/lib/blockStyleFunctions';
import { Dropdown,DropdownToggle,DropdownMenu,DropdownItem,Card } from 'reactstrap';
import PropTypes from 'prop-types';


class Quefirmar extends Component {
  constructor(props){
    super(props);
    this.state = {  value: RichTextEditor.createEmptyValue(),dropdownOpen:false,dropdownValue:'Texto libre' } 
    this.onChange = this.onChange.bind(this)
    this.toggle =  this.toggle.bind(this)
    this.changeValue =  this.changeValue.bind(this)
          this.DomEditor = React.createRef() 
  }

    toggle(event) {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }


  onChange = (value) => {
    console.log('va onChange');
    this.setState({value});
    if (this.props.onChange) {
      this.props.onChange(
        value.toString('html')
      );
      //this.props.onRefresca(value);
    }
    if (this.props.onRefrescaValor) {
      console.log('va onRefresca');
      this.props.onRefrescaValor(value);
    }
  };

    changeValue(e) {
        this.setState({dropdownValue: e.currentTarget.textContent});
    }

    componentDidMount(){
    //      this.DomEditor._focus()
    }

  render() {
   const placeHolder='Teclee aqui lo que desea firmar'
   const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS','BLOCK_ALIGNMENT_BUTTONS'],
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
    ],
    BLOCK_ALIGNMENT_BUTTONS : [{ label: 'Align Left', style: 'ALIGN_LEFT' }, { label: 'Align Center', style: 'ALIGN_CENTER' }, { label: 'Align Right', style: 'ALIGN_RIGHT' }, { label: 'Align Justify', style: 'ALIGN_JUSTIFY' }]
  };

    const dropdownValue = this.state.dropdownValue

    return  (
         <>
            <Card className="p-2 m-2">
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
                ref={this.DomEditor}
                autoFocus={true}
	      />
            </Card >
         </>
    )
  }
};

Quefirmar.propTypes = {
  onRefrescaValor: PropTypes.func.isRequired
};

Quefirmar.defaultProps = {
  onRefrescaValor: () => null
}

export default Quefirmar;
