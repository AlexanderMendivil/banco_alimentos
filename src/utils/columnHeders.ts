import { GridColDef } from '@mui/x-data-grid';
export const columns: GridColDef[] = [
    {
        field: '__EMPTY',
        headerName: 'Código',
        width: 150,
    },
    {
        field: '__EMPTY_2',
        headerName: 'Nombre',
        width: 250,
    },
    {
        field: '__EMPTY_6',
        headerName: 'Puesto',
        width: 250,
    },
    {
        field: '__EMPTY_14',
        headerName: 'horas trabajadas',
        type: 'number',
        width: 200,
    },
    {
        field: 'paquete',
        headerName: 'Paquete',
        type: 'number',
        width: 200,
    },
  ];
  