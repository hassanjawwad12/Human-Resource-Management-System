import * as React from 'react';
import {
    Box,
    Card,
    CardContent,
    Stepper,
    Step,
    StepLabel,
    Button,
} from '@mui/material';
import EmployeesList from './EmployeesList';
import ScanFingerSDK from './ScanFingerSDK';
import { useDispatch, useSelector } from 'react-redux';
import { enrollCompanyEmployee } from '../../../../store/hr/HRSlice';
import AlertMessage from '../../../../components/shared/AlertMessage';

const steps = ['Select Employee', 'Enroll Fingerprints'];

export default function EnrollEmployee() {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.loginReducer)

    const [activeStep, setActiveStep] = React.useState(0);
    const [selectedEnrollEmployee, setSelectedEnrollEmployee] = React.useState(null);
    const [fingerScans, setFingerScans] = React.useState({});
    const [alert, setAlert] = React.useState({ open: false, severity: '', message: '' });

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const isNextDisabled = () => {
        return !selectedEnrollEmployee;
    };

    const handleFingerComplete = (finger, scans) => {
        setFingerScans(prev => ({ ...prev, [finger]: scans }));

        const enrollmentData = {
            employeeId: selectedEnrollEmployee.id,
            companyId: user.firmId,
            fingerIndex: finger,
            samples: scans
        };

        dispatch(enrollCompanyEmployee(enrollmentData))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    // if (activeStep !== 0) {
                    //     setAlert({
                    //         open: true,
                    //         severity: 'success',
                    //         message: `Finger ${finger} enrolled successfully!`
                    //     });
                    // }
                } else {
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: `Failed to enroll finger ${finger}. Please try again.`
                    });
                }
            })
            .catch((error) => {
                console.error('Error enrolling finger:', error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'An error occurred while enrolling the finger.'
                });
            });
    };

    const handleEnrollmentComplete = () => {
        setAlert({
            open: true,
            severity: 'success',
            message: 'All selected fingers enrolled successfully!'
        });
        // Reset the form or navigate back to the employee list
        setTimeout(() => {
            setActiveStep(0);
            setSelectedEnrollEmployee(null);
            setFingerScans({});
        }, 1000)
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <EmployeesList
                        selectable={true}
                        onSelect={setSelectedEnrollEmployee}
                        singleSelect={true}
                        selectedEnrollEmployee={selectedEnrollEmployee}
                        hideEditOptions={true}
                        hideAddButton={true}
                        hideStatus={true}
                        hideBreadCrumb={true}
                        hideRatePerHour={true}
                        rowsNumber={5}
                    />
                );
            case 1:
                return (
                    <ScanFingerSDK
                        employee={selectedEnrollEmployee}
                        onFingerComplete={handleFingerComplete}
                        onEnrollmentComplete={handleEnrollmentComplete}
                    />
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Box sx={{ pt: 5 }}>
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
            <Card elevation={9} sx={{ p: 2, minHeight: '500px' }}>
                <CardContent>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <Box sx={{ mt: 2, minHeight: '400px' }}>
                        {getStepContent(activeStep)}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        {activeStep !== 0 && (
                            <Button
                                variant='outlined'
                                onClick={handleBack}
                                sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}
                            >
                                Back
                            </Button>
                        )}
                        <Box sx={{ flex: '1 1 auto' }} />
                        {activeStep === 0 && (
                            <Button
                                variant='contained'
                                sx={{ bgcolor: isNextDisabled() ? '#d8dbdd !important' : '' }}
                                onClick={handleNext}
                                disabled={isNextDisabled()}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}