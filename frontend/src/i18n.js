import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        nav: {
          albums: "Albums",
          login: "Login",
          myReviews: "My Reviews",
          adminAlbums: "Admin: Albums"
        },
        common: {
          loading: "Loading...",
          search: "Search",
          prev: "Prev",
          next: "Next",
          total: "Total",
          submit: "Submit",
          save: "Save",
          cancel: "Cancel",
          edit: "Edit",
          delete: "Delete",
          loginRequired: "Login required",
          forbiddenAdminOnly: "Forbidden (admin only)",
          page: "Page {{page}}"
        },
        album: {
          addReview: "Add Review",
          score: "Score",
          reviewText: "Review text",
          reviews: "Reviews"
        },
        admin: {
          title: "Admin: Albums",
          createAlbum: "Create album",
          editAlbum: "Edit album",
          albumCatalog: "Album catalog",
          deleteConfirm: "Delete this album? This will also delete its reviews."
        },
        auth: {
        login: "Login",
        email: "Email",
        password: "Password",
        loggedIn: "Logged in!",
        register: "Register",
        displayName: "Display name",
        registered: "Account created! You are now logged in."
        }
      }
    },
    es: {
      translation: {
        nav: {
          albums: "Álbumes",
          login: "Iniciar sesión",
          myReviews: "Mis reseñas",
          adminAlbums: "Admin: Álbumes"
        },
        common: {
          loading: "Cargando...",
          search: "Buscar",
          prev: "Anterior",
          next: "Siguiente",
          total: "Total",
          submit: "Enviar",
          save: "Guardar",
          cancel: "Cancelar",
          edit: "Editar",
          delete: "Eliminar",
          loginRequired: "Debes iniciar sesión",
          forbiddenAdminOnly: "Prohibido (solo admin)",
          page: "Página {{page}}"
        },
        album: {
          addReview: "Añadir reseña",
          score: "Puntuación",
          reviewText: "Texto de la reseña",
          reviews: "Reseñas"
        },
        admin: {
          title: "Admin: Álbumes",
          createAlbum: "Crear álbum",
          editAlbum: "Editar álbum",
          albumCatalog: "Catálogo",
          deleteConfirm: "¿Eliminar este álbum? También se eliminarán sus reseñas."
        },
        auth: {
        login: "Iniciar sesión",
        email: "Correo electrónico",
        password: "Contraseña",
        loggedIn: "Sesión iniciada",
        register: "Registrarse",
        displayName: "Nombre para mostrar",
        registered: "¡Cuenta creada! Has iniciado sesión."
        }

      }
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
