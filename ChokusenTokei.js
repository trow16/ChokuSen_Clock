
const cs = document.getElementById('myCanvas');
const ctx = cs.getContext('2d');
let timeUnit = 0;
let offsetPast = 0;
let pastNeedlepos = 0;
let leftScaleNum_P = 0;
let rightScaleNum_P = 0;
let scaleInterval_P = 0;
let transition1 = 0;
let transition2 = 0;
let unit_P =0;
let left_ref;
let left_ref_P;
let right_ref_P;
let right_ref2_P;
let scaleInterval;
let right_ref;
let scaleDev;
let intervalArray = [];
let ww;
let wh;
let leftScaleNum_W;
let leftScale_W;
let rightScale_W;
let offsetLine;
let tick_s = 0.6;
let tick_l = 6;
let leftText;
let rightText;
const tr_time = 28;
let refScale_Tick = 80;
let nGap = 3;
const Titles = ["1 minute","1 hour","1 day","1 week","1 month","1 year","1 decade","1 century","1 Millennium"]


drawLoop();

function drawLoop(){
    const begin = Date.now();
    
    //時刻取得
    let date = new Date();
    let yearNow = date.getFullYear();
    let monthNow = date.getMonth();
    let dateNow =  date.getDate();
    let dayNow = date.getDay();
    let hourNow = date.getHours();
    let minuteNow = date.getMinutes(); 
    let secondNow = date.getSeconds();
    let milliNow = date.getMilliseconds();

    //月､年の長さ
    let monthLength = new Date(yearNow, monthNow+1, 0).getDate();
    let yearLength = 365;
    if(new Date(yearNow, 2, 0).getDate() == 28){
        yearLength = 365;
    }
    else if(new Date(yearNow, 2, 0).getDate() == 29){
        yearLength = 366;
    }
    //目盛りの刻み　0:一分, 1:一時間, 2:一日, 3:一週間, 4:一ヵ月, 5:一年, 6:十年紀（一年代）, 7:百年紀（一世紀）, 8:千年紀
    intervalArray = [60,60,24,7,monthLength,yearLength,10,10,10];

    //画面更新
    ww = window.innerWidth;
    wh = window.innerHeight;
    cs.width = ww;
    cs.height = wh;
    ctx.clearRect(0, 0, ww, wh);
    refScale_Tick = wh / 10;

    //直線
    ctx.fillStyle = "rgba(" + [240, 240, 240, 1] + ")"
    ctx.fillRect(0, wh/2, ww, 4);

    //遷移1
    let tr_able = 0;
    offsetLine = 0;
    if(secondNow == 59){
        if(timeUnit == 0){
            tr_able = 1;
        }
        else if(minuteNow == 59){
            if(timeUnit == 1){
                tr_able = 1;
            }
            else if(hourNow == 23){
                if(timeUnit == 2){
                    tr_able = 1;
                }
                else if((dayNow == 6 && timeUnit == 3) || (dateNow == monthLength-1 && timeUnit == 4)){
                    tr_able = 1;
                }
                else if(dateNow == monthLength-1 && monthNow == 11){
                    if(timeUnit == 5){
                        tr_able = 1;
                    }
                    else if(parseInt(String(yearNow).slice(3),10) == 9){
                        if(timeUnit == 6){
                            tr_able = 1;
                        }
                        else if(parseInt(String(yearNow).slice(2),10) == 99){
                            if(timeUnit == 7){
                                tr_able = 1;
                            }
                            else if(parseInt(String(yearNow).slice(1),10) == 999){
                                if(timeUnit == 8){
                                    tr_able = 1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if(tr_able==1){
        if(transition2 == 0){
        transition1 = 1;
        offsetLine = -(8*ww/10 * (milliNow/1000));
        }
    }
    else{
        transition1 = 0;
        offsetLine = 0;
    }

    if(transition2 >= tr_time){
        transition2 = 0;
    }

    //通常の目盛り
    //基準目盛り
    if(transition2 != 0){
        ctx.fillStyle = "rgba(" + [0, 0, 0, 0] + ")";
    }
    else{
        ctx.fillStyle = "rgba(" + [240, 240, 240, 1] + ")";
    }
    left_ref = ww/10 + offsetLine;
    right_ref = 9*ww/10 + offsetLine;
    const right_ref2 = 19*ww/10 + offsetLine;
    
    ctx.fillRect(left_ref,wh/2-refScale_Tick,tick_l,refScale_Tick);
    ctx.fillRect(right_ref,wh/2-refScale_Tick,tick_l,refScale_Tick);
    ctx.fillRect(right_ref2,wh/2-refScale_Tick,tick_l,refScale_Tick);
    //刻み目盛り
    scaleDev = intervalArray[timeUnit];
    scaleInterval = (right_ref - left_ref) / scaleDev;
    for(let i = 1;i < scaleDev*3;i++){
        if(i != scaleDev){
            ctx.fillRect(left_ref + (scaleInterval * i),wh/2-refScale_Tick/2,tick_s,refScale_Tick/2);
        }
    }
    for(let i = 1;i < scaleDev;i++){
        ctx.fillRect(left_ref - (scaleInterval * i),wh/2-refScale_Tick/2,tick_s,refScale_Tick/2);
    }


    //針
    switch(timeUnit){
        case 0:
            needlePos = scaleInterval*(secondNow + milliNow/1000)+nGap;
            break;
        case 1:    
            needlePos = scaleInterval*(minuteNow + secondNow/60)+nGap; 
            break;
        case 2:    
            needlePos = scaleInterval*(hourNow + minuteNow/60)+nGap; 
            break;
        case 3:    
            needlePos = scaleInterval*(dayNow + hourNow/24)+nGap;
            break;
        case 4:
            needlePos = scaleInterval*(dateNow - 1 + hourNow/24)+nGap;
            break;
        case 5:    
            const y = `${new Date().getFullYear()}/1/1`
            const nt = new Date(y).getTime();
            const t = Date.now() - nt;
            const d = Math.floor( t / 1000 / 60 / 60 / 24 );
            needlePos = scaleInterval*(d)+nGap; 
            break;
        case 6:    
            needlePos = scaleInterval*(parseInt(String(yearNow).slice(3),10) + monthNow/12)+nGap; 
            break;
        case 7:    
            needlePos = scaleInterval/10*(parseInt(String(yearNow).slice(2),10) + monthNow/12)+nGap; 
            break;
        case 8:    
            needlePos = scaleInterval/100*(parseInt(String(yearNow).slice(1) + monthNow/12),10)+nGap; 
            break;
    }
    //色
    if(transition2 == 0){
        let s = Math.floor((needlePos-nGap)/scaleInterval) * scaleInterval;
        ctx.fillStyle = "rgba(" + [240, 0, 0, 0.5] + ")";
        if(s == 0){
            ctx.fillRect(s+tick_l+ left_ref,wh/2-refScale_Tick/2,scaleInterval-tick_l,refScale_Tick/2);
        }
        else{
            ctx.fillRect(s+tick_s+ left_ref,wh/2-refScale_Tick/2,scaleInterval-tick_s,refScale_Tick/2);
        }
    }

    if(transition2 == 1){
        left_ref = ww/10 + offsetLine;
        right_ref = 9*ww/10 + offsetLine;
        scaleDev = intervalArray[unit_P];
        scaleInterval = (right_ref - left_ref) / scaleDev;
        leftScaleNum_W = Math.floor((needlePos)/scaleInterval);
        leftScale_W = left_ref + (scaleInterval * leftScaleNum_W);
        rightScale_W = leftScale_W + scaleInterval;
    }

    if(transition2 > 0){
        if(transition2 < tr_time){
            let ofn = (pastNeedlepos - needlePos) * ((tr_time - transition2)/tr_time);
            needlePos += ofn;
            transition2++;
        }
    }
            //ctx.fillStyle = "rgba(" + [220, 50, 0, 1] + ")";
            ctx.strokeStyle ="rgba(" + [240, 240, 240, 1] + ")";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(left_ref + needlePos, wh/2 + 10);
            ctx.lineTo(left_ref + needlePos - 10, wh/2+50);
            ctx.lineTo(left_ref + needlePos + 10, wh/2+50);
            ctx.closePath();
            //ctx.fill();    
            ctx.stroke();
            ctx.fillStyle ="rgba(" + [240, 240, 240, 1] + ")";

    //文字
    switch(timeUnit){
        case 0:
            leftText = minuteNow;
            rightText = minuteNow + 1;
            rightText2 = minuteNow + 2;
            break;
        case 1:
            leftText = hourNow;
            rightText = hourNow +1;
            rightText2 = minuteNow + 2;
            break;
        case 2:
            leftText = dateNow;
            rightText = dateNow + 1;
            rightText2 = dateNow + 2;
            break;
        case 3:
            leftText =  dateNow - dayNow;
            rightText = dateNow - dayNow+7;
            rightText2 = dateNow - dayNow+14;
            break;
        case 4:
            leftText = monthNow+1;
            if(monthNow + 2 > 12){
                rightText = monthNow + 2 - 12;
            }
            else{
                rightText = monthNow + 2;
            }
            if(monthNow + 3 > 12){
                rightText2 = monthNow + 3 - 12;
            }
            else{
                rightText2 = monthNow + 3;
            }
            break;
        case 5:
            leftText = yearNow;
            rightText = yearNow + 1;
            rightText2 = yearNow + 2;
            break;
        case 6:
            leftText = Math.floor(yearNow / 10)*10 + "s";
            rightText = (Math.floor(yearNow / 10)*10 + 10) + "s";
            rightText2 = (Math.floor(yearNow / 10)*10 + 20) + "s";
            break;
        case 7:
            leftText = Math.ceil(yearNow / 100);
            rightText = Math.ceil(yearNow / 100) + 1;
            rightText2 = Math.ceil(yearNow / 100) + 2;
            break;
        case 8:
            leftText = Math.ceil(yearNow / 1000);
            rightText = Math.ceil(yearNow / 1000) + 1;
            rightText2 = Math.ceil(yearNow / 1000) + 2;
            break;
    }
    let Title = Titles[timeUnit];
    if(transition2 != 0){
        ctx.fillStyle = "rgba(" + [240, 240, 240, (transition2)/tr_time] + ")"
    }
    else{
        ctx.fillStyle = "rgba(" + [240, 240, 240, 1] + ")"
    }
    let tsz;
    let ssz;
    if(refScale_Tick > 40){
        tsz = refScale_Tick;
        ssz = refScale_Tick*3/5;
    }
    else{
        tsz = 40;
        ssz = 24;
    }
    //タイトル文字
    ctx.font = '600 '+ tsz +'px sans-serif';
    ctx.fillText(Title, ssz,wh - ssz);
    //目盛り文字
    ctx.font = '600 '+ ssz +'px sans-serif';
    ctx.textAlign = "center"
    ctx.fillText(leftText, left_ref+nGap, wh/2 - refScale_Tick * 1.3);
    ctx.fillText(rightText, right_ref+nGap, wh/2 - refScale_Tick * 1.3);
    ctx.fillText(rightText2, right_ref2+nGap, wh/2 - refScale_Tick * 1.3);

    //1の目盛り(内側)
    //基準目盛り
    let refScale_Tick_N;
    if(transition2 != 0){
        if(unit_P > timeUnit){
            ctx.fillStyle = "rgba(" + [240, 240, 240, transition2/tr_time] + ")";
            refScale_Tick_N = refScale_Tick * (transition2/tr_time);
        }
        else{
            ctx.fillStyle = "rgba(" + [240, 240, 240, (tr_time-transition2)/tr_time] + ")";
            refScale_Tick_N = refScale_Tick * ((tr_time - transition2)/tr_time);
        }
    }
    else{
        ctx.fillStyle = "rgba(" + [240, 240, 240, 0] + ")";
    }
    left_ref = ww/10 + offsetLine;
    right_ref = 9*ww/10 + offsetLine;
    left_ref_N = ww/10 + offsetLine;
    right_ref_N = 9*ww/10 + offsetLine;
    right_ref2_N = 19*ww/10 + offsetLine;
    let scaleDev_N = intervalArray[timeUnit];
    if(transition2 != 0 && unit_P > timeUnit){
        left_ref_N = leftScale_P - (leftScale_P - left_ref) * ((transition2)/tr_time);
        right_ref_N = rightScale_P + (right_ref - rightScale_P) * ((transition2)/tr_time);
        scaleDev_N = intervalArray[timeUnit];
    }
    else if(transition2 != 0 && unit_P < timeUnit){
        left_ref_N = left_ref + (leftScale_W - left_ref) * ((transition2)/tr_time);
        right_ref_N = right_ref - (right_ref - rightScale_W) * ((transition2)/tr_time);
        scaleDev_N = intervalArray[timeUnit - 1];
    }
    ctx.fillRect(left_ref_N,wh/2-refScale_Tick_N,tick_l,refScale_Tick_N);
    ctx.fillRect(right_ref_N,wh/2-refScale_Tick_N,tick_l,refScale_Tick_N);
    ctx.fillRect(right_ref2_N,wh/2-refScale_Tick_N,tick_l,refScale_Tick_N);
    //刻み目盛り
    scaleDev = intervalArray[timeUnit];
    scaleInterval = (right_ref_N - left_ref_N) / scaleDev_N;
    for(let i = 1;i < scaleDev_N*20;i++){
        if(i != scaleDev_N){
            const numScale_Tick = 20
            ctx.fillRect(left_ref_N + (scaleInterval * i),wh/2-refScale_Tick_N/2,tick_s,refScale_Tick_N/2);
        }
    }
    for(let i = 1;i < scaleDev_N*10;i++){
        const numScale_Tick = 20
        ctx.fillRect(left_ref_N - (scaleInterval * i),wh/2-refScale_Tick_N/2,tick_s,refScale_Tick_N/2);
    }

    //2の目盛り(外側)
    //基準目盛り
    let refScale_Tick_P;
    if(transition2 != 0){
        if(unit_P < timeUnit){
            ctx.fillStyle = "rgba(" + [240, 240, 240, transition2/tr_time] + ")";
            refScale_Tick_P = refScale_Tick * (transition2/tr_time);
        }
        else{
            ctx.fillStyle = "rgba(" + [240, 240, 240, (tr_time-transition2)/tr_time] + ")";
            refScale_Tick_P = refScale_Tick * ((tr_time - transition2)/tr_time);
        }    }
    else{
        ctx.fillStyle = "rgba(" + [240, 240, 240, 0] + ")";
    }
    left_ref_P = ww/10 + offsetLine;
    right_ref_P = 9*ww/10 + offsetLine;
    right_ref2_P = 19*ww/10 + offsetLine;
    let scaleDev_P = intervalArray[timeUnit];
    if(transition2 != 0 && unit_P > timeUnit){
        left_ref_P = left_ref - (leftScale_P - left_ref) * ((transition2)/tr_time);
        right_ref_P = right_ref - (rightScale_P - right_ref) * ((transition2)/tr_time);
        scaleDev_P = intervalArray[timeUnit + 1];
    }
    else if(transition2 != 0 && unit_P < timeUnit){
        left_ref_P = left_ref - (leftScale_W - left_ref) * ((tr_time-transition2)/tr_time);
        right_ref_P = right_ref + (right_ref - rightScale_W) * ((tr_time-transition2)/tr_time);
        scaleDev_P = intervalArray[timeUnit];
    }
    ctx.fillRect(left_ref_P,wh/2-refScale_Tick_P,tick_l,refScale_Tick_P);
    ctx.fillRect(right_ref_P,wh/2-refScale_Tick_P,tick_l,refScale_Tick_P);
    ctx.fillRect(right_ref2,wh/2-refScale_Tick_P,tick_l,refScale_Tick_P);
    //刻み目盛り
    let scaleInterval_P = (right_ref_P - left_ref_P) / scaleDev_P;
    for(let i = 1;i < scaleDev_P*20;i++){
        if(i != scaleDev_P){
            const numScale_Tick = 20
            ctx.fillRect(left_ref_P + (scaleInterval_P * i),wh/2-refScale_Tick_P/2,tick_s,refScale_Tick_P/2);
        }
    }
    for(let i = 1;i < scaleDev_P*10;i++){
        const numScale_Tick = 20
        ctx.fillRect(left_ref_P - (scaleInterval_P * i),wh/2-refScale_Tick_P/2,tick_s,refScale_Tick_P/2);
    }


    const end = Date.now();
    setTimeout(drawLoop, 33 - (end - begin));
}

function scaleUp(){
    if(timeUnit < 8 && transition2 == 0 && transition1 == 0){
        unit_P = timeUnit;
        timeUnit++;
        pastNeedlepos = needlePos;
        transition2 = 1;
    }
}
function scaleDown(){
    if(timeUnit > 0 && transition2 == 0 && transition1 == 0){
        unit_P = timeUnit;
        timeUnit--;
        pastNeedlepos = needlePos;
        left_ref = ww/10 + offsetLine;
        right_ref = 9*ww/10 + offsetLine;
        scaleDev = intervalArray[unit_P];
        scaleInterval = (right_ref - left_ref) / scaleDev;
        leftScaleNum_P = Math.floor(pastNeedlepos/scaleInterval);
        leftScale_P= left_ref + (scaleInterval * leftScaleNum_P);
        rightScale_P = leftScale_P + scaleInterval;
        scaleInterval_P = scaleInterval;
        transition2 = 1;
    }
}

document.addEventListener('keydown', event => {
    if (event.code === 'ArrowUp') {
        scaleUp();
    }
    if (event.code === 'ArrowDown') {
        scaleDown();
    }
    if (event.code === 'Digit1') {
        if(transition1 == 0){
            timeUnit = 0;
        }
    }
    if (event.code === 'Digit2') {
        if(transition1 == 0){
            timeUnit = 1;
        }
    }
    if (event.code === 'Digit3') {
        if(transition1 == 0){
            timeUnit = 2;
        }
    }
    if (event.code === 'Digit4') {
        if(transition1 == 0){
            timeUnit = 3;
        }
    }
    if (event.code === 'Digit5') {
        if(transition1 == 0){
            timeUnit = 4;
        }
    }
    if (event.code === 'Digit6') {
        if(transition1 == 0){
            timeUnit = 5;
        }
    }
    if (event.code === 'Digit7') {
        if(transition1 == 0){
            timeUnit = 6;
        }
    }
    if (event.code === 'Digit8') {
        if(transition1 == 0){
            timeUnit = 7;
        }
    }
    if (event.code === 'Digit9') {
        if(transition1 == 0){
            timeUnit = 8;
        }
    }
});
let startY;
let endY;
let startT;
let endT;

window.addEventListener('touchstart', (event) =>  {

    startT = Date.now();
    startY = event.touches[0].pageY;
  });
  window.addEventListener('touchmove', (event) =>  {

    endY = event.changedTouches[0].pageY;
  });

  window.addEventListener('touchend', (event) =>  {

    endT = Date.now;
    difT = (endT-startT)
    if(difT > 10 && difT < 1000){
    if( 0 < (endY - startY) ) {
      scaleDown();
    } else {
      scaleUp();
    }}
  });
