import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Divider } from '@mui/material';

const ChildCard = ({ title, children }) => (
  <Card sx={{ padding: 0 }} variant="outlined">
    {title ? (
      <>
        <CardHeader title={title} />
        <Divider />{' '}
      </>
    ) : (
      ''
    )}

    <CardContent>{children}</CardContent>
  </Card>
);

ChildCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
};

export default ChildCard;
