import { Box, Stack } from '@mui/system'
import React, { useEffect } from 'react'
import AddEmployeeCard from '../components/AddEmployeeCard';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, useParams } from 'react-router';
import { Button, Card, CardActions, CardContent, Typography, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { getAllEmployeesData, MarkCompanyProfileCompleted } from '../../../store/hr/EmployeeSlice';
import AllAddedEmployees from '../multistep-form/addbySearch/AllAddedEmployees';
import AlertMessage from '../../../components/shared/AlertMessage';
import { updateUserData } from '../../../store/auth/login/LoginSlice';
import { getAllFeatures, saveEmployeeFeatures } from '../../../store/admin/AdminSlice';
import ImportEmployeesCsv from './ImportEmployeesCsv';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const AddEmployees = () => {
    const user = JSON.parse(localStorage.getItem('Exergy HRMData'))
    const id = user.firmId
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [showEmployees, setShowEmployees] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [openImportModal, setOpenImportModal] = useState(false)
    const [data, setData] = useState([])

    // const { user } = useSelector((state) => state.loginReducer);

    const handleCardClick = (type) => {
        navigate(`/admin/add-employee-wizard/${id}`, { state: { type: type } });
    }
    const [alert, setAlert] = React.useState({
        open: false,
        severity: '',
        message: ''
    });

    const handleSave = (features) => {
        const featureIds = features.map(item => item.id).join(',')
        const formData = new FormData();
        formData.append('companyId', user.companyId);
        formData.append('employeeId', user.employeeId);
        formData.append('featureIds', featureIds);

        dispatch(saveEmployeeFeatures(formData)).then(() => {
            console.log('saved features')
        });
    };

    const handleBack = (action) => {
        if (showEmployees) {
            setShowEmployees(false)
            return
        }
        navigate(-1)
    }
    const handleOpenModal = () => setOpenImportModal(true);
    const handleCloseModal = () => setOpenImportModal(false);
    useEffect(() => {
        const formData = new FormData()
        formData.append('companyId', id)
        dispatch(getAllEmployeesData(formData))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    setData(result.payload.DATA)
                }
                else {
                }
            })
            .catch((err) => {
                console.log(err)
            });

    }, [])

    const handleFinishAddingEmployees = () => {
        dispatch(getAllFeatures())
            .then((result) => {
                handleSave(result.payload.DATA)
                const updatedUserData = {
                    ...user,
                    isCompanyProfileCompleted: 1,
                    userFeatures: result.payload.DATA
                }
                dispatch(updateUserData(updatedUserData))
                localStorage.setItem("Exergy HRMData", JSON.stringify({ ...updatedUserData, isCompanyProfileCompleted: 1 }));
            })
        dispatch(MarkCompanyProfileCompleted())
            .then((result) => {
                console.log(result, "result")
                if (result.payload.SUCCESS === 1) {

                    setAlert({
                        open: true,
                        severity: 'success',
                        message: 'All employees have been added.'
                    })
                    setTimeout(() => {
                        navigate('/dashboards/modern')
                    }, [1000])

                }
                else {
                }
            })
            .catch((err) => {
                console.log(err)
            });
    }

    return (
        <>
            <ImportEmployeesCsv
                open={openImportModal}
                onClose={handleCloseModal}
            />
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
            <Box sx={{ pt: 5 }}>
                <Card elevation={9} sx={{ p: 2, minHeight: '500px' }}>
                    <AnimatePresence mode='wait'>
                        {!showEmployees && <motion.div key={'addEmployees'} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <CardContent sx={{ height: '460px' }}>
                                <Typography color='primary' variant='h5' mb={5} textAlign="center">Add Employee</Typography>         
                                {<Stack direction="row" spacing={5} mt={5} justifyContent="center" alignItems="center">
                                    <AddEmployeeCard onClick={handleOpenModal} title="Import Employees from CSV" icon={<UploadFileIcon color='primary' />} />
                                    <AddEmployeeCard onClick={() => setShowEmployees(true)} title="View All Added Employees" icon={<PersonIcon color='primary' />} sx={{ opacity: data.length !== 0 ? '.5' : '' }} />
                                </Stack>}
                            </CardContent>
                        </motion.div>}
                        {showEmployees && <motion.div key={'showEmployees'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '460px', padding: '24px' }}>
                            <AllAddedEmployees
                                rowsToRender={data}
                                AddBtn={() => <Button variant='contained' onClick={() => setOpenModal(true)} sx={{ display: 'flex', justifyContent: 'center', mt: 2, px: '.4rem', minWidth: 'auto', fontSize: '1rem' }}>
                                    <AddIcon fontSize='inherit' className='text-white' />
                                </Button>}
                            />
                        </motion.div>}
                    </AnimatePresence>
                    <CardActions >
                        <Button
                            variant='outlined'
                            onClick={handleBack}
                            sx={{ color: 'primary.main !important', bgcolor: '#fff !important' }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {(!showEmployees || data.length === 0) && <Button variant='contained' endIcon={<TaskAltIcon />} onClick={handleFinishAddingEmployees}>
                            Finish
                        </Button>}
                    </CardActions>
                </Card>
                {openModal && <AddEmployeeActionModal setOpenModal={setOpenModal} handleCardClick={handleCardClick} handleOpenModal={handleOpenModal} />}
            </Box >
        </>
    )
}

//this modal basically shows the same add employee buttons again.
export function AddEmployeeActionModal({ handleCardClick, setOpenModal, handleOpenModal }) {
    return (
        <Dialog
            open
            onClose={() => setOpenModal(false)}
            fullWidth
            maxWidth={'md'}
        >
            <DialogTitle id="alert-dialog-title" variant="h5" sx={{ color: 'primary.main', ml: 4 }}>
                {'Add Employee'}
            </DialogTitle>
            <DialogContent>
                <Stack direction="row" spacing={5} py={5} justifyContent="center" alignItems="center">
                <AddEmployeeCard onClick={handleOpenModal} title="Import Employees from CSV" icon={<UploadFileIcon color='primary' />} />
                <Typography color='primary' variant='h6'>OR</Typography>
                    <AddEmployeeCard onClick={() => handleCardClick(2)} title="Create New Employee" icon={<PersonAddIcon color='primary' />} />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'start', pl: '40px' }} className='flex items-center my-5 justify-start'>
                <Button onClick={() => setOpenModal(false)} variant="outlined" sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}


export default AddEmployees