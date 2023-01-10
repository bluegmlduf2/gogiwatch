function Timer(duration, element) {
    var self = this;
    this.duration = duration; // 타이머의 시간
    this.element = element; // 타이머 메인 객체
    this.running = false; // 타이머 동작 여부
    this.startTime = null;
    this.diff = null;
    this.isPaused = false;

    // 타이머 제어를 위한 객체
    this.els = {
        ticker: document.getElementById("ticker"), // 타이머에 따라 증가하는 배경화면 수치
        seconds: document.getElementById("seconds"), // 화면에 표시되는 초
    };

    // 타이머 남은 시간 (초기설정시에는 설정시간)
    this.remainingSeconds = self.els.seconds.textContent = self.duration / 1000;

    // 화면 모양 변경
    document.getElementById("toggle").addEventListener("click", function () {
        var cl = "countdown--wide";
        if (self.element.classList.contains(cl)) {
            self.element.classList.remove(cl);
        } else {
            self.element.classList.add(cl);
        }
    });

    // 재시작
    document.getElementById("reset").addEventListener("click", function () {
        self.reset();
    });

    // 모바일에서 화면을 아래로 내리면 타이머 시간이 증가하거나 줄어든다
    var hammerHandler = new Hammer(this.element);
    hammerHandler.get("pan").set({ direction: Hammer.DIRECTION_VERTICAL });
    hammerHandler.on("panup pandown", function (ev) {
        if (!self.running) {
            if (
                ev.direction === Hammer.DIRECTION_UP &&
                self.duration < 999000
            ) {
                self.setDuration(self.duration + 1000);
            } else if (
                ev.direction === Hammer.DIRECTION_DOWN &&
                self.duration > 0
            ) {
                self.setDuration(self.duration - 1000);
            }
        }
    });

    // 화면을 탭할 경우 시작,종료된다
    hammerHandler.on("tap", function () {
        if (self.running) {
            self.stop();
        } else {
            self.start();
        }
    });
}

// 시작
Timer.prototype.start = function () {
    var self = this;
    this.running = true;

    // 타이머의 시간이 줄어드는 애니메이션을 그리는 메서드
    // requestAnimationFrame의 콜백메서드는 현재의 timestamp를 기본 매개변수로 전달한다
    function draw(now) {
        // FIXME 미묘하게 시간이 안맞음
        // 타이머 정지후 재시작시
        if (self.isPaused) {
            self.isPaused = false;
            self.startTime = now - self.startTime;
        }
        if (!self.startTime) self.startTime = now; // 시작시간을 현재시간으로 설정
        self.diff = now - self.startTime; // 현재시간 - 시작시간 = 경과시간(증가함)
        var newSeconds = Math.ceil((self.duration - self.diff) / 1000);

        // 경과시간이 타이머 설정시간보다 작은 경우 계속해서 재귀호출
        if (self.diff <= self.duration) {
            self.els.ticker.style.height =
                100 - (self.diff / self.duration) * 100 + "%";

            // 타이머 남은시간에 갱신
            if (newSeconds != self.remainingSeconds) {
                self.els.seconds.textContent = newSeconds;
                remainingSeconds = newSeconds;
            }

            // draw 콜백메서드를 1초에 60번 재귀호출한다 (setInterval보다 훨씬 부드러운 동작제공)
            self.frameReq = window.requestAnimationFrame(draw);
        } else {
            // 재귀호출을 중지
            self.isPaused = false;
            self.els.seconds.textContent = 0;
            self.els.ticker.style.height = "0%";
            self.element.classList.add("countdown--ended");
        }
    }
    // 애니메이션 메서드 최초 호출
    self.frameReq = window.requestAnimationFrame(draw);
};

// 정지
Timer.prototype.stop = function () {
    this.running = false;
    this.isPaused = true;
    window.cancelAnimationFrame(this.frameReq);
};

// FIXME 수정필요
// 재시작
Timer.prototype.reset = function () {
    this.running = false;
    this.isPaused = false;
    window.cancelAnimationFrame(this.frameReq);
    this.els.seconds.textContent = this.duration / 1000;
    this.els.ticker.style.height = null;
    this.element.classList.remove("countdown--ended");
};

// 타이머의 시간 설정
Timer.prototype.setDuration = function (duration) {
    this.duration = duration;
    this.els.seconds.textContent = this.duration / 1000;
};

var timer = new Timer(10000, document.getElementById("countdown"));
//timer.start();
