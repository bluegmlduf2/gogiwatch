import getMessageList from "./message.js";
class Timer {
    playpause = document.getElementById("playpause");
    display = document.getElementById("time_left");
    playing = false; // 재생상태 유무
    resetTime = null; // 리셋시간 저장용
    count = 0; // 현재시간을 초로 환산한 값
    turnOutTimeArr = []; // 고기 뒤집기 시간
    
    constructor() {
        self = this;
    }

    // 시작
    play() {
        self.playing=true;
        self.playpause.innerHTML = `&#9208; ${getMessageList().pauseText}`;
        self.playpause.classList.remove("play");
        self.playpause.classList.add("stop");
        self.countdown();
    }

    // 정지
    stop() {
        self.playing=false;
        self.playpause.innerHTML = `&#9208; ${getMessageList().startText}`;
        self.playpause.classList.remove("stop");
        self.playpause.classList.add("play");
    }

    // 리셋
    reset() {
        // 재생중일시 정지
        if (self.playing) {
            self.playing = false;
            self.playpause.innerHTML = `&#9208; ${getMessageList().startText}`;
            self.playpause.classList.remove("stop");
            self.playpause.classList.add("play");
        }
        self.setTime(self.resetTime);
    }

    // 타이머 동작
    countdown() {
        if (self.count == 0) {
            self.playing = false;
        } else if (self.playing) {
            setTimeout(self.countdown, 100);
            self.alertTurnOutTime();
            self.count--;
        }
        self.displayTime();
    }

    // 타이머 시간 설정 (미입력시 00:00)
    setTime(time = "0000") {
        self.resetTime = time;
        const MM = time.substring(0, 2);
        const SS = time.substring(2);
        self.count = (MM * 60 + +SS) * 10; // MMSS를 SEC로 변환;
    }

    // 타이머 고기 뒤집기 시간 설정
    setTimeTurnOut(turnOutTimeArr) {
        self.turnOutTimeArr = turnOutTimeArr;
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
        };
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
}

export default Timer;
