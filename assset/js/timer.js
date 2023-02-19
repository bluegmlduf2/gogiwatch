import getMessageList from "./message.js";
class Timer {
    playpause = document.getElementById("playpause");
    display = document.getElementById("time_left");
    timerVisual = document.getElementById("timerVisual");
    gauge = document.querySelector(".bar_gauge");
    playing = false; // 재생상태 유무
    resetTime = null; // 리셋시간(HHMM) 저장용
    count = 0; // 현재시간을 초로 환산한 값
    countSum = 0; // 총굽기시간을 초로 환산한 값
    turnOutTimeArr = []; // 고기 뒤집기 시간

    constructor() {
        self = this;
    }
    // 시작
    play() {
        self.playing = true;
        self.playpause.innerHTML = `&#9208; ${getMessageList().pauseText}`;
        self.playpause.classList.remove("play");
        self.playpause.classList.add("stop");
        self.timerVisual.classList.add("on");
        self.countdown();
    }

    // 정지
    stop() {
        self.playing = false;
        self.playpause.innerHTML = `&#127830; ${getMessageList().startText}`;
        self.playpause.classList.remove("stop");
        self.playpause.classList.add("play");
        self.timerVisual.classList.remove("on");
    }

    // 리셋
    reset() {
        // 재생중일시 정지
        if (self.playing) {
            self.stop();
        }
        self.setTime(self.resetTime);
        self.setGuage();
    }

    // 타이머 동작
    countdown() {
        if (self.count == 0) {
            // 타이머 완료시
            self.playing = false;
            self.timerVisual.classList.add("complete"); // 완료이미지 표시
        } else if (self.playing) {
            // 타이머 동작시
            setTimeout(self.countdown, 100);
            self.alertTurnOutTime();
            self.progressGauge();
            self.count--;
        }
        self.displayTime();
    }

    // 타이머 시간 설정 (미입력시 00:00)
    setTime(time = "0000") {
        // 시간 초기화
        self.resetTime = time;
        self.count = self.getTimeToSeconds(time);
        self.countSum = self.count;
        // 완료 이미지 제거
        self.timerVisual.classList.remove("complete");
    }

    // 조리게이지 초기화
    setGuage() {
        // 기존 뒤집기 마크 삭제
        const existGuageTag = document.querySelectorAll(".ico_flip");
        existGuageTag.forEach((e) => {
            e.remove();
        });

        // 새로운 뒤집기 마크 추가
        self.turnOutTimeArr.forEach((time) => {
            const sec = self.getTimeToSeconds(time);
            const percentage = (sec / self.countSum) * 100;
            const gaugeTag = document.createElement("i");
            gaugeTag.setAttribute("class", "ico_flip");
            gaugeTag.style.right = `${percentage}%`;
            document.querySelector(".wrap_gauge").appendChild(gaugeTag);
        });

        // 조리 게이지 초기화
        self.gauge.style.right = "100%";
    }

    // 타이머 고기 뒤집기 시간 설정
    setTimeTurnOut(turnOutTimeArr) {
        self.turnOutTimeArr = turnOutTimeArr;
    }

    // 조리 게이지를 진행
    progressGauge() {
        const progressPercent = (self.count / self.countSum) * 100;
        self.gauge.style.right = `${progressPercent}%`;
    }

    // 고기 뒤집기 시간을 알림
    alertTurnOutTime() {
        // 고기뒤집기 시간일치 유무
        const isOkTurnOutTime = !!self.turnOutTimeArr.find(
            (e) => e === self.getCurrentTime(false)
        );
        // 고기뒤집을 시간이라면 표시
        // TODO console.warn 삭제예정
        if (isOkTurnOutTime) {
            console.warn("뒤집어요");
            console.warn(self.getCurrentTime(true));
        }
    }

    // 타이머 표시
    displayTime() {
        self.display.innerHTML = self.getCurrentTime(true);
    }

    // 현재시간을 취득
    // TRUE: MM:SS 형식취득
    // FALSE: MMSS 형식취득
    getCurrentTime(isWithColon) {
        let sec = Math.floor(self.count / 10);
        let min = Math.floor(sec / 60);
        sec -= min * 60;

        const minStr = String(min).padStart(2, "0");
        const secStr = String(sec).padStart(2, "0");

        return isWithColon ? `${minStr}:${secStr}` : minStr + secStr;
    }

    // MMSS 형식의 시간으로부터 초를 구한다
    getTimeToSeconds(time) {
        const MM = time.substring(0, 2);
        const SS = time.substring(2);
        return (MM * 60 + +SS) * 10; // MMSS를 SEC로 변환;
    }
}

export default Timer;
