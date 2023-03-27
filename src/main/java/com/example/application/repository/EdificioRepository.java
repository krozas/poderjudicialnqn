package com.example.application.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.application.model.Edificio;

public interface EdificioRepository extends JpaRepository<Edificio, Integer> {

    Optional<Edificio> findById(Integer id); 
}
