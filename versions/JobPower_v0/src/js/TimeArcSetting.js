var timeArcopt = {width:1400,height:700, margin: {top: 10, right: 10, bottom: 0, left: 350},
    offset: {top: 0},preLinkText:'Computes have',postLinkText:' same job(s)'};
var timeArJobcopt = {width:1400,height:700, margin: {top: 10, right: 10, bottom: 0, left: 350},contain: '#Jobcontent',
    containHolder:'#chart__job_holder',
    offset: {top: 0},preLinkText:'Jobs run on',postLinkText:' same compute(s)'};
let TimeArcSetting = function (){
    let graphicopt = {
        contain: '#Chartcontent',
        containHolder: '#chart_holder',
        margin: {top: 10, right: 10, bottom: 0, left: 200},
        offset: {top: 0},
        width: 1500,
        height: 1000,
        scalezoom: 1,
        widthView: function () {
            return this.width * this.scalezoom
        },
        heightView: function () {
            return this.height * this.scalezoom
        },
        widthG: function () {
            return this.widthView() - this.margin.left - this.margin.right
        },
        heightG: function () {
            return this.heightView() - this.margin.top - this.margin.bottom
        },
        display: {
            links: {
                'stroke-opacity': 0.5
            },
            stream:{
                yScale: d3.scaleLinear().range([0,15])
            }
        },
        userStreamMode:'Power'
    };
    let scheme={},filterTerm=[];
    let contain = d3.select(graphicopt.contain);
    let master = {};
    let TimeArc  = d3.TimeArc();
    let isFirst = true;
    let catergogryList=[{key: 'user', value: {colororder: 0}},{key: 'compute', value: {colororder: 1}},{key: 'rack', value: {colororder: 2}}];
    let layout={};
    let onmouseOver=()=>{},onmouseLeave=()=>{},onmouseClick=()=>{};
    master.timearc = TimeArc;
    master.reset = function(){

        return master;
    };
    master.mouseover = [];
    master.mouseover.dict={};
    master.mouseout = [];
    master.mouseout.dict={};
    master.click = [];
    master.click.dict={};
    master.mouseoverAdd = function(id,func){
        if (master.mouseover.dict[id]!==undefined)
            master.mouseover[master.mouseover.dict[id]] = func;
        else {
            master.mouseover.push(func)
            master.mouseover.dict[id] = master.mouseover.length-1;
        }
    }
    master.mouseoutAdd = function(id,func){
        if (master.mouseout.dict[id]!==undefined)
            master.mouseout[master.mouseout.dict[id]] = func;
        else {
            master.mouseout.push(func)
            master.mouseout.dict[id] = master.mouseout.length-1;
        }
    }
    master.clickAdd = function(id,func){
        if (master.click.dict[id]!==undefined)
            master.click[master.click.dict[id]] = func;
        else {
            master.click.push(func)
            master.click.dict[id] = master.click.length-1;
        }
    }
    master.init = function () {
        TimeArc
            .svg(contain)
            .graphicopt(graphicopt)
            .mouseover(onmouseOver).mouseout(onmouseLeave)
            .mouseclick(onmouseClick)
            .catergogryList(catergogryList)
            .init();

        return master;
    };

    master.stop = function (){

    };

    master.draw = function () {
        if (isFirst) {
            debugger
            master.init();
            isFirst = false;
        }
        scheme.filterTerm = filterTerm
        TimeArc.runopt(scheme).data(scheme.data).draw();

        updateProcess();
    };

    master.filterTerms = function(_) {
        return arguments.length?(filterTerm=_,master):filterTerm;
    };

    master.graphicopt = function (__) {
        //Put all of the options into a variable called graphicopt
        if (arguments.length) {
            for (let i in __) {
                if ('undefined' !== typeof __[i]) {
                    graphicopt[i] = __[i];
                }
            }
            contain = d3.select(graphicopt.contain);
            TimeArc.graphicopt(graphicopt);
            return master;
        }else {
            return graphicopt;
        }

    };
    let isNeedRender = true;
    master.scheme = function (__) {
        //Put all of the options into a variable called graphicopt
        if (arguments.length) {
            for (let i in __) {
                if ('undefined' !== typeof __[i]) {
                    scheme[i] = __[i];
                }
            }
            return master;
        }else {
            return scheme;
        }

    };
    master.getColorScale = function(_data) {
        return arguments.length?(getColorScale=_data?_data:function(){return color},master):getColorScale;
    };
    master.onmouseOver = function(_data) {
        return arguments.length?(onmouseOver=_data,master):onmouseOver;
    };
    master.onmouseLeave = function(_data) {
        return arguments.length?(onmouseLeave=_data,master):onmouseLeave;
    };
    master.onmouseClick = function(_data) {
        return arguments.length?(onmouseClick=_data,master):onmouseClick;
    };
    master.catergogryList = function(_data) {
        return arguments.length?(catergogryList=_data,master):catergogryList;
    };

    master.schema = function (){
        isNeedRender = true;
    };
    master.layout = function(d){
        layout = {};
        d.forEach(k=>layout[k.Name]= _.flatten(k.value).filter(d=>d))
        TimeArc.classMap(layout)
    };
    return master;
};
function handle_data_timeArc () {
    const keys = Layout.timespan//.slice(0,10);
    let scheme ={limitColums : [0,10],
        limitTime : [keys[0],keys[keys.length-1]],
        time: {rate:5,unit:'Minute'},
        // timeLink: {rate:5,unit:'Minute'},
        timeformat: d3.timeDay.every(1),
    };
    let dataObj = {};
    scheme.data=[];
    scheme.data.timespan = keys;

    let data = Layout.userTimeline;
    debugger
    scheme.data = [];
    keys.forEach((k,ki)=>{
        data.forEach(d=>{
            if (d[k]){
                const category = {compute:{}};
                d[k].forEach(e=>category.compute[e.key]=e.value);
                const value = d[k].total;
                const date = k;
                scheme.data.push({
                    category,
                    date,
                    id: d3.keys(category.compute).join('_'),
                    value,
                    data:d[k],
                });
            }
        })
    });

    scheme.data.timespan = keys;
    scheme.data.tsnedata = tsnedata;
    scheme.data.selectedService = 0;
    // scheme.limitTime = d3.extent(scheme.data,d=>d.date)
    // scheme.limitTime = [sampleS.timespan[0],_.last(sampleS.timespan)]
    const catergogryList=[{key: 'compute', value: {colororder: 1}}];
    subObject.graphicopt(timeArcopt).scheme(scheme).catergogryList(catergogryList).draw();
}
function handle_data_timeArc_job () {
    const keys = Layout.timespan//.slice(0,10);
    let scheme ={limitColums : [0,10],
        limitTime : [keys[0],keys[keys.length-1]],
        time: {rate:5,unit:'Minute'},
        // timeLink: {rate:5,unit:'Minute'},
        timeformat: d3.timeDay.every(1),
    };
    let dataObj = {};
    scheme.data=[];
    scheme.data.timespan = keys;

    let data = Layout.jobTimeline;
    debugger
    scheme.data = [];
    keys.forEach((k,ki)=>{
        data.forEach(d=>{
            if (d[k]){
                const category = {job:{}};
                d[k].forEach(e=>category.job[e.key]=e.value);
                const value = d[k].total;
                const date = k;
                scheme.data.push({
                    category,
                    date,
                    id: d3.keys(category.job).join('_'),
                    value,
                    data:d[k],
                });
            }
        })
    });

    scheme.data.timespan = keys;
    scheme.data.tsnedata = Layout.jobarrdata;
    scheme.data.selectedService = 0;
    const catergogryList=[{key: 'job', value: {colororder: 0}}];
    // scheme.limitTime = d3.extent(scheme.data,d=>d.date)
    // scheme.limitTime = [sampleS.timespan[0],_.last(sampleS.timespan)]
    jobObject.graphicopt(timeArJobcopt).scheme(scheme).catergogryList(catergogryList).draw();
}
