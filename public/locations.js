const locations = [
    {
        title: "Chợ Bến Thành",
        lat: "10.772369",
        lng: "106.698731"
    },
    {
        title: "Bảo tàng Chứng tích Chiến tranh",
        lat: "10.779381",
        lng: "106.692785"
    },
    {
        title: "Nhà thờ Đức Bà Sài Gòn",
        lat: "10.779589",
        lng: "106.698890"
    },
    {
        title: "Bưu điện Trung tâm Sài Gòn",
        lat: "10.779572",
        lng: "106.699755"
    },
    {
        title: "Tháp Tài chính Bitexco",
        lat: "10.771958",
        lng: "106.705770"
    },
    {
        title: "Dinh Thống Nhất",
        lat: "10.776507",
        lng: "106.694302"
    },
    {
        title: "Chùa Ngọc Hoàng",
        lat: "10.791947",
        lng: "106.698177"
    },
    {
        title: "Nhà hát Thành phố Sài Gòn",
        lat: "10.776386",
        lng: "106.702956"
    },
    {
        title: "Phố đi bộ Nguyễn Huệ",
        lat: "10.773990",
        lng: "106.703572"
    },
    {
        title: "Quảng trường Notre-Dame Sài Gòn",
        lat: "10.779137",
        lng: "106.699715"
    },
    {
        title: "Trung tâm Vincom",
        lat: "10.778401",
        lng: "106.702021"
    },
    {
        title: "Công viên 23/9",
        lat: "10.768634",
        lng: "106.692373"
    },
    {
        title: "Nhà hát Rồng Vàng",
        lat: "10.776398",
        lng: "106.692531"
    },
    {
        title: "Phố đi bộ Bùi Viện",
        lat: "10.767380",
        lng: "106.693987"
    },
    {
        title: "Uỷ ban Nhân dân Thành phố Hồ Chí Minh",
        lat: "10.776534",
        lng: "106.701126"
    },
    {
        title: "Khu vui chơi trẻ em Tao Đàn",
        lat: "10.774498",
        lng: "106.691076"
    },
    {
        title: "Bảo tàng Mỹ thuật Sài Gòn",
        lat: "10.770005",
        lng: "106.699415"
    },
    {
        title: "Công viên Lê Văn Tám",
        lat: "10.779825",
        lng: "106.694030"
    },
    {
        title: "Công viên Tao Đàn",
        lat: "10.774669",
        lng: "106.692470"
    },
    {
        title: "Tầng nhìn Saigon Skydeck",
        lat: "10.771413",
        lng: "106.704088"
    },
    {
        title: "SG Waterbus",
        lat: "10.775364",
        lng: "106.707018"
    },
    {
        title: "Chùa Thiên Hậu",
        lat: "10.755006",
        lng: "106.722202"
    },
    {
        title: "Ga Bạch Đằng",
        lat: "10.775214",
        lng: "106.707166"
    },
    {
        title: "Trung tâm Thương mại Saigon Tax",
        lat: "10.784278",
        lng: "106.703463"
    },
    {
        title: "Chùa Vĩnh Nghiêm",
        lat: "10.790801",
        lng: "106.682615"
    },
    {
        title: "Quảng trường Nguyễn Huệ",
        lat: "10.774395",
        lng: "106.703240"
    },
    {
        title: "Nhà thờ Tân Định",
        lat: "10.788690",
        lng: "106.690813"
    },
    {
        title: "Trường Đại học Mỹ thuật",
        lat: "10.802448641853811",
        lng: "106.69541845022655"
    },
    {
        title: "Công viên Lê Văn Tám",
        lat: "10.78805172495685",
        lng: "106.69363926666249"
    },
    {
        title: "Bảo tàng FITO (Bảo tàng Y học dân dụ)",
        lat: "10.77613835428472",
        lng: "106.67186772114394"
    },
    {
        title: "Trung tâm thương mại Saigon Paragon",
        lat: "10.729504090270787",
        lng: "106.72184634560051"
    },
    {
        title: "Trung tâm Hội chợ và Triển lãm Sài Gòn (SECC)",
        lat: "10.73058396137865",
        lng: "106.7213482670389"
    },
    {
        title: "Cầu Ánh Sao",
        lat: "10.724607957943292",
        lng: "106.71883296171413"
    },
    {
        title: "Công viên Suối Tiên",
        lat: "10.866362788372973",
        lng: "106.80272315055139"
    },
    {
        title: "Saigon Pearl",
        lat: "10.789725576893828",
        lng: "106.71969741905127"
    },
    {
        title: "Trung tâm thương mại Crescent Mall",
        lat: "10.728543707718005",
        lng: "106.71868164519188"
    },
    {
        title: "Phố Ẩm Thực Hồ Thị Kỷ",
        lat: "10.7647102763405",
        lng: "106.67645356329592"
    },
    {
        title: "Công viên Nước Đầm Sen",
        lat: "10.766124277686338",
        lng: "106.64210693709923"
    },
    {
        title: "Khu phố Tàu",
        lat: "10.76780027595128",
        lng: "106.6687923297686"
    },
    {
        title: "Hồ Con Rùa",
        lat: "10.782729931487413",
        lng: "106.69571604065676"
    },
    {
        title: "Chùa Khánh Vân Nam Viện",
        lat: "10.75715285000945",
        lng: "106.65063223875914"
    },
    {
        title: "Quận 2 (Thảo Điền)",
        lat: "10.801317922551188",
        lng: "106.73303587922544"
    },
    {
        title: "Saigon Square",
        lat: "10.772839153585013",
        lng: "106.70016893373234"
    },
    {
        title: "Quân Khu 7",
        lat: "10.800116693833312",
        lng: "106.66727364643869"
    },
    {
        title: "Rach Mieu Sports Complex",
        lat: "10.796112816373666",
        lng: "106.68735258148781"
    },
    {
        title: "Trụ sở Ủy ban Nhân dân Thành phố Hồ Chí Minh",
        lat: "10.776533525292088",
        lng: "106.70098802874871"
    },
    {
        title: "Trung tâm thương mại Nowzone",
        lat: "10.763112",
        lng: "106.682772"
    },
    {
        title: "Thảo cầm viên Sài Gòn",
        lat: "10.786711539750995",
        lng: "106.70566020882148"
    },
    {
        title: "Cầu Thị Nghè",
        lat: "10.791393486890534",
        lng: "106.70580277746772"
    },
    {
        title: "Công viên Thanh Đa",
        lat: "10.816526933855236",
        lng: "106.72203640362132"
    }
];

export default locations