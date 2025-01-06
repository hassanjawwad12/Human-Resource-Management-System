import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CardContent,
  Typography,
  Grid,
  Rating,
  Tooltip,
  Fab,
  Stack,
  Skeleton,
} from '@mui/material';
import img1 from 'src/assets/images/products/s4.jpg';
import img2 from 'src/assets/images/products/s5.jpg';
import img3 from 'src/assets/images/products/s7.jpg';
import img4 from 'src/assets/images/products/s11.jpg';
import BlankCard from '../../shared/BlankCard';
import { IconBasket } from '@tabler/icons';

const ecoCard = [
  {
    title: 'Boat Headphone',
    subheader: 'September 14, 2023',
    photo: img1,
    salesPrice: 375,
    price: 285,
    rating: 4,
  },
  {
    title: 'MacBook Air Pro',
    subheader: 'September 14, 2023',
    photo: img2,
    salesPrice: 650,
    price: 900,
    rating: 5,
  },
  {
    title: 'Red Valvet Dress',
    subheader: 'September 14, 2023',
    photo: img3,
    salesPrice: 150,
    price: 200,
    rating: 3,
  },
  {
    title: 'Cute Soft Teddybear',
    subheader: 'September 14, 2023',
    photo: img4,
    salesPrice: 285,
    price: 345,
    rating: 2,
  },
];

const EcommerceCard = () => {
  const [isLoading, setLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Grid container spacing={3}>
      {ecoCard.map((product, index) => (
        <Grid item xs={12} sm={4} lg={3} key={index}>
          <BlankCard>
            <Typography component={Link} to="/">
              {isLoading ? (
                <Skeleton variant="square" animation="wave" width="100%" height={270}></Skeleton>
              ) : (
                <img src={product.photo} alt="img" width="100%" />
              )}
            </Typography>
            <Tooltip title="Add To Cart">
              <Fab
                size="small"
                color="primary"
                sx={{ bottom: '75px', right: '15px', position: 'absolute' }}
              >
                <IconBasket size="16" />
              </Fab>
            </Tooltip>
            <CardContent sx={{ p: 3, pt: 2 }}>
              <Typography variant="h6">{product.title}</Typography>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
                <Stack direction="row" alignItems="center">
                  <Typography variant="h6">${product.price}</Typography>
                  <Typography color="textSecondary" ml={1} sx={{ textDecoration: 'line-through' }}>
                    ${product.salesPrice}
                  </Typography>
                </Stack>
                <Rating name="read-only" size="small" value={product.rating} readOnly />
              </Stack>
            </CardContent>
          </BlankCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default EcommerceCard;
