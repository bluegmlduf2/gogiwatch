import Timer from "./timer.js";
import roastingTime from "./roastingTime.js";

const timer = new Timer();
timer.setTime();
timer.displayTime();

/********************************************************************************
 * 이벤트 등록
 ********************************************************************************/
// 시작 버튼 클릭 시 타이머 등장
let btnStart = document.querySelector(".btn-start");
let btnClose = document.querySelector(".btn-close");
let timerArea = document.querySelector(".timer-area");
btnStart.addEventListener("click", () => {
    timerArea.classList.add("on");
});
// 임시 닫기 버튼
btnClose.addEventListener("click", () => {
    timerArea.classList.remove("on");
    timer.reset();
    timer.displayTime();
});
// 재생,정지버튼 클릭이벤트
document.getElementById("playpause").addEventListener("click", () => {
    timer.play();
    timer.displayTime();
});

// 리셋버튼
document.getElementById("reset").addEventListener("click", () => {
    timer.reset();
    timer.displayTime();
});

// 돼지고기 고기종류 선택
document.querySelectorAll(".wrap-meat-pork input").forEach((e) => {
    e.addEventListener("change", () => {
        const porkRoastingTime = getPorkRoastingTime();
        // 고기 굽기 시간 설정
        timer.setTime(porkRoastingTime[0]);
        timer.displayTime();
    });
});

// 소고기 고기종류나 굽기정도 선택시
document
    .querySelectorAll(".wrap-meat-beef input,.wrap-meat-beef-roasting-type input")
    .forEach((e) => {
        e.addEventListener("change", () => {
            const beefRoastingTime = getBeefRoastingTime();
            // 고기 굽기 시간 설정
            timer.setTime(beefRoastingTime[0]);
            timer.displayTime();
        });
    });

// 소고기 굽기정도 표시/비표시
document.getElementsByName("type1").forEach((e) => {
    e.addEventListener("change", (event) => {
        // 소고기를 선택했을시만 고기 익힘 정도를 표시/비표시
        document.querySelector(".wrap-beef-roasting-type").style.display =
            event.target.closest(".wrap-meat-beef") ? "block" : "none";
    });
});

/********************************************************************************
 * 메서드
 ********************************************************************************/
// 돼지고기 굽는 시간을 JSON으로부터 취득
let getPorkRoastingTime = function () {
    // 선택한 돼지고기 종류
    const selectedPorkValue = document.querySelector(
        'input[name="type1"]:checked'
    ).value;
    // 돼지고기 굽기시간
    return roastingTime.pork[selectedPorkValue].time;
};

// 소고기 굽는 시간을 JSON으로부터 취득
let getBeefRoastingTime = function () {
    // 선택한 소고기종류
    const selectedBeefValue = document.querySelector(
        'input[name="type1"]:checked'
    ).value;
    // 화면에서 현재 선택한 굽기정도
    const selectedBeefRoasting = document.querySelector(
        'input[name="type2"]:checked'
    ).value;
    // 소고기 굽기시간
    return roastingTime.beef[selectedBeefValue][selectedBeefRoasting].time;
};
