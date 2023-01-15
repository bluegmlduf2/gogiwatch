class Timer {
    playpause = document.getElementById("playpause");
    display = document.getElementById("time_left");
    playing = false; // 재생상태 유무
    resetTime = null; // 리셋시간 저장용
    count = 0; // 현재시간을 초로 환산한 값

    constructor() {
        self = this;
    }

    // 시작,정지
    play() {
        if (self.playing) {
            self.playing = false;
            self.playpause.innerHTML = "▶";
        } else if (!self.playing) {
            self.playing = true;
            self.playpause.innerHTML = "‖";
        }
        self.countdown();
    }

    // 리셋
    reset() {
        // 재생중일시 정지
        if (self.playing) {
            self.playing = false;
            self.playpause.innerHTML = "▶";
        }
        self.setTime(self.resetTime);
    }

    // 타이머 동작
    countdown() {
        if (self.count == 0) {
            self.playing = false;
        } else if (self.playing) {
            setTimeout(self.countdown, 100);
            self.count--;
        }
        self.displayTime();
    }

    // 타이머 시간초기화 (미입력시 00:00)
    setTime(time = "0000") {
        self.resetTime = time;
        const MM = time.substring(0, 2);
        const SS = time.substring(2);
        self.count = (MM * 60 + +SS) * 10; // MMSS를 SEC로 변환;
    }

    // 타이머 표시
    displayTime() {
        let sec = Math.floor(self.count / 10);
        let mins = Math.floor(sec / 60);
        sec -= mins * 60;

        self.display.innerHTML =
            self.LeadingZero(mins) + ":" + self.LeadingZero(sec);
    }

    // LPAD 00
    LeadingZero(Time) {
        return Time < 10 ? "0" + Time : Time;
    }
}

export default Timer;
