const { ipcRenderer, shell } = window.electron;

let cronStatus = false;
function setStatusCron(status){
    if(status){
        $("#status-cron").html("running")
        $("#btn-cron").html(
            `
            <button class="btn btn-primary" id="submit-start">Start
                <span>
                    <i class="fa fa-play" aria-hidden="true"></i>
                </span>
            </button>
            `
        )
    }else{
        $("#status-cron").html("stopping")
        $("#btn-cron").html(
            `
            <button class="btn btn-danger" id="submit-stop">stop
                <span>
                <i class="fa fa-stop" aria-hidden="true"></i>
                </span>
            </button>
            `
        )
    }


}
function init(){
    const status = ipcRenderer.sendSync("cron-status");
    setStatusCron(status)
}
init()
$('#submit-stop').click(
    function(){
        const status = ipcRenderer.sendSync("cron-stop");
        setStatusCron(status)
    }
)
$('#submit-start').click(
    function(){
        const status = ipcRenderer.sendSync("cron-start");
        setStatusCron(status)
    }
)
$('#submit-reload').click(
    function(event){
        event.preventDefault();
        const cronExpress = $("#input-cron-express").val();
        const status = ipcRenderer.send("cron-reload", cronExpress);
        setStatusCron(status)
    }
)




