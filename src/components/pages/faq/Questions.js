import React from 'react';
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Divider, Box } from '@mui/material';
import { IconChevronDown } from '@tabler/icons';

const Questions = () => {
  return (
    <Box>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} lg={8}>
          <Typography variant="h3" textAlign="center" mb={1}>Frequently asked questions</Typography>
          <Typography variant="h6" fontWeight={400} color="textSecondary" textAlign="center" mb={4}>Get to know more about ready-to-use admin dashboard templates</Typography>
          <Accordion elevation={9}>
            <AccordionSummary
              expandIcon={<IconChevronDown />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6" px={2} py={1}>What is an Admin Dashboard?</Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography variant="subtitle1" pt={1} px={2} color="textSecondary">
                Admin Dashboard is the backend interface of a website or an application that helps
                to manage the website's overall content and settings. It is widely used by the site
                owners to keep track of their website, make changes to their content, and more.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={9}>
            <AccordionSummary
              expandIcon={<IconChevronDown />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="h6" px={2} py={1}>What should an admin dashboard template include?</Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography variant="subtitle1" pt={1} px={2} color="textSecondary">
                Admin dashboard template should include user & SEO friendly design with a variety of
                components and application designs to help create your own web application with
                ease. This could include customization options, technical support and about 6 months
                of future updates.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={9}>
            <AccordionSummary
              expandIcon={<IconChevronDown />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography variant="h6" px={2} py={1}>Why should I buy admin templates from AdminMart?</Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography variant="subtitle1" pt={1} px={2} color="textSecondary">
                Adminmart offers high-quality templates that are easy to use and fully customizable.
                With over 101,801 happy customers & trusted by 10,000+ Companies. AdminMart is
                recognized as the leading online source for buying admin templates.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={9}>
            <AccordionSummary
              expandIcon={<IconChevronDown />}
              aria-controls="panel4a-content"
              id="panel4a-header"
            >
              <Typography variant="h6" px={2} py={1}>Do Adminmart offers a money back guarantee?</Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography variant="subtitle1" pt={1} px={2} color="textSecondary">
                There is no money back guarantee in most companies, but if you are unhappy with our
                product, Adminmart gives you a 100% money back guarantee.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Questions;
