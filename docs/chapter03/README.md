---
sidebar: auto
---

## chapter 03

-   Object에서 final이 아닌 메서드 (equals, hashCode, toString, clone, finalize)는 모두 overriding을 염두에 두고 설계된 것임.
    -   일반 규약에 맞게 재정의해야 한다.
    -   잘못 재정의하면 대상 클래스가 이 규약을 준수한다고 가정하는 클래스(HashMap, HashSet)들을 오동작하게 만들 수 있음

### 10. equals는 일반 규약을 지켜 재정의하라.

### 11. equals를 재정의하려거든 hashCode도 재정의하라.

### 12. toString을 항상 재정의하라.

### 13. clone 재정의는 주의해서 진행하라.

### 14. Comparable을 구현할지 고려하라.
