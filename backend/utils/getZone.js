const zone_mapping = {
    'North': [
        'Jammu and Kashmir', 'Ladakh', 'Himachal Pradesh', 'Punjab', 'Chandigarh',
        'Haryana', 'Uttarakhand', 'Delhi', 'Uttar Pradesh', 'Bihar'
    ],
    'South': [
        'Telangana', 'Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu',
        'Puducherry', 'Andaman and Nicobar Islands', 'Lakshadweep'
    ],
    'East': [
        'Jharkhand', 'Chhattisgarh', 'Odisha', 'West Bengal', 'Assam', 'Meghalaya',
        'Manipur', 'Tripura', 'Mizoram', 'Nagaland', 'Arunachal Pradesh', 'Sikkim'
    ],
    'West': [
        'Rajasthan', 'Madhya Pradesh', 'Gujarat', 'Maharashtra', 'Goa',
        'Dadra and Nagar Haveli and Daman and Diu'
    ]
};

function getZone(state) {
    for (const [zone, states] of Object.entries(zone_mapping)) {
        if (states.includes(state)) {
            return zone;
        }
    }
    return 'Unknown';
}

module.exports = getZone;