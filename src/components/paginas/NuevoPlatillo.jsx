import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FirebaseContext } from "../../firebase";
import { useNavigate } from "react-router-dom";
import FileUploaded from "react-firebase-file-uploader";

const NuevoPlatillo = () => {
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [urlImagen, setUrlImagen] = useState("");

  // Context con operaciones de firebase
  const { firebase } = useContext(FirebaseContext);
  const navigate = useNavigate();

  //Validacion y leer datos
  const formik = useFormik({
    initialValues: {
      nombre: "",
      precio: "",
      categoria: "",
      imagen: "",
      descripcion: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
        .min(3, "Los platillos deben tener al menos 3 caracteres")
        .required("El nombre es obligatorio"),
      precio: Yup.number()
        .min(1, "Debes agregar un numero")
        .required("El precio es obligatorio"),
      categoria: Yup.string().required("La categoria es obligatoria"),
      descripcion: Yup.string()
        .min(10, "La descripcion debe ser mas larga")
        .required("La descripcion es obligatoria"),
    }),

    onSubmit: (platillo) => {
      try {
        platillo.existencia = true;
        platillo.imagen = urlImagen;
        firebase.db.collection("productos").add(platillo);
        navigate("/menu");
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleUploadStart = () => {
    setProgreso(0);
    setSubiendo(true);
  };
  const handleUploadError = (error) => {
    setSubiendo(false);
    console.log(error);
  };
  const handleUploadSuccess = async (nombre) => {
    setProgreso(100);
    setSubiendo(false);

    // Almacenar la url de destino
    const url = await firebase.storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL();
    console.log(url);
    setUrlImagen(url);
  };
  const handleProgress = (progreso) => {
    setProgreso(progreso);
    console.log(progreso);
  };

  return (
    <>
      <h1 className="text-3xl font-light mb-4">Agregar Platillo</h1>
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-3xl">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm mb-2"
                htmlFor="nombre"
              >
                Nombre
              </label>
              <input
                type="text"
                placeholder="Nombre platillo"
                name="nombre"
                id="nombre"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.nombre && formik.errors.nombre ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-4"
                role="alert"
              >
                <p className="font-bold">Hubo un error</p>
                <p>{formik.errors.nombre}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm mb-2"
                htmlFor="precio"
              >
                Precio
              </label>
              <input
                type="number"
                min="0"
                placeholder="$20"
                name="precio"
                id="precio"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                value={formik.values.precio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.precio && formik.errors.precio ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-4"
                role="alert"
              >
                <p className="font-bold">Hubo un error</p>
                <p>{formik.errors.precio}</p>
              </div>
            ) : null}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm mb-2"
                htmlFor="categoria"
              >
                Categoria
              </label>
              <select
                id="categoria"
                name="categoria"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                value={formik.values.categoria}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">-- Seleccione --</option>
                <option value="desayuno">Desayuno</option>
                <option value="comida">Comida</option>
                <option value="cena">Cena</option>
                <option value="bebida">Bebidas</option>
                <option value="postre">Postres</option>
                <option value="ensalada">Ensaladas</option>
              </select>
            </div>
            {formik.touched.categoria && formik.errors.categoria ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-4"
                role="alert"
              >
                <p className="font-bold">Hubo un error</p>
                <p>{formik.errors.categoria}</p>
              </div>
            ) : null}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm mb-2"
                htmlFor="precio"
              >
                Imagen
              </label>
              <FileUploaded
                accept="image/*"
                id="imagen"
                name="imagen"
                randomizeFilename
                storageRef={firebase.storage.ref("productos")}
                onUploadStart={handleUploadStart}
                onUploadError={handleUploadError}
                onUploadSuccess={handleUploadSuccess}
                onProgress={handleProgress}
              />
            </div>

            {subiendo && (
              <div className="h-12 relative border">
                <div
                  className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center"
                  style={{ width: `${progreso}%` }}
                >
                  {progreso} %
                </div>
              </div>
            )}

            {urlImagen && (
              <p className="bg-green-500 text-white p-3 text-center my-5">
                La imagen se subio correctamente
              </p>
            )}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm mb-2"
                htmlFor="descripcion"
              >
                Descripcion
              </label>
              <textarea
                type="text"
                placeholder="Descripcion del platillo"
                id="descripcion"
                className="shadow appearance-none h-40 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></textarea>
            </div>

            {formik.touched.descripcion && formik.errors.descripcion ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-4"
                role="alert"
              >
                <p className="font-bold">Hubo un error</p>
                <p>{formik.errors.descripcion}</p>
              </div>
            ) : null}

            <input
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white font-bold"
              value="Agregar Platillo"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default NuevoPlatillo;
