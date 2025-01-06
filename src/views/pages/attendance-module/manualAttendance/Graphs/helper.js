export const getBackgroundColor = (index) => {
  const colors = [
    '#f4978e',
    '#fbc4ab',
    '#f6bc66',
    '#a7bed3',
    '#dab894',
    '#caffbf',
    '#cdb4db',
    '#efcfe3',
    '#e69597',
    '#ffb3c6',
    '#52b2cf',
  ];
  return colors[index % colors.length];
};

export const formatDate = (dateStr) => {
  const monthMap = {
    January: 'Jan',
    February: 'Feb',
    March: 'Mar',
    April: 'Apr',
    May: 'May',
    June: 'Jun',
    July: 'Jul',
    August: 'Aug',
    September: 'Sep',
    October: 'Oct',
    November: 'Nov',
    December: 'Dec',
  };

  const [day, month, year] = dateStr.split(' ');

  const shortMonth = monthMap[month];

  return `${day} ${shortMonth} ${year}`;
};
