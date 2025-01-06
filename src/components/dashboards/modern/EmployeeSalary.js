import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';

import DashboardWidgetCard from '../../shared/DashboardWidgetCard';

const EmployeeSalary = () => {
    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const success = theme.palette.success.main;
    const warning = theme.palette.warning.main;
    const error = theme.palette.error.main;

    // chart
    const optionscolumnchart = {
        series: [15000, 12000, 8000, 6000, 4000], // Costs for each department
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: ['Sales', 'Marketing', 'Development', 'HR', 'Design'],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
            colors: [primary, secondary, success, warning, error], // Optional: Custom colors
            title: {

                align: 'center'
            }
        },
    };

    return (
        <DashboardWidgetCard
            title="Department Costs"
            subtitle="Monthly data"
            dataLabel1="Total"
            dataItem1="$36,000"
            dataLabel2="Most Expensive"
            dataItem2="Sales"
        >
            <>
                <Chart options={optionscolumnchart.options} series={optionscolumnchart.series} type="pie" height="300px" />
            </>
        </DashboardWidgetCard>
    );
};

export default EmployeeSalary;
