const rewardMgr = require('../manager/rewardmanager');

class Lib_Response {
  constructor(res) {
    this.res = res;
  }

  // res.resp(JSON) 전송. 모든 API 응답의 단일 진입점
  async complete() {
    if (this.res.headersSent) {
      return;
    }

    await rewardMgr.rewardComplete(this.res);            
    this.res.send(JSON.stringify(this.res.resp));
  }

  // 일반 문자열 응답
  text(msg) {
    if (this.res.headersSent) {
      return;
    }
    this.res.send(msg);
  }

  // res.complete(), res.completeText(msg) 사용 가능하게 연결
  static attach(res) {
    const api = new Lib_Response(res);
    res.complete = () => api.complete();
    res.completeText = (msg) => api.text(msg);
  }
}

module.exports = Lib_Response;
