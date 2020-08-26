---
sidebar: auto
---

## chapter 06 열거 타입과 애너테이션  

### 34. int 상수 대신 열거 타입을 사용하라   
- Enum이 없을 때에는 이런 슬픈 패턴을 썼다. Enum 짱짱
- 가장 단순한 Enum  
```java
public enum Apple { FUJI, PIPPIN, GRANNY_SMITH }
public enum Orange { NAVEL, TEMPLE, BLOOD }
```
- Enum 자체는 클래스이며, 상수 하나당 자신의 인스턴스를 하나씩 만들어 public static final 필드로 공개
  - 밖에서 접근할 수 있는 생성자를 제공하지 않으므로 사실상 final
  - 클라이언트가 인스턴스를 직접 생성/확장할 수 없으니 인스턴스들은 딱 하나씩만 존재함 (singleton)
  - Object 메서드들을 높은 품질로 구현해둠, Comparable과 Serializable도 구현  
- 임의의 메서드나 필드를 추가할 수 있다.    
- 열거 타입은 근본적으로 불변 -> 모든 필드는 final이어야 함  

- 널리 쓰이는 열거 타입은 톱레벨 클래스로 만들고, 특정 톱레벨 클래스에서만 쓰인다면 해당 클래스의 멤버 클래스로 만듬
  - 마음의 저항감이 ... ㅠㅠ

- 열거 타입에서 상수별로 다르게 동작하는 코드를 구현하는 법
```java
public enum Operation {
  PLUS {public double apply(double x, double y){ return x + y; }},
  MINUS {public double apply(double x, double y){ return x - y; }},
  TIMES {public double apply(double x, double y){ return x * y; }},
  DIVIDE {public double apply(double x, double y){ return x / y; }};
  public abstract double apply(double x, double y);
}
```  

- Enum에는 상수 *이름* 을 입력받아 그 이름에 해당하는 상수를 반환해주는 valueOf(String) 메서드가 자동 생성됨  

