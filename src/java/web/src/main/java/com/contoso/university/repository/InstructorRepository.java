package com.contoso.university.repository;

import com.contoso.university.domain.Instructor;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstructorRepository extends JpaRepository<Instructor, Integer> {
  @Override
  @EntityGraph(
      attributePaths = {"courseAssignments", "courseAssignments.course", "officeAssignment"})
  List<Instructor> findAll();
}
