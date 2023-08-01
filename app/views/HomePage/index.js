const { ipcRenderer,
        handleUploadStatus,
        handleListStatus,
        handleListData,
        handleNextTimeCron,
        shell
    } = window.electron
ipcRenderer.send('get-list')

$("#btn-list").click(
    ()=>{
        ipcRenderer.send('get-list')
    }
)

$("#submit-upload").click(()=>{
    ipcRenderer.send('run')
})
handleUploadStatus((event, value)=>{
    if(value == "done") {
        ipcRenderer.send('get-list')
        $("#upload-status-txt").html("");
        $("#upload-status-loading").addClass('d-none')
        $("#submit-upload").prop('disabled', false);
    }else{
        $("#upload-status-txt").html(value);
        $("#upload-status-loading").removeClass('d-none')
        $("#submit-upload").prop('disabled', true);
    }
})

handleListStatus((event, value)=>{
    $("#list-status").html(value)
})

handleListData((event, value)=>{
    function bytesToMB(bytes) {
        return (bytes / (1024 * 1024)).toFixed(1);
      }
    let data = value.map(e=>
        `   <a href="${e.webViewLink}" target="_blank"
                class="list-group-item
                    list-group-item-action
                    link-item
                    ">
                    ${e.name} (${e.mimeType}) - size: ${bytesToMB(e.size)}MB - time: ${e.createdTime}
            </a>`)
    $("#list-group").html(data.join(" "))
    $('.link-item').click(function (event){
        event.preventDefault();
        const href = this.getAttribute('href');
        shell.openExternal(href);
    })
})

function validPath (valid){
    let path = $(this).val();
    let isExist = valid(path)
    let status = $(this).closest('.form-group')
    if (isExist){
        status.find(".fa-check").css('display', 'inline-block');
        status.find(".fa-times").css('display', 'none');
    }else{
        status.find(".fa-check").css('display', 'none');
        status.find(".fa-times").css('display', 'inline-block');
    }
}


$(".file-path").change(
    function (){
        validPath.bind(this)((path)=>ipcRenderer
                    .sendSync("check-file-path", path))

    }
)
$(".directory-path").change(
    function (event){
        validPath.bind(this)((path)=>ipcRenderer
                    .sendSync("check-path", path))

    }
)

const form = $("#form-config")
$("#submit-config").click(
    function submitPath(event){
        event.preventDefault()
        // const formData = new FormData(form)
        const formData = form.serializeArray()
        const hashData = {}
        for (const field of formData) {
            hashData[field.name] = field.value;
        }
        ipcRenderer.send('submit-config', hashData)
        alert('save success')
    }
)
function initConfig() {
    const form = ipcRenderer.sendSync('get-config')
    for (let key in form){
        $(`#${key}`).val(form[key] || "")
        $(`#${key}`).trigger('change');
    }
}
initConfig()
ipcRenderer.send('next-time-cron')
handleNextTimeCron((event, date)=>{
    const timeZone = 'Asia/Ho_Chi_Minh';
    const options = { timeZone: timeZone, timeZoneName: 'short' };
    const formattedDate = date.toLocaleString('en-US', options);
    $('#currentTime').html(formattedDate)
})
