import { EndpointValidationError } from '@hilla/frontend';
import { Button } from '@hilla/react-components/Button.js';
import { Details } from '@hilla/react-components/Details.js';
import { Notification } from '@hilla/react-components/Notification.js';
import { TextField } from '@hilla/react-components/TextField.js';
import { VerticalLayout } from '@hilla/react-components/VerticalLayout.js';
import { FormikErrors, useFormik } from 'formik';
import Edificio from 'Frontend/generated/com/example/application/model/Edificio';
import { EdificioEndpoint } from 'Frontend/generated/endpoints';
import {  useEffect, useState } from 'react';

export default function EdificiView() {
  const empty: Edificio = { nombre: '',domicilio:'' };
  const [edificios, setEdificios] = useState(Array<Edificio>());

  useEffect(() => {
    (async () => {
      setEdificios(await EdificioEndpoint.findAll());
    })();

    return () => {};
  }, []);

  const createForm = useFormik({
    initialValues: empty,
    onSubmit: async (value: Edificio, { setSubmitting, setErrors }) => {
      try {
       // console.log("Aqui estoy key "+value.id);
        const saved = (await EdificioEndpoint.save(value)) ?? value;
        if (value.id!=null)
           setEdificios(edificios.map((item) => (item.id === value.id ? saved : item)));
        else 
           setEdificios([...edificios, saved]);
        createForm.resetForm();
      } catch (e: unknown) {
        if (e instanceof EndpointValidationError) {
          const errors: FormikErrors<Edificio> = {};
          for (const error of e.validationErrorData) {
            if (typeof error.parameterName === 'string' && error.parameterName in empty) {
              const key = error.parameterName as string & keyof Edificio;
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

 

  async function updateNombre(edificio: Edificio, nombre: Edificio['nombre']) {
    if (edificio.nombre == nombre) return;

    const newEdificio = { ...edificio, nombre };
    const saved = (await EdificioEndpoint.save(newEdificio)) ?? newEdificio;
    setEdificios(edificios.map((item) => (item.id === edificio.id ? saved : item)));
  }

  async function updateDomicilio(edificio: Edificio, domicilio: Edificio['domicilio']) {
    if (edificio.domicilio == domicilio) return;

    const newEdificio = { ...edificio, domicilio };
    const saved = (await EdificioEndpoint.save(newEdificio)) ?? newEdificio;
    setEdificios(edificios.map((item) => (item.id === edificio.id ? saved : item)));
  }

  async function carryEdificio(edificio: Edificio) {
      createForm.setValues(edificio);
  }
 
  async function deleteEdificio(edificio: Edificio) {
    try{
      const deletedEdificioId = await EdificioEndpoint.delete(edificio);
     if (deletedEdificioId) {
        setEdificios(edificios.filter((t) => t.id != deletedEdificioId));
      }
     } 
    catch (error) {
      console.log("error al borrar" +error);
      Notification.show("No es posible borrar el edificio "+error);
    }
  }
 
 
  return (
    <>
      <div className="m-m flex items-baseline gap-m">
        <TextField
          name="nombre"
          label="Nombre"
          value={createForm.values.nombre}
          onChange={createForm.handleChange}
          onBlur={createForm.handleChange}
        />
          <TextField
          name="domicilio"
          label="Domicilio"
          value={createForm.values.domicilio}
          onChange={createForm.handleChange}
          onBlur={createForm.handleChange}
        />
     
        <Button theme="primary" disabled={createForm.isSubmitting} onClick={createForm.submitForm}>
          Guardar
        </Button>
        
      </div>

      <div className="m-m flex flex-col items-stretch gap-s" >
        {edificios.map((edificio) => (
          <div key={edificio.id}>
            
            <TextField
              name="nombre"
              style={{ width: '20%' }} 
              value={edificio.nombre}
              onChange={createForm.handleChange}
              onBlur={(e: any) => updateNombre(edificio, e.target.value)}
            />
             <TextField
              name="domicilio"
              style={{ width: '20%' }} 
              value={edificio.domicilio}
              onChange={createForm.handleChange}
              onBlur={(e: any) => updateDomicilio(edificio, e.target.value)}
            />
             <Details key={Math.random()}>
             {
              edificio.listadependencias && !edificio.listadependencias.length &&
              <VerticalLayout key={Math.random()}>
               <span key={Math.random()}><b>El edificio no tiene dependencias</b></span>
              </VerticalLayout>
              }
              <Button  theme="tertiary" slot='summary'> Dependencias (+) </Button>
              
              { edificio.listadependencias?.map((unaDependencia) =>
                 <VerticalLayout key={Math.random()} >
                 <span key={Math.random()}><b>Nombre : </b>{unaDependencia?.nombre} <b>Domicilio: </b> {unaDependencia?.domicilio}</span>
               </VerticalLayout>
              )
              }
             </Details>
               <Button theme='secondary success small'  onClick={() => carryEdificio(edificio)}>Modificar</Button>
               <Button theme='secondary error small'  onClick={() => deleteEdificio(edificio)}>Eliminar</Button>
           </div>
        ))}
      </div>
    </>
  );
}