import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { columns } from '../utils/columnHeders';
import { useState } from 'react';
import { IVolunter } from '../interfaces/volunteer';

export const Table =() => {

    const [volunteers, setVolunteers] = useState< IVolunter[] | null >(null)
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
  return (
    <div style={{ height: '80%', width: '100%' }}>

<input id='inputTag' type='file' accept='.xlsx, .xls, .csv' className='input-file' onChange={handleExcel}/>
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
    </div>
  )
}
