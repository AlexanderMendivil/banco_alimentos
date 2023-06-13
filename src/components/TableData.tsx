import {Text, View } from '@react-pdf/renderer';
export const TableData = ({data}: any) => {
  return (
    <View style={{width: '100%', display: 'flex', flexDirection:'row', alignItems:'center', border: '1px solid black'}}>
        <View ><Text style={{fontSize: 8, marginLeft: 10}}>{data.__EMPTY}</Text></View>
        <View ><Text style={{fontSize: 8, width: 130, marginLeft: 50,}}>{data.__EMPTY_2}</Text></View>
        <View ><Text style={{fontSize: 8, width: 150}}>{data.__EMPTY_6}</Text></View>
        <View ><Text style={{fontSize: 8, width:50, marginLeft: 50}}>{data.__EMPTY_14}</Text></View>
        <View ><Text style={{fontSize: 8, marginLeft: 90}}>{data.paquete}</Text></View>
    </View>
  )
}