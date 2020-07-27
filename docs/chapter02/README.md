---
sidebar: auto
---

## chapter 02

### 1. 생성자 대신 정적 팩터리 메서드를 고려하라

-   장점
    -   이름을 가질 수 있다.
        -   반환될 객체의 특성 설명 (BigInter(int, int, Random) vs. BigInter.probablePrime)
    -   호출될 때마다 인스턴스를 새로 생성하지는 않아도 된다.
    -   반환 타입의 하위 타입 객체를 반환할 수 있는 능력이 있다.
    -   입력 매개변수에 따라 매번 다른 클래스의 객체를 반환할 수 있다.
    -   EnumSet 클래스 : OpenJDK의 경우 원소가 64개 이하이면 RegularEnumSet, 65개 이상이면 JumboEnumSet을 반환하지만 클라이언트는 RegularEnumSet과 JumboEnumSet의 존재를 모름 (EnumSet의 하위 클래스이기만 하면 됨)
    -   정적 팩터리 메서드를 작성하는 시점에는 반환할 객체의 클래스가 존재하지 않아도 됨
        -   이러한 유연함을 통해 서비스 제공자 프레임워크를 만드는 근간 (ex.JDBC)
            -   서비스 제공자 프레임워크 : 3개의 핵심 컴포넌트 (서비스 인터페이스, 제공자 등록 API, 서비스 접근 API)
-   단점
    -   상속을 하려면 public, protected 생성자가 필요하므로 정적 팩터리 메서드만 제공하면 하위 클래스를 만들 수 없음
        -   상속보다 컴포지션을 사용하도록 유도하니 어쩌면 장점이 될 수도?
    -   프로그래머가 찾기 어려움
        -   API 문서를 잘 쓰고, 메서드 이름도 널리 알려진 규약을 잘 따라야 함
        -   정적 팩터리 메서드에 흔히 사용하는 명명 방식들
            -   from, of, valueOf, instance / getInstance, create / newInstance, getType, newType, type
        ```java
        Date d = Date.from(instant);
        BigInter prime = BigInter.valueOf(Integer.MAX_VALUE);
        Object newArray = Array.newInstance(classObject, arrayLen);
        ```

### 2. 생성자에 매게변수가 많다면 빌더를 고려하라

-   기존 패턴들
    -   점층적 생성자 패턴 (갯수가 많아지면 헷갈림)
    -   자바빈즈 패턴 (일단 만들고 set, set...)
        -   객체가 완전히 생성되기 전까지는 일관성이 무너짐)
        -   클래스를 불변으로 만들 수 없으며 스레드 안전성을 얻으려면 추가 작업이 필요
-   빌더 패턴

    -   필수 매개변수만으로 생성자/정적 패터리를 호출해 빌더 객체를 얻음

    ```java
    public class NutritionFacts {
      private final int servingSize;
      private final int servings;
      private final int calories;
      private final int fat;
      private final int sodium;
      private final int carbohydrate;

      public static class Builder {
          // Required parameters
          private final int servingSize;
          private final int servings;

          // Optional parameters - initialized to default values
          private int calories      = 0;
          private int fat           = 0;
          private int sodium        = 0;
          private int carbohydrate  = 0;

          public Builder(int servingSize, int servings) {
              this.servingSize = servingSize;
              this.servings    = servings;
          }

          public Builder calories(int val)
          { calories = val;      return this; }
          public Builder fat(int val)
          { fat = val;           return this; }
          public Builder sodium(int val)
          { sodium = val;        return this; }
          public Builder carbohydrate(int val)
          { carbohydrate = val;  return this; }

          public NutritionFacts build() {
              return new NutritionFacts(this);
          }
      }

      private NutritionFacts(Builder builder) {
          servingSize  = builder.servingSize;
          servings     = builder.servings;
          calories     = builder.calories;
          fat          = builder.fat;
          sodium       = builder.sodium;
          carbohydrate = builder.carbohydrate;
      }

      public static void main(String[] args) {
          NutritionFacts cocaCola = new NutritionFacts.Builder(240, 8)
                  .calories(100).sodium(35).carbohydrate(27).build();
      }
    }
    ```

    -   빌더 패턴은 계층적으로 설계된 클래스와 함께 쓰기에 좋다
    -   특히 매개변수가 많다면... 반드시!

