import React, {Component} from 'react';
import { leefacturas, cuantasfacturas } from '../db';
import {Doughnut} from 'react-chartjs-2';


class Graficafael extends Component {
  constructor(props){
    super(props);
    this.state = { data:{}}
  }

  componentWillMount(){
        var that=this;
        leefacturas().then(function(cuantas) {
                       var labels = [];
                       var colors = [];
                       var datase = [];
                       var datasr = [];
		    var dynamicColors = function() {
			var r = Math.floor(Math.random() * 255);
			var g = Math.floor(Math.random() * 255);
			var b = Math.floor(Math.random() * 255);
			return "rgb(" + r + "," + g + "," + b + ")";
		    };
                       cuantas.map((x) => {
                                   var rfce=x.valor.passdata["cfdi:Comprobante"]["cfdi:Emisor"]["@attributes"].Rfc;
                                   var rfcr=x.valor.passdata["cfdi:Comprobante"]["cfdi:Receptor"]["@attributes"].Rfc;
                                   var total=parseFloat(x.valor.passdata["cfdi:Comprobante"]["@attributes"].Total);
                                   if (labels.indexOf(rfce) ===-1) {
                                          labels.push(rfce);
                                          datase.push(total);
                                          datasr.push(0);
                                   } else {
                                      datase[labels.indexOf(rfce)]+=total;
                                   }
                                   if (labels.indexOf(rfcr) ===-1) {
                                          labels.push(rfcr);
                                          datasr.push(total);
                                          datase.push(0);
                                   } else {
                                      datasr[labels.indexOf(rfcr)]+=total;
                                   }
                                   console.log('emisor='+rfce+' datase='+datase);
                                   console.log('receptos='+rfcr+' datase='+datasr);
                       })
                       labels.map((x) => {
                                   colors.push(dynamicColors());
                       })
                       labels.map((x) => {
                                   colors.push(dynamicColors());
                       })

                       console.log('labels='+labels);
                                                            that.setState({data:{labels : labels ,datasets: [
                                                                                        {data:datase,backgroundColor:colors}
                                                                                        ,{data:datasr,backgroundColor:colors}
                                                                                         ]}});
                                                    }).catch(function(err)  {
                                                            that.setState({data:{}});
                                                    });
  }

  render() {
    const data = this.state.data;
    console.log('data='+data);
    return  (
        <Doughnut data={data}>
        </Doughnut>
    )
  }
};
export default Graficafael;
