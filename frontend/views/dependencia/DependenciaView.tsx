import { EndpointValidationError } from '@hilla/frontend';
import { Button } from '@hilla/react-components/Button.js';
import { ComboBox } from '@hilla/react-components/ComboBox.js';
import { TextField } from '@hilla/react-components/TextField.js';
import { FormikErrors, useFormik } from 'formik'; 
import Dependencia from 'Frontend/generated/com/example/application/model/Dependencia';
import Edificio from 'Frontend/generated/com/example/application/model/Edificio';
import { DependenciaEndpoint, EdificioEndpoint } from 'Frontend/generated/endpoints';
import { Details } from '@hilla/react-components/Details.js';

import { useEffect, useState } from 'react';

export default function DependenciaView() {
  const empty: Dependencia = { nombre: '',domicilio:'' };
  let aBuild: Edificio = { nombre: '',domicilio:'' };
  const [dependencias, setDependencias] = useState(Array<Dependencia>());
  const [edificios, setEdificios] = useState(Array<Edificio>());
  
  useEffect(() => {
    (async () => {
      setDependencias(await DependenciaEndpoint.findAll());
      setEdificios(await EdificioEndpoint.findAll());
    })();

    return () => {};
  }, []);

  const createForm = useFormik({
    initialValues: empty,
    onSubmit: async (value: Dependencia, { setSubmitting, setErrors }) => {
      try {
        console.log("Aqui estoy key "+value.id);
        console.log("Aqui estoy edificio key "+JSON.stringify(value.edificio));
        //const theItem = (await EdificioEndpoint.findById(Number(value.edificio)));
        //value.edificio = theItem ;
        const saved = (await DependenciaEndpoint.save(value)) ?? value;
        console.log("Aqui estoy key"+value.id);
        
        if(value.id != null) {
          setDependencias(dependencias.map((item) => (item.id === value.id ? saved : item)));
          
        } else {
          setDependencias([...dependencias, saved]);
        }
        createForm.resetForm();
      } catch (e: unknown) {
        if (e instanceof EndpointValidationError) {
          const errors: FormikErrors<Dependencia> = {};
          for (const error of e.validationErrorData) {
            if (typeof error.parameterName === 'string' && error.parameterName in empty) {
              const key = error.parameterName as string & keyof Dependencia;
              errors[key] = error.message;
            }
          }
          setErrors(errors);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

 

  async function updateNombre(dependencia: Dependencia, nombre: Dependencia['nombre']) {
    if (dependencia.nombre == nombre) return;

    const newDependencia = { ...dependencia, nombre };
    const saved = (await DependenciaEndpoint.save(newDependencia)) ?? newDependencia;
    setDependencias(dependencias.map((item) => (item.id === dependencia.id ? saved : item)));
  }

  async function carryDependencia(dependencia: Dependencia) {
    console.log(dependencia.edificio);
    createForm.setValues(dependencia);
     
  }

  async function deleteDependencia(dependencia: Dependencia) {
    const deletedDependenciaId = await DependenciaEndpoint.delete(dependencia);
    if (deletedDependenciaId) {
      setDependencias(dependencias.filter((t) => t.id != deletedDependenciaId));
    }
  }

  async function setDataEdificio(edificioid?: Number) {
    console.log("me cargo bien? ",edificioid); 
    if (edificioid)
      createForm.setFieldValue("edificio", await EdificioEndpoint.findById(Number(edificioid)));
   
  }

  return (
    <>
      <div className="m-m flex items-baseline gap-m">
        <TextField
          name="nombre"
          label="Nombre"
          style={{ width: '20%' }} 
          value={createForm.values.nombre}
          onChange={createForm.handleChange}
          onBlur={createForm.handleChange}
        />
          <TextField
          name="domicilio"
          label="Domicilio"
          style={{ width: '20%' }} 
          value={createForm.values.nombre}
          onChange={createForm.handleChange}
          onBlur={createForm.handleChange}
        />
         <ComboBox
          allowCustomValue
          label='Edificios'
          itemLabelPath='nombre'
          itemValuePath='id'
          value={createForm.values.edificio?.nombre}
          items={edificios}
          placeholder='Clic (+)'
          style={{ width: '20%' }} 
          onSelectedItemChanged={
            (e) => setDataEdificio(e.detail.value?.id)          
          }       
        />
        <Button theme="primary" disabled={createForm.isSubmitting} onClick={createForm.submitForm}>
          Guardar
        </Button>
      </div>

      <div className="m-m flex flex-col items-stretch gap-s">
        {dependencias.map((dependencia) => (
          <div key={dependencia.id}>
            
            <TextField
              name="nombre"
              value={dependencia.nombre}
              style={{ width: '20%' }} 
              onBlur={(e: any) => updateNombre(dependencia, e.target.value)}
            />
             <TextField
              name="domicilio"
              value={dependencia.domicilio}
              style={{ width: '20%' }} 
              onBlur={(e: any) => updateNombre(dependencia, e.target.value)}
            />
            <TextField
              name="edificio"
              style={{ width: '20%' }} 
              value={dependencia.edificio?.nombre}
           
            />
            
            <Button onClick={() => carryDependencia(dependencia)}>Modificar</Button>
            <Button onClick={() => deleteDependencia(dependencia)}>Eliminar</Button>
          </div>
        ))}
      </div>
    </>
  );
}