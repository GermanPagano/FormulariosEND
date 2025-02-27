import React, { useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import ImageModule from "docxtemplater-image-module-free";

const Formulario = () => {
  const [step, setStep] = useState(1); // Control del paso actual

  const obtenerFechaLocal = () => {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Meses comienzan en 0
    const año = fecha.getFullYear();
    return `${año}-${mes}-${dia}`;
  };
  const [formData, setFormData] = useState({
    fecha: obtenerFechaLocal(), // Fecha por defecto
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
    equipamiento: {
      columna1: {
        equipo: "",
        modelo: "",
        serie: "",
        vencimiento: "",
        frecuencia: "",
        ganancia: "",
      },
      columna2: {
        equipo: "",
        modelo: "",
        serie: "",
        vencimiento: "",
        frecuencia: "",
        ganancia: "",
      },
      columna3: {
        equipo: "",
        modelo: "",
        serie: "",
        vencimiento: "",
        frecuencia: "",
        ganancia: "",
      },
      columna4: {
        equipo: "",
        modelo: "",
        serie: "",
        vencimiento: "",
        frecuencia: "",
        ganancia: "",
      },
      columna5: {
        equipo: "",
        modelo: "",
        serie: "",
        vencimiento: "",
        frecuencia: "",
        ganancia: "",
      },
      columna6: {
        equipo: "",
        modelo: "",
        serie: "",
        vencimiento: "",
        frecuencia: "",
        ganancia: "",
      },
      columna7: {
        equipo: "",
        modelo: "",
        serie: "",
        vencimiento: "",
        frecuencia: "",
        ganancia: "",
      },
    },
    txtRdoEnsayo: "",
    resultadosImagen1: "",
    resultadosImagen2: "",
    imagendeltrabajo1: "",
    imagendeltrabajo2: "",
    imagendeltrabajo3: "",
    imagendeltrabajo4: "",
    imagendeltrabajo5: "",
    imagendeltrabajo6: "",
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

  const formatFecha = (fecha) => {
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const generarWord = async () => {
    const plantillaURL = `${process.env.PUBLIC_URL}/templates/plantilla.docx`;
    console.log("estoy por imprimir ", formData.resultadosImagen);
    try {
      const response = await fetch(plantillaURL);
      if (!response.ok) throw new Error("No se pudo cargar la plantilla");
      const content = await response.arrayBuffer();
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        modules: [loadImageModule()],
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "{{", end: "}}" },
      });

      // Renderizar los datos con renderAsync
      await doc.renderAsync({
        fecha: formatFecha(formData.fecha),
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
        liquidosPenetrantes: formData.tipoEnsayo.liquidosPenetrantes ? "█" : "",
        inspeccionVisual: formData.tipoEnsayo.inspeccionVisual ? "█" : "",
        particulasMagneticas: formData.tipoEnsayo.particulasMagneticas
          ? "█"
          : "",
        corrientesInducidas: formData.tipoEnsayo.corrientesInducidas ? "█" : "",
        dureza: formData.tipoEnsayo.dureza ? "█" : "",
        boroscopia: formData.tipoEnsayo.boroscopia ? "█" : "",
        ultrasonidos: formData.tipoEnsayo.ultrasonidos ? "█" : "",
        radiografia: formData.tipoEnsayo.radiografia ? "█" : "",
        procedimientoAplicable: formData.procedimientoAplicable || "N/A",
        metodo: formData.metodo || "N/A",
        removedorTipo: formData.materiales.removedor.tipo || "N/A",
        removedorLote: formData.materiales.removedor.lote || "N/A",
        removedorNivel: formData.materiales.removedor.nivel || "N/A",
        removedorVence: formData.materiales.removedor.vence || "N/A",
        penetranteTipo: formData.materiales.penetrante.tipo || "N/A",
        penetranteLote: formData.materiales.penetrante.lote || "N/A",
        penetranteNivel: formData.materiales.penetrante.nivel || "N/A",
        penetranteVence: formData.materiales.penetrante.vence || "N/A",
        particulasTipo: formData.materiales.particulas.tipo || "N/A",
        particulasLote: formData.materiales.particulas.lote || "N/A",
        particulasNivel: formData.materiales.particulas.nivel || "N/A",
        particulasVence: formData.materiales.particulas.vence || "N/A",
        acoplanteTipo: formData.materiales.acoplante.tipo || "N/A",
        acoplanteLote: formData.materiales.acoplante.lote || "N/A",
        acoplanteNivel: formData.materiales.acoplante.nivel || "N/A",
        acoplanteVence: formData.materiales.acoplante.vence || "N/A",
        emulsificadorTipo: formData.materiales.emulsificador.tipo || "N/A",
        emulsificadorLote: formData.materiales.emulsificador.lote || "N/A",
        emulsificadorVence: formData.materiales.emulsificador.vence || "N/A",
        reveladorTipo: formData.materiales.revelador.tipo || "N/A",
        reveladorLote: formData.materiales.revelador.lote || "N/A",
        reveladorVence: formData.materiales.revelador.vence || "N/A",
        placasTipo: formData.materiales.placas.tipo || "N/A",
        placasLote: formData.materiales.placas.lote || "N/A",
        placasVence: formData.materiales.placas.vence || "N/A",
        fijadorTipo: formData.materiales.fijador.tipo || "N/A",
        fijadorLote: formData.materiales.fijador.lote || "N/A",
        fijadorVence: formData.materiales.fijador.vence || "N/A",
        luzUltravioletaMedidor: formData.luces.ultravioleta.medidor || "N/A",
        luzUltravioletaModelo: formData.luces.ultravioleta.modelo || "N/A",
        luzUltravioletaSerie: formData.luces.ultravioleta.serie || "N/A",
        luzUltravioletaVencimiento:
          formData.luces.ultravioleta.vencimiento || "N/A",
        luzUltravioletaIntensidad:
          formData.luces.ultravioleta.intensidad || "N/A",
        ambientalMedidor: formData.luces.ambiental.medidor || "N/A",
        ambientalModelo: formData.luces.ambiental.modelo || "N/A",
        ambientalSerie: formData.luces.ambiental.serie || "N/A",
        ambientalVencimiento: formData.luces.ambiental.vencimiento || "N/A",
        ambientalIntensidad: formData.luces.ambiental.intensidad || "N/A",
        blancaMedidor: formData.luces.blanca.medidor || "N/A",
        blancaModelo: formData.luces.blanca.modelo || "N/A",
        blancaSerie: formData.luces.blanca.serie || "N/A",
        blancaVencimiento: formData.luces.blanca.vencimiento || "N/A",
        blancaIntensidad: formData.luces.blanca.intensidad || "N/A",

        // Equipamiento columna 1
        columna1Equipo: formData.equipamiento.columna1.equipo || "N/A",
        columna1Modelo: formData.equipamiento.columna1.modelo || "N/A",
        columna1Serie: formData.equipamiento.columna1.serie || "N/A",
        columna1Vencimiento:
          formData.equipamiento.columna1.vencimiento || "N/A",
        columna1Frecuencia: formData.equipamiento.columna1.frecuencia || "N/A",
        columna1Ganancia: formData.equipamiento.columna1.ganancia || "N/A",

        // Equipamiento columna 2
        columna2Equipo: formData.equipamiento.columna2.equipo || "N/A",
        columna2Modelo: formData.equipamiento.columna2.modelo || "N/A",
        columna2Serie: formData.equipamiento.columna2.serie || "N/A",
        columna2Vencimiento:
          formData.equipamiento.columna2.vencimiento || "N/A",
        columna2Frecuencia: formData.equipamiento.columna2.frecuencia || "N/A",
        columna2Ganancia: formData.equipamiento.columna2.ganancia || "N/A",

        // Equipamiento columna 3
        columna3Equipo: formData.equipamiento.columna3.equipo || "N/A",
        columna3Modelo: formData.equipamiento.columna3.modelo || "N/A",
        columna3Serie: formData.equipamiento.columna3.serie || "N/A",
        columna3Vencimiento:
          formData.equipamiento.columna3.vencimiento || "N/A",
        columna3Frecuencia: formData.equipamiento.columna3.frecuencia || "N/A",
        columna3Ganancia: formData.equipamiento.columna3.ganancia || "N/A",

        // Equipamiento columna 4
        columna4Equipo: formData.equipamiento.columna4.equipo || "N/A",
        columna4Modelo: formData.equipamiento.columna4.modelo || "N/A",
        columna4Serie: formData.equipamiento.columna4.serie || "N/A",
        columna4Vencimiento:
          formData.equipamiento.columna4.vencimiento || "N/A",
        columna4Frecuencia: formData.equipamiento.columna4.frecuencia || "N/A",
        columna4Ganancia: formData.equipamiento.columna4.ganancia || "N/A",

        // Equipamiento columna 5
        columna5Equipo: formData.equipamiento.columna5.equipo || "N/A",
        columna5Modelo: formData.equipamiento.columna5.modelo || "N/A",
        columna5Serie: formData.equipamiento.columna5.serie || "N/A",
        columna5Vencimiento:
          formData.equipamiento.columna5.vencimiento || "N/A",
        columna5Frecuencia: formData.equipamiento.columna5.frecuencia || "N/A",
        columna5Ganancia: formData.equipamiento.columna5.ganancia || "N/A",

        // Equipamiento columna 6
        columna6Equipo: formData.equipamiento.columna6.equipo || "N/A",
        columna6Modelo: formData.equipamiento.columna6.modelo || "N/A",
        columna6Serie: formData.equipamiento.columna6.serie || "N/A",
        columna6Vencimiento:
          formData.equipamiento.columna6.vencimiento || "N/A",
        columna6Frecuencia: formData.equipamiento.columna6.frecuencia || "N/A",
        columna6Ganancia: formData.equipamiento.columna6.ganancia || "N/A",

        // Equipamiento columna 7
        columna7Equipo: formData.equipamiento.columna7.equipo || "N/A",
        columna7Modelo: formData.equipamiento.columna7.modelo || "N/A",
        columna7Serie: formData.equipamiento.columna7.serie || "N/A",
        columna7Vencimiento:
          formData.equipamiento.columna7.vencimiento || "N/A",
        columna7Frecuencia: formData.equipamiento.columna7.frecuencia || "N/A",
        columna7Ganancia: formData.equipamiento.columna7.ganancia || "N/A",

        // PASO 23
        txtRdoEnsayo: formData.txtRdoEnsayo || "N/A",
        // TABLAS EN FORMATO IMG
        resultadosImagen1: formData.resultadosImagen1 || "",
        resultadosImagen2: formData.resultadosImagen2 || "",

        //IMAGENES DE SEGUNDA PAGINA
        img1: formData.imagendeltrabajo1 || "",
        img2: formData.imagendeltrabajo2 || "",
        img3: formData.imagendeltrabajo3 || "",
        img4: formData.imagendeltrabajo4 || "",
        img5: formData.imagendeltrabajo5 || "",
        img6: formData.imagendeltrabajo6 || "",
      });

      const blob = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      saveAs(blob, "informe.docx");
    } catch (error) {
      console.error("Error generando el documento:", error);
    }
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

  //manejador para los datos de la zona de equipamiento 7 columnas
  const handleEquipamientoChange = (e, columnKey) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      equipamiento: {
        ...prev.equipamiento,
        [columnKey]: {
          ...prev.equipamiento[columnKey],
          [name]: value,
        },
      },
    }));
  };

  //funcion que crea los input para la zona de equipamiento
  const renderEquipamientoForm = (columnKey, columnLabel) => {
    const equipamientoData = formData.equipamiento[columnKey] || {};

    return (
      <div className="mb-3">
        <h3 className="text-center mb-4">{columnLabel}</h3>
        <div className="mb-3">
          <label className="form-label">Equipo</label>
          <input
            type="text"
            className="form-control"
            name="equipo"
            placeholder="Ingrese el equipo"
            value={equipamientoData.equipo || ""}
            onChange={(e) => handleEquipamientoChange(e, columnKey)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Modelo</label>
          <input
            type="text"
            className="form-control"
            name="modelo"
            placeholder="Ingrese el modelo"
            value={equipamientoData.modelo || ""}
            onChange={(e) => handleEquipamientoChange(e, columnKey)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Serie</label>
          <input
            type="text"
            className="form-control"
            name="serie"
            placeholder="Ingrese la serie"
            value={equipamientoData.serie || ""}
            onChange={(e) => handleEquipamientoChange(e, columnKey)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Vencimiento</label>
          <input
            type="date"
            className="form-control"
            name="vencimiento"
            value={equipamientoData.vencimiento || ""}
            onChange={(e) => handleEquipamientoChange(e, columnKey)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Frecuencia</label>
          <input
            type="text"
            className="form-control"
            name="frecuencia"
            placeholder="Ingrese la frecuencia"
            value={equipamientoData.frecuencia || ""}
            onChange={(e) => handleEquipamientoChange(e, columnKey)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ganancia</label>
          <input
            type="text"
            className="form-control"
            name="ganancia"
            placeholder="Ingrese la ganancia"
            value={equipamientoData.ganancia || ""}
            onChange={(e) => handleEquipamientoChange(e, columnKey)}
          />
        </div>
      </div>
    );
  };

  //funcion que renderiza el textarea de los resultados
  const renderTxtareasResultadoEnsayo = () => {
    return (
      <div className="mb-3">
        <div className="mb-3">
          <label className="form-label">Indica los resultados del ensayo</label>
          <textarea
            className="form-control"
            name="txtRdoEnsayo"
            rows="3"
            placeholder="Ingrese el resultado"
            value={formData.txtRdoEnsayo}
            onChange={handleChange}
          />
        </div>
      </div>
    );
  };

  // cargar imagenes
  const [imagen1Cargada, setImagen1Cargada] = useState(false);
  const [imagen2Cargada, setImagen2Cargada] = useState(false);

  // Función para cargar una imagen y convertirla a base64
  const handleImageUpload = (e, imagenNumero) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          [imagenNumero === 1 ? "resultadosImagen1" : "resultadosImagen2"]:
            reader.result, // Guarda la imagen correspondiente
        }));

        if (imagenNumero === 1) {
          setImagen1Cargada(true);
        } else {
          setImagen2Cargada(true);
        }

        console.log(`Imagen ${imagenNumero} cargada:`, reader.result);
      };
      reader.onerror = (error) =>
        console.error(`Error al cargar la imagen ${imagenNumero}`, error);
    }
  };
  // Componente del Paso 23
  const Paso23 = () => (
    <div className="form-container shadow p-4 rounded">
      <p className="text-center">Carga tablas de información como imagenes</p>
      <div
        style={{
          border: "2px dashed #ccc",
          padding: "10px",
          textAlign: "center",
        }}
      >
        <p className="text-center">Tabla 1</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 1)} // Llama a la función para cargar la imagen
        />
        {imagen1Cargada && (
          <div style={{ marginTop: "10px" }}>
            <p style={{ color: "green", fontSize: "14px" }}>
              ✔ Imagen 1 cargada
            </p>
          </div>
        )}
      </div>

      <div
        style={{
          border: "2px dashed #ccc",
          padding: "10px",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        <p className="text-center">Tabla 2</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 2)} // Llama a la función para cargar la imagen
        />

        {imagen2Cargada && (
          <div style={{ marginTop: "10px" }}>
            <p style={{ color: "green", fontSize: "14px" }}>
              ✔ Imagen 2 cargada
            </p>
          </div>
        )}
      </div>
    </div>
  );
  const loadImageModule = () => {
    return new ImageModule({
      getImage: (tagValue) => {
        if (!tagValue) {
          throw new Error("No se ha proporcionado un valor para la imagen.");
        }

        // Validar si la imagen es base64 y tiene el formato correcto
        if (
          !tagValue.startsWith("data:image/png;base64,") &&
          !tagValue.startsWith("data:image/jpeg;base64,")
        ) {
          throw new Error("La imagen no tiene el formato base64 esperado.");
        }

        const base64Data = tagValue.split(",")[1]; // Elimina el prefijo 'data:image/png;base64,' o 'data:image/jpeg;base64,'

        // Verificar que se haya podido convertir correctamente
        if (!base64Data) {
          throw new Error("La imagen no se pudo decodificar correctamente.");
        }

        return Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
      },
      getSize: (img, tagValue, tagName) => {
        // Explicacion de como tratar los elementos que recibe el modulo de imagenes:
        // tagValue: este es el contenido base64 de la imagen
        // tagName: este es el name del elemento imagen, este elemento es el que vamos a utilizar para determinar el tamaño de la imagen, esto lo definis en el renderAsync de este mismo archivo

        // Aca vamos a loguear que incluye tagName para ver como esta cada elemento imagen
        console.log("Procesando imagen:", tagName);
        if (!tagValue) {
          return [0, 0]; // Retorna un tamaño de 0 si no hay imagen disponible
        }

        // Evaluar las condiciones solo si hay un valor de imagen
        if (tagName.includes("resultadosImagen")) {
          return [720, 100]; // Tamaño específico para imágenes 'resultadosImagen'
        } else if (tagName.includes("img")) {
          return [500, 300]; // Otro tamaño específico para 'img' que son las ultimas 6 (segun tagname son img1, img2, img3, img4, img5, img6)
        }

        // Si no se cumplen las condiciones anteriores, retornamos el tamaño por defecto, le pongo 720x720
        return [720, 720];
      },
    });
  };

  // Función para procesar y guardar las imágenes del trabajo
  const manejarCargaImagenTrabajo = (e, numeroImagen) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Actualizar formData con la imagen cargada
        setFormData((prev) => ({
          ...prev,
          [`imagendeltrabajo${numeroImagen}`]: reader.result,
        }));

        // Actualizar el estado de las imágenes cargadas
        setImagenesTrabajoCargadas((prev) => ({
          ...prev,
          [`imagen${numeroImagen}`]: true, // Indica que la imagen se cargó correctamente
        }));

        console.log(
          `Imagen del trabajo ${numeroImagen} cargada:`,
          reader.result
        );
      };
      reader.onerror = (error) =>
        console.error(
          `Error al cargar la imagen del trabajo ${numeroImagen}`,
          error
        );
    }
  };

  // Renderizar inputs para cargar las 6 imágenes del trabajo
  const renderizarInputsImagenTrabajo = () => {
    return Array.from({ length: 6 }).map((_, index) => {
      const numeroImagen = index + 1;
      return (
        <div key={numeroImagen} style={{ marginBottom: "10px" }}>
          <label>Cargar imagen del trabajo {numeroImagen}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => manejarCargaImagenTrabajo(e, numeroImagen)}
          />
          {imagenesTrabajoCargadas[`imagen${numeroImagen}`] && (
            <p style={{ color: "green", fontSize: "14px" }}>
              ✔ Imagen del trabajo {numeroImagen} cargada
            </p>
          )}
        </div>
      );
    });
  };

  const [imagenesTrabajoCargadas, setImagenesTrabajoCargadas] = useState({
    imagen1: false,
    imagen2: false,
    imagen3: false,
    imagen4: false,
    imagen5: false,
    imagen6: false,
  });

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
              className="btn btn-primary w-100"
              onClick={nextStep}
            >
              Continuar
            </button>
          </div>
        );

      case 16:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Equipamiento - Columna 1/7</h3>
            <h6 className="text-center mb-4">16</h6>
            {renderEquipamientoForm("columna1", "Columna 1")}
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

      case 17:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Equipamiento - Columna 2/7</h3>
            <h6 className="text-center mb-4">17</h6>
            {renderEquipamientoForm("columna2", "Columna 2")}
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

      case 18:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Equipamiento - Columna 3/7</h3>
            <h6 className="text-center mb-4">18</h6>
            {renderEquipamientoForm("columna3", "Columna 3")}
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

      case 19:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Equipamiento - Columna 4/7</h3>
            <h6 className="text-center mb-4">19</h6>
            {renderEquipamientoForm("columna4", "Columna 4")}
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

      case 20:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Equipamiento - Columna 5/7</h3>
            <h6 className="text-center mb-4">20</h6>
            {renderEquipamientoForm("columna5", "Columna 5")}
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
      case 21:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Equipamiento - Columna 6/7</h3>
            <h6 className="text-center mb-4">21</h6>
            {renderEquipamientoForm("columna6", "Columna 6")}
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
      case 22:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Equipamiento - Columna 7/7</h3>
            <h6 className="text-center mb-4">22</h6>
            {renderEquipamientoForm("columna7", "Columna 7")}
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

      case 23:
        return (
          <div className="form-container shadow p-4 rounded">
            <h3 className="text-center mb-4">Resultados del Ensayo</h3>
            <h6 className="text-center mb-4">23</h6>
            {renderTxtareasResultadoEnsayo()}
            <Paso23 />
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
      case 24:
        return (
          <div className="form-container shadow p-4 rounded">
            <p className="text-center">
              Carga imágenes del trabajo (6 en total)
            </p>
            {renderizarInputsImagenTrabajo()}

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
