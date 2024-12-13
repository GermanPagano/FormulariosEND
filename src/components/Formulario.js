import React, { useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

const Formulario = () => {
  const [step, setStep] = useState(1); // Control del paso actual

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0], // Fecha por defecto
    facilitadoA: "",
    direccion: "",
    aeronaveMotor: "",
    matricula: "",
    motorComponente: "",
    parteNumero: "",
    serieNumero: "",
    tsnTso: "",
    ordenDeTrabajo: "",
    informeNumero: "",
    tipoEnsayo: {
      liquidosPenetrantes: false,
      inspeccionVisual: false,
      particulasMagneticas: false,
      corrientesInducidas: false,
      dureza: false,
      boroscopia: false,
      ultrasonidos: false,
      radiografia: false,
    },
    procedimientoAplicable: "",
    metodo: "",
    materiales: {
      removedor: { tipo: "", lote: "", nivel: "", vence: "" },
      penetrante: { tipo: "", lote: "", nivel: "", vence: "" },
      particulas: { tipo: "", lote: "", nivel: "", vence: "" },
      acoplante: { tipo: "", lote: "", nivel: "", vence: "" },
      emulsificador: { tipo: "", lote: "", vence: "" },
      revelador: { tipo: "", lote: "", vence: "" },
      placas: { tipo: "", lote: "", vence: "" },
      fijador: { tipo: "", lote: "", vence: "" },
    },
    luces: {
      ultravioleta: {
        medidor: "",
        modelo: "",
        serie: "",
        vencimiento: "",
        intensidad: "",
      },
      ambiental: {
        medidor: "",
        modelo: "",
        serie: "",
        vencimiento: "",
        intensidad: "",
      },
      blanca: {
        medidor: "",
        modelo: "",
        serie: "",
        vencimiento: "",
        intensidad: "",
      },
    },
  });

  const handleChange = (e, materialKey = null) => {
    const { name, type, value, checked } = e.target;
    if (materialKey) {
      setFormData((prev) => ({
        ...prev,
        materiales: {
          ...prev.materiales,
          [materialKey]: {
            ...prev.materiales[materialKey],
            [name]: value,
          },
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        tipoEnsayo: {
          ...prev.tipoEnsayo,
          [name]: checked,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const generarWord = () => {
    const plantillaURL = `${process.env.PUBLIC_URL}/templates/plantilla.docx`; // Ruta de la plantilla

    fetch(plantillaURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo cargar la plantilla");
        }
        return response.arrayBuffer();
      })
      .then((content) => {
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          delimiters: { start: "{{", end: "}}" },
        });

        doc.setData({
          fecha: formData.fecha,
          facilitadoA: formData.facilitadoA || "N/A",
          direccion: formData.direccion || "N/A",
          aeronaveMotor: formData.aeronaveMotor || "N/A",
          matricula: formData.matricula || "N/A",
          motorComponente: formData.motorComponente || "N/A",
          parteNumero: formData.parteNumero || "N/A",
          serieNumero: formData.serieNumero || "N/A",
          tsnTso: formData.tsnTso || "N/A",
          ordenDeTrabajo: formData.ordenDeTrabajo || "N/A",
          informeNumero: formData.informeNumero || "N/A",
          liquidosPenetrantes: formData.tipoEnsayo.liquidosPenetrantes
            ? "■"
            : "",
          inspeccionVisual: formData.tipoEnsayo.inspeccionVisual ? "■" : "",
          particulasMagneticas: formData.tipoEnsayo.particulasMagneticas
            ? "■"
            : "",
          corrientesInducidas: formData.tipoEnsayo.corrientesInducidas
            ? "■"
            : "",
          dureza: formData.tipoEnsayo.dureza ? "■" : "",
          boroscopia: formData.tipoEnsayo.boroscopia ? "■" : "",
          ultrasonidos: formData.tipoEnsayo.ultrasonidos ? "■" : "",
          radiografia: formData.tipoEnsayo.radiografia ? "■" : "",
          procedimientoAplicable: formData.procedimientoAplicable || "N/A",
          metodo: formData.metodo || "N/A",
          // Removedor
          removedorTipo: formData.materiales.removedor.tipo || "N/A",
          removedorLote: formData.materiales.removedor.lote || "N/A",
          removedorNivel: formData.materiales.removedor.nivel || "N/A",
          removedorVence: formData.materiales.removedor.vence || "N/A",

          // Penetrante
          penetranteTipo: formData.materiales.penetrante.tipo || "N/A",
          penetranteLote: formData.materiales.penetrante.lote || "N/A",
          penetranteNivel: formData.materiales.penetrante.nivel || "N/A",
          penetranteVence: formData.materiales.penetrante.vence || "N/A",

          // Partículas
          particulasTipo: formData.materiales.particulas.tipo || "N/A",
          particulasLote: formData.materiales.particulas.lote || "N/A",
          particulasNivel: formData.materiales.particulas.nivel || "N/A",
          particulasVence: formData.materiales.particulas.vence || "N/A",

          // Acoplante
          acoplanteTipo: formData.materiales.acoplante.tipo || "N/A",
          acoplanteLote: formData.materiales.acoplante.lote || "N/A",
          acoplanteNivel: formData.materiales.acoplante.nivel || "N/A",
          acoplanteVence: formData.materiales.acoplante.vence || "N/A",

          // Emulsificador
          emulsificadorTipo: formData.materiales.emulsificador.tipo || "N/A",
          emulsificadorLote: formData.materiales.emulsificador.lote || "N/A",
          emulsificadorVence: formData.materiales.emulsificador.vence || "N/A",

          // Revelador
          reveladorTipo: formData.materiales.revelador.tipo || "N/A",
          reveladorLote: formData.materiales.revelador.lote || "N/A",
          reveladorVence: formData.materiales.revelador.vence || "N/A",

          // Placas
          placasTipo: formData.materiales.placas.tipo || "N/A",
          placasLote: formData.materiales.placas.lote || "N/A",
          placasVence: formData.materiales.placas.vence || "N/A",

          // Fijador
          fijadorTipo: formData.materiales.fijador.tipo || "N/A",
          fijadorLote: formData.materiales.fijador.lote || "N/A",
          fijadorVence: formData.materiales.fijador.vence || "N/A",

          // Luz Ultravioleta
          luzUltravioletaMedidor: formData.luces.ultravioleta.medidor || "N/A",
          luzUltravioletaModelo: formData.luces.ultravioleta.modelo || "N/A",
          luzUltravioletaSerie: formData.luces.ultravioleta.serie || "N/A",
          luzUltravioletaVencimiento:
            formData.luces.ultravioleta.vencimiento || "N/A",
          luzUltravioletaIntensidad:
            formData.luces.ultravioleta.intensidad || "N/A",

          //Luz Ambiental
          ambientalMedidor: formData.luces.ambiental.medidor || "N/A",
          ambientalModelo: formData.luces.ambiental.modelo || "N/A",
          ambientalSerie: formData.luces.ambiental.serie || "N/A",
          ambientalVencimiento: formData.luces.ambiental.vencimiento || "N/A",
          ambientalIntensidad: formData.luces.ambiental.intensidad || "N/A",

          //Luz Blanca
          blancaMedidor: formData.luces.blanca.medidor || "N/A",
          blancaModelo: formData.luces.blanca.modelo || "N/A",
          blancaSerie: formData.luces.blanca.serie || "N/A",
          blancaVencimiento: formData.luces.blanca.vencimiento || "N/A",
          blancaIntensidad: formData.luces.blanca.intensidad || "N/A",
        });

        try {
          doc.render(); // Generar el documento final
          const blob = doc.getZip().generate({
            type: "blob",
            mimeType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          saveAs(blob, "informe.docx"); // Descargar el archivo
        } catch (error) {
          console.error("Error generando el documento:", error);
        }
      })
      .catch((error) => {
        console.error("Error al cargar la plantilla:", error);
      });
  };

  const renderTextareas = () => {
    return (
      <div className="mb-3">
        <div className="mb-3">
          <label className="form-label">Procedimiento Aplicable</label>
          <textarea
            className="form-control"
            name="procedimientoAplicable"
            rows="3"
            placeholder="Ingrese el procedimiento aplicable"
            value={formData.procedimientoAplicable}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Método</label>
          <textarea
            className="form-control"
            name="metodo"
            rows="2"
            placeholder="Ingrese el método"
            value={formData.metodo}
            onChange={handleChange}
          />
        </div>
      </div>
    );
  };

  const renderCheckboxes = () => {
    return (
      <div className="mb-3">
        <h6>Tipo de Ensayo</h6>
        {Object.keys(formData.tipoEnsayo).map((key) => (
          <div key={key} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={key}
              name={key}
              checked={formData.tipoEnsayo[key]}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor={key}>
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
          </div>
        ))}
      </div>
    );
  };
  //funcion que renderiza los input para los materiales con 4 input
  const renderMaterialForm = (materialKey, materialLabel) => {
    const materialData = formData.materiales[materialKey] || {};

    return (
      <div className="mb-3">
        <h3 className="text-center mb-4">Material: {materialLabel}</h3>
        <div className="mb-3">
          <label className="form-label">Tipo</label>
          <input
            type="text"
            className="form-control"
            name="tipo"
            placeholder="Ingrese el tipo"
            value={materialData.tipo}
            onChange={(e) => handleChange(e, materialKey)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Lote</label>
          <input
            type="text"
            className="form-control"
            name="lote"
            placeholder="Ingrese el lote"
            value={materialData.lote}
            onChange={(e) => handleChange(e, materialKey)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nivel</label>
          <input
            type="text"
            className="form-control"
            name="nivel"
            placeholder="Ingrese el nivel"
            value={materialData.nivel}
            onChange={(e) => handleChange(e, materialKey)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Vence</label>
          <input
            type="date"
            className="form-control"
            name="vence"
            value={materialData.vence}
            onChange={(e) => handleChange(e, materialKey)}
          />
        </div>
      </div>
    );
  };
  //funcion que renderiza los input para los materiales con 3 input
  const renderSimpleMaterialForm = (materialKey, materialLabel) => {
    const materialData = formData.materiales[materialKey] || {};

    return (
      <div className="mb-3">
        <h3 className="text-center mb-4">Material: {materialLabel}</h3>
        <div className="mb-3">
          <label className="form-label">Tipo</label>
          <input
            type="text"
            className="form-control"
            name="tipo"
            placeholder="Ingrese el tipo"
            value={materialData.tipo}
            onChange={(e) => handleChange(e, materialKey)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Lote</label>
          <input
            type="text"
            className="form-control"
            name="lote"
            placeholder="Ingrese el lote"
            value={materialData.lote}
            onChange={(e) => handleChange(e, materialKey)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Vence</label>
          <input
            type="date"
            className="form-control"
            name="vence"
            value={materialData.vence}
            onChange={(e) => handleChange(e, materialKey)}
          />
        </div>
      </div>
    );
  };

  //manejador de los input del tipo de luz
  const handleLightChange = (e, key) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      luces: {
        ...prev.luces,
        [key]: {
          ...prev.luces[key],
          [name]: value,
        },
      },
    }));
  };
  //funcion que crea los input para las luces
  const renderLightInputForm = (key, label) => {
    const lightData = formData.luces[key] || {};

    return (
      <div className="mb-3">
        <h3 className="text-center mb-4">{label}</h3>
        <div className="mb-3">
          <label className="form-label">Medidor</label>
          <input
            type="text"
            className="form-control"
            name="medidor"
            placeholder="Ingrese el medidor"
            value={lightData.medidor || ""}
            onChange={(e) => handleLightChange(e, key)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Modelo</label>
          <input
            type="text"
            className="form-control"
            name="modelo"
            placeholder="Ingrese el modelo"
            value={lightData.modelo || ""}
            onChange={(e) => handleLightChange(e, key)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Serie</label>
          <input
            type="text"
            className="form-control"
            name="serie"
            placeholder="Ingrese la serie"
            value={lightData.serie || ""}
            onChange={(e) => handleLightChange(e, key)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Vencimiento</label>
          <input
            type="date"
            className="form-control"
            name="vencimiento"
            value={lightData.vencimiento || ""}
            onChange={(e) => handleLightChange(e, key)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Intensidad</label>
          <input
            type="text"
            className="form-control"
            name="intensidad"
            placeholder="Ingrese la intensidad"
            value={lightData.intensidad || ""}
            onChange={(e) => handleLightChange(e, key)}
          />
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Formulario de Ensayos</h3>
            <h6 className="text-center mb-4">1</h6>
            <div className="mb-3">
              <label className="form-label">Fecha</label>
              <input
                type="date"
                className="form-control"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Facilitado a</label>
              <input
                type="text"
                className="form-control"
                name="facilitadoA"
                placeholder="Nombre del cliente"
                value={formData.facilitadoA}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                name="direccion"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Aeronave/Motor</label>
              <input
                type="text"
                className="form-control"
                name="aeronaveMotor"
                placeholder="Aeronave/Motor"
                value={formData.aeronaveMotor}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Matrícula/S.N</label>
              <input
                type="text"
                className="form-control"
                name="matricula"
                placeholder="Matrícula/S.N"
                value={formData.matricula}
                onChange={handleChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={nextStep}
            >
              Continuar
            </button>
          </div>
        );

      case 2:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Formulario de Ensayos</h3>
            <h6 className="text-center mb-4">2</h6>
            <div className="mb-3">
              <label className="form-label">Motor - Componente</label>
              <input
                type="text"
                className="form-control"
                name="motorComponente"
                placeholder="Motor/Componente"
                value={formData.motorComponente}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Parte Número</label>
              <input
                type="text"
                className="form-control"
                name="parteNumero"
                placeholder="Parte Número"
                value={formData.parteNumero}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Serie Número</label>
              <input
                type="text"
                className="form-control"
                name="serieNumero"
                placeholder="Serie Número"
                value={formData.serieNumero}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">TSN/TSO</label>
              <input
                type="text"
                className="form-control"
                name="tsnTso"
                placeholder="TSN/TSO"
                value={formData.tsnTso}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Orden de Trabajo Nº</label>
              <input
                type="text"
                className="form-control"
                name="ordenDeTrabajo"
                placeholder="Orden de Trabajo Nº"
                value={formData.ordenDeTrabajo}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Informe Nº</label>
              <input
                type="text"
                className="form-control"
                name="informeNumero"
                placeholder="Informe Nº"
                value={formData.informeNumero}
                onChange={handleChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-secondary w-100 mb-2"
              onClick={prevStep}
            >
              Atrás
            </button>
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={nextStep}
            >
              Continuar
            </button>
          </div>
        );

      case 3:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Tipos de Ensayo</h3>
            <h6 className="text-center mb-4">3</h6>
            {renderCheckboxes()}
            <button
              type="button"
              className="btn btn-secondary w-100 mb-2"
              onClick={prevStep}
            >
              Atrás
            </button>
            <button
              type="button"
              className="btn btn-primary w-100 mb-2"
              onClick={nextStep}
            >
              Continuar
            </button>
          </div>
        );
      case 4:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Procedimientos</h3>
            <h6 className="text-center mb-4">4</h6>
            {renderTextareas()}
            <button
              type="button"
              className="btn btn-secondary w-100 mb-2"
              onClick={prevStep}
            >
              Atrás
            </button>
            <button
              type="button"
              className="btn btn-primary w-100 mb-2"
              onClick={nextStep}
            >
              Continuar
            </button>
          </div>
        );

      case 5:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Material: Removedor</h3>
            <h6 className="text-center mb-4">5</h6>
            {renderMaterialForm("removedor", "Removedor")}
            <button
              type="button"
              className="btn btn-secondary w-100 mb-2"
              onClick={prevStep}
            >
              Atrás
            </button>
            <button
              type="button"
              className="btn btn-primary w-100 mb-2"
              onClick={nextStep}
            >
              Continuar
            </button>
          </div>
        );

      case 6:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Material: Penetrante</h3>
            <h6 className="text-center mb-4">6</h6>
            {renderMaterialForm("penetrante", "Penetrante")}
            <button
              type="button"
              className="btn btn-secondary w-100 mb-2"
              onClick={prevStep}
            >
              Atrás
            </button>
            <button
              type="button"
              className="btn btn-primary w-100 mb-2"
              onClick={nextStep}
            >
              Continuar
            </button>
          </div>
        );

      case 7:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Material: Partículas</h3>
            <h6 className="text-center mb-4">7</h6>
            {renderMaterialForm("particulas", "Partículas")}
            <button
              type="button"
              className="btn btn-secondary w-100 mb-2"
              onClick={prevStep}
            >
              Atrás
            </button>
            <button
              type="button"
              className="btn btn-primary w-100 mb-2"
              onClick={nextStep}
            >
              Continuar
            </button>
          </div>
        );

      case 8:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Material: Acoplante</h3>
            <h6 className="text-center mb-4">8</h6>
            {renderMaterialForm("acoplante", "Acoplante")}
            <button
              type="button"
              className="btn btn-secondary w-100 mb-2"
              onClick={prevStep}
            >
              Atrás
            </button>
            <button
              type="button"
              className="btn btn-primary w-100 mb-2"
              onClick={nextStep}
            >
              Continuar
            </button>
          </div>
        );
      case 9:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Material: Emulsificador</h3>
            <h6 className="text-center mb-4">9</h6>
            {renderSimpleMaterialForm("emulsificador", "Emulsificador")}
            <button
              type="button"
              className="btn btn-secondary w-100 mb-2"
              onClick={prevStep}
            >
              Atrás
            </button>
            <button
              type="button"
              className="btn btn-primary w-100 mb-2"
              onClick={nextStep}
            >
              Continuar
            </button>
          </div>
        );
      case 10:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Material: Revelador</h3>
            <h6 className="text-center mb-4">10</h6>
            {renderSimpleMaterialForm("revelador", "Revelador")}
            <button
              type="button"
              className="btn btn-secondary w-100 mb-2"
              onClick={prevStep}
            >
              Atrás
            </button>
            <button
              type="button"
              className="btn btn-primary w-100 mb-2"
              onClick={nextStep}
            >
              Continuar
            </button>
          </div>
        );

      case 11:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Material: Placas</h3>
            <h6 className="text-center mb-4">11</h6>
            {renderSimpleMaterialForm("placas", "Placas")}
            <button
              type="button"
              className="btn btn-secondary w-100 mb-2"
              onClick={prevStep}
            >
              Atrás
            </button>
            <button
              type="button"
              className="btn btn-primary w-100 mb-2"
              onClick={nextStep}
            >
              Continuar
            </button>
          </div>
        );

      case 12:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Material: Fijador</h3>
            <h6 className="text-center mb-4">12</h6>
            {renderSimpleMaterialForm("fijador", "Fijador")}
            <button
              type="button"
              className="btn btn-secondary w-100 mb-2"
              onClick={prevStep}
            >
              Atrás
            </button>
            <button
              type="button"
              className="btn btn-primary w-100 mb-2"
              onClick={nextStep}
            >
              Continuar
            </button>
          </div>
        );

      case 13:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Luz Ultravioleta</h3>
            <h6 className="text-center mb-4">13</h6>
            {renderLightInputForm("ultravioleta", "Luz Ultravioleta")}
            <button
              type="button"
              className="btn btn-secondary w-100 mb-2"
              onClick={prevStep}
            >
              Atrás
            </button>
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={nextStep}
            >
              Continuar
            </button>
          </div>
        );

      case 14:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Luz Ambiental</h3>
            <h6 className="text-center mb-4">14</h6>
            {renderLightInputForm("ambiental", "Luz Ambiental")}
            <button
              type="button"
              className="btn btn-secondary w-100 mb-2"
              onClick={prevStep}
            >
              Atrás
            </button>
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={nextStep}
            >
              Continuar
            </button>
          </div>
        );

      case 15:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Luz Blanca</h3>
            <h6 className="text-center mb-4">15</h6>
            {renderLightInputForm("blanca", "Luz Blanca")}
            <button
              type="button"
              className="btn btn-secondary w-100 mb-2"
              onClick={prevStep}
            >
              Atrás
            </button>
            <button
              type="button"
              className="btn btn-success w-100"
              onClick={generarWord}
            >
              Generar Word
            </button>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div className="container mt-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="form-container"
      >
        {renderStep()}
      </form>
    </div>
  );
};

export default Formulario;
