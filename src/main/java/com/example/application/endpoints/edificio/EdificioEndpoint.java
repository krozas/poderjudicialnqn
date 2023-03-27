package com.example.application.endpoints.edificio;

import java.util.List;

import com.example.application.model.Edificio;
import com.example.application.repository.EdificioRepository;
import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.Endpoint;
import dev.hilla.Nonnull;

@Endpoint
@AnonymousAllowed
public class EdificioEndpoint {
    private EdificioRepository repository;

    public EdificioEndpoint(EdificioRepository repository) {
        this.repository = repository;
    }

    public @Nonnull List<@Nonnull Edificio> findAll() {
        return repository.findAll();
    }

    public Edificio save(Edificio edificio) {
        return repository.save(edificio);
    }

    public Edificio findById(Integer id) {
        if(id == null || id == 0){
            return null;
        } else {
            return repository.findById(id).get();
        }
       
    }

    public Integer delete(Edificio edificio) {
        repository.delete(edificio);
        return edificio.getId();
    }
    
}
