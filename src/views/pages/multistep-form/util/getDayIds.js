const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const dayIds = daysOfWeek.map((day, index) => {
    return { id: index + 1, name: day };
});

export default function getDayIds(dayNames) {
    return dayNames.map(dayName => {
        const day = dayIds.find(d => d.name === dayName);
        return day ? day.id : null;
    });
}