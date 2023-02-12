// 국가별 메세지 리스트
const message = {
    ko: {
        selectItem:"항목을 선택해주세요.", 
        stop:"불은 껐나요?<br> 고기가 타고 있어요ㅠㅠ", 
        close:"타이머를 종료하시겠습니까?", 
        reset:"타이머를 재시작하시겠습니까?",
        startText:"굽기 시작",
        pauseText:"일시 정지",
    },
    en: { 
        selectItem:"Please select an item.", 
        stop:"Did you turn off the fire?<br> The meat is burning.", 
        close:"Do you want to exit the timer?", 
        reset:"Do you want to restart the timer?",
        startText:"Start", 
        pauseText:"Pause",
    },
    jp: {
        selectItem:"項目を選択してください。", 
        stop:"火を消しました？<br> お肉が焦げてしまいます。", 
        close:"タイマーを終了しますか？", 
        reset:"タイマーをリセットしますか？",
        startText:"スタート",
        pauseText:"一時停止",
    }
};

// 현재 접속한 국가에 따라 알맞은 메세지를 보여준다
let getMessageList = function () {
    const url = document.URL;
    let messageList;
    switch (true) {
        case url.includes("ko"):
            messageList = message.ko;
            break;
        case url.includes("ja"):
            messageList = message.jp;
            break;
        case url.includes("en"):
            messageList = message.en;
            break;
        default:
            break;
    }
    return messageList;
};

export default getMessageList;