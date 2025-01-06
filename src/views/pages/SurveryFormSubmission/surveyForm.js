import React, { useEffect, useState } from 'react';
import {
  Paper,
  Stack,
  Typography,
  IconButton,
  Grid,
  Radio,
  Collapse,
  TextField,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  FormControlLabel,
  Avatar,
  Autocomplete,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SurveyData } from './SurveyData';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FaEnvelope, FaPhoneAlt, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getSurveyTechDetails } from '../../../store/attendance/AttendanceSlice';
import CircularProgress from '@mui/material/CircularProgress';

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

const SurvreyForm = () => {
  const [loading, setLoading] = React.useState(false);
  const [backendData, setBackendData] = useState({});
  const [expandedStates, setExpandedStates] = useState([]);
  const [formData, setFormData] = useState({});
  const [projectList, setProjectList] = useState([]);
  const [validationError, setValidationError] = useState(null);
  const [projectFormData, setProjectFormData] = useState({
    projectName: '',
    projectContribution: '',
    selectedTechnologies: [],
    startDate: dayjs(),
    endDate: dayjs(),
    currentlyWorking: false,
    exergyProject: false,
  });
  const [allTechnologies, setAllTechnologies] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const user = JSON.parse(localStorage.getItem('Exergy HRMData'));
  const [facebookURL, setFacebookURL] = useState();
  const [linkedinURL, setlinkedinURL] = useState();
  const [alert, setAlert] = React.useState({
    open: false,
    severity: '',
    message: '',
  });
  const dispatch = useDispatch();

  useEffect(() => {
    let formData = new FormData();
    formData.append('companyId', 52);
    dispatch(getSurveyTechDetails(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: result.payload.USER_MESSAGE,
          });
          setBackendData(result.payload.Data);
          setExpandedStates(new Array(SurveyData.length).fill(true));
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload,
          });
        }
      })
      .catch((err) => {
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Something went wrong.',
        });
      });
  }, []);

  useEffect(() => {
    const fetchSurveyStatus = async () => {
      try {
        const response = await axios({
          method: 'GET',
          url: `${BASE_URL}${SUB_API_NAME}/SurveyV2Data/surveyV2Status`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
          },
          params: {
            employee_id: user.employeeId,
            company_id: 52,
          },
        });
        if (response.data.SurveyStatus === 1) {
          //toast.success('Survey has already been submitted!');
          setSubmitted(true);
        } else {
          setSubmitted(false);
        }
      } catch (err) {
        console.error('Error fetching survey status:', err);
      }
    };
    fetchSurveyStatus();
  }, [submitted, loading]);

  const [experience, setExperience] = useState({
    totalExperience: 0,
    currentExperience: 0,
  });

  const userDetails = JSON.parse(localStorage.getItem('Exergy HRMData'));

  const handleClick = (index) => {
    const newStates = [...expandedStates];
    newStates[index] = !newStates[index];
    setExpandedStates(newStates);
  };

  useEffect(() => {
    setBackendData(SurveyData);
    setAllTechnologies(SurveyData.flatMap((area) => area.technologies));
    setExpandedStates(new Array(SurveyData.length).fill(true));
  }, []);

  const handleRadioChange = (event, tech) => {
    setFormData({
      ...formData,
      [tech.tech]: {
        ...formData[tech.tech],
        techId: tech.id,
        level: event.target.value,
        selectedOption: 1,
      },
    });
  };

  const levelDurations = {
    Expert: 4,
    Advance: 3,
    Intermediate: 2,
    Beginner: 1,
  };

  const calculateEndDate = (startDate, level) => {
    const levelName = level.split(',')[0].trim();

    if (!levelDurations.hasOwnProperty(levelName)) {
      throw new Error('Invalid level');
    }

    const durationInYears = levelDurations[levelName];
    const startDateDayjs = dayjs(startDate);

    if (!startDateDayjs.isValid()) {
      throw new Error('Invalid start date format');
    }

    const endDate = startDateDayjs.add(durationInYears, 'year').format('YYYY-MM-DD');

    if (dayjs(endDate).isAfter(dayjs())) {
      toast.error('You cannot have experience in the future, kindly select an appropriate date');
    }

    if (!dayjs(endDate).isValid()) {
      throw new Error('Invalid end date calculated');
    }

    return endDate;
  };

  const handleDateChange = (newValue, tech, dateType) => {
    const currentDate = dayjs();
    const startDate = formData[tech.tech]?.startDate;

    if (!dayjs(newValue).isValid()) {
      toast.error('Invalid date format');
      return;
    }

    const formattedDate = dayjs(newValue).format('YYYY-MM-DD');

    if (dateType === 'endDate') {
      if (dayjs(formattedDate).isBefore(startDate)) {
        toast.error('End date cannot be before start date.');
        return;
      }

      if (dayjs(formattedDate).isAfter(currentDate)) {
        toast.error('End date cannot be after the current date.');
        return;
      }
    }

    setFormData((prevState) => {
      const updatedFormData = {
        ...prevState,
        [tech.tech]: {
          ...prevState[tech.tech],
          [dateType]: formattedDate,
        },
      };

      if (dateType === 'startDate') {
        const level = prevState[tech.tech]?.level;
        if (!level) {
          toast.error('Please select a level first');
          return updatedFormData;
        }

        try {
          const calculatedEndDate = calculateEndDate(formattedDate, level);
          updatedFormData[tech.tech].endDate = calculatedEndDate;

        } catch (error) {
          toast.error('Error calculating end date: ' + error.message);
        }
      }
      return updatedFormData;
    });
  };
  const handleProjectChange = (field) => (event) => {
    setProjectFormData({
      ...projectFormData,
      [field]: event.target.value,
    });
  };

  const handleAddProject = () => {
    if (!projectFormData.projectName || projectFormData.selectedTechnologies.length === 0) {
      setValidationError('Project Name and Technologies are required');
      toast.error('Project Name and Technologies are required.');
      return;
    }

    setProjectList([...projectList, projectFormData]);

    setProjectFormData({
      projectName: '',
      selectedTechnologies: [],
      startDate: dayjs(),
      endDate: dayjs(),
      currentlyWorking: false,
      exergyProject: false,
      projectContribution: '',
    });
    setValidationError(null);
  };

  const validateForm = () => {
    // Validate experience fields
    const uniqueTechnologies = [...new Set(allTechnologies)];
    if (!experience.currentExperience || !experience.totalExperience) {
      setValidationError('Please fill the experience field.');
      toast.error('Please fill the expereience field.');
      return false;
    }
    if (uniqueTechnologies.length !== Object.keys(formData).length + 3) {
      const filledData = Object.values(formData).map((item) => item.techId);
      const filteredData = allTechnologies.filter((data) =>
        filledData.find((fil) => data.id !== fil),
      );
      setValidationError(`Please fill the ${filteredData[0].tech}.`);
      toast.error(`Please fill the ${filteredData[0].tech}.`);
      return false;
    }

    return true;
  };

  const deleteProject = (index) => {
    const projects = projectList.filter((data, idx) => index !== idx);
    setProjectList(projects);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const dataObj = {
      employeeId: userDetails.employeeId,
      companyId: 52,
      facebookUrl: facebookURL,
      linkedinUrl: linkedinURL,
      totalExperience: parseFloat(experience.totalExperience),
      experienceInExergy: parseFloat(experience.currentExperience),
      projectNames: projectList.map((pn) => pn.projectName),
      startDates: projectList.map((pSd) => dayjs(pSd.startDate).format('YYYY-MM-DD')),
      endDates: projectList.map((pEd) => dayjs(pEd.endDate).format('YYYY-MM-DD')),
      iscurrentlyWorking: projectList.map((pl) => (pl.currentlyWorking === true ? 1 : 0)),
      projectContributionList: projectList.map((pc) => pc.projectContribution),
      projectTypesList: projectList.map((proj) =>
        proj.exergyProject === true ? 'Exergy' : 'Other',
      ),

      technologyIdsList: projectList.map((proj) =>
        proj.selectedTechnologies.map((sT) => sT.id).join(', '),
      ),
      experienceInTechnologies: Object.values(formData).map((item) => ({
        experienceId: SurveyData[0].experiences
          .find((exp) => exp.experience === item.level)
          .id.toString(),
        technologyId: item.techId.toString(),
        startDate: dayjs(item.startDate).format('YYYY/MM/DD'),
        endDate: dayjs(item.endDate).format('YYYY/MM/DD'),
      })),
    };
    setValidationError(null);
    console.log(dataObj);

    try {
      const response = await axios({
        method: 'POST',
        url: `${BASE_URL}${SUB_API_NAME}/Survey/saveSurveyV2`,
        data: dataObj,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
        },
      });
      toast.success('Survey submitted successfully!');
      setLoading(false);
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
      console.log(err);
      toast.error('Submission failed. Please try again.');
    }
  };

  return (
    <div>
      <ToastContainer />
      {loading ? (
        <div className="w-[100%] flex flex-col h-[80vh] items-center gap-4 justify-center">
          <CircularProgress className="text-[#3f50b5]" size={100} thickness={5} />
          <Typography variant="h4" className="text-black font-bold">
            Survey is being submitted..kindly wait a while
          </Typography>
        </div>
      ) : (
        <>
          {/* Additional Form Fields */}
          <Paper
            style={{
              width: '100%',
              paddingBottom: '20px',
              marginTop: '20px',
              border: '1px solid #ddd',
              padding: '16px',
            }}
          >
            <Typography color="primary" variant="h5" sx={{ pb: 3 }}>
              Personal Information
            </Typography>

            <Grid container spacing={2} sx={{ pl: 3 }}>
              <Stack direction={'row'} gap={4} alignItems={'center'} width={'full'}>
                <div>
                  <Avatar
                    sx={{ width: 160, height: 160 }}
                    src={`http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${userDetails.profileFileName}`}
                  />
                </div>
                <div className="">
                  <Typography variant="h3" sx={{ whiteSpace: 'nowrap' }}>
                    {userDetails.firstName} {userDetails.lastName}
                  </Typography>
                  <Typography variant="h5" className="text-zinc-500 mt-3">
                    {userDetails.designation}
                  </Typography>

                  <div className="mt-3 text-zinc-500 flex flex-col gap-2">
                    <div className="bg-slate-100 p-2 flex flex-row items-center justify-start rounded-md gap-2">
                      <div className="rounded-sm bg-[#10b981] p-1">
                        <FaPhoneAlt size={8} className="text-white" />
                      </div>
                      <div className="flex flex-col items-start">
                        <Typography variant="body1" fontWeight={700}>
                          {userDetails.contactNo}
                        </Typography>
                      </div>
                    </div>
                    <div className="bg-slate-100 p-2 flex flex-row items-center justify-start rounded-md gap-2">
                      <div className="rounded-sm bg-[#10b981] p-1">
                        <FaEnvelope size={8} className="text-white" />
                      </div>
                      <div className="flex flex-col items-start">
                        <Typography variant="body1" fontWeight={700}>
                          {userDetails.email}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </Stack>
            </Grid>
          </Paper>
          {!submitted ? (
            <>
              <Paper
                style={{ width: '100%', paddingBottom: '20px', marginTop: '20px', padding: '20px' }}
              >
                <Typography color="primary" variant="h5" gutterBottom>
                  Social URL's
                </Typography>

                <Grid container spacing={2} sx={{ my: 1 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Facebook URL"
                      variant="outlined"
                      value={facebookURL}
                      onChange={(e) => setFacebookURL(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Linkedin URL"
                      variant="outlined"
                      value={linkedinURL}
                      onChange={(e) => setlinkedinURL(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper
                style={{ width: '100%', paddingBottom: '20px', marginTop: '20px', padding: '20px' }}
              >
                <Typography color="primary" variant="h5" gutterBottom>
                  Experience <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                </Typography>

                <Grid container spacing={2} sx={{ my: 1 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      type={'number'}
                      fullWidth
                      label="Total Experience"
                      variant="outlined"
                      inputProps={{ step: '0.1' }}
                      value={experience.totalExperience}
                      onChange={(e) =>
                        setExperience((prev) => ({ ...prev, totalExperience: e.target.value }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      type={'number'}
                      fullWidth
                      label="Experience in Exergy"
                      variant="outlined"
                      inputProps={{ step: '0.1' }}
                      value={experience.currentExperience}
                      onChange={(e) =>
                        setExperience((prev) => ({ ...prev, currentExperience: e.target.value }))
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Project Information Form */}
              <Paper
                style={{ width: '100%', paddingBottom: '20px', marginTop: '20px', padding: '20px' }}
              >
                <Typography color="primary" variant="h5" gutterBottom>
                  Project Information <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                </Typography>

                <Grid container spacing={2} style={{ marginBottom: 20 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Project Name"
                      variant="outlined"
                      value={projectFormData.projectName}
                      onChange={handleProjectChange('projectName')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      multiple
                      id="project-technologies-label"
                      value={projectFormData.selectedTechnologies}
                      options={allTechnologies}
                      getOptionLabel={(option) => option.tech}
                      filterSelectedOptions
                      onChange={(_, val) =>
                        setProjectFormData((prev) => ({ ...prev, selectedTechnologies: val }))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Project-Technologies"
                          placeholder="Select..."
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="DD-MM-YYYY"
                        label="Start Date"
                        value={projectFormData.startDate}
                        onChange={(newValue) =>
                          setProjectFormData((prev) => ({ ...prev, startDate: newValue }))
                        }
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        disabled={projectFormData.currentlyWorking}
                        format="DD-MM-YYYY"
                        label="End Date"
                        value={projectFormData.endDate}
                        onChange={(newValue) =>
                          setProjectFormData((prev) => ({ ...prev, endDate: newValue }))
                        }
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) =>
                            setProjectFormData((prev) => ({
                              ...prev,
                              currentlyWorking: e.target.checked,
                            }))
                          }
                        />
                      }
                      label="Currently working"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contribution to Project"
                      variant="outlined"
                      placeholder="Team Lead, Front-end Developer etc"
                      value={projectFormData.projectContribution}
                      onChange={handleProjectChange('projectContribution')}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) =>
                            setProjectFormData((prev) => ({
                              ...prev,
                              exergyProject: e.target.checked,
                            }))
                          }
                        />
                      }
                      label="Exergy Project"
                    />
                  </Grid>
                </Grid>

                <Button variant="contained" color="primary" onClick={handleAddProject}>
                  Add Project
                </Button>

                {/* Projects Table */}
                {projectList.length > 0 && (
                  <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Project Name</TableCell>
                          <TableCell>Technologies</TableCell>
                          <TableCell>Start Date</TableCell>
                          <TableCell>End Date</TableCell>
                          <TableCell>Currently Working</TableCell>
                          <TableCell>Contribution</TableCell>
                          <TableCell>Exergy Project</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {projectList.map((project, index) => (
                          <TableRow key={index}>
                            <TableCell>{project.projectName}</TableCell>
                            <TableCell>
                              {project.selectedTechnologies.map((data) => data.tech).join(', ')}
                            </TableCell>
                            <TableCell>{dayjs(project.startDate).format('DD/MM/YYYY')}</TableCell>
                            {project.currentlyWorking === true ? (
                              <TableCell>--</TableCell>
                            ) : (
                              <TableCell>{dayjs(project.endDate).format('DD/MM/YYYY')}</TableCell>
                            )}
                            <TableCell>
                              {project.currentlyWorking === true ? 'Yes' : 'No'}
                            </TableCell>
                            <TableCell>{project.projectContribution}</TableCell>
                            <TableCell>{project.exergyProject === true ? 'Yes' : 'No'}</TableCell>
                            <TableCell>
                              <IconButton onClick={() => deleteProject(index)}>
                                <FaTrash size={16} className="text-red-400" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>

              <Typography
                variant="h4"
                sx={{ marginTop: '12px' }}
                className="pt-2 px-1 mt-6 font-bold"
              >
                You are required to fill every technology in every section
              </Typography>

              {/* Dynamic Data Section  */}
              {SurveyData?.map((area, index) => (
                <Paper
                  key={index}
                  style={{
                    width: '100%',
                    paddingBottom: '20px',
                    marginTop: '20px',
                    border: '1px solid #ddd',
                  }}
                >
                  {/* Header */}
                  <Stack
                    pt={2}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    style={{
                      cursor: 'pointer',
                      paddingLeft: '20px',
                      paddingRight: '20px',
                      borderBottom: expandedStates[index] ? '1px solid #ddd' : 'none',
                    }}
                    onClick={() => handleClick(index)}
                  >
                    <Typography color="primary" variant="h4">
                      {area.name} <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </Typography>
                    <IconButton>
                      <ExpandMoreIcon />
                    </IconButton>
                  </Stack>

                  {/* Collapsible content */}
                  <Collapse in={expandedStates[index]} timeout="auto" unmountOnExit>
                    <div style={{ padding: '20px' }}>
                      <Grid container spacing={2}>
                        {/* Table Head */}
                        <Grid item xs={3}></Grid>
                        {area.experiences.map((exp, idx) => (
                          <Grid item xs={1} key={idx} style={{ textAlign: 'center' }}>
                            <Typography variant="body2" fontWeight="bold">
                              {exp.experience}
                            </Typography>
                          </Grid>
                        ))}

                        {/* Rows with Radio buttons and conditional dropdowns */}
                        {area.technologies.map((tech, idx) => (
                          <Grid
                            key={idx}
                            item
                            xs={12}
                            container
                            alignItems="center"
                            style={{
                              paddingTop: '0px',
                              backgroundColor: idx % 2 === 0 ? '#ececec' : '#fff',
                            }}
                          >
                            {/* Technology Label */}
                            <Grid item xs={3}>
                              <Typography>{tech.tech}</Typography>
                            </Grid>

                            {/* Radio buttons for experience level */}
                            {area.experiences.map((exp) => (
                              <Grid item xs={1} key={exp.id} style={{ textAlign: 'center' }}>
                                <Radio
                                  checked={formData[tech.tech]?.level === exp.experience}
                                  onChange={(e) => handleRadioChange(e, tech)}
                                  value={exp.experience}
                                  name={tech.tech}
                                  color="primary"
                                />
                              </Grid>
                            ))}

                            {formData[tech.tech]?.level &&
                              formData[tech.tech].level !== 'None, 0 years' && (
                                <Grid
                                  item
                                  xs={4}
                                  className="pr-2 pb-1"
                                  style={{ marginTop: '10px', paddingRight: '2px' }}
                                >
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Grid container spacing={2}>
                                      <Grid item xs={6}>
                                        <DatePicker
                                          format="DD-MM-YYYY"
                                          label="Start Date"
                                          value={formData[tech.tech]?.startDate || null}
                                          onChange={(newValue) =>
                                            handleDateChange(newValue, tech, 'startDate')
                                          }
                                          renderInput={(params) => (
                                            <TextField {...params} fullWidth />
                                          )}
                                        />
                                      </Grid>
                                      <Grid item xs={6}>
                                        <DatePicker
                                          format="DD-MM-YYYY"
                                          label="End Date"
                                          value={formData[tech.tech]?.endDate || null}
                                          onChange={(newValue) =>
                                            handleDateChange(newValue, tech, 'endDate')
                                          }
                                          renderInput={(params) => (
                                            <TextField {...params} fullWidth />
                                          )}
                                        />
                                      </Grid>
                                    </Grid>
                                  </LocalizationProvider>
                                </Grid>
                              )}
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  </Collapse>
                </Paper>
              ))}

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{ marginTop: '20px', float: 'right' }}
              >
                Submit
              </Button>

              {validationError && (
                <Alert severity="error" style={{ marginTop: '20px' }}>
                  {validationError}
                </Alert>
              )}
            </>
          ) : (
            <div className="w-full flex flex-col items-center justify-center h-[400px] p-2">
              <Typography variant="h2" className="text-blue-500" fontWeight={800}>
                Survey has already been submitted
              </Typography>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SurvreyForm;

/*
{
  "employeeId": 1070,
  "companyId": 52,
  "totalExperience": 5.5,
  "experienceInExergy": 2.3,
  "projectNames": ["Project A", "Project B"],
  "startDates": ["2023-01-01", "2023-03-15"],
  "endDates": ["2023-12-31", "2024-06-30"],
  "iscurrentlyWorking": [0, 1],
  "technologyIdsList": ["1", "2"],
  "experienceInTechnologies": [
    {
      "experienceId": "1",
      "technologyId": "2",
      "startDate": "2024/04/25",
      "endDate": "2024/05/25"
    },
    {
      "experienceId": "2",
      "technologyId": "3",
      "startDate": "2023/04/25",
      "endDate": "2023/05/25"
    }
  ]
}

companyId
: 
52
employeeId
: 
1055
endDates
: 
Array(2)
0
: 
"2024-10-21"
1
: 
"2024-10-21"
length
: 
2
[[Prototype]]
: 
Array(0)
experienceInExergy
: 
2.8
experienceInTechnologies
: 
Array(2)
0
: 
{experienceId: 4, technologyId: 1, startDate: '2018/01/03', endDate: '2024/08/07'}
1
: 
{experienceId: 4, technologyId: 2, startDate: '2017/01/05', endDate: '2024/10/10'}
length
: 
2
[[Prototype]]
: 
Array(0)
iscurrentlyWorking
: 
Array(2)
0
: 
1
1
: 
1
length
: 
2
[[Prototype]]
: 
Array(0)
projectNames
: 
Array(2)
0
: 
"A"
1
: 
"B"
length
: 
2
[[Prototype]]
: 
Array(0)
socialPlatformUrl
: 
fbProfileUrl
: 
undefined
linkedinProfileUrl
: 
undefined
[[Prototype]]
: 
Object
startDates
: 
Array(2)
0
: 
"2024-10-21"
1
: 
"2024-10-21"
length
: 
2
[[Prototype]]
: 
Array(0)
technologyIdsList
: 
Array(2)
0
: 
"1"
1
: 
"1, 3"
length
: 
2
[[Prototype]]
: 
Array(0)
totalExperience
: 
2
[[Prototype]]
: 
Object



 const dataObj = {
      employeeId: userDetails.employeeId,
      technologyIds: Object.values(formData).map((item) => item.techId),
      experienceIds: Object.values(formData).map(
        (item) => SurveyData[0].experiences.find((exp) => exp.experience === item.level).id,
      ),
      technologiesUsedOnId: Object.values(formData).map((item) => item.selectedOption || 0),
      projectNames: projectList.map((pn) => pn.projectName),
      startDates: projectList.map((pSd) => dayjs(pSd.startDate).format('YYYY-MM-DD')),
      endDates: projectList.map((pEd) => dayjs(pEd.endDate).format('YYYY-MM-DD')),
      iscurrentlyWorking: projectList.map((pl) => (pl.currentlyWorking === true ? 1 : 0)),
      technologyIdsList: projectList.map((proj) =>
        proj.selectedTechnologies.map((sT) => sT.id).join(', '),
      ),
      totalExperience: parseInt(experience.totalExperience),
      experienceInExergy: parseInt(experience.currentExperience),
      socialPlatformUrl: {
        fbProfileUrl: facebookURL,
        linkedinProfileUrl: linkedinURL,
      },
    };

*/
