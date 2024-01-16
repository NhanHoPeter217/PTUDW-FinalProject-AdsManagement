var urlParams = new URLSearchParams(window.location.search);
var districtAssigned = urlParams.get('dist');  
var wardAssigned = urlParams.getAll('ward') || [];

console.log("District: " + districtAssigned + " Ward: " + wardAssigned);

// Main function
$(document).ready(function(){
    initFilter();
    initSendReport();
})



// Helper functions
function initFilter(){
    // District filter
    var districtFilter = $('#license_filter_district');
    // districtFilter.val(districtAssigned);
    districtFilter.on('change', function(){
        var selectedDistrict = districtFilter.val();
        window.location.href = '/report/assignedArea?dist=' + selectedDistrict;
    });

    // Ward filter
    var checkBoxes = $('.checkbox-input');
    checkBoxes.each(function(){
        if(wardAssigned.includes(this.getAttribute('data-ward'))){
            this.checked = true;
        }
    });
    checkBoxes.on('change', function(){
        if(this.checked){
            wardAssigned.push(this.getAttribute('data-ward'));
        }
        else{
            wardAssigned.splice(wardAssigned.indexOf(this.getAttribute('data-ward')), 1);
        }
        window.location.href = '/report/assignedArea?dist=' + districtAssigned + '&ward=' + wardAssigned.join('&ward=');
    });
}

function initSendReport(){
    // Send report
    $('.tackle-form').on('submit', async function(e){
        let processingStatus = $(this).find('select[name="processingStatus"]').val();
        let processingMethod = $(this).find('select[name="processingMethod"]').val();

        await axios.patch('/report/' + this.getAttribute('data-report-id'), {
            processingStatus,
            processingMethod
        })
    });
}