```java
Operation op1 = Operation.valueOf("PLUS") // 위의 PLUS가 반환됨
Operation op2 = Operation.valueOf("MINUS") // 위의 MINUS가 반환*
``
- Enum의 toString을 재정의하려면 toString이 반환하는 문자열을 해당 Enum으로 변환해주는 fromString 메서드도 함께 제공하는 것을 고려

- 열거 타입을 언제 쓸까?  
  - 필요한 원소를 컴파일타임에 다 알 수 있는 상수 집합이라면 항상 열거 타입을 사용  
  - 열거 타입에 정의된 상수 개수가 영원히 고정불변일 필요는 없음  

### 35. ordinal 메서드 대신 인스턴스 필드를 사용하라  
- 이런 게 있는지 몰랐다 ...
- 모든 Enum은 해당 상수가 그 Enum에서 몇 번째 위치인지를 반환하는 ordinal이라는 메소드를 사용

- 이러시면 안됩니다  
```java
public Enum Ensemble {
  SOLO, DUET, TRIO, QUARTET, QUINTET,
  SEXTET, SEPTET, OCTET, NONET, DECTET;

  public int numberOfMuisicians() { return ordinal() + 1; }
}
```
- 그냥 인스턴스 필드에 저장하세요
```java
public Enum Ensemble {
  SOLO(1), DUET(2), ...
  private final int numberOfMuisicians;
```

- ordinal은 EnumSet과 EnumMap같이 Enum 기반 범용 자료구조에 쓸 목적으로 설계되었다고 한다  


### 36. 비트 필드 대신 EnumSet을 사용하라   
- EnumSet이라는 자료구조도 있다.
  - Enum 상수의 값으로 구성된 집합을 효과적으로 표현
```java
EnumSet.of(Style.BOLD, Style.ITALIC); //집합 생석을 위한 정적 팩터리
```
- 불변 EnumSet을 만들 수는 없지만 Collections.unmodifiableSet으로 감싸서 사용은 가능  


### 37. ordinal 인덱싱 대신 EnumMap을 사용하라  
- EnumMap : Enum을 키로 사용하도록 설계한 아주 빠른 Map 구현체  
- 다차원 관계는 EnumMap<..., EnumMap<..>>으로 표현  


### 38. 확장할 수 있는 열거 타입이 필요하면 인터페이스를 사용하라  
- 대부분 상황에서 Enum을 확장하는 것은 좋지 않은 생각임
- 하지만 필요할 때가 있다면...
  - 기본 아이디어 : Enum이 임의의 인터페이스를 구현할 수 있음을 이용  
```java
public interface Operation {
  double apply (double x, double y);
}

public enum BasicOperation implements Operation {
  PLUS("+") {
    public double apply(double x, double y) { return x+y; }
  },
  ...
}

public enum ExtendedOperation implements Operation {
  EXP("^") {
    public double apply(double x, double y) { return Math.pow(x,y); }
  },
  ...
}
```  

### 39. 명명 패턴보다 애너테이션을 사용하라  
- 애너테이션이 나오기 전에는 naming pattern을 이용하였다
  - 예시 : Junit 3은 테스트 메서드 이름을 "test"로 시작하게 하였다
    - 단점 : 실수로 tset어쩌구로 이름을 지으면 그냥 무시해버리게 된다...

- Test라는 이름의 애너테이션 만들기  
```java  
@Retention(RetentionPolicy.RUNTIME) // 이 애너태이션이 런타임에도 유지되어야 함
@Target(ElementType.METHOD)         // 요것은 메서드에 붙이는 애너테이션이다
public @interface test {
}
```
- Test가 달린 것만 실행하도록 해보자  
```java
public class Sample {
  @Test public static void m1() {}
  public static void m2() {}
    ...
  @Test public void m5() {}
}
public class RunTests {
  public static void main(String[] args) throws Exception {
    ...
    Class<?> testClass = Class.forName(args[0]);
    for (Method m : testClass.getDeclaredMethods()) {
      if (m.isAnnotationPresent(Test.class)) {
        ...
        m.invoke(null);
      }
    }
  }
}
```

- 특정 예외를 던져야만 성공하는 테스트를 위한 애너테이션
```java
@Retention(RetentionPolicy.RUNTIME) // 이 애너태이션이 런타임에도 유지되어야 함
@Target(ElementType.METHOD)         // 요것은 메서드에 붙이는 애너테이션이다
public @interface ExceptionTest {
  class<? extends Throwable> value(); //Throwable을 확장한 클래스의 Class 객체!!
}
```
```java
public class Sample2 {
  @ExceptionTest(ArithmeticException.class)
  public static void m1() {}

  @ExceptionTest(ArithmeticException.class)
  public static void m1() {}
    ...  

}

...
// 사용 예시
if (m.isAnnotationPresent(ExceptionTest.class)) {
  try {

  } catch (InvocationTargetException wrappedEx) {
    Throwable exc = wrappedEx.getCause();
    Class<? extends Throwable> excType = m.getAnnotation(ExceptionTest.class).value();
    if (excType.isInstance(exc)) passed++;
    ...
  }
}
```

- 배열 매개변수를 받는 애너테이션도 만들 수 있음
- 반복 가능 애너테이션도 만들 수 있음 (컨테이너 애너테이션을 따로 써야 하므로 처리에 주의)


### 40. @Override 애너테이션을 일관되게 사용하라  
- 애너테이션을 만들 일은 별로 없겠지만 요것은 코딩하면서 엄청나게 많이 마주칠 것이다

```java
public class Bigram {
  ...
  public boolean equals(Bigram b) {....} // 이게 아니다

  @Override public boolean equals(Object o) {} //이거다!
}
```
- 예시 : equals를 재정의하려고 했지만 오버로딩해버렸다 (매개변수를 Object가 아닌 자기 자신으로 함)  
  - @Override를 달고 컴파일하면 오류가 발생하여 바로 알아차릴 수 있다  
- 상의 클래스의 메서드를 재정의하려는 모든 메서드에 @Override 를 달자  

### 41. 정의하려는 것이 타입이라면 마커 인터페이스를 사용하라  
- 아무 메서드도 담고 있지 않고, 단지 자신을 구현하는 클래스가 특정 속성을 가짐을 표현해주는 인터페이스  
  - ex) Serializable
- 마커 인터페이스는 두 가지 면에서 마커 애너테이션보다 낫다
  1. 이를 구현한 클래스의 인스턴스들을 구분하는 타입으로 쓸 수 있음
  2. 적용 대상을 더 정밀하게 지정할 수 있음  
- 마커 애너테이션이 더 나은 점은?  
  - 거대한 애너테이션 시스템의 지원을 받음  
- 그래서 어떻게 써야하나요?  
  - 이 마킹이 된 객체를 매개변수로 받는 메서드를 작성할 일이 있다면 -> 마커 인터페이스를 써라  
  
