const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.redirect('http://localhost:4000/admin/dist/1'));

router.get('/:distName', (req, res) => {
    const distName = req.params.distName;
    console.log(distName);
    const dists = ['1', '3'];
    const wards = {
        '1': ['Hoà Bình', 'Tân Phú'],
        '3': ['Ông Lãnh', 'Thanh Đa']
    };

    res.render('vwDepartment/manageWardDistrict.hbs', {
        title: 'Quản lý Quận/Phường',
        active: dists.indexOf(distName) + 1,
        currentDist: distName,
        dists: dists,
        wards: wards[distName]
    });
});

module.exports = router;
