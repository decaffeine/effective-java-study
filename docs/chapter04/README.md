---
sidebar: auto
---

## chapter 04 클래스와 인터페이스

클래스와 인터페이스 - 추상화의 기본 단위! 자바 언어의 심장!  

### 15. 클래스와 멤버의 접근 권한을 최소화하라  
- 정보 은닉  
  - 잘 설계된 컴포넌트는 오직 API를 통해서만 다른 컴포넌트와 소통, 서로의 내부 동작 방식에는 전혀 개의치 않음  
  - 접근 제한자(private, protected, public)를 제대로 활용하는 것이 정보 은닉의 핵심  
  - 기본 원칙 : 모든 클래스와 멤버의 접근성을 가능한 한 좁혀야 함   
    - 소프트웨어가 제대로 동작하는 한 가장 낮은 접근성을 부여해야  

- 공개 API를 세심하게 설계한 후 모든 멤버는 private으로 만들고
  - 같은 패키지의 다른 클래스가 접근해야 하는 멤버에 한하여 package-private으로 풀어 주기 (private 제한자 제거)
  - 권한을 풀어 주는 일을 자주 해야 한다면 컴포넌트를 더 분해해야 하는 것이 아닐까 고민하기

- 단지 코트를 테스트하려는 목적으로 접근 범위를 넓힐 때
  - package-private까지는 괜찮지만 public은 안 됨
  
- public 클래스의 인스턴스 필드는 되도록 public이 아니어야 한다  
  - public 가변 필드를 갖는 클래스는 일반적으로 thread-safe 하지 않다!!  
  - 길이가 0이 아닌 배열은 모두 변경 가능하니 주의  
    - 클래스에서 public static final 배열 필드를 두거나 이 필드를 반환하는 접근자 메서드를 제공해서는 안 됨  
   ```java
   // 이건 안 돼
   public static final Thing[] VALUES = { ... };
   
   // 해결책 1
   private static final Thing[] PRIVATE_VALUES = { ... };
   public static final List<Thing> VALUES = Collections.unmodifiableList(Arrays.asList(PRIVATE_VALUES));
   
   // 해결책 2
   private static final Thing[] PRIVATE_VALUES = { ... };
   public static final Thing[] values() { return PRIVATE_VALUES.clone(); }
   
   ```
- 자바 9에서는 모듈 개념이 추가됨  
  - 패키지가 클래스의 묶음이듯, 모듈은 패키지의 묶음  
  
### 16. public 클래스에서는 public 필드가 아닌 접근자 메서드를 사용하라

- 패키지 바깥에서 접근할 수 있는 public 클래스라면 접근자(getter,setter)를 통해 인스턴스에 접근  
  - public 클래스의 필드를 직접 노출하면 안 된다  
    - 불변이라면 조금 낫지만 완전히 안심하기는 어렵다  
  - Java 플랫폼 라이브러리에도 이를 어긴 사례들이 있다 (java.awt.package의 Point, Dimension)
- package-private 또는 private 중첩 클래스라면 데이터 필드를 노출해도 상관없다  

### 17. 변경 가능성을 최소화하라

- 자바의 다양한 불변 클래스들
  - String, 기본 타입의 박싱된 클래스들, BigInteger, BigDecimal
- 클래스를 불변으로 만들려면 다음의 5가지 규칙을 따르면 된다
  - 객체 상태를 변경하는 메서드(변경자) 제공 X
  - 클래스를 확장할 수 없도록 한다
  - 모든 필드를 final로 선언
  - 모든 필드를 private으로 선언 
  - 자신 외에는 내부의 가변 컴포넌트에 접근할 수 없도록 한다
  
```java
public final class Complex {
  private final double re;
  private final double im;
  ...
  public Complex plus(Complex c) {
      return new Complex(re + c.re, im + c.im);  
  }
}
```

- 함수형 프로그래밍 패턴?
  - 메서드 이름으로 (add 같은) 동사 대신 (plus 같은) 전치사를 사용??
  
- 불변 객체는 근본적으로 thread-safe

- 불변 객체 원칙에서 자신을 상속하지 못하게 하기
  - final 클래스로 선언하거나
  - 모든 생성자를 private, package-private으로 만들고 public 정적 팩터리 제공하기
   ```java
   public class Complex {
   ...
   private Complex(double re, double im) { ... }
   
   public static Complex valueOf(double re, double im) {
      return new Complex(re, im);
   }
   ```

