package com.example.application.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
public class Dependencia {
   
      
    @Getter
    @Setter
    @Id
    @GeneratedValue(generator = "iddependenciasec")
    @SequenceGenerator(name = "iddependenciasec", initialValue = 1000)      
    private Integer id;
  
   
    @Getter
    @Setter
    @NotBlank 
    private String nombre;

    @Getter
    @Setter
    @NotBlank 
    private String domicilio;

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name="edificio_id")
    @JsonIgnoreProperties({"listadependencias"})
    private Edificio edificio;
  
    public Dependencia() {}
  
    public Dependencia(String nombre,String domicilio) {
      this.nombre = nombre;
      this.domicilio = domicilio;
    }

}