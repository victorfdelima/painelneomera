import React, {useEffect, useState} from 'react';
import axios from 'axios'
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nome', alignRight: false },
  { id: 'cpf', label: 'CPF', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'isaproved', label: 'Verificado', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'acao', label: 'Ação'},
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.nome.toLowerCase().indexOf(query.toLowerCase())!== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('nome');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [candidatos, setCand] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/candidatos', {
      mode: 'cors'
    })
    .then(response => {
      setCand(response.data)
     }     )
  },[])
  

    // Delete By ID
  const handleDelete = (id, e) =>{
    e.preventDefault();
    fetch(`http://localhost:4000/api/candidatos/${id}`,{
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      },
    }).then(resp => resp.json())
    .then((data) => {
      setCand(candidatos.filter((candidato)=> candidato.id !== id))
    })
    .catch(err => console.log(err))
  }

  const handleEditar = (id, e) =>{
    e.preventDefault();
    fetch(`http://localhost:4000/api/candidatos/${id}`,{
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
    }).then(resp => resp.json())
    .then((data) => {
      setCand(candidatos.filter((candidato)=> candidato.id !== id))
    })
    .catch(err => console.log(err))
  }
  // const handleOpenMenu = (event) => {
  //   setOpen(event.currentTarget);
  // };

  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = candidatos.map((n) => n.nome);
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };

  const handleClick = (event, nome) => {
    const selectedIndex = selected.indexOf(nome);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, nome);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - candidatos.length) : 0;

  const filteredUsers = applySortFilter(candidatos, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;




  return (
    <>
      <Helmet>
        <title> Candidatos </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Candidatos
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Novo Candidato
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={candidatos.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, nome, email, status, cpf, isaproved } = row;
                    const selectedUser = selected.indexOf(nome) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, nome)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {nome}
                            </Typography>
                          </Stack>
                          
                        </TableCell>

                        <TableCell align="left">{cpf}</TableCell>

                        <TableCell align="left">{email}</TableCell>

                        <TableCell align="left">
                        <Label color={isaproved === 'Candidato Ativo'? 'success': 'warning'}>{isaproved === true ? 'Candidato Ativo' : 'Candidato Pendente'}</Label>  
                        </TableCell>

                        <TableCell align="left">
                          
                          <Label color={(status === 'reprovado' ? 'error' : status === 'aprovado' ? 'info' : status === 'concluido' ? 'success': 'warning')}>{sentenceCase(status)}</Label>
                        </TableCell>

                        <TableCell align="left">
                        <Button
                          onClick={(e) => handleEditar(id, e)}
                          >
                            Editar
                          </Button>
                          <Button
                          onClick={(e) => handleDelete(id, e)}
                          >
                            Deletar
                          </Button>
                        </TableCell>
                        
                      </TableRow>
                  
                    );
                  
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Não encontrado
                          </Typography>

                          <Typography variant="body2">
                            Sem resultados para &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Tente procurar por outro nome ou sobrenome.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            labelRowsPerPage={"Candidatos por Página"}
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={candidatos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
