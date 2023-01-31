import Timer from "./timer.js";
import roastingTime from "./roastingTime.js";

const timer = new Timer();
timer.setTime();
timer.displayTime();

/********************************************************************************
 * 이벤트 등록
 ********************************************************************************/
let btnStart = document.querySelector(".btn-start");
let btnClose = document.querySelector(".btn-close");
let timerArea = document.querySelector(".timer-area");
let alertModal = document.querySelector("#modal");

// 시작 버튼 클릭 시 타이머 등장
btnStart.addEventListener("click", () => {
    let btnValidation = document.querySelectorAll(
        'input[name="type1"]:checked'
    ).length;
    // 시작 버튼 유효성 검사
    if (btnValidation > 0) {
        timerArea.classList.add("on");
    } else {
        timerArea.classList.remove("on");
        // 알림팝업 열기
        openLayerPopup("항목을 선택해 주세요");
    }
});
// 임시 닫기 버튼
btnClose.addEventListener("click", () => {
    timerArea.classList.remove("on");
    timer.reset();
    timer.displayTime();
});
// 재생버튼 클릭이벤트
document.getElementById("playpause").addEventListener("click", () => {
    // 재생상태
    const isPlaying=timer.playing;
    
    // 재생상태에 따른 타이머 재생정지
    if (isPlaying) {
        // 재생정지 및 일시정지팝업표시
        timer.stop();
        openLayerPopup("일시정지",true);
    }else{
        // 재생
        timer.play();
        timer.displayTime();
    }
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
        timer.setTime(porkRoastingTime.rosatingPorkTimeSum);
        timer.setTimeTurnOut(porkRoastingTime.roastingPorkTurnOutTimeArr);
        timer.displayTime();
    });
});

// 소고기 고기종류나 굽기정도 선택시
document
    .querySelectorAll(
        ".wrap-meat-beef input,.wrap-meat-beef-roasting-type input"
    )
    .forEach((e) => {
        e.addEventListener("change", () => {
            const beefRoastingTime = getBeefRoastingTime();
            // 고기 굽기 시간 설정
            timer.setTime(beefRoastingTime.rosatingBeefTimeSum);
            timer.setTimeTurnOut(beefRoastingTime.roastingBeefTurnOutTimeArr);
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

// 알림창닫기
document.getElementById("modal").addEventListener("click", () => {
    // 알림팝업 닫기
    closeLayerPopup();
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
    // 돼지고기 굽기시간 배열
    const roastingPorkTime = roastingTime.pork[selectedPorkValue].time;
    // 돼지고기 뒤집기 시간
    const roastingPorkTurnOutTimeArr =
        getRoastingTurnOutTimeArr(roastingPorkTime);
    // 돼지고기 총 굽기시간
    let rosatingPorkTimeSum = getSumRoastingTime(roastingPorkTime);
    rosatingPorkTimeSum = converTimeSecToMin(rosatingPorkTimeSum);

    return {
        roastingPorkTurnOutTimeArr,
        rosatingPorkTimeSum,
    };
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
    const roastingBeefTime =
        roastingTime.beef[selectedBeefValue][selectedBeefRoasting].time;
    // 소고기 뒤집기 시간
    const roastingBeefTurnOutTimeArr =
        getRoastingTurnOutTimeArr(roastingBeefTime);
    // 소고기 총 굽기시간
    let rosatingBeefTimeSum = getSumRoastingTime(roastingBeefTime);
    rosatingBeefTimeSum = converTimeSecToMin(rosatingBeefTimeSum);

    return {
        roastingBeefTurnOutTimeArr,
        rosatingBeefTimeSum,
    };
};

// 굽기시간의 배열의 총합을 취득
let getSumRoastingTime = function (roastingArr) {
    // 배열을 분에서 초로 변환하여 총합을 구함
    const rosatingTimeSum = roastingArr.reduce((acc, curVal, i) => {
        const MM = Number(curVal.substring(0, 2));
        const SS = Number(curVal.substring(2));
        return acc + (MM * 60 + +SS);
    }, 0);
    return rosatingTimeSum;
};

// 고기 뒤집기 시간을 취득
let getRoastingTurnOutTimeArr = function (roastingArr) {
    return roastingArr.map((e, i, arr) => {
        const sumTimeSec = getSumRoastingTime(arr);
        const sumTimeSecSub = getSumRoastingTime(arr.slice(0, i + 1));
        return converTimeSecToMin(sumTimeSec - sumTimeSecSub);
    });
};

// 초로부터 분과 초를 다시 구한뒤 반환
let converTimeSecToMin = function (sumSec) {
    const min = parseInt(sumSec / 60);
    const sec = sumSec % 60;
    const mmss = String(min).padStart(2, "0") + String(sec).padStart(2, "0");
    return mmss;
};

/**
 * 알림창을 열기
 * 메세지가 존재하면 창을 표시한다
 * @param {String} message 알림 메세지
 * @param {Boolean} isStopLayer 정지화면 유무
 */
let openLayerPopup = function (message,isStopLayer = false) {
    // 알림창을 열기
    alertModal.classList.add("on");
    alertModal.querySelector("#modal-message").innerText = message;

    // 정지화면인 경우 배경을 빨간색으로 한다
    if (isStopLayer) {
        alertModal.classList.add("stop");
    }
};
/**
 * 알림창을 닫기
 */
let closeLayerPopup = function () {
    // 알림창을 닫기
    alertModal.classList.remove("on");
    alertModal.querySelector("#modal-message").innerText = "";

    const isStopLayer=alertModal.classList.contains("stop");
    // 정지화면인 경우 타이머를 재생
    if (isStopLayer) {
        // 재생
        timer.play();
        alertModal.classList.remove("stop");
    }
};