-   Lombok이 만들어 준 빌더만 사용해왔는데, 필수 매개변수를 따로 코드에 녹여서 이렇게 쓸 수도 있겠구나

### 3. private 생성자나 열거 타입으로 싱글턴임을 보장하라

3가지 방식으로 가능하다.

-   1. public static final 변수
-   2. 정적 팩터리 메서드를 public static 멤버로 제공

```java
public class Elvis {
    ...
    public static Elvis getInstance() { return INSTANCE; }
}
```

    -   이 방식들로 만든 싱글턴 클래스를 직렬화하려면 Serializable을 구현한다고 선언하는 것 뿐 아니라, 모든 인스턴스 필드를 일시적(transient)이라고 선언하고 readResolve 메서드를 제공해야 한다 (?)

-   3. 원소가 하나인 열거 타입 선언
    -   추가 노력 없이 직렬화할 수 있음. 대부분의 상황에서 가장 좋은 방법

### 4. 인스턴스화를 막으려거든 private 생성자를 사용하라

-   컴파일러가 자동으로 기본 생성자를 만드는 것을 방지하기 위함
-   private이든, public이든 생성자가 일단 있으면 자동 생성이 안 되니까

```java
private UtilityClass() {
    throw new AssertionError();
}
```

-   이렇게 일단 만들어놓고 혹시 액세스될때를 대비하여 오류를 던지도록 하자
-   상속을 불가능하게 하는 효과도 있음

### 5. 자원을 직접 명시하지 말고 의존 객체 주입을 사용하라.

-   인스턴스를 생성할 때 생성자에 필요한 자원을 넘겨주는 방식
-   맨날 하는 바로 그것

```java
public class SpellChecker {
    private final Lexicon dictionary;

    public SpellChecker(Lexicon dictionary) {
        this.dictionary = Objects.requireNonNull(dictionary);
    }

}
```

-   변형 : 생성자에게 자원 팩터리를 넘겨주는 방식

    -   Java 8의 Supplier<T> 인터페이스가 팩터리를 표현한 완벽한 예 (?)

-   클래스가 내부적으로 하나 이상의 자원에 의존하고, 그 자원이 클래스 동작에 영향을 줄 경우 : 싱글턴, 정적 유틸리티 클래스 X

    -   필요한 자원을(또는 그 자원을 만들어 주는 팩터리를) 생성자에게(또는 정적 팩터리나 빌더에) 넘겨주자!

    ### 6. 불필요한 객체 생성을 피하라

    -   new String 하지 마세요
    -   Boolean(String) 생성자보다는 Boolean.valueOf(String) 이 좋겠죠
    -   정규표현식용 Pattern 인스턴스는 생성 비용이 높다 -> 주의
    -   오토박싱 주의 (의미상으로는 별다를 것 없지만, 성능상으로는 그렇지 않다)

    ### 7. 다 쓴 객체 참조를 해제하라

    -   Java에서 메모리 관리에 더 이상 신경쓰지 않아도 되는 줄 알았지만 아니지롱.
    -   가비지 컬렉션 언어에서는 메모리 누수 찾기가 매우 까다롭다!
        -   객체 참조 하나를 살려두면 가비지 컬렉터는 그 객체뿐 아니라 그 객체가 참조하는 모든 객체를 회수하지 못하기 때문
    -   자기 메모리를 직접 관리하는 클래스를 사용한다면 반드시 해제해야 한다.
        -   해당 참조를 다 썼을 때 null처리하면 됨.
    -   캐시, listener/callback 또한 메모리 누수의 주범
        -   WeakHashMap에 키로 저장하면 가비지 컬렉터가 즉시 수거해 감.

### 8. finalizer / cleaner 사용을 피하라

### 9. try-finally보다는 try-with-resource를 사용하라

-   try-with-resource를 사용하려면 해당 자원이 AutoCloseable 인터페이스를 구현해야 함

```java
static void copy(String src, String dst) throws IOEXception {
    try (InputStream in = new FileInputStream(src);
    OutputStream out = new FileOutputStream(dst)) {
        byte[] buf = new byte[BUFFER_SIZE];
        int n;
        while ((n= in.read(buf)) >= 0)
            out.write(buf, 0, n);
    }
}
```

-   회수해야 하는 자원을 사용하고 있다면 이 구문을 사용해보자 (BufferedReader, ...)
