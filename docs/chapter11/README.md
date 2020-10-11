---
sidebar: auto
---

## chapter 11

## 동시성

### 78. 공유 중인 가변 데이터는 동기화해 사용하라

-   synchronized 키워드는 해당 메서드나 블록을 한번에 한 스레드씩 수행하도록 보장함
    -   한 객체가 일관된 상태를 가지고 생성, 객체에 접근하는 메서드는 lock을 걸고, 객체의 상태를 (필요하다면) 변화시킴
    -   제대로 사용한다면 어떤 메서드는 이 객체의 상태가 일관되지 않은 순간을 볼 수 없음
-   또한, 동기화 없이는 한 스레드가 만든 변화를 다른 스레드에서 확인하지 못할 수 있음 
    -   동기화는 스레드 사이의 안정적인 통신에 꼭 필요하다.

```java
pubic class stopThread {
  private static boolean stopRequested;

  private static synchronized void requestStop() { stopRequested = true; } // 쓰기 메소드
  private static synchronized boolean stopRequested() { return stopRequested; } // 읽기 메소드

}
```

-   쓰기 메소드와 읽기 메소드 모두가 동기화되지 않으면 동작이 보장되지 않는다.

-   속도가 더 빠른 대안 : volatile 한정자 (단 주의해서 사용해야 한다.)
-   배타적 수행과는 상관없지만 항상 가장 최근에 기록된 값을 읽게 됨을 보장함

```java
pubic class stopThread {
  private static volatile boolean stopRequested;
```

-   가변 데이터는 단일 스레드에서만 사용하도록 하고, 스레드 사이에 공유할 데이터로는 불변 데이터만 공유하거나 아무것도 공유하지 말자.

### 79. 과도한 동기화는 피하라

-   과도한 동기화는 성능을 떨어뜨리고, 교착상태에 빠뜨리고, 심지어 예측할 수 없는 동작을 낳기도 함
-   응답 불가와 안전 실패를 피하려면 동기화 메서드와 동기화 블록 안에서는 제어를 절대로 클라이언트에 양도하면 안 됨

-   기본 규칙 : 동기화 영역에서는 가능한 일을 적게 하기

    -   외계인 메서드는 동기화 블록 밖에서 호출하기
    -   동기화가 초래하는 진짜 비용은 락을 얻는데 드는 CPU 시간이 아니라 경쟁하느라 낭비하는 시간임

-   가변 클래스를 작성하려면

1.  동기화를 전혀 하지 말고, 그 클래스를 동시에 사용해야 하는 클래스가 외부에서 알아서 동기화하도록 (java.util)
2.  동기화를 내부에서 수행해서 스레드 안전한 클래스로 만들기 (java.util.concurrent)

-   StringBuilder는 동기화하지 않은 StringBuffer이다 (!)
-   스레드 안전한 java.util.Random은 동기화하지 않는 버전인 java.util.concurrent.ThreadLocalRandom으로 대체됨 (!!)

### 80. 스레드보다는 실행자, 태스크, 스트림을 애용하라

-   실행자(Executor) 프레임워크 : 인터페이스 기반의 유연한 태스크 실행 기능 (java.utl.concurrent)

```java
// 작업 큐 한 줄로 생성
ExecutorService exec = Executros.newSingleThreadExecutor();

// 이 실행자에 실행할 task 넘기기
exec.execute(runnable);

// 실행자를 우아하게 종료시키기
exec.shutdown();
```

-   Executor 서비스의 주요 기능들

1. 특정 태스크가 완료되기를 기다리기 (코드 79-2. get 메서드)
2. 태스크 모음 중 하나(invokeAny) 혹은 모든 태스크(invokeAll)가 완료되기를 기다림
3. 실행자 서비스가 종료하기를 기다림 (awaitTermination)
4. 완료된 태스크들의 결과를 차례로 받음 (ExecutorCompletionService)
5. 태스크를 특정 시간에 혹은 주기적으로 실행 (ScheduledThreadPoolExecutor)

-   큐를 2개 이상의 쓰레드가 처리하게 하고 싶다면 다른 정적 팩터리를 이용하여 다른 종류의 실행자 서비스(thread pool)을 생성하면 됨
    -   필요한 Executor 대부분은 java.util.concurrent.Executor의 정적 팩터리들을 이용해 생성 가능
-   작은 프로그램, 가벼운 서버라면 Executors.newCachedThreadPool
-   무거운 프로덕션 서버라면 스레드 개수를 고정한 Executors.newFixedThreadPool, 또는 완전히 통제할 수 있는 ThreadPoolExecutor

-   작업 큐를 손수 만들거나 스레드를 직접 다루는 것은 일반적으로 삼가야 함

    -   스레드를 직접 다루면 Thread가 작업 단위와 수행 메커니즘 역할을 모두 수행하게 됨
    -   Executor 프레임워크에서는 작업 단위(task)와 실행 메커니즘이 분리됨
        -   task에는 Runnable, Callable 이 있음
            -   Callable은 Runnable과 비슷하지만 값을 반환하고 임의의 예외를 던질 수 있음
        -   java 7~ : Fork-join task를 지원하도록 확장됨

