import Timer from "./timer.js";
import roastingTime from "./roastingTime.js";
import getMessageList from "./message.js";

/********************************************************************************
 * 클래스 초기화
 ********************************************************************************/
const timer = new Timer();
const noSleep = new NoSleep();

/********************************************************************************
 * 이벤트 등록
 ********************************************************************************/
const btnStart = document.querySelector(".btn-start");
const btnClose = document.querySelector(".ggwc_btn.close");
const selectLanguage = document.querySelector("#language");
const mainArea = document.querySelector(".main-area");
const timerArea = document.querySelector(".timer-area");
const alertModal = document.querySelector("#modal");
const modalMessage = alertModal.querySelector("#modal-message");
let isConfirmStatus = ""; // 현재 열린 확인창의 종류
let isWakeLockEnabled = false; // 현재 브라우저의 슬립모드

// 시작 버튼 클릭 시 타이머 등장
btnStart.addEventListener("click", () => {
    let btnValidation = document.querySelectorAll(
        'input[name="type1"]:checked'
    ).length;
    // 시작 버튼 유효성 검사
    if (btnValidation > 0) {
        mainArea.classList.add("on");
        timerArea.classList.add("on");
        enableNoSleep();
    } else {
        mainArea.classList.remove("on");
        timerArea.classList.remove("on");
        // 알림팝업 열기
        openLayerPopup(getMessageList().selectItem);
    }
});
// 임시 닫기 버튼
btnClose.addEventListener("click", () => {
    openLayerPopup(getMessageList().close, "confirm-close");
});
// 화면 최초 로드시 언어선택 셀렉트박스 초기화
window.addEventListener('load',()=>{
    const url = document.URL;
    switch (true) {
        case url.includes("ko"):
            selectLanguage.value="ko";
            break;
        case url.includes("ja"):
            selectLanguage.value="ja";
            break;
        case url.includes("en"):
            selectLanguage.value="en";
            break;
    }
})
// 언어선택 셀렉트박스 선택시 홰당 언어페이지로 이동
selectLanguage.addEventListener("change", (e) => {
    const selectedItem = e.target.value;
    location.href=location.href.replace(/ko|ja|en/g , selectedItem)
});
// 재생버튼 클릭이벤트
document.getElementById("playpause").addEventListener("click", () => {
    // 재생상태
    const isPlaying = timer.playing;

    // 재생상태에 따른 타이머 재생정지
    if (isPlaying) {
        // 재생정지 및 일시정지팝업표시
        //timer.stop();
        openLayerPopup(getMessageList().stop, "stop");
    } else {
        // 재생
        timer.play();
        timer.displayTime();
    }
});

// 리셋버튼
document.getElementById("reset").addEventListener("click", () => {
    openLayerPopup(getMessageList().reset, "confirm-reset");
});

// 돼지고기 고기종류 선택
document.querySelectorAll(".wrap-meat-pork input").forEach((e) => {
    e.addEventListener("change", () => {
        const porkRoastingTime = getPorkRoastingTime();
        // 고기 굽기 시간 설정
        timer.setTime(porkRoastingTime.rosatingPorkTimeSum);
        timer.setTimeTurnOut(porkRoastingTime.roastingPorkTurnOutTimeArr);
        timer.setGuage();
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
            timer.setGuage();
            timer.displayTime();
        });
    });

// 소고기 굽기정도 표시/비표시
document.getElementsByName("type1").forEach((e) => {
    e.addEventListener("change", (event) => {
        // 소고기를 선택했을시만 고기 익힘 정도를 표시/비표시
        // document.querySelector(".wrap-beef-roasting-type").style.display =
        //     event.target.closest(".wrap-meat-beef") ? "block" : "none";
        if (event.target.closest(".wrap-meat-beef")) {
            document.querySelector(".wrap-beef-roasting-type").style.display =
                "block";
            mainArea.classList.remove("on");
        } else {
            document.querySelector(".wrap-beef-roasting-type").style.display =
                "none";
            mainArea.classList.add("on");
        }
    });
});

// 알림창 닫기
document.getElementById("modal").addEventListener("click", () => {
    const isStopLayer = alertModal.classList.contains("stop");
    if (isStopLayer) {
        // 정지알림창 닫기
        closeLayerPopup("stop");
    } else {
        // 일반알림창 닫기
        closeLayerPopup();
    }
});
// 알람창 확인버튼
document.getElementById("modal-ok").addEventListener("click", () => {
    // 알림팝업 확인
    closeLayerPopup("confirm-ok");
});
// 알람창 취소버튼
document.getElementById("modal-cancel").addEventListener("click", () => {
    // 알림팝업 취소
    closeLayerPopup("confirm-close");
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

// 알림창을 열기
let openLayerPopup = function (message, status) {
    // 알림창의 메세지 설정및 표시
    modalMessage.innerHTML = message;
    alertModal.classList.add("on");
    isConfirmStatus = "";
    isConfirmStatus = status;

    // 타이머 일시정지
    timer.stop();

    // 알림종류에 따라서 알림창을 설정
    switch (status) {
        // 정지화면인 경우 배경을 빨간색으로 한다
        case "stop":
            alertModal.classList.add("stop");
            break;
        case "confirm-close":
            // 타이머 화면 종료 확인창
            alertModal.classList.add("confirm");
            break;
        case "confirm-reset":
            // 재시작 확인창
            alertModal.classList.add("confirm");
            break;
    }
};

// 알림창을 닫기
let closeLayerPopup = function (status) {
    // 알림창을 닫기
    modalMessage.innerHTML = "";
    alertModal.classList.remove("on", "confirm");
    document.querySelector(".wrap-beef-roasting-type").style.display = "none";
    document.querySelectorAll('input[name="type1"]').forEach((e) => {
        e.checked = false;
    });
    // 알림종류에 닫기 후 처리를 다르게 한다
    switch (status) {
        case "stop":
            // 정지화면
            // 타이머 시작
            timer.play();
            alertModal.classList.remove("stop");
            break;
        case "confirm-ok":
            // 확인창에서 확인버튼
            if (isConfirmStatus === "confirm-close") {
                // 닫기
                timerArea.classList.remove("on", "confirm");
                disabledNoSleep();
            } else if (isConfirmStatus === "confirm-reset") {
                // 리셋버튼
                timer.reset();
                timer.displayTime();
            }
            break;
        case "confirm-cancel":
            // 확인창에서 취소버튼
            timerArea.classList.remove("confirm");
            break;
    }
};
// 노슬립모드 시작
let enableNoSleep = function () {
    if (!isWakeLockEnabled) {
        noSleep.enable();
        isWakeLockEnabled = true;
    }
};
// 노슬립모드 종료
let disabledNoSleep = function () {
    noSleep.disable();
    isWakeLockEnabled = false;
};
