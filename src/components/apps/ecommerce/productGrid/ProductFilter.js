import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ListItemText,
  ListItemButton,
  List,
  Divider,
  FormGroup,
  ListItemIcon,
  FormControlLabel,
  Radio,
  Typography,
  Box,
  Avatar,
  Button,
  Stack
} from '@mui/material';
import {
  filterProducts,
  sortByProducts,
  sortByGender,
  sortByColor,
  sortByPrice,
  filterReset,
} from '../../../../store/apps/eCommerce/EcommerceSlice';
import { IconCheck } from '@tabler/icons';
import {
  IconHanger,
  IconCircles,
  IconNotebook,
  IconMoodSmile,
  IconDeviceLaptop,
  IconSortAscending2,
  IconSortDescending2,
  IconAd2,
} from '@tabler/icons';

const ProductFilter = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.ecommerceReducer.products);
  const active = useSelector((state) => state.ecommerceReducer.filters);
  const checkactive = useSelector((state) => state.ecommerceReducer.sortBy);
  const customizer = useSelector((state) => state.customizer);
  const br = `${customizer.borderRadius}px`;

  const getUniqueData = (data, attr) => {
    let newVal = data.map((curElem) => {
      return curElem[attr];
    });
    if (attr === 'colors') {
      newVal = newVal.flat();
    }

    return (newVal = ['All', ...Array.from(new Set(newVal))]);
  };

  const filterbyGender = getUniqueData(products, 'gender');
  const filterbyColors = getUniqueData(products, 'colors');

  const filterCategory = [
    {
      id: 1,
      filterbyTitle: 'Filter by Category',
    },
    {
      id: 2,
      name: 'All',
      sort: 'All',
      icon: IconCircles,
    },
    {
      id: 3,
      name: 'Fashion',
      sort: 'fashion',
      icon: IconHanger,
    },
    {
      id: 9,
      name: 'Books',
      sort: 'books',
      icon: IconNotebook,
    },
    {
      id: 10,
      name: 'Toys',
      sort: 'toys',
      icon: IconMoodSmile,
    },
    {
      id: 11,
      name: 'Electronics',
      sort: 'electronics',
      icon: IconDeviceLaptop,
    },
    {
      id: 6,
      devider: true,
    },
  ];
  const filterbySort = [
    { id: 1, value: 'newest', label: 'Newest', icon: IconAd2 },
    { id: 2, value: 'priceDesc', label: 'Price: High-Low', icon: IconSortAscending2 },
    { id: 3, value: 'priceAsc', label: 'Price: Low-High', icon: IconSortDescending2 },
    { id: 4, value: 'discount', label: 'Discounted', icon: IconAd2 },
  ];
  const filterbyPrice = [
    {
      id: 0,
      label: 'All',
      value: 'All',
    },
    {
      id: 1,
      label: '0-50',
      value: '0-50',
    },
    {
      id: 3,
      label: '50-100',
      value: '50-100',
    },
    {
      id: 4,
      label: '100-200',
      value: '100-200',
    },
    {
      id: 5,
      label: 'Over 200',
      value: '200-99999',
    },
  ];

  const handlerGenderFilter = (value) => {
    if (value.target.checked) {
      dispatch(sortByGender({ gender: value.target.value }));
    }
  };
  const handlerPriceFilter = (value) => {
    if (value.target.checked) {
      dispatch(sortByPrice({ price: value.target.value }));
    }
  };

  return (
    <>
      <List>
        {/* ------------------------------------------- */}
        {/* Category filter */}
        {/* ------------------------------------------- */}
        {filterCategory.map((filter) => {
          if (filter.filterbyTitle) {
            return (
              <Typography variant="subtitle2" fontWeight={600} px={3} mt={2} pb={2} key={filter.id}>
                {filter.filterbyTitle}
              </Typography>
            );
          } else if (filter.devider) {
            return <Divider key={filter.id} />;
          }

          return (
            <ListItemButton
              sx={{ mb: 1, mx: 3, borderRadius: br }}
              selected={active.category === `${filter.sort}`}
              onClick={() => dispatch(filterProducts({ category: `${filter.sort}` }))}
              key={filter.id}
            >
              <ListItemIcon sx={{ minWidth: '30px' }}>
                <filter.icon stroke="1.5" size="19" />
              </ListItemIcon>
              <ListItemText>{filter.name}</ListItemText>
            </ListItemButton>
          );
        })}
        {/* ------------------------------------------- */}
        {/* Sort by */}
        {/* ------------------------------------------- */}
        <Typography variant="subtitle2" fontWeight={600} px={3} mt={3} pb={2}>
          Sort By
        </Typography>
        {filterbySort.map((filter) => {
          return (
            <ListItemButton
              sx={{ mb: 1, mx: 3, borderRadius: br }}
              selected={checkactive === `${filter.value}`}
              onClick={() => dispatch(sortByProducts(`${filter.value}`))}
              key={filter.id + filter.label + filter.value}
            >
              <ListItemIcon sx={{ minWidth: '30px' }}>
                <filter.icon stroke="1.5" size={19} />
              </ListItemIcon>
              <ListItemText>{filter.label}</ListItemText>
            </ListItemButton>
          );
        })}
        <Divider></Divider>
        {/* ------------------------------------------- */}
        {/* Filter By Gender */}
        {/* ------------------------------------------- */}
        <Box p={3}>
          <Typography variant="subtitle2" fontWeight={600}>
            By Gender
          </Typography>
          <br />
          <FormGroup>
            {filterbyGender.map((gen) => (
              <FormControlLabel
                key={gen}
                control={
                  <Radio
                    value={gen}
                    checked={active.gender === gen}
                    onChange={handlerGenderFilter}
                  />
                }
                label={gen}
              />
            ))}
          </FormGroup>
        </Box>
        <Divider></Divider>
        {/* ------------------------------------------- */}
        {/* Filter By Pricing */}
        {/* ------------------------------------------- */}
        <Typography variant="h6" px={3} mt={3} pb={2}>
          By Pricing
        </Typography>
        <Box p={3} pt={0}>
          <FormGroup>
            {filterbyPrice.map((price) => (
              <FormControlLabel
                key={price.label}
                control={
                  <Radio
                    value={price.value}
                    checked={active.price === price.value}
                    onChange={handlerPriceFilter}
                  />
                }
                label={price.label}
              />
            ))}
          </FormGroup>
        </Box>
        <Divider></Divider>
        <Typography variant="h6" px={3} mt={3} pb={2}>
          By Colors
        </Typography>
        {/* ------------------------------------------- */}
        {/* Filter By colors */}
        {/* ------------------------------------------- */}
        <Box p={3} pt={0}>
          <Stack direction={'row'} flexWrap="wrap" gap={1}>
            {filterbyColors.map((curColor) => {
              if (curColor !== 'All') {
                return (
                  <Avatar
                    sx={{
                      backgroundColor: curColor,
                      width: 24,
                      height: 24,
                      cursor: 'pointer',
                    }}
                    aria-label={curColor}
                    key={curColor}
                    onClick={
                      active.color === curColor
                        ? () => dispatch(sortByColor({ color: 'All' }))
                        : () => dispatch(sortByColor({ color: curColor }))
                    }
                  >
                    {active.color === curColor ? <IconCheck size="13" /> : ''}
                  </Avatar>
                );
              } else {
                return <Box key={curColor} sx={{ display: 'none' }}></Box>;
              }
            })}
          </Stack>
        </Box>
        <Divider></Divider>
        {/* ------------------------------------------- */}
        {/* Reset */}
        {/* ------------------------------------------- */}
        <Box p={3}>
          <Button variant="contained" onClick={() => dispatch(filterReset())} fullWidth>
            Reset Filters
          </Button>
        </Box>
      </List>
    </>
  );
};

export default ProductFilter;
