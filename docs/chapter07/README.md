---
sidebar: auto
---

## chapter 07  
## 람다와 스트림


### 42. 익명 클래스보다는 람다를 사용하라  
```java
// 익명 클래스 사용
Collections.sort(words, new Comparator<String()> {
  public int compare(String s1, String s2) {
    return Integer.compare(s1.length(), s2.length());
  }
});  

//익명 클래스 대체
Collections.sort(words, (s1, s2) -> Integer.compare(s1.length(), s2.length()));
```

- 타입을 명시해야 코드가 더 명확할 때만 제외하고는, 람다의 모든 매개변수 타입은 생략  
  - 컴파일러가 "타입을 알 수 없다" 오류를 반환할 때만 해당 타입을 명시하면 된다  
- 컴파일러가 타입 추론에 필요한 정보 대부분은 제네릭에서 얻으므로 제네릭을 제대로 쓴다  
  - List words가 아니라, List<String> words  

- 그렇다고 람다가 만병통치약은 아니다  
  - 이름이 없고, 문서화도 못 함
  - 코드 자체로 명확히 설명되지 않거나, 코드가 세 줄 이상으로 많아지면 람다를 쓰지 말아야 한다  

- 람다 직렬화하는 일은 극히 삼가야 한다.
  - 직렬화 형태가 구현별로(가령 가상머신별로) 다르기 때문???

### 43. 람다보다는 메서드 참조를 사용하라  
```java
// 람다
map.merge(key, 1, (count, incr) -> count + incr);

// 메서드 참조
map.merge(key, 1, Integer::sum);

```

- 람다로 할 수 없는 일이라면 메서드 참조로도 할 수 없다.
- 람다가 메서드 참조보다 간결할 때도 있다 : 주로 메서드와 람다가 같은 클래스 안에 있을 때  
  - Function.identity() 보다 (x -> x) 가 더 명확하고 눈에 잘 들어옴

- 메서드 참조의 유형 (같은 기능을 하는 람다)
  1. 정적
    - Integer::parseInt / str -> Integer.parseInt(str);    
  2. 한정적 (인스턴스)
    - Instant.now()::isAfter / Instant then = Instant now(); t -> then.isAfter(t)
  3. 비한정적 (인스턴스)
    - String::toLowerCase / str -> str.toLowerCase()
  4. 클래스 생성자
    - TreeMap<K,V>::new / () -> new TreeMap<K,V>();
  5. 배열 생성자
    - int[]::new / len -> new int[len];

- 람다로는 불가능하나 메서드 참조로는 가능한 유일한 예 : 제네릭 함수 타입 구현


### 44. 표준 함수형 인터페이스를 사용하라  
- java.util.function 패키지에 다양한 용도의 표준 함수형 인터페이스가 담겨 있다.  
  - 필요한 용도에 맞는 것이 있다면, 직접 구현하지 말고 표준 함수형 인터페이스를 활용
  |      인터페이스       |        함수 시그니처    |          예           |
  |--------------------|----------------------|----------------------|
  | UnaryOperator<T>   | T apply(T t)         | String::toLowerCase  |
  | BinaryOperator<T>  | T apply(T t1, T t2)  | BigInteger::add      |
  | Predicate<T>       | boolean test(T t)    | Collection::isEmpty  |
  | Function<T,R>      | R apply(T t)         | Arrays::asList       |
  | Supplier<T>        | T get()              | Instant::now         |
  | Consumer<T>        | void accept(T t)     | System.out::println  |

- UnaryOperator, BinaryOperator : 반환값과 인수의 타입이 같은 함수
- Predicate : 인수 하나를 받아 boolean 반환
- FUnction : 인수와 반환 타입이 다름
- Supplier : 인수를 받지 않고 값을 반환(제공)
- Consumer : 인수를 하나 받고 반환값은 없음(인수를 소비)

- 표준 함수형 인터페이스 대부분은 기본 타입만 지원함
  - 기본 함수형 인터페이스에 박싱된 기본 타입을 넣어 사용하지는 말 것 (성능!!)  

- ```@FunctionalInterface```어노테이션
  - 프로그래머의 의도 명시
    1. 해당 인터페이스는 람다용으로 설계됨
    2. 해당 인터페이스는 추상 메서드를 오직 하나만 가질 수 있음
    3. 그 결과 유지보수 과정에서 누군가 메서드를 추가하지 못하도록 막음

