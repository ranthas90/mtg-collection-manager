package org.ranthas.mtgcollectionmanager.repository;

import org.ranthas.mtgcollectionmanager.entity.Set;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SetRepository extends JpaRepository<Set, UUID> {
}