- 생성자는 불변식 설정이 모두 완료된, 초기화가 완벽히 끝난 상태의 객체를 생성해야 함  

### 18. 상속보다는 컴포지션을 사용하라 ***

- 메서드 호출과 달리 상속은 캡슐화를 깨뜨림
  - 상위 클래스의 구현에 따라 하위 클래스의 동작에 이상이 생길 수 있다

- 잘못된 사용 예시 (결과로 3을 기대하지만 6이 나옴)
```java
public class InstrumentedHashSet<E> extends HashSet<E> {
    // The number of attempted element insertions
    private int addCount = 0;

    public InstrumentedHashSet() {
    }

    public InstrumentedHashSet(int initCap, float loadFactor) {
        super(initCap, loadFactor);
    }

    @Override public boolean add(E e) {
        addCount++;
        return super.add(e);
    }

    @Override public boolean addAll(Collection<? extends E> c) {
        addCount += c.size();
        return super.addAll(c);
    }

    public int getAddCount() {
        return addCount;
    }

    public static void main(String[] args) {
        InstrumentedHashSet<String> s = new InstrumentedHashSet<>();
        s.addAll(List.of("Snap", "Crackle", "Pop"));
        System.out.println(s.getAddCount());
    }
}
```

- 해결 방법
  - 기존 클래스를 확장하는 대신, 새로운 클래스를 만들고 private 필드로 기존 클래스의 인스턴스를 참조
  - 기존 클래스가 새로운 클래스의 구성요소로 쓰인다는 뜻에서 COMPOSITION / 구성 이라 한다.
  - 새 클래스의 인스턴스 메소드들은 private 필드로 참조하는 기존 클래스의 대응하는 메소드를 호출해 그 결과를 반환 (Forwarding)
  
  ```java
  public class InstrumentedSet<E> extends ForwardingSet<E> {
    private int addCount = 0;

    public InstrumentedSet(Set<E> s) {
        super(s);
    }

    @Override public boolean add(E e) {
        addCount++;
        return super.add(e);
    }
    @Override public boolean addAll(Collection<? extends E> c) {
        addCount += c.size();
        return super.addAll(c);
    }
    public int getAddCount() {
        return addCount;
    }

    public static void main(String[] args) {
        InstrumentedSet<String> s = new InstrumentedSet<>(new HashSet<>());
        s.addAll(List.of("Snap", "Crackle", "Pop"));
        System.out.println(s.getAddCount());
    }
  }
  ```

  ```java
  public class ForwardingSet<E> implements Set<E> {
    private final Set<E> s;
    public ForwardingSet(Set<E> s) { this.s = s; }

    public void clear()               { s.clear();            }
    public boolean contains(Object o) { return s.contains(o); }
    public boolean isEmpty()          { return s.isEmpty();   }
    public int size()                 { return s.size();      }
    public Iterator<E> iterator()     { return s.iterator();  }
    public boolean add(E e)           { return s.add(e);      }
    public boolean remove(Object o)   { return s.remove(o);   }
    public boolean containsAll(Collection<?> c)
                                   { return s.containsAll(c); }
                                   ...
  
  ```
  
- 상속은 명백히 하위 클래스가 is-a 관계일 때만 써야 한다
- 자바 플랫폼 라이브러리에서도 이 원칙을 위반한 클래스들이 있음
  - 스택은 벡터가 아님(Stack은 Vector를 확장해선 안 됐음)
  - 속성 목록도 해시테이블이 아님(Properties도 Hashtable을 확장해선 안 됐음)  
  
### 19. 상속을 고려해 설계하고 문서화하라. 그렇지 않았다면 상속을 금지하라   

- 상속 금지 : 클래스를 final로 선언하거나 생성자 모두를 외부에서 접근할 수 없도록


### 20. 추상 클래스보다는 인터페이스를 우선하라  

### 21. 인터페이스는 구현하는 쪽을 생각해 설계하라  

### 22. 인터페이스는 타입을 정의하는 용도로만 사용하라  
- 상수를 모아놓는 용도로 사용하지 않는다.  

### 23. 태그 달린 클래스보다는 클래스 계층구조를 활용하라  

### 24. 멤버 클래스는 되도록 static으로 만들라

### 25. 톱레벨 클래스는 한 파일에 하나만 담으라  



