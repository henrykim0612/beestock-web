function BeeComponents() {

  // arguments를 배열로 변경한다.
  const args = Array.prototype.slice.call(arguments);
  // 마지막 인자는 항상 콜백 함수이다.
  let callback = args.pop();
  // 모듈 이름은 배열 또는 문자열로 전달될 수 있다.
  let modules = (args[0] && typeof args[0] === 'string') ? args : args[0];

  // new를 강제화하는 패턴
  if (!(this instanceof BeeComponents)) {
    return new BeeComponents(modules, callback);
  }

  // 공통 사용 변수
  // this.prop1 = 'property 1';

  // this 객체에 모듈을 추가한다.
  // 모듈이 없거나, '*' 와일드 카드라면 모든 모듈을 사용한다.
  if (!modules || modules === '*' || modules[0] === '*') {
    modules = [];
    for (let module in BeeComponents.modules) {
      if (BeeComponents.modules.hasOwnProperty(module)) {
        modules.push(module);
      }
    }
  }

  for (let i = 0; i < modules.length; i++) {
    BeeComponents.modules[modules[i]](this);
  }
  // 콜백 함수를 실행한다.
  callback(this);
}

BeeComponents.prototype = {
  version: '1.0.0',
  author: 'Henry.Kim'
};

BeeComponents.modules = {};