const COUNT_START = 45 * 60 * 10; // min * sec * 단위
let count = COUNT_START;
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
    count = COUNT_START;
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

// 최초 타이머 표시
displayTime();