-   자바 병렬 프로그래밍 책 참고.

### 81. wait, notify보다는 동시성 유틸리티를 애용하라

-   wait, notify는 올바르게 사용하기가 아주 까다로우니 고수준 동시성 유틸리티를 사용하자.
-   java.util.concurrent의 고수준 유틸리티 : 실행자 프레임워크, 동시성 컬렉션, 동기화 장치
    -   동시성 컬렉션 : List, Queue, Map과 같은 표준 컬렉션 인터페이스에 동시성을 가미해 구현한 고성능 컬렉션
        -   외부에서 락을 추가로 사용하면 오히려 속도가 느려짐
        -   Collections.synchronizedMap보다는 ConcurrentHashMap을 사용하는 것이 훨씬 좋음
        -   컬렉션 인터페이스 중 일부는 작업이 성공적으로 완료될 때까지 기다리도록 확장됨
            -   ex. BlockingQueue.take - 큐의 첫 원소를 꺼냄
                -   이 때 큐가 비었다면 새로운 원소가 추가될 때까지 기다림 (작업 큐로 사용하기에 적합)
                -   ThreadPoolExecutor를 포함한 대부분의 ExecutorService 구현체에서 이 BlockingQueue를 사용
    -   동기화 장치 : 스레드가 다른 스레드를 기다릴 수 있게 하여 서로 작업을 조율할 수 있게 해 줌
        -   ex. (사용 빈도) CountDownLatch, Semaphore >> CyclicBarrier, Exchanger / Phaser
-   시간 간격을 잴 때는 System.currentTimeMillis가 아닌 System.nanoTime을 사용하자. (!)
    -   더 정확하고 정밀하며 시스템의 실시간 시계의 시간 보정에 영향받지 않음
-   새로 짜는 코드라면 언제나 wait, notify가 아닌 동시성 유틸리티를 사용할 것

    -   하지만 레거시 코드를 읽기 위해서는 내용을 알아야겠죠?

-   wait : 스레드가 어떤 조건이 충족되기를 기다리게 할 때 사용
    -   wait은 반드시 대기 반복문 관용구를 사용하며, 반복문 밖에서는 절대로 호출하지 말자!

```java
// wait을 사용하는 표준 방식
synchronized (obj) {
  while (<조건이 충족되지 않았음>)
    obj.wait(); // 락을 놓고, 깨어나면 다시 잡는다

    ... // 조건이 충족됐을 때의 동작
}
```

-   notify : 스레드를 하나만 깨움
    -   notifyAll : 모든 스레드를 깨움 (일반적으로 이것을 사용)

### 82. 스레드 안전성 수준을 문서화하라

-   사용하는 쪽에서 어떻게 사용될지 모르므로 명확히 문서화해야 한다.

-   스레드 안전성 수준에 따른 나열

1. 불변 (immutable)
2. 무조건적 스레드 안전 (unconditionally thread-safe)
3. 조건부 스레드 안전 (conditionally thread-safe)
4. 스레드 안전하지 않음 (non thread-safe)
5. 스레드 적대적 (thread-hostile)

### 83. 지연 초기화는 신중히 사용하라

-   양날의 검

    -   클래스 혹은 인스턴스 생성 시의 초기화 비용은 줄지만 그 대신 지연 초기화하는 필드에 접근하는 비용은 커짐
    -   해당 필드를 사용하는 인스턴스의 비율이 낮은 반면, 그 필드를 초기화하는 비용이 크다면 제 역할
    -   대부분의 상황에서 일반적인 초기화가 지연 초기화보다 나음

```java
// 정적 필드용 지연 초기화 홀더 클래스 관용구
private static class FieldHolder {
  static final FieldType field = computeFieldValue();
}
private static FieldType getField() { return FieldHolder.field; }

// 인스턴스 필드 지연 초기화용 이중검사 관용구
private volatile FieldType field;

private FieldType getField() {
  FieldType result = field;
  if (result != null) { // 첫 번째 검사 (락 사용 X)
    return result;
  }

  synchronized(this) {
    if (field == null) // 두 번째 검사 (락 사용)
      field = computedFieldValue();
      return field;
  }
}
```

### 84. 프로그램의 동작을 스레드 스케줄러에 기대지 말라

-   OS마다 구체적인 스케쥴링 정책이 다를 수 있음
    -   정확성이나 성능이 스레드 스케쥴러에 따라 달라지는 프로그램이라면 다른 플랫폼에 이식하기 어려움
-   가장 좋은 방법 : 실행 가능한 스레드의 평균적인 수를 프로세서 수보다 지나치게 많아지지 않도록 하는 것
-   스레드는 당장 처리해야 할 작업이 없다면 실행되어서는 안 된다
    -   스레드 풀 크기를 적절히 설정하고, 작업은 짧게 유지
