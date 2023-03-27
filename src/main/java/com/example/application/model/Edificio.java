package com.example.application.model;

import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity 
public class Edificio {
   
      @Getter
      @Setter
      @Id
      @GeneratedValue(generator = "idedificiosec")
      @SequenceGenerator(name = "idedificiosec", initialValue = 1000)
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
      @OneToMany(mappedBy="edificio")
      private List<Dependencia> listadependencias;
      
      public Edificio() {

      }
    
      public Edificio(String nombre,String domicilio) {
        this.nombre = nombre;
        this.domicilio = domicilio;
      }
    
     
}