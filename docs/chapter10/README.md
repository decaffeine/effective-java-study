---
sidebar: auto
---

## chapter 10

## 예외

### 69. 예외는 진짜 예외 상황에만 사용하라

```java
try {
  int i = 0;
  while (true)
    range[i++].climb();
} catch (ArrayIndexOutOfBoundsException e) {
}

```

-   이 코드의 의도 : JVM은 배열에 접근할 때마다 경계를 넘는지 검사하고, 일반적인 반복문도 배열 경계에 도달하면 종료
    -   이 검사를 반복문에도 명시하면 같은 일이 중복되므로 하나를 줄여서 성능을 높여보려 한 것
    -   하지만 잘못된 추론
-   예외를 활용하여 다른 방향으로 사용하려고 하면 안 된다 (일상적인 제어 흐름 - 예외를 마주쳐서 작업을 종료하는 동작 등)
-   제목대로, 진짜 예외 상황에만 사용한다

-   잘 설계된 API라면 클라이언트가 정상적인 제어 흐름에서 예외를 사용할 일이 없게 해야 함

-   상태 검사 대신 : 올바르지 않은 상태일 때 빈 옵셔널이나 null과 같은 값을 반환하기
    1. 외부 동기화 없이 여러 스레드가 동시 접근 가능 / 외부 요인으로 상태 변경이 가능하다면 옵셔널이나 특정 값 사용
    2. 성능이 중요한 상황에서 상태 검사 메서드가 상태 의존적 메소드의 작업 일부를 중복 수행한다면 옵셔널이나 특정 값 사용
    3. 다른 모든 경우엔 상태 검사 메소드 방식이 좀 더 나음

### 70. 복구할 수 있는 상황에는 검사 예외를, 프로그래밍 오류에는 런타임 예외를 사용하라

-   호출하는 쪽에서 복구하리라 여겨지는 상황이라면 Checked Exception
    -   메소드 선언에 포함된 Checked Exception은 그 메서드를 호출했을 때 유력한 결과임을 API 사용자에게 알려주는 것임
-   프로그래밍 오류를 나타낼 때는 Runtime Exception (Unchecked Exception의 일부)

    -   런타임 에러의 대부분은 전제조건(API 명세에 기록된 제약)을 지키지 못했을 때 발생

-   다만, 복구할 수 있는 상황인지 프로그래밍 오류인지가 항상 명확히 구분되지는 않음

-   예외 역시 어떤 메서드라도 정의할 수 있는 완벽한 객체이다!! 잊지 말 것!
    -   예외의 메서드는 그 예외를 일으킨 상황에 대한 정보를 코드 형태로 전달할 때
        -   이런 코드가 없다면 오류 메시지를 파싱해야 하겠지... 그것보단 코드가 좋다...

### 71. 필요 없는 검사 예외 사용은 피하라

-   과하게 사용하면 쓰기 불편한 API가 됨
-   Checked Exception을 던지는 메소드는 스트림 안에서 직접 사용할 수 없음

-   Checked Exception을 회피하는 가장 쉬운 방법은 적절한 결과 타입을 담은 옵셔널 반환
    -   단점 : 예외가 발생한 이유를 알려주는 부가 정보를 담을 수 없음
    -   또 다른 방법 : Chekced Exception을 던지는 메소드를 2개로 쪼개 Unchecked exception으로 바꾸기

```java
// BEFORE
try {
  obj.action(args);
} catch (TheCheckedException e) {
  ... // 예외 상황에 대처
  }
// AFTER
if (obj.actionPermitted(args)) {
  obj.action(args);
} else {
  ... // 예외 상황에 대처
}
```

### 72. 표준 예외를 사용하라

-   표준 예외를 사용하면 다른 사람이 여러분의 API를 익히고 사용하기 쉬워짐
-   자주 쓰이는 표준 예외들
    -   IllegalArgumentException
    -   IllegalStateException
    -   NullPointerException
    -   IndexOutOfBoundsException
    -   ConcurrentModifiationException
    -   UnspportedOperationException

### 73. 추상화 수준에 맞는 예외를 던지라

-   예외 번역(exception translation) : 상위 계층에서 저수준 예외를 잡아 자신의 추상화 수준에 맞는 예외로 바꿔 던지기

```java
try {
  ...
} catch (LowerLevelException e) {
  throw new HigherLevelException(...);
}
```

-   Item 20. AbstractSequentialList에서 수행하는 예외 번역의 예

```java
public E get(int index) {
  ListIterator<E> i = listIterator(index);
  try {
      return i.next();
  } catch (NoSuchElementException e) {
    throw new IndexOutOfBoundsException("Index: " + index);
  }
}
```

-   예외 번역시, 저수준 예외가 디버깅에 도움이 된다면 예외 연쇠(exception chaining)을 사용하는 게 좋음
    -   문제의 근본 원인(cause)인 저수준 예외를 고수준 예외에 실어 보내는 방식

```java
try {
  ...
} catch (LowerLevelException cause) {
  throw new HigherLevelException(cause);
}
```

-   가능하다면 저수준 메서드가 반드시 성공하도록 하여 아래 계층에서는 예외가 발생하지 않도록 하는 것이 최선
    -   차선책 : 아래 계층에서의 예외를 피할 수 없다면, 상위 계층해서 조용히 처리하여 문제를 API 호출자에게까지 전파하지 않기
        -   다만 Logging을 하자!

### 74. 메서드가 던지는 모든 예외를 문서화하라

-   Checked Exception의 경우는 `@throws` 태그를 사용하여 정확히 문서화하기
-   Unchecked Exception은 throws 목록에 넣지 말기
-   한 클래스에 정의된 많은 메서드가 같은 이유로 예외를 던진다면 클래스 설명에 추가하는 방법도 있음

### 75. 예외의 상세 메시지에 실패 관련 정보를 담으라

-   실패 순간을 포착하려면 발생한 예외에 관여된 모든 매개변수와 필드의 값을 실패 메시지에 담아야 (제발ㅠㅠ)
    -   IndexOutOfBoundsException이라면 : 범위의 최소값, 최대값, 그 범위를 벗어난 인덱스의 값
-   예외의 상세 메시지와 최종 사용자에게 보여줄 오류 메시지는 다르다 !!
-   실패를 적절히 포착하려면 : 필요한 정보를 예외 생성자에서 모두 받아서 상세 메시지까지 미리 생성해놓는 방법도 괜찮다

```java
  public indexOutOfBoundsException(int lowerBound, int upperBound, int index) { ...
```

### 76. 가능한 한 실패 원자적으로 만들라

-   호출된 메서드가 실패하더라도 해당 객체는 메서드 호출 전 상태를 유지해야 한다
    -   실패 원자적(failure-atomic)
-   실패 원자적으로 만드는 방법
    1. 불변 객체로 설계하기
    2. 실패할 가능성이 있는 모든 코드를, 객체의 상태를 바꾸는 코드보다 앞에 배치
    3. 객체의 임시 복사본에서 작업을 수행한 후, 작업이 완료되면 원래 객체와 교체
    4. 작업 도중 발생하는 실패를 가로채는 복구 코드를 작성 (자주 쓰이지 X)

### 77. 예외를 무시하지 말라

-   이렇게 짜면 곤란하다

```java
try {
  ...
} catch (SomeExcpetion e) {
}
```

-   가끔 무시해야 할 때도 있지만(FileInputStream처럼) 그럴 때에는 예외 변수의 이름이라도 ignored로 바꿔 주자

```java
try {

} catch (ExceptionException ignored) {
  ...
}
```
