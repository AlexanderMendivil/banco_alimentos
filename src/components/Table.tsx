import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { columns } from '../utils/columnHeders';
import { useState } from 'react';
import { IVolunter } from '../interfaces/volunteer';
import { Button } from '@mui/material';
import { PDFViewer, Page, View, Document, Text } from '@react-pdf/renderer';
import { TableData } from './TableData';
import { Spinner } from 'reactstrap'

export const Table = () => {

  const [volunteers, setVolunteers] = useState<IVolunter[] | null>(null)
  const [viewPdf, setViewPdf] = useState<boolean>(false)

  // Variables to generate excel
  const [loading, setLoading] = useState<boolean>(false)
  const titulo = [{ A: "PAQUETES DE VOLUNTARIOS"}, {}]
  const longitudes = [11, 40, 24]

  const handleExcel = (event: any) => {
    const [file] = event.target.files
    const reader = new FileReader()

    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data: any = XLSX.utils.sheet_to_json(ws);
      const volunteerArray: IVolunter[] = []

      for (let i = 3; i < data.length; i++) {
        volunteerArray.push({
          __EMPTY: data[i].__EMPTY,
          __EMPTY_2: data[i].__EMPTY_2,
          __EMPTY_6: data[i].__EMPTY_6,
          __EMPTY_14: data[i].__EMPTY_14,
          paquete: Math.round(data[i].__EMPTY_14 / 7)
        })
      }

      setVolunteers(volunteerArray)
    }
    reader.readAsBinaryString(file);
  }

  const generateExcel = () => {
    setLoading(true);
  
    let tabla: { [key: string]: string }[] = [
      {
        A: 'CÓDIGO',
        B: 'VOLUNTARIO',
        C: 'PAQUETE A ENTREGAR',
      },
    ];
  
    volunteers?.forEach((item) => {
      tabla.push({
        A: item.__EMPTY,
        B: item.__EMPTY_2,
        C: item.paquete.toString(),
      });
    });
  
    const dataFinal: any[] = [...titulo, ...tabla];
  
    setTimeout(() => {
      crearExcel(dataFinal);
      setLoading(false);
    }, 1000);
  };
  
  const crearExcel = (dataFinal: any[]) => {
    if (volunteers) {
      const libro = XLSX.utils.book_new();
      const hoja = XLSX.utils.json_to_sheet(dataFinal, { skipHeader: true });
  
      hoja['!merges'] = [
        XLSX.utils.decode_range('A1:C1'),
        XLSX.utils.decode_range('A2:C2'),
      ];
  
      let propiedades: XLSX.ColInfo[] = [];
  
      longitudes.forEach((col) => {
        propiedades.push({
          width: col,
        });
      });
  
      hoja['!cols'] = propiedades;
  
      XLSX.utils.book_append_sheet(libro, hoja, 'Voluntarios');
  
      XLSX.writeFile(libro, 'ASISTENCIA VOLUNTARIADO.xlsx');
    } else {
      console.error('Error: No existen registros de voluntarios');
      setLoading(false);
    }
  };

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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <input id='inputTag' type='file' accept='.xlsx, .xls, .csv' className='input-file' onChange={handleExcel} />
              <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>

                { !loading ? (
                  <Button variant='outlined' color='error' disabled={volunteers ? false : true} onClick={generateExcel}>Generar Excel</Button>
                ) : (
                  <Button variant='outlined' color='error' disabled><Spinner size="sm">Cargando...</Spinner></Button>
                ) }

                <Button variant='outlined' color='error' disabled={volunteers ? false : true} onClick={generatePdf}>Generar PDF</Button>
              </div>
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
                  <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', border: '1px solid black' }}>
                    <View><Text>Código</Text></View>
                    <View><Text>Nombre</Text></View>
                    <View><Text>Puesto</Text></View>
                    <View><Text>Horas trabajadas</Text></View>
                    <View><Text>Paquete </Text></View>
                  </View>

                  {
                    volunteers?.map((volunteer, index) => (
                      <TableData key={index} data={volunteer} />
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
