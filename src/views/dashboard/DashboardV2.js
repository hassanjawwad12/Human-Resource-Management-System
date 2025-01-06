import { Box, Card, Grid, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

const dummyBarChartData = [
    {
        "expertiseArea": "Java and Related Technologies",
        "frameworks": [
            {
                "proficiencyDistribution": {
                    "Intermediate": {
                        "count": 1,
                        "employees": [
                            "Haris Akram"
                        ]
                    },
                    "Advance": {
                        "count": 1,
                        "employees": [
                            "Azan Qaiser"
                        ]
                    },
                    "Expert": {
                        "count": 2,
                        "employees": [
                            "Muhammad Umar Nadeem",
                            "Abubakar Ali"
                        ]
                    },
                    "None": {
                        "count": 1,
                        "employees": [
                            "Aqib Ali"
                        ]
                    }
                },
                "technology": "Java Enterprise, Spring Boot"
            },
            {
                "proficiencyDistribution": {
                    "Beginner": {
                        "count": 1,
                        "employees": [
                            "Azan Qaiser"
                        ]
                    },
                    "Intermediate": {
                        "count": 2,
                        "employees": [
                            "Muhammad Umar Nadeem",
                            "Abubakar Ali"
                        ]
                    },
                    "None": {
                        "count": 2,
                        "employees": [
                            "Haris Akram",
                            "Aqib Ali"
                        ]
                    }
                },
                "technology": "JVM"
            },
            {
                "proficiencyDistribution": {
                    "Intermediate": {
                        "count": 1,
                        "employees": [
                            "Haris Akram"
                        ]
                    },
                    "Expert": {
                        "count": 1,
                        "employees": [
                            "Hasseb Liaqat"
                        ]
                    },
                    "None": {
                        "count": 4,
                        "employees": [
                            "Muhammad Umar Nadeem",
                            "Abubakar Ali",
                            "Azan Qaiser",
                            "Aqib Ali"
                        ]
                    }
                },
                "technology": "Java (Mobile, Kotlin)"
            },
            {
                "proficiencyDistribution": {
                    "Beginner": {
                        "count": 1,
                        "employees": [
                            "Haris Akram"
                        ]
                    },
                    "Advance": {
                        "count": 1,
                        "employees": [
                            "Awais Ali"
                        ]
                    },
                    "None": {
                        "count": 4,
                        "employees": [
                            "Muhammad Umar Nadeem",
                            "Abubakar Ali",
                            "Azan Qaiser",
                            "Aqib Ali"
                        ]
                    }
                },
                "technology": "Java (Web), JSP"
            },
            {
                "proficiencyDistribution": {
                    "Beginner": {
                        "count": 2,
                        "employees": [
                            "Muhammad Umar Nadeem",
                            "Azan Qaiser"
                        ]
                    },
                    "Expert": {
                        "count": 3,
                        "employees": [
                            "Haris Akram",
                            "Abubakar Ali",
                            "Aqib Ali"
                        ]
                    }
                },
                "technology": "Spring Boot"
            }
        ]
    },
    {
        "expertiseArea": "Database Technologies",
        "frameworks": [
            {
                "proficiencyDistribution": {
                    "Advance": {
                        "count": 1,
                        "employees": [
                            "Awais Ali"
                        ]
                    }
                },
                "technology": "Firebase"
            },
            {
                "proficiencyDistribution": {
                    "Expert": {
                        "count": 1,
                        "employees": [
                            "Awais Ali"
                        ]
                    }
                },
                "technology": "PostgreSQL"
            },
            {
                "proficiencyDistribution": {
                    "Expert": {
                        "count": 1,
                        "employees": [
                            "Awais Ali"
                        ]
                    }
                },
                "technology": "MySQL"
            },
            {
                "proficiencyDistribution": {
                    "Intermediate": {
                        "count": 1,
                        "employees": [
                            "Awais Ali"
                        ]
                    }
                },
                "technology": "SQLite"
            },
            {
                "proficiencyDistribution": {
                    "None": {
                        "count": 1,
                        "employees": [
                            "Awais Ali"
                        ]
                    }
                },
                "technology": "Cassandra"
            },
            {
                "proficiencyDistribution": {
                    "Advance": {
                        "count": 1,
                        "employees": [
                            "Awais Ali"
                        ]
                    }
                },
                "technology": "Redis"
            },
            {
                "proficiencyDistribution": {
                    "Beginner": {
                        "count": 1,
                        "employees": [
                            "Awais Ali"
                        ]
                    }
                },
                "technology": "MongoDB"
            },
            {
                "proficiencyDistribution": {
                    "Expert": {
                        "count": 1,
                        "employees": [
                            "Awais Ali"
                        ]
                    }
                },
                "technology": "SQL Server"
            },
            {
                "proficiencyDistribution": {
                    "Advance": {
                        "count": 1,
                        "employees": [
                            "Awais Ali"
                        ]
                    }
                },
                "technology": "Oracle"
            }
        ]
    }
];

const dummyRadarChartData = [
    {
        "expertiseArea": "Java and Related Technologies",
        "frameworks": [
            {
                "proficiencyDistribution": {
                    "Intermediate": 1,
                    "Advance": 1,
                    "Expert": 2,
                    "None": 1
                },
                "technology": "Java Enterprise, Spring Boot"
            },
            {
                "proficiencyDistribution": {
                    "Beginner": 1,
                    "Intermediate": 2,
                    "None": 2
                },
                "technology": "JVM"
            },
            {
                "proficiencyDistribution": {
                    "Intermediate": 1,
                    "Expert": 1,
                    "None": 4
                },
                "technology": "Java (Mobile, Kotlin)"
            },
            {
                "proficiencyDistribution": {
                    "Beginner": 1,
                    "Advance": 1,
                    "None": 4
                },
                "technology": "Java (Web), JSP"
            },
            {
                "proficiencyDistribution": {
                    "Beginner": 2,
                    "Expert": 3
                },
                "technology": "Spring Boot"
            }
        ]
    },
    {
        "expertiseArea": "Database Technologies",
        "frameworks": [
            {
                "proficiencyDistribution": {
                    "Advance": 1
                },
                "technology": "Firebase"
            },
            {
                "proficiencyDistribution": {
                    "Expert": 1
                },
                "technology": "PostgreSQL"
            },
            {
                "proficiencyDistribution": {
                    "Expert": 1
                },
                "technology": "MySQL"
            },
            {
                "proficiencyDistribution": {
                    "Intermediate": 1
                },
                "technology": "SQLite"
            },
            {
                "proficiencyDistribution": {
                    "None": 1
                },
                "technology": "Cassandra"
            },
            {
                "proficiencyDistribution": {
                    "Advance": 1
                },
                "technology": "Redis"
            },
            {
                "proficiencyDistribution": {
                    "Beginner": 1
                },
                "technology": "MongoDB"
            },
            {
                "proficiencyDistribution": {
                    "Expert": 1
                },
                "technology": "SQL Server"
            },
            {
                "proficiencyDistribution": {
                    "Advance": 1
                },
                "technology": "Oracle"
            }
        ]
    }
];

const DashboardV2 = () => {
    const [barChartData, setBarChartData] = useState(dummyBarChartData);
    const [radarChartData, setRadarChartData] = useState(dummyRadarChartData);

    const radarSeriesData = radarChartData.map((data, i) => {
        return {
            expertiseArea: data.expertiseArea,
            frameworks: data.frameworks.map((f_data, idx) => {

                const sumProficiencyLevels = (proficiencyDistribution) => {
                    return Object.entries(proficiencyDistribution)
                        .filter(([key]) => key !== 'None') // Exclude 'None'
                        .reduce((total, [, value]) => total + value, 0); // Sum the remaining values
                };

                return {
                    proficiency: sumProficiencyLevels(f_data.proficiencyDistribution),
                    technology: f_data.technology
                }
            })
        }
    });

    console.log(radarSeriesData, "radarSeriesData")

    const getTechData = async () => {
        const url = `${BASE_URL}${SUB_API_NAME}`;

        const response = await axios.get(`${url}/SurveyV2Data/technologyExperienceDistribution`, {
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem("Exergy HRMToken")}`
            }
        });

        console.log(response, "responseTech")
        setBarChartData(response.data.DATA);
    }

    const getSkillsData = async () => {
        const url = `${BASE_URL}${SUB_API_NAME}`;

        const response = await axios.get(`${url}/SurveyV2Data/technologyAndExperienceCount`, {
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem("Exergy HRMToken")}`
            }
        });

        console.log(response, "responseSkills")
        setRadarChartData(response.data.DATA);
    }

    useEffect(() => {
        getTechData();
        getSkillsData();
    }, []);

    const getBarChartSeries = (b_Data) => {
        const proficiencyLevels = ['None', 'Beginner', 'Junior', 'Intermediate', 'Advanced', 'Expert'];

        // Generate series data for each proficiency level
        const chartSeries = proficiencyLevels.map((level) => {
            return {
                name: level,
                data: b_Data.frameworks.map(f => f.proficiencyDistribution[level]?.count || 0)
            };
        });

        return chartSeries;
    };

    const getRadarChartSeries = (b_idx) => {
        // Create data for radar chart
        const chartSeries = [
            {
                name: 'Proficiency',
                data: radarSeriesData[b_idx].frameworks.map(f => f.proficiency)
            }
        ];

        console.log(chartSeries, "radarchartSeries");

        return chartSeries;
    };

    return (
        <div>
            <Box py={3}>
                <Typography variant='h2'>Company Dashboard</Typography>
            </Box>

            {barChartData.map((b_Data, b_idx) =>
                <>
                    <Typography variant='h4' sx={{ my: 2 }}>{b_Data.expertiseArea}</Typography>
                    <Grid container spacing={3} key={b_idx}>
                        <Grid item xs={7}>
                            <Card>
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'bar',
                                            height: 350,
                                            stacked: false,
                                            toolbar: {
                                                show: false // Hides the toolbar to keep it clean
                                            }
                                        },
                                        colors: ['#a8a8a8', '#3f50b5', '#90EE90', '#FFD700', '#ff5b5b', '#007bff'], // Light pastel colors
                                        plotOptions: {
                                            bar: {
                                                horizontal: false,
                                                columnWidth: '12px',
                                                borderRadius: 5, // Rounded corners
                                                colors: {
                                                    backgroundBarColors: ['#f3f3f3'], // Background bar color
                                                    backgroundBarOpacity: 0.2 // Light opacity for background bars
                                                }
                                            }
                                        },
                                        dataLabels: {
                                            enabled: false // Hide data labels for a cleaner look
                                        },
                                        stroke: {
                                            show: true,
                                            width: 2,
                                            colors: ['transparent'] // Make the stroke between bars transparent for a smoother look
                                        },
                                        grid: {
                                            borderColor: '#e7e7e7', // Subtle grid lines
                                            row: {
                                                colors: ['#f5f5f5', 'transparent'], // Alternate row colors for visual separation
                                                opacity: 0.5
                                            }
                                        },
                                        xaxis: {
                                            categories: b_Data.frameworks.map(f => f.technology),
                                            labels: {
                                                style: {
                                                    colors: '#666', // Soft gray color for labels
                                                    fontSize: '8px',
                                                    fontFamily: 'Arial, sans-serif'
                                                }
                                            }
                                        },
                                        yaxis: {
                                            min: 0, // Minimum value on y-axis
                                            max: 15, // Maximum value on y-axis
                                            tickAmount: 3, // Number of intervals between ticks (this will show 0, 5, 10, 15, 20, 25)
                                            labels: {
                                                formatter: function (value) {
                                                    return value; // Show the values as they are (0, 5, 10, 15, 20, 25)
                                                },
                                                style: {
                                                    colors: '#666',
                                                    fontSize: '14px',
                                                    fontFamily: 'Arial, sans-serif'
                                                }
                                            }
                                        },
                                       
                                        tooltip: {
                                            theme: 'light', // Light theme for tooltips
                                            custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                                                const frameworkName = w.globals.labels[dataPointIndex];
                                                const proficiencyLevel = w.config.series[seriesIndex].name;
                                                const employees = b_Data.frameworks[dataPointIndex].proficiencyDistribution[proficiencyLevel].employees;

                                                return `<div style="font-size: 12px;">
                                    <div style="color: #fff; background-color: #00BEFF; padding: 4px 8px">
                          Tech: <strong>${frameworkName}</strong><br/>
                          Level: <strong>${proficiencyLevel}</strong><br/>
                          </div>
                          <div style="background-color: #fff; padding: 8px;">
                            <span style="font-weight: 600;">${employees.join(',<br/>')}</span>
                          </div>
                        </div>`;
                                            }
                                        },
                                        legend: {
                                            position: 'right',
                                            offsetY: 0
                                        },
                                        fill: {
                                            opacity: 1
                                        }
                                    }}
                                    series={getBarChartSeries(b_Data)}
                                    type="bar"
                                    height={430}
                                />
                            </Card>
                        </Grid>

                        <Grid item xs={5}>
                            <Card>
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'radar'
                                        },
                                        xaxis: {
                                            categories: radarSeriesData[b_idx].frameworks.map(f => f.technology),
                                            labels: {
                                                style: {
                                                    colors: '#666', // Soft gray color for labels
                                                    fontSize: '8px',
                                                    fontFamily: 'Arial, sans-serif'
                                                }
                                            }
                                        },
                                        fill: {
                                            opacity: 0.2
                                        },
                                        stroke: {
                                            show: true,
                                            width: 2,
                                            colors: ['#00BFFF']
                                        },
                                        markers: {
                                            size: 4
                                        }
                                    }}
                                    series={getRadarChartSeries(b_idx)}
                                    type="radar"
                                    height={430}
                                    width={430}
                                />
                            </Card>
                        </Grid>
                    </Grid>
                </>
            )}
        </div>
    );
};

export default DashboardV2;
