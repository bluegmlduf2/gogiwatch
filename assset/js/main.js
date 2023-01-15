import Timer from "./timer.js";

const timer = new Timer();
timer.initTime("0311");
timer.displayTime();

// 재생,정지버튼 클릭이벤트
document.getElementById("playpause").addEventListener("click", () => {
    timer.play();
    timer.displayTime();
});

// 리셋버튼
document.getElementById("reset").addEventListener("click", () => {
    debugger;
    timer.initTime("0311");
    timer.reset();
    timer.displayTime();
});
