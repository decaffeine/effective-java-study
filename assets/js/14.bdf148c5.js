(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{357:function(a,t,e){"use strict";e.r(t);var r=e(42),s=Object(r.a)({},(function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[e("h2",{attrs:{id:"chapter-12"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#chapter-12"}},[a._v("#")]),a._v(" chapter 12")]),a._v(" "),e("h2",{attrs:{id:"직렬화"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#직렬화"}},[a._v("#")]),a._v(" 직렬화")]),a._v(" "),e("ul",[e("li",[a._v("객체 직렬화란 : 자바가 객체를 바이트 스트림으로 인코딩하고(직렬화) 그 바이트스트림으로부터 다시 객체를 재구성(역직렬화)하는 메커니즘\n"),e("ul",[e("li",[a._v("직렬화된 객체는 다른 VM에 전송하거나 디스크에 저장한 후 나중에 역직렬화할 수 있음")])])])]),a._v(" "),e("h3",{attrs:{id:"_85-자바-직렬화의-대안을-찾으라"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_85-자바-직렬화의-대안을-찾으라"}},[a._v("#")]),a._v(" 85. 자바 직렬화의 대안을 찾으라")]),a._v(" "),e("ul",[e("li",[a._v("위험하다...")]),a._v(" "),e("li",[a._v("새로 설계하는 시스템이라면 JSON, 프로토콜 버퍼 같은 좋은 대안이 많다.")]),a._v(" "),e("li",[a._v("신뢰할 수 없는 데이터는 역직렬화하면 안 된다 (공격이 될 수 있다!)")])]),a._v(" "),e("h3",{attrs:{id:"_86-serializable을-구현할지는-신중히-결정하라"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_86-serializable을-구현할지는-신중히-결정하라"}},[a._v("#")]),a._v(" 86. Serializable을 구현할지는 신중히 결정하라")]),a._v(" "),e("ul",[e("li",[a._v("클래스 선언에 implements Serializable만 덧붙이면 되지만, 사실은 훨씬 더 복잡함\n"),e("ul",[e("li",[a._v("기본 직렬화 형태에서는 클래스의 private, package-private 인스턴스 필드들마저 API로 공개되는 꼴이 된다.")]),a._v(" "),e("li",[a._v("버전이 변경될 때마다 기존 버전과의 호환성(역직렬화 가능 여부) 고려해야 함")])])])]),a._v(" "),e("h3",{attrs:{id:"_87-커스텀-직렬화-형태를-고려해보라"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_87-커스텀-직렬화-형태를-고려해보라"}},[a._v("#")]),a._v(" 87. 커스텀 직렬화 형태를 고려해보라")]),a._v(" "),e("ul",[e("li",[a._v("객체의 물리적 표현과 논리적 내용이 같다면 기본 직렬화 형태라도 무방")]),a._v(" "),e("li",[a._v("그렇지 않다면 커스텀 직렬화 형태를 고려하기")])]),a._v(" "),e("h3",{attrs:{id:"_88-readobject-메서드는-방어적으로-작성하라"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_88-readobject-메서드는-방어적으로-작성하라"}},[a._v("#")]),a._v(" 88. readObject 메서드는 방어적으로 작성하라")]),a._v(" "),e("ul",[e("li",[a._v("readObject 메서드는 매개변수로 바이트 스트림을 받는, 실질적으로는 또 다른 생성자이기 때문에 방어적으로 작성해야 함")])]),a._v(" "),e("h3",{attrs:{id:"_89-인스턴스-수를-통제해야-한다면-readresolve보다는-열거-타입을-사용하라"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_89-인스턴스-수를-통제해야-한다면-readresolve보다는-열거-타입을-사용하라"}},[a._v("#")]),a._v(" 89. 인스턴스 수를 통제해야 한다면 readResolve보다는 열거 타입을 사용하라")]),a._v(" "),e("h3",{attrs:{id:"_90-직렬화된-인스턴스-대신-직렬화-프록시-사용을-검토하라"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_90-직렬화된-인스턴스-대신-직렬화-프록시-사용을-검토하라"}},[a._v("#")]),a._v(" 90. 직렬화된 인스턴스 대신 직렬화 프록시 사용을 검토하라")])])}),[],!1,null,null,null);t.default=s.exports}}]);