import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { columns } from '../utils/columnHeders';
import { useState } from 'react';
import { IVolunter } from '../interfaces/volunteer';
import { Button } from '@mui/material';
import { PDFViewer, Page, View, Document,Text } from '@react-pdf/renderer';
import { TableData } from './TableData';

export const Table =() => {

    const [volunteers, setVolunteers] = useState< IVolunter[] | null >(null)
    const [viewPdf, setViewPdf] = useState< boolean>(false)

    const handleExcel = ( event: any ) =>{
        const [file] = event.target.files
        const reader = new FileReader()

        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb =  XLSX.read(bstr, {type: 'binary'});
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data: any = XLSX.utils.sheet_to_json(ws);
            const volunteerArray: IVolunter[] = []
            
            for(let i = 3; i < data.length; i++){

                
                volunteerArray.push({
                    __EMPTY: data[i].__EMPTY,
                    __EMPTY_2: data[i].__EMPTY_2,
                    __EMPTY_6: data[i].__EMPTY_6,
                    __EMPTY_14: data[i].__EMPTY_14,
                    paquete: Math.round(data[i].__EMPTY_14 / 7 ) 
                })
            }

            setVolunteers(volunteerArray)
        }
        reader.readAsBinaryString(file);

    }

    const generatePdf = () => {
      setViewPdf(true)
    }
    const returnTable = () => {
      setViewPdf(false)
    }
  return (
    
    <div style={{ height: '80%', width: '100%' }}>
      {
        viewPdf ?
        <Button variant='outlined' color='success' onClick={returnTable}>Volver a la tabla</Button> : null}
    {
      !viewPdf ? 
      <>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
      <input id='inputTag' type='file' accept='.xlsx, .xls, .csv' className='input-file' onChange={handleExcel}/>
      <Button variant='outlined' color='error' disabled={volunteers? false : true } onClick={generatePdf}>Generar PDF</Button>
    </div>
      <DataGrid
        rows={volunteers ?? []}
        getRowId={(row) => row?.__EMPTY}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
      </>
      :
      <PDFViewer width="100%" height="100%">
        <Document>
            <Page size="A4">
              <View>
                <View style={{width: '100%', display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems:'center', border: '1px solid black'}}>
                  <View><Text>Código</Text></View>
                  <View><Text>Nombre</Text></View>
                  <View><Text>Puesto</Text></View>
                  <View><Text>Horas trabajadas</Text></View>
                  <View><Text>Paquete </Text></View>
                </View>

                {
                  volunteers?.map((volunteer, index) => (
                    <TableData key={index} data={volunteer}/>
                    ))
                  }
              </View>
            </Page>
            </Document>
          </PDFViewer>
      }
    </div>
  )
}
