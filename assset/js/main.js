let countConst = 0;
let count = 0;
let playing = false;

playpause = document.getElementById("playpause");
reset = document.getElementById("reset");

// 시작,정지
playpause.onclick = function () {
    if (playing) {
        playing = false;
        playpause.innerHTML = "▶";
    } else if (!playing) {
        playing = true;
        playpause.innerHTML = "‖";
    }
    countdown();
};

// 리셋
reset.onclick = function () {
    if (playing) {
        playing = false;
        playpause.innerHTML = "▶";
    }
    initTime();
    displayTime();
};

// 타이머 동작
function countdown() {
    if (count == 0) {
        playing = false;
    } else if (playing) {
        setTimeout(countdown, 100);
        count--;
    }
    displayTime();
}

// 타이머 시간초기화
function initTime() {
    let initTime = "0311";
    const MM=initTime.substring(0,2);
    const SS=initTime.substring(2);
    countConst = (MM * 60 + +SS) * 10; // MMSS를 SEC로 변환
    count = countConst;
}

// 타이머 표시
function displayTime() {
    let sec = Math.floor(count / 10);
    let mins = Math.floor(sec / 60);
    sec -= mins * 60;

    document.getElementById("time_left").innerHTML =
        LeadingZero(mins) + ":" + LeadingZero(sec);
}

// LPAD 00
function LeadingZero(Time) {
    return Time < 10 ? "0" + Time : Time;
}

// 최초 시간 초기화
initTime();
// 최초 타이머 표시
displayTime();
