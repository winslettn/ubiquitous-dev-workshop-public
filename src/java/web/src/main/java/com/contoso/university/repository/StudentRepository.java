package com.contoso.university.repository;

import com.contoso.university.domain.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Integer> {
  Page<Student> findByLastNameContainingIgnoreCaseOrFirstMidNameContainingIgnoreCase(
      String lastName, String firstMidName, Pageable pageable);
}
