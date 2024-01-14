async function getAllAdsPoints() {
    try {
        let result = await axios.get(`http://localhost:4000/adsPoint/allPoints/api/v1`);
        let AdsPoints = result.data.adsPoints;

        let AdsBoards = [];

        AdsPoints.forEach((adsPoint) => {
            AdsBoards.push(...adsPoint.adsBoard);
        });

        const parser = new DOMParser();
        // Append AdsBoard
        let adboardContainer = document.getElementById('boards-container');
        let adBoardElements = [];
        let adPointElements = [];

        // Append AdsPoint
        for (let adPoint of AdsPoints) {
            let div = parser.parseFromString(
                `
            ${
                adPoint.planningStatus === 'Đã quy hoạch'
                    ? `<div class="adpointInfo adPointRed" data-id="${adPoint._id}" data-lat="${adPoint.location.coords.lat}" data-lng="${adPoint.location.coords.lng}">`
                    : `<div class="adpointInfo adPointBlue" data-id="${adPoint._id}" data-lat="${adPoint.location.coords.lat}" data-lng="${adPoint.location.coords.lng}">`
            }
                <div class="markerPlaceholder" alt="" srcset="">${adPoint.adsBoard.length}</div>
            
                ${
                    adPoint.planningStatus === 'Đã quy hoạch'
                        ? `
                <img src="/public/assets/icons/Info_icon_Red.svg" class="icon" alt="" srcset=""/>`
                        : `
                <img src="/public/assets/icons/Info_icon_Blue.svg" class="icon" alt="" srcset=""/>`
                }            
                <div class="details" style="position: relative; padding-right: 130px;">
                <div class="d-flex justify-content-between align-items-center column-gap-3">
                    <div style="flex: 1;">
                        <!-- location.locationName -->
                        <h5>${adPoint.location.locationName}</h5>
                        <meta name="planningStatus" content="${adPoint.planningStatus}"></meta>
                    </div>
                    <!-- Button to trigger the modal -->
                    <button
                        type="button"
                        class="btn btn-outline-danger reportExclamation"
                        style="min-width: 111px; width: fit-content; position: absolute; right: 0; top: 0;"
                        data-relatedToType="AdsPoint"
                        data-relatedTo="${adPoint._id}"
                        data-ward="${adPoint.location.ward}"
                        data-district="${adPoint.location.district}"
                        onclick="reportButtonHandler(event)"
                    >
                        <img src='public/assets/icons/Report_icon.svg' fill="none"/>
                        <span>Báo cáo</span>
                    </button>
                </div>
                <!-- locationType -->
                <h6>${adPoint.locationType}</h6>
                <!-- location.address -->
                <p>Phường <b>${adPoint.location.ward}</b> Quận <b>${adPoint.location.district}</b></p>
                </div>
            </div>`,
                'text/html'
            ).body.firstChild;
            adPointElements.push(div);

            for (let adsBoard of adPoint.adsBoard) {
                let div = parser.parseFromString(
                    `
                    <div
                    class="ad-board card default-background primary-text"
                    data-adsPoint="id_${adsBoard.adsPoint}"
                    style="width: 20rem; padding: 17px 17px; gap: 40px; min-width: 350px;"
                    >
                    <div class="d-flex align-items-start">
                        <div class="card-body ps-2" style="padding: 0px;">
                        <h5 class="card-title" style="font-size: 20px; font-family: Inter; font-weight: 600; margin-bottom: 4px;">${
                            adsBoard.adsBoardType
                        }</h5>
                        <p class="card-text">
                            <span class="label">Kích thước:</span>
                            <span class="value" style="font-size: 16px; font-family: Inter; font-weight: 700;">${
                                adsBoard.size.width
                            }m x ${adsBoard.size.height}m</span>
                        </p>
                        <p class="card-text">
                            <span class="label">Số lượng:</span>
                            <span class="value" style="font-size: 16px; font-family: Inter; font-weight: 700;">${
                                adsBoard.quantity
                            } trụ / bảng</span>
                        </p>
                        </div>
                    </div>
                    
                    
                        <!-- Button to trigger the modal -->
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 31 30" fill="none" data-bs-toggle="modal" data-bs-target="#adboard-detail-modal-${
                            adsBoard._id
                        }">
                            <path d="M14.2501 8.74994H16.7501V11.2499H14.2501V8.74994ZM14.2501 13.7499H16.7501V21.2499H14.2501V13.7499ZM15.5001 2.49994C8.60006 2.49994 3.00006 8.09994 3.00006 14.9999C3.00006 21.8999 8.60006 27.4999 15.5001 27.4999C22.4001 27.4999 28.0001 21.8999 28.0001 14.9999C28.0001 8.09994 22.4001 2.49994 15.5001 2.49994ZM15.5001 24.9999C9.98756 24.9999 5.50006 20.5124 5.50006 14.9999C5.50006 9.48744 9.98756 4.99994 15.5001 4.99994C21.0126 4.99994 25.5001 9.48744 25.5001 14.9999C25.5001 20.5124 21.0126 24.9999 15.5001 24.9999Z" fill="#1C89D0"/>
                        </svg>
                        <button
                            type="button"
                            class="btn btn-outline-danger d-flex justify-content-center align-items-center column-gap-2 reportExclamation"
                            onclick="reportButtonHandler(event)"
                            data-relatedToType="AdsBoard"
                            data-relatedTo="${adsBoard._id}"
                            data-ward="${adPoint.location.ward}"
                            data-district="${adPoint.location.district}"
                        >
                            <img src='public/assets/icons/Report_icon.svg' fill="none"/>
                            <span style="font-size: 14px; font-family: Inter; font-weight: 600; text-align: center; padding-top: 2px;">
                            BÁO CÁO VI PHẠM
                            </span>
                        </button>
                        </div>
                    
                    
                        <!-- Carousel -->
                        <div class="modal fade" id="adboard-detail-modal-${
                            adsBoard._id
                        }" aria-labelledby="adboard-detail-modal-label-${adsBoard._id}">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="adboard-detail-modal-label-${
                                            adsBoard._id
                                        }">Chi tiết bảng quảng cáo</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <h5 class="text-primary">Ngày kết thúc hợp đồng</h5>
                                        <p class="mb-4">${adsBoard.contractEndDate}</p>
                                        <h5 class="text-primary">Hình ảnh</h5>
                                        <!-- Carousel Wrapper -->
                                        <div
                                        id="adsBoardCarousel_${adsBoard._id}"
                                        class="carousel slide carousel-fade"
                                        data-mdb-ride="carousel"
                                        >
                                        <!-- Indicators -->
                                        <div class="carousel-indicators">
                                            <button
                                            type="button"
                                            data-mdb-target="#adsBoardCarousel_${adsBoard._id}"
                                            data-mdb-slide-to="0"
                                            class="active"
                                            aria-current="true"
                                            aria-label="Slide 1"
                                            ></button>
                                            <button
                                            type="button"
                                            data-mdb-target="#adsBoardCarousel_${adsBoard._id}"
                                            data-mdb-slide-to="1"
                                            aria-label="Slide 2"
                                            ></button>
                                            <button
                                            type="button"
                                            data-mdb-target="#adsBoardCarousel_${adsBoard._id}"
                                            data-mdb-slide-to="2"
                                            aria-label="Slide 3"
                                            ></button>
                                        </div>
                                
                                        <!-- Inner -->
                                        <div class="carousel-inner">
                                            <!-- Single item -->
                                            <div class="carousel-item active">
                                                <img
                                                    src="${
                                                        adsBoard.adsBoardImages?.[0] ||
                                                        '/public/images/IMG_7850.png'
                                                    }"
                                                    class="d-block w-100"
                                                    alt="AdsBoard Image"
                                                />
                                            </div>
                                        </div>
                                        <!-- Inner -->
                                
                                        <!-- Controls -->
                                        <button
                                            class="carousel-control-prev"
                                            type="button"
                                            data-mdb-target="#adsBoardCarousel_${adsBoard._id}"
                                            data-mdb-slide="prev"
                                        >
                                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span class="visually-hidden">Previous</span>
                                        </button>
                                        <button
                                            class="carousel-control-next"
                                            type="button"
                                            data-mdb-target="#adsBoardCarousel_${adsBoard._id}"
                                            data-mdb-slide="next"
                                        >
                                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span class="visually-hidden">Next</span>
                                        </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                    'text/html'
                ).body.firstChild;
                adboardContainer.appendChild(div);
                adBoardElements.push(div);
            }
        }

        return { adBoardElements, adPointElements };
    } catch (err) {
        console.log(err);
    }
}

async function getAllReports() {
    const result = await axios
        .get(`http://localhost:4000/report/resident/api/v1`, {
            withCredentials: true
        }) // get all reports
        .catch((err) => {
            console.log(err);
            return null;
        });

    const parser = new DOMParser();
    const reportContainer = document.getElementById('report-container');

    if (!result) {
        reportContainer.innerHTML = `<p>Không có báo cáo nào</p>`;
        return null;
    }

    const reports = result.data.reports;

    for (let report of reports) {
        const imgSrc = report.image1 != 'undefined' || report.image2 != 'undefined';
        const content = `
    <div class="card" style="width: 100%;">
        ${imgSrc ? `<img src="${imgSrc}" class="card-img-top" alt="Report Image">` : ''}
        <div class="card-body">
            <h4 class="card-title text-success">${report.reportFormat.name}</h4>
            <h6 class="card-subtitle text-secondary">${report.createdAt}</h6>
            <iframe style="width: 100%; height: 100px; overflow: hidden;" srcdoc="${
                report.content
            }" frameborder="0" title="Report Content"></iframe>
            <p class="card-text">Phường <b>${report.ward}</b> Quận <b>${report.district}</b></p>
            <p class="card-text text-danger"><em><b>${report.processingStatus}</b></em></p>
        </div>
    </div>
        `;
        const div = parser.parseFromString(content, 'text/html').body.firstChild;
        reportContainer.appendChild(div);
    }
    console.log(reports);
    return reports;
}

export { getAllAdsPoints, getAllReports };