### 45. 스트림은 주의해서 사용하라  
- 스트림 파이프라인 : 지연 평가 (lazy evaluation)
  - 종단 연산(terminal operation)이 수행될 때 evaluation이 이루어진다.
  - 종단 연산이 없는 스트림은 아무 일도 하지 않는 명령어와 같다.
- 메서드 연쇄를 지원하는 fluent API
- 기본적으로 순차적으로 수행되며, 병렬로 수행하려면 파이프라인 스트림 중 하나에서 parallel() 을 호출하면 되지만 효과를 볼 수 있는 상황이 많지는 않다

- 스트림으로 처리하기 어려운 일  
  - 한 데이터가 여러 단계(stage)를 통과할 때 각 단계에서의 값들에 동시에 접근하기는 어려운 구조
  - 한 값을 다른 값에 매핑하고 나면 원래의 값은 잃는 구조이므로  

- 스트림을 사용해야 더 깔끔해지는 상황도 있고, 반복이 더 알맞은 경우도 있다.
  - 상황에 맞게 사용하자
  - 헷갈리면 둘 다 해보자

### 46. 스트림에서는 부작용 없는 함수를 사용하라  
- 스트림 패러다임의 핵심 : 계산을 일련의 변환(transformation)으로 재구성하는 부
- 각 변환 단계는 가능한 한 이전 단계의 결과를 받아 처리하는, 오직 입력만이 결과에 영향을 주는 순수 함수여야 함
  - side-effect가 없어야 한다. 즉 다른 가변 상태를 참조하거나 함수 스스로 다른 상태를 변경하면 안 된다.

- forEach 연산은 스트림 계싼 결과를 보고할 때만 사용하고, 계산할 때는 쓰지 말자 (헐)  
- Collector : 스트림을 사용하려면 꼭 배워야 하는 새로운 개념
  - java.util.stream.Collectors
    - API 문서 참조!

```java  
List<String> topTen = freq.keySet().stream()
                        .sorted(comparing(freq::get).reversed())
                        .limit(10)
                        .collect(toList());
```
마지막 toList()는 Collectors.toList() 인데 정적 임포트하여 사용한 것 (스트림 가독성을 높이기 위해)  

- toMap, maxsBy, groupingBy, partitionBy 등등...


### 47. 반환 타입으로는 스트림보다 컬렉션이 낫다  
- Stream 인터페이스는 Iterable 인터페이스가 정의한 추상 메서드를 전부 포함할 뿐만 아니라 Iterable이 정의한 방식대로 동작하지만..
  - extends Iterable 하지 않아서 for-each로 스트림을 반복할 수가 없다.

- Stream<E> <-> Iterable<E> 중개 어댑터 메서드를 사용하면 괜찮다.
```java
// Stream에서 Iterable로  
public static <E> Iterable<E> iterableOf(Stream<E> stream) {
  return stream::iterator;
}

// Iterable에서 Stream으로  
public static <E> Stream<E> streamOf(Iterable<E> iterable) {
  return StreamSupport.stream(iterable.spliterator(), false);
}

```

- Collection 인터페이스는 Iterable의 하위 타입이고 stream 메서드도 제공함
  - 그러므로, 원소 시퀀스를 반환하는 공개 API의 반환 타입에는 Collection이나 그 하위 타입을 쓰는 것이 일반적으로 최선  

### 48. 스트림 병렬화는 주의해서 적용하라  
- 스트림의 소스가 ArrayList, HashMap, HashSet, ConcurrentHashMap의 인스턴스 / 배열 / int, long 범위일 때 병렬화의 효과가 제일 좋다.  
  - 데이터를 원하는 크기로 정확하고 손쉽게 나눌 수 있어 일을 다수의 thread에 분배하기 좋음  
  - 또한 참조 지역성(locality of reference)이 뛰어남.
    - 이웃한 원소의 참조들이 메모리에 연속해서 저장되어 있음  
- 스트림을 잘못 병렬화하면 응답 불가가 되거나, 오히려 성능이 나빠지거나, 예상 못한 동작이 발생할 수 있음    
  - 테스트 필수!  
  - 계산도 아주 정확하고 성능이 정말 좋아져서 병렬화를 사용할 만한 가치가 있을 떄만 사용한다.  